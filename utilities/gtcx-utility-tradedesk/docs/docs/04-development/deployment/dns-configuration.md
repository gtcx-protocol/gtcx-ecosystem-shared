# 🌐 DNS Configuration for GTCX Platform

## Domains Owned
✅ **gtcx.africa** - Main platform domain

## DNS Records to Configure

### For gtcx.africa:

**A Records:**
```
@           A     [EC2-PUBLIC-IP]     # Main domain
api         A     [EC2-PUBLIC-IP]     # API endpoint
admin       A     [EC2-PUBLIC-IP]     # Admin dashboard
docs        A     [EC2-PUBLIC-IP]     # Documentation
```

**CNAME Records:**
```
www         CNAME gtcx.africa         # WWW redirect
mobile      CNAME gtcx.africa         # Mobile app endpoint
cdn         CNAME gtcx.africa         # CDN endpoint (temporary)
```

**MX Records (for email):**
```
@           MX    10 mail.gtcx.africa
```

### Additional Domains Needed:

**Priority 1 (Ghana Pilot):**
- `tradepass.africa` - Trading platform
- `geotag.africa` - GPS verification app

**Priority 2 (Asia Expansion):**
- `gtcx.asia`
- `tradepass.asia`
- `geotag.asia`

**Priority 3 (Latin America):**
- `gtcx.lat`
- `tradepass.lat`
- `geotag.lat`

## Where to Configure DNS

### Option 1: Your Domain Registrar
- Log into your domain registrar (where you bought gtcx.africa)
- Find DNS management or nameservers
- Add the A and CNAME records above

### Option 2: AWS Route 53 (Recommended)
**Benefits:**
- Better integration with AWS services
- Health checks and failover
- Lower latency with geo-routing

**Setup Process:**
1. Go to AWS Console → Route 53
2. Create Hosted Zone for `gtcx.africa`
3. Copy the 4 nameservers provided
4. Update nameservers at your domain registrar
5. Add A records pointing to EC2 IP

## SSL Certificate Setup

### Using AWS Certificate Manager (Free):
```bash
# Request certificate for all domains
aws acm request-certificate \
  --domain-name gtcx.africa \
  --subject-alternative-names "*.gtcx.africa" \
  --validation-method DNS \
  --profile gtcx-deployment
```

### Using Let's Encrypt (Free):
```bash
# On EC2 instance
sudo certbot certonly \
  --standalone \
  -d gtcx.africa \
  -d www.gtcx.africa \
  -d api.gtcx.africa \
  -d admin.gtcx.africa
```

## Testing DNS Configuration

```bash
# Check DNS propagation
nslookup gtcx.africa
dig gtcx.africa
curl -I https://gtcx.africa

# Check subdomains
nslookup api.gtcx.africa
nslookup admin.gtcx.africa
```

## Next Steps

1. ✅ Configure A records for gtcx.africa → EC2 IP
2. ⏳ Register tradepass.africa and geotag.africa
3. ⏳ Set up SSL certificates
4. ⏳ Configure nginx reverse proxy on EC2
5. ⏳ Set up CloudFlare for DDoS protection