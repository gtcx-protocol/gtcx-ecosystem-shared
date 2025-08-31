## Structured Task List from Claude/Cursor Docs (Mapped to Project TODOs)

Source files: `claude/cursor/*.md`

### Mapped to existing TODOs
- 3d-terrain (pending)
  - Implement high-accuracy GPS overlays on a 3D terrain view with satellite basemap
  - Acceptance: Terrain renders with correct tiles; marker accuracy bands; steady 60fps on target devices
  - UAT: Field user can visualize site with terrain and confirm coordinates within ±5m

- blockchain (pending)
  - Integrate origin certificate anchoring (hashes) to blockchain for immutability
  - Acceptance: Cert hash stored; verification flow validates on-chain vs local hash
  - UAT: Trader verifies certificate authenticity offline and online

- ai-analytics (pending)
  - Phase 1 (Rules): Location/time/role rules to trigger suggestions
  - Phase 2 (Learning): Preference weighting; acceptance/dismissal feedback loop
  - Acceptance: >70% suggestion acceptance for at least one persona within pilot
  - UAT: Predefined scenarios produce expected suggestions with correct priority

- production-deploy (pending)
  - Add health-check probes for new workflows, enforce gates in CI
  - Kubernetes manifests and secrets for staging/uat/prod; autoscaling policy
  - Acceptance: Green health-check; rollout with no downtime; logs clean of critical errors
  - UAT: Staging mirrors prod; UAT exit criteria met and signed off

### New Epics and Tasks
- Role-Based Onboarding (Epic)
  - Add role selection and role-specific home screens behind feature flag
  - Telemetry: adoption, flow completion rates
  - Tests: navigation, persistence, a11y

- Gold Lot Registration (Epic)
  - Steps: GPS capture → evidence photos → lot form → crypto proof → certificate
  - Integrate with crypto service; generate QR certificate
  - Perf budgets; offline-first

- Daily Work Site Verification (Epic)
  - Start/Break/End actions; background location; summaries; incident reports
  - Battery/perf constraints; sync logic

- Government Inspector Interface (Epic)
  - Auth + checklists + evidence + signatures + PDF report
  - Sync to government systems (stub/mock for UAT)

### Acceptance Criteria (Common)
- Availability: screens load <3s; actions <1s feedback
- Reliability: offline queueing; retry on reconnect
- Security: signatures, integrity checks; least-privilege access
- Observability: analytics, logs, and trace IDs in flows



