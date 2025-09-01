# ============================================================================
# LOCATIONS CONTROLLER - REAL GPS TRACKING API
# Production-ready location tracking with cryptographic proof
# ============================================================================

class Api::V1::LocationsController < ApplicationController
  before_action :set_location, only: [:show, :verify]
  before_action :validate_location_params, only: [:create, :track]
  
  # GET /api/v1/locations
  def index
    locations = current_user.locations
                           .recent
                           .includes(:mining_operation)
                           .limit(params[:limit]&.to_i || 100)
    
    # Filter by date range if provided
    if params[:start_date] && params[:end_date]
      start_date = Date.parse(params[:start_date])
      end_date = Date.parse(params[:end_date])
      locations = locations.in_date_range(start_date, end_date)
    end
    
    # Filter by accuracy if provided
    if params[:max_accuracy]
      locations = locations.accurate(params[:max_accuracy].to_f)
    end
    
    # Filter by mining operation if provided
    if params[:mining_operation_id]
      locations = locations.for_operation(params[:mining_operation_id])
    end
    
    render_success(
      locations.map { |location| format_location_response(location) },
      'Locations retrieved successfully'
    )
  end
  
  # GET /api/v1/locations/:id
  def show
    render_success(
      format_location_response(@location),
      'Location retrieved successfully'
    )
  end
  
  # GET /api/v1/locations/current
  def current
    latest_location = current_user.locations.recent.first
    
    if latest_location
      render_success(
        format_location_response(latest_location),
        'Current location retrieved'
      )
    else
      render_error('No location data found', :not_found)
    end
  end
  
  # POST /api/v1/locations
  def create
    location = current_user.locations.build(location_params)
    
    # Set mining operation if provided
    if params[:location][:mining_operation_id]
      operation = current_user.mining_operations.find(params[:location][:mining_operation_id])
      location.mining_operation = operation
    end
    
    if location.save
      # Trigger real-time notifications
      broadcast_location_update(location)
      
      # Queue government verification if needed
      verify_with_government_async(location) if should_verify_with_government?(location)
      
      render_success(
        format_location_response(location),
        'Location recorded successfully',
        :created
      )
    else
      render_error(
        'Failed to record location',
        :unprocessable_entity,
        location.errors.full_messages
      )
    end
  end
  
  # POST /api/v1/locations/track
  def track
    # Start or update location tracking session
    session_data = {
      user_id: current_user.id,
      operation_id: params[:operation_id],
      started_at: Time.current,
      tracking_active: params[:tracking] == true
    }
    
    # Store tracking session in cache
    Rails.cache.write("tracking_session_#{current_user.id}", session_data, expires_in: 8.hours)
    
    # Record the location if coordinates provided
    if location_params.present?
      location = current_user.locations.create!(location_params.merge(
        mining_operation_id: params[:operation_id],
        device_id: request.headers['X-Device-ID'] || 'unknown'
      ))
      
      render_success(
        {
          tracking_session: session_data,
          location: format_location_response(location)
        },
        'Location tracking started'
      )
    else
      render_success(
        { tracking_session: session_data },
        'Location tracking session updated'
      )
    end
  rescue => e
    Rails.logger.error "Location tracking error: #{e.message}"
    render_error('Failed to start location tracking', :unprocessable_entity)
  end
  
  # POST /api/v1/locations/:id/verify
  def verify
    if @location.verify_with_government!
      render_success(
        format_location_response(@location.reload),
        'Location verified with Ghana government'
      )
    else
      render_error('Government verification failed', :unprocessable_entity)
    end
  end
  
  # GET /api/v1/locations/stats
  def stats
    stats = {
      total_locations: current_user.locations.count,
      locations_today: current_user.locations.where('recorded_at >= ?', Date.current).count,
      locations_this_week: current_user.locations.where('recorded_at >= ?', 1.week.ago).count,
      verified_locations: current_user.locations.verified.count,
      average_accuracy: current_user.locations.average(:accuracy)&.round(2),
      most_recent: current_user.locations.recent.first&.recorded_at,
      tracking_sessions: get_tracking_sessions_count
    }
    
    render_success(stats, 'Location statistics retrieved')
  end
  
  # GET /api/v1/locations/export
  def export
    locations = current_user.locations.recent.limit(1000)
    
    case params[:format]&.downcase
    when 'geojson'
      export_geojson(locations)
    when 'csv'
      export_csv(locations)
    when 'gpx'
      export_gpx(locations)
    else
      render_error('Unsupported export format. Use: geojson, csv, or gpx', :bad_request)
    end
  end
  
  private
  
  def set_location
    @location = current_user.locations.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render_error('Location not found', :not_found)
  end
  
  def location_params
    params.require(:location).permit(
      :latitude, :longitude, :altitude, :accuracy, :speed, :heading,
      :recorded_at, :device_id, :satellites, :constellation
    ).tap do |permitted|
      # Convert recorded_at to proper datetime
      if permitted[:recorded_at].present?
        permitted[:recorded_at] = Time.at(permitted[:recorded_at].to_f / 1000.0)
      else
        permitted[:recorded_at] = Time.current
      end
    end
  end
  
  def validate_location_params
    return unless params[:location]
    
    lat = params[:location][:latitude]&.to_f
    lng = params[:location][:longitude]&.to_f
    accuracy = params[:location][:accuracy]&.to_f
    
    if lat.nil? || lng.nil?
      render_error('Latitude and longitude are required', :bad_request)
      return
    end
    
    unless lat.between?(-90, 90) && lng.between?(-180, 180)
      render_error('Invalid GPS coordinates', :bad_request)
      return
    end
    
    if accuracy && accuracy > 50
      render_error('GPS accuracy too low (> 50m). Please wait for better signal.', :bad_request)
      return
    end
  end
  
  def format_location_response(location)
    {
      id: location.id,
      latitude: location.latitude.to_f,
      longitude: location.longitude.to_f,
      altitude: location.altitude&.to_f,
      accuracy: location.accuracy.to_f,
      speed: location.speed&.to_f,
      heading: location.heading&.to_f,
      recorded_at: location.recorded_at.iso8601,
      device_id: location.device_id,
      satellites: location.satellites,
      constellation: location.constellation,
      government_verified: location.government_verified,
      government_verified_at: location.government_verified_at&.iso8601,
      mining_operation_id: location.mining_operation_id,
      location_hash: location.location_hash,
      created_at: location.created_at.iso8601
    }
  end
  
  def broadcast_location_update(location)
    # Real-time updates via WebSocket (if implemented)
    ActionCable.server.broadcast(
      "user_#{current_user.id}_locations",
      {
        type: 'location_update',
        location: format_location_response(location)
      }
    )
  rescue => e
    Rails.logger.warn "Failed to broadcast location update: #{e.message}"
  end
  
  def should_verify_with_government?(location)
    location.accurate_enough_for_mining? && 
    location.in_ghana? && 
    current_user.miner? &&
    !location.government_verified?
  end
  
  def verify_with_government_async(location)
    GhanaGovernmentVerificationJob.perform_later(location)
  end
  
  def get_tracking_sessions_count
    # Count unique tracking sessions in the last 30 days
    current_user.locations
                .where('recorded_at >= ?', 30.days.ago)
                .distinct
                .count(:device_id)
  end
  
  def export_geojson(locations)
    features = locations.map(&:to_geojson)
    
    geojson = {
      type: 'FeatureCollection',
      features: features,
      properties: {
        user_id: current_user.id,
        exported_at: Time.current.iso8601,
        total_locations: features.count
      }
    }
    
    render json: geojson
  end
  
  def export_csv(locations)
    require 'csv'
    
    csv_data = CSV.generate(headers: true) do |csv|
      csv << %w[id latitude longitude altitude accuracy recorded_at government_verified]
      
      locations.each do |location|
        csv << [
          location.id,
          location.latitude,
          location.longitude,
          location.altitude,
          location.accuracy,
          location.recorded_at.iso8601,
          location.government_verified
        ]
      end
    end
    
    render plain: csv_data, content_type: 'text/csv'
  end
  
  def export_gpx(locations)
    # Generate GPX format for GPS devices
    gpx_data = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n"
    gpx_data << "<gpx version=\"1.1\" creator=\"GTCX\">\n"
    gpx_data << "  <metadata>\n"
    gpx_data << "    <name>GTCX Mining Locations</name>\n"
    gpx_data << "    <desc>GPS tracking data from #{current_user.name}</desc>\n"
    gpx_data << "  </metadata>\n"
    gpx_data << "  <trk>\n"
    gpx_data << "    <name>Mining Track</name>\n"
    gpx_data << "    <trkseg>\n"
    
    locations.each do |location|
      gpx_data << "      <trkpt lat=\"#{location.latitude}\" lon=\"#{location.longitude}\">\n"
      gpx_data << "        <ele>#{location.altitude}</ele>\n" if location.altitude
      gpx_data << "        <time>#{location.recorded_at.iso8601}</time>\n"
      gpx_data << "      </trkpt>\n"
    end
    
    gpx_data << "    </trkseg>\n"
    gpx_data << "  </trk>\n"
    gpx_data << "</gpx>\n"
    
    render xml: gpx_data, content_type: 'application/gpx+xml'
  end
end