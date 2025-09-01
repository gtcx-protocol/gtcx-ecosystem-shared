#!/usr/bin/env node

/**
 * 🚀 GTCX AI Assistant Initialization Script
 * Usage: node scripts/start-assistant.js [project]
 * Example: --start gtcx
 * 
 * This script provides comprehensive onboarding for AI assistants to quickly
 * understand project context, identify critical tasks, and begin productive work.
 */

const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');

function printSection(title, content) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`📌 ${title}`);
  console.log('='.repeat(80));
  console.log(content);
}

function getFileContent(filePath) {
  try {
    const fullPath = path.join(projectRoot, filePath);
    if (fs.existsSync(fullPath)) {
      return `✅ Found: ${filePath}`;
    }
    return `❌ Missing: ${filePath}`;
  } catch (error) {
    return `⚠️ Error reading: ${filePath}`;
  }
}

function initializeGTCX() {
  console.log('\n🚀 GTCX AI ASSISTANT INITIALIZATION SEQUENCE');
  console.log('='.repeat(80));
  
  // Step 1: Context Acquisition
  printSection('STEP 1: PROJECT CONTEXT ACQUISITION', `
Please review these essential files in order:

1. Platform Overview:
   ${getFileContent('README.md')}
   ${getFileContent('AI_ASSISTANT.md')}

2. Documentation Structure:
   ${getFileContent('docs/docs/README.md')}
   ${getFileContent('docs/docs/09-operations/README.md')}

3. Current Sprint/Priorities:
   ${getFileContent('docs/docs/05-business/operations/agilepm.md')}
   ${getFileContent('docs/docs/04-development/setup/COMMANDS.md')}

4. Architecture & Roadmap:
   ${getFileContent('docs/docs/03-technical/architecture/systemArchitecture.md')}
   ${getFileContent('docs/docs/01-overview/projectRoadmapV2.md')}
`);

  // Step 2: Environment Assessment
  printSection('STEP 2: ENVIRONMENT ASSESSMENT', `
Check the current development environment:

1. Verify workspace structure:
   - Run: ls apps/
   - Expected: geotag/, tradepass/, tradedesk/

2. Check dependencies:
   - Run: npm list --depth=0
   - Verify all workspaces are properly linked

3. Test build status:
   - Run: npm run test:all
   - Run: npm run type-check:all
`);

  // Step 3: Priority Assessment
  printSection('STEP 3: CRITICAL PRIORITIES (P0)', `
Review current P0 blockers that need immediate attention:

1. TradePass Crypto Services (BG-TPASS-CRYPTO-001)
   - Status: Math.random() fallback instead of real crypto
   - Impact: Blocks production deployment
   - Files: apps/tradepass/src/services/crypto-stub.ts

2. Camera Module Crash (BG-CAM-001)
   - Status: Missing expo-face-detector guard
   - Impact: App crashes on camera use
   - Files: apps/geotag/app/camera.tsx

3. GPS Tracking Not Starting (BG-GPS-001)
   - Status: Start button non-functional
   - Impact: Core feature broken
   - Files: apps/geotag/app/gps.tsx

4. Production Environment Setup
   - Status: Missing API keys and credentials
   - Impact: Cannot deploy to production
   - Files: config/environments/
`);

  // Step 4: Today's Goals
  printSection('STEP 4: TODAY\'S GOALS', `
Based on priorities, focus on:

Morning (2-3 hours):
- Set up production environment variables
- Create .env.production files for all apps
- Configure API endpoints and keys

Midday (3 hours):
- Fix TradePass crypto services
- Implement real ed25519/secp256k1
- Test cryptographic signatures

Afternoon (2-3 hours):
- Fix camera crash issue
- Implement GPS background tracking
- Run comprehensive health checks
`);

  // Step 5: Commands & Workflow
  printSection('STEP 5: COMMAND REFERENCE', `
Essential commands for your workflow:

Daily Agile:
- --standup     : Daily standup report
- --goals       : Review/set daily goals
- --status      : Current system status
- --p0          : List P0 critical tasks

Development:
- --next        : Next immediate task
- --fix         : Fix most critical issue
- --test        : Run most important test
- --deploy      : Deploy to production

Quick Actions:
- --health      : Check system health
- --metrics     : Show key metrics
- --errors      : Common errors & fixes
`);

  // Step 6: Success Criteria
  printSection('STEP 6: SUCCESS CRITERIA', `
By end of session, achieve:

✅ All P0 bugs resolved
✅ Production environment configured
✅ Health checks passing
✅ Apps connect to production services
✅ No critical errors in logs

Metrics to track:
- Crash rate: <1%
- Test coverage: >80%
- Build time: <5 minutes
- Response time: <100ms
`);

  // Step 7: Action Plan
  printSection('STEP 7: IMMEDIATE ACTIONS', `
Start with these commands:

1. Create TodoWrite list for all P0 tasks
2. Run: npm run health-check
3. Review: docs/docs/09-operations/priorities/p0/
4. Update: docs/docs/09-operations/standups/[today].md
5. Begin fixing TradePass crypto services

Remember:
- Use TodoWrite to track all tasks
- Update status frequently
- Document solutions in errors/
- Commit working code often
`);

  console.log('\n' + '='.repeat(80));
  console.log('🎯 INITIALIZATION COMPLETE - BEGIN PRODUCTIVE WORK');
  console.log('='.repeat(80));
  console.log('\nFor help, use: --help');
  console.log('For daily standup, use: --standup');
  console.log('To set goals, use: --goals\n');
}

// Main execution
const project = process.argv[2] || 'gtcx';

if (project.toLowerCase() === 'gtcx') {
  initializeGTCX();
} else {
  console.log(`⚠️ Unknown project: ${project}`);
  console.log('Usage: node scripts/start-assistant.js gtcx');
}

module.exports = { initializeGTCX };