# ============================================================================
# PAYMENTS CONTROLLER - GHANA MOBILE MONEY INTEGRATION
# Production-ready payment processing for MTN & Vodafone
# ============================================================================

class Api::V1::PaymentsController < ApplicationController
  before_action :set_payment, only: [:show, :cancel]
  
  # POST /api/v1/payments
  def create
    payment_data = {
      amount: payment_params[:amount],
      phone_number: payment_params[:phone_number],
      description: payment_params[:description],
      reference: generate_payment_reference,
      customer_name: current_user.name,
      user_id: current_user.id
    }
    
    # Create local payment record
    payment = current_user.payments.build({
      amount: payment_data[:amount],
      currency: 'GHS',
      phone_number: payment_data[:phone_number],
      description: payment_data[:description],
      reference: payment_data[:reference],
      status: 'pending',
      payment_type: payment_params[:payment_type] || 'mining_operation'
    })
    
    if payment.save
      # Process payment with appropriate provider
      result = GhanaPaymentService.process_payment(payment_data)
      
      # Update payment with provider response
      payment.update!(
        provider: result[:provider],
        provider_payment_id: result[:payment_id],
        provider_status: result[:status],
        provider_response: result[:provider_response]
      )
      
      if result[:success]
        render_success(
          format_payment_response(payment, result),
          'Payment initiated successfully',
          :created
        )
      else
        payment.update!(status: 'failed', failure_reason: result[:error])
        render_error(
          result[:error] || 'Payment processing failed',
          :unprocessable_entity,
          { provider: result[:provider] }
        )
      end
    else
      render_error(
        'Invalid payment data',
        :unprocessable_entity,
        payment.errors.full_messages
      )
    end
  end
  
  # GET /api/v1/payments
  def index
    payments = current_user.payments
                          .recent
                          .includes(:user)
                          .limit(params[:limit]&.to_i || 50)
    
    # Filter by status if provided
    if params[:status].present?
      payments = payments.where(status: params[:status])
    end
    
    # Filter by provider if provided
    if params[:provider].present?
      payments = payments.where(provider: params[:provider])
    end
    
    # Filter by date range if provided
    if params[:start_date] && params[:end_date]
      start_date = Date.parse(params[:start_date])
      end_date = Date.parse(params[:end_date])
      payments = payments.where(created_at: start_date..end_date)
    end
    
    render_success(
      payments.map { |payment| format_payment_response(payment) },
      'Payments retrieved successfully'
    )
  end
  
  # GET /api/v1/payments/:id
  def show
    render_success(
      format_payment_response(@payment),
      'Payment retrieved successfully'
    )
  end
  
  # POST /api/v1/payments/:id/check_status
  def check_status
    payment = current_user.payments.find(params[:id])
    
    if payment.provider.present? && payment.provider_payment_id.present?
      result = GhanaPaymentService.check_payment_status(
        payment.provider_payment_id,
        payment.provider
      )
      
      if result[:success]
        # Update payment status
        new_status = map_provider_status_to_local(result[:status])
        payment.update!(
          status: new_status,
          provider_status: result[:status],
          completed_at: new_status == 'completed' ? Time.current : nil
        )
        
        # Update user wallet if payment completed
        if new_status == 'completed' && payment.status != 'completed'
          update_user_wallet(payment)
        end
        
        render_success(
          format_payment_response(payment.reload, result),
          'Payment status updated'
        )
      else
        render_error(
          'Failed to check payment status',
          :service_unavailable,
          { error: result[:error] }
        )
      end
    else
      render_error('Payment not found or invalid', :not_found)
    end
  end
  
  # POST /api/v1/payments/:id/cancel
  def cancel
    if @payment.can_be_cancelled?
      @payment.update!(
        status: 'cancelled',
        cancelled_at: Time.current,
        cancellation_reason: params[:reason] || 'User requested cancellation'
      )
      
      render_success(
        format_payment_response(@payment),
        'Payment cancelled successfully'
      )
    else
      render_error(
        'Payment cannot be cancelled',
        :unprocessable_entity,
        { current_status: @payment.status }
      )
    end
  end
  
  # GET /api/v1/payments/stats
  def stats
    stats = {
      total_payments: current_user.payments.count,
      completed_payments: current_user.payments.completed.count,
      pending_payments: current_user.payments.pending.count,
      failed_payments: current_user.payments.failed.count,
      total_amount_paid: current_user.payments.completed.sum(:amount).to_f,
      this_month_payments: current_user.payments.this_month.count,
      this_month_amount: current_user.payments.this_month.completed.sum(:amount).to_f,
      favorite_provider: get_favorite_payment_provider,
      last_payment: current_user.payments.recent.first&.created_at
    }
    
    render_success(stats, 'Payment statistics retrieved')
  end
  
  # POST /api/v1/payments/mtn/callback
  def mtn_callback
    # Handle MTN Mobile Money webhook callbacks
    handle_payment_callback('mtn', params)
  end
  
  # POST /api/v1/payments/vodafone/callback
  def vodafone_callback
    # Handle Vodafone Cash webhook callbacks
    handle_payment_callback('vodafone', params)
  end
  
  # GET /api/v1/payments/providers/health
  def providers_health
    health_status = GhanaPaymentService.payment_providers_health
    
    render_success(
      {
        providers: health_status,
        overall_status: determine_overall_payment_health(health_status),
        last_checked: Time.current.iso8601
      },
      'Payment providers health status'
    )
  end
  
  private
  
  def set_payment
    @payment = current_user.payments.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render_error('Payment not found', :not_found)
  end
  
  def payment_params
    params.require(:payment).permit(
      :amount, :phone_number, :description, :payment_type, :mining_operation_id
    )
  end
  
  def generate_payment_reference
    "GTCX-#{Date.current.strftime('%Y%m%d')}-#{SecureRandom.hex(6).upcase}"
  end
  
  def format_payment_response(payment, provider_result = nil)
    response = {
      id: payment.id,
      reference: payment.reference,
      amount: payment.amount.to_f,
      currency: payment.currency,
      phone_number: payment.phone_number,
      description: payment.description,
      status: payment.status,
      provider: payment.provider,
      payment_type: payment.payment_type,
      created_at: payment.created_at.iso8601,
      updated_at: payment.updated_at.iso8601
    }
    
    # Add completion details if completed
    if payment.completed_at
      response[:completed_at] = payment.completed_at.iso8601
    end
    
    # Add cancellation details if cancelled
    if payment.cancelled_at
      response[:cancelled_at] = payment.cancelled_at.iso8601
      response[:cancellation_reason] = payment.cancellation_reason
    end
    
    # Add provider-specific details if available
    if provider_result
      response[:provider_details] = {
        provider_payment_id: payment.provider_payment_id,
        provider_status: provider_result[:status],
        provider_message: provider_result[:reason]
      }
    end
    
    response
  end
  
  def map_provider_status_to_local(provider_status)
    case provider_status&.downcase
    when 'successful', 'success', 'completed'
      'completed'
    when 'pending', 'processing'
      'pending'
    when 'failed', 'rejected', 'declined'
      'failed'
    when 'cancelled', 'canceled'
      'cancelled'
    else
      'pending'
    end
  end
  
  def update_user_wallet(payment)
    # Update user wallet balance after successful payment
    current_user.increment!(:wallet_balance, payment.amount)
    
    # Create wallet transaction record
    current_user.wallet_transactions.create!(
      amount: payment.amount,
      transaction_type: 'credit',
      description: "Mobile money deposit - #{payment.reference}",
      payment_id: payment.id
    )
    
    Rails.logger.info "Updated wallet for user #{current_user.id}: +#{payment.amount} GHS"
  end
  
  def get_favorite_payment_provider
    provider_counts = current_user.payments
                                 .completed
                                 .group(:provider)
                                 .count
    
    provider_counts.max_by { |_, count| count }&.first || 'none'
  end
  
  def handle_payment_callback(provider, callback_params)
    Rails.logger.info "#{provider.upcase} payment callback received: #{callback_params}"
    
    begin
      # Find payment by provider payment ID or reference
      payment = find_payment_from_callback(provider, callback_params)
      
      if payment
        # Update payment status based on callback
        update_payment_from_callback(payment, callback_params)
        
        render json: { status: 'success', message: 'Callback processed' }, status: :ok
      else
        Rails.logger.error "Payment not found for #{provider} callback: #{callback_params}"
        render json: { status: 'error', message: 'Payment not found' }, status: :not_found
      end
      
    rescue => e
      Rails.logger.error "#{provider.upcase} callback processing error: #{e.message}"
      render json: { status: 'error', message: 'Callback processing failed' }, status: :unprocessable_entity
    end
  end
  
  def find_payment_from_callback(provider, callback_params)
    case provider
    when 'mtn'
      # MTN sends externalId in callback
      external_id = callback_params[:externalId] || callback_params['externalId']
      Payment.find_by(reference: external_id, provider: 'mtn')
    when 'vodafone'
      # Vodafone sends merchantTransactionId in callback
      merchant_tx_id = callback_params[:merchantTransactionId] || callback_params['merchantTransactionId']
      Payment.find_by(reference: merchant_tx_id, provider: 'vodafone')
    end
  end
  
  def update_payment_from_callback(payment, callback_params)
    provider_status = callback_params[:status] || callback_params['status']
    new_status = map_provider_status_to_local(provider_status)
    
    payment.update!(
      status: new_status,
      provider_status: provider_status,
      completed_at: new_status == 'completed' ? Time.current : nil,
      provider_response: callback_params
    )
    
    # Update wallet if payment completed
    if new_status == 'completed' && payment.status_was != 'completed'
      update_user_wallet(payment)
    end
  end
  
  def determine_overall_payment_health(health_status)
    if health_status.values.all? { |status| status[:status] == 'available' }
      'fully_operational'
    elsif health_status.values.any? { |status| status[:status] == 'available' }
      'partially_operational'
    else
      'service_unavailable'
    end
  end
end