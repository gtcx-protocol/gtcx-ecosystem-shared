# ============================================================================
# PAYMENT MODEL - GHANA MOBILE MONEY TRANSACTIONS
# Production-ready payment tracking and wallet management
# ============================================================================

class Payment < ApplicationRecord
  belongs_to :user
  belongs_to :mining_operation, optional: true
  has_many :wallet_transactions, dependent: :destroy
  
  # Validations
  validates :reference, presence: true, uniqueness: true
  validates :amount, presence: true, numericality: { greater_than: 0 }
  validates :currency, presence: true, inclusion: { in: %w[GHS USD] }
  validates :phone_number, presence: true
  validates :status, presence: true
  validates :payment_type, presence: true
  
  # Phone number validation for Ghana
  validates :phone_number, format: { 
    with: /\A(?:\+233|233|0)?[2-5][0-9]{8}\z/,
    message: 'must be a valid Ghana mobile number'
  }
  
  # Amount validation (minimum 1 GHS, maximum 10,000 GHS per transaction)
  validates :amount, numericality: { 
    greater_than_or_equal_to: 1,
    less_than_or_equal_to: 10000
  }
  
  # Status validation
  validates :status, inclusion: { 
    in: %w[pending processing completed failed cancelled expired]
  }
  
  # Provider validation
  validates :provider, inclusion: { 
    in: %w[mtn vodafone], 
    allow_nil: true 
  }
  
  # Payment type validation
  validates :payment_type, inclusion: { 
    in: %w[mining_operation wallet_topup permit_fee compliance_fee subscription]
  }
  
  # Scopes for common queries
  scope :recent, -> { order(created_at: :desc) }
  scope :pending, -> { where(status: 'pending') }
  scope :processing, -> { where(status: 'processing') }
  scope :completed, -> { where(status: 'completed') }
  scope :failed, -> { where(status: 'failed') }
  scope :cancelled, -> { where(status: 'cancelled') }
  scope :this_month, -> { where('created_at >= ?', Date.current.beginning_of_month) }
  scope :this_week, -> { where('created_at >= ?', Date.current.beginning_of_week) }
  scope :by_provider, ->(provider) { where(provider: provider) }
  scope :by_type, ->(type) { where(payment_type: type) }
  
  # Callbacks
  before_create :set_defaults
  before_update :track_status_changes
  after_update :handle_completion, if: :saved_change_to_status?
  
  # Instance methods
  def can_be_cancelled?
    %w[pending processing].include?(status) && 
    created_at > 5.minutes.ago
  end
  
  def is_expired?
    status == 'pending' && created_at < 30.minutes.ago
  end
  
  def provider_display_name
    case provider
    when 'mtn'
      'MTN Mobile Money'
    when 'vodafone'
      'Vodafone Cash'
    else
      'Unknown Provider'
    end
  end
  
  def formatted_amount
    "#{currency} #{amount.to_f}"
  end
  
  def formatted_phone_number
    return phone_number unless phone_number
    
    # Format Ghana phone numbers nicely
    clean = phone_number.gsub(/\D/, '')
    
    if clean.start_with?('233')
      "+#{clean[0..2]} #{clean[3..5]} #{clean[6..8]} #{clean[9..11]}"
    elsif clean.start_with?('0')
      "0#{clean[1..2]} #{clean[3..5]} #{clean[6..8]}"
    else
      phone_number
    end
  end
  
  def time_until_expiry
    return nil unless status == 'pending'
    
    expiry_time = created_at + 30.minutes
    seconds_left = expiry_time - Time.current
    
    if seconds_left > 0
      minutes = (seconds_left / 60).round
      "#{minutes} minute#{'s' if minutes != 1} remaining"
    else
      'Expired'
    end
  end
  
  def success_rate_for_provider
    return 0 if provider.blank?
    
    total_payments = user.payments.by_provider(provider).count
    successful_payments = user.payments.by_provider(provider).completed.count
    
    return 0 if total_payments == 0
    
    (successful_payments.to_f / total_payments * 100).round(1)
  end
  
  def to_wallet_transaction_data
    {
      amount: amount,
      transaction_type: status == 'completed' ? 'credit' : 'pending_credit',
      description: "#{provider_display_name} - #{description}",
      reference: reference,
      payment_id: id
    }
  end
  
  # Class methods
  def self.total_volume_by_provider
    completed.group(:provider).sum(:amount)
  end
  
  def self.success_rate_by_provider
    providers = %w[mtn vodafone]
    
    providers.map do |provider|
      total = by_provider(provider).count
      successful = by_provider(provider).completed.count
      
      rate = total > 0 ? (successful.to_f / total * 100).round(1) : 0
      
      [provider, { total: total, successful: successful, rate: rate }]
    end.to_h
  end
  
  def self.daily_volume(days = 30)
    completed
      .where('created_at >= ?', days.days.ago)
      .group_by_day(:created_at)
      .sum(:amount)
  end
  
  def self.expire_pending_payments!
    # Auto-expire payments that are pending for more than 30 minutes
    expired_count = where(status: 'pending')
                   .where('created_at < ?', 30.minutes.ago)
                   .update_all(
                     status: 'expired',
                     updated_at: Time.current
                   )
    
    Rails.logger.info "Auto-expired #{expired_count} pending payments" if expired_count > 0
    expired_count
  end
  
  private
  
  def set_defaults
    self.currency ||= 'GHS'
    self.status ||= 'pending'
    self.created_at ||= Time.current
    
    # Set expiry time for pending payments
    if status == 'pending'
      self.expires_at = created_at + 30.minutes
    end
  end
  
  def track_status_changes
    if status_changed?
      Rails.logger.info "Payment #{reference} status changed: #{status_was} -> #{status}"
      
      # Record status change timestamp
      case status
      when 'processing'
        self.processing_started_at = Time.current
      when 'completed'
        self.completed_at = Time.current
        self.processing_duration = calculate_processing_duration
      when 'failed'
        self.failed_at = Time.current
        self.processing_duration = calculate_processing_duration
      when 'cancelled'
        self.cancelled_at = Time.current
      when 'expired'
        self.expired_at = Time.current
      end
    end
  end
  
  def handle_completion
    case status
    when 'completed'
      handle_successful_payment
    when 'failed'
      handle_failed_payment
    when 'expired'
      handle_expired_payment
    end
  end
  
  def handle_successful_payment
    Rails.logger.info "Payment completed successfully: #{reference} - #{formatted_amount}"
    
    # Send success notification
    PaymentNotificationJob.perform_later(self, 'completed')
    
    # Update mining operation if applicable
    if mining_operation.present?
      mining_operation.mark_payment_completed!(self)
    end
  end
  
  def handle_failed_payment
    Rails.logger.warn "Payment failed: #{reference} - #{failure_reason}"
    
    # Send failure notification
    PaymentNotificationJob.perform_later(self, 'failed')
  end
  
  def handle_expired_payment
    Rails.logger.warn "Payment expired: #{reference}"
    
    # Send expiry notification
    PaymentNotificationJob.perform_later(self, 'expired')
  end
  
  def calculate_processing_duration
    return nil unless processing_started_at
    
    ((Time.current - processing_started_at) / 1.minute).round(2)
  end
end