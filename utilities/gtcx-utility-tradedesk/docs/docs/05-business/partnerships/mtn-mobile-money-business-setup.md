# 📱 MTN Mobile Money Business Account Setup

## URGENT: Security Notice
**⚠️ PREVIOUS API KEYS COMPROMISED**
- Consumer Key: 1ISyAttCoEK79puSebL2yk5Hxr2Q0GFm
- Consumer Secret: Zj1CiX3t0dOKinwy

**ACTION REQUIRED**: Regenerate all keys immediately for security

## MTN Mobile Money Business Integration

### Step 1: Developer Account Setup
**Website**: https://developer.mtn.com/
**Portal**: https://momodeveloper.mtn.com/

### Registration Process:
1. **Create Developer Account**
   - Email: mtn-api@gtcx.africa
   - Company: GTCX (Global Trust and Compliance eXchange)
   - Country: Ghana
   - Use Case: Gold trading and mining payments

2. **Business Verification Documents**
   - Business registration certificate
   - Director identification (passport/Ghana Card)
   - Bank statements (3 months)
   - Technical integration plan
   - Security assessment document

### Step 2: API Product Subscription

**Required Products:**
- **Collection API**: Receive payments from miners
- **Disbursement API**: Pay miners for gold purchases
- **Remittance API**: International transfers (future)

**Subscription Process:**
```
1. Navigate to Products → Collection
2. Subscribe to Collection API
3. Generate Primary and Secondary Keys
4. Subscribe to Disbursement API  
5. Generate Disbursement Keys
6. Complete KYC (Know Your Customer) process
```

### Step 3: Production Environment Setup

**Environment Configuration:**
```env
# MTN Mobile Money Production (NEW KEYS REQUIRED)
MTN_MOMO_API_URL=https://momodeveloper.mtn.com
MTN_ENVIRONMENT=production
MTN_TARGET_ENVIRONMENT=mtnghana
MTN_CALLBACK_HOST=https://api.gtcx.africa

# Collection API (NEW KEYS)
MTN_COLLECTION_PRIMARY_KEY=regenerate_immediately
MTN_COLLECTION_SECONDARY_KEY=regenerate_immediately  
MTN_COLLECTION_USER_ID=gtcx_collection_user
MTN_COLLECTION_API_KEY=regenerate_immediately

# Disbursement API (NEW KEYS)
MTN_DISBURSEMENT_PRIMARY_KEY=regenerate_immediately
MTN_DISBURSEMENT_SECONDARY_KEY=regenerate_immediately
MTN_DISBURSEMENT_USER_ID=gtcx_disbursement_user
MTN_DISBURSEMENT_API_KEY=regenerate_immediately
```

### Step 4: Webhook Configuration

**Webhook URLs:**
```
Collection Webhook: https://api.gtcx.africa/webhooks/mtn/collection
Disbursement Webhook: https://api.gtcx.africa/webhooks/mtn/disbursement
Status Callback: https://api.gtcx.africa/webhooks/mtn/status
```

### Step 5: Testing & Go-Live

**Test Scenarios:**
1. **Payment Collection**: Miner pays mining license fee
2. **Gold Purchase**: Trader pays miner for gold lot
3. **Refund Processing**: Return payment for failed transaction
4. **Status Checking**: Query payment status and history

**Go-Live Requirements:**
- Complete business verification
- Pass integration testing
- Security audit approval
- Compliance documentation

## Business Use Cases for GTCX

### 1. Mining License Payments
- Miners pay government fees via MTN Mobile Money
- Automatic receipt generation
- Government API integration

### 2. Gold Trading Transactions  
- Traders purchase gold lots from miners
- Escrow-style payments with verification
- Automatic compliance reporting

### 3. Service Fee Collection
- Platform usage fees
- Verification service charges
- Premium feature subscriptions

### 4. Payout Distribution
- Mining royalty distributions
- Partner commission payments
- Referral bonus payments

## Security Implementation

### API Security:
```python
# Example secure API call structure
import requests
import uuid
import base64

def create_collection_request(amount, phone_number):
    headers = {
        'Authorization': f'Bearer {get_oauth_token()}',
        'X-Reference-Id': str(uuid.uuid4()),
        'X-Target-Environment': 'mtnghana',
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': MTN_COLLECTION_PRIMARY_KEY
    }
    
    payload = {
        'amount': amount,
        'currency': 'GHS', 
        'externalId': generate_external_id(),
        'payer': {
            'partyIdType': 'MSISDN',
            'partyId': phone_number
        },
        'payerMessage': 'GTCX Mining Payment',
        'payeeNote': 'Gold trading transaction'
    }
    
    response = requests.post(
        f'{MTN_MOMO_API_URL}/collection/v1_0/requesttopay',
        json=payload,
        headers=headers
    )
    
    return response
```

### Error Handling:
- Network timeouts and retries
- Invalid phone number validation
- Insufficient funds handling
- Duplicate transaction prevention

## Cost Structure

### Transaction Fees:
- **Collection**: 1.5% + GHS 0.50 per transaction
- **Disbursement**: 1.8% + GHS 0.75 per transaction
- **Monthly Minimum**: GHS 100 regardless of volume

### Volume Discounts:
- **Tier 1** (0-1,000 transactions): Standard rates
- **Tier 2** (1,001-10,000): 10% discount
- **Tier 3** (10,001+): 15% discount + dedicated support

## Integration Timeline

### Week 1: Account Setup
- [ ] Create MTN developer account
- [ ] Submit business verification documents  
- [ ] Subscribe to API products
- [ ] Generate new secure API keys

### Week 2: Development & Testing
- [ ] Implement collection API integration
- [ ] Implement disbursement API integration
- [ ] Set up webhook handlers
- [ ] Complete sandbox testing

### Week 3: Security & Compliance
- [ ] Security penetration testing
- [ ] Compliance documentation
- [ ] PCI DSS assessment (if applicable)
- [ ] Data protection audit

### Week 4: Production Deployment
- [ ] Production environment setup
- [ ] Go-live testing with small amounts
- [ ] Full production rollout
- [ ] Monitoring and alerting setup

## Monitoring & Analytics

### Key Metrics:
- Transaction success rate (target: >95%)
- Average transaction time (target: <30 seconds)
- Failed transaction reasons and frequency
- Monthly transaction volume and growth
- Customer payment patterns and behavior

### Alerting:
- Failed API calls (>5% failure rate)
- Webhook delivery failures
- High-value transaction notifications
- Unusual activity patterns

**Next Action**: Visit https://developer.mtn.com/ and begin business account registration with new secure credentials.