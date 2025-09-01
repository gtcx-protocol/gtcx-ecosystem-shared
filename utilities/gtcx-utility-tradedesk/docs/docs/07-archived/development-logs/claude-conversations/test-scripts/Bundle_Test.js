#!/usr/bin/env node

/**
 * Bundle Test - Verify Metro can generate bundles successfully
 * Tests the specific issue reported by user with module resolution
 */

const http = require('http');

console.log('🧪 Testing Metro Bundle Generation...\n');

function testBundle(port = 8082) {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: port,
      path: '/index.bundle?platform=ios&dev=true&minify=false',
      method: 'GET'
    }, (res) => {
      let data = '';
      
      console.log(`📡 Response Status: ${res.statusCode}`);
      console.log(`📡 Response Headers:`, Object.keys(res.headers));
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log(`✅ Bundle generated successfully`);
          console.log(`📦 Bundle size: ${data.length} bytes`);
          
          // Check for common bundle indicators
          const hasCommonCode = data.includes('__r(0)') || data.includes('module.exports');
          const hasNoErrors = !data.includes('Unable to resolve') && !data.includes('Module not found');
          
          if (hasCommonCode && hasNoErrors) {
            console.log('✅ Bundle appears valid - contains expected code');
            resolve({ success: true, size: data.length, port });
          } else {
            console.log('⚠️ Bundle may have issues:');
            if (!hasCommonCode) console.log('   - Missing expected bundle structure');
            if (!hasNoErrors) console.log('   - Contains error messages');
            resolve({ success: false, reason: 'bundle_issues', size: data.length, port });
          }
        } else {
          console.log(`❌ Bundle generation failed with status ${res.statusCode}`);
          console.log(`📝 Response: ${data.substring(0, 500)}...`);
          resolve({ success: false, reason: 'http_error', status: res.statusCode, port });
        }
      });
    });
    
    req.on('error', (error) => {
      console.log(`❌ Bundle request failed: ${error.message}`);
      resolve({ success: false, reason: 'connection_error', error: error.message, port });
    });
    
    req.setTimeout(30000, () => {
      console.log('⏰ Bundle request timed out');
      req.abort();
      resolve({ success: false, reason: 'timeout', port });
    });
    
    req.end();
  });
}

async function runBundleTest() {
  console.log('Starting bundle generation test...');
  
  const result = await testBundle(8082);
  
  console.log('\n📊 BUNDLE TEST RESULTS');
  console.log('======================');
  console.log(`Port: ${result.port}`);
  console.log(`Success: ${result.success ? '✅ YES' : '❌ NO'}`);
  
  if (!result.success) {
    console.log(`Failure Reason: ${result.reason}`);
    if (result.status) console.log(`HTTP Status: ${result.status}`);
    if (result.error) console.log(`Error: ${result.error}`);
  } else {
    console.log(`Bundle Size: ${result.size.toLocaleString()} bytes`);
  }
  
  console.log('\n💡 RECOMMENDATIONS:');
  if (result.success) {
    console.log('✅ Metro bundling is working correctly');
    console.log('✅ Module resolution issues appear to be fixed');
    console.log('✅ TradePass should load successfully in Expo');
  } else {
    console.log('❌ Metro bundling is still failing');
    console.log('🔍 Check Metro logs for specific errors');
    console.log('🔄 May need to restart Metro or clear cache');
  }
  
  // Exit with appropriate code
  process.exit(result.success ? 0 : 1);
}

// Run the test
runBundleTest().catch(console.error);