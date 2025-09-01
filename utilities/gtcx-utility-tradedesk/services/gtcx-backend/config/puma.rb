# ============================================================================
# PUMA WEB SERVER CONFIGURATION - PRODUCTION OPTIMIZED
# High-performance web server for Rails API
# ============================================================================

# Specify the maximum number of threads
max_threads_count = ENV.fetch("RAILS_MAX_THREADS") { 5 }
min_threads_count = ENV.fetch("RAILS_MIN_THREADS") { max_threads_count }
threads min_threads_count, max_threads_count

# Specify the worker timeout (in seconds)
worker_timeout 30

# Specify the number of workers for clustering
workers ENV.fetch("WEB_CONCURRENCY") { 2 }

# Use the existing pidfile
pidfile ENV.fetch("PIDFILE") { "tmp/pids/server.pid" }

# Specify the bind address
bind "tcp://0.0.0.0:#{ENV.fetch('PORT', 3000)}"

# Specifies the environment that Puma will run in
environment ENV.fetch("RAILS_ENV") { "development" }

# Allow puma to be restarted by the rails restart command
plugin :tmp_restart

# Production optimizations
if ENV["RAILS_ENV"] == "production"
  preload_app!
  
  on_worker_boot do
    ActiveRecord::Base.establish_connection
  end
end

# Health check endpoint for load balancers
app do |env|
  if env["REQUEST_PATH"] == "/health"
    [200, {"Content-Type" => "text/plain"}, ["OK"]]
  else
    [404, {"Content-Type" => "text/plain"}, ["Not Found"]]
  end
end