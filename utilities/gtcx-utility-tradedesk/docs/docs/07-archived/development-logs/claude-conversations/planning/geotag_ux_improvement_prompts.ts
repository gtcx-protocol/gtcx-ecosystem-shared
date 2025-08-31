# GEOTAG™ UX IMPROVEMENT PROMPTS - CONTEXT-DRIVEN INTERFACE
# Transform your technical GPS app into clear mining workflows

# =============================================================================
# PROMPT 1: ROLE-BASED ONBOARDING (Cursor + Claude)
# =============================================================================

Create a role-based onboarding flow for GeoTag™ Ghana mining app that replaces generic GPS interface with clear user workflows.

CONTEXT: Users currently see generic GPS map and don't understand what specific action to take. Need role-specific home screens that guide users to their primary use cases.

FUNCTIONAL REQUIREMENTS:
- First-time app launch asks user to select their mining role
- Different home screens based on selected role
- Clear action buttons for primary workflows
- Beautiful Ghana-inspired design with mining industry branding
- Smooth animations between role selection and main interface

USER ROLES TO SUPPORT:
1. Small-Scale Miner: "Tag gold discoveries & verify work sites"
2. Government Inspector: "Conduct compliance inspections" 
3. Licensed Mining Company: "Verify operations & compliance"
4. Gold Buyer/Trader: "Verify gold lot origins"

TECHNICAL REQUIREMENTS:
- React Native with TypeScript
- AsyncStorage for role persistence
- Smooth transitions with Reanimated 3
- Custom icons for each role
- Ghana flag colors and mining industry styling

COMPONENT STRUCTURE:
```typescript
// Role selection screen
<RoleSelectionScreen />

// Role-specific home screens
<SmallScaleMinerHome />
<GovernmentInspectorHome />
<MiningCompanyHome />
<GoldTraderHome />

// Shared components
<RoleBasedNavigation />
<ActionCard />
<GhanaThemedHeader />
```

UI/UX REQUIREMENTS:
- Large, touch-friendly role selection cards
- Clear descriptions of what each role can do
- Professional government-appropriate styling
- Accessibility support for outdoor use
- Option to change role later in settings

SUCCESS CRITERIA:
- User immediately understands their specific workflow
- Clear path from role selection to primary actions
- Beautiful, professional interface suitable for government use
- Easy to switch between roles for multi-role users

OUTPUT: Complete React Native role-based onboarding system with Ghana mining industry theming.

# =============================================================================
# PROMPT 2: NEW GOLD LOT REGISTRATION WORKFLOW (Cursor + Claude)
# =============================================================================

Create a complete "New Gold Lot Registration" workflow for GeoTag™ that guides small-scale miners through origin verification.

CONTEXT: Small-scale miners discover new gold deposits and need simple, guided workflow to create verifiable origin records with location proof, photos, and cryptographic verification.

USER JOURNEY: "I found gold at this location and need to prove where it came from"

FUNCTIONAL REQUIREMENTS:
- Multi-step guided workflow with progress indicators
- High-accuracy GPS capture with visual feedback
- Camera integration with GPS overlay on photos
- Simple data entry forms optimized for field use
- Cryptographic proof generation with clear success feedback
- Shareable certificate generation (PDF/QR code)

WORKFLOW STEPS:
1. Location Capture: Lock GPS coordinates with accuracy visualization
2. Evidence Collection: Photo capture with automatic GPS embedding
3. Lot Information: Weight estimation, quality assessment, discovery details
4. Cryptographic Proof: Generate tamper-proof verification record
5. Certificate Generation: Create shareable origin certificate

TECHNICAL REQUIREMENTS:
- React Native with TypeScript and React Hook Form
- Expo Location API with high-accuracy GPS settings
- Expo Camera with custom overlay showing GPS coordinates
- Crypto libraries for proof generation (@noble/hashes)
- PDF generation for certificates (react-native-pdf-lib)
- QR code generation for easy sharing

UI/UX REQUIREMENTS:
- Large progress indicator showing current step
- Clear instructions for each step
- Visual GPS accuracy indicators (red/yellow/green)
- Photo preview with GPS coordinates overlay
- Success celebration with certificate preview
- Error handling with helpful guidance

COMPONENT STRUCTURE:
```typescript
<NewGoldLotWorkflow>
  <LocationCaptureStep />
  <EvidenceCollectionStep />
  <LotInformationStep />
  <ProofGenerationStep />
  <CertificateStep />
</NewGoldLotWorkflow>

<LocationAccuracyIndicator />
<GPSOverlayCamera />
<ProgressStepper />
<OriginCertificate />
```

SUCCESS CRITERIA:
- Miner can complete entire workflow in under 10 minutes
- GPS accuracy always better than 5 meters before proceeding
- All evidence cryptographically linked to location
- Generate government-acceptable origin certificate
- Works completely offline with sync when connected

OUTPUT: Complete gold lot registration workflow with cryptographic origin verification.

# =============================================================================
# PROMPT 3: DAILY WORK SITE VERIFICATION INTERFACE (Cursor + Claude)
# =============================================================================

Create a streamlined daily work site verification interface for licensed miners to tag their work locations for government compliance.

CONTEXT: Licensed miners need quick, simple way to log their daily work locations for regulatory compliance. Should be faster than gold lot registration but still provide government-grade verification.

USER JOURNEY: "I'm working at this site today - need to tag it for compliance"

FUNCTIONAL REQUIREMENTS:
- One-tap work session start/stop
- Quick activity type selection (mining, maintenance, inspection)
- Automatic time tracking with location correlation
- Crew size and equipment logging
- Daily summary with total hours and sites visited
- Background location tracking during work sessions

QUICK ACTION BUTTONS:
- 🟢 START WORK DAY
- 🟡 BREAK/LUNCH  
- 🔴 END WORK DAY
- 📋 INCIDENT REPORT

TECHNICAL REQUIREMENTS:
- React Native with background location tracking
- AsyncStorage for work session persistence
- Automatic photo capture every 30 minutes during work
- Battery optimization for all-day tracking
- Sync work logs with government compliance system

UI/UX REQUIREMENTS:
- Minimal interface optimized for gloved hands
- Large action buttons for quick tapping
- Visual work session timer
- Map showing today's work locations
- Simple daily summary statistics

COMPONENT STRUCTURE:
```typescript
<WorkSiteInterface>
  <QuickActionPanel />
  <WorkSessionTimer />
  <LocationTracker />
  <DailySummary />
</WorkSiteInterface>

<WorkTypeSelector />
<CrewSizeInput />
<EquipmentLogger />
<ComplianceStatus />
```

SUCCESS CRITERIA:
- Start work session in under 30 seconds
- Automatic compliance logging throughout day
- Battery lasts full 8-hour work day
- Generate daily compliance report automatically
- Government can verify all work locations

OUTPUT: Streamlined daily work verification system with government compliance integration.

# =============================================================================
# PROMPT 4: GOVERNMENT INSPECTOR INTERFACE (Cursor + Claude)
# =============================================================================

Create a comprehensive government inspector interface for conducting official mining site inspections with complete documentation capabilities.

CONTEXT: Government officials need professional inspection tools that generate official reports, collect evidence, and ensure regulatory compliance verification.

USER JOURNEY: "Official inspection - need complete site documentation for government records"

FUNCTIONAL REQUIREMENTS:
- Inspector authentication with government credentials
- Comprehensive inspection checklists for different inspection types
- Evidence collection with automatic GPS/timestamp embedding
- Digital signature capabilities for official reports
- Real-time sync with government compliance databases
- Multi-site inspection session management

INSPECTION TYPES:
- Routine Compliance Inspection
- Violation Investigation  
- Environmental Assessment
- Safety Audit
- License Verification

TECHNICAL REQUIREMENTS:  
- Government-grade security and authentication
- Digital signature integration (hardware security keys)
- High-resolution photo capture with metadata
- Voice note recording for detailed observations
- Government database API integration
- Official report PDF generation with agency branding

UI/UX REQUIREMENTS:
- Professional government agency styling
- Checklist interface with progress tracking
- Evidence gallery with organization tools
- Inspector notes with voice-to-text
- Official report preview before submission

COMPONENT STRUCTURE:
```typescript
<InspectorInterface>
  <InspectorAuthentication />
  <InspectionTypeSelector />
  <ComplianceChecklist />
  <EvidenceCollector />
  <OfficialReportGenerator />
</InspectorInterface>

<GovernmentCredentialVerifier />
<InspectionChecklist />
<EvidenceGallery />
<DigitalSignature />
<OfficialReportPDF />
```

SUCCESS CRITERIA:
- Complete inspection in 2-3 hours vs 1-2 days manual process
- Generate official government reports automatically
- All evidence cryptographically verified and timestamped
- Seamless integration with government compliance systems
- Audit trail for all inspector actions

OUTPUT: Professional government inspector interface with official reporting capabilities.

# =============================================================================
# PROMPT 5: CONTEXTUAL SMART SUGGESTIONS (Cursor + Claude)
# =============================================================================

Create an intelligent contextual suggestion system that detects user location/behavior and suggests relevant GeoTag™ actions.

CONTEXT: Transform passive GPS app into proactive assistant that suggests relevant actions based on location context, time of day, user role, and previous activity patterns.

INTELLIGENT SUGGESTIONS:
- Detect arrival at known mining site → Suggest starting work session
- Detect new location with gold-bearing geology → Suggest lot registration  
- Detect government inspector at multiple sites → Suggest inspection workflow
- Detect extended time at location → Suggest site documentation

TECHNICAL REQUIREMENTS:
- Machine learning for location pattern recognition
- Integration with geological data for gold potential mapping
- Time-based workflow suggestions
- User behavior learning and adaptation
- Offline suggestion engine

SUGGESTION LOGIC:
```typescript
interface SmartSuggestion {
  trigger: LocationContext | TimeContext | BehaviorPattern;
  action: WorkflowSuggestion;
  confidence: number;
  reasoning: string;
}

// Example suggestions:
- "You're at a new location with gold potential. Tag a discovery?"
- "Work session running 4 hours. Time for safety break?"  
- "Inspector mode: 3 sites visited. Generate consolidated report?"
```

UI/UX REQUIREMENTS:
- Non-intrusive suggestion cards
- Easy accept/dismiss gestures
- Learning from user feedback
- Privacy-focused (no data sharing)

SUCCESS CRITERIA:
- 80%+ suggestion acceptance rate
- Reduces user decision fatigue
- Increases workflow completion rates
- Learns and improves over time

OUTPUT: Intelligent contextual suggestion system that proactively guides users to relevant GeoTag™ workflows.

# =============================================================================
# PROMPT 6: INTEGRATION WITH EXISTING GEOTAG CODEBASE (Cursor + Claude)
# =============================================================================

Integrate the new contextual UX improvements with the existing GeoTag™ codebase while preserving all current GPS and cryptographic functionality.

CONTEXT: You have existing production-ready GeoTag™ code with excellent GPS tracking, cryptographic proofs, and database functionality. Need to add role-based workflows without breaking existing features.

INTEGRATION REQUIREMENTS:
- Preserve all existing GPS tracking capabilities
- Keep current cryptographic proof generation
- Maintain database schema and sync functionality  
- Add new UX layer on top of existing technical foundation
- Ensure backward compatibility with existing data

REFACTORING APPROACH:
1. Wrap existing components in role-based routing
2. Add new workflow screens that use existing GPS/crypto services
3. Create role-specific home screens that navigate to enhanced workflows
4. Preserve all existing API endpoints and data structures

TECHNICAL IMPLEMENTATION:
```typescript
// New app structure preserving existing code
<App>
  <RoleProvider>
    <RoleBasedNavigation>
      {/* New contextual interfaces */}
      <SmallScaleMinerHome />
      <GovernmentInspectorHome />
      
      {/* Enhanced existing screens */}
      <ImprovedGPSScreen /> // Your existing GPS with better UX
      <ImprovedCameraScreen /> // Your existing camera with workflows
      <ImprovedHistoryScreen /> // Your existing history with role filtering
    </RoleBasedNavigation>
  </RoleProvider>
</App>
```

MIGRATION STRATEGY:
- Phase 1: Add role selection without changing existing screens
- Phase 2: Gradually replace generic screens with workflow-specific versions
- Phase 3: Add smart suggestions and advanced contextual features

SUCCESS CRITERIA:
- All existing functionality preserved and enhanced
- New users get clear workflow guidance
- Existing users can opt into new interface gradually
- Performance maintained or improved
- Zero data loss during migration

OUTPUT: Complete integration plan with code modifications to add contextual UX to existing GeoTag™ codebase.