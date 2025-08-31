# 🚀 GTCX Production Deployment Guide

Complete guide for deploying the Ghana Trade & Compliance Exchange (GTCX) platform to production.

## 🎯 Overview

The GTCX platform consists of:
- **TradePass™**: React Native mobile app for traders
- **GeoTag™**: React Native mobile app for miners with GPS tracking
- **Rails 7 API**: Backend with Ghana government integration
- **Vue.js Admin**: Administrative dashboard
- **Real integrations**: Ghana Minerals Commission, MTN Mobile Money, Vodafone Cash

## 📋 Prerequisites

### Required Accounts & Services
1. **Cloud Provider**: AWS/Google Cloud/Azure
2. **Domain**: `.com` domain (e.g., gtcx.com)
3. **SSL Certificate**: Let's Encrypt or paid certificate
4. **Ghana Government**: Minerals Commission API access
5. **MTN Ghana**: Mobile Money API credentials
6. **Vodafone Ghana**: Cash API credentials
7. **Monitoring**: Sentry, New Relic (optional)

### Infrastructure Requirements
- **CPU**: 4+ cores
- **RAM**: 8GB+ 
- **Storage**: 100GB+ SSD
- **Network**: 100Mbps+ bandwidth
- **Database**: PostgreSQL 15+ with PostGIS
- **Cache**: Redis 7+

## 🏗️ Infrastructure Setup

### Option A: Docker Deployment (Recommended)

1. **Clone repository**:
```bash
git clone https://github.com/your-org/gtcx-platform.git
cd gtcx-platform/gtcx-backend
```

2. **Configure environment**:
```bash
cp .env.production.example .env.production
# Edit .env.production with your credentials
```

3. **Deploy with Docker Compose**:
```bash
docker-compose -f docker-compose.production.yml up -d
```

### Option B: Manual Server Setup

1. **Install dependencies**:
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install -y postgresql-15 postgresql-15-postgis-3 redis-server nginx
sudo apt install -y ruby3.2 nodejs npm

# Install Ruby gems
gem install bundler
bundle install --deployment --without development test
```

2. **Database setup**:
```bash
sudo -u postgres createuser -s gtcx
sudo -u postgres createdb gtcx_production -O gtcx
sudo -u postgres psql -c "ALTER USER gtcx PASSWORD 'your_password';"
```

3. **Configure services**:
```bash
# Copy service files
sudo cp config/deploy/gtcx-api.service /etc/systemd/system/
sudo cp config/deploy/gtcx-sidekiq.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable gtcx-api gtcx-sidekiq
```

## 🔐 Security Configuration

### 1. SSL/TLS Setup
```bash
# Using Certbot for Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d gtcx.com -d api.gtcx.com -d admin.gtcx.com
```

### 2. Firewall Configuration
```bash
sudo ufw enable
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP (redirects to HTTPS)
sudo ufw allow 443/tcp  # HTTPS
```

### 3. Environment Variables
Store sensitive data in encrypted environment files:
```bash
# Generate Rails credentials
EDITOR=nano rails credentials:edit --environment=production
```

## 🌍 Ghana Government Integration

### 1. Minerals Commission API
```bash
# Test connection
curl -X GET "https://api.mineralscommission.gov.gh/v1/health" \
  -H "X-API-Key: your_api_key"
```

### 2. Environment Configuration
```env
GHANA_MINERALS_API_URL=https://api.mineralscommission.gov.gh/v1
GHANA_MINERALS_API_KEY=your_production_key
GHANA_CLIENT_ID=gtcx_production
```

## 💳 Payment Provider Setup

### 1. MTN Mobile Money
Apply at: https://momodeveloper.mtn.com

```env
MTN_MOMO_API_URL=https://momodeveloper.mtn.com
MTN_ENVIRONMENT=production
MTN_SUBSCRIPTION_KEY=your_subscription_key
MTN_USER_ID=your_user_id
MTN_API_KEY=your_api_key
```

### 2. Vodafone Cash
Apply at: https://developer.vodafone.com.gh

```env
VODAFONE_CASH_API_URL=https://api.vodafone.com.gh/v1
VODAFONE_CLIENT_ID=your_client_id
VODAFONE_CLIENT_SECRET=your_client_secret
VODAFONE_ACCESS_TOKEN=your_access_token
```

## 📱 Mobile App Deployment

### React Native Apps (TradePass™ & GeoTag™)

1. **Build for Production**:
```bash
# Android
cd tradepass-app
npx expo build:android --release-channel production

cd ../geotag-app  
npx expo build:android --release-channel production

# iOS
npx expo build:ios --release-channel production
```

2. **Update API endpoints**:
```javascript
// app.config.js
export default {
  expo: {
    extra: {
      apiUrl: "https://api.gtcx.com/api/v1",
      wsUrl: "wss://api.gtcx.com/cable"
    }
  }
}
```

## 🚀 Deployment Process

### Automated Deployment
```bash
# Deploy backend
cap production deploy:full_restart

# Deploy mobile apps
expo publish --release-channel production
```

### Manual Deployment Steps
1. **Database Migration**:
```bash
RAILS_ENV=production bundle exec rails db:migrate
```

2. **Asset Compilation**:
```bash
RAILS_ENV=production bundle exec rails assets:precompile
```

3. **Service Restart**:
```bash
sudo systemctl restart gtcx-api gtcx-sidekiq nginx
```

4. **Health Checks**:
```bash
curl https://gtcx.com/health
curl https://api.gtcx.com/health
```

## 📊 Monitoring Setup

### 1. Prometheus & Grafana
```bash
# Already included in docker-compose.production.yml
docker-compose -f docker-compose.production.yml up -d prometheus grafana
```

Access:
- Prometheus: http://your-server:9090
- Grafana: http://your-server:3001

### 2. Application Monitoring
```env
# Sentry for error tracking
SENTRY_DSN=https://your_dsn@sentry.io/project_id

# New Relic for performance
NEW_RELIC_LICENSE_KEY=your_license_key
```

### 3. Log Management
```bash
# Centralized logging with Fluentd
docker-compose logs -f gtcx_api
docker-compose logs -f gtcx_sidekiq
```

## 🔄 Backup Strategy

### 1. Database Backups
```bash
# Daily automated backups
sudo crontab -e
# Add: 0 2 * * * /opt/gtcx/scripts/backup-database.sh
```

### 2. File Storage Backups
```bash
# Sync to AWS S3
aws s3 sync /var/www/gtcx-production/shared/storage s3://gtcx-backups/storage/
```

## 🧪 Health Checks & Testing

### 1. API Health Check
```bash
curl -f https://api.gtcx.com/health
```

### 2. Ghana Government API Test
```bash
curl -X POST https://api.gtcx.com/api/v1/government/ghana/verify_permit \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{"permit_number": "GH123456"}'
```

### 3. Payment Provider Tests
```bash
# MTN Mobile Money
curl -X GET https://api.gtcx.com/api/v1/payments/providers/health

# Test payment flow
curl -X POST https://api.gtcx.com/api/v1/payments \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{
    "payment": {
      "amount": 10,
      "phone_number": "0241234567",
      "description": "Test payment",
      "payment_type": "wallet_topup"
    }
  }'
```

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection**:
```bash
# Check PostgreSQL
sudo systemctl status postgresql
sudo -u postgres psql -l
```

2. **Redis Connection**:
```bash
# Check Redis
redis-cli ping
```

3. **SSL Certificate Issues**:
```bash
# Renew certificates
sudo certbot renew
sudo systemctl reload nginx
```

4. **Payment API Errors**:
```bash
# Check provider health
curl https://api.gtcx.com/api/v1/payments/providers/health

# Check logs
docker-compose logs gtcx_api | grep -i "payment\|mtn\|vodafone"
```

## 📈 Performance Optimization

### 1. Database Optimization
```sql
-- Add indexes for common queries
CREATE INDEX CONCURRENTLY idx_locations_user_recorded_at ON locations (user_id, recorded_at DESC);
CREATE INDEX CONCURRENTLY idx_payments_user_status ON payments (user_id, status);
```

### 2. Redis Configuration
```bash
# Optimize Redis for production
echo 'maxmemory 2gb' >> /etc/redis/redis.conf
echo 'maxmemory-policy allkeys-lru' >> /etc/redis/redis.conf
```

### 3. Nginx Tuning
```nginx
# Already optimized in nginx.conf
worker_processes auto;
worker_connections 1024;
keepalive_timeout 65;
```

## 🎯 Go-Live Checklist

- [ ] Infrastructure provisioned and configured
- [ ] Domain and SSL certificates configured
- [ ] Ghana government API credentials obtained and tested
- [ ] MTN Mobile Money production credentials configured
- [ ] Vodafone Cash production credentials configured
- [ ] Database migrations completed
- [ ] All health checks passing
- [ ] Monitoring and alerting configured
- [ ] Backup strategy implemented
- [ ] Security audit completed
- [ ] Performance testing completed
- [ ] Mobile apps published to app stores
- [ ] Support documentation updated
- [ ] Team trained on production procedures

## 📞 Support

For deployment support:
- **Email**: devops@gtcx.com
- **Documentation**: https://docs.gtcx.com
- **Status**: https://status.gtcx.com

---

*This guide ensures GTCX platform is production-ready for Ghana's mining sector with real government integration and mobile money payments.*