# PhishGuard AI — Enterprise Threat Defense & BharatShield™ Cognitive Security

> **Enterprise Threat Intelligence Platform (Production Edition)**  
> **Standard:** SOC-2 Type II & ISO-27001 Alignment Ready  
> **Core Focus:** Autonomous Static Phishing Detection, Cognitive Fraud DNA Profiling, and Human-in-the-Loop Analyst Verification

---

## 1. System Architecture Overview

PhishGuard AI follows a layered defense-in-depth architecture ensuring zero execution of malicious targets, strict type validation, and explainable behavioral heuristics:

```
┌────────────────────────────────────────────────────────┐
│                   User Interface                       │
│    Next.js 16 App Router (Tailwind CSS + Lucide Icons) │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│                  Secure API Layer                      │
│   Rate Limiting • JWT Session Cookies • Zod Validation │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│             URL / Email Analysis Engine                │
│    Lexical Heuristics • Typosquatting • Homoglyphs     │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│      Risk Scoring & BharatShield™ Scam DNA Engine       │
│  0–100 Threat Index • Psychological Levers • Helpline  │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│                    Database Layer                      │
│       Prisma ORM • Relational SQLite / PostgreSQL      │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│       Dashboards, Reports, & Admin Review Queue        │
│   Analytics • Audit Trail • Human-in-the-Loop Triage   │
└────────────────────────────────────────────────────────┘
```

### Architectural Guarantees:
1. **Zero Execution & Zero Ping:** Suspicious URLs and attachments are **never** rendered, downloaded, or visited remotely. Analysis is strictly static, structural, and lexical in isolated memory.
2. **Defensive API Gate:** In-memory sliding-window rate limiting prevents automated scraping or abuse.
3. **Audit Trail Persistence:** All scan telemetry, feature breakdowns, and reviewer notes are persisted relationally in Prisma.

---

## 2. BharatShield™ — Why It Is Different

Traditional phishing classifiers output a binary label (e.g. *Safe* or *Phishing* with a score). **BharatShield goes further** by identifying the psychological manipulation lever, targeted victim group, and India-specific scam context:

| Feature Dimension | Traditional Phishing Detectors | PhishGuard AI with BharatShield |
| :--- | :--- | :--- |
| **Output Type** | Raw numerical score only | Score + Scam DNA + Victim Demographic + Local Guidance |
| **Regional Vectors** | Completely blind to Indian schemes | Detects placement fees, electricity blackouts, UPI QR traps |
| **Victim Profiling** | Generic warnings | Flags risks for college students, senior citizens, merchants |
| **Incident Response** | None | Immediate direct guidance to India Cybercrime Helpline **1930** |

### Key Indian Scam Archetypes Handled:
- **Campus Placement Frauds:** False job interview shortlist demanding advance registration/seat fees.
- **Electricity Disconnection Panic:** Threats of power shutoff at 9:30 PM requiring APK installation.
- **UPI Reverse PIN Traps:** Fraudsters asking users to input a UPI PIN to "receive" cash or refunds.
- **Aadhaar / PAN KYC Block Threats:** Phony bank warnings threatening account freezing.
- **Traffic Challan APKs:** Fake Parivahan SMS distributing Android malware.

---

## 3. Human-in-the-Loop Analyst Review Workflow

Automated algorithms occasionally yield ambiguous scores for novel or borderline patterns. PhishGuard AI addresses this with an enterprise triage workflow:

- When a scan score lands in the **35–70 band** or contains conflicting heuristic signals, it is flagged as:
  $$\text{Approval Status} = \mathbf{Needs\ Review}$$
- Authorized security analysts access the dedicated **Admin Review Queue** (`/admin`) to inspect forensic details and commit one of four decisions:
  1. **Approve as Verified Threat:** Upgrades status to confirmed malicious and logs analyst signatures.
  2. **Mark as False Positive:** Restores domain to clean status to avoid disruption.
  3. **Mark as Safe:** Whitelists validated legitimate portals.
  4. **Escalate for Further Review:** Dispatches to tier-2 incident response teams.

Every decision records the reviewer ID, timestamp, notes, original risk score, and approved classification.

---

## 4. Demo Credentials

The database comes pre-seeded with realistic demo accounts and 17 realistic phishing scenarios:

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Standard User** | `demo@phishguard.ai` | `Demo@123` | URL/Email Scanner, History, BharatShield Hub, Student Safety |
| **Security Analyst (Admin)** | `admin@phishguard.ai` | `Admin@123` | Full access + Admin Review Queue + Telemetry Triage |

*Tip: The `/login` page includes 1-Click login buttons to instantly test either role without typing.*

---

## 5. Quick Start & Local Setup

### Prerequisites
- Node.js 18+ (tested with Node 20 & 24)
- npm or pnpm

### Installation Steps

1. **Clone and install dependencies:**
   ```bash
   git clone <repo-url>
   cd lucky
   npm install
   ```

2. **Initialize Database & Seed Data:**
   ```bash
   npx prisma db push
   node prisma/seed.js
   ```

3. **Start the Development Server:**
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 6. Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx           # Authentication with 1-click presets
│   │   └── register/page.tsx        # New user registration
│   ├── (dashboard)/
│   │   ├── dashboard/page.tsx       # KPI metrics & Scam Trends Near You
│   │   ├── analyze-url/page.tsx     # URL static inspector with export
│   │   ├── analyze-email/page.tsx   # Email lexical & urgency analyzer
│   │   ├── bharatshield/page.tsx    # Contextual Scam DNA Hub
│   │   ├── scan-history/page.tsx    # Audit trail & forensic inspector
│   │   ├── analytics/page.tsx       # Recharts distribution & trends
│   │   ├── admin/page.tsx           # Analyst Human-in-the-Loop review queue
│   │   └── settings/page.tsx        # Student Safety Mode & API tokens
│   ├── api/                         # Next.js Server Route Handlers
│   ├── globals.css                  # Modern cyber theme & glassmorphism
│   ├── layout.tsx                   # AuthProvider & Toast notifications
│   └── page.tsx                     # Landing page with live sandbox scanner
├── components/
│   ├── layout/                      # Navbar, Footer, DashboardSidebar
│   ├── modals/                      # ArchitectureModal, WhyBharatShieldModal
│   ├── providers/                   # AuthProvider context
│   └── ui/                          # RiskGauge, RiskBadge, ApprovalBadge
├── lib/
│   ├── analysis/                    # urlAnalyzer, emailAnalyzer, threatPatterns
│   ├── auth/                        # JWT & rate-limiting guards
│   ├── db.ts                        # Prisma Client singleton
│   ├── utils.ts                     # Score mapping & formatting helpers
│   └── validations.ts               # Zod input schemas
└── prisma/
    ├── schema.prisma                # SQLite/PostgreSQL schema
    └── seed.js                      # Realistic seed corpus
```

---

## 7. Emergency Response

If you encounter financial cyber fraud or identity theft in India:
- **National Cybercrime Helpline:** Call **1930** immediately.
- **Reporting Portal:** [cybercrime.gov.in](https://cybercrime.gov.in)
