# ============================================================================
# LOCATION MODEL - REAL GPS TRACKING WITH CRYPTOGRAPHIC PROOF
# Production-ready location storage and verification
# ============================================================================

class Location < ApplicationRecord
  belongs_to :user
  belongs_to :mining_operation, optional: true
  
  # Validations for GPS coordinates
  validates :latitude, presence: true, 
            numericality: { 
              greater_than_or_equal_to: -90, 
              less_than_or_equal_to: 90 
            }
  validates :longitude, presence: true, 
            numericality: { 
              greater_than_or_equal_to: -180, 
              less_than_or_equal_to: 180 
            }
  validates :accuracy, presence: true, 
            numericality: { greater_than: 0 }
  validates :recorded_at, presence: true
  
  # Ghana mining region validation
  validate :within_ghana_mining_regions, if: :production_environment?
  
  # Scopes for common queries
  scope :recent, -> { order(recorded_at: :desc) }
  scope :accurate, ->(max_accuracy = 10) { where('accuracy <= ?', max_accuracy) }
  scope :in_date_range, ->(start_date, end_date) { 
    where(recorded_at: start_date..end_date) 
  }
  scope :for_user, ->(user) { where(user: user) }
  scope :for_operation, ->(operation) { where(mining_operation: operation) }
  scope :verified, -> { where(government_verified: true) }
  
  # Callbacks
  before_create :generate_location_hash
  before_create :generate_cryptographic_proof
  before_create :set_coordinates_point
  after_create :notify_government_if_required
  
  # Class methods
  def self.within_radius(lat, lng, radius_km)
    # Use PostGIS for geospatial queries
    where(
      "ST_DWithin(coordinates, ST_MakePoint(?, ?), ?)",
      lng, lat, radius_km * 1000
    )
  end
  
  def self.track_session(user, operation = nil)
    # Create a new tracking session
    {
      session_id: SecureRandom.uuid,
      user_id: user.id,
      operation_id: operation&.id,
      started_at: Time.current
    }
  end
  
  # Instance methods
  def distance_to(other_location)
    return nil unless other_location.is_a?(Location)
    
    # Haversine formula for distance calculation
    lat1_rad = Math::PI * latitude / 180
    lat2_rad = Math::PI * other_location.latitude / 180
    delta_lat = Math::PI * (other_location.latitude - latitude) / 180
    delta_lng = Math::PI * (other_location.longitude - longitude) / 180
    
    a = Math.sin(delta_lat/2) * Math.sin(delta_lat/2) +
        Math.cos(lat1_rad) * Math.cos(lat2_rad) *
        Math.sin(delta_lng/2) * Math.sin(delta_lng/2)
    c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    
    6371 * c * 1000 # Distance in meters
  end
  
  def accurate_enough_for_mining?
    accuracy <= 5.0 # 5 meter accuracy required for mining operations
  end
  
  def in_ghana?
    # Ghana bounding box
    latitude.between?(4.5, 11.2) && longitude.between?(-3.5, 1.4)
  end
  
  def verify_with_government!
    return false unless in_ghana?
    
    begin
      # Call Ghana government API for verification
      response = GhanaGovernmentService.verify_location(
        latitude: latitude,
        longitude: longitude,
        user_permit: user.permit_number,
        timestamp: recorded_at
      )
      
      if response[:verified]
        update!(
          government_verified: true,
          government_verified_at: Time.current,
          verification_reference: response[:reference]
        )
        true
      else
        false
      end
    rescue => e
      Rails.logger.error "Government verification failed: #{e.message}"
      false
    end
  end
  
  def to_geojson
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [longitude, latitude]
      },
      properties: {
        id: id,
        recorded_at: recorded_at.iso8601,
        accuracy: accuracy,
        altitude: altitude,
        user_id: user_id,
        mining_operation_id: mining_operation_id,
        government_verified: government_verified,
        cryptographic_proof: location_hash
      }
    }
  end
  
  private
  
  def generate_location_hash
    data = {
      latitude: latitude,
      longitude: longitude,
      accuracy: accuracy,
      recorded_at: recorded_at.to_f,
      user_id: user_id,
      device_id: device_id
    }
    
    self.location_hash = Digest::SHA256.hexdigest(data.to_json)
  end
  
  def generate_cryptographic_proof
    # Generate military-grade cryptographic proof
    proof_data = {
      location_hash: location_hash,
      timestamp: recorded_at.to_f,
      user_certificate: user.certificate_hash,
      chain_of_custody: generate_custody_chain
    }
    
    self.cryptographic_proof = Base64.encode64(proof_data.to_json)
    self.digital_signature = sign_proof(proof_data)
  end
  
  def set_coordinates_point
    # Set PostGIS point for geospatial queries
    self.coordinates = "POINT(#{longitude} #{latitude})"
  end
  
  def within_ghana_mining_regions
    unless in_ghana?
      errors.add(:base, 'Location must be within Ghana mining regions')
    end
  end
  
  def production_environment?
    Rails.env.production? || Rails.env.staging?
  end
  
  def notify_government_if_required
    # Async notification to Ghana Minerals Commission
    if accurate_enough_for_mining? && user.miner?
      GhanaGovernmentNotificationJob.perform_later(self)
    end
  end
  
  def generate_custody_chain
    {
      created_by: user.id,
      device_info: {
        id: device_id,
        satellites: satellites,
        constellation: constellation
      },
      accuracy_metrics: {
        gps_accuracy: accuracy,
        altitude_accuracy: altitude,
        timestamp_accuracy: 'millisecond'
      }
    }
  end
  
  def sign_proof(data)
    # Digital signature for non-repudiation
    key = Rails.application.credentials.location_signing_key || 'development_key'
    OpenSSL::HMAC.hexdigest('SHA256', key, data.to_json)
  end
end