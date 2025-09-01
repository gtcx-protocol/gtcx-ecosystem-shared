class HealthController < ActionController::API
  # Health check endpoint for load balancers and monitoring
  def check
    health_status = {
      status: 'healthy',
      timestamp: Time.current.iso8601,
      version: '1.0.0',
      environment: Rails.env,
      database: database_health,
      services: services_health
    }

    render json: health_status, status: :ok
  rescue => e
    render json: {
      status: 'unhealthy',
      timestamp: Time.current.iso8601,
      error: e.message
    }, status: :service_unavailable
  end

  private

  def database_health
    ActiveRecord::Base.connection.execute('SELECT 1')
    {
      status: 'connected',
      pool_size: ActiveRecord::Base.connection.pool.size,
      active_connections: ActiveRecord::Base.connection.pool.connections.count
    }
  rescue => e
    {
      status: 'disconnected',
      error: e.message
    }
  end

  def services_health
    {
      redis: redis_health,
      external_apis: external_apis_health
    }
  end

  def redis_health
    if defined?(Redis)
      Redis.current.ping
      { status: 'connected' }
    else
      { status: 'not_configured' }
    end
  rescue => e
    { status: 'disconnected', error: e.message }
  end

  def external_apis_health
    {
      ghana_government: api_health_check(ENV['GHANA_MINERALS_API_URL']),
      mtn_momo: api_health_check(ENV['MTN_MOMO_API_URL'])
    }
  end

  def api_health_check(url)
    return { status: 'not_configured' } unless url

    begin
      response = Net::HTTP.get_response(URI(url))
      { 
        status: response.code.to_i < 500 ? 'available' : 'degraded',
        response_code: response.code
      }
    rescue => e
      { status: 'unavailable', error: e.message }
    end
  end
end