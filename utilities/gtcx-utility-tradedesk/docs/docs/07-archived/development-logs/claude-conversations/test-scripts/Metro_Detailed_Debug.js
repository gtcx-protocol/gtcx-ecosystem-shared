#!/usr/bin/env node

/**
 * Metro Detailed Debug - Capture exact error output
 */

const { spawn } = require('child_process');
const path = require('path');

const projectRoot = path.resolve(__dirname, '../../tradepass-app');

console.log('🔍 Metro Detailed Debug');
console.log('======================\n');
console.log('Starting Metro with full error capture...\n');

const metro = spawn('npx', ['expo', 'start', '--port', '8089', '--no-dev-client'], {
  cwd: projectRoot,
  stdio: 'pipe'
});

let hasOutput = false;

metro.stdout.on('data', (data) => {
  hasOutput = true;
  const output = data.toString();
  console.log('📤 STDOUT:', output);
  
  // Look for specific error patterns
  if (output.includes('TypeError')) {
    console.log('🚨 TypeError detected in Metro output!');
  }
  
  if (output.includes('Bundling failed')) {
    console.log('🚨 Bundling failure detected!');
  }
  
  if (output.includes('Waiting on http://localhost:8089')) {
    console.log('✅ Metro started successfully on port 8089');
    setTimeout(() => {
      metro.kill('SIGTERM');
      process.exit(0);
    }, 2000);
  }
});

metro.stderr.on('data', (data) => {
  hasOutput = true;
  const error = data.toString();
  console.log('📥 STDERR:', error);
  
  // Parse specific errors
  if (error.includes('EADDRINUSE')) {
    console.log('🚨 Port already in use!');
  }
  
  if (error.includes('ENOENT')) {
    console.log('🚨 Command not found!');
  }
});

metro.on('close', (code) => {
  console.log(`\n📊 Metro process exited with code: ${code}`);
  
  if (!hasOutput) {
    console.log('⚠️ No output received - possible startup issue');
  }
  
  if (code !== 0) {
    console.log('❌ Metro failed to start properly');
  }
  
  process.exit(code || 0);
});

metro.on('error', (error) => {
  console.log('🚨 Metro process error:', error);
  process.exit(1);
});

// Timeout after 30 seconds
setTimeout(() => {
  console.log('\n⏰ Timeout reached - killing Metro process');
  metro.kill('SIGTERM');
  
  if (!hasOutput) {
    console.log('❌ No output received in 30 seconds - likely blocked by compilation error');
  }
  
  process.exit(1);
}, 30000);