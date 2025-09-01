# 🌍 GTCX Global Domain Registration Strategy

## Primary Domains Required

### Africa Instance (.africa TLD)
- **gtcx.africa** - Main exchange platform
- **tradepass.africa** - Trading application  
- **geotag.africa** - GPS verification app

### Asia Instance (.asia TLD)
- **gtcx.asia** - Asian commodity exchange
- **tradepass.asia** - Asian trading platform
- **geotag.asia** - Asian GPS verification

### Latin America (.lat TLD)  
- **gtcx.lat** - Latin American exchange
- **tradepass.lat** - Latin American trading
- **geotag.lat** - Latin American GPS verification

## Registration Process

### Step 1: Domain Registrar Selection
**Recommended**: Namecheap or Google Domains
- Supports .africa, .asia, .lat TLDs
- Competitive pricing ($12-50/year per domain)
- Good DNS management interface
- SSL certificate integration

### Step 2: Registration Order
**Phase 1**: Africa domains (immediate)
- gtcx.africa
- tradepass.africa  
- geotag.africa

**Phase 2**: Asia domains (Q2 2024)
- gtcx.asia
- tradepass.asia
- geotag.asia

**Phase 3**: Latin America domains (Q3 2024)
- gtcx.lat
- tradepass.lat
- geotag.lat

### Step 3: DNS Configuration
**Route 53 Hosted Zones** for each domain:
```
gtcx.africa:
  A     @ → Load Balancer IP
  CNAME api → gtcx.africa
  CNAME admin → gtcx.africa
  CNAME www → gtcx.africa
  MX    @ → Email servers

tradepass.africa:
  A     @ → Mobile app landing
  CNAME api → api.gtcx.africa (shared API)
  CNAME mobile → tradepass.africa

geotag.africa:  
  A     @ → Mobile app landing
  CNAME api → api.gtcx.africa (shared API)
  CNAME gps → geotag.africa
```

## Cost Breakdown

### Annual Domain Costs
- .africa domains: $50/year × 3 = $150/year
- .asia domains: $15/year × 3 = $45/year  
- .lat domains: $30/year × 3 = $90/year
- **Total Annual**: $285/year

### AWS Route 53 Costs
- Hosted zones: $0.50/month × 9 domains = $4.50/month
- DNS queries: ~$5/month (estimated)
- **Total Monthly**: $9.50/month ($114/year)

### SSL Certificates
- AWS Certificate Manager: FREE for all domains
- Wildcard certificates for *.gtcx.africa, etc.

## Next Steps

1. **Register gtcx.africa immediately** (primary domain)
2. Set up Route 53 hosted zone
3. Request SSL certificates via AWS Certificate Manager  
4. Configure DNS records for subdomain routing
5. Register tradepass.africa and geotag.africa
6. Test domain resolution and SSL

**Total First-Year Cost**: ~$400 (domains + DNS)
**Ongoing Annual Cost**: ~$285 (domain renewals only)