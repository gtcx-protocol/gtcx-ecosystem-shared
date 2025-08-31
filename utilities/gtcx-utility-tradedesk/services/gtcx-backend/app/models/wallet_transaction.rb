# ============================================================================
# WALLET TRANSACTION MODEL - USER WALLET MANAGEMENT
# Production-ready financial transaction tracking
# ============================================================================

class WalletTransaction < ApplicationRecord
  belongs_to :user
  belongs_to :payment, optional: true
  belongs_to :mining_operation, optional: true
  
  # Validations
  validates :amount, presence: true, numericality: { not_equal_to: 0 }
  validates :currency, presence: true, inclusion: { in: %w[GHS USD] }
  validates :transaction_type, presence: true
  validates :description, presence: true
  
  # Transaction type validation
  validates :transaction_type, inclusion: { 
    in: %w[credit debit pending_credit pending_debit refund fee bonus]
  }
  
  # Amount validation based on transaction type
  validate :amount_sign_matches_type
  
  # Scopes
  scope :recent, -> { order(created_at: :desc) }
  scope :credits, -> { where(transaction_type: ['credit', 'pending_credit', 'refund', 'bonus']) }
  scope :debits, -> { where(transaction_type: ['debit', 'pending_debit', 'fee']) }
  scope :completed, -> { where(transaction_type: ['credit', 'debit', 'refund', 'fee', 'bonus']) }
  scope :pending, -> { where(transaction_type: ['pending_credit', 'pending_debit']) }
  scope :this_month, -> { where('created_at >= ?', Date.current.beginning_of_month) }
  scope :this_week, -> { where('created_at >= ?', Date.current.beginning_of_week) }
  scope :by_type, ->(type) { where(transaction_type: type) }
  scope :government_reportable, -> { where(government_reportable: true) }
  
  # Callbacks
  before_create :set_balance_snapshot
  after_create :update_user_wallet
  after_update :handle_status_changes, if: :saved_change_to_transaction_type?
  
  # Instance methods
  def is_credit?
    %w[credit pending_credit refund bonus].include?(transaction_type)
  end
  
  def is_debit?
    %w[debit pending_debit fee].include?(transaction_type)
  end
  
  def is_pending?
    transaction_type.start_with?('pending_')
  end
  
  def is_completed?
    !is_pending?
  end
  
  def formatted_amount
    sign = is_credit? ? '+' : '-'
    "#{sign}#{currency} #{amount.abs.to_f}"
  end
  
  def transaction_type_display
    case transaction_type
    when 'credit'
      'Wallet Credit'
    when 'debit'
      'Wallet Debit'
    when 'pending_credit'
      'Pending Credit'
    when 'pending_debit'
      'Pending Debit'
    when 'refund'
      'Refund'
    when 'fee'
      'Service Fee'
    when 'bonus'
      'Bonus'
    else
      transaction_type.humanize
    end
  end
  
  def related_payment_info
    return nil unless payment
    
    {
      reference: payment.reference,
      provider: payment.provider_display_name,
      status: payment.status,
      created_at: payment.created_at
    }
  end
  
  def confirm_pending_transaction!
    return false unless is_pending?
    
    new_type = case transaction_type
               when 'pending_credit'
                 'credit'
               when 'pending_debit'
                 'debit'
               else
                 transaction_type
               end
    
    update!(transaction_type: new_type)
    true
  end
  
  def cancel_pending_transaction!
    return false unless is_pending?
    
    # Reverse the balance change
    if is_credit?
      user.decrement!(:wallet_balance, amount.abs)
    else
      user.increment!(:wallet_balance, amount.abs)
    end
    
    # Update description to show cancellation
    update!(
      description: "#{description} (CANCELLED)",
      metadata: (metadata || {}).merge({
        cancelled_at: Time.current,
        original_type: transaction_type
      })
    )
    
    destroy
    true
  end
  
  # Class methods
  def self.daily_volume(days = 30)
    completed
      .where('created_at >= ?', days.days.ago)
      .group_by_day(:created_at)
      .group(:transaction_type)
      .sum(:amount)
  end
  
  def self.monthly_summary(user_id)
    transactions = where(user_id: user_id)
                  .where('created_at >= ?', Date.current.beginning_of_month)
                  .completed
    
    {
      total_credits: transactions.credits.sum(:amount),
      total_debits: transactions.debits.sum(:amount).abs,
      net_change: transactions.sum(:amount),
      transaction_count: transactions.count,
      largest_credit: transactions.credits.maximum(:amount) || 0,
      largest_debit: transactions.debits.minimum(:amount)&.abs || 0
    }
  end
  
  def self.balance_history(user_id, days = 30)
    # Get daily balance snapshots
    where(user_id: user_id)
      .where('created_at >= ?', days.days.ago)
      .order(:created_at)
      .pluck(:created_at, :balance_after)
      .map { |date, balance| [date.to_date, balance.to_f] }
      .group_by(&:first)
      .map { |date, entries| [date, entries.last.last] }
      .sort_by(&:first)
  end
  
  private
  
  def amount_sign_matches_type
    if is_credit? && amount < 0
      errors.add(:amount, 'must be positive for credit transactions')
    elsif is_debit? && amount > 0
      errors.add(:amount, 'must be negative for debit transactions')
    end
  end
  
  def set_balance_snapshot
    self.balance_before = user.wallet_balance.to_f
    
    # Calculate new balance
    if is_credit?
      self.balance_after = balance_before + amount.abs
    else
      self.balance_after = balance_before - amount.abs
    end
    
    # Set currency if not specified
    self.currency ||= 'GHS'
    
    # Set reference if not provided
    self.reference ||= generate_transaction_reference
  end
  
  def update_user_wallet
    return if is_pending?
    
    # Update user's wallet balance
    if is_credit?
      user.increment!(:wallet_balance, amount.abs)
    else
      user.decrement!(:wallet_balance, amount.abs)
    end
    
    # Update wallet timestamp
    user.update_column(:wallet_updated_at, Time.current)
    
    Rails.logger.info "Updated wallet for user #{user.id}: #{formatted_amount} (New balance: #{user.wallet_balance})"
  end
  
  def handle_status_changes
    if transaction_type_changed? && transaction_type_was.start_with?('pending_')
      # Transaction was confirmed from pending state
      Rails.logger.info "Wallet transaction confirmed: #{id} - #{formatted_amount}"
      
      # Send notification if it's a significant amount
      if amount.abs >= 50 # 50 GHS threshold
        WalletNotificationJob.perform_later(self, 'confirmed')
      end
    end
  end
  
  def generate_transaction_reference
    timestamp = Time.current.strftime('%Y%m%d%H%M%S')
    random = SecureRandom.hex(3).upcase
    "WTX-#{timestamp}-#{random}"
  end
end