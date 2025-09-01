## QA & UAT Pre‑Planning Checklist

This checklist must be completed before starting any major feature or release. It ensures testability is designed-in, documentation is updated, health checks are extended, robust test scripts exist, UAT is planned, and logs are monitored with a remediation plan.

### 1) Scope & Success Criteria
- Define feature scope, risks, and measurable acceptance criteria
- Map to business, security, performance, and regulatory outcomes

### 2) Testability Design
- Identify test seams, dependency injection points, and deterministic modes
- Add feature flags and environment toggles for QA/UAT
- Instrument analytics and trace IDs for test runs

### 3) Documentation Updates (PR must include)
- Update `TESTING_STRATEGY.md` with coverage plan and areas impacted
- Update `QA_TESTING_GUIDE.md` test cases (unit, integration, security, performance)
- Update `docs/UserAcceptanceTesting.md` scenarios and exit criteria
- Update runbooks: `BUILD_DEPLOYMENT_GUIDE.md` and any playbooks

### 4) Health Check Extensions
- Add feature-specific probes into `scripts/health-check.js`
  - Endpoint availability or screen mount validation
  - Metro/Expo log scanning rules for the new feature
  - Config checks (env variables, package dep, routing entries)

### 5) Automated Test Scripts
- Unit tests for logic and reducers/stores
- Rendering tests for screens and components
- Integration tests for flows and error handling
- Performance budgets and assertions where relevant

### 6) UAT Plan & Data
- Update `docs/UserAcceptanceTesting.md` with personas, scenarios, data sets
- Define UAT schedule, tooling, and sample data creation commands
- Define UAT exit criteria and sign‑off approvers (PM, Eng Lead, Compliance)

### 7) Server Log Review & Fix Workflow
- Ensure Expo/Metro logs are captured: `expo.log`, `expo_new.log`, `tradepass-app/expo.log`
- Define error patterns to detect and a triage guide
- Add remediation steps and post‑mortem template

### 8) Release Readiness Gates
- All items in this checklist are green
- `npm run health-check` passes (no criticals)
- Quality bar: lint/typecheck/tests pass; target coverage achieved
- UAT exit criteria met and signed off

---

### Command Helpers

```bash
# Generate and print the pre-plan checklist in terminal
npm run qa:preplan
npm run qa:preplan:print

# Run automated validations and health checks
npm run auto-test
npm run health-check
```

### RACI (example)
- Responsible: Feature Engineer
- Accountable: Engineering Lead
- Consulted: QA Lead, Product Manager, Compliance Officer
- Informed: Stakeholders



