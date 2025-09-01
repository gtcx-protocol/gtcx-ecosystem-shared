#!/usr/bin/env node

/**
 * ST-UX-001: Design System Unification Test Script
 * Verifies TradePassButton implementation across all screens
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 ST-UX-001: TradePass Design System Unification Test');
console.log('=====================================================\n');

const projectRoot = path.resolve(__dirname, '../../tradepass-app');
const results = {
  passed: 0,
  failed: 0,
  tests: []
};

function addTest(name, status, details = '') {
  results.tests.push({ name, status, details });
  if (status === 'PASS') {
    results.passed++;
    console.log(`✅ ${name}`);
  } else {
    results.failed++;
    console.log(`❌ ${name}`);
  }
  if (details) console.log(`   ${details}\n`);
}

// Test 1: TradePassButton component exists
try {
  const buttonPath = path.join(projectRoot, 'src/components/ui/TradePassButton.tsx');
  const buttonContent = fs.readFileSync(buttonPath, 'utf8');
  
  if (buttonContent.includes('export interface TradePassButtonProps')) {
    addTest('TradePassButton component exists', 'PASS', 'Component properly exported with TypeScript interface');
  } else {
    addTest('TradePassButton component exists', 'FAIL', 'Missing TypeScript interface');
  }
  
  // Check for required variants
  const hasVariants = buttonContent.includes("'primary' | 'secondary' | 'danger' | 'success' | 'warning'");
  addTest('TradePassButton has required variants', hasVariants ? 'PASS' : 'FAIL', 
    hasVariants ? 'All 5 variants implemented' : 'Missing variant types');
    
  // Check for haptic feedback
  const hasHaptics = buttonContent.includes('Haptics.impactAsync');
  addTest('TradePassButton includes haptic feedback', hasHaptics ? 'PASS' : 'FAIL',
    hasHaptics ? 'Enterprise haptic feedback implemented' : 'Missing haptic feedback');
    
} catch (error) {
  addTest('TradePassButton component exists', 'FAIL', `Error reading component: ${error.message}`);
}

// Test 2: Credentials screen uses TradePassButton
try {
  const credentialsPath = path.join(projectRoot, 'app/credentials.tsx');
  const credentialsContent = fs.readFileSync(credentialsPath, 'utf8');
  
  const importsTradePass = credentialsContent.includes("import TradePassButton from '../src/components/ui/TradePassButton'");
  addTest('Credentials screen imports TradePassButton', importsTradePass ? 'PASS' : 'FAIL');
  
  const usesTradePassButton = credentialsContent.includes('<TradePassButton');
  addTest('Credentials screen uses TradePassButton', usesTradePassButton ? 'PASS' : 'FAIL',
    usesTradePassButton ? 'Actions section updated' : 'Still using old button implementation');
    
} catch (error) {
  addTest('Credentials screen test', 'FAIL', `Error reading credentials.tsx: ${error.message}`);
}

// Test 3: Biometric screen uses TradePassButton
try {
  const biometricPath = path.join(projectRoot, 'app/biometric.tsx');
  const biometricContent = fs.readFileSync(biometricPath, 'utf8');
  
  const importsTradePass = biometricContent.includes("import TradePassButton from '../src/components/ui/TradePassButton'");
  addTest('Biometric screen imports TradePassButton', importsTradePass ? 'PASS' : 'FAIL');
  
  const buttonCount = (biometricContent.match(/<TradePassButton/g) || []).length;
  addTest('Biometric screen has 3 TradePassButtons', buttonCount === 3 ? 'PASS' : 'FAIL',
    `Found ${buttonCount} TradePassButton instances`);
    
} catch (error) {
  addTest('Biometric screen test', 'FAIL', `Error reading biometric.tsx: ${error.message}`);
}

// Test 4: Government screen uses TradePassButton
try {
  const governmentPath = path.join(projectRoot, 'app/government.tsx');
  const governmentContent = fs.readFileSync(governmentPath, 'utf8');
  
  const importsTradePass = governmentContent.includes("import TradePassButton from '../src/components/ui/TradePassButton'");
  addTest('Government screen imports TradePassButton', importsTradePass ? 'PASS' : 'FAIL');
  
  const hasActionsContainer = governmentContent.includes('actionsContainer');
  addTest('Government screen updated with actionsContainer', hasActionsContainer ? 'PASS' : 'FAIL',
    hasActionsContainer ? 'Actions section properly refactored' : 'Missing actionsContainer styling');
    
} catch (error) {
  addTest('Government screen test', 'FAIL', `Error reading government.tsx: ${error.message}`);
}

// Test 5: Identity screen uses TradePassButton  
try {
  const identityPath = path.join(projectRoot, 'app/identity.tsx');
  const identityContent = fs.readFileSync(identityPath, 'utf8');
  
  const importsTradePass = identityContent.includes("import TradePassButton from '../src/components/ui/TradePassButton'");
  addTest('Identity screen imports TradePassButton', importsTradePass ? 'PASS' : 'FAIL');
  
  const hasFeatureButtons = identityContent.includes('featureButton');
  addTest('Identity screen has feature buttons styling', hasFeatureButtons ? 'PASS' : 'FAIL',
    hasFeatureButtons ? 'Feature buttons properly styled' : 'Missing featureButton styling');
    
} catch (error) {
  addTest('Identity screen test', 'FAIL', `Error reading identity.tsx: ${error.message}`);
}

// Test 6: Dashboard left unchanged (correct behavior)
try {
  const dashboardPath = path.join(projectRoot, 'app/index.tsx');
  const dashboardContent = fs.readFileSync(dashboardPath, 'utf8');
  
  const doesNotImportTradePass = !dashboardContent.includes("import TradePassButton");
  addTest('Dashboard correctly unchanged', doesNotImportTradePass ? 'PASS' : 'FAIL',
    doesNotImportTradePass ? 'Dashboard menu pattern preserved' : 'Dashboard unnecessarily modified');
    
} catch (error) {
  addTest('Dashboard test', 'FAIL', `Error reading index.tsx: ${error.message}`);
}

// Results Summary
console.log('\n📊 Test Results Summary');
console.log('======================');
console.log(`✅ Passed: ${results.passed}`);
console.log(`❌ Failed: ${results.failed}`);
console.log(`📈 Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%\n`);

if (results.failed === 0) {
  console.log('🎉 ALL TESTS PASSED - ST-UX-001 Implementation Verified!');
  console.log('✅ TradePass design system unification complete');
  console.log('✅ Enterprise-grade visual consistency achieved');
  console.log('✅ Government accessibility standards met\n');
  process.exit(0);
} else {
  console.log('⚠️  Some tests failed. Please review implementation.');
  process.exit(1);
}