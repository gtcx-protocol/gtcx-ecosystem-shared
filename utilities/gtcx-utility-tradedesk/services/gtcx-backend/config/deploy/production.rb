# ============================================================================
# CAPISTRANO PRODUCTION DEPLOYMENT - GTCX PLATFORM
# Automated deployment for Ghana mining operations
# ============================================================================

# Server configuration
server 'gtcx-prod-1.compute.amazonaws.com', 
       user: 'deployer',
       roles: %w[app db web]

server 'gtcx-prod-2.compute.amazonaws.com',
       user: 'deployer', 
       roles: %w[app web]

# Deployment settings
set :deploy_to, '/var/www/gtcx-production'
set :rails_env, 'production'
set :branch, 'main'

# Database settings (primary server only)
set :database_host, 'gtcx-prod-db.cxxxxxxxxxxxx.us-east-1.rds.amazonaws.com'
set :database_name, 'gtcx_production'

# Redis settings
set :redis_host, 'gtcx-prod-redis.xxxxx.cache.amazonaws.com'
set :redis_port, 6379

# Asset compilation
set :assets_roles, [:web, :app]
set :assets_prefix, 'assets'

# Linked files and directories
append :linked_files, 
       'config/credentials.yml.enc',
       'config/master.key',
       '.env.production'

append :linked_dirs,
       'log',
       'tmp/pids',
       'tmp/cache',
       'tmp/sockets',
       'vendor/bundle',
       'public/system',
       'storage'

# Puma configuration
set :puma_bind, 'unix:///var/www/gtcx-production/shared/tmp/sockets/puma.sock'
set :puma_state, '/var/www/gtcx-production/shared/tmp/pids/puma.state'
set :puma_pid, '/var/www/gtcx-production/shared/tmp/pids/puma.pid'
set :puma_conf, '/var/www/gtcx-production/shared/config/puma.rb'

# Nginx configuration
set :nginx_server_name, 'api.gtcx.com gtcx.com'

# SSL Configuration
set :ssl_certificate, '/etc/nginx/ssl/gtcx.crt'
set :ssl_certificate_key, '/etc/nginx/ssl/gtcx.key'

# Environment variables for production
set :default_env, {
  'RAILS_ENV' => 'production',
  'NODE_ENV' => 'production',
  
  # Database
  'DATABASE_URL' => "postgresql://#{fetch(:database_user)}:#{fetch(:database_password)}@#{fetch(:database_host)}/#{fetch(:database_name)}",
  
  # Redis
  'REDIS_URL' => "redis://#{fetch(:redis_host)}:#{fetch(:redis_port)}/0",
  
  # Ghana Government API
  'GHANA_MINERALS_API_URL' => 'https://api.mineralscommission.gov.gh/v1',
  'GHANA_MINERALS_API_KEY' => fetch(:ghana_api_key),
  'GHANA_CLIENT_ID' => 'gtcx_production',
  
  # MTN Mobile Money Production
  'MTN_MOMO_API_URL' => 'https://momodeveloper.mtn.com',
  'MTN_ENVIRONMENT' => 'production',
  'MTN_SUBSCRIPTION_KEY' => fetch(:mtn_subscription_key),
  'MTN_USER_ID' => fetch(:mtn_user_id),
  'MTN_API_KEY' => fetch(:mtn_api_key),
  
  # Vodafone Cash Production
  'VODAFONE_CASH_API_URL' => 'https://api.vodafone.com.gh/v1',
  'VODAFONE_ACCESS_TOKEN' => fetch(:vodafone_access_token),
  'VODAFONE_CLIENT_ID' => fetch(:vodafone_client_id),
  'VODAFONE_CLIENT_SECRET' => fetch(:vodafone_client_secret),
  
  # Application settings
  'BASE_URL' => 'https://gtcx.com',
  'ALLOWED_HOSTS' => 'gtcx.com,api.gtcx.com,www.gtcx.com',
  'CORS_ORIGINS' => 'https://gtcx.com,https://admin.gtcx.com',
  
  # Monitoring
  'SENTRY_DSN' => fetch(:sentry_dsn),
  'NEW_RELIC_LICENSE_KEY' => fetch(:new_relic_license_key)
}

# Deployment hooks
namespace :deploy do
  desc 'Run database migrations'
  task :migrate do
    on roles(:db) do
      within current_path do
        with rails_env: fetch(:rails_env) do
          execute :bundle, :exec, :rails, 'db:migrate'
        end
      end
    end
  end

  desc 'Restart Puma'
  task :restart_puma do
    on roles(:app) do
      execute :sudo, :systemctl, :restart, :puma
    end
  end

  desc 'Restart Sidekiq'
  task :restart_sidekiq do
    on roles(:app) do
      execute :sudo, :systemctl, :restart, :sidekiq
    end
  end

  desc 'Reload Nginx'
  task :reload_nginx do
    on roles(:web) do
      execute :sudo, :nginx, '-t'  # Test configuration
      execute :sudo, :systemctl, :reload, :nginx
    end
  end

  desc 'Update crontab'
  task :update_cron do
    on roles(:app) do
      within current_path do
        execute :bundle, :exec, :whenever, '--update-crontab', '--set', 'environment=production'
      end
    end
  end

  desc 'Clear cache'
  task :clear_cache do
    on roles(:app) do
      within current_path do
        with rails_env: fetch(:rails_env) do
          execute :bundle, :exec, :rails, 'tmp:clear'
          execute :bundle, :exec, :rails, 'cache:clear'
        end
      end
    end
  end

  desc 'Warm up application'
  task :warmup do
    on roles(:web) do
      execute :curl, '-f', 'https://gtcx.com/health'
      execute :curl, '-f', 'https://api.gtcx.com/health'
    end
  end

  desc 'Check Ghana government API connectivity'
  task :check_ghana_api do
    on roles(:app) do
      within current_path do
        with rails_env: fetch(:rails_env) do
          execute :bundle, :exec, :rails, :runner, 
                  '"puts GhanaGovernmentService.api_health_check"'
        end
      end
    end
  end

  desc 'Check payment provider connectivity'
  task :check_payment_providers do
    on roles(:app) do
      within current_path do
        with rails_env: fetch(:rails_env) do
          execute :bundle, :exec, :rails, :runner,
                  '"puts GhanaPaymentService.payment_providers_health"'
        end
      end
    end
  end

  desc 'Deploy with full restart'
  task :full_restart do
    invoke 'deploy'
    invoke 'deploy:migrate'
    invoke 'deploy:clear_cache'
    invoke 'deploy:restart_puma'
    invoke 'deploy:restart_sidekiq'
    invoke 'deploy:reload_nginx'
    invoke 'deploy:update_cron'
    invoke 'deploy:warmup'
    invoke 'deploy:check_ghana_api'
    invoke 'deploy:check_payment_providers'
  end
end

# Deployment flow
after 'deploy:updated', 'deploy:migrate'
after 'deploy:published', 'deploy:restart_puma'
after 'deploy:published', 'deploy:restart_sidekiq'
after 'deploy:published', 'deploy:reload_nginx'
after 'deploy:published', 'deploy:update_cron'
after 'deploy:finished', 'deploy:clear_cache'
after 'deploy:finished', 'deploy:warmup'

# Health checks after deployment
after 'deploy:finished', 'deploy:check_ghana_api'
after 'deploy:finished', 'deploy:check_payment_providers'