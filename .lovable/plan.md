# DevOps Plan for TDK SPORTS — Full Site Development (Self-Hosted Future)

## Deliverable

A single PDF document saved to Files as `TDK_Sports_DevOps_Plan.pdf`, built with reportlab using the same TDK visual treatment as the earlier docs (blue/white palette, DejaVu fonts, TDK logo cover). ~12–16 pages. Content plan below.

## What the document covers

**1. Where the project stands today (current state)**
- React + Vite SPA front end, Lovable Cloud backend (auth, 15 migrations, 7 edge functions), Cashfree live payments, HyperVerge KYC (keys pending), PAT/eligibility flow, event-hosting approval flow.
- Current delivery model: chat-driven development, preview → publish, no CI automation, thin test coverage (bib helpers only), secrets stored in the platform vault.
- Honest gaps register: no staging database, no automated end-to-end tests, no monitoring/alerting, no backup verification, no release checklist.

**2. Target self-hosted architecture**
- ASCII architecture diagram: users → CDN/WAF → web tier (static SPA on Nginx or object storage) → API tier (edge functions become Node/Fastify services or Supabase self-hosted) → Postgres with PITR → object storage for KYC docs/certificates → Redis for queue/cache.
- External services kept: Cashfree (payments), HyperVerge (KYC), SMTP/WhatsApp providers.
- Environments: dev → staging (mirrors production data model, test payment keys) → production. One-command promotion between them.

**3. Infrastructure as Code & provisioning**
- Terraform/Opentofu modules for compute, DNS, TLS, storage; Docker Compose or Kubernetes manifests for app tiers.
- Database migrations versioned in the repo (existing 15 SQL migrations become the seed), applied by CI, never by hand.
- Secrets moved to a vault (Doppler/Vault/SOPS); list every secret the platform currently holds (Cashfree, HyperVerge, SMTP, WhatsApp) and its target home.

**4. CI/CD pipeline (per change)**
- Pipeline stages diagram: lint → typecheck → unit tests (vitest) → build → Playwright E2E on staging → database migration dry-run → deploy → smoke test → release tag.
- Branching: trunk-based, short-lived branches, preview deployments per branch, protected main.
- Release process: semantic version tags, changelog, roll-forward with documented rollback (previous image + migration-aware deployment order).

**5. Testing strategy**
- Test pyramid: unit (existing vitest, expand to payment/eligibility/bib rules), integration (edge-function handlers against a disposable Postgres), E2E Playwright suites for the 5 critical journeys: signup → KYC → register → pay → ticket; eligibility/PAT flow; admin event approval; bib generation; refund path.
- Test data: the free Test Swimathon 2027 event + participant@tdksports.in account formalized as fixtures, removed from production.

**6. Observability & operations**
- Structured logs → Loki, metrics → Prometheus/Grafana, error tracking → Sentry, uptime checks on payment callback and checkout endpoints.
- Alerts that matter: payment verification failures, registration insert failures, KYC function errors, disk/cert expiry.
- Runbooks: payment callback outage, database restore, KYC provider downtime (register-with-warning fallback), event-day traffic surge.

**7. Data protection, backups & DR**
- Postgres daily snapshots + WAL PITR; object-storage bucket versioning for KYC documents and certificates; monthly restore drill with a recorded checklist.
- RPO 15 min / RTO 2 h targets; DR runbook for full-region loss.

**8. Security & compliance**
- RLS parity audit when leaving the managed platform (every public table keeps policies + grants), least-privilege service roles, dependency scanning in CI, TLS/WAF at edge.
- Data-handling notes for Aadhaar/passport KYC documents and payment data (never store card data; Cashfree tokenization), retention schedule for KYC docs, admin access review.

**9. Migration path (Lovable → self-hosted), phased**
- Phase 0 (now, on Lovable): hygiene — expand tests, add release checklist, backfill repo docs.
- Phase 1: extract edge functions into a versioned services repo, stand up staging Postgres, codify migrations.
- Phase 2: CI/CD to staging with E2E suites green.
- Phase 3: production cutover with DNS switch, parallel-run of payment verification, rollback plan.
- Phase 4: hardening — observability, DR drills, load test for event-day spikes.

**10. Team workflow & responsibilities**
- Who does what (dev, ops/DevOps, event-day on-call), definition of done, code review rules, on-call rota for event weekends.

## Execution steps (after approval)

1. Verify project facts by reading the repo (migrations list, edge functions, existing docs' style) — already done in exploration.
2. Write a reportlab Python script in `/tmp` producing `TDK_Sports_DevOps_Plan.pdf` in `/mnt/documents`, matching the TDK branding of the previous two PDFs (blue palette, DejaVu, logo cover).
3. Convert every page to an image and visually inspect all of them; fix layout issues and re-render until clean.
4. Add the PDF to the existing "TDK Sports Documentation" Files collection.
5. Report in chat with a preview tag for the PDF and a one-line summary of what's inside.
