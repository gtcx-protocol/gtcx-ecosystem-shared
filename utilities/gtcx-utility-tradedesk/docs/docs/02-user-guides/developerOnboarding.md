# 🚀 Developer Onboarding Guide
*Become a 300x contributor in 60 minutes*

---

## 🎯 **WELCOME TO THE GTCX PLATFORM**

Congratulations! You're about to join the team building the world's most advanced mining digitization platform. This guide will get you from zero to productive contributor in under 60 minutes.

### **What You're Building**
- **🌍 Global Impact**: Digitizing mining across 25+ countries
- **💰 Market Size**: $1.7 trillion global mining industry
- **🏛️ Government Integration**: Direct partnerships with regulatory bodies
- **🚀 Technology**: Cutting-edge React Native, Ruby, and blockchain

---

## ⚡ **60-MINUTE SETUP CHALLENGE**

### **Minutes 0-15: Environment Setup**

#### **Prerequisites Check**
```bash
# Verify these are installed
node --version    # Need v18+
npm --version     # Need v8+
git --version     # Need v2+
ruby --version    # Need v2.7+

# If missing, install via:
# macOS: brew install node ruby git
# Ubuntu: sudo apt install nodejs npm ruby git
```

#### **Clone & Initial Setup**
```bash
# Clone repository
git clone https://github.com/gtcx-platform/geotag-app.git
cd geotag-app

# Install dependencies
npm install

# Setup development environment
cp .env.example .env.local
```

### **Minutes 15-30: Development Environment**

#### **Start Development Servers**
```bash
# Terminal 1: Mobile app development
npm run dev:mobile

# Terminal 2: API server
npm run dev:api

# Terminal 3: Web dashboard (optional)
npm run dev:dashboard
```

#### **Verify Setup**
- Open Expo app on your phone and scan QR code
- Visit `http://localhost:3001/health` - should return `{"status": "ok"}`
- Mobile app should load the GTCX login screen

### **Minutes 30-45: Understanding the Codebase**

#### **Key Directories**
```
geotag-app/
├── app/                    # 📱 Mobile app screens (Expo Router)
├── src/
│   ├── components/         # 🧩 Reusable UI components
│   ├── services/          # 🔧 API client and business logic
│   ├── store/             # 📊 Zustand state management
│   └── constants/         # 🎯 App configuration
├── tradepass-app/         # 🛡️ TradePass identity app
├── docs/                  # 📚 Complete documentation
└── scripts/               # 🔧 Development utilities
```

#### **Quick Code Tour**
1. **Start Here**: `app/_layout.tsx` - Main app navigation
2. **Authentication**: `src/services/api.ts` - Login/register logic
3. **UI Components**: `src/components/ui/` - Apple-style design system
4. **State Management**: `src/store/` - User data and app state
5. **GPS Features**: `src/services/location.ts` - Core GeoTag functionality

### **Minutes 45-60: Make Your First Contribution**

#### **Run Tests**
```bash
# Ensure all tests pass
npm test

# Run specific test suites
npm run test:unit        # Unit tests
npm run test:integration # API integration tests
```

#### **Your First Task: Fix a Documentation Typo**
1. Find a small typo in any `.md` file
2. Create a branch: `git checkout -b fix/docs-typo`
3. Make the fix and commit: `git commit -m "docs: fix typo in onboarding guide"`
4. Push and create PR: `git push origin fix/docs-typo`

🎉 **Congratulations! You're now a GTCX contributor!**

---

## 🧠 **CORE CONCEPTS YOU NEED TO KNOW**

### **1. GeoTag™ Technology**
- **GPS Verification**: Sub-3-meter accuracy for mining sites
- **Cryptographic Proof**: Blockchain-backed location verification
- **Offline Support**: Works in remote areas without internet
- **Government Integration**: Direct API connections to regulatory bodies

### **2. Architecture Patterns**
```typescript
// State Management (Zustand)
const useLocationStore = create<LocationState>((set) => ({
  currentLocation: null,
  setLocation: (location) => set({ currentLocation: location }),
}))

// API Client Pattern
const apiClient = {
  post: <T>(endpoint: string, data: any): Promise<T> => {
    return fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json())
  }
}

// Component Pattern
const LocationCard: React.FC<LocationCardProps> = ({ location }) => {
  return (
    <Card style={styles.locationCard}>
      <Text style={styles.coordinates}>
        {location.latitude}, {location.longitude}
      </Text>
    </Card>
  )
}
```

### **3. Development Workflow**
1. **Pick Issue**: Check GitHub issues or ask team lead
2. **Create Branch**: `feature/issue-description` or `bugfix/issue-description`
3. **Develop & Test**: Write code, run tests, verify functionality
4. **Code Review**: Create PR with descriptive title and description
5. **Deploy**: Approved changes auto-deploy to staging

---

## 🎯 **YOUR FIRST WEEK MILESTONES**

### **Day 1: Setup & Orientation**
- ✅ Complete 60-minute setup challenge
- ✅ Join team Slack/communication channels
- ✅ Attend team standup meeting
- ✅ Make first documentation contribution

### **Day 2-3: Feature Development**
- 🎯 **Beginner Task**: Fix a UI bug or improve error messages
- 🎯 **Intermediate Task**: Add a new component to the design system
- 🎯 **Advanced Task**: Implement a new API endpoint

### **Day 4-5: Testing & Documentation**
- ✅ Write tests for your contributions
- ✅ Update documentation for any new features
- ✅ Review other team members' PRs

### **End of Week 1 Goals**
- 🏆 **Code**: 2-3 merged PRs with meaningful contributions
- 🏆 **Tests**: All new code covered by tests
- 🏆 **Knowledge**: Understand the core platform architecture
- 🏆 **Team**: Active participant in team processes

---

## 🚀 **BECOMING A 300X CONTRIBUTOR**

### **Level 1: Code Contributor (Week 1-2)**
- Fix bugs and implement small features
- Write comprehensive tests
- Improve documentation and developer experience
- **Goal**: Deliver reliable, well-tested code

### **Level 2: Feature Owner (Week 3-4)**
- Lead development of complete features
- Design component APIs and system interfaces
- Optimize performance and user experience
- **Goal**: Own end-to-end feature development

### **Level 3: Architecture Contributor (Month 2+)**
- Propose and implement architectural improvements
- Lead code reviews and mentor other developers
- Drive technical decision making
- **Goal**: Shape the technical direction of the platform

### **Level 4: Platform Leader (Month 3+)**
- Define product and technical roadmap
- Lead cross-functional initiatives
- Represent GTCX in external technical discussions
- **Goal**: Drive platform strategy and industry innovation

---

## 🛠️ **ESSENTIAL TOOLS & RESOURCES**

### **Development Tools**
- **IDE**: VS Code with recommended extensions (see `.vscode/extensions.json`)
- **Mobile Testing**: iOS Simulator, Android Emulator, or physical device
- **API Testing**: Postman collection (see `/docs/api/GTCX.postman_collection.json`)
- **Database**: SQLite Browser for local database inspection

### **Communication & Project Management**
- **Slack**: Main team communication
- **GitHub**: Code reviews, issue tracking, project boards
- **Figma**: Design system and UI mockups
- **Notion**: Product requirements and business documentation

### **Learning Resources**
- **React Native**: [Official Documentation](https://reactnative.dev/docs/getting-started)
- **Expo**: [Expo Documentation](https://docs.expo.dev/)
- **Zustand**: [State Management Guide](https://github.com/pmndrs/zustand)
- **Ruby/Sinatra**: [Sinatra Documentation](http://sinatrarb.com/documentation.html)

### **GTCX-Specific Resources**
- **API Documentation**: `/docs/architecture/API_SPECIFICATION.md`
- **Design System**: `/src/components/ui/README.md`
- **Testing Guide**: `/docs/testing/TESTING_STRATEGY.md`
- **Deployment Guide**: `/docs/deployment/PRODUCTION_GUIDE.md`

---

## 🤝 **TEAM CULTURE & VALUES**

### **Our Development Principles**
1. **🎯 Customer First**: Every feature serves real miners and government officials
2. **🚀 Ship Fast**: Deploy early and often, learn from real usage
3. **🧪 Test Everything**: No feature ships without comprehensive tests
4. **📚 Document All**: Code should be self-documenting, decisions recorded
5. **🌍 Global Impact**: We're changing lives across developing countries

### **Communication Guidelines**
- **Be Direct**: Clear, honest communication saves time
- **Be Kind**: We're a supportive team working toward a common goal
- **Be Available**: Respond to messages within 24 hours
- **Be Curious**: Ask questions, challenge assumptions, propose improvements

### **Code Quality Standards**
- **Consistency**: Follow established patterns and conventions
- **Readability**: Code should be easy to understand 6 months later
- **Performance**: Consider mobile devices with limited resources
- **Security**: Mining data is sensitive, security is non-negotiable

---

## 🆘 **GETTING HELP**

### **Quick Help Resources**
1. **Documentation**: Check `/docs/` first - answers to most questions
2. **Team Slack**: `#dev-help` channel for technical questions
3. **Code Reviews**: Tag experienced developers for guidance
4. **Office Hours**: Weekly open sessions with team leads

### **Common Questions & Answers**

**Q: "The mobile app won't connect to the API server"**
A: Check that both servers are running and firewall isn't blocking port 3001. See debugging guide.

**Q: "My tests are failing after pulling latest changes"**
A: Run `npm install` to update dependencies, then `npm run test:reset` to clear test cache.

**Q: "How do I test GPS functionality without being at a mine site?"**
A: Use the location simulator in Expo dev tools or iOS simulator.

**Q: "What mining regulations do I need to understand?"**
A: Check `/docs/business/COMPLIANCE_OVERVIEW.md` for key requirements by country.

### **Emergency Contacts**
- **Production Issues**: Slack `#alerts` channel (immediate response)
- **Security Issues**: Email security@gtcx.global (within 1 hour)
- **Business Critical**: Team lead direct message (within 2 hours)

---

## 🎉 **WELCOME TO THE TEAM!**

You're now equipped to make meaningful contributions to the GTCX platform. Remember:

- **Start Small**: Your first few contributions should focus on understanding the codebase
- **Ask Questions**: The team is here to help you succeed
- **Think Big**: You're building technology that will transform an entire industry
- **Have Impact**: Every line of code you write can improve lives in developing countries

### **Next Steps**
1. ✅ Complete the 60-minute setup challenge
2. ✅ Join team communication channels  
3. ✅ Make your first contribution
4. ✅ Schedule 1:1 with team lead to discuss goals
5. ✅ Start working on your first feature assignment

**Welcome to GTCX - let's digitize the global mining industry together! 🚀**

---

*Last Updated: August 10, 2025*  
*Version: 1.0*  
*For updates or questions about this guide, contact the development team.*