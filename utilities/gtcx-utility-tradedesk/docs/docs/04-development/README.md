# 🛠️ Development Documentation

This section contains all resources needed for developers to set up, build, test, and deploy the GeoTag™ and TradePass™ applications.

## 📁 Development Categories

### **⚙️ Setup & Configuration**
- **[setup/](./setup/)** - Development environment setup
  - **[CLAUDE.md](./setup/CLAUDE.md)** - Claude Code integration guide
  - **[COMMANDS.md](./setup/COMMANDS.md)** - Available development commands
  - **[COMMAND_FRAMEWORK_IMPLEMENTATION.md](./setup/COMMAND_FRAMEWORK_IMPLEMENTATION.md)** - Command framework docs
  - **[BUILD_INSTRUCTIONS.md](./setup/BUILD_INSTRUCTIONS.md)** - Build procedures

### **🧪 Testing**
- **[testing/](./testing/)** - Testing strategies and procedures
  - **[BETA-TESTING-PLAN.md](./testing/BETA-TESTING-PLAN.md)** - Beta testing plan
  - **[FEATURE_TEST_LIST.md](./testing/FEATURE_TEST_LIST.md)** - Feature test checklist
  - **[GTCX-AUTOMATED-TEST-SUITE.md](./testing/GTCX-AUTOMATED-TEST-SUITE.md)** - Automated testing suite

### **🚀 Deployment**
- **[deployment/](./deployment/)** - Production deployment guides
  - **[cloudflare-configuration.md](./deployment/cloudflare-configuration.md)** - Cloudflare setup
  - **[dns-configuration.md](./deployment/dns-configuration.md)** - DNS configuration
  - **[domain-registration-plan.md](./deployment/domain-registration-plan.md)** - Domain setup
  - **[gtcx-dns-records.md](./deployment/gtcx-dns-records.md)** - DNS records

### **🔧 Troubleshooting**
- **[troubleshooting/](./troubleshooting/)** - Common issues and solutions
  - Development environment issues
  - Build and deployment problems
  - Runtime error solutions

### **📋 Development Tools**
- **[DEVELOPMENT_GEMS.md](./DEVELOPMENT_GEMS.md)** - Development acceleration techniques
- **[COMPREHENSIVE_CODE_ASSESSMENT.md](./COMPREHENSIVE_CODE_ASSESSMENT.md)** - Code quality standards
- **[CRITICAL-REFLECTION-AND-PREVENTION.md](./CRITICAL-REFLECTION-AND-PREVENTION.md)** - Error prevention

## 🚀 Quick Start

### **1. Environment Setup**
```bash
# Clone the repository
git clone <repository-url>
cd geotag-app

# Install dependencies
npm install

# Configure environment
cp env.example .env
```

### **2. Development Commands**
```bash
# Start development servers
npm run start          # Main GeoTag app (port 8081)
npm run dev:tradepass  # TradePass app (port 8082)
npm run dev:both       # Both apps simultaneously

# Testing
npm run test           # Unit tests
npm run test:coverage  # Coverage report
npm run test:government # Government integration tests

# Quality Checks
npm run type-check     # TypeScript validation
npm run lint           # Code linting
npm run format         # Code formatting
```

### **3. Build for Production**
```bash
# Build mobile apps
eas build --platform android --profile production
eas build --platform ios --profile production

# Build web version
npm run web
```

## 🏗️ Architecture Overview

### **Monorepo Structure**
```
/
├── app/                    # Expo Router screens
├── src/                    # Shared source code
├── tradepass-app/         # TradePass application
├── gtcx-backend/          # Rails API backend
├── telegram-bot/          # Telegram bot service
└── docs/                  # Documentation
```

### **Development Stack**
- **Frontend**: React Native + Expo SDK 53
- **Backend**: Ruby on Rails + Node.js services
- **Database**: PostgreSQL + Redis
- **Testing**: Jest + React Native Testing Library
- **CI/CD**: GitHub Actions + AWS deployment

## 📱 Platform Support

### **Mobile Development**
- **Android**: Minimum SDK 21, Target SDK 33
- **iOS**: iOS 12+, iPad support included
- **Development**: Expo Go for rapid testing

### **Web Development**
- **Target Browsers**: Chrome 90+, Firefox 88+, Safari 14+
- **PWA Support**: Offline capability included

## 🧪 Testing Strategy

### **Test Types**
- **Unit Tests**: Component and service testing
- **Integration Tests**: API and database testing
- **E2E Tests**: Complete user workflow testing
- **Performance Tests**: Load and stress testing
- **Security Tests**: Vulnerability assessments

### **Testing Commands**
```bash
# Run specific test suites
npm run test:crypto        # Cryptography tests
npm run test:gps          # GPS location tests
npm run test:ui           # UI component tests
npm run test:performance  # Performance tests
npm run test:security     # Security tests
npm run test:all          # All test suites
```

## 🔒 Security Development

### **Security Practices**
- **Crypto**: Ed25519 signatures, AES encryption
- **Storage**: Expo SecureStore for sensitive data
- **API**: JWT authentication with refresh tokens
- **Compliance**: SOC2 Type II standards

### **Security Testing**
- Automated vulnerability scanning
- Penetration testing procedures
- Code security reviews
- Dependency vulnerability checks

## 🚀 Deployment

### **Environments**
- **Development**: Local development environment
- **Staging**: AWS staging environment for testing
- **Production**: Full AWS production deployment

### **Deployment Process**
1. **Code Review**: Pull request review process
2. **Testing**: Automated test suite execution
3. **Staging**: Deployment to staging environment
4. **Production**: Blue-green production deployment

## 🔗 Related Documentation

- **Technical Architecture**: [../03-technical/](../03-technical/)
- **User Guides**: [../02-user-guides/](../02-user-guides/)
- **Business Requirements**: [../05-business/](../05-business/)

---

*Last Updated: January 2025*