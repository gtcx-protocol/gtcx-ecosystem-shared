#!/usr/bin/env node

/**
 * Metro Health Check & Diagnostic Suite
 * Comprehensive testing for React Native/Expo Metro bundler issues
 */

const fs = require('fs');
const path = require('path');
const { spawn, exec } = require('child_process');

console.log('🔍 Metro Health Check & Diagnostic Suite');
console.log('==========================================\n');

const projectRoot = path.resolve(__dirname, '../../tradepass-app');
const results = {
  passed: 0,
  failed: 0,
  warnings: 0,
  tests: []
};

function addTest(name, status, details = '', severity = 'normal') {
  results.tests.push({ name, status, details, severity });
  
  if (status === 'PASS') {
    results.passed++;
    console.log(`✅ ${name}`);
  } else if (status === 'WARN') {
    results.warnings++;
    console.log(`⚠️  ${name}`);
  } else {
    results.failed++;
    console.log(`❌ ${name}`);
  }
  
  if (details) {
    console.log(`   ${details}\n`);
  }
}

// Test 1: Package.json validation
function testPackageJson() {
  try {
    const packagePath = path.join(projectRoot, 'package.json');
    const packageContent = fs.readFileSync(packagePath, 'utf8');
    const packageJson = JSON.parse(packageContent);
    
    addTest('Package.json is valid JSON', 'PASS', 'Package.json parsed successfully');
    
    // Check for problematic package versions
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
    const problematicPackages = [];
    
    // Check Noble packages
    if (dependencies['@noble/curves']) {
      const version = dependencies['@noble/curves'];
      if (version.includes('1.9.') || version.includes('1.8.')) {
        problematicPackages.push(`@noble/curves@${version} - known Metro issues`);
      }
    }
    
    if (dependencies['@noble/hashes']) {
      const version = dependencies['@noble/hashes'];
      if (version.includes('1.8.') || version.includes('1.9.')) {
        problematicPackages.push(`@noble/hashes@${version} - known Metro issues`);
      }
    }
    
    // Check React/React Native versions
    if (dependencies['react'] && dependencies['react-native']) {
      const reactVersion = dependencies['react'];
      const rnVersion = dependencies['react-native'];
      if (reactVersion.includes('19.') && rnVersion.includes('0.76.')) {
        problematicPackages.push('React 19 + RN 0.76 - threading issues');
      }
    }
    
    if (problematicPackages.length > 0) {
      addTest('Package versions compatibility', 'WARN', 
        `Potentially problematic packages:\n   ${problematicPackages.join('\n   ')}`, 'high');
    } else {
      addTest('Package versions compatibility', 'PASS', 'No known problematic package combinations');
    }
    
  } catch (error) {
    addTest('Package.json validation', 'FAIL', `Error: ${error.message}`, 'critical');
  }
}

// Test 2: TypeScript configuration
function testTypeScriptConfig() {
  try {
    const tsconfigPath = path.join(projectRoot, 'tsconfig.json');
    
    if (!fs.existsSync(tsconfigPath)) {
      addTest('TypeScript config exists', 'FAIL', 'tsconfig.json not found', 'critical');
      return;
    }
    
    const tsconfigContent = fs.readFileSync(tsconfigPath, 'utf8');
    const tsconfig = JSON.parse(tsconfigContent);
    
    addTest('TypeScript config is valid', 'PASS', 'tsconfig.json parsed successfully');
    
    // Check for problematic compiler options
    const compilerOptions = tsconfig.compilerOptions || {};
    
    if (compilerOptions.module && !['ES2020', 'ESNext', 'CommonJS'].includes(compilerOptions.module)) {
      addTest('TypeScript module setting', 'WARN', 
        `Module set to ${compilerOptions.module}, may cause dynamic import issues`);
    } else {
      addTest('TypeScript module setting', 'PASS', 'Module configuration compatible');
    }
    
  } catch (error) {
    addTest('TypeScript config validation', 'FAIL', `Error: ${error.message}`, 'high');
  }
}

// Test 3: Import/Export validation
function testImportExports() {
  const problematicFiles = [];
  
  function scanFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const fileName = path.relative(projectRoot, filePath);
      
      // Check for dynamic imports
      const dynamicImports = content.match(/import\s*\([^)]+\)/g) || [];
      if (dynamicImports.length > 0) {
        problematicFiles.push({
          file: fileName,
          issue: `${dynamicImports.length} dynamic imports`,
          severity: 'medium'
        });
      }
      
      // Check for problematic noble imports
      const nobleImports = content.match(/@noble\/(hashes|curves)\/[^\s'"]+/g) || [];
      if (nobleImports.length > 0) {
        const hasProblematicPaths = nobleImports.some(imp => 
          imp.includes('/crypto.js') || imp.includes('/sha256.js') || imp.includes('/ed25519.js')
        );
        if (hasProblematicPaths) {
          problematicFiles.push({
            file: fileName,
            issue: 'Problematic Noble import paths',
            severity: 'high'
          });
        }
      }
      
      // Check for undefined exports
      if (content.includes('export undefined') || content.includes('exports.undefined')) {
        problematicFiles.push({
          file: fileName,
          issue: 'Undefined exports detected',
          severity: 'critical'
        });
      }
      
    } catch (error) {
      // Skip files that can't be read
    }
  }
  
  // Scan all TypeScript and JavaScript files
  function scanDirectory(dir) {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory() && !['node_modules', '.git', '.expo'].includes(entry.name)) {
          scanDirectory(fullPath);
        } else if (entry.isFile() && /\.(ts|tsx|js|jsx)$/.test(entry.name)) {
          scanFile(fullPath);
        }
      }
    } catch (error) {
      // Skip directories that can't be read
    }
  }
  
  scanDirectory(projectRoot);
  
  if (problematicFiles.length === 0) {
    addTest('Import/Export validation', 'PASS', 'No problematic imports/exports found');
  } else {
    const critical = problematicFiles.filter(f => f.severity === 'critical');
    const high = problematicFiles.filter(f => f.severity === 'high');
    const medium = problematicFiles.filter(f => f.severity === 'medium');
    
    if (critical.length > 0) {
      addTest('Critical import/export issues', 'FAIL', 
        `${critical.length} critical issues:\n   ${critical.map(f => `${f.file}: ${f.issue}`).join('\n   ')}`, 'critical');
    }
    
    if (high.length > 0) {
      addTest('High-priority import issues', 'WARN',
        `${high.length} high-priority issues:\n   ${high.map(f => `${f.file}: ${f.issue}`).join('\n   ')}`, 'high');
    }
    
    if (medium.length > 0) {
      addTest('Medium-priority import issues', 'WARN',
        `${medium.length} medium-priority issues found`, 'medium');
    }
  }
}

// Test 4: Metro configuration
function testMetroConfig() {
  const metroConfigPath = path.join(projectRoot, 'metro.config.js');
  
  if (fs.existsSync(metroConfigPath)) {
    try {
      const metroContent = fs.readFileSync(metroConfigPath, 'utf8');
      addTest('Metro config exists', 'PASS', 'metro.config.js found');
      
      // Check for resolver configurations
      if (metroContent.includes('resolver') && metroContent.includes('alias')) {
        addTest('Metro resolver configured', 'PASS', 'Custom resolver configuration detected');
      } else {
        addTest('Metro resolver configured', 'WARN', 
          'No custom resolver - may need path aliases for complex imports');
      }
      
    } catch (error) {
      addTest('Metro config validation', 'FAIL', `Error reading metro.config.js: ${error.message}`);
    }
  } else {
    addTest('Metro config exists', 'WARN', 'No metro.config.js - using defaults');
  }
}

// Test 5: Node modules integrity
function testNodeModules() {
  const nodeModulesPath = path.join(projectRoot, 'node_modules');
  
  if (!fs.existsSync(nodeModulesPath)) {
    addTest('Node modules exist', 'FAIL', 'node_modules directory not found - run npm install', 'critical');
    return;
  }
  
  addTest('Node modules exist', 'PASS', 'node_modules directory found');
  
  // Check specific problematic packages
  const packagesToCheck = [
    '@noble/curves',
    '@noble/hashes',
    'react',
    'react-native',
    'expo'
  ];
  
  const missingPackages = [];
  const packageVersions = {};
  
  for (const pkg of packagesToCheck) {
    const pkgPath = path.join(nodeModulesPath, pkg, 'package.json');
    try {
      if (fs.existsSync(pkgPath)) {
        const pkgJson = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        packageVersions[pkg] = pkgJson.version;
      } else {
        missingPackages.push(pkg);
      }
    } catch (error) {
      missingPackages.push(pkg);
    }
  }
  
  if (missingPackages.length > 0) {
    addTest('Required packages present', 'FAIL',
      `Missing packages: ${missingPackages.join(', ')}`, 'high');
  } else {
    addTest('Required packages present', 'PASS', 'All required packages found');
    
    // Log versions for debugging
    const versionInfo = Object.entries(packageVersions)
      .map(([pkg, version]) => `${pkg}@${version}`)
      .join('\n   ');
    addTest('Package versions', 'PASS', `Installed versions:\n   ${versionInfo}`);
  }
}

// Test 6: Expo configuration
function testExpoConfig() {
  const expoConfigPaths = [
    path.join(projectRoot, 'expo.json'),
    path.join(projectRoot, 'app.json'),
    path.join(projectRoot, 'app.config.js'),
    path.join(projectRoot, 'app.config.ts')
  ];
  
  let configFound = false;
  
  for (const configPath of expoConfigPaths) {
    if (fs.existsSync(configPath)) {
      configFound = true;
      try {
        const configName = path.basename(configPath);
        
        if (configName.endsWith('.json')) {
          const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
          addTest('Expo config valid', 'PASS', `${configName} parsed successfully`);
        } else {
          addTest('Expo config exists', 'PASS', `${configName} found (dynamic config)`);
        }
      } catch (error) {
        addTest('Expo config validation', 'FAIL', 
          `Error parsing ${path.basename(configPath)}: ${error.message}`, 'high');
      }
      break;
    }
  }
  
  if (!configFound) {
    addTest('Expo config exists', 'FAIL', 
      'No Expo configuration file found (expo.json, app.json, app.config.js)', 'critical');
  }
}

// Test 7: Port availability
async function testPortAvailability() {
  return new Promise((resolve) => {
    exec('lsof -i :8082 -i :8083 -i :8084 -i :8085 -i :8086 -i :8087', (error, stdout) => {
      const occupiedPorts = [];
      
      if (stdout) {
        const lines = stdout.split('\n');
        for (const line of lines) {
          if (line.includes('LISTEN')) {
            const portMatch = line.match(/:(\d+)\s/);
            if (portMatch) {
              occupiedPorts.push(portMatch[1]);
            }
          }
        }
      }
      
      if (occupiedPorts.length > 0) {
        addTest('Port availability', 'WARN',
          `Ports in use: ${occupiedPorts.join(', ')} - may need to use different port`, 'medium');
      } else {
        addTest('Port availability', 'PASS', 'Common Expo ports (8082-8087) available');
      }
      
      resolve();
    });
  });
}

// Test 8: Compilation test
async function testCompilation() {
  return new Promise((resolve) => {
    console.log('🔍 Running TypeScript compilation test...\n');
    
    const tsc = spawn('npx', ['tsc', '--noEmit', '--skipLibCheck'], {
      cwd: projectRoot,
      stdio: 'pipe'
    });
    
    let stdout = '';
    let stderr = '';
    
    tsc.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    tsc.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    const timeout = setTimeout(() => {
      tsc.kill('SIGTERM');
      addTest('TypeScript compilation', 'WARN', 
        'Compilation test timed out after 30 seconds', 'medium');
      resolve();
    }, 30000);
    
    tsc.on('close', (code) => {
      clearTimeout(timeout);
      
      if (code === 0) {
        addTest('TypeScript compilation', 'PASS', 'No compilation errors found');
      } else {
        const errorCount = (stderr.match(/error TS\d+/g) || []).length;
        const warningCount = (stderr.match(/warning TS\d+/g) || []).length;
        
        if (errorCount > 50) {
          addTest('TypeScript compilation', 'FAIL',
            `${errorCount} compilation errors - likely blocking Metro`, 'critical');
        } else if (errorCount > 10) {
          addTest('TypeScript compilation', 'WARN',
            `${errorCount} compilation errors, ${warningCount} warnings`, 'high');
        } else {
          addTest('TypeScript compilation', 'WARN',
            `${errorCount} minor compilation errors`, 'medium');
        }
      }
      resolve();
    });
  });
}

// Test 9: Metro server test
async function testMetroServer() {
  return new Promise((resolve) => {
    console.log('🔍 Testing Metro server startup...\n');
    
    const metro = spawn('npx', ['expo', 'start', '--port', '8088', '--no-dev-client'], {
      cwd: projectRoot,
      stdio: 'pipe'
    });
    
    let output = '';
    let serverReady = false;
    
    const timeout = setTimeout(() => {
      metro.kill('SIGTERM');
      if (!serverReady) {
        addTest('Metro server startup', 'FAIL',
          'Metro failed to start within 45 seconds - likely compilation error', 'critical');
      }
      resolve();
    }, 45000);
    
    metro.stdout.on('data', (data) => {
      output += data.toString();
      
      // Check for success indicators
      if (output.includes('Waiting on http://localhost:8088')) {
        serverReady = true;
        metro.kill('SIGTERM');
        clearTimeout(timeout);
        addTest('Metro server startup', 'PASS', 'Metro server started successfully');
        resolve();
      }
      
      // Check for error indicators
      if (output.includes('TypeError: The "to" argument must be of type string')) {
        metro.kill('SIGTERM');
        clearTimeout(timeout);
        addTest('Metro server startup', 'FAIL',
          'Metro "to" argument error - Noble package issue detected', 'critical');
        resolve();
      }
      
      if (output.includes('Error: EADDRINUSE')) {
        metro.kill('SIGTERM');
        clearTimeout(timeout);
        addTest('Metro server startup', 'FAIL',
          'Port already in use - kill existing processes', 'high');
        resolve();
      }
    });
    
    metro.stderr.on('data', (data) => {
      const error = data.toString();
      if (error.includes('ENOENT') || error.includes('command not found')) {
        metro.kill('SIGTERM');
        clearTimeout(timeout);
        addTest('Metro server startup', 'FAIL',
          'Expo CLI not found - run npm install -g @expo/cli', 'critical');
        resolve();
      }
    });
    
    metro.on('close', (code) => {
      if (!serverReady && code !== 0 && code !== null) {
        clearTimeout(timeout);
        addTest('Metro server startup', 'FAIL',
          `Metro exited with code ${code}`, 'critical');
        resolve();
      }
    });
  });
}

// Main execution
async function runHealthCheck() {
  console.log('Starting comprehensive Metro health check...\n');
  
  // Run synchronous tests
  testPackageJson();
  testTypeScriptConfig();
  testImportExports();
  testMetroConfig();
  testNodeModules();
  testExpoConfig();
  
  // Run asynchronous tests
  await testPortAvailability();
  await testCompilation();
  await testMetroServer();
  
  // Generate report
  console.log('\n📊 Health Check Results');
  console.log('========================');
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`⚠️  Warnings: ${results.warnings}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📈 Success Rate: ${((results.passed / (results.passed + results.warnings + results.failed)) * 100).toFixed(1)}%\n`);
  
  // Categorize issues
  const critical = results.tests.filter(t => t.severity === 'critical' && t.status === 'FAIL');
  const high = results.tests.filter(t => t.severity === 'high' && (t.status === 'FAIL' || t.status === 'WARN'));
  
  console.log('🚨 Issue Summary');
  console.log('================');
  
  if (critical.length > 0) {
    console.log(`❌ CRITICAL ISSUES (${critical.length}) - Metro will likely fail:`);
    critical.forEach(issue => {
      console.log(`   • ${issue.name}: ${issue.details.split('\n')[0]}`);
    });
    console.log('');
  }
  
  if (high.length > 0) {
    console.log(`⚠️  HIGH PRIORITY (${high.length}) - May cause issues:`);
    high.forEach(issue => {
      console.log(`   • ${issue.name}: ${issue.details.split('\n')[0]}`);
    });
    console.log('');
  }
  
  // Provide recommendations
  console.log('💡 Recommendations');
  console.log('==================');
  
  if (critical.length === 0 && high.length === 0) {
    console.log('✅ Your setup looks healthy! Metro should start successfully.');
  } else {
    console.log('⚠️  Address the issues above before starting Metro:');
    
    if (results.tests.some(t => t.details.includes('Noble package'))) {
      console.log('   1. Fix Noble packages: npm install @noble/curves@1.3.0 @noble/hashes@1.3.3 --force');
    }
    
    if (results.tests.some(t => t.details.includes('node_modules'))) {
      console.log('   2. Reinstall dependencies: rm -rf node_modules && npm install');
    }
    
    if (results.tests.some(t => t.details.includes('compilation errors'))) {
      console.log('   3. Fix TypeScript errors: npx tsc --noEmit --skipLibCheck');
    }
    
    if (results.tests.some(t => t.details.includes('Port'))) {
      console.log('   4. Kill existing processes: lsof -ti:8082 | xargs kill -9');
    }
  }
  
  console.log('\n🔍 Run this health check anytime with:');
  console.log('node claude/test-scripts/Metro_Health_Check.js\n');
  
  // Exit code based on results
  if (critical.length > 0) {
    process.exit(1);
  } else if (high.length > 0) {
    process.exit(2);
  } else {
    process.exit(0);
  }
}

// Run the health check
runHealthCheck().catch(console.error);