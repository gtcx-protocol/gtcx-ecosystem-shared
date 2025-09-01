## Service Level Agreement (SLA)

Applies to: GeoTag™ and TradePass™ services (mobile, web, APIs, and supporting infrastructure).

Version: 1.0 • Effective Date: TBD • Owner: SRE/Operations Lead

---

### 1. Purpose & Scope
This SLA defines service targets, incident response, maintenance practices, and credits. It covers production environments for GeoTag™ and TradePass™. Staging/UAT are non‑SLA environments but monitored similarly.

### 2. Definitions
- SLI (Service Level Indicator): Measured metric (e.g., availability, latency, error rate).
- SLO (Service Level Objective): Target for an SLI (e.g., 99.9% monthly availability).
- SLA: Contractual commitment; failure may trigger credits per Section 10.

### 3. Availability & Performance Targets (SLOs)
- Availability (per service, monthly):
  - API and Web: 99.9%
  - Mobile Backend APIs: 99.9%
  - Identity/Auth: 99.95%
  - Excludes planned maintenance windows (Section 7) and force majeure.
- Latency:
  - API p95: ≤ 200 ms; p99: ≤ 500 ms
  - Web TTI p95: ≤ 2.0 s on reference devices
  - Mobile cold start p95: ≤ 3.0 s; warm start p95: ≤ 1.0 s
- Error Rates:
  - API 5xx rate p95: ≤ 0.5%
  - Mobile crash rate (30‑day) ≤ 0.1% DAU
  - Background job failure rate p95: ≤ 1.0%
- Data Protection:
  - RPO: ≤ 15 minutes
  - RTO: ≤ 60 minutes
- Notifications/Queues:
  - p95 end‑to‑end delivery latency: ≤ 60 seconds

### 4. Security & Compliance Targets
- Patch Management:
  - Critical vulnerabilities: patch or mitigate within 24 hours
  - High within 3 business days; Medium within 10 business days
- Encryption:
  - In transit: TLS 1.2+; At rest: AES‑256 or cloud KMS equivalent
- Access & Audit:
  - SSO + MFA for production access; least‑privilege RBAC
  - Audit log retention: ≥ 400 days
- Data:
  - Backups: hourly incremental, daily full; retention: 35 days minimum
  - DR test exercises: quarterly with documented outcomes

### 5. Incident Classification & Response
- Priority Definitions:
  - P0 (Critical): Complete outage, security breach, or data loss risk
  - P1 (High): Severe degradation affecting many users or core flows
  - P2 (Medium): Partial impairment, workarounds exist
  - P3 (Low): Minor issues, cosmetic, or limited impact
- Response Targets (24x7 on‑call):
  - P0: Acknowledge ≤ 15 min; Mitigation ≤ 60 min; Resolution ≤ 4 hours
  - P1: Acknowledge ≤ 30 min; Mitigation ≤ 4 hours; Resolution ≤ 1 business day
  - P2: Acknowledge ≤ 4 hours; Resolution ≤ 5 business days
  - P3: Acknowledge ≤ 1 business day; Resolution in next planned release
- Communication:
  - Status Page: updates at least hourly for P0/P1; daily for P2
  - Incident channel and email notifications for subscribed customers
  - Post‑Incident Report (RCA): within 5 business days (P0/P1)

### 6. Monitoring, Measurement, and Reporting
- Observability:
  - Uptime, latency, and error SLIs via APM/metrics (Prometheus/Grafana or vendor)
  - Mobile crash reporting (e.g., Crashlytics/Sentry)
  - Synthetic checks and health probes; log aggregation with alerting
- Internal Health Checks:
  - CI gate runs `npm run health-check` to detect bundle/resolver/log errors
  - Pre‑release QA: `npm run qa:preplan`, `npm run auto-test`
- Reporting:
  - Monthly SLA report with SLI/SLO rollups, incidents, credits
  - Customer‑specific reports on request

### 7. Maintenance & Change Management
- Planned maintenance window: Sundays 02:00–04:00 UTC (as needed), 7‑day advance notice for impactful work
- Emergency maintenance: as required, with as much notice as practicable
- Change management:
  - Blue/Green or Rolling deploys with canaries where possible
  - Feature flags; documented rollback plans

### 8. Disaster Recovery (DR) & Business Continuity
- Multi‑AZ by default; cross‑region failover plan
- DR drills: quarterly; objectives per RPO/RTO in Section 3
- Backup integrity verification: daily sample restores

### 9. Fair Use, Limits, and Client Responsibilities
- API Limits (typical defaults, adjustable by plan):
  - 1000 requests/min per org; burst 2x for 60 seconds
  - Webhook retries with exponential backoff up to 24 hours
- Client Responsibilities:
  - Provide accurate contact and escalation info
  - Maintain supported client versions; keep credentials secure
  - Follow rate limits and integration best practices

### 10. Service Credits (Availability Only)
- Monthly Availability Credit Schedule (per affected service):
  - 99.0%–99.9%: 5% credit
  - 98.0%–98.99%: 10% credit
  - < 98.0%: 25% credit
- Conditions:
  - Credits apply to monthly fees for the affected service; request within 30 days of report issuance
  - Credits are sole and exclusive remedy for SLA availability breaches

### 11. Exclusions
- Issues caused by: force majeure, customer networks/devices, third‑party dependencies outside our control (unless designated sub‑processor with back‑to‑back SLAs), or violations of fair use
- Beta features and sandbox/UAT environments

### 12. Contacts & Escalation
- Support: support@example.com (24x7 P0/P1), business hours for P2/P3
- Escalation: oncall‑manager@example.com; Executive sponsor on request
- Status Page: https://status.example.com

### 13. Revisions
- SLA may be updated with 30‑day notice. Material changes require customer acknowledgment for enterprise plans.

---

### Appendix A: SLI Details & Measurement
- Availability: weighted minute‑level availability excluding planned maintenance
- Latency: p95/p99 by route and aggregate; measured at edge/ALB and service
- Errors: HTTP status families and app‑level failure counters
- Mobile Stability: crashes per active user per day; 30‑day rolling window

### Appendix B: Compliance & Privacy (Summary)
- Data processing agreements available upon request
- Data residency options for enterprise (region selection where supported)
- Access reviews quarterly; SOC2/ISO27001 roadmap/attestations available to enterprise

### Appendix C: Operational Playbooks (References)
- Health Check: `scripts/health-check.js` (probes, log scanning, bundle checks)
- QA/UAT Pre‑Planning: `docs/QA-UAT-Preplan.md`, `scripts/qa-uat-preplan.js`
- UAT Plan: `docs/UserAcceptanceTesting.md`
- Deployment: `deployment/` (Docker/Kubernetes)

