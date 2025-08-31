# 🌐 DNS Configuration for GTCX Commodity Platform

## EC2 Instance Details
- **Public IPv4**: `18.118.199.111`
- **Region**: US East (Ohio) - us-east-2

## DNS Records to Configure for gtcx.africa

### Required A Records
Configure these in your DNS provider:

```
Type    Name            Value               TTL
----    ----            -----               ---
A       @               18.118.199.111      300
A       www             18.118.199.111      300
A       api             18.118.199.111      300
A       admin           18.118.199.111      300
A       docs            18.118.199.111      300
```

### CNAME Records (Optional)
```
Type    Name            Value               TTL
----    ----            -----               ---
CNAME   mobile          gtcx.africa         300
CNAME   app             gtcx.africa         300
CNAME   trade           gtcx.africa         300
```

## Subdomain Structure

- **gtcx.africa** - Main commodity exchange platform
- **api.gtcx.africa** - REST API for commodity trading
- **admin.gtcx.africa** - Admin dashboard for platform management
- **docs.gtcx.africa** - API documentation
- **trade.gtcx.africa** - Trading interface

## Quick DNS Configuration Steps

### If using Namecheap:
1. Login to Namecheap
2. Go to Domain List → Manage (gtcx.africa)
3. Advanced DNS tab
4. Add A Records with IP `18.118.199.111`

### If using GoDaddy:
1. Login to GoDaddy
2. My Products → DNS (gtcx.africa)
3. Add → A Record
4. Points to: `18.118.199.111`

### If using Cloudflare:
1. Login to Cloudflare
2. Select gtcx.africa
3. DNS → Add Record
4. Type: A, Name: @, IPv4: `18.118.199.111`

## Test DNS Configuration

```bash
# Check if DNS is working (may take 5-30 minutes to propagate)
ping gtcx.africa
nslookup gtcx.africa
dig gtcx.africa

# Test subdomains
ping api.gtcx.africa
ping admin.gtcx.africa
```

## SSH Access to Server

```bash
# Connect to your EC2 instance
ssh -i ~/.ssh/gtcx-keys/gtcx-production.pem ec2-user@18.118.199.111

# Or using domain (after DNS propagates)
ssh -i ~/.ssh/gtcx-keys/gtcx-production.pem ec2-user@gtcx.africa
```

## Next Steps After DNS

1. ✅ Configure nginx on EC2 for web serving
2. ✅ Install SSL certificates (Let's Encrypt)
3. ✅ Deploy Rails API backend
4. ✅ Set up PostgreSQL database
5. ✅ Configure Redis cache