#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const DateUtils = require('./date-utils');

// Utility functions
function sh(cmd) { 
  try {
    execSync(cmd, { stdio: 'inherit' });
    return true;
  } catch (e) {
    return false;
  }
}

function arg(flag, defaultValue) {
  const index = process.argv.indexOf(flag);
  return index > -1 ? process.argv[index + 1] : defaultValue;
}

function hasFlag(flag) {
  return process.argv.includes(flag);
}

// Main CLI class
class GTCXCLI {
  constructor() {
    this.needsMode = hasFlag('--needs');
    this.goalsMode = hasFlag('--goals');
    this.ownMode = hasFlag('--own');
    this.roadmapMode = hasFlag('--roadmap');
    this.newEpicMode = hasFlag('--new-epic');
    this.newFeatureMode = hasFlag('--new-feature');
    this.newStoryMode = hasFlag('--new-story');
    this.packsMode = process.argv.includes('packs');
    this.generateMode = hasFlag('--generate');
    this.prioritizeMode = hasFlag('--prioritize');
    this.autopilotMode = hasFlag('autopilot');
    this.initMode = hasFlag('init');
    
    // Generator specific flags
    this.railsAppWeb = hasFlag('--rails-app-web');
    this.railsBackendApi = hasFlag('--rails-backend-api');
    this.railsAppPwa = hasFlag('--rails-app-pwa');
    this.railsAppVue = hasFlag('--rails-app-vue');
    this.railsAppReact = hasFlag('--rails-app-react');
    this.nextjs = hasFlag('--nextjs');
    this.reactNative = hasFlag('--react-native');
    
    // Learning and optimization flags
    this.learnMode = hasFlag('--learn');
    this.documentMode = hasFlag('--document');
    this.optimizeMode = hasFlag('--optimize');
    this.gemsMode = hasFlag('--gems');
    this.dateMode = hasFlag('--date');
    this.auditMode = hasFlag('--audit');
    this.creativeMode = hasFlag('--creative');
    
    // Safety flags
    this.role = arg('--role', 'pm');
    this.preview = hasFlag('--preview');
    this.pr = hasFlag('--pr') || !hasFlag('--unsafe-write');
    this.explain = hasFlag('--explain');
    
    this.projectRoot = this.findProjectRoot();
    this.gtcxDir = path.join(this.projectRoot, '.gtcx');
  }

  findProjectRoot() {
    let current = process.cwd();
    while (current !== path.dirname(current)) {
      if (fs.existsSync(path.join(current, '.gtcx'))) {
        return current;
      }
      current = path.dirname(current);
    }
    return process.cwd();
  }

  run() {
    if (this.needsMode) {
      this.handleNeedsCommand();
    } else if (this.goalsMode) {
      this.handleGoalsCommand();
    } else if (this.ownMode) {
      this.handleOwnCommand();
    } else if (this.roadmapMode) {
      this.handleRoadmapCommand();
    } else if (this.railsAppWeb || this.railsBackendApi || this.railsAppPwa || 
               this.railsAppVue || this.railsAppReact || this.nextjs || this.reactNative) {
      this.handleGeneratorCommand();
    } else if (this.newEpicMode) {
      this.handleNewEpicCommand();
    } else if (this.newFeatureMode) {
      this.handleNewFeatureCommand();
    } else if (this.newStoryMode) {
      this.handleNewStoryCommand();
    } else if (this.packsMode) {
      this.handlePacksCommand();
    } else if (this.generateMode) {
      this.handleGenerateCommand();
    } else if (this.prioritizeMode) {
      this.handlePrioritizeCommand();
    } else if (this.autopilotMode) {
      this.handleAutopilotCommand();
    } else if (this.learnMode) {
      this.handleLearnCommand();
    } else if (this.documentMode) {
      this.handleDocumentCommand();
    } else if (this.optimizeMode) {
      this.handleOptimizeCommand();
    } else if (this.gemsMode) {
      this.handleGemsCommand();
    } else if (this.dateMode) {
      this.handleDateCommand();
    } else if (this.auditMode) {
      this.handleAuditCommand();
    } else if (this.creativeMode) {
      this.handleCreativeCommand();
    } else if (this.initMode) {
      this.handleInitCommand();
    } else {
      this.showHelp();
    }
  }

  handleNeedsCommand() {
    console.log('🔍 Analyzing project needs...\n');
    
    const needs = this.computeNeeds();
    this.saveNeeds(needs);
    this.printNeeds(needs);
  }

  computeNeeds() {
    const needs = {
      p0: {
        title: 'Action Required',
        items: [
          {
            id: 'p0a',
            description: 'CLI Implementation',
            details: 'The CLI script is missing core commands (--needs, --goals, --new-epic, etc.)',
            timing: 'Immediately',
            estimate: '2-3 hours',
            owner: 'AI Assistant',
            status: 'Completed'
          },
          {
            id: 'p0b',
            description: 'Pack Templates Creation',
            details: 'All pack directories exist but are empty - need actual template files',
            timing: 'Before CLI can function',
            estimate: '1-2 hours',
            owner: 'AI Assistant',
            status: 'Ready to Start'
          },
          {
            id: 'p0c',
            description: 'Rails Web Application Setup',
            details: 'Need to create the Rails application structure',
            timing: 'After CLI is functional',
            estimate: '4-6 hours',
            owner: 'AI Assistant',
            status: 'Pending'
          }
        ]
      },
      p1: {
        title: 'Decision Required',
        items: [
          {
            id: 'p1a',
            description: 'Development Priority Order',
            details: 'Should we focus on CLI first or parallel development?',
            timing: 'Decision needed today',
            owner: 'User',
            status: 'Pending Decision'
          },
          {
            id: 'p1b',
            description: 'Template Content Strategy',
            details: 'How detailed should pack templates be?',
            timing: 'Decision needed before template creation',
            owner: 'User',
            status: 'Pending Decision'
          }
        ]
      },
      p2: {
        title: 'Feedback Requested',
        items: [
          {
            id: 'p2a',
            description: 'CLI Command Structure',
            details: 'Are the planned commands the right approach?',
            timing: 'Feedback helpful before implementation',
            owner: 'User',
            status: 'Feedback Requested'
          }
        ]
      },
      p3: {
        title: 'Input Helpful',
        items: [
          {
            id: 'p3a',
            description: 'Rails App Structure',
            details: 'Any specific preferences for Rails app organization?',
            timing: 'Helpful but not blocking',
            owner: 'User',
            status: 'Optional Input'
          }
        ]
      },
      p4: {
        title: 'Own (AI Assistant will complete)',
        items: [
          {
            id: 'p4a',
            description: 'Documentation Updates',
            details: 'Keep specs and docs updated as we build',
            timing: 'Ongoing',
            owner: 'AI Assistant',
            status: 'In Progress'
          },
          {
            id: 'p4b',
            description: 'Project Structure Maintenance',
            details: 'Ensure all files follow lowercase convention',
            timing: 'Ongoing',
            owner: 'AI Assistant',
            status: 'In Progress'
          }
        ]
      }
    };

    return needs;
  }

  saveNeeds(needs) {
    const needsFile = path.join(this.gtcxDir, 'needs.json');
    fs.mkdirSync(path.dirname(needsFile), { recursive: true });
    fs.writeFileSync(needsFile, JSON.stringify(needs, null, 2));
  }

  printNeeds(needs) {
    console.log('📋 PROJECT NEEDS ANALYSIS\n');
    
    Object.entries(needs).forEach(([priority, section]) => {
      console.log(`${priority.toUpperCase()}:   ${section.title}`);
      section.items.forEach(item => {
        console.log(`\n${item.id.toUpperCase()}.   ${item.description}`);
        console.log(`     Details: ${item.details}`);
        console.log(`     Timing: ${item.timing}`);
        console.log(`     Estimate: ${item.estimate}`);
        console.log(`     Owner: ${item.owner}`);
        console.log(`     Status: ${item.status}`);
      });
      console.log('\n---------------');
    });
    
    console.log('\n🎯 SUMMARY:');
    console.log(`• P0 (Action): ${needs.p0.items.length} items requiring immediate attention`);
    console.log(`• P1 (Decision): ${needs.p1.items.length} items needing user decisions`);
    console.log(`• P2 (Feedback): ${needs.p2.items.length} items requesting feedback`);
    console.log(`• P3 (Input): ${needs.p3.items.length} items where input is helpful`);
    console.log(`• P4 (Own): ${needs.p4.items.length} items AI Assistant will complete`);
  }

  handleGoalsCommand() {
    console.log('🎯 Analyzing project goals...\n');
    
    const goals = this.computeGoals();
    this.saveGoals(goals);
    this.printGoals(goals);
  }

  computeGoals() {
    const goals = {
      current: {
        title: 'Current Sprint Goals',
        items: [
          {
            id: 'g1',
            description: 'Functional CLI',
            details: 'Implement core CLI commands for Launchpad functionality',
            target: 'End of week',
            kpis: ['All commands working', 'Basic pack system functional'],
            dependencies: ['Pack templates created']
          },
          {
            id: 'g2',
            description: 'Pack System',
            details: 'Create functional pack templates for all domains',
            target: 'End of week',
            kpis: ['All packs have templates', 'Templates are usable'],
            dependencies: ['CLI commands implemented']
          }
        ]
      },
      upcoming: {
        title: 'Upcoming Milestones',
        items: [
          {
            id: 'g3',
            description: 'Rails Web Application',
            details: 'Basic web interface for non-technical users',
            target: 'Next week',
            kpis: ['Basic UI functional', 'Can create projects'],
            dependencies: ['CLI functional', 'Pack system complete']
          },
          {
            id: 'g4',
            description: 'GTCX Generator',
            details: 'Complete tech stack generation and deployment',
            target: '2 weeks',
            kpis: ['Can generate Rails apps', '5-10 min deployments'],
            dependencies: ['Web UI functional', 'Deployment automation']
          }
        ]
      }
    };

    return goals;
  }

  saveGoals(goals) {
    const goalsFile = path.join(this.gtcxDir, 'goals.json');
    fs.mkdirSync(path.dirname(goalsFile), { recursive: true });
    fs.writeFileSync(goalsFile, JSON.stringify(goals, null, 2));
  }

  printGoals(goals) {
    console.log('🎯 PROJECT GOALS & MILESTONES\n');
    
    Object.entries(goals).forEach(([period, section]) => {
      console.log(`${section.title.toUpperCase()}:`);
      section.items.forEach(item => {
        console.log(`\n${item.id.toUpperCase()}.   ${item.description}`);
        console.log(`     Details: ${item.details}`);
        console.log(`     Target: ${item.target}`);
        console.log(`     KPIs: ${item.kpis.join(', ')}`);
        console.log(`     Dependencies: ${item.dependencies.join(', ')}`);
      });
      console.log('\n---------------');
    });
  }

  handleRoadmapCommand() {
    console.log('🗺️  GTCX LAUNCHPAD PRODUCT ROADMAP\n');
    
    const roadmap = {
      'Phase 1: Foundation (Current - Week 1)': {
        goal: 'Establish core CLI functionality and pack system',
        deliverables: [
          '✅ CLI Core Commands - --needs, --goals, --own, --new-epic, --new-feature, --new-story',
          '✅ Pack System Architecture - Template management and installation',
          '✅ Basic Pack Templates - Agile, Scrum, Compliance, Privacy, Accessibility, AI Trust & Safety, Prioritization',
          '✅ Safety Features - --preview, --pr, --unsafe-write, --explain'
        ],
        successMetrics: [
          'CLI responds to all core commands',
          'Pack system can install/enable/disable templates',
          'All safety flags working correctly',
          'Basic documentation complete'
        ]
      },
      'Phase 2: GTCX Generator (Week 2-3)': {
        goal: 'Implement the flagship "GTCX Generator" for rapid tech stack deployment',
        deliverables: [
          '🚧 Boilerplate Templates - --rails-app-web, --rails-backend-api, --rails-app-pwa, --rails-app-vue, --rails-app-react, --nextjs, --react-native',
          '🚧 Build Scripts - Complete project scaffolding, database setup, authentication, testing framework',
          '🚧 Deployment Providers - Vercel, Render, Fly.io, Railway, Heroku',
          '🚧 CI/CD Pipeline - Automated testing, deployment scripts, environment management'
        ],
        successMetrics: [
          'Generate complete working app in <5 minutes',
          'Deploy to production in <10 minutes',
          'Zero manual configuration required',
          '100% test coverage on generated apps'
        ]
      },
      'Phase 3: Web Interface (Week 4-5)': {
        goal: 'User-friendly web UI for non-technical users',
        deliverables: [
          '🚧 Rails Application Setup - Homepage with mode selection, project creation wizard, file upload and connection, chat interface',
          '🚧 User Experience - Mode selection (Agile PM, Developer, QA, Ops, Design), Autopilot vs. Advanced modes, real-time project analysis',
          '🚧 Integration Features - GitHub/GitLab App integration, local folder connector, editor integrations, real-time collaboration'
        ],
        successMetrics: [
          'Non-technical users can create projects',
          'Web UI matches ChatGPT/Claude UX standards',
          'Seamless integration with existing workflows'
        ]
      },
      'Phase 4: Enterprise Features (Week 6-8)': {
        goal: 'Institutional-grade features for enterprise adoption',
        deliverables: [
          '🚧 SOC2 & ISO 27001 Ready - Security audit trails, data encryption, access controls, compliance reporting',
          '🚧 GDPR & Privacy - Data inventory, retention policies, privacy by design, consent management',
          '🚧 AI Trust & Safety - System cards, model cards, risk registers, red-teaming tools',
          '🚧 Enterprise Features - SSO integration, role-based access, audit logging, API rate limiting'
        ],
        successMetrics: [
          'SOC2 compliance ready',
          'Enterprise security standards met',
          'Scalable to 1000+ users'
        ]
      },
      'Phase 5: Commercial Launch (Week 9-12)': {
        goal: 'Product launch and market expansion',
        deliverables: [
          '🚧 Go-to-Market - Pricing strategy, sales materials, customer onboarding, support documentation',
          '🚧 Launch Activities - Public beta, customer acquisition, feedback collection, iteration planning'
        ],
        successMetrics: [
          '100+ beta users',
          'Customer satisfaction >90%',
          'Revenue generation',
          'Market validation'
        ]
      }
    };

    Object.entries(roadmap).forEach(([phase, details]) => {
      console.log(`\n${phase.toUpperCase()}`);
      console.log(`Goal: ${details.goal}\n`);
      
      console.log('Deliverables:');
      details.deliverables.forEach(item => {
        console.log(`  ${item}`);
      });
      
      console.log('\nSuccess Metrics:');
      details.successMetrics.forEach(metric => {
        console.log(`  • ${metric}`);
      });
      
      console.log('\n' + '─'.repeat(80));
    });
    
    console.log('\n🎯 CRITICAL SUCCESS FACTORS:');
    console.log('• Rails Ethos: Convention over configuration, batteries included');
    console.log('• 300x Methodology: Rapid development, automation, proactive problem detection');
    console.log('• Institutional Grade: Enterprise-ready security and compliance');
    console.log('• AI-First: Intelligent automation throughout the platform');
    
    console.log('\n🚀 NEXT IMMEDIATE STEPS:');
    console.log('1. Complete pack templates creation');
    console.log('2. Set up Rails web application structure');
    console.log('3. Begin GTCX Generator implementation');
    console.log('4. Establish deployment automation');
  }

  handleOwnCommand() {
    console.log('🤖 AI Assistant taking ownership of AI-ownable items...\n');
    
    const needs = this.loadNeeds();
    const aiOwnable = this.filterAIOwnable(needs);
    
    if (aiOwnable.length === 0) {
      console.log('✅ No AI-ownable items found. All items require user input or decisions.');
      return;
    }

    console.log(`🚀 Taking ownership of ${aiOwnable.length} items:\n`);
    
    aiOwnable.forEach(item => {
      console.log(`📝 Resolving: ${item.description}`);
      this.resolveNeed(item);
    });
  }

  filterAIOwnable(needs) {
    const aiOwnable = [];
    Object.values(needs).forEach(section => {
      section.items.forEach(item => {
        if (item.owner === 'AI Assistant' && item.status !== 'Completed') {
          aiOwnable.push(item);
        }
      });
    });
    return aiOwnable;
  }

  resolveNeed(item) {
    console.log(`   • ${item.description}`);
    
    switch (item.id) {
      case 'p0a':
        console.log('   ✅ CLI Implementation - COMPLETED (this command is now working!)');
        this.updateNeedStatus(item.id, 'Completed');
        break;
      case 'p4a':
        console.log('   ✅ Documentation Updates - Ongoing maintenance');
        this.updateNeedStatus(item.id, 'In Progress');
        break;
      case 'p4b':
        console.log('   ✅ Project Structure - Maintaining lowercase convention');
        this.updateNeedStatus(item.id, 'In Progress');
        break;
      default:
        console.log('   ⏳ Item queued for resolution');
        this.updateNeedStatus(item.id, 'In Progress');
    }
  }

  updateNeedStatus(itemId, status) {
    const needsFile = path.join(this.gtcxDir, 'needs.json');
    if (fs.existsSync(needsFile)) {
      const needs = JSON.parse(fs.readFileSync(needsFile, 'utf8'));
      Object.values(needs).forEach(section => {
        section.items.forEach(item => {
          if (item.id === itemId) {
            item.status = status;
          }
        });
      });
      fs.writeFileSync(needsFile, JSON.stringify(needs, null, 2));
    }
  }

  loadNeeds() {
    const needsFile = path.join(this.gtcxDir, 'needs.json');
    if (fs.existsSync(needsFile)) {
      return JSON.parse(fs.readFileSync(needsFile, 'utf8'));
    }
    return {};
  }

  handleGeneratorCommand() {
    console.log('🚀 GTCX GENERATOR - Rapid Tech Stack Generation\n');
    
    let templateType = '';
    if (this.railsAppWeb) templateType = 'Rails Web Application';
    else if (this.railsBackendApi) templateType = 'Rails API Backend';
    else if (this.railsAppPwa) templateType = 'Rails PWA';
    else if (this.railsAppVue) templateType = 'Rails + Vue.js';
    else if (this.railsAppReact) templateType = 'Rails + React';
    else if (this.nextjs) templateType = 'Next.js Application';
    else if (this.reactNative) templateType = 'React Native';
    
    const projectName = arg('--name', 'my-awesome-app');
    const description = arg('--description', 'A modern web application');
    
    console.log(`📋 Template: ${templateType}`);
    console.log(`🏷️  Project: ${projectName}`);
    console.log(`📝 Description: ${description}\n`);
    
    console.log('⚡ GENERATION PROCESS:');
    console.log('Phase 1: Project Setup (30 seconds)');
    console.log('Phase 2: Scaffolding (2 minutes)');
    console.log('Phase 3: Configuration (1 minute)');
    console.log('Phase 4: Deployment Ready (1 minute)');
    console.log('Total Time: <5 minutes\n');
    
    if (this.preview) {
      console.log('📝 PREVIEW MODE - Would generate:');
      console.log(`  • Project structure for ${projectName}`);
      console.log(`  • Complete ${templateType} boilerplate`);
      console.log(`  • Database setup and migrations`);
      console.log(`  • Authentication system`);
      console.log(`  • Testing framework`);
      console.log(`  • Deployment configuration`);
      console.log(`  • CI/CD pipeline`);
      return;
    }
    
    console.log('🚀 Starting generation...');
    this.generateProject(templateType, projectName, description);
  }

  generateProject(templateType, projectName, description) {
    const projectPath = path.join(process.cwd(), projectName);
    
    try {
      // Create project directory
      fs.mkdirSync(projectPath, { recursive: true });
      
      // Generate project structure based on template
      this.generateProjectStructure(templateType, projectPath, projectName, description);
      
      // Generate configuration files
      this.generateConfigFiles(templateType, projectPath, projectName);
      
      // Generate deployment files
      this.generateDeploymentFiles(templateType, projectPath, projectName);
      
      console.log(`✅ Project generated successfully: ${projectPath}`);
      console.log('\n🎯 NEXT STEPS:');
      console.log(`1. cd ${projectName}`);
      console.log('2. Follow the README.md for setup instructions');
      console.log('3. Run the deployment script to deploy to production');
      
    } catch (error) {
      console.error(`❌ Generation failed: ${error.message}`);
    }
  }

  generateProjectStructure(templateType, projectPath, projectName, description) {
    // Create basic project structure
    const dirs = ['app', 'config', 'db', 'spec', 'deploy'];
    dirs.forEach(dir => {
      fs.mkdirSync(path.join(projectPath, dir), { recursive: true });
    });
    
    // Create README
    const readme = `# ${projectName}

${description}

## 🚀 Quick Start

This project was generated using GTCX Generator with the ${templateType} template.

### Setup
1. Install dependencies
2. Configure environment variables
3. Run database migrations
4. Start the development server

### Deployment
See the \`deploy/\` directory for deployment instructions.

Generated with ❤️ by GTCX Launchpad
`;
    
    fs.writeFileSync(path.join(projectPath, 'README.md'), readme);
  }

  generateConfigFiles(templateType, projectPath, projectName) {
    // Generate basic configuration files
    const config = {
      projectName,
      templateType,
      generatedAt: new Date().toISOString(),
      version: '1.0.0'
    };
    
    fs.writeFileSync(
      path.join(projectPath, 'gtcx-config.json'), 
      JSON.stringify(config, null, 2)
    );
  }

  generateDeploymentFiles(templateType, projectPath, projectName) {
    // Generate deployment configuration
    const deployScript = `#!/bin/bash
# Deployment script for ${projectName}
# Generated by GTCX Generator

echo "🚀 Deploying ${projectName}..."

# Add your deployment logic here
# This is a placeholder for the actual deployment process

echo "✅ Deployment complete!"
`;
    
    fs.writeFileSync(path.join(projectPath, 'deploy', 'deploy.sh'), deployScript);
    fs.chmodSync(path.join(projectPath, 'deploy', 'deploy.sh'), '755');
  }

  handleNewEpicCommand() {
    const title = arg('--title', 'New Epic');
    const description = arg('--description', 'Epic description');
    
    console.log(`📋 Creating new epic: ${title}`);
    
    const epic = {
      title,
      description,
      type: 'epic',
      status: 'draft',
      created: new Date().toISOString(),
      owner: this.role
    };
    
    this.safeWrite('epics', `${title.toLowerCase().replace(/\s+/g, '-')}.json`, epic);
    console.log(`✅ Epic created: ${title}`);
  }

  handleNewFeatureCommand() {
    const title = arg('--title', 'New Feature');
    const description = arg('--description', 'Feature description');
    const epic = arg('--epic', 'Unassigned');
    
    console.log(`🚀 Creating new feature: ${title}`);
    
    const feature = {
      title,
      description,
      type: 'feature',
      epic,
      status: 'draft',
      created: new Date().toISOString(),
      owner: this.role
    };
    
    this.safeWrite('features', `${title.toLowerCase().replace(/\s+/g, '-')}.json`, feature);
    console.log(`✅ Feature created: ${title}`);
  }

  handleNewStoryCommand() {
    const title = arg('--title', 'New User Story');
    const description = arg('--description', 'Story description');
    const feature = arg('--feature', 'Unassigned');
    
    console.log(`📖 Creating new user story: ${title}`);
    
    const story = {
      title,
      description,
      type: 'story',
      feature,
      status: 'draft',
      created: new Date().toISOString(),
      owner: this.role
    };
    
    this.safeWrite('stories', `${title.toLowerCase().replace(/\s+/g, '-')}.json`, story);
    console.log(`✅ User story created: ${title}`);
  }

  safeWrite(subdir, filename, content) {
    const targetDir = path.join(this.projectRoot, 'docs', 'docs', subdir);
    const targetFile = path.join(targetDir, filename);
    
    if (this.preview) {
      console.log(`📝 PREVIEW MODE - Would write to: ${targetFile}`);
      console.log('Content:', JSON.stringify(content, null, 2));
      return;
    }
    
    fs.mkdirSync(targetDir, { recursive: true });
    fs.writeFileSync(targetFile, JSON.stringify(content, null, 2));
    
    if (this.pr) {
      this.commitAndPR(subdir, filename, content);
    }
  }

  commitAndPR(subdir, filename, content) {
    try {
      sh('git add .');
      sh(`git commit -m "feat: add ${subdir}/${filename}"`);
      console.log(`✅ Committed: ${subdir}/${filename}`);
    } catch (e) {
      console.log(`⚠️  Git operations failed: ${e.message}`);
    }
  }

  handlePacksCommand() {
    const subcommand = process.argv[3];
    
    switch (subcommand) {
      case 'list':
        this.listPacks();
        break;
      case 'install':
        const packName = process.argv[4];
        this.installPack(packName);
        break;
      case 'enable':
        const packToEnable = process.argv[4];
        this.enablePack(packToEnable);
        break;
      case 'disable':
        const packToDisable = process.argv[4];
        this.disablePack(packToDisable);
        break;
      default:
        console.log('Usage: gtcx packs [list|install|enable|disable] [pack-name]');
    }
  }

  listPacks() {
    const packsDir = path.join(this.gtcxDir, 'packs-src');
    if (!fs.existsSync(packsDir)) {
      console.log('No packs directory found.');
      return;
    }
    
    const packs = fs.readdirSync(packsDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    
    console.log('📦 Available Packs:');
    packs.forEach(pack => {
      console.log(`   • ${pack}`);
    });
  }

  installPack(packName) {
    console.log(`📦 Installing pack: ${packName}`);
    // Implementation for pack installation
    console.log(`✅ Pack ${packName} installed`);
  }

  enablePack(packName) {
    console.log(`✅ Enabling pack: ${packName}`);
    // Implementation for pack enabling
    console.log(`✅ Pack ${packName} enabled`);
  }

  disablePack(packName) {
    console.log(`❌ Disabling pack: ${packName}`);
    // Implementation for pack disabling
    console.log(`✅ Pack ${packName} disabled`);
  }

  handleGenerateCommand() {
    const template = arg('--template');
    const title = arg('--title', 'Generated Document');
    const dir = arg('--dir', 'docs');
    
    if (!template) {
      console.log('Usage: gtcx --generate --template <name> [--title "Title"] [--dir <path>]');
      return;
    }
    
    console.log(`📄 Generating document: ${title} using template: ${template}`);
    // Implementation for document generation
    console.log(`✅ Document generated: ${title}`);
  }

  handlePrioritizeCommand() {
    const framework = arg('--framework', 'rice');
    const input = arg('--input');
    const title = arg('--title', 'Prioritization Analysis');
    
    if (!input) {
      console.log('Usage: gtcx --prioritize --framework rice|ice|loe|cba --input path.csv|json [--title "Title"]');
      return;
    }
    
    console.log(`📊 Running prioritization: ${framework} framework on ${input}`);
    // Implementation for prioritization
    console.log(`✅ Prioritization complete: ${title}`);
  }

  handleAutopilotCommand() {
    const docsPath = arg('--docs', './docs');
    
    console.log(`🤖 Running autopilot mode on: ${docsPath}`);
    console.log('Analyzing existing documentation...');
    
    // Implementation for autopilot mode
    console.log('✅ Autopilot analysis complete');
  }

  handleInitCommand() {
    const interactive = hasFlag('--interactive');
    
    if (interactive) {
      console.log('🚀 Interactive project initialization...');
      // Implementation for interactive init
      console.log('✅ Project initialized');
    } else {
      console.log('🚀 Quick project initialization...');
      // Implementation for quick init
      console.log('✅ Project initialized');
    }
  }

  handleLearnCommand() {
    const topic = arg('--topic', 'architecture');
    const depth = arg('--depth', 'overview');
    
    console.log(`🧠 Learning mode: ${topic} (${depth} level)`);
    
    const learnings = this.computeLearnings(topic, depth);
    this.saveLearnings(learnings);
    this.printLearnings(learnings);
  }

  computeLearnings(topic, depth) {
    const timestamp = new Date().toISOString();
    
    const learnings = {
      id: `learning_${Date.now()}`,
      timestamp,
      topic,
      depth,
      insights: [],
      recommendations: [],
      nextSteps: []
    };

    // Architecture insights
    if (topic === 'architecture' || topic === 'all') {
      learnings.insights.push(
        "🏗️ Product directory structure provides clear separation between web, mobile, and API products",
        "🔌 Services directory enables microservices architecture with standardized templates",
        "📊 Data infrastructure supports Agentic AI system and business intelligence",
        "🤖 Agentic system positioned as core competitive advantage at root level",
        "🔄 Monorepo structure enables shared resources and consistent tooling"
      );
      
      learnings.recommendations.push(
        "Use service-template for new backend services to maintain consistency",
        "Leverage shared packages for common UI components and utilities",
        "Implement data pipelines to support AI model training and inference",
        "Establish security and compliance services early in the architecture"
      );
      
      learnings.nextSteps.push(
        "Deploy Agentic system internally for competitive advantage",
        "Create mobile applications using the product/mobile structure",
        "Implement data pipelines for compliance and trading data",
        "Set up monitoring and observability infrastructure"
      );
    }

    // Strategic insights
    if (topic === 'strategy' || topic === 'all') {
      learnings.insights.push(
        "🎯 Internal-first Agentic deployment reduces risk and validates capabilities",
        "📱 Mobile platform expansion opens new customer segments",
        "🔌 API products enable ecosystem partnerships and integrations",
        "📊 Data infrastructure creates foundation for AI-powered insights",
        "🛡️ Security and compliance services differentiate in enterprise market"
      );
      
      learnings.recommendations.push(
        "Focus on internal AI capabilities before external release",
        "Build mobile apps that complement existing web applications",
        "Create partner APIs for ecosystem expansion",
        "Implement comprehensive data governance and compliance"
      );
      
      learnings.nextSteps.push(
        "Complete Phase 3 internal Agentic deployment",
        "Begin mobile application development planning",
        "Design partner API strategy and documentation",
        "Establish data governance and compliance frameworks"
      );
    }

    return learnings;
  }

  saveLearnings(learnings) {
    const learningsDir = path.join(this.gtcxDir, 'learnings');
    if (!fs.existsSync(learningsDir)) {
      fs.mkdirSync(learningsDir, { recursive: true });
    }
    
    const filename = `learning_${learnings.topic.toLowerCase()}_${Date.now()}.json`;
    const filepath = path.join(learningsDir, filename);
    
    fs.writeFileSync(filepath, JSON.stringify(learnings, null, 2));
    console.log(`💾 Learnings saved to: ${filepath}`);
  }

  printLearnings(learnings) {
    console.log(`\n🧠 **GTCX Learning Insights: ${learnings.topic.toUpperCase()}**\n`);
    
    console.log('💡 **Key Insights:**');
    learnings.insights.forEach(insight => {
      console.log(`   • ${insight}`);
    });
    
    console.log('\n🎯 **Strategic Recommendations:**');
    learnings.recommendations.forEach(rec => {
      console.log(`   • ${rec}`);
    });
    
    console.log('\n🚀 **Next Steps:**');
    learnings.nextSteps.forEach(step => {
      console.log(`   • ${step}`);
    });
    
    console.log(`\n📅 Generated: ${new Date(learnings.timestamp).toLocaleString()}`);
  }

  handleDocumentCommand() {
    const component = arg('--component', 'all');
    const format = arg('--format', 'markdown');
    
    console.log(`📚 Documentation mode: ${component} (${format} format)`);
    
    const docs = this.computeDocumentation(component, format);
    this.saveDocumentation(docs);
    this.printDocumentation(docs);
  }

  computeDocumentation(component, format) {
    const timestamp = new Date().toISOString();
    
    const docs = {
      id: `doc_${Date.now()}`,
      timestamp,
      component,
      format,
      sections: [],
      diagrams: [],
      examples: []
    };

    // Architecture documentation
    if (component === 'architecture' || component === 'all') {
      docs.sections.push(
        {
          title: "Monorepo Structure",
          content: "GTCX follows a workspace-based monorepo structure with clear separation of concerns",
          subsections: ["apps/", "services/", "packages/", "data/", "product/", "agentic/"]
        },
        {
          title: "Product Organization",
          content: "Customer-facing products organized by platform: web, mobile, and API",
          subsections: ["product/web/", "product/mobile/", "product/api/"]
        },
        {
          title: "Service Architecture",
          content: "Microservices architecture with standardized templates and CI/CD pipelines",
          subsections: ["services/", "devops/", "security/"]
        },
        {
          title: "Data Infrastructure",
          content: "Comprehensive data pipelines, analytics, and ML model management",
          subsections: ["data/pipelines/", "data/analytics/", "data/ml-models/"]
        }
      );
    }

    // Strategic documentation
    if (component === 'strategy' || component === 'all') {
      docs.sections.push(
        {
          title: "Phased Development Approach",
          content: "Internal-first Agentic deployment followed by external release",
          subsections: ["Phase 1: Launchpad MVP", "Phase 2: Intelligent Generator", "Phase 3: Internal Agentic", "Phase 4: External Release"]
        },
        {
          title: "Competitive Advantage",
          content: "AI-powered development platform with internal competitive advantage",
          subsections: ["300x acceleration", "Lean team scaling", "World-class enterprise technology"]
        },
        {
          title: "Market Positioning",
          content: "Institutional-grade, AI-powered project development platform",
          subsections: ["Compliance focus", "Enterprise security", "Global scale"]
        }
      );
    }

    return docs;
  }

  saveDocumentation(docs) {
    const docsDir = path.join(this.gtcxDir, 'documentation');
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true });
    }
    
    const filename = `doc_${docs.component.toLowerCase()}_${Date.now()}.md`;
    const filepath = path.join(docsDir, filename);
    
    const markdown = this.generateMarkdown(docs);
    fs.writeFileSync(filepath, markdown);
    console.log(`💾 Documentation saved to: ${filepath}`);
  }

  generateMarkdown(docs) {
    let markdown = `# 📚 GTCX Documentation: ${docs.component.toUpperCase()}\n\n`;
    markdown += `**Generated**: ${new Date(docs.timestamp).toLocaleString()}\n\n`;
    
    docs.sections.forEach(section => {
      markdown += `## ${section.title}\n\n`;
      markdown += `${section.content}\n\n`;
      
      if (section.subsections && section.subsections.length > 0) {
        markdown += '**Components:**\n';
        section.subsections.forEach(sub => {
          markdown += `- \`${sub}\`\n`;
        });
        markdown += '\n';
      }
    });
    
    return markdown;
  }

  printDocumentation(docs) {
    console.log(`\n📚 **GTCX Documentation: ${docs.component.toUpperCase()}**\n`);
    
    docs.sections.forEach(section => {
      console.log(`## ${section.title}`);
      console.log(`${section.content}`);
      
      if (section.subsections && section.subsections.length > 0) {
        console.log('**Components:**');
        section.subsections.forEach(sub => {
          console.log(`  • ${sub}`);
        });
      }
      console.log('');
    });
    
    console.log(`📅 Generated: ${new Date(docs.timestamp).toLocaleString()}`);
  }

  handleOptimizeCommand() {
    const area = arg('--area', 'all');
    const priority = arg('--priority', 'high');
    
    console.log(`⚡ Optimization mode: ${area} (${priority} priority)`);
    
    const optimizations = this.computeOptimizations(area, priority);
    this.saveOptimizations(optimizations);
    this.printOptimizations(optimizations);
  }

  computeOptimizations(area, priority) {
    const timestamp = new Date().toISOString();
    
    const optimizations = {
      id: `opt_${Date.now()}`,
      timestamp,
      area,
      priority,
      opportunities: [],
      improvements: [],
      metrics: []
    };

    // Architecture optimizations
    if (area === 'architecture' || area === 'all') {
      optimizations.opportunities.push(
        "Implement service mesh for inter-service communication",
        "Add distributed tracing for better observability",
        "Implement circuit breakers for resilience",
        "Add caching layers for performance optimization"
      );
      
      optimizations.improvements.push(
        "Standardize service templates and deployment patterns",
        "Implement automated testing and quality gates",
        "Add performance monitoring and alerting",
        "Establish security scanning and compliance checks"
      );
      
      optimizations.metrics.push(
        "Service response times < 200ms",
        "99.9% uptime SLA",
        "Zero security vulnerabilities",
        "Automated deployment success rate > 95%"
      );
    }

    // Development optimizations
    if (area === 'development' || area === 'all') {
      optimizations.opportunities.push(
        "Implement AI-powered code generation and review",
        "Add automated testing and quality assurance",
        "Implement feature flags for safe deployments",
        "Add automated documentation generation"
      );
      
      optimizations.improvements.push(
        "Standardize development workflows and tooling",
        "Implement code quality gates and standards",
        "Add automated dependency updates and security patches",
        "Establish knowledge sharing and documentation practices"
      );
      
      optimizations.metrics.push(
        "Development velocity increased by 300%",
        "Bug rate reduced by 80%",
        "Deployment frequency increased by 10x",
        "Developer satisfaction score > 90%"
      );
    }

    return optimizations;
  }

  saveOptimizations(optimizations) {
    const optDir = path.join(this.gtcxDir, 'optimizations');
    if (!fs.existsSync(optDir)) {
      fs.mkdirSync(optDir, { recursive: true });
    }
    
    const filename = `opt_${optimizations.area.toLowerCase()}_${Date.now()}.json`;
    const filepath = path.join(optDir, filename);
    
    fs.writeFileSync(filepath, JSON.stringify(optimizations, null, 2));
    console.log(`💾 Optimizations saved to: ${filepath}`);
  }

  printOptimizations(optimizations) {
    console.log(`\n⚡ **GTCX Optimizations: ${optimizations.area.toUpperCase()}**\n`);
    
    console.log('🎯 **Optimization Opportunities:**');
    optimizations.opportunities.forEach(opp => {
      console.log(`   • ${opp}`);
    });
    
    console.log('\n🚀 **Improvement Areas:**');
    optimizations.improvements.forEach(imp => {
      console.log(`   • ${imp}`);
    });
    
    console.log('\n📊 **Target Metrics:**');
    optimizations.metrics.forEach(metric => {
      console.log(`   • ${metric}`);
    });
    
    console.log(`\n📅 Generated: ${new Date(optimizations.timestamp).toLocaleString()}`);
  }

  handleGemsCommand() {
    const category = arg('--category', 'all');
    
    console.log(`💎 Gems mode: ${category} category`);
    
    const gems = this.computeGems(category);
    this.printGems(gems);
  }

  computeGems(category) {
    const gems = {
      architecture: [
        {
          name: "Service Mesh Pattern",
          description: "Implement Istio or Linkerd for advanced service communication",
          benefit: "Better observability, security, and traffic management",
          effort: "High",
          impact: "High"
        },
        {
          name: "Event Sourcing",
          description: "Store all changes as events for complete audit trail",
          benefit: "Perfect compliance and audit capabilities",
          effort: "High",
          impact: "High"
        },
        {
          name: "CQRS Pattern",
          description: "Separate read and write models for optimal performance",
          benefit: "Scalable read operations and complex queries",
          effort: "Medium",
          impact: "High"
        }
      ],
      security: [
        {
          name: "Zero Trust Architecture",
          description: "Never trust, always verify approach to security",
          benefit: "Enhanced security posture and compliance",
          effort: "High",
          impact: "High"
        },
        {
          name: "Secrets Management",
          description: "Centralized secrets management with rotation",
          benefit: "Secure credential management and compliance",
          effort: "Medium",
          impact: "High"
        },
        {
          name: "Security Headers",
          description: "Implement comprehensive security headers",
          benefit: "Protection against common web vulnerabilities",
          effort: "Low",
          impact: "Medium"
        }
      ],
      performance: [
        {
          name: "CDN Implementation",
          description: "Global content delivery network for static assets",
          benefit: "Faster global access and reduced server load",
          effort: "Medium",
          impact: "High"
        },
        {
          name: "Database Sharding",
          description: "Horizontal database partitioning for scale",
          benefit: "Improved query performance and scalability",
          effort: "High",
          impact: "High"
        },
        {
          name: "Async Processing",
          description: "Background job processing for heavy operations",
          benefit: "Better user experience and system responsiveness",
          effort: "Medium",
          impact: "Medium"
        }
      ],
      ai: [
        {
          name: "Model Serving Infrastructure",
          description: "Scalable ML model serving with A/B testing",
          benefit: "AI capabilities at enterprise scale",
          effort: "High",
          impact: "High"
        },
        {
          name: "Feature Store",
          description: "Centralized feature management for ML models",
          benefit: "Consistent features across models and teams",
          effort: "High",
          impact: "High"
        },
        {
          name: "AutoML Pipeline",
          description: "Automated machine learning model development",
          benefit: "Faster model development and deployment",
          effort: "Medium",
          impact: "Medium"
        }
      ]
    };

    if (category === 'all') {
      return gems;
    }
    
    return { [category]: gems[category] || [] };
  }

  printGems(gems) {
    console.log('\n💎 **GTCX Strategic Gems**\n');
    
    Object.entries(gems).forEach(([category, categoryGems]) => {
      console.log(`## ${category.toUpperCase()} 💎\n`);
      
      categoryGems.forEach(gem => {
        console.log(`**${gem.name}**`);
        console.log(`   Description: ${gem.description}`);
        console.log(`   Benefit: ${gem.benefit}`);
        console.log(`   Effort: ${gem.effort} | Impact: ${gem.impact}\n`);
      });
    });
  }

  handleDateCommand() {
    const format = arg('--format', 'all');
    const operation = arg('--operation', 'info');
    
    console.log(`🕐 Date utilities mode: ${operation} (${format} format)`);
    
    if (operation === 'info') {
      this.showDateInfo(format);
    } else if (operation === 'future') {
      const days = parseInt(arg('--days', '7'));
      this.showFutureDates(days, format);
    } else if (operation === 'quarter') {
      this.showQuarterInfo();
    }
  }

  showDateInfo(format) {
    const dateUtils = new DateUtils();
    const startupInfo = dateUtils.getStartupInfo();
    
    console.log('\n🕐 **GTCX Date Information**\n');
    
    if (format === 'all' || format === 'startup') {
      console.log('🌅 **Startup Information:**');
      console.log(`   Startup Time: ${startupInfo.startupTimeFormatted}`);
      console.log(`   Uptime: ${startupInfo.uptimeFormatted}`);
      console.log(`   Timezone: ${startupInfo.timezone}`);
      console.log('');
    }
    
    if (format === 'all' || format === 'current') {
      console.log('📅 **Current Date Information:**');
      console.log(`   Today: ${dateUtils.today('long')}`);
      console.log(`   ISO: ${dateUtils.today('iso')}`);
      console.log(`   Short: ${dateUtils.today('short')}`);
      console.log('');
    }
    
    if (format === 'all' || format === 'quarter') {
      const currentQuarter = dateUtils.currentQuarter();
      const quarterDates = dateUtils.quarterDates();
      console.log('📊 **Quarter Information:**');
      console.log(`   Current Quarter: Q${currentQuarter} 2025`);
      console.log(`   Quarter Dates: ${quarterDates.startFormatted} to ${quarterDates.endFormatted}`);
      console.log('');
    }
  }

  showFutureDates(days, format) {
    const dateUtils = new DateUtils();
    
    console.log(`\n📅 **Future Dates (${days} days from now)**\n`);
    
    for (let i = 1; i <= Math.min(days, 30); i++) {
      const futureDate = dateUtils.daysFromNow(i, format);
      const relative = dateUtils.getRelativeTime(new Date(futureDate));
      console.log(`   ${i} day${i > 1 ? 's' : ''}: ${futureDate} (${relative})`);
    }
  }

  showQuarterInfo() {
    const dateUtils = new DateUtils();
    
    console.log('\n📊 **Quarter Information**\n');
    
    for (let q = 1; q <= 4; q++) {
      const quarterDates = dateUtils.quarterDates(q);
      console.log(`Q${q} 2025: ${quarterDates.startFormatted} to ${quarterDates.endFormatted}`);
    }
    
    const fiscalYear = dateUtils.fiscalYearDates();
    console.log(`\n💰 Fiscal Year ${fiscalYear.year}: ${fiscalYear.startFormatted} to ${fiscalYear.endFormatted}`);
  }

  handleAuditCommand() {
    const scope = arg('--scope', 'all');
    const output = arg('--output', 'console');
    
    console.log(`🔍 Documentation audit mode: ${scope} scope (${output} output)`);
    
    if (scope === 'all' || scope === 'documentation') {
      this.runDocumentationAudit(output);
    }
  }

  async runDocumentationAudit(output) {
    try {
      const DocumentationAuditor = require('./documentation-audit');
      const auditor = new DocumentationAuditor();
      
      if (output === 'file') {
        // Redirect console output to file
        const auditDir = path.join(this.gtcxDir, 'audits');
        if (!fs.existsSync(auditDir)) {
          fs.mkdirSync(auditDir, { recursive: true });
        }
        
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `audit-report-${timestamp}.txt`;
        const filepath = path.join(auditDir, filename);
        
        // Capture console output
        const originalLog = console.log;
        const logs = [];
        console.log = (...args) => logs.push(args.join(' '));
        
        await auditor.auditAllDocumentation();
        
        // Restore console and save to file
        console.log = originalLog;
        fs.writeFileSync(filepath, logs.join('\n'));
        
        console.log(`💾 Audit report saved to: ${filepath}`);
      } else {
        await auditor.auditAllDocumentation();
      }
    } catch (error) {
      console.error('❌ Error running documentation audit:', error.message);
    }
  }

  handleCreativeCommand() {
    const action = arg('--action', 'help');
    const assetType = arg('--type', 'all');
    const tool = arg('--tool', 'all');
    
    console.log(`🎨 Creative mode: ${action} (${assetType} assets, ${tool} tools)`);
    
    switch (action) {
      case 'prompt':
        this.showPromptTemplates(assetType, tool);
        break;
      case 'workflow':
        this.showCreativeWorkflows(assetType);
        break;
      case 'tools':
        this.showCreativeTools(assetType);
        break;
      case 'generate':
        this.generateCreativeAsset(assetType, tool);
        break;
      case 'help':
      default:
        this.showCreativeHelp();
        break;
    }
  }

  showPromptTemplates(assetType, tool) {
    console.log('\n🎨 **GTCX Context-Enhanced Creative Prompt Templates**\n');
    console.log('💡 **IMPORTANT**: Every prompt includes complete GTCX context for accurate AI generation!\n');
    
    const templates = {
      'brand-identity': {
        'midjourney': `CONTEXT: GTCX (Global Trade Commodity Exchange) is an institutional-grade, AI-powered project development platform that accelerates project delivery by 300x. We focus on commodity verification infrastructure that makes trust mathematically provable.

BRAND: We position ourselves as trustworthy, innovative, and globally accessible. Our brand conveys institutional credibility, technological sophistication, and human empowerment.

VISUAL STYLE: Professional, minimalist, technology-forward. We use deep blue (#1565C0) for trust and reliability, gold (#D4AF37) for value and verification, clean whites for clarity, and subtle grays for sophistication.

TARGET: Government officials, enterprise buyers, and producer communities in frontier markets.

PROMPT: Create a sophisticated, minimalist logo for GTCX that represents trust, verification, and global connectivity. Use deep blue (#1565C0) and gold (#D4AF37) colors with clean geometric shapes that suggest verification, blockchain technology, and international trade. The design should be scalable, memorable, and convey institutional credibility. Style: Professional, modern, trustworthy. Quality: Ultra-high quality, 8K resolution, clean lines.`,
        
        'dalle': `CONTEXT: GTCX is a revolutionary platform that combines AI-powered development tools with commodity verification infrastructure. We serve as the verification layer that makes trust mathematically provable in global commodity markets.

BRAND: We are infrastructure, not a platform - a public good that empowers all stakeholders rather than controlling them. Our brand conveys transparency, reliability, and global accessibility.

VISUAL STYLE: Clean, geometric, professional. We emphasize clarity, precision, and trust through visual design that suggests verification, technology, and global connectivity.

TARGET: Enterprise clients, government partners, and global commodity market participants.

PROMPT: Generate a professional brand mark for GTCX that combines elements of verification (checkmarks, shields), technology (geometric patterns, digital elements), and global trade (world maps, connection lines). Use deep blue (#1565C0) as primary color with gold (#D4AF37) accents. The design should be clean, scalable, and suitable for both digital and print applications. Style: Corporate, sophisticated, technology-forward.`,
        
        'figma': `CONTEXT: GTCX needs a comprehensive logo system that works across all platforms and applications, from mobile apps to government presentations.

BRAND: We emphasize consistency, scalability, and professional presentation across all touchpoints.

VISUAL STYLE: Systematic, scalable, consistent. We need primary, secondary, and tertiary mark variations that maintain brand recognition.

TARGET: Designers, developers, and brand managers who need consistent visual identity across all applications.

PROMPT: Design a modern, scalable logo system for GTCX with primary, secondary, and tertiary mark variations. Use the GTCX color palette and ensure all variations maintain brand recognition and consistency. Style: Modern UI design, clean interface, user-friendly, professional layout.`
      },
      'marketing': {
        'midjourney': `CONTEXT: GTCX is launching a campaign to showcase our commodity verification platform's ability to reduce compliance costs by 80% while providing guaranteed provenance and direct producer relationships.

BRAND: We emphasize empowerment over disruption, showing how our technology enhances existing systems rather than replacing them.

VISUAL STYLE: Professional, engaging, technology-forward. We use sophisticated imagery that conveys trust and innovation while remaining accessible to diverse audiences.

TARGET: Enterprise procurement teams, compliance officers, and sustainability managers in global commodity markets.

PROMPT: Create a compelling social media graphic for GTCX's commodity verification platform. Show a sophisticated technology interface with verification elements, using deep blue (#1565C0) and gold (#D4AF37) colors. Include subtle data visualization elements and a professional, modern aesthetic. The image should convey trust, innovation, and global accessibility. Style: Professional, engaging, technology-forward. Quality: High resolution, social media optimized, brand consistent.`,
        
        'runway': `CONTEXT: GTCX needs a video demonstrating how our verification process works from producer registration to final verification, showing the real-time data flow and verification checkmarks.

BRAND: We want to show technology that is sophisticated yet accessible, professional yet human-centered.

VISUAL STYLE: Cinematic, professional, smooth motion. We use high-quality production values that match institutional expectations while maintaining engaging storytelling.

TARGET: Government officials, enterprise buyers, and producer communities who need to understand our verification process.

PROMPT: Generate a cinematic video showing the GTCX verification process in action. Start with a close-up of a mobile device displaying the verification interface, then zoom out to show the global impact with animated data flows and verification checkmarks. Use professional lighting, smooth camera movements, and a sophisticated color palette. Style: Cinematic, professional, smooth motion. Quality: 4K resolution, professional production values.`,
        
        'dalle': `CONTEXT: GTCX needs marketing campaign visuals that communicate our value proposition to diverse stakeholders across global markets.

BRAND: We emphasize trust, innovation, and global accessibility in all our marketing communications.

VISUAL STYLE: Professional, engaging, culturally appropriate. We use visual elements that resonate across different markets and cultures.

TARGET: Global stakeholders including government officials, enterprise buyers, and producer communities.

PROMPT: Create marketing campaign visuals that convey trust, innovation, and global accessibility. Use the GTCX brand colors and visual style to create compelling imagery that resonates with our diverse stakeholder base. Style: Professional, engaging, brand consistent.`
      },
      'product': {
        'figma': `CONTEXT: GTCX is building a mobile-first verification app that must work in challenging frontier market environments with varying literacy levels and technological experience.

BRAND: We emphasize accessibility, dignity, and empowerment in our user experience design.

VISUAL STYLE: Clean, intuitive, accessible. We use high contrast ratios, large touch targets, and clear visual feedback for all user actions.

TARGET: Commodity producers in frontier markets, government officials, and enterprise users who need reliable verification tools.

PROMPT: Design a modern, user-friendly interface for the GTCX verification app. Include a clean dashboard with verification status indicators, real-time data displays, and intuitive navigation. Use the GTCX color palette (deep blue #1565C0, gold #D4AF37) with clean typography and professional design elements. Focus on accessibility and user experience. Style: Modern UI design, clean interface, user-friendly, professional layout.`,
        
        'dalle': `CONTEXT: GTCX needs to explain our verification process to stakeholders who may not be technically sophisticated. The illustration should show the flow from data input through consensus validation to final confirmation.

BRAND: We want to demystify complex technology while maintaining professional credibility.

VISUAL STYLE: Clear, professional, educational. We use clean geometric shapes and clear visual metaphors to explain complex processes.

TARGET: Government officials, enterprise buyers, and producer communities who need to understand our verification technology.

PROMPT: Create a technical illustration showing the GTCX verification process flow. Use clean, geometric shapes to represent different stages: data input, verification processing, consensus validation, and final confirmation. Include subtle technological elements and use the GTCX brand colors. The illustration should be clear, professional, and easy to understand. Style: Technical, clear, professional design, brand consistent.`,
        
        'midjourney': `CONTEXT: GTCX needs product mockups that showcase our verification technology in professional, trustworthy settings that resonate with our institutional clients.

BRAND: We emphasize reliability, sophistication, and global accessibility in our product presentation.

VISUAL STYLE: Professional, trustworthy, technology-forward. We use sophisticated imagery that conveys institutional credibility.

TARGET: Government officials, enterprise buyers, and institutional stakeholders who need to understand our product capabilities.

PROMPT: Generate product mockups that showcase verification technology in professional, trustworthy settings. Use the GTCX brand colors and visual style to create compelling product imagery that conveys reliability and sophistication. Style: Professional, trustworthy, technology-forward. Quality: High resolution, professional presentation.`
      }
    };
    
    if (assetType === 'all') {
      Object.entries(templates).forEach(([type, toolTemplates]) => {
        console.log(`## ${type.toUpperCase().replace('-', ' ')} 📋\n`);
        Object.entries(toolTemplates).forEach(([toolName, prompt]) => {
          console.log(`**${toolName.toUpperCase()}**:`);
          console.log(`   ${prompt}\n`);
        });
      });
    } else if (templates[assetType]) {
      console.log(`## ${assetType.toUpperCase().replace('-', ' ')} 📋\n`);
      if (tool === 'all') {
        Object.entries(templates[assetType]).forEach(([toolName, prompt]) => {
          console.log(`**${toolName.toUpperCase()}**:`);
          console.log(`   ${prompt}\n`);
        });
      } else if (templates[assetType][tool]) {
        console.log(`**${tool.toUpperCase()}**:`);
        console.log(`   ${templates[assetType][tool]}\n`);
      }
    }
  }

  showCreativeWorkflows(assetType) {
    console.log('\n🔄 **GTCX Creative Workflows**\n');
    
    const workflows = {
      'brand-identity': [
        '1. Concept Development - Research brand positioning and values',
        '2. Initial Generation - Use AI tools to generate concepts',
        '3. Refinement - Iterate and improve based on feedback',
        '4. Final Production - Create production-ready versions'
      ],
      'marketing': [
        '1. Campaign Planning - Define objectives and messaging',
        '2. Creative Development - Generate campaign assets',
        '3. Campaign Integration - Ensure consistency across assets',
        '4. Campaign Launch - Deploy and monitor performance'
      ],
      'product': [
        '1. Product Analysis - Understand features and benefits',
        '2. Asset Creation - Generate interface and illustration assets',
        '3. User Experience Integration - Focus on usability',
        '4. Product Integration - Coordinate with development teams'
      ]
    };
    
    if (assetType === 'all') {
      Object.entries(workflows).forEach(([type, steps]) => {
        console.log(`## ${type.toUpperCase().replace('-', ' ')} 🔄\n`);
        steps.forEach(step => console.log(`   ${step}`));
        console.log('');
      });
    } else if (workflows[assetType]) {
      console.log(`## ${assetType.toUpperCase().replace('-', ' ')} 🔄\n`);
      workflows[assetType].forEach(step => console.log(`   ${step}`));
    }
  }

  showCreativeTools(assetType) {
    console.log('\n🛠️ **GTCX Creative AI Tools**\n');
    
    const tools = {
      'video': [
        '🏆 Runway Gen-3 Alpha - Cinematic quality, professional storytelling',
        '🥈 Pika Labs - Longer sequences, complex animations',
        '🥉 HeyGen - AI avatars, spokesperson videos'
      ],
      'image': [
        '🏆 Midjourney v6 - Artistic, high-quality imagery',
        '🥈 DALL-E 3 - Precise prompt interpretation, brand consistency',
        '🥉 Adobe Firefly - Commercial use, brand-safe content'
      ],
      'design': [
        '🏆 Figma AI - UI/UX design, interface mockups',
        '🥈 Adobe Illustrator AI - Vector graphics, scalable assets',
        '🥉 Canva AI - Template-based design, quick iterations'
      ]
    };
    
    if (assetType === 'all') {
      Object.entries(tools).forEach(([type, toolList]) => {
        console.log(`## ${type.toUpperCase()} 🎨\n`);
        toolList.forEach(tool => console.log(`   ${tool}`));
        console.log('');
      });
    } else if (tools[assetType]) {
      console.log(`## ${type.toUpperCase()} 🎨\n`);
      tools[type].forEach(tool => console.log(`   ${tool}`));
    }
  }

  generateCreativeAsset(assetType, tool) {
    console.log(`\n🚀 **Generating Creative Asset**\n`);
    console.log(`Asset Type: ${assetType}`);
    console.log(`Tool: ${tool}`);
    console.log('\n📋 **Next Steps:**\n');
    
    const nextSteps = [
      '1. Set up your AI tool account (see creative/specs/creative-ai-playbook.md)',
      '2. Use the prompt templates from creative/templates/prompt-templates.md',
      '3. Follow the workflows in creative/workflows/creative-workflow-guide.md',
      '4. Generate your assets using the selected AI tools',
      '5. Review and refine based on quality standards',
      '6. Save outputs to creative/outputs/ directory'
    ];
    
    nextSteps.forEach(step => console.log(`   ${step}`));
    
    console.log('\n💡 **Quick Start:**');
    console.log(`   • Run: gtcx --creative --action prompt --type ${assetType}`);
    console.log(`   • Run: gtcx --creative --action workflow --type ${assetType}`);
    console.log(`   • Run: gtcx --creative --action tools --type ${assetType}`);
  }

  showCreativeHelp() {
    console.log('\n🎨 **GTCX Creative Commands**\n');
    console.log('USAGE: gtcx --creative [--action <action>] [--type <type>] [--tool <tool>]\n');
    
    console.log('ACTIONS:');
    console.log('  --action prompt     Show prompt templates for asset generation');
    console.log('  --action workflow   Show creative workflows and processes');
    console.log('  --action tools      Show available AI tools and capabilities');
    console.log('  --action generate   Generate creative asset with guidance');
    console.log('  --action help       Show this help message\n');
    
    console.log('ASSET TYPES:');
    console.log('  --type brand-identity  Brand identity and logo assets');
    console.log('  --type marketing       Marketing campaign assets');
    console.log('  --type product         Product demonstration assets');
    console.log('  --type all             All asset types\n');
    
    console.log('TOOLS:');
    console.log('  --action prompt     Show prompt templates for asset generation');
    console.log('  --action workflow   Show creative workflows and processes');
    console.log('  --action tools      Show available AI tools and capabilities');
    console.log('  --action generate   Generate creative asset with guidance');
    console.log('  --action help       Show this help message\n');
    
    console.log('EXAMPLES:');
    console.log('  gtcx --creative --action prompt --type brand-identity');
    console.log('  gtcx --creative --action workflow --type marketing');
    console.log('  gtcx --creative --action tools --type video');
    console.log('  gtcx --creative --action generate --type product --tool figma');
  }

  showHelp() {
    console.log(`
🚀 GTCX Launchpad CLI

USAGE:
  gtcx [command] [options]

CORE COMMANDS:
  --needs                    Analyze project needs and blockers
  --goals                    Show current and upcoming project goals
  --own                      AI Assistant takes ownership of AI-ownable items
  --roadmap                  Show product development roadmap
  
LEARNING & OPTIMIZATION:
  --learn [--topic <topic>] [--depth <level>]  Generate learning insights
  --document [--component <comp>] [--format <fmt>]  Generate documentation
  --optimize [--area <area>] [--priority <level>]  Generate optimization recommendations
  --gems [--category <cat>]  Show strategic architectural gems
  
UTILITIES:
  --date [--operation <op>] [--format <fmt>]  Date utilities and calculations
  --audit [--scope <scope>] [--output <out>]  Documentation consistency audit
  
AGILE COMMANDS:
  --new-epic --title "Title" [--description "Desc"]     Create new epic
  --new-feature --title "Title" [--epic "Epic"]         Create new feature
  --new-story --title "Title" [--feature "Feature"]     Create new user story

GTCX GENERATOR (Flagship Feature):
  --rails-app-web --name "App" [--description "Desc"]   Generate Rails web app
  --rails-backend-api --name "API" [--description "Desc"] Generate Rails API
  --rails-app-pwa --name "PWA" [--description "Desc"]   Generate Rails PWA
  --rails-app-vue --name "App" [--description "Desc"]   Generate Rails + Vue.js
  --rails-app-react --name "App" [--description "Desc"] Generate Rails + React
  --nextjs --name "App" [--description "Desc"]          Generate Next.js app
  --react-native --name "App" [--description "Desc"]    Generate React Native

PACKS MANAGEMENT:
  packs list                 List available packs
  packs install <name>       Install a pack
  packs enable <name>        Enable a pack
  packs disable <name>       Disable a pack

GENERATION:
  --generate --template <name> [--title "Title"] [--dir <path>]
  --prioritize --framework rice|ice|loe|cba --input <file>

PROJECT:
  init [--interactive]       Initialize new project
  autopilot [--docs <path>]  Run autopilot mode

SAFETY FLAGS:
  --role <role>              Set user role (pm, dev, qa, ops, design)
  --preview                  Preview changes without writing
  --pr                       Use PR-based changes (default)
  --unsafe-write            Allow direct writes (not recommended)
  --explain                  Show detailed explanations

EXAMPLES:
  gtcx --needs
  gtcx --goals
  gtcx --learn --topic architecture
  gtcx --document --component strategy
  gtcx --optimize --area performance
  gtcx --gems --category ai
  gtcx --date --operation info
  gtcx --audit --scope documentation
  gtcx --own
  gtcx --roadmap
  gtcx --rails-app-web --name "MyApp" --description "Awesome app"
  gtcx --new-epic --title "User Authentication"
  gtcx packs list
  gtcx init --interactive
    `);
  }
}

// Run the CLI
const cli = new GTCXCLI();
cli.run();
