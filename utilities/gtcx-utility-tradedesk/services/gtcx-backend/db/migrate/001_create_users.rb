class CreateUsers < ActiveRecord::Migration[7.0]
  def change
    create_table :users do |t|
      t.string :name, null: false
      t.string :email, null: false, index: { unique: true }
      t.string :password_digest, null: false
      t.string :phone, null: false
      t.string :role, null: false, default: 'miner'
      t.string :permit_number
      t.integer :status, default: 0
      t.json :biometric_data
      t.json :verification_documents
      t.decimal :wallet_balance, precision: 15, scale: 2, default: 0.0
      
      t.timestamps
    end
    
    add_index :users, :role
    add_index :users, :permit_number
    add_index :users, :status
  end
end