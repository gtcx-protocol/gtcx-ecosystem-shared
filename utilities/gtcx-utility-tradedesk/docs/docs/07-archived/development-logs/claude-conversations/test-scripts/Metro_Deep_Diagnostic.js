#!/usr/bin/env node

/**
 * Metro Deep Diagnostic Suite - Enhanced Error Detection
 * Specifically designed to catch recurring "to" argument errors and connection issues
 */

const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const net = require('net');

console.log('🔬 Metro Deep Diagnostic Suite');
console.log('===============================\n');

const projectRoot = path.resolve(__dirname, '../../tradepass-app');
const logFile = path.join(__dirname, '../debug-notes/metro-diagnostic-log.txt');

// Comprehensive diagnostic state
const diagnostics = {
  timestamp: new Date().toISOString(),
  tests: [],
  errors: [],
  warnings: [],
  connectionAttempts: [],
  bundlingAttempts: [],
  packageIssues: [],
  metroLogs: []
};

function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${type.toUpperCase()}: ${message}`;
  
  console.log(logEntry);
  
  // Write to log file
  fs.appendFileSync(logFile, logEntry + '\n');
  
  // Add to diagnostics
  if (type === 'error') {
    diagnostics.errors.push({ timestamp, message });
  } else if (type === 'warn') {
    diagnostics.warnings.push({ timestamp, message });
  }
}

// Test 1: Package conflict detection
async function detectPackageConflicts() {
  log('🔍 Testing package conflicts...', 'info');
  
  try {
    const packageJson = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8'));
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    const conflicts = [];
    
    // Check Noble packages specifically
    if (deps['@noble/curves'] || deps['@noble/hashes']) {
      log(`Noble packages found: curves@${deps['@noble/curves']}, hashes@${deps['@noble/hashes']}`, 'info');
      
      // Check for problematic versions
      if (deps['@noble/curves'] && (deps['@noble/curves'].includes('1.9') || deps['@noble/curves'].includes('1.8'))) {
        conflicts.push('Noble curves version may cause Metro issues');
      }
      
      if (deps['@noble/hashes'] && (deps['@noble/hashes'].includes('1.8') || deps['@noble/hashes'].includes('1.9'))) {
        conflicts.push('Noble hashes version may cause Metro issues');
      }
    }
    
    // Check React/RN version conflicts
    if (deps['react'] && deps['react-native']) {
      const reactVer = deps['react'];
      const rnVer = deps['react-native'];
      log(`React versions: react@${reactVer}, react-native@${rnVer}`, 'info');
      
      if (reactVer.includes('19') && rnVer.includes('0.76')) {
        conflicts.push('React 19 + RN 0.76 known threading issues');
      }
    }
    
    diagnostics.packageIssues = conflicts;
    
    if (conflicts.length > 0) {
      log(`❌ Package conflicts detected: ${conflicts.length}`, 'error');
      conflicts.forEach(c => log(`   - ${c}`, 'error'));
      return false;
    } else {
      log('✅ No package conflicts detected', 'info');
      return true;
    }
    
  } catch (error) {
    log(`Package conflict detection failed: ${error.message}`, 'error');
    return false;
  }
}

// Test 2: Port availability and process detection
async function testPortsAndProcesses() {
  log('🔍 Testing ports and processes...', 'info');
  
  const portsToCheck = [8081, 8082, 8083, 8084, 8085, 8086, 8087, 8088, 8089, 8090];
  const portStatus = {};
  
  for (const port of portsToCheck) {
    try {
      await new Promise((resolve, reject) => {
        const server = net.createServer();
        server.listen(port, () => {
          server.close(resolve);
        });
        server.on('error', reject);
      });
      portStatus[port] = 'available';
    } catch (error) {
      portStatus[port] = 'occupied';
      
      // Get process info
      try {
        const result = await new Promise((resolve) => {
          exec(`lsof -ti:${port}`, (error, stdout) => {
            if (stdout) {
              exec(`ps -p ${stdout.trim()} -o comm=`, (error, comm) => {
                resolve(comm ? comm.trim() : 'unknown');
              });
            } else {
              resolve('unknown');
            }
          });
        });
        portStatus[port] += ` (${result})`;
      } catch (e) {
        // Ignore process lookup errors
      }
    }
  }
  
  log('Port status:', 'info');
  Object.entries(portStatus).forEach(([port, status]) => {
    log(`   Port ${port}: ${status}`, status.includes('occupied') ? 'warn' : 'info');
  });
  
  return portStatus;
}

// Test 3: Metro compilation test with full error capture
async function testMetroCompilation(port = 8090) {
  log(`🔍 Testing Metro compilation on port ${port}...`, 'info');
  
  return new Promise((resolve) => {
    const startTime = Date.now();
    let hasOutput = false;
    let stdoutData = '';
    let stderrData = '';
    
    const metro = spawn('npx', ['expo', 'start', '--port', port.toString(), '--no-tunnel'], {
      cwd: projectRoot,
      stdio: 'pipe',
      env: { ...process.env, NODE_ENV: 'development' }
    });
    
    const timeout = setTimeout(() => {
      metro.kill('SIGTERM');
      log('⏰ Metro compilation test timed out', 'warn');
      
      const result = {
        success: false,
        reason: 'timeout',
        duration: Date.now() - startTime,
        stdout: stdoutData,
        stderr: stderrData,
        port
      };
      
      diagnostics.bundlingAttempts.push(result);
      resolve(result);
    }, 60000); // 60 second timeout
    
    metro.stdout.on('data', (data) => {
      hasOutput = true;
      const output = data.toString();
      stdoutData += output;
      
      log(`METRO STDOUT: ${output.trim()}`, 'info');
      
      // Success indicators
      if (output.includes(`Waiting on http://localhost:${port}`)) {
        clearTimeout(timeout);
        metro.kill('SIGTERM');
        
        const result = {
          success: true,
          reason: 'server_ready',
          duration: Date.now() - startTime,
          stdout: stdoutData,
          stderr: stderrData,
          port
        };
        
        diagnostics.bundlingAttempts.push(result);
        log(`✅ Metro started successfully on port ${port}`, 'info');
        resolve(result);
        return;
      }
      
      // Error indicators
      if (output.includes('TypeError: The "to" argument must be of type string')) {
        clearTimeout(timeout);
        metro.kill('SIGTERM');
        
        const result = {
          success: false,
          reason: 'to_argument_error',
          duration: Date.now() - startTime,
          stdout: stdoutData,
          stderr: stderrData,
          port,
          errorDetails: 'Metro "to" argument TypeError detected'
        };
        
        diagnostics.bundlingAttempts.push(result);
        log('❌ CRITICAL ERROR: Metro "to" argument TypeError detected', 'error');
        resolve(result);
        return;
      }
      
      if (output.includes('Bundling failed')) {
        log('❌ Bundling failed detected in output', 'error');
      }
    });
    
    metro.stderr.on('data', (data) => {
      hasOutput = true;
      const error = data.toString();
      stderrData += error;
      
      log(`METRO STDERR: ${error.trim()}`, 'error');
      
      // Specific error patterns
      if (error.includes('EADDRINUSE')) {
        clearTimeout(timeout);
        metro.kill('SIGTERM');
        
        const result = {
          success: false,
          reason: 'port_in_use',
          duration: Date.now() - startTime,
          stdout: stdoutData,
          stderr: stderrData,
          port,
          errorDetails: `Port ${port} already in use`
        };
        
        diagnostics.bundlingAttempts.push(result);
        log(`❌ Port ${port} already in use`, 'error');
        resolve(result);
        return;
      }
      
      if (error.includes('@noble')) {
        log('❌ Noble package error detected in stderr', 'error');
      }
    });
    
    metro.on('close', (code) => {
      if (!hasOutput) {
        log('⚠️ No output received from Metro process', 'warn');
      }
      
      if (code !== 0 && code !== null) {
        clearTimeout(timeout);
        
        const result = {
          success: false,
          reason: 'exit_code',
          exitCode: code,
          duration: Date.now() - startTime,
          stdout: stdoutData,
          stderr: stderrData,
          port,
          errorDetails: `Metro exited with code ${code}`
        };
        
        diagnostics.bundlingAttempts.push(result);
        log(`❌ Metro exited with code ${code}`, 'error');
        resolve(result);
      }
    });
    
    metro.on('error', (error) => {
      clearTimeout(timeout);
      
      const result = {
        success: false,
        reason: 'spawn_error',
        duration: Date.now() - startTime,
        stdout: stdoutData,
        stderr: stderrData,
        port,
        errorDetails: error.message
      };
      
      diagnostics.bundlingAttempts.push(result);
      log(`❌ Metro spawn error: ${error.message}`, 'error');
      resolve(result);
    });
  });
}

// Test 4: Connection test to Metro server
async function testConnection(port = 8082) {
  log(`🔍 Testing connection to localhost:${port}...`, 'info');
  
  return new Promise((resolve) => {
    const startTime = Date.now();
    
    const client = new net.Socket();
    
    const timeout = setTimeout(() => {
      client.destroy();
      const result = {
        success: false,
        reason: 'timeout',
        duration: Date.now() - startTime,
        port
      };
      diagnostics.connectionAttempts.push(result);
      log(`❌ Connection to port ${port} timed out`, 'error');
      resolve(result);
    }, 10000);
    
    client.connect(port, 'localhost', () => {
      clearTimeout(timeout);
      client.end();
      const result = {
        success: true,
        duration: Date.now() - startTime,
        port
      };
      diagnostics.connectionAttempts.push(result);
      log(`✅ Successfully connected to port ${port}`, 'info');
      resolve(result);
    });
    
    client.on('error', (error) => {
      clearTimeout(timeout);
      const result = {
        success: false,
        reason: 'connection_error',
        error: error.message,
        duration: Date.now() - startTime,
        port
      };
      diagnostics.connectionAttempts.push(result);
      log(`❌ Connection to port ${port} failed: ${error.message}`, 'error');
      resolve(result);
    });
  });
}

// Test 5: File system and Metro config validation
async function validateMetroConfig() {
  log('🔍 Validating Metro configuration...', 'info');
  
  const metroConfigPath = path.join(projectRoot, 'metro.config.js');
  const fallbackPath = path.join(projectRoot, 'src/utils/expo-crypto-fallbacks.js');
  
  const results = {
    configExists: fs.existsSync(metroConfigPath),
    fallbackExists: fs.existsSync(fallbackPath),
    configValid: false,
    aliasesConfigured: false
  };
  
  if (results.configExists) {
    try {
      const configContent = fs.readFileSync(metroConfigPath, 'utf8');
      results.configValid = true;
      results.aliasesConfigured = configContent.includes('@noble') && configContent.includes('expo-crypto-fallbacks');
      
      log('✅ Metro config exists and is readable', 'info');
      if (results.aliasesConfigured) {
        log('✅ Noble package aliases configured', 'info');
      } else {
        log('⚠️ Noble package aliases not found in config', 'warn');
      }
    } catch (error) {
      log(`❌ Metro config exists but unreadable: ${error.message}`, 'error');
    }
  } else {
    log('❌ Metro config does not exist', 'error');
  }
  
  if (results.fallbackExists) {
    log('✅ Crypto fallback file exists', 'info');
  } else {
    log('❌ Crypto fallback file missing', 'error');
  }
  
  return results;
}

// Test 6: Multiple rapid connection attempts
async function rapidConnectionTest() {
  log('🔍 Running rapid connection test...', 'info');
  
  const ports = [8082, 8083, 8084, 8085];
  const results = [];
  
  for (const port of ports) {
    const result = await testConnection(port);
    results.push(result);
    
    // Small delay between attempts
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  const successCount = results.filter(r => r.success).length;
  log(`Connection test results: ${successCount}/${results.length} successful`, successCount > 0 ? 'info' : 'error');
  
  return results;
}

// Main diagnostic runner
async function runDeepDiagnostics() {
  log('Starting Metro Deep Diagnostic Suite...', 'info');
  log(`Project root: ${projectRoot}`, 'info');
  log(`Log file: ${logFile}`, 'info');
  log('', 'info');
  
  // Clear previous log
  if (fs.existsSync(logFile)) {
    fs.unlinkSync(logFile);
  }
  
  try {
    // Run all diagnostic tests
    diagnostics.tests.push({
      name: 'package_conflicts',
      result: await detectPackageConflicts(),
      timestamp: new Date().toISOString()
    });
    
    diagnostics.tests.push({
      name: 'ports_and_processes',
      result: await testPortsAndProcesses(),
      timestamp: new Date().toISOString()
    });
    
    diagnostics.tests.push({
      name: 'metro_config',
      result: await validateMetroConfig(),
      timestamp: new Date().toISOString()
    });
    
    // Metro compilation test
    const compilationResult = await testMetroCompilation();
    diagnostics.tests.push({
      name: 'metro_compilation',
      result: compilationResult,
      timestamp: new Date().toISOString()
    });
    
    // Connection tests (only if compilation succeeded)
    if (compilationResult.success) {
      const connectionResults = await rapidConnectionTest();
      diagnostics.tests.push({
        name: 'rapid_connections',
        result: connectionResults,
        timestamp: new Date().toISOString()
      });
    } else {
      log('⚠️ Skipping connection tests due to compilation failure', 'warn');
    }
    
    // Generate comprehensive report
    await generateDiagnosticReport();
    
  } catch (error) {
    log(`Diagnostic suite failed: ${error.message}`, 'error');
  }
}

// Generate detailed report
async function generateDiagnosticReport() {
  log('', 'info');
  log('📊 DIAGNOSTIC REPORT', 'info');
  log('===================', 'info');
  
  // Summary
  const totalTests = diagnostics.tests.length;
  const successfulTests = diagnostics.tests.filter(t => t.result && (t.result.success !== false)).length;
  log(`Tests run: ${totalTests}`, 'info');
  log(`Successful: ${successfulTests}`, 'info');
  log(`Failed: ${totalTests - successfulTests}`, 'info');
  log(`Errors: ${diagnostics.errors.length}`, 'info');
  log(`Warnings: ${diagnostics.warnings.length}`, 'info');
  log('', 'info');
  
  // Critical errors
  if (diagnostics.errors.length > 0) {
    log('🚨 CRITICAL ERRORS:', 'error');
    diagnostics.errors.forEach(error => {
      log(`   ${error.message}`, 'error');
    });
    log('', 'info');
  }
  
  // Bundling attempts analysis
  if (diagnostics.bundlingAttempts.length > 0) {
    log('📦 BUNDLING ATTEMPTS:', 'info');
    diagnostics.bundlingAttempts.forEach((attempt, i) => {
      log(`   Attempt ${i + 1}: ${attempt.success ? 'SUCCESS' : 'FAILED'}`, attempt.success ? 'info' : 'error');
      log(`      Port: ${attempt.port}`, 'info');
      log(`      Duration: ${attempt.duration}ms`, 'info');
      if (!attempt.success) {
        log(`      Reason: ${attempt.reason}`, 'error');
        if (attempt.errorDetails) {
          log(`      Details: ${attempt.errorDetails}`, 'error');
        }
      }
    });
    log('', 'info');
  }
  
  // Connection attempts analysis
  if (diagnostics.connectionAttempts.length > 0) {
    log('🔗 CONNECTION ATTEMPTS:', 'info');
    diagnostics.connectionAttempts.forEach((attempt, i) => {
      log(`   Attempt ${i + 1}: ${attempt.success ? 'SUCCESS' : 'FAILED'}`, attempt.success ? 'info' : 'error');
      log(`      Port: ${attempt.port}`, 'info');
      log(`      Duration: ${attempt.duration}ms`, 'info');
      if (!attempt.success) {
        log(`      Reason: ${attempt.reason}`, 'error');
      }
    });
    log('', 'info');
  }
  
  // Recommendations
  log('💡 RECOMMENDATIONS:', 'info');
  
  if (diagnostics.packageIssues.length > 0) {
    log('   1. Fix package conflicts:', 'info');
    diagnostics.packageIssues.forEach(issue => {
      log(`      - ${issue}`, 'info');
    });
  }
  
  const hasToError = diagnostics.errors.some(e => e.message.includes('"to" argument'));
  if (hasToError) {
    log('   2. Metro "to" argument error detected:', 'error');
    log('      - Verify metro.config.js aliases are correct', 'info');
    log('      - Check expo-crypto-fallbacks.js exists and is valid', 'info');
    log('      - Consider removing Noble packages entirely', 'info');
  }
  
  const hasConnectionIssues = diagnostics.connectionAttempts.some(a => !a.success);
  if (hasConnectionIssues) {
    log('   3. Connection issues detected:', 'warn');
    log('      - Check if Metro server is actually running', 'info');
    log('      - Verify no firewall/antivirus blocking connections', 'info');
    log('      - Try clearing Metro cache: npx expo start --clear', 'info');
  }
  
  // Save detailed report to file
  const reportPath = path.join(__dirname, '../debug-notes/diagnostic-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(diagnostics, null, 2));
  log(`Full diagnostic report saved to: ${reportPath}`, 'info');
  
  // Exit with appropriate code
  if (diagnostics.errors.length > 0) {
    process.exit(1);
  } else if (diagnostics.warnings.length > 0) {
    process.exit(2);
  } else {
    process.exit(0);
  }
}

// Run the diagnostics
runDeepDiagnostics().catch(console.error);