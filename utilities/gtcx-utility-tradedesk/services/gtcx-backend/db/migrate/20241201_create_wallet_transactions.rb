# ============================================================================
# WALLET TRANSACTIONS MIGRATION - USER WALLET MANAGEMENT
# Production-ready wallet system for Ghana miners
# ============================================================================

class CreateWalletTransactions < ActiveRecord::Migration[7.0]
  def change
    create_table :wallet_transactions do |t|
      # Core transaction information
      t.references :user, null: false, foreign_key: true, index: true
      t.references :payment, null: true, foreign_key: true, index: true
      
      # Transaction details
      t.decimal :amount, precision: 10, scale: 2, null: false
      t.string :currency, null: false, default: 'GHS'
      t.string :transaction_type, null: false, index: true
      
      # Description and reference
      t.text :description, null: false
      t.string :reference, null: true, index: true
      
      # Balance tracking
      t.decimal :balance_before, precision: 10, scale: 2, null: true
      t.decimal :balance_after, precision: 10, scale: 2, null: true
      
      # Related records
      t.references :mining_operation, null: true, foreign_key: true, index: true
      
      # Audit and compliance
      t.json :metadata, null: true
      t.boolean :government_reportable, default: false, index: true
      
      # Timing
      t.timestamps null: false
      
      # Indexes for performance
      t.index [:user_id, :created_at], name: 'index_wallet_transactions_on_user_and_date'
      t.index [:transaction_type, :created_at], name: 'index_wallet_transactions_on_type_and_date'
      t.index [:created_at], name: 'index_wallet_transactions_on_created_at'
    end
    
    # Add check constraints
    execute <<-SQL
      ALTER TABLE wallet_transactions ADD CONSTRAINT check_amount_not_zero 
      CHECK (amount != 0);
    SQL
    
    execute <<-SQL
      ALTER TABLE wallet_transactions ADD CONSTRAINT check_currency_valid 
      CHECK (currency IN ('GHS', 'USD'));
    SQL
    
    execute <<-SQL
      ALTER TABLE wallet_transactions ADD CONSTRAINT check_transaction_type_valid 
      CHECK (transaction_type IN ('credit', 'debit', 'pending_credit', 'pending_debit', 'refund', 'fee', 'bonus'));
    SQL
    
    # Add wallet_balance column to users table if it doesn't exist
    unless column_exists?(:users, :wallet_balance)
      add_column :users, :wallet_balance, :decimal, precision: 10, scale: 2, default: 0.0, null: false
      add_index :users, :wallet_balance, name: 'index_users_on_wallet_balance'
      
      execute <<-SQL
        ALTER TABLE users ADD CONSTRAINT check_wallet_balance_non_negative 
        CHECK (wallet_balance >= 0);
      SQL
    end
    
    # Add wallet_updated_at to track last wallet activity
    unless column_exists?(:users, :wallet_updated_at)
      add_column :users, :wallet_updated_at, :datetime, null: true
      add_index :users, :wallet_updated_at, name: 'index_users_on_wallet_updated_at'
    end
  end
  
  def down
    drop_table :wallet_transactions
    
    if column_exists?(:users, :wallet_balance)
      remove_column :users, :wallet_balance
    end
    
    if column_exists?(:users, :wallet_updated_at)
      remove_column :users, :wallet_updated_at
    end
  end
end