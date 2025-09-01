class CreateUsers < ActiveRecord::Migration[7.0]
  def change
    create_table :users, id: :uuid, default: -> { "gen_random_uuid()" } do |t|
      t.string :name, null: false
      t.string :email, null: false, index: { unique: true }
      t.string :password_digest, null: false
      t.string :phone, null: false
      t.string :role, null: false, default: 'miner'
      t.string :permit_number, index: true
      t.integer :status, default: 0
      t.json :biometric_data
      t.json :verification_documents
      t.decimal :wallet_balance, precision: 15, scale: 2, default: 0.0
      t.string :ghana_national_id
      t.datetime :last_login_at
      t.inet :last_login_ip
      t.boolean :email_verified, default: false
      t.boolean :phone_verified, default: false
      
      t.timestamps
    end
    
    add_index :users, :role
    add_index :users, :permit_number
    add_index :users, :status
    add_index :users, :ghana_national_id
    add_index :users, :email_verified
  end
end