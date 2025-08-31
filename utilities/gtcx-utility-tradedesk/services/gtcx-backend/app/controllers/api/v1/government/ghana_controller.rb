# ============================================================================
# GHANA GOVERNMENT API CONTROLLER - REAL INTEGRATION ENDPOINTS
# Production-ready Ghana Minerals Commission integration
# ============================================================================

class Api::V1::Government::GhanaController < ApplicationController
  before_action :require_authentication
  before_action :validate_ghana_permissions, except: [:compliance_status]
  
  # POST /api/v1/government/verify_permit
  def verify_permit
    permit_number = params[:permit_number]&.strip&.upcase
    
    if permit_number.blank?
      render_error('Permit number is required', :bad_request)
      return
    end
    
    begin
      result = GhanaGovernmentService.verify_permit(permit_number)
      
      if result[:verified]
        # Log successful verification
        log_government_interaction('permit_verification', permit_number, result)
        
        render_success(
          {
            permit_verified: true,
            permit_details: result[:permit_details],
            verification_reference: result[:verification_reference],
            verified_at: result[:timestamp].iso8601
          },
          'Permit verified successfully with Ghana government'
        )
      else
        render_error(
          result[:error] || 'Permit verification failed',
          :unprocessable_entity,
          { verification_reference: result[:verification_reference] }
        )
      end
      
    rescue => e
      Rails.logger.error "Ghana permit verification error: #{e.message}"
      render_error('Government verification service temporarily unavailable', :service_unavailable)
    end
  end
  
  # POST /api/v1/government/submit_report
  def submit_report
    report_params = params.require(:report).permit(
      :type, :start_date, :end_date, :permit_number,
      location: [:latitude, :longitude, :description],
      activities: [],
      production: [:gold_extracted, :method, :equipment],
      environmental: [:water_usage, :land_impact, :restoration],
      safety: [:incidents, :training, :equipment_status]
    )
    
    begin
      # Validate report data
      validation_result = validate_compliance_report(report_params)
      unless validation_result[:valid]
        render_error('Invalid report data', :bad_request, validation_result[:errors])
        return
      end
      
      # Submit to Ghana government
      result = GhanaGovernmentService.submit_compliance_report(
        report_params.merge(user_id: current_user.id)
      )
      
      if result[:success]
        # Store submission record
        create_compliance_record(report_params, result)
        
        render_success(
          {
            report_submitted: true,
            report_id: result[:report_id],
            reference_number: result[:reference_number],
            status: result[:status],
            estimated_review_time: result[:estimated_review_time],
            next_steps: result[:next_steps]
          },
          'Compliance report submitted successfully to Ghana government'
        )
      else
        render_error(
          result[:error] || 'Report submission failed',
          :unprocessable_entity
        )
      end
      
    rescue => e
      Rails.logger.error "Ghana report submission error: #{e.message}"
      render_error('Government reporting service temporarily unavailable', :service_unavailable)
    end
  end
  
  # GET /api/v1/government/compliance_status/:permit_id
  def compliance_status
    permit_id = params[:permit_id]
    
    begin
      result = GhanaGovernmentService.get_compliance_status(permit_id)
      
      render_success(
        {
          permit_id: result[:permit_id],
          current_status: result[:status],
          compliance_score: result[:compliance_score],
          last_inspection: result[:last_inspection],
          next_requirement: result[:next_requirement],
          active_warnings: result[:warnings],
          checked_at: Time.current.iso8601
        },
        'Compliance status retrieved from Ghana government'
      )
      
    rescue => e
      Rails.logger.error "Ghana compliance status error: #{e.message}"
      render_error('Government status service temporarily unavailable', :service_unavailable)
    end
  end
  
  # POST /api/v1/government/register_operation
  def register_operation
    operation_params = params.require(:operation).permit(
      :name, :permit_number, :type, :duration, :area_description,
      :operator_name, :environmental_plan,
      coordinates: [:latitude, :longitude],
      contact_info: [:phone, :email, :address]
    )
    
    begin
      # Validate operation data
      validation_result = validate_operation_data(operation_params)
      unless validation_result[:valid]
        render_error('Invalid operation data', :bad_request, validation_result[:errors])
        return
      end
      
      # Register with Ghana government
      result = GhanaGovernmentService.register_mining_operation(operation_params)
      
      if result[:success]
        # Create local mining operation record
        mining_operation = create_mining_operation(operation_params, result)
        
        render_success(
          {
            operation_registered: true,
            local_operation_id: mining_operation.id,
            government_operation_id: result[:operation_id],
            government_reference: result[:government_reference],
            approval_status: result[:approval_status],
            operating_conditions: result[:conditions]
          },
          'Mining operation registered successfully with Ghana government'
        )
      else
        render_error(
          result[:error] || 'Operation registration failed',
          :unprocessable_entity
        )
      end
      
    rescue => e
      Rails.logger.error "Ghana operation registration error: #{e.message}"
      render_error('Government registration service temporarily unavailable', :service_unavailable)
    end
  end
  
  # PUT /api/v1/government/operation/:id/status
  def update_operation_status
    operation = current_user.mining_operations.find(params[:id])
    status_params = params.require(:status).permit(:status, :notes)
    
    begin
      result = GhanaGovernmentService.update_operation_status(
        operation.government_operation_id,
        {
          status: status_params[:status],
          user_id: current_user.id,
          notes: status_params[:notes]
        }
      )
      
      if result[:success]
        # Update local record
        operation.update!(
          status: status_params[:status],
          government_last_updated: result[:updated_at],
          government_acknowledgment: result[:acknowledgment]
        )
        
        render_success(
          {
            status_updated: true,
            new_status: result[:new_status],
            acknowledgment_number: result[:acknowledgment],
            updated_at: result[:updated_at]
          },
          'Operation status updated with Ghana government'
        )
      else
        render_error(
          result[:error] || 'Status update failed',
          :unprocessable_entity
        )
      end
      
    rescue ActiveRecord::RecordNotFound
      render_error('Mining operation not found', :not_found)
    rescue => e
      Rails.logger.error "Ghana status update error: #{e.message}"
      render_error('Government update service temporarily unavailable', :service_unavailable)
    end
  end
  
  # POST /api/v1/government/verify_identity
  def verify_identity
    identity_params = params.require(:identity).permit(
      :document_type, :document_number, :holder_name
    )
    
    begin
      result = GhanaGovernmentService.verify_identity_document({
        type: identity_params[:document_type],
        number: identity_params[:document_number],
        name: identity_params[:holder_name]
      })
      
      if result[:verified]
        # Update user verification status
        current_user.update!(
          ghana_national_id: identity_params[:document_number],
          identity_verified: true,
          identity_verified_at: Time.current
        )
        
        render_success(
          {
            identity_verified: true,
            identity_details: result[:identity_details],
            verification_level: result[:verification_level],
            verification_reference: result[:reference]
          },
          'Identity verified successfully with Ghana government'
        )
      else
        render_error(
          'Identity verification failed',
          :unprocessable_entity,
          { verification_reference: result[:reference] }
        )
      end
      
    rescue => e
      Rails.logger.error "Ghana identity verification error: #{e.message}"
      render_error('Government identity service temporarily unavailable', :service_unavailable)
    end
  end
  
  # GET /api/v1/government/api_health
  def api_health
    health_status = GhanaGovernmentService.api_health_check
    
    render_success(
      {
        ghana_government_api: health_status,
        integration_status: determine_integration_status(health_status),
        fallback_mode: health_status[:status] != 'available'
      },
      'Ghana government API health status'
    )
  end
  
  private
  
  def validate_ghana_permissions
    unless current_user.can_access_mining_operations?
      render_error('Insufficient permissions for Ghana government operations', :forbidden)
    end
  end
  
  def validate_compliance_report(report_params)
    errors = []
    
    errors << 'Report type is required' if report_params[:type].blank?
    errors << 'Permit number is required' if report_params[:permit_number].blank?
    errors << 'Start date is required' if report_params[:start_date].blank?
    errors << 'End date is required' if report_params[:end_date].blank?
    
    if report_params[:start_date].present? && report_params[:end_date].present?
      start_date = Date.parse(report_params[:start_date]) rescue nil
      end_date = Date.parse(report_params[:end_date]) rescue nil
      
      if start_date && end_date && start_date > end_date
        errors << 'Start date must be before end date'
      end
    end
    
    { valid: errors.empty?, errors: errors }
  end
  
  def validate_operation_data(operation_params)
    errors = []
    
    errors << 'Operation name is required' if operation_params[:name].blank?
    errors << 'Permit number is required' if operation_params[:permit_number].blank?
    errors << 'Operation type is required' if operation_params[:type].blank?
    errors << 'Operator name is required' if operation_params[:operator_name].blank?
    
    if operation_params[:coordinates].blank?
      errors << 'Operation coordinates are required'
    else
      lat = operation_params[:coordinates][:latitude]&.to_f
      lng = operation_params[:coordinates][:longitude]&.to_f
      
      unless lat&.between?(-90, 90) && lng&.between?(-180, 180)
        errors << 'Invalid coordinates provided'
      end
    end
    
    { valid: errors.empty?, errors: errors }
  end
  
  def log_government_interaction(interaction_type, reference, result)
    Rails.logger.info(
      "Ghana Government Interaction: #{interaction_type} " \
      "for #{reference} by user #{current_user.id} - " \
      "Result: #{result[:verified] ? 'SUCCESS' : 'FAILED'}"
    )
  end
  
  def create_compliance_record(report_params, result)
    # Create local record of compliance submission
    current_user.compliance_reports.create!(
      report_type: report_params[:type],
      permit_number: report_params[:permit_number],
      start_date: report_params[:start_date],
      end_date: report_params[:end_date],
      government_report_id: result[:report_id],
      government_reference: result[:reference_number],
      status: result[:status],
      submitted_at: Time.current
    )
  rescue => e
    Rails.logger.warn "Failed to create local compliance record: #{e.message}"
  end
  
  def create_mining_operation(operation_params, result)
    current_user.mining_operations.create!(
      name: operation_params[:name],
      permit_number: operation_params[:permit_number],
      operation_type: operation_params[:type],
      status: result[:approval_status],
      government_operation_id: result[:operation_id],
      government_reference: result[:government_reference],
      coordinates: operation_params[:coordinates],
      operator_name: operation_params[:operator_name],
      area_description: operation_params[:area_description],
      environmental_plan: operation_params[:environmental_plan],
      contact_info: operation_params[:contact_info]
    )
  end
  
  def determine_integration_status(health_status)
    case health_status[:status]
    when 'available'
      'fully_operational'
    when 'degraded'
      'limited_functionality'
    when 'unavailable'
      'fallback_mode_active'
    else
      'unknown'
    end
  end
end