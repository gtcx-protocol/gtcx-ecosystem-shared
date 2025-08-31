class ApplicationController < ActionController::API
  include ActionController::HttpAuthentication::Token::ControllerMethods
  
  before_action :authenticate_request
  rescue_from StandardError, with: :handle_standard_error
  rescue_from ActiveRecord::RecordNotFound, with: :handle_not_found
  
  private
  
  def authenticate_request
    token = request.headers['Authorization']&.split(' ')&.last
    return render_unauthorized unless token
    
    begin
      decoded_token = JWT.decode(token, Rails.application.credentials.secret_key_base, true, { algorithm: 'HS256' })
      @current_user = User.find(decoded_token.first['user_id'])
    rescue JWT::DecodeError, ActiveRecord::RecordNotFound
      render_unauthorized
    end
  end
  
  def current_user
    @current_user
  end
  
  def render_success(data = nil, message = 'Success', status = :ok)
    render json: {
      success: true,
      message: message,
      data: data,
      timestamp: Time.current.iso8601
    }, status: status
  end
  
  def render_error(message, status = :unprocessable_entity, errors = nil)
    render json: {
      success: false,
      message: message,
      errors: errors,
      timestamp: Time.current.iso8601
    }, status: status
  end
  
  def render_unauthorized(message = 'Unauthorized access')
    render json: {
      success: false,
      message: message,
      timestamp: Time.current.iso8601
    }, status: :unauthorized
  end
  
  def handle_standard_error(exception)
    Rails.logger.error "#{exception.class}: #{exception.message}"
    Rails.logger.error exception.backtrace.join("\n")
    
    render_error('Internal server error', :internal_server_error)
  end
  
  def handle_not_found(exception)
    render_error('Resource not found', :not_found)
  end
end