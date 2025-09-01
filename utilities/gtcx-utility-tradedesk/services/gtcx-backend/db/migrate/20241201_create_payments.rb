# ============================================================================
# PAYMENTS MIGRATION - GHANA MOBILE MONEY TABLES
# Production-ready payment tracking for MTN & Vodafone
# ============================================================================

class CreatePayments < ActiveRecord::Migration[7.0]
  def change
    create_table :payments do |t|
      # Core payment information
      t.references :user, null: false, foreign_key: true, index: true
      t.references :mining_operation, null: true, foreign_key: true, index: true
      
      # Payment identifiers
      t.string :reference, null: false, index: { unique: true }
      t.string :provider_payment_id, null: true, index: true
      
      # Amount and currency
      t.decimal :amount, precision: 10, scale: 2, null: false
      t.string :currency, null: false, default: 'GHS'
      
      # Customer information
      t.string :phone_number, null: false, index: true
      t.string :description, null: true
      
      # Payment status tracking
      t.string :status, null: false, default: 'pending', index: true
      t.string :payment_type, null: false, index: true
      
      # Provider information
      t.string :provider, null: true, index: true
      t.string :provider_status, null: true
      t.json :provider_response, null: true
      
      # Timing information
      t.datetime :processing_started_at, null: true
      t.datetime :completed_at, null: true, index: true
      t.datetime :failed_at, null: true
      t.datetime :cancelled_at, null: true
      t.datetime :expired_at, null: true
      t.datetime :expires_at, null: true, index: true
      t.decimal :processing_duration, precision: 8, scale: 2, null: true # in minutes
      
      # Failure and cancellation tracking
      t.text :failure_reason, null: true
      t.text :cancellation_reason, null: true
      
      # Government compliance (for mining payments)
      t.string :verification_reference, null: true
      t.boolean :government_verified, default: false, index: true
      t.datetime :government_verified_at, null: true
      
      # Audit fields
      t.timestamps null: false
      
      # Add database constraints
      t.index [:user_id, :created_at], name: 'index_payments_on_user_and_date'
      t.index [:provider, :status], name: 'index_payments_on_provider_and_status'
      t.index [:payment_type, :status], name: 'index_payments_on_type_and_status'
      t.index [:created_at], name: 'index_payments_on_created_at'
    end
    
    # Add check constraints
    execute <<-SQL
      ALTER TABLE payments ADD CONSTRAINT check_amount_positive 
      CHECK (amount > 0);
    SQL
    
    execute <<-SQL
      ALTER TABLE payments ADD CONSTRAINT check_currency_valid 
      CHECK (currency IN ('GHS', 'USD'));
    SQL
    
    execute <<-SQL
      ALTER TABLE payments ADD CONSTRAINT check_status_valid 
      CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled', 'expired'));
    SQL
    
    execute <<-SQL
      ALTER TABLE payments ADD CONSTRAINT check_provider_valid 
      CHECK (provider IS NULL OR provider IN ('mtn', 'vodafone'));
    SQL
    
    execute <<-SQL
      ALTER TABLE payments ADD CONSTRAINT check_payment_type_valid 
      CHECK (payment_type IN ('mining_operation', 'wallet_topup', 'permit_fee', 'compliance_fee', 'subscription'));
    SQL
  end
  
  def down
    drop_table :payments
  end
end