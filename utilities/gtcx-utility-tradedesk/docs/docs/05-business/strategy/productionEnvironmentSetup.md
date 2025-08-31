# 🔑 **PRODUCTION ENVIRONMENT SETUP GUIDE**
*Complete Account Setup & Infrastructure Requirements for GTCX Platform*

## 🎯 **OVERVIEW**

This document provides comprehensive setup instructions for establishing a production-ready environment for the GTCX platform, including TradePass™, GeoTag™, and all supporting infrastructure.

---

## 🏗️ **CORE INFRASTRUCTURE ACCOUNTS**

### **1. Cloud Hosting Provider** ☁️

#### **AWS (Recommended)**
- **Account Type**: AWS Business Account
- **Services Required**:
  - EC2 (Virtual servers)
  - RDS (PostgreSQL database)
  - ElastiCache (Redis)
  - S3 (File storage)
  - CloudFront (CDN)
  - Route 53 (DNS)
  - Certificate Manager (SSL)
  - CloudWatch (Monitoring)
  - ECS (Container orchestration)

**Setup Process**:
```bash
# Account Creation
1. Visit: https://aws.amazon.com/console/
2. Create Business Account
3. Verify payment method
4. Enable billing alerts
5. Set up IAM users with appropriate permissions

# Required IAM Policies
- AmazonEC2FullAccess
- AmazonRDSFullAccess
- AmazonS3FullAccess
- CloudFrontFullAccess
- AmazonElastiCacheFullAccess
```

**Monthly Cost Estimate**: $200-500 (depending on traffic)

#### **Alternative: Google Cloud Platform**
- **Account Type**: Google Cloud Business Account
- **Services**: Compute Engine, Cloud SQL, Cloud Storage, Cloud CDN
- **Monthly Cost**: $180-450

### **2. Domain & DNS Management** 🌐

#### **Domain Registration**
- **Provider**: Namecheap, GoDaddy, or Google Domains
- **Domains Required**:
  - `gtcx.com` (primary domain)
  - `api.gtcx.com` (API subdomain)
  - `admin.gtcx.com` (admin dashboard)
  - `docs.gtcx.com` (documentation)

**Setup Process**:
```bash
# Domain Configuration
1. Register primary domain (gtcx.com)
2. Configure DNS records:
   - A record: gtcx.com → Load balancer IP
   - CNAME: api.gtcx.com → gtcx.com
   - CNAME: admin.gtcx.com → gtcx.com
   - MX records for email
3. Set up SSL certificates via AWS Certificate Manager
```

**Annual Cost**: $50-150 per domain

---

## 🏛️ **GHANA GOVERNMENT INTEGRATION**

### **1. Ghana Minerals Commission** 💎

#### **API Access Application**
- **Website**: https://www.mineralscommission.gov.gh/
- **Contact**: IT Department - digitalization@mineralscommission.gov.gh
- **Required Documents**:
  - Business registration certificate
  - Company profile and technical capabilities
  - Data security and privacy policy
  - Technical integration proposal

**Application Process**:
```
1. Submit formal application letter
2. Provide technical documentation
3. Security clearance review (2-4 weeks)
4. API sandbox access granted
5. Production access after testing
6. Ongoing compliance reporting required
```

**Cost**: $500 application fee + $200/month API access

#### **API Configuration**
```env
# Ghana Minerals Commission API
GHANA_MINERALS_API_URL=https://api.mineralscommission.gov.gh/v1
GHANA_MINERALS_API_KEY=your_production_api_key
GHANA_CLIENT_ID=gtcx_production
GHANA_CLIENT_SECRET=your_client_secret
```

### **2. Ghana EPA (Environmental Protection)** 🌱
- **Purpose**: Environmental compliance reporting
- **Contact**: epa@epa.gov.gh
- **Cost**: $300 setup + $100/month

### **3. Ghana Revenue Authority** 💰
- **Purpose**: Tax reporting and compliance
- **Contact**: customercare@gra.gov.gh  
- **Cost**: Free (mandatory compliance)

---

## 💳 **MOBILE MONEY PROVIDERS**

### **1. MTN Mobile Money** 📱

#### **Business Account Setup**
- **Website**: https://developer.mtn.com/
- **Application Process**:
  ```
  1. Create developer account
  2. Submit business verification documents
  3. Complete KYB (Know Your Business) process
  4. API access review (1-2 weeks)
  5. Production credentials issued
  ```

**Required Documents**:
- Business registration certificate
- Director identification
- Bank statements (3 months)
- Technical integration plan
- Security assessment

**API Configuration**:
```env
# MTN Mobile Money Production
MTN_MOMO_API_URL=https://momodeveloper.mtn.com
MTN_ENVIRONMENT=production
MTN_SUBSCRIPTION_KEY=your_subscription_key
MTN_USER_ID=your_user_id
MTN_API_KEY=your_api_key
MTN_TARGET_ENVIRONMENT=mtnghana
```

**Cost**: Free setup + 1.5% transaction fee

### **2. Vodafone Cash** 📞

#### **Business Integration**
- **Website**: https://developer.vodafone.com.gh/
- **Contact**: business.api@vodafone.com.gh

**Application Process**:
```
1. Business account application
2. API partnership agreement
3. Technical integration review
4. Sandbox testing period
5. Production approval
```

**API Configuration**:
```env
# Vodafone Cash Production
VODAFONE_CASH_API_URL=https://api.vodafone.com.gh/v1
VODAFONE_CLIENT_ID=your_client_id
VODAFONE_CLIENT_SECRET=your_client_secret
VODAFONE_ACCESS_TOKEN=your_access_token
```

**Cost**: Free setup + 1.8% transaction fee

### **3. AirtelTigo Money** (Optional)
- **Purpose**: Additional payment coverage
- **Cost**: Free setup + 2.0% transaction fee

---

## 🤖 **MESSAGING & COMMUNICATION**

### **1. Telegram Bot** 💬

#### **Bot Creation**
```bash
# Setup Process
1. Message @BotFather on Telegram
2. Send /newbot command
3. Choose bot name: GTCX Mining Assistant
4. Choose username: @GTCXMiningBot
5. Receive bot token
6. Set webhook URL
```

**Configuration**:
```env
# Telegram Bot
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_WEBHOOK_URL=https://api.gtcx.com/telegram/webhook
TELEGRAM_BOT_USERNAME=GTCXMiningBot
```

**Cost**: Free

### **2. Twilio (SMS & Voice)** ☎️

#### **Business Account**
- **Website**: https://www.twilio.com/
- **Account Type**: Business Account with Ghana phone numbers

**Setup Process**:
```
1. Create Twilio account
2. Verify business information
3. Purchase Ghana phone numbers
4. Set up SMS and Voice services
5. Configure webhooks
```

**Configuration**:
```env
# Twilio SMS & Voice
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+233XXXXXXXXX
TWILIO_WEBHOOK_URL=https://api.gtcx.com/sms/webhook
```

**Cost**: $15/month base + $0.05/SMS + $0.15/minute calls

### **3. WhatsApp Business API** 💚

#### **Meta Business Account**
- **Website**: https://business.whatsapp.com/
- **Requirements**:
  - Facebook Business Manager account
  - Business verification
  - WhatsApp Business API approval

**Application Process**:
```
1. Create Meta Business Manager account
2. Apply for WhatsApp Business API access
3. Complete business verification
4. Set up WhatsApp Business profile
5. Configure webhooks and messaging
```

**Cost**: $0.005-0.015 per message (varies by country)

---

## 📊 **MONITORING & ANALYTICS**

### **1. Sentry (Error Tracking)** 🚨

#### **Business Account**
- **Website**: https://sentry.io/
- **Plan**: Business Plan for production monitoring

**Setup**:
```env
# Sentry Configuration
SENTRY_DSN=https://your_sentry_dsn@sentry.io/project_id
SENTRY_ENVIRONMENT=production
SENTRY_RELEASE=1.0.0
```

**Cost**: $26/month for team plan

### **2. New Relic (Performance Monitoring)** 📈

#### **Pro Account**
- **Website**: https://newrelic.com/
- **Services**: APM, Infrastructure, Browser monitoring

**Configuration**:
```env
# New Relic
NEW_RELIC_LICENSE_KEY=your_license_key
NEW_RELIC_APP_NAME=GTCX Production
NEW_RELIC_LOG_LEVEL=info
```

**Cost**: $99/month for Pro plan

### **3. DataDog (Alternative)** 🐕
- **Purpose**: Comprehensive monitoring and logging
- **Cost**: $15/host/month

---

## 📧 **EMAIL SERVICES**

### **1. AWS SES (Email Delivery)** 📨

#### **Configuration**
```env
# AWS SES
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USERNAME=your_smtp_username
SMTP_PASSWORD=your_smtp_password
SMTP_DOMAIN=gtcx.com
FROM_EMAIL=noreply@gtcx.com
SUPPORT_EMAIL=support@gtcx.com
```

**Cost**: $0.10 per 1,000 emails

### **2. SendGrid (Alternative)** 📮
- **Cost**: $14.95/month for 40,000 emails

---

## 🔒 **SECURITY SERVICES**

### **1. Cloudflare (DDoS Protection)** 🛡️

#### **Business Account**
- **Website**: https://www.cloudflare.com/
- **Services**: DDoS protection, WAF, CDN

**Configuration**:
```env
# Cloudflare
CLOUDFLARE_API_KEY=your_api_key
CLOUDFLARE_EMAIL=your_email
CLOUDFLARE_ZONE_ID=your_zone_id
```

**Cost**: $20/month per domain

### **2. Let's Encrypt SSL** 🔐
- **Purpose**: Free SSL certificates
- **Auto-renewal**: Via Certbot
- **Cost**: Free

---

## 🏪 **APP STORE ACCOUNTS**

### **1. Google Play Store** 🤖

#### **Google Play Developer Account**
- **Website**: https://play.google.com/console/
- **One-time Fee**: $25
- **Required**: Published TradePass™ and GeoTag™ apps

**Setup Process**:
```
1. Create Google Play Console account
2. Pay one-time $25 registration fee
3. Complete developer profile
4. Set up merchant account for paid apps
5. Upload app bundles for review
```

### **2. Apple App Store** 🍎

#### **Apple Developer Account**
- **Website**: https://developer.apple.com/
- **Annual Fee**: $99/year
- **Required**: If supporting iOS versions

---

## 💾 **DATABASE & STORAGE**

### **1. PostgreSQL (AWS RDS)** 🐘

#### **Production Configuration**
```bash
# RDS Instance Specifications
Instance Class: db.t3.large (2 vCPU, 8GB RAM)
Storage: 500GB General Purpose SSD
Multi-AZ: Yes (for high availability)
Automated Backups: 7 days retention
```

**Configuration**:
```env
# PostgreSQL Database
DATABASE_URL=postgresql://gtcx:password@gtcx-prod.amazonaws.com:5432/gtcx_production
DATABASE_NAME=gtcx_production
DATABASE_USER=gtcx
DATABASE_PASSWORD=your_secure_password
DATABASE_HOST=gtcx-prod.amazonaws.com
DATABASE_PORT=5432
```

**Cost**: $180-300/month

### **2. Redis (ElastiCache)** ⚡

#### **Cache Configuration**
```bash
# ElastiCache Redis
Node Type: cache.t3.medium
Nodes: 2 (with replication)
Engine: Redis 7.0
```

**Configuration**:
```env
# Redis Cache
REDIS_URL=redis://gtcx-redis.amazonaws.com:6379/0
REDIS_PASSWORD=your_redis_password
REDIS_HOST=gtcx-redis.amazonaws.com
REDIS_PORT=6379
```

**Cost**: $50-100/month

---

## 🔧 **DEVELOPMENT TOOLS**

### **1. GitHub (Code Repository)** 🐙

#### **Organization Account**
- **Plan**: GitHub Team ($4/user/month)
- **Features**: Private repositories, advanced security

### **2. Docker Hub** 🐳
- **Plan**: Pro ($5/month)
- **Purpose**: Container image hosting

### **3. Expo (Mobile App Development)** 📱

#### **Production Account**
- **Website**: https://expo.dev/
- **Plan**: Production ($99/month)
- **Features**: EAS Build, EAS Submit, Push notifications

---

## 📋 **COMPLETE SETUP CHECKLIST**

### **Phase 1: Infrastructure (Week 1)**
- [ ] Set up AWS account with billing alerts
- [ ] Register domain names and configure DNS
- [ ] Set up PostgreSQL and Redis instances
- [ ] Configure SSL certificates
- [ ] Deploy basic application infrastructure

### **Phase 2: External Integrations (Week 2-3)**
- [ ] Apply for Ghana Minerals Commission API access
- [ ] Set up MTN Mobile Money business account
- [ ] Create Vodafone Cash integration
- [ ] Configure Twilio for SMS and voice
- [ ] Set up Telegram bot

### **Phase 3: Monitoring & Security (Week 4)**
- [ ] Configure Sentry error tracking
- [ ] Set up New Relic performance monitoring
- [ ] Enable Cloudflare protection
- [ ] Configure backup and disaster recovery
- [ ] Set up monitoring alerts

### **Phase 4: App Store Preparation (Week 5)**
- [ ] Create Google Play Developer account
- [ ] Prepare app store listings
- [ ] Configure app signing certificates
- [ ] Set up continuous deployment
- [ ] Submit apps for review

---

## 💰 **TOTAL COST BREAKDOWN**

### **One-Time Setup Costs**
- Ghana Minerals Commission API application: $500
- Google Play Developer account: $25
- Apple Developer account: $99/year
- Domain registration: $50/year
- **Total One-Time**: ~$675

### **Monthly Recurring Costs**
- AWS infrastructure: $350-500
- Ghana government API access: $200
- Mobile money transaction fees: Variable (1.5-2%)
- Monitoring services (Sentry, New Relic): $125
- Cloudflare protection: $20
- Twilio SMS/Voice: $50-100
- Email services: $15
- **Total Monthly**: $760-1,010

### **Annual Costs**
- Domain renewals: $200
- Apple Developer: $99
- **Total Annual**: $299

### **Revenue-Based Costs**
- Mobile money fees: 1.5-2% of transaction volume
- WhatsApp messages: $0.005-0.015 per message

---

## 🚀 **DEPLOYMENT TIMELINE**

### **Immediate (Days 1-3)**
1. Set up AWS infrastructure
2. Deploy basic application
3. Configure domain and SSL

### **Short Term (Week 1)**
1. Submit government API applications
2. Create mobile money business accounts
3. Set up monitoring services

### **Medium Term (Weeks 2-4)**
1. Complete government integrations
2. Implement mobile money payments
3. Deploy Telegram bot

### **Long Term (Weeks 4-8)**
1. App store submissions
2. Advanced feature rollouts
3. Scale infrastructure based on usage

---

**This comprehensive setup enables a world-class production environment supporting millions of users across Ghana and beyond! 🌍⚡**