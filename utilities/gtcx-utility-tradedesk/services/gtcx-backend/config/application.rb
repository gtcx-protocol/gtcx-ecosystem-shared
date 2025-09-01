require_relative 'boot'

require 'rails'
require 'active_model/railtie'
require 'active_job/railtie'
require 'active_record/railtie'
require 'action_controller/railtie'
require 'action_mailer/railtie'
require 'action_view/railtie'
require 'action_cable/railtie'
require 'rails/test_unit/railtie'

Bundler.require(*Rails.groups)

module GtcxBackend
  class Application < Rails::Application
    config.load_defaults 7.0
    
    # Configuration for API-only apps
    config.api_only = true
    
    # CORS configuration for React Native apps
    config.middleware.insert_before 0, Rack::Cors do
      allow do
        origins '*' # Configure specific origins in production
        resource '*',
          headers: :any,
          methods: [:get, :post, :put, :patch, :delete, :options, :head]
      end
    end
    
    # Auto-load paths
    config.autoload_paths += %W(#{config.root}/app/services)
    
    # Time zone
    config.time_zone = 'UTC'
  end
end