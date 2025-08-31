# GTCX CLI Specification

**Version**: 1.0.0  
**Date**: December 2024  
**Status**: Draft  
**Owner**: GTCX Engineering Team

## 🎯 Overview

The GTCX CLI is the terminal-first interface for GTCX Launchpad, providing developers and power users with direct access to all platform capabilities. Built with Node.js and TypeScript, it emphasizes safety, efficiency, and developer experience.

## 🏗️ Architecture

### Core Components

#### 1. Command Parser
- **Technology**: Custom argument parser with flag validation
- **Features**: Long-form flags, short aliases, grouped commands
- **Validation**: Type checking, required parameter validation
- **Help**: Built-in help system with examples

#### 2. Safety Engine
- **Write Protection**: Allowlisted paths only (`docs/docs/**`, `.gtcx/**`)
- **PR Mode**: Default safe mode with pull request creation
- **Audit Logging**: All operations logged for compliance
- **Preview Mode**: Show changes before applying

#### 3. Pack Manager
- **Installation**: From URLs, local folders, or marketplace
- **Validation**: JSON schema validation for pack manifests
- **Dependencies**: Pack dependency resolution
- **Updates**: Automatic and manual pack updates

#### 4. AI Integration
- **LLM APIs**: Claude, GPT-4, Gemini integration
- **Schema Validation**: JSON schema enforcement for outputs
- **Retry Logic**: Exponential backoff with fallbacks
- **Context Management**: Project context and history

## 🚀 Core Commands

### Project Management

#### `gtcx init [--interactive] [--template <name>] [--dir <path>]`
Initialize a new GTCX project.

**Flags:**
- `--interactive`: Interactive mode with guided setup
- `--template`: Use specific template for initialization
- `--dir`: Target directory (default: current directory)
- `--skip-git`: Skip Git repository initialization
- `--skip-docs`: Skip documentation setup

**Examples:**
```bash
gtcx init --interactive
gtcx init --template rails-app --dir my-project
gtcx init --skip-git --skip-docs
```

#### `gtcx autopilot [--docs <path>] [--output <path>] [--model <name>]`
Automatically analyze project documentation and generate intake.

**Flags:**
- `--docs`: Path to documentation directory
- `--output`: Output file path (default: `intake.md`)
- `--model`: LLM model to use (claude, gpt4, gemini)
- `--confidence`: Minimum confidence threshold (0-1)
- `--max-tokens`: Maximum tokens for analysis

**Examples:**
```bash
gtcx autopilot --docs ./docs
gtcx autopilot --docs ./docs --output project-intake.md
gtcx autopilot --docs ./docs --model claude --confidence 0.8
```

### Agile Artifact Generation

#### `gtcx --new-epic <title> [--description <text>] [--owner <name>] [--priority <level>]`
Create a new epic with AI assistance.

**Flags:**
- `--description`: Epic description
- `--owner`: Epic owner/assignee
- `--priority`: Priority level (P0, P1, P2, P3, P4)
- `--template`: Custom template to use
- `--output`: Output file path

**Examples:**
```bash
gtcx --new-epic "User Authentication System"
gtcx --new-epic "Payment Integration" --description "Integrate Stripe payment processing" --owner "dev-team" --priority P1
```

#### `gtcx --new-feature <title> [--epic <id>] [--description <text>] [--owner <name>]`
Create a new feature within an epic.

**Flags:**
- `--epic`: Epic ID this feature belongs to
- `--description`: Feature description
- `--owner`: Feature owner/assignee
- `--acceptance-criteria`: Initial acceptance criteria
- `--output`: Output file path

**Examples:**
```bash
gtcx --new-feature "OAuth Integration" --epic EP-001
gtcx --new-feature "User Profile Management" --epic EP-001 --description "Allow users to edit profile information"
```

#### `gtcx --new-story <title> [--feature <id>] [--description <text>] [--owner <name>]`
Create a new user story with acceptance criteria.

**Flags:**
- `--feature`: Feature ID this story belongs to
- `--description`: Story description
- `--owner`: Story owner/assignee
- `--story-points`: Story point estimation
- `--output`: Output file path

**Examples:**
```bash
gtcx --new-story "User can sign in with Google" --feature FEAT-101
gtcx --new-story "User can reset password" --feature FEAT-101 --story-points 3
```

### Pack Management

#### `gtcx packs list [--enabled] [--disabled] [--verbose]`
List available and installed packs.

**Flags:**
- `--enabled`: Show only enabled packs
- `--disabled`: Show only disabled packs
- `--verbose`: Show detailed pack information
- `--format`: Output format (table, json, yaml)

**Examples:**
```bash
gtcx packs list
gtcx packs list --enabled --verbose
gtcx packs list --format json
```

#### `gtcx packs install <source> [--name <name>] [--version <version>]`
Install a pack from various sources.

**Sources:**
- `pack-name`: Install from built-in packs
- `https://...`: Install from URL
- `./path`: Install from local directory
- `github:owner/repo`: Install from GitHub repository

**Flags:**
- `--name`: Custom name for the pack
- `--version`: Specific version to install
- `--force`: Overwrite existing pack
- `--validate`: Validate pack before installation

**Examples:**
```bash
gtcx packs install agile
gtcx packs install https://example.com/packs/compliance
gtcx packs install ./local-packs/security
gtcx packs install github:gtcx/enterprise-pack
```

#### `gtcx packs enable <name> [--config <path>]`
Enable a pack and load its capabilities.

**Flags:**
- `--config`: Custom configuration file
- `--validate`: Validate pack configuration
- `--dry-run`: Show what would be enabled

**Examples:**
```bash
gtcx packs enable agile
gtcx packs enable compliance --config ./compliance-config.yaml
```

#### `gtcx packs disable <name> [--remove]`
Disable a pack and unload its capabilities.

**Flags:**
- `--remove`: Remove pack files after disabling
- `--backup`: Create backup before removal

**Examples:**
```bash
gtcx packs disable agile
gtcx packs disable compliance --remove --backup
```

### Generic Generation

#### `gtcx generate --template <name> [--title <text>] [--dir <path>] [--data <json>]`
Generate documents from templates using AI assistance.

**Flags:**
- `--template`: Template name to use
- `--title`: Document title
- `--dir`: Output directory
- `--data`: JSON data for template variables
- `--format`: Output format (markdown, html, pdf)

**Examples:**
```bash
gtcx generate --template epic --title "API Documentation System"
gtcx generate --template risk-register --title "Security Risk Assessment" --data '{"project": "web-app"}'
```

### Prioritization

#### `gtcx prioritize --framework <name> --input <path> [--title <text>] [--output <path>]`
Apply prioritization frameworks to project data.

**Frameworks:**
- `rice`: Reach, Impact, Confidence, Effort
- `ice`: Impact, Confidence, Effort
- `loe`: Level of Effort
- `cba`: Cost-Benefit Analysis

**Flags:**
- `--input`: Input file (CSV or JSON)
- `--title`: Analysis title
- `--output`: Output file path
- `--weights`: Custom weights for framework

**Examples:**
```bash
gtcx prioritize --framework rice --input features.csv --title "Q1 Feature Prioritization"
gtcx prioritize --framework ice --input stories.json --output prioritized-stories.md
```

## 🔒 Safety Features

### Write Protection

#### Allowlisted Paths
- `docs/docs/**` - Project documentation
- `.gtcx/**` - GTCX configuration and data
- `**/*.md` - Markdown files (with `--unsafe-write`)

#### Safe Modes
- **PR Mode** (default): Create feature branch and pull request
- **Preview Mode**: Show changes without writing
- **Explain Mode**: Provide detailed explanations for actions
- **Unsafe Write**: Bypass safety for advanced users

### Audit Logging

#### Log Format
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "command": "gtcx --new-epic",
  "user": "amanianai",
  "action": "create",
  "target": "epic.md",
  "path": "docs/docs/01-epics/",
  "safe_mode": "pr",
  "ai_assisted": true,
  "llm_model": "claude-3-sonnet"
}
```

#### Log Locations
- `.gtcx/logs/audit.log` - Local audit log
- `.gtcx/logs/operations.log` - Operation details
- `.gtcx/logs/errors.log` - Error tracking

## 📦 Pack System

### Pack Structure
```
pack-name/
├── pack.json              # Pack manifest
├── templates/             # Document templates
│   ├── epic.md
│   ├── feature.md
│   └── story.md
├── schemas/               # JSON schemas
│   ├── epic.schema.json
│   └── feature.schema.json
├── prompts/               # AI prompts
│   ├── epic-generation.txt
│   └── feature-analysis.txt
└── actions/               # Custom actions
    ├── validate.js
    └── transform.js
```

### Pack Manifest (pack.json)
```json
{
  "id": "agile",
  "name": "Agile Development",
  "version": "1.0.0",
  "description": "Agile methodology templates and workflows",
  "author": "GTCX Team",
  "license": "MIT",
  "templates": {
    "epic": {
      "path": "templates/epic.md",
      "schema": "schemas/epic.schema.json",
      "prompt": "prompts/epic-generation.txt"
    }
  },
  "dependencies": [],
  "tags": ["agile", "scrum", "kanban"]
}
```

## 🤖 AI Integration

### LLM Providers

#### Primary: Anthropic Claude
- **Model**: claude-3-sonnet-20240229
- **Features**: Best reasoning, structured output
- **Fallback**: claude-3-haiku-20240307

#### Secondary: OpenAI GPT-4
- **Model**: gpt-4-turbo-preview
- **Features**: Code generation, analysis
- **Fallback**: gpt-3.5-turbo

#### Tertiary: Google Gemini
- **Model**: gemini-pro
- **Features**: Multimodal, creative tasks
- **Fallback**: gemini-pro-vision

### Prompt Engineering

#### Context Injection
- Project documentation and history
- User preferences and settings
- Previous AI interactions
- Template requirements and constraints

#### Output Validation
- JSON schema enforcement
- Content quality checks
- Safety and compliance validation
- User feedback integration

## 📊 Performance & Monitoring

### Metrics
- **Command Execution Time**: Average and 95th percentile
- **AI Response Time**: LLM API response times
- **Success Rate**: Command completion success
- **User Satisfaction**: Implicit and explicit feedback

### Optimization
- **Caching**: Template and schema caching
- **Parallel Processing**: Concurrent AI requests
- **Connection Pooling**: LLM API connection management
- **Lazy Loading**: Pack loading on demand

## 🔧 Configuration

### Global Configuration
```yaml
# ~/.gtcx/config.yaml
default_model: claude
safe_mode: pr
log_level: info
max_tokens: 4000
timeout: 30000
retry_attempts: 3
```

### Project Configuration
```yaml
# .gtcx/config.yaml
project_name: "My Project"
default_owner: "dev-team"
enabled_packs:
  - agile
  - compliance
  - accessibility
ai_settings:
  model: claude
  temperature: 0.7
  max_tokens: 4000
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18+ with npm
- Git for version control
- GitHub CLI for PR creation (optional)

### Installation
```bash
# Global installation
npm install -g gtcx

# Development installation
git clone https://github.com/gtcx/launchpad
cd launchpad
npm install
npm run build
npm link
```

### First Run
```bash
gtcx init --interactive
gtcx packs install agile
gtcx packs enable agile
gtcx --new-epic "My First Epic"
```

## 🔮 Future Enhancements

### Planned Features
- **Plugin System**: Third-party command extensions
- **Workflow Automation**: Multi-step command sequences
- **Team Collaboration**: Shared configurations and templates
- **Advanced AI**: Custom model fine-tuning
- **Integration Hub**: Third-party tool connections

### Performance Improvements
- **Native Binaries**: Go/Rust for performance-critical operations
- **Smart Caching**: Intelligent template and result caching
- **Background Processing**: Async command execution
- **Resource Optimization**: Memory and CPU usage optimization

---

**Document Version**: 1.0.0  
**Last Updated**: December 2024
**Next Review**: January 2025  
**Owner**: GTCX Engineering Team
