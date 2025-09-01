#!/usr/bin/env node

/**
 * 🔍 GTCX Production Environment Validation Script
 * Validates all required environment variables are set for production deployment
 * Usage: node scripts/validate-production-env.js
 */

const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');

// Color codes for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(color, message) {
  console.log(`${color}${message}${colors.reset}`);
}

function loadEnvFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return null;
    }
    
    const content = fs.readFileSync(filePath, 'utf-8');
    const env = {};
    
    content.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          env[key] = valueParts.join('=');
        }
      }
    });
    
    return env;
  } catch (error) {
    return null;
  }
}

function validateApp(appName, envPath) {
  log(colors.blue, `\n📱 Validating ${appName}...`);
  
  const env = loadEnvFile(envPath);
  if (!env) {
    log(colors.red, `❌ Cannot load environment file: ${envPath}`);
    return false;
  }
  
  const criticalVars = {
    'GeoTag™': [
      'API_KEY',
      'ENCRYPTION_KEY',
      'GPS_ACCURACY_THRESHOLD',
      'RAILS_API_KEY',
      'GHANA_MINERALS_API_KEY',
      'MTN_MOMO_API_KEY',
      'MAPS_API_KEY',
      'SENTRY_DSN',
      'EAS_PROJECT_ID'
    ],
    'TradePass™': [
      'API_KEY',
      'ENCRYPTION_KEY',
      'ED25519_PRIVATE_KEY',
      'SECP256K1_PRIVATE_KEY',
      'GHANA_PASSPORT_API_KEY',
      'JUMIO_API_TOKEN',
      'JWT_SECRET',
      'SENTRY_DSN'
    ],
    'TradeDesk™': [
      'API_KEY',
      'JWT_SECRET',
      'LBMA_API_KEY',
      'REUTERS_API_KEY',
      'SWIFT_API_KEY',
      'GCB_API_KEY',
      'SENTRY_DSN'
    ],
    'Backend': [
      'SECRET_KEY_BASE',
      'DATABASE_URL',
      'REDIS_URL',
      'JWT_SECRET',
      'GHANA_MINERALS_API_KEY',
      'MTN_MOMO_API_KEY',
      'AWS_ACCESS_KEY_ID',
      'AWS_SECRET_ACCESS_KEY',
      'SENTRY_DSN'
    ]
  };
  
  const requiredVars = criticalVars[appName] || [];
  let valid = true;
  let placeholderCount = 0;
  let missingCount = 0;
  
  requiredVars.forEach(varName => {
    const value = env[varName];
    
    if (!value) {
      log(colors.red, `  ❌ Missing: ${varName}`);
      missingCount++;
      valid = false;
    } else if (value.includes('[') && value.includes('PLACEHOLDER')) {
      log(colors.yellow, `  ⚠️  Placeholder: ${varName} = ${value}`);
      placeholderCount++;
      valid = false;
    } else {
      log(colors.green, `  ✅ Valid: ${varName}`);
    }
  });
  
  // Summary
  const total = requiredVars.length;
  const validCount = total - missingCount - placeholderCount;
  
  log(colors.blue, `\n📊 ${appName} Summary:`);
  log(colors.green, `  ✅ Valid: ${validCount}/${total}`);
  log(colors.yellow, `  ⚠️  Placeholders: ${placeholderCount}/${total}`);
  log(colors.red, `  ❌ Missing: ${missingCount}/${total}`);
  
  return valid;
}

function validateCryptoKeys() {
  log(colors.blue, `\n🔐 Validating Cryptographic Keys...`);
  
  const tradepassEnv = loadEnvFile(path.join(projectRoot, 'apps/tradepass/.env.production'));
  if (!tradepassEnv) {
    log(colors.red, '❌ Cannot load TradePass environment');
    return false;
  }
  
  const cryptoKeys = [
    'ED25519_PRIVATE_KEY',
    'SECP256K1_PRIVATE_KEY',
    'ENCRYPTION_KEY',
    'JWT_SECRET'
  ];
  
  let valid = true;
  
  cryptoKeys.forEach(key => {
    const value = tradepassEnv[key];
    if (!value) {
      log(colors.red, `  ❌ Missing crypto key: ${key}`);
      valid = false;
    } else if (value.includes('PLACEHOLDER')) {
      log(colors.red, `  ❌ Crypto key is placeholder: ${key}`);
      valid = false;
    } else if (value.length < 32) {
      log(colors.yellow, `  ⚠️  Crypto key too short: ${key} (${value.length} chars)`);
      valid = false;
    } else {
      log(colors.green, `  ✅ Crypto key valid: ${key} (${value.length} chars)`);
    }
  });
  
  return valid;
}

function validateGovAPIs() {
  log(colors.blue, `\n🏛️  Validating Government API Keys...`);
  
  const geotagEnv = loadEnvFile(path.join(projectRoot, 'apps/geotag/.env.production'));
  const backendEnv = loadEnvFile(path.join(projectRoot, 'services/gtcx-backend/.env.production'));
  
  const govAPIs = [
    { key: 'GHANA_MINERALS_API_KEY', service: 'Minerals Commission' },
    { key: 'EPA_API_KEY', service: 'Environmental Protection Agency' },
    { key: 'BOG_API_KEY', service: 'Bank of Ghana' }
  ];
  
  let valid = true;
  
  govAPIs.forEach(({ key, service }) => {
    const geotagValue = geotagEnv?.[key];
    const backendValue = backendEnv?.[key];
    
    if (!geotagValue && !backendValue) {
      log(colors.red, `  ❌ Missing ${service}: ${key}`);
      valid = false;
    } else if ((geotagValue && geotagValue.includes('PLACEHOLDER')) || 
               (backendValue && backendValue.includes('PLACEHOLDER'))) {
      log(colors.yellow, `  ⚠️  ${service} API key is placeholder: ${key}`);
      valid = false;
    } else {
      log(colors.green, `  ✅ ${service} API configured: ${key}`);
    }
  });
  
  return valid;
}

function validateMobileMoney() {
  log(colors.blue, `\n📱 Validating Mobile Money APIs...`);
  
  const geotagEnv = loadEnvFile(path.join(projectRoot, 'apps/geotag/.env.production'));
  const backendEnv = loadEnvFile(path.join(projectRoot, 'services/gtcx-backend/.env.production'));
  
  const mobileMoneyAPIs = [
    { key: 'MTN_MOMO_API_KEY', service: 'MTN Mobile Money' },
    { key: 'VODAFONE_API_KEY', service: 'Vodafone Cash' },
    { key: 'AIRTELTIGO_API_KEY', service: 'AirtelTigo Money' }
  ];
  
  let valid = true;
  
  mobileMoneyAPIs.forEach(({ key, service }) => {
    const geotagValue = geotagEnv?.[key];
    const backendValue = backendEnv?.[key];
    
    if (!geotagValue && !backendValue) {
      log(colors.red, `  ❌ Missing ${service}: ${key}`);
      valid = false;
    } else if ((geotagValue && geotagValue.includes('PLACEHOLDER')) || 
               (backendValue && backendValue.includes('PLACEHOLDER'))) {
      log(colors.yellow, `  ⚠️  ${service} API key is placeholder: ${key}`);
      valid = false;
    } else {
      log(colors.green, `  ✅ ${service} configured: ${key}`);
    }
  });
  
  return valid;
}

// Main validation function
function validateProduction() {
  console.log('🚀 GTCX PRODUCTION ENVIRONMENT VALIDATION');
  console.log('=' .repeat(80));
  
  const validations = [
    validateApp('GeoTag™', path.join(projectRoot, 'apps/geotag/.env.production')),
    validateApp('TradePass™', path.join(projectRoot, 'apps/tradepass/.env.production')),
    validateApp('TradeDesk™', path.join(projectRoot, 'apps/tradedesk/.env.production')),
    validateApp('Backend', path.join(projectRoot, 'services/gtcx-backend/.env.production')),
    validateCryptoKeys(),
    validateGovAPIs(),
    validateMobileMoney()
  ];
  
  const allValid = validations.every(v => v === true);
  
  console.log('\n' + '='.repeat(80));
  
  if (allValid) {
    log(colors.green + colors.bold, '🎉 ALL VALIDATIONS PASSED - PRODUCTION READY!');
    log(colors.green, 'Environment configuration is complete and secure.');
  } else {
    log(colors.red + colors.bold, '❌ VALIDATION FAILED - NOT PRODUCTION READY');
    log(colors.red, 'Please fix all issues before deploying to production.');
  }
  
  console.log('='.repeat(80));
  
  // Exit with appropriate code
  process.exit(allValid ? 0 : 1);
}

// Run validation
validateProduction();

module.exports = { validateProduction };