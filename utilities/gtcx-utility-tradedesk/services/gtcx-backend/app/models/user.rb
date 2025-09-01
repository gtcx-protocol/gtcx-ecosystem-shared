class User < ApplicationRecord
  has_secure_password
  
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :name, presence: true
  validates :role, presence: true, inclusion: { in: %w[miner trader government_official inspector] }
  validates :phone, presence: true
  
  has_many :locations, dependent: :destroy
  has_many :mining_operations, dependent: :destroy
  has_many :gold_lots, dependent: :destroy
  has_many :payments, dependent: :destroy
  has_many :wallet_transactions, dependent: :destroy
  has_many :compliance_reports, dependent: :destroy
  
  enum status: {
    pending: 0,
    active: 1,
    suspended: 2,
    banned: 3
  }
  
  scope :miners, -> { where(role: 'miner') }
  scope :traders, -> { where(role: 'trader') }
  scope :officials, -> { where(role: ['government_official', 'inspector']) }
  
  def full_name
    name
  end
  
  def government_official?
    role.in?(['government_official', 'inspector'])
  end
  
  def can_access_mining_operations?
    role.in?(['miner', 'government_official', 'inspector'])
  end
  
  def can_trade_gold?
    role.in?(['trader', 'miner'])
  end
  
  def miner?
    role == 'miner'
  end
  
  def trader?
    role == 'trader'
  end
  
  def certificate_hash
    # Generate user certificate hash for cryptographic proof
    Digest::SHA256.hexdigest("#{id}-#{email}-#{created_at.to_f}")
  end
end