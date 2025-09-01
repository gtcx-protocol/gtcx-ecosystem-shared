# ☁️ Cloudflare Configuration for GTCX Commodity Platform

## Domain Setup
- **Registrar**: Porkbun
- **DNS Provider**: Cloudflare
- **EC2 IP**: 18.118.199.111

## DNS Records Configuration

### Production Records for gtcx.africa

```
Type    Name    Content             Proxy   TTL
----    ----    -------             -----   ---
A       @       18.118.199.111      ✅      Auto    # gtcx.africa
A       www     18.118.199.111      ✅      Auto    # www.gtcx.africa
A       api     18.118.199.111      ❌      Auto    # api.gtcx.africa (no proxy for API)
A       admin   18.118.199.111      ✅      Auto    # admin.gtcx.africa
A       docs    18.118.199.111      ✅      Auto    # docs.gtcx.africa
A       trade   18.118.199.111      ✅      Auto    # trade.gtcx.africa
```

### Additional Domains to Configure

**TradePass™ (tradepass.africa)**
```
A       @       18.118.199.111      ✅      Auto
A       www     18.118.199.111      ✅      Auto
A       api     18.118.199.111      ❌      Auto
A       mobile  18.118.199.111      ✅      Auto
```

**GeoTag™ (geotag.africa)**
```
A       @       18.118.199.111      ✅      Auto
A       www     18.118.199.111      ✅      Auto
A       api     18.118.199.111      ❌      Auto
A       gps     18.118.199.111      ✅      Auto
```

## Cloudflare Settings

### SSL/TLS Configuration
1. Go to **SSL/TLS** → **Overview**
2. Set encryption mode to **Full (strict)**
3. Enable **Always Use HTTPS**
4. Enable **Automatic HTTPS Rewrites**

### Security Settings
1. Go to **Security** → **Settings**
2. Security Level: **Medium**
3. Challenge Passage: **30 minutes**
4. Browser Integrity Check: **ON**

### Performance Settings
1. Go to **Speed** → **Optimization**
2. Auto Minify: **JavaScript, CSS, HTML**
3. Brotli: **ON**
4. Rocket Loader: **ON**
5. HTTP/3 (with QUIC): **ON**

### Page Rules (Free - 3 rules)

**Rule 1: API Cache Bypass**
```
URL: api.gtcx.africa/*
Settings:
- Cache Level: Bypass
- Security Level: High
```

**Rule 2: Admin Security**
```
URL: admin.gtcx.africa/*
Settings:
- Security Level: High
- Cache Level: Bypass
- Always Use HTTPS: ON
```

**Rule 3: Static Assets Cache**
```
URL: *gtcx.africa/assets/*
Settings:
- Cache Level: Cache Everything
- Edge Cache TTL: 1 month
```

## Firewall Rules

### Basic Protection (Free)
1. Go to **Security** → **WAF**
2. Create rule: **Block Known Bots**
   - Field: User Agent
   - Operator: Contains
   - Value: bot|crawler|spider
   - Action: Challenge

3. Create rule: **Rate Limiting**
   - Field: IP Address
   - Rate: 10 requests per 10 seconds
   - Action: Challenge

## Testing DNS Configuration

```bash
# Check DNS propagation (may take 5-30 minutes)
dig gtcx.africa @1.1.1.1
nslookup gtcx.africa
curl -I https://gtcx.africa

# Check if Cloudflare proxy is working
curl -I https://gtcx.africa | grep "cf-ray"

# Test subdomains
dig api.gtcx.africa @1.1.1.1
dig admin.gtcx.africa @1.1.1.1
```

## Cloudflare API Integration

```bash
# Get your API token from Cloudflare dashboard
# Account → API Tokens → Create Token

# Example: Purge cache via API
curl -X POST "https://api.cloudflare.com/client/v4/zones/YOUR_ZONE_ID/purge_cache" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}'
```

## Benefits of Cloudflare for GTCX

✅ **Free SSL Certificates** - Automatic HTTPS for all domains
✅ **DDoS Protection** - Protects commodity trading platform
✅ **Global CDN** - Fast access from Africa, Asia, Latin America
✅ **Web Application Firewall** - Blocks malicious traffic
✅ **Analytics** - Real-time traffic insights
✅ **Zero Trust Access** - Secure admin panel access

## Next Steps

1. ✅ Add all A records in Cloudflare DNS
2. ✅ Configure SSL/TLS settings to Full (strict)
3. ✅ Set up page rules for API and admin
4. ⏳ Wait 5-30 minutes for DNS propagation
5. ⏳ Test https://gtcx.africa access
6. ⏳ Install nginx on EC2 server
7. ⏳ Deploy Rails API backend