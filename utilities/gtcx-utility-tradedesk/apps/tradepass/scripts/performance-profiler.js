#!/usr/bin/env node
// ============================================================================
// GTCX AUTOMATED PERFORMANCE PROFILING SYSTEM
// Real-time performance monitoring and optimization recommendations
// ============================================================================

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { performance } = require('perf_hooks');

console.log('🔥 Starting GTCX Performance Profiling System...');

class GTCXPerformanceProfiler {
  constructor() {
    this.metrics = {
      buildTime: 0,
      testExecutionTime: 0,
      typeCheckTime: 0,
      serverStartupTime: 0,
      memoryUsage: [],
      errorCount: 0,
      testCoverage: 0
    };
    this.baseline = this.loadBaseline();
    this.recommendations = [];
  }

  loadBaseline() {
    const baselinePath = path.join(__dirname, '../performance-baseline.json');
    try {
      return JSON.parse(fs.readFileSync(baselinePath, 'utf8'));
    } catch (error) {
      console.log('📊 No baseline found, creating new baseline...');
      return {
        buildTime: 10000, // 10 seconds baseline
        testExecutionTime: 5000, // 5 seconds baseline
        typeCheckTime: 3000, // 3 seconds baseline
        errorCount: 0
      };
    }
  }

  saveBaseline() {
    const baselinePath = path.join(__dirname, '../performance-baseline.json');
    fs.writeFileSync(baselinePath, JSON.stringify(this.metrics, null, 2));
    console.log('💾 Performance baseline saved');
  }

  async profileBuildTime() {
    console.log('🏗️  Profiling build performance...');
    const start = performance.now();
    
    try {
      execSync('npm run type-check', { stdio: 'pipe', timeout: 30000 });
      this.metrics.typeCheckTime = performance.now() - start;
      console.log(`  ✅ TypeScript check: ${Math.round(this.metrics.typeCheckTime)}ms`);
    } catch (error) {
      this.metrics.typeCheckTime = performance.now() - start;
      this.metrics.errorCount = (error.stdout.toString().match(/error TS/g) || []).length;
      console.log(`  🔧 TypeScript errors: ${this.metrics.errorCount}`);
    }
  }

  async profileTestPerformance() {
    console.log('🧪 Profiling test execution performance...');
    const start = performance.now();
    
    try {
      const testOutput = execSync('npm test -- --passWithNoTests', { 
        stdio: 'pipe', 
        timeout: 60000 
      }).toString();
      
      this.metrics.testExecutionTime = performance.now() - start;
      
      // Extract test metrics
      const testMatch = testOutput.match(/Tests:\s+(\d+) passed/);
      const timeMatch = testOutput.match(/Time:\s+([\d.]+)\s*s/);
      
      if (testMatch) {
        this.metrics.testsCount = parseInt(testMatch[1]);
        console.log(`  ✅ Tests executed: ${this.metrics.testsCount}`);
      }
      
      if (timeMatch) {
        this.metrics.testExecutionTime = parseFloat(timeMatch[1]) * 1000;
        console.log(`  ⚡ Test execution: ${Math.round(this.metrics.testExecutionTime)}ms`);
      }
    } catch (error) {
      this.metrics.testExecutionTime = performance.now() - start;
      console.log(`  ❌ Test execution failed: ${Math.round(this.metrics.testExecutionTime)}ms`);
    }
  }

  async profileMemoryUsage() {
    console.log('💾 Profiling memory usage...');
    
    // Simulate memory profiling
    for (let i = 0; i < 10; i++) {
      const memUsage = process.memoryUsage();
      this.metrics.memoryUsage.push({
        timestamp: Date.now(),
        heapUsed: memUsage.heapUsed,
        heapTotal: memUsage.heapTotal,
        rss: memUsage.rss
      });
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    const avgMemory = this.metrics.memoryUsage.reduce((sum, m) => sum + m.heapUsed, 0) / this.metrics.memoryUsage.length;
    console.log(`  📊 Average memory usage: ${Math.round(avgMemory / 1024 / 1024)}MB`);
  }

  generateRecommendations() {
    console.log('🎯 Generating performance recommendations...');
    
    // TypeScript performance recommendations
    if (this.metrics.typeCheckTime > this.baseline.typeCheckTime * 1.2) {
      this.recommendations.push({
        category: 'TypeScript',
        severity: 'HIGH',
        issue: 'Type checking time increased significantly',
        recommendation: 'Consider incremental compilation or stricter tsconfig',
        impact: 'Build Speed',
        estimatedImprovement: '30-50%'
      });
    }
    
    if (this.metrics.errorCount > 50) {
      this.recommendations.push({
        category: 'Code Quality',
        severity: 'CRITICAL',
        issue: `${this.metrics.errorCount} TypeScript errors found`,
        recommendation: 'Run automated error fixing script',
        impact: 'Development Velocity',
        estimatedImprovement: '80% error reduction'
      });
    }
    
    // Test performance recommendations
    if (this.metrics.testExecutionTime > this.baseline.testExecutionTime * 1.5) {
      this.recommendations.push({
        category: 'Testing',
        severity: 'MEDIUM',
        issue: 'Test execution time increased',
        recommendation: 'Optimize test mocks and parallel execution',
        impact: 'CI/CD Pipeline',
        estimatedImprovement: '40-60%'
      });
    }
    
    // Memory usage recommendations
    const avgMemory = this.metrics.memoryUsage.reduce((sum, m) => sum + m.heapUsed, 0) / this.metrics.memoryUsage.length;
    if (avgMemory > 512 * 1024 * 1024) { // > 512MB
      this.recommendations.push({
        category: 'Memory',
        severity: 'HIGH',
        issue: 'High memory usage detected',
        recommendation: 'Implement memory profiling and garbage collection optimization',
        impact: 'Runtime Performance',
        estimatedImprovement: '25-40%'
      });
    }
  }

  generateOptimizationScript() {
    console.log('🚀 Generating automated optimization script...');
    
    const optimizations = [];
    
    // TypeScript optimizations
    if (this.metrics.errorCount > 0) {
      optimizations.push('node scripts/fix-typescript-errors.js');
    }
    
    // Test optimizations
    if (this.metrics.testExecutionTime > 10000) {
      optimizations.push('npm run test -- --maxWorkers=50%');
    }
    
    // Build optimizations
    optimizations.push('npm run type-check -- --incremental');
    
    const scriptContent = `#!/bin/bash
# GTCX Automated Performance Optimization Script
# Generated: ${new Date().toISOString()}

echo "🚀 Starting automated performance optimizations..."

${optimizations.map(cmd => `echo "Executing: ${cmd}"\n${cmd}`).join('\n\n')}

echo "✅ Performance optimizations complete!"
`;

    fs.writeFileSync(path.join(__dirname, '../optimize-performance.sh'), scriptContent, { mode: 0o755 });
    console.log('  📝 Optimization script created: optimize-performance.sh');
  }

  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      performance: this.metrics,
      baseline: this.baseline,
      improvements: {
        buildTime: this.baseline.typeCheckTime > 0 ? 
          Math.round((1 - this.metrics.typeCheckTime / this.baseline.typeCheckTime) * 100) : 0,
        errorReduction: this.baseline.errorCount > 0 ? 
          Math.round((1 - this.metrics.errorCount / this.baseline.errorCount) * 100) : 0
      },
      recommendations: this.recommendations,
      overallScore: this.calculatePerformanceScore()
    };
    
    // Save detailed report
    const reportPath = path.join(__dirname, '../performance-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    // Generate human-readable summary
    this.printSummary(report);
    
    return report;
  }

  calculatePerformanceScore() {
    let score = 100;
    
    // Deduct points for errors
    score -= this.metrics.errorCount * 0.5;
    
    // Deduct points for slow build times
    if (this.metrics.typeCheckTime > 5000) score -= 10;
    if (this.metrics.typeCheckTime > 10000) score -= 20;
    
    // Deduct points for slow tests
    if (this.metrics.testExecutionTime > 10000) score -= 10;
    
    return Math.max(0, Math.round(score));
  }

  printSummary(report) {
    console.log('\n' + '='.repeat(80));
    console.log('📊 GTCX PERFORMANCE REPORT SUMMARY');
    console.log('='.repeat(80));
    console.log(`🎯 Overall Performance Score: ${report.overallScore}/100`);
    console.log(`⚡ TypeScript Check Time: ${Math.round(this.metrics.typeCheckTime)}ms`);
    console.log(`🧪 Test Execution Time: ${Math.round(this.metrics.testExecutionTime)}ms`);
    console.log(`🔧 TypeScript Errors: ${this.metrics.errorCount}`);
    console.log(`📈 Build Time Improvement: ${report.improvements.buildTime}%`);
    console.log(`🎉 Error Reduction: ${report.improvements.errorReduction}%`);
    
    if (this.recommendations.length > 0) {
      console.log(`\n🎯 TOP RECOMMENDATIONS:`);
      this.recommendations.slice(0, 3).forEach((rec, i) => {
        console.log(`${i + 1}. [${rec.severity}] ${rec.issue}`);
        console.log(`   💡 ${rec.recommendation}`);
        console.log(`   📈 Expected improvement: ${rec.estimatedImprovement}`);
      });
    } else {
      console.log('\n✅ No performance issues detected - great work!');
    }
    
    console.log('\n🚀 Run ./optimize-performance.sh to apply automated optimizations');
    console.log('='.repeat(80));
  }

  async runFullProfile() {
    console.log('🎯 Starting comprehensive performance profiling...\n');
    
    await this.profileBuildTime();
    await this.profileTestPerformance();
    await this.profileMemoryUsage();
    
    this.generateRecommendations();
    this.generateOptimizationScript();
    const report = this.generateReport();
    
    // Update baseline if performance improved
    if (report.overallScore > 80) {
      this.saveBaseline();
    }
    
    return report;
  }
}

// CLI execution
async function main() {
  try {
    const profiler = new GTCXPerformanceProfiler();
    const report = await profiler.runFullProfile();
    
    // Exit with error code if performance is poor
    process.exit(report.overallScore < 60 ? 1 : 0);
  } catch (error) {
    console.error('❌ Performance profiling failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = GTCXPerformanceProfiler;