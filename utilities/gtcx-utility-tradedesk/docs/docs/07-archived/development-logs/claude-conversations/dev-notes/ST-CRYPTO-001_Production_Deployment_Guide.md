# ST-CRYPTO-001: Production Crypto Deployment Guide

## Overview
This guide provides step-by-step instructions for enabling production-grade cryptography in TradePass™ for government/military deployment.

## Current Status
✅ **Foundation Complete**: Production crypto architecture implemented  
⚠️ **Deployment Pending**: Metro bundler path resolution needs fixing  
✅ **Enhanced Development**: Improved crypto security active in development mode

## Production Enablement Steps

### Phase 1: Metro Resolution (IMMEDIATE)

**Issue**: Metro bundler error "the 'to' argument must be of type string"
**Root Cause**: Dynamic import path resolution in crypto-production.ts

**Solution Options:**

#### Option A: Fix Import Paths
```typescript
// In crypto.ts, replace dynamic import with static import
import { ProductionMilitaryCryptoService } from './crypto-production';

private async tryProductionCrypto(): Promise<boolean> {
  try {
    const productionService = ProductionMilitaryCryptoService.getInstance();
    await productionService.initialize();
    return true;
  } catch (error) {
    console.warn('Production crypto failed:', error);
    return false;
  }
}
```

#### Option B: Metro Configuration Fix
```javascript
// In metro.config.js, add resolver configuration
module.exports = {
  resolver: {
    alias: {
      'crypto-production': path.resolve(__dirname, 'src/services/crypto-production.ts'),
    },
  },
};
```

#### Option C: Conditional Import Strategy
```typescript
// Use environment-based conditional imports
const isDevelopment = __DEV__ || process.env.NODE_ENV === 'development';

if (!isDevelopment) {
  const ProductionCrypto = require('./crypto-production');
  // Use production crypto
}
```

### Phase 2: Performance Validation (WEEK 2)

**Memory Testing**:
```bash
# Monitor memory usage during crypto operations
npx react-native run-ios --configuration Release
# Use Xcode Instruments to monitor memory usage
```

**Performance Benchmarks**:
- Key generation: <100ms for ed25519, <150ms for secp256k1
- Signature generation: <50ms per signature
- Hash computation: <10ms for SHA-256/512
- Memory usage: <512MB peak during crypto operations

**Government Hardware Testing**:
- Test on devices with 4GB RAM or less
- Validate performance on older Android/iOS versions
- Ensure functionality in airplane mode (offline scenarios)

### Phase 3: Security Audit Preparation (WEEK 3-4)

**FIPS 140-2 Level 3 Compliance Checklist**:
- [ ] Cryptographic module integrity validation
- [ ] Key generation entropy testing
- [ ] Signature algorithm compliance verification
- [ ] Hash function standard compliance
- [ ] Random number generator quality assessment

**Security Documentation Required**:
- [ ] Cryptographic implementation specification
- [ ] Security architecture documentation
- [ ] Vulnerability assessment report
- [ ] Penetration testing results
- [ ] Code review security findings

## Deployment Commands

### Development Testing
```bash
# Test enhanced development crypto
cd tradepass-app
npm start
# Verify console shows "Enhanced development mode" crypto loading
```

### Production Build Testing
```bash
# Enable production crypto (after Metro fix)
# Edit crypto.ts, uncomment production loading
# cd tradepass-app
# eas build --platform ios --profile production
# eas build --platform android --profile production
```

### Performance Profiling
```bash
# Memory profiling
npx react-native run-ios --configuration Release
# Open Xcode -> Product -> Profile -> Instruments -> Allocations

# Performance testing
# Use React Native Performance Monitor
# Monitor key generation, signing, and verification times
```

## Environment Configuration

### Development Environment
```bash
export NODE_ENV=development
export CRYPTO_MODE=enhanced_development
export ENABLE_CRYPTO_LOGGING=true
```

### Production Environment  
```bash
export NODE_ENV=production
export CRYPTO_MODE=production
export ENABLE_CRYPTO_LOGGING=false
export ENABLE_FIPS_MODE=true
```

## Monitoring and Validation

### Health Checks
```typescript
// Add to existing health-check.js
async function validateCryptoService() {
  const crypto = MilitaryCryptoService.getInstance();
  await crypto.initialize();
  
  // Test key generation
  const key = await crypto.generateKey('ed25519', 'signing');
  assert(key.publicKey.length > 0, 'Key generation failed');
  
  // Test signing
  const signature = await crypto.generateSignature('test data', key.id);
  assert(signature.length > 0, 'Signature generation failed');
  
  console.log('✅ Crypto service validation passed');
}
```

### Production Logging
```typescript
// Production crypto logging
interface CryptoAuditLog {
  timestamp: number;
  operation: 'key_generation' | 'signing' | 'verification';
  success: boolean;
  performance: number; // milliseconds
  memoryUsage: number; // bytes
}
```

## Security Considerations

### Key Management
- Keys stored in Expo SecureStore (hardware-backed when available)
- Private keys never logged or transmitted
- Key rotation every 90 days for production
- Multi-factor authentication for key access

### Network Security
- All crypto operations work offline
- No cryptographic material transmitted unencrypted
- Certificate pinning for government API communication
- End-to-end encryption for sensitive data

### Compliance Requirements
- FIPS 140-2 Level 3 cryptographic modules
- Common Criteria EAL4+ evaluation
- Government security audit approval
- NIST SP 800-53 control implementation

## Rollback Plan

### If Production Crypto Fails
1. Disable production crypto loading in crypto.ts
2. Revert to enhanced development crypto
3. Investigate issues using development environment
4. Apply fixes and re-test in staging environment

### Emergency Fallback
```typescript
// Emergency fallback to basic crypto
if (crypto_initialization_fails) {
  console.warn('EMERGENCY: Using basic crypto fallback');
  use_basic_crypto_implementations();
  alert_security_team();
}
```

## Success Criteria

### Technical Validation
- [ ] Metro bundler builds without errors
- [ ] All crypto tests pass (100% success rate)
- [ ] Memory usage <512MB on government devices
- [ ] Performance benchmarks met
- [ ] Offline functionality verified

### Security Validation  
- [ ] FIPS 140-2 Level 3 compliance verified
- [ ] Government security audit passed
- [ ] Penetration testing cleared
- [ ] Code review security approval
- [ ] Military deployment certification

### User Acceptance
- [ ] Government users can complete identity verification
- [ ] Biometric enrollment works on all target devices
- [ ] Cross-app communication with GeoTag™ functional
- [ ] Offline/online synchronization reliable

## Timeline

**Week 1**: Metro resolution + production crypto enablement  
**Week 2**: Performance validation + government hardware testing  
**Week 3**: Security audit preparation + documentation  
**Week 4**: Government certification + deployment approval

## Support and Troubleshooting

### Common Issues
- **Metro bundler errors**: Check import paths and resolver configuration
- **Memory issues**: Enable lazy loading and optimize module usage
- **Performance issues**: Profile crypto operations and optimize bottlenecks
- **Government compliance**: Review FIPS requirements and update implementation

### Debug Commands
```bash
# Enable crypto debugging
export DEBUG=tradepass:crypto
npm start

# Performance profiling
npx react-native run-ios --configuration Release
# Monitor memory and CPU usage in Xcode Instruments

# Security testing
npm run test:security
npm run test:crypto-compliance
```

This deployment guide provides a roadmap for safely transitioning from enhanced development crypto to production-grade FIPS 140-2 Level 3 compliant cryptography for government/military deployment.