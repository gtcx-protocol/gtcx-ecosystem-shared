## Proposed Issues (with Acceptance Criteria and UAT)

### Issue: Implement Role-Based Onboarding (Feature Flagged)
- Description: Add role selection and dedicated home screens for Miner, Inspector, Company, Trader.
- Acceptance Criteria:
  - Role is persisted; can be changed in settings
  - New users see onboarding by default; legacy users can opt-in
  - Navigation to role workflows is one tap
  - a11y: large touch targets, outdoor contrast
- UAT:
  - Miner: reaches “Register New Gold Discovery” in <2 taps
  - Inspector: reaches checklist start in <2 taps

### Issue: Gold Lot Registration Workflow (End-to-End)
- Description: Guided flow for origin verification and certificate generation.
- Acceptance Criteria:
  - GPS accuracy gate (≤5m) before proceeding
  - Photos embedded with GPS/timestamp; integrity protected
  - Crypto proof generated; certificate with QR produced
  - Offline-first; sync when online
- UAT:
  - Complete in ≤10 minutes with success message and shareable cert

### Issue: Daily Work Site Verification
- Description: One-tap work sessions with background location and day summary.
- Acceptance Criteria:
  - Start/Break/End actions; timer and activity log
  - Background location tracking with battery budget
  - Daily summary and export
- UAT:
  - Session started in <30 seconds; end-of-day summary generated

### Issue: Government Inspector Interface MVP
- Description: Inspector auth, checklist, evidence capture, digital signature, PDF report.
- Acceptance Criteria:
  - Checklist flows per inspection type; evidence gallery
  - Digital signature applied; report generated
  - Sync API mocked with retry
- UAT:
  - Routine inspection completes in ≤3 hours; report uploaded

### Issue: Contextual Suggestion System – Phase 1 (Rules)
- Description: Rule-driven suggestions by role, location, time.
- Acceptance Criteria:
  - Suggestions visible as non-intrusive cards; gesture actions
  - Analytics recorded for acceptance/dismissal
- UAT:
  - Known scenarios trigger correct suggestion with expected priority

### Issue: Health Check Extensions for New Workflows
- Description: Add probes to validate screen bundles and basic actions.
- Acceptance Criteria:
  - Health check requests dev bundles for new routes
  - Log scanning rules include new error patterns
- UAT:
  - CI gate fails on missing screens or resolver errors



