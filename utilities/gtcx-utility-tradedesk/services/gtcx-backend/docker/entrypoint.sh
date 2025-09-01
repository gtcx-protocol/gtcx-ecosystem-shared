#!/bin/sh
# ============================================================================
# PRODUCTION ENTRYPOINT - RAILS APPLICATION
# Ghana mining platform startup script
# ============================================================================

set -e

echo "🚀 Starting GTCX Rails Application..."

# Wait for database to be ready
echo "⏳ Waiting for database connection..."
until PGPASSWORD=$DATABASE_PASSWORD psql -h "${DATABASE_HOST:-postgres}" -U "${DATABASE_USER:-gtcx}" -d "${DATABASE_NAME:-gtcx_production}" -c '\q'; do
  echo "Database is unavailable - sleeping"
  sleep 2
done

echo "✅ Database is ready!"

# Wait for Redis to be ready
echo "⏳ Waiting for Redis connection..."
until redis-cli -h "${REDIS_HOST:-redis}" -p "${REDIS_PORT:-6379}" -a "$REDIS_PASSWORD" ping; do
  echo "Redis is unavailable - sleeping"
  sleep 2
done

echo "✅ Redis is ready!"

# Create database if it doesn't exist (first time setup)
echo "🗃️ Setting up database..."
if ! PGPASSWORD=$DATABASE_PASSWORD psql -h "${DATABASE_HOST:-postgres}" -U "${DATABASE_USER:-gtcx}" -lqt | cut -d \| -f 1 | grep -qw "${DATABASE_NAME:-gtcx_production}"; then
  echo "📊 Creating database..."
  bundle exec rails db:create
fi

# Run database migrations
echo "🔄 Running database migrations..."
bundle exec rails db:migrate

# Seed database if needed (only in staging/demo environments)
if [ "$RAILS_ENV" = "staging" ] || [ "$SEED_DATABASE" = "true" ]; then
  echo "🌱 Seeding database..."
  bundle exec rails db:seed
fi

# Precompile assets if not already done
if [ ! -d "public/assets" ] && [ -f "config/application.rb" ]; then
  echo "🎨 Precompiling assets..."
  bundle exec rails assets:precompile
fi

# Clear cache
echo "🧹 Clearing cache..."
bundle exec rails tmp:clear

# Start application
echo "✨ Starting GTCX Rails server..."
echo "🏛️ Ghana Government API: ${GHANA_MINERALS_API_URL:-sandbox}"
echo "📱 MTN Mobile Money: ${MTN_ENVIRONMENT:-sandbox}"
echo "💳 Vodafone Cash: ${VODAFONE_CASH_API_URL:-sandbox}"

# Execute the main command
exec "$@"