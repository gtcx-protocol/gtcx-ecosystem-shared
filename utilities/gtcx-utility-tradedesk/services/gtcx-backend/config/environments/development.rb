# ============================================================================
# DEVELOPMENT ENVIRONMENT - PRODUCTION-LIKE CONFIGURATION
# Optimized for real customer beta testing
# ============================================================================

Rails.application.configure do
  # Settings specified here will take precedence over those in config/application.rb.

  # In the development environment your application's code is reloaded on
  # every request. This slows down response time but is perfect for development
  # since you don't have to restart the web server when you make code changes.
  config.cache_classes = false

  # Do not eager load code on boot.
  config.eager_load = false

  # Show full error reports.
  config.consider_all_requests_local = true

  # Enable/disable caching.
  config.action_controller.perform_caching = true
  config.cache_store = :memory_store

  # Don't care if the mailer can't send.
  config.action_mailer.raise_delivery_errors = true
  config.action_mailer.perform_caching = false
  
  # Email configuration for development
  config.action_mailer.delivery_method = :smtp
  config.action_mailer.smtp_settings = {
    address: ENV.fetch('SMTP_ADDRESS', 'localhost'),
    port: ENV.fetch('SMTP_PORT', 587),
    domain: ENV.fetch('SMTP_DOMAIN', 'gtcx.local'),
    user_name: ENV.fetch('SMTP_USERNAME', nil),
    password: ENV.fetch('SMTP_PASSWORD', nil),
    authentication: 'plain',
    enable_starttls_auto: true
  }

  # Print deprecation notices to the Rails logger.
  config.active_support.deprecation = :log

  # Raise an error on page load if there are pending migrations.
  config.active_record.migration_error = :page_load

  # Highlight code that triggered database queries in logs.
  config.active_record.verbose_query_logs = true

  # Debug mode disables concatenation and preprocessing of assets.
  config.assets.debug = true if defined?(config.assets)

  # Use an evented file watcher to run tasks automatically.
  config.file_watcher = ActiveSupport::EventedFileUpdateChecker

  # Allow connections from mobile apps
  config.hosts << "localhost"
  config.hosts << "127.0.0.1"
  config.hosts << "0.0.0.0"
  config.hosts << /.*\.ngrok\.io/
  config.hosts << /.*\.localtunnel\.me/

  # Log level for development
  config.log_level = :debug

  # Enable CORS for mobile app development
  config.middleware.insert_before 0, Rack::Cors do
    allow do
      origins '*'  # Allow all origins in development
      resource '*',
        headers: :any,
        methods: [:get, :post, :put, :patch, :delete, :options, :head]
    end
  end

  # Production-like features for beta testing
  config.force_ssl = false  # Set to true when using HTTPS
  config.log_tags = [ :request_id ]

  # Background job processing
  config.active_job.queue_adapter = :async

  # File uploads (development uses local storage)
  config.active_storage.variant_processor = :mini_magick if defined?(ActiveStorage)
end