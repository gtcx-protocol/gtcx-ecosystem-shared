class Api::V1::AuthenticationController < ApplicationController
  skip_before_action :authenticate_request, only: [:login, :register]
  
  def login
    user = User.find_by(email: login_params[:email])
    
    if user&.authenticate(login_params[:password])
      # Update login tracking
      user.update!(
        last_login_at: Time.current,
        last_login_ip: request.remote_ip
      )
      
      token = generate_token(user)
      render_success(
        {
          user: format_user_response(user),
          token: token,
          expires_at: 24.hours.from_now.iso8601
        },
        'Login successful'
      )
    else
      render_error('Invalid email or password', :unauthorized)
    end
  end
  
  def register
    user = User.new(register_params)
    user.status = :pending # Require approval for miners
    
    if user.save
      # Send verification emails
      UserMailer.welcome_email(user).deliver_later
      UserMailer.verify_email(user).deliver_later if user.email.present?
      
      # Notify administrators for approval
      AdminNotificationJob.perform_later(user) if user.miner?
      
      token = generate_token(user)
      render_success(
        {
          user: format_user_response(user),
          token: token,
          expires_at: 24.hours.from_now.iso8601
        },
        'Registration successful',
        :created
      )
    else
      render_error('Registration failed', :unprocessable_entity, user.errors.full_messages)
    end
  end
  
  def refresh
    token = generate_token(current_user)
    render_success(
      {
        token: token,
        expires_at: 24.hours.from_now.iso8601
      },
      'Token refreshed'
    )
  end
  
  def logout
    # In a production app, you would invalidate the token
    # by storing it in a blacklist or using a shorter-lived token
    render_success(nil, 'Logged out successfully')
  end
  
  private
  
  def login_params
    params.require(:user).permit(:email, :password)
  end
  
  def register_params
    params.require(:user).permit(
      :name, :email, :password, :phone, :role, :permit_number, :ghana_national_id
    )
  end
  
  def format_user_response(user)
    {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      permit_number: user.permit_number,
      wallet_balance: user.wallet_balance.to_f,
      email_verified: user.email_verified,
      phone_verified: user.phone_verified,
      created_at: user.created_at.iso8601,
      updated_at: user.updated_at.iso8601
    }
  end
  
  def generate_token(user)
    payload = {
      user_id: user.id,
      email: user.email,
      role: user.role,
      exp: 24.hours.from_now.to_i
    }
    
    JWT.encode(payload, Rails.application.credentials.secret_key_base, 'HS256')
  end
end