class CreateLocations < ActiveRecord::Migration[7.0]
  def change
    create_table :locations, id: :uuid, default: -> { "gen_random_uuid()" } do |t|
      t.references :user, null: false, foreign_key: true, type: :uuid
      t.references :mining_operation, null: true, foreign_key: true, type: :uuid
      
      # GPS Coordinates
      t.decimal :latitude, precision: 10, scale: 8, null: false
      t.decimal :longitude, precision: 11, scale: 8, null: false
      t.decimal :altitude, precision: 8, scale: 2
      t.decimal :accuracy, precision: 6, scale: 2, null: false
      t.decimal :speed, precision: 6, scale: 2
      t.decimal :heading, precision: 5, scale: 2
      
      # Timestamp and device info
      t.datetime :recorded_at, null: false
      t.string :device_id
      t.integer :satellites
      t.string :constellation, default: 'GPS'
      
      # Cryptographic proof
      t.text :location_hash
      t.text :cryptographic_proof
      t.text :digital_signature
      
      # Compliance and verification
      t.boolean :government_verified, default: false
      t.datetime :government_verified_at
      t.string :verification_reference
      
      # Geospatial indexing
      t.point :coordinates, geographic: true
      
      t.timestamps
    end
    
    # Geospatial indexes for performance
    add_index :locations, :coordinates, using: :gist
    add_index :locations, [:latitude, :longitude]
    add_index :locations, :recorded_at
    add_index :locations, :user_id
    add_index :locations, :mining_operation_id
    add_index :locations, :government_verified
    
    # Composite indexes for common queries
    add_index :locations, [:user_id, :recorded_at]
    add_index :locations, [:mining_operation_id, :recorded_at]
  end
end