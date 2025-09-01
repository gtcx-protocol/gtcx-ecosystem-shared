# ============================================================================
# GHANA PAYMENT SERVICE - MTN MOBILE MONEY & VODAFONE CASH INTEGRATION
# Production-ready payment processing for Ghana mining operations
# ============================================================================

class GhanaPaymentService
  include HTTParty
  
  # Payment provider configurations
  MTN_BASE_URL = ENV.fetch('MTN_MOMO_API_URL', 'https://sandbox.momodeveloper.mtn.com')
  VODAFONE_BASE_URL = ENV.fetch('VODAFONE_CASH_API_URL', 'https://developer.vodafone.com.gh/v1')
  
  # ============================================================================
  # MTN MOBILE MONEY INTEGRATION
  # ============================================================================
  
  def self.process_mtn_payment(payment_request)
    Rails.logger.info "Processing MTN Mobile Money payment: #{payment_request[:reference]}"
    
    begin
      # Get MTN API token
      token = get_mtn_access_token
      
      # Create payment request
      response = HTTParty.post(
        "#{MTN_BASE_URL}/collection/v1_0/requesttopay",
        headers: mtn_headers(token),
        body: format_mtn_request(payment_request).to_json,
        timeout: 60
      )
      
      if response.success?
        parse_mtn_payment_response(response, payment_request)
      else
        handle_mtn_error(response)
      end
      
    rescue => e
      Rails.logger.error "MTN Mobile Money error: #{e.message}"
      { success: false, error: e.message, provider: 'mtn' }
    end
  end
  
  def self.check_mtn_payment_status(reference_id)
    Rails.logger.info "Checking MTN payment status: #{reference_id}"
    
    begin
      token = get_mtn_access_token
      
      response = HTTParty.get(
        "#{MTN_BASE_URL}/collection/v1_0/requesttopay/#{reference_id}",
        headers: mtn_headers(token),
        timeout: 30
      )
      
      if response.success?
        parse_mtn_status_response(response)
      else
        handle_mtn_error(response)
      end
      
    rescue => e
      Rails.logger.error "MTN status check error: #{e.message}"
      { success: false, error: e.message }
    end
  end
  
  # ============================================================================
  # VODAFONE CASH INTEGRATION
  # ============================================================================
  
  def self.process_vodafone_payment(payment_request)
    Rails.logger.info "Processing Vodafone Cash payment: #{payment_request[:reference]}"
    
    begin
      # Create payment request with Vodafone
      response = HTTParty.post(
        "#{VODAFONE_BASE_URL}/payments/request",
        headers: vodafone_headers,
        body: format_vodafone_request(payment_request).to_json,
        timeout: 60
      )
      
      if response.success?
        parse_vodafone_payment_response(response, payment_request)
      else
        handle_vodafone_error(response)
      end
      
    rescue => e
      Rails.logger.error "Vodafone Cash error: #{e.message}"
      { success: false, error: e.message, provider: 'vodafone' }
    end
  end
  
  def self.check_vodafone_payment_status(transaction_id)
    Rails.logger.info "Checking Vodafone payment status: #{transaction_id}"
    
    begin
      response = HTTParty.get(
        "#{VODAFONE_BASE_URL}/payments/status/#{transaction_id}",
        headers: vodafone_headers,
        timeout: 30
      )
      
      if response.success?
        parse_vodafone_status_response(response)
      else
        handle_vodafone_error(response)
      end
      
    rescue => e
      Rails.logger.error "Vodafone status check error: #{e.message}"
      { success: false, error: e.message }
    end
  end
  
  # ============================================================================
  # UNIFIED PAYMENT PROCESSING
  # ============================================================================
  
  def self.process_payment(payment_data)
    provider = detect_payment_provider(payment_data[:phone_number])
    
    case provider
    when 'mtn'
      process_mtn_payment(payment_data)
    when 'vodafone'
      process_vodafone_payment(payment_data)
    else
      Rails.logger.error "Unsupported payment provider for: #{payment_data[:phone_number]}"
      { 
        success: false, 
        error: 'Unsupported mobile network. Use MTN or Vodafone numbers.',
        provider: 'unknown'
      }
    end
  end
  
  def self.check_payment_status(payment_id, provider)
    case provider
    when 'mtn'
      check_mtn_payment_status(payment_id)
    when 'vodafone'
      check_vodafone_payment_status(payment_id)
    else
      { success: false, error: 'Unknown payment provider' }
    end
  end
  
  # ============================================================================
  # PRIVATE HELPER METHODS
  # ============================================================================
  
  private
  
  # MTN Mobile Money helpers
  def self.get_mtn_access_token
    Rails.cache.fetch('mtn_access_token', expires_in: 50.minutes) do
      response = HTTParty.post(
        "#{MTN_BASE_URL}/collection/token/",
        headers: {
          'Authorization' => "Basic #{mtn_basic_auth}",
          'Ocp-Apim-Subscription-Key' => ENV.fetch('MTN_SUBSCRIPTION_KEY', 'sandbox_key')
        },
        body: { grant_type: 'client_credentials' }
      )
      
      if response.success?
        response.parsed_response['access_token']
      else
        raise "Failed to get MTN access token: #{response.body}"
      end
    end
  end
  
  def self.mtn_basic_auth
    credentials = "#{ENV.fetch('MTN_USER_ID', 'sandbox_user')}:#{ENV.fetch('MTN_API_KEY', 'sandbox_key')}"
    Base64.strict_encode64(credentials)
  end
  
  def self.mtn_headers(token)
    {
      'Authorization' => "Bearer #{token}",
      'Content-Type' => 'application/json',
      'X-Reference-Id' => SecureRandom.uuid,
      'X-Target-Environment' => ENV.fetch('MTN_ENVIRONMENT', 'sandbox'),
      'Ocp-Apim-Subscription-Key' => ENV.fetch('MTN_SUBSCRIPTION_KEY', 'sandbox_key')
    }
  end
  
  def self.format_mtn_request(payment_request)
    {
      amount: payment_request[:amount].to_s,
      currency: 'GHS',
      externalId: payment_request[:reference],
      payer: {
        partyIdType: 'MSISDN',
        partyId: normalize_phone_number(payment_request[:phone_number])
      },
      payerMessage: payment_request[:description] || 'GTCX Mining Payment',
      payeeNote: "Mining operation payment - #{payment_request[:reference]}"
    }
  end
  
  def self.parse_mtn_payment_response(response, payment_request)
    {
      success: true,
      provider: 'mtn',
      payment_id: response.headers['x-reference-id'],
      status: 'pending',
      amount: payment_request[:amount],
      currency: 'GHS',
      phone_number: payment_request[:phone_number],
      reference: payment_request[:reference],
      provider_response: response.parsed_response
    }
  end
  
  def self.parse_mtn_status_response(response)
    data = response.parsed_response
    
    {
      success: true,
      status: data['status']&.downcase,
      amount: data['amount'],
      currency: data['currency'],
      reason: data['reason'],
      financial_transaction_id: data['financialTransactionId'],
      external_id: data['externalId']
    }
  end
  
  def self.handle_mtn_error(response)
    error_data = response.parsed_response rescue {}
    
    {
      success: false,
      provider: 'mtn',
      error: error_data['message'] || 'MTN Mobile Money payment failed',
      error_code: error_data['code'],
      http_status: response.code
    }
  end
  
  # Vodafone Cash helpers
  def self.vodafone_headers
    {
      'Authorization' => "Bearer #{ENV.fetch('VODAFONE_ACCESS_TOKEN', 'sandbox_token')}",
      'Content-Type' => 'application/json',
      'X-Client-Id' => ENV.fetch('VODAFONE_CLIENT_ID', 'gtcx_client'),
      'X-Client-Secret' => ENV.fetch('VODAFONE_CLIENT_SECRET', 'sandbox_secret')
    }
  end
  
  def self.format_vodafone_request(payment_request)
    {
      amount: {
        value: payment_request[:amount].to_f,
        currency: 'GHS'
      },
      customer: {
        phoneNumber: normalize_phone_number(payment_request[:phone_number]),
        firstName: payment_request[:customer_name]&.split(' ')&.first || 'Customer',
        lastName: payment_request[:customer_name]&.split(' ')&.last || 'Name'
      },
      merchantTransactionId: payment_request[:reference],
      description: payment_request[:description] || 'GTCX Mining Payment',
      callbackUrl: "#{ENV.fetch('BASE_URL', 'http://localhost:3000')}/api/v1/payments/vodafone/callback"
    }
  end
  
  def self.parse_vodafone_payment_response(response, payment_request)
    data = response.parsed_response
    
    {
      success: true,
      provider: 'vodafone',
      payment_id: data['transactionId'],
      status: data['status']&.downcase || 'pending',
      amount: payment_request[:amount],
      currency: 'GHS',
      phone_number: payment_request[:phone_number],
      reference: payment_request[:reference],
      provider_response: data
    }
  end
  
  def self.parse_vodafone_status_response(response)
    data = response.parsed_response
    
    {
      success: true,
      status: data['transactionStatus']&.downcase,
      amount: data['amount']['value'],
      currency: data['amount']['currency'],
      transaction_id: data['transactionId'],
      merchant_transaction_id: data['merchantTransactionId'],
      completion_time: data['completionTime']
    }
  end
  
  def self.handle_vodafone_error(response)
    error_data = response.parsed_response rescue {}
    
    {
      success: false,
      provider: 'vodafone',
      error: error_data['message'] || 'Vodafone Cash payment failed',
      error_code: error_data['errorCode'],
      http_status: response.code
    }
  end
  
  # Helper methods
  def self.detect_payment_provider(phone_number)
    normalized = normalize_phone_number(phone_number)
    
    # Ghana MTN prefixes: 024, 025, 053, 054, 055, 059
    mtn_prefixes = %w[233024 233025 233053 233054 233055 233059 024 025 053 054 055 059]
    
    # Ghana Vodafone prefixes: 020, 050, 027, 028, 026
    vodafone_prefixes = %w[233020 233050 233027 233028 233026 020 050 027 028 026]
    
    if mtn_prefixes.any? { |prefix| normalized.start_with?(prefix) }
      'mtn'
    elsif vodafone_prefixes.any? { |prefix| normalized.start_with?(prefix) }
      'vodafone'
    else
      'unknown'
    end
  end
  
  def self.normalize_phone_number(phone_number)
    # Remove all non-digit characters
    clean_number = phone_number.to_s.gsub(/\D/, '')
    
    # Add Ghana country code if missing
    if clean_number.length == 9 && clean_number.start_with?('0')
      clean_number = "233#{clean_number[1..-1]}"
    elsif clean_number.length == 10 && !clean_number.start_with?('233')
      clean_number = "233#{clean_number}"
    end
    
    clean_number
  end
  
  # Health check for payment providers
  def self.payment_providers_health
    {
      mtn: check_mtn_health,
      vodafone: check_vodafone_health
    }
  end
  
  def self.check_mtn_health
    begin
      get_mtn_access_token
      { status: 'available', last_checked: Time.current }
    rescue => e
      { status: 'unavailable', error: e.message, last_checked: Time.current }
    end
  end
  
  def self.check_vodafone_health
    begin
      response = HTTParty.get("#{VODAFONE_BASE_URL}/health", headers: vodafone_headers, timeout: 10)
      {
        status: response.success? ? 'available' : 'degraded',
        response_time: response.total_time,
        last_checked: Time.current
      }
    rescue => e
      { status: 'unavailable', error: e.message, last_checked: Time.current }
    end
  end
end