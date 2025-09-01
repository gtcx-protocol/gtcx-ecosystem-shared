#!/usr/bin/env node

/**
 * Metro Connection Test - Simple but comprehensive connection testing
 * Designed to catch the specific "to" argument and connection issues
 */

const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const net = require('net');

console.log('🔗 Metro Connection Test Suite');
console.log('==============================\n');

const projectRoot = path.resolve(__dirname, '../../tradepass-app');

// Kill any existing Metro processes first
async function killExistingMetro() {
  console.log('🧹 Cleaning up existing processes...');
  
  const ports = [8081, 8082, 8083, 8084, 8085, 8086, 8087, 8088, 8089, 8090];
  
  for (const port of ports) {
    try {
      await new Promise((resolve) => {
        exec(`lsof -ti:${port}`, (error, stdout) => {
          if (stdout) {
            const pids = stdout.trim().split('\n');
            pids.forEach(pid => {
              if (pid) {
                exec(`kill -9 ${pid}`, () => {
                  console.log(`   Killed process ${pid} on port ${port}`);
                });
              }
            });
          }
          resolve();
        });
      });
    } catch (error) {
      // Ignore errors in cleanup
    }
  }
  
  // Wait for cleanup to complete
  await new Promise(resolve => setTimeout(resolve, 2000));
  console.log('✅ Cleanup completed\n');
}

// Test Metro startup with detailed error capture
async function testMetroStartup(port = 8084) {
  console.log(`🚀 Testing Metro startup on port ${port}...`);
  
  return new Promise((resolve) => {
    const startTime = Date.now();
    let stdout = '';
    let stderr = '';
    let serverReady = false;
    
    // Start Metro with minimal options
    const metro = spawn('npx', ['expo', 'start', '--port', port.toString()], {
      cwd: projectRoot,
      stdio: 'pipe'
    });
    
    const timeout = setTimeout(() => {
      if (!serverReady) {
        metro.kill('SIGTERM');
        console.log(`❌ Metro startup timed out on port ${port}`);
        resolve({
          success: false,
          reason: 'timeout',
          duration: Date.now() - startTime,
          port,
          stdout,
          stderr
        });
      }
    }, 45000);
    
    metro.stdout.on('data', (data) => {
      const output = data.toString();
      stdout += output;
      
      console.log(`📤 [${port}] ${output.trim()}`);
      
      // Success indicator
      if (output.includes(`Waiting on http://localhost:${port}`)) {
        clearTimeout(timeout);
        serverReady = true;
        
        console.log(`✅ Metro server ready on port ${port}`);
        
        // Test connection immediately
        setTimeout(async () => {
          const connectionTest = await testConnection(port);
          metro.kill('SIGTERM');
          
          resolve({
            success: true,
            reason: 'server_ready',
            duration: Date.now() - startTime,
            port,
            stdout,
            stderr,
            connectionTest
          });
        }, 2000);
        return;
      }
      
      // Critical error detection
      if (output.includes('TypeError: The "to" argument must be of type string')) {
        clearTimeout(timeout);
        metro.kill('SIGTERM');
        
        console.log('🚨 CRITICAL: Metro "to" argument error detected!');
        
        resolve({
          success: false,
          reason: 'to_argument_error',
          duration: Date.now() - startTime,
          port,
          stdout,
          stderr,
          critical: true
        });
        return;
      }
      
      if (output.includes('Bundling failed')) {
        console.log('⚠️ Bundling failed detected');
      }
    });
    
    metro.stderr.on('data', (data) => {
      const error = data.toString();
      stderr += error;
      
      console.log(`📥 [${port}] ERROR: ${error.trim()}`);
      
      // Port conflict
      if (error.includes('EADDRINUSE')) {
        clearTimeout(timeout);
        metro.kill('SIGTERM');
        
        resolve({
          success: false,
          reason: 'port_in_use',
          duration: Date.now() - startTime,
          port,
          stdout,
          stderr
        });
        return;
      }
      
      // Noble package warnings
      if (error.includes('@noble')) {
        console.log('⚠️ Noble package warning detected');
      }
    });
    
    metro.on('close', (code) => {
      if (!serverReady) {
        clearTimeout(timeout);
        
        resolve({
          success: false,
          reason: 'process_exit',
          exitCode: code,
          duration: Date.now() - startTime,
          port,
          stdout,
          stderr
        });
      }
    });
    
    metro.on('error', (error) => {
      clearTimeout(timeout);
      
      resolve({
        success: false,
        reason: 'spawn_error',
        error: error.message,
        duration: Date.now() - startTime,
        port,
        stdout,
        stderr
      });
    });
  });
}

// Test connection to Metro server
async function testConnection(port) {
  console.log(`🔌 Testing connection to localhost:${port}...`);
  
  return new Promise((resolve) => {
    const startTime = Date.now();
    const client = new net.Socket();
    
    const timeout = setTimeout(() => {
      client.destroy();
      console.log(`❌ Connection to port ${port} timed out`);
      resolve({
        success: false,
        reason: 'timeout',
        duration: Date.now() - startTime
      });
    }, 5000);
    
    client.connect(port, 'localhost', () => {
      clearTimeout(timeout);
      client.end();
      console.log(`✅ Successfully connected to port ${port}`);
      resolve({
        success: true,
        duration: Date.now() - startTime
      });
    });
    
    client.on('error', (error) => {
      clearTimeout(timeout);
      console.log(`❌ Connection failed: ${error.message}`);
      resolve({
        success: false,
        reason: 'connection_error',
        error: error.message,
        duration: Date.now() - startTime
      });
    });
  });
}

// Main test runner
async function runConnectionTests() {
  console.log('Starting Metro Connection Test Suite...\n');
  
  try {
    // Clean up first
    await killExistingMetro();
    
    // Test multiple ports to find a working one
    const portsToTest = [8084, 8085, 8086, 8087];
    const results = [];
    
    for (const port of portsToTest) {
      console.log(`\n${'='.repeat(50)}`);
      console.log(`Testing Port ${port}`);
      console.log(`${'='.repeat(50)}`);
      
      const result = await testMetroStartup(port);
      results.push(result);
      
      if (result.success) {
        console.log(`\n✅ SUCCESS: Metro working on port ${port}`);
        console.log(`   Duration: ${result.duration}ms`);
        if (result.connectionTest?.success) {
          console.log(`   Connection: ✅ Working`);
        } else {
          console.log(`   Connection: ❌ Failed`);
        }
        break; // Found a working port
      } else {
        console.log(`\n❌ FAILED: Port ${port} - ${result.reason}`);
        if (result.critical) {
          console.log('   🚨 CRITICAL ERROR - This is the "to" argument issue!');
          break; // Don't test other ports if we hit the critical error
        }
      }
      
      // Wait between tests
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
    
    // Generate summary report
    console.log(`\n${'='.repeat(60)}`);
    console.log('SUMMARY REPORT');
    console.log(`${'='.repeat(60)}`);
    
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    const critical = results.filter(r => r.critical);
    
    console.log(`Total tests: ${results.length}`);
    console.log(`Successful: ${successful.length}`);
    console.log(`Failed: ${failed.length}`);
    console.log(`Critical errors: ${critical.length}`);
    
    if (critical.length > 0) {
      console.log(`\n🚨 CRITICAL ISSUE DETECTED:`);
      console.log(`   The Metro "to" argument error is still occurring!`);
      console.log(`   This means the Noble package fix is not working.`);
    } else if (successful.length > 0) {
      console.log(`\n✅ METRO IS WORKING:`);
      console.log(`   Successfully started on port ${successful[0].port}`);
      console.log(`   Connection test: ${successful[0].connectionTest?.success ? 'PASSED' : 'FAILED'}`);
    } else {
      console.log(`\n❌ ALL TESTS FAILED:`);
      console.log(`   Common failure reasons:`);
      failed.forEach(f => {
        console.log(`     - Port ${f.port}: ${f.reason}`);
      });
    }
    
    // Save detailed results
    const reportPath = path.join(__dirname, '../debug-notes/connection-test-results.json');
    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
    console.log(`\nDetailed results saved to: ${reportPath}`);
    
    // Exit with appropriate code
    if (critical.length > 0) {
      console.log('\nExiting with code 1 (critical error)');
      process.exit(1);
    } else if (successful.length === 0) {
      console.log('\nExiting with code 2 (all tests failed)');
      process.exit(2);
    } else {
      console.log('\nExiting with code 0 (success)');
      process.exit(0);
    }
    
  } catch (error) {
    console.error(`Test suite failed: ${error.message}`);
    process.exit(1);
  }
}

// Run the tests
runConnectionTests();