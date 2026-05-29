# Jude Nii Scholarship Management System

A full-stack scholarship administration platform built for **NUPS-G KNUST** (National Union of Presbyterian Students — Ghana, KNUST Chapter). The system manages the complete scholarship lifecycle: student applications, wing head endorsements, blind committee review, and award publication — across multiple academic cycles.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Features](#features)
- [User Flows](#user-flows)
- [Local Development](#local-development)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [Scripts](#scripts)
- [Project Structure](#project-structure)

---

## Overview

The Jude Nii Scholarship system replaces manual spreadsheet-based processes with a secure, auditable, web-based workflow. Three distinct user groups interact with the platform:

| Role | Access | Responsibilities |
|---|---|---|
| **Student / Applicant** | Public portal | Submit applications, track status |
| **Wing Head** | Secure token link | Review and endorse their wing's applicants |
| **Administrator** | Auth-gated admin panel | Score, shortlist, award, manage cycles |

Each academic cycle passes through four states: `SETUP → OPEN → REVIEW → CLOSED`.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Database | Firebase Firestore (via Admin SDK server-side, Client SDK client-side) |
| Auth | Firebase Authentication with custom role claims |
| Styling | Tailwind CSS v4 with custom design tokens |
| UI Components | Radix UI primitives, Lucide React icons, Framer Motion |
| Data Fetching | TanStack React Query v5 |
| Forms | React Hook Form v7 + Zod v4 validation |
| Email (planned) | Resend SDK |
| Linting | ESLint with `eslint-config-next` |

---

## Architecture

```
src/
├── app/                         # Next.js App Router routes
│   ├── (admin)/admin/           # Auth-gated admin pages
│   ├── apply/                   # Student-facing application portal
│   ├── endorse/[token]/         # Wing head endorsement portal
│   └── api/                     # API route handlers
│
├── components/
│   ├── admin/                   # Admin-specific UI components
│   ├── apply/                   # Multi-step form step components
│   └── ui/                      # Shared design system primitives
│
├── lib/
│   ├── interfaces/              # TypeScript data contracts
│   ├── repositories/            # Firestore data access layer
│   ├── services/                # Server-side business logic
│   │   └── client/              # Client-side API service wrappers
│   ├── api/                     # API client, endpoints, query keys
│   ├── auth/                    # Auth middleware (withAuth, withAdminAuth)
│   ├── constants/               # Shared constants (status config, etc.)
│   └── utils/                   # Date formatting, helpers
│
├── hooks/                       # React Query data hooks
└── providers/                   # React context providers
```

**Key design patterns:**

- **Repository pattern** — Firestore access is fully encapsulated; pages never touch the database directly.
- **Service layer** — Business logic (submission, scoring, awards) lives in `lib/services/`, not in API routes.
- **Layered auth middleware** — `withAuth` and `withAdminAuth` wrappers protect every admin API route.
- **Centralised constants** — `statusConfig.ts` is the single source of truth for all status labels and badge colours.
- **Public vs authenticated client** — `apiClient` attaches Firebase ID tokens automatically; `publicClient` is used for unauthenticated routes (apply flow).

---

## Features

### Student Portal
- Eligibility quiz gates the application form
- 4-step application form with automatic draft persistence per step
- Resume any incomplete draft on return visit (student ID + email auth)
- Application status tracker with descriptive stage explanations

### Wing Head Portal
- Secure, time-limited token link (72-hour expiry) sent by admin
- Displays applicant identity, programme, and church activeness essay
- One-click endorse or decline with optional comments
- Single-use token — invalidated immediately after decision

### Admin Panel
- **Cycle management** — 5-step setup wizard (basics, wings, rubric, templates, launch), status progression (SETUP → OPEN → REVIEW → CLOSED)
- **Applications** — searchable, filterable table with average review score column
- **Review** — full applicant detail view with rubric scoring sliders, blind review mode (hides identity, shows anonymous ID), wing head comments, all-reviewer score summary
- **Endorsements** — pending endorsement tracker with copy-to-clipboard token links and expiry status
- **Wings** — CRUD management of wing heads per cycle
- **Awards** — publish awards for all shortlisted applicants with one confirmed action
- **Reports** — status breakdown bar charts, per-wing endorsement rate analytics, CSV export
- **Audit logging** — every admin action (status changes, scores, creates) is recorded

---

## User Flows

### Applicant Flow

```
/ (Home)
  └── /apply (Eligibility quiz)
        └── /apply/form (4-step form)
              ├── Step 1: Personal information
              ├── Step 2: Academic record
              ├── Step 3: Financial hardship + essays
              └── Step 4: Wing selection + declaration
                    └── Submitted → /apply/status
```

### Endorsement Flow

```
Admin copies token link from /admin/endorsements
  └── Wing head opens /endorse/[token]
        ├── Reviews applicant's church essay
        └── Endorses or declines → token invalidated
```

### Admin Review Flow

```
/admin (Cycle selection)
  └── /admin/dashboard
        ├── /admin/applications → /admin/applications/[id]
        │     ├── Score rubric criteria
        │     └── Advance status (Endorsed → In Review → Shortlisted → Awarded)
        ├── /admin/endorsements (pending endorsement tracker)
        ├── /admin/wings (wing head management)
        ├── /admin/awards (publish awards to all shortlisted)
        └── /admin/reports (analytics + CSV export)
```

---

## Local Development

### Prerequisites

- Node.js 18+
- A Firebase project (Firestore + Authentication enabled)

### 1. Clone and install

```bash
git clone <repository-url>
cd jude-nii-scholarship-app
npm install
```

### 2. Configure environment

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

See [Environment Variables](#environment-variables) for details on each key.

### 3. Seed an admin user

After signing up through Firebase Auth, grant admin access using the setup script:

```bash
node scripts/setAdmin.js your-admin@email.com
```

This sets the `role: "SUPER_ADMIN"` custom claim on the Firebase user. The user must then sign out and back in for the claim to take effect.

Alternatively, call the setup API endpoint directly (requires `CRON_SECRET`):

```bash
curl -X POST http://localhost:3000/api/auth/setup \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","role":"SUPER_ADMIN","secret":"<your-CRON_SECRET>"}'
```

### 4. Start the development server

```bash
npm run dev
```

The app is available at [http://localhost:3000](http://localhost:3000).

| Route | Description |
|---|---|
| `/` | Public landing page |
| `/apply` | Student application portal |
| `/admin/login` | Admin sign-in |
| `/admin` | Cycle selection hub |

---

## Environment Variables

Copy `.env.example` to `.env.local` and populate the following:

### Firebase Client SDK *(browser-exposed)*

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Web API key from Firebase project settings |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `<project-id>.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `<project-id>.appspot.com` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Sender ID from project settings |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | App ID from project settings |

### Firebase Admin SDK *(server-only)*

| Variable | Description |
|---|---|
| `FIREBASE_PROJECT_ID` | Same project ID as above (server-side reference) |
| `FIREBASE_CLIENT_EMAIL` | Service account email from the downloaded JSON key |
| `FIREBASE_PRIVATE_KEY` | Private key — escape newlines as `\n` in the `.env` file |

> Generate a service account key: Firebase Console → Project Settings → Service Accounts → **Generate new private key**.

### Application Secrets

| Variable | Description |
|---|---|
| `CRON_SECRET` | Arbitrary secret that protects `POST /api/auth/setup` — use `openssl rand -base64 32` |

---

## Database Schema

All data lives in Firebase Firestore. Top-level collections:

### `academicYears`

```
{
  id:                 string           // Auto-generated
  label:              string           // e.g. "2024/2025"
  status:             "SETUP" | "OPEN" | "REVIEW" | "CLOSED"
  openDate:           Timestamp
  deadline:           Timestamp
  description:        string
  rubric:             RubricCriterion[]
  blindReview:        boolean
  messagingTemplates: Record<string, string>
  createdAt:          Timestamp
  updatedAt:          Timestamp

  // Subcollection
  wings/{wingId}: {
    name:      string
    isActive:  boolean
    headName:  string
    headPhone: string
    headEmail: string
    yearId:    string
  }
}
```

### `applications`

```
{
  id:                         string
  yearId:                     string
  studentId:                  string
  email:                      string
  status:                     ApplicationStatus
  personalInfo:               { fullName, phoneNumber, dateOfBirth, ... }
  academicInfo:               { programme, year, cwa, ... }
  financialInfo:              { sponsorStatus, hardshipEssay, churchEssay, ... }
  wingId:                     string
  endorsementToken:           string   // Single-use, 72hr expiry
  endorsementTokenExpiresAt:  Timestamp
  wingHeadComments:           string?
  blindId:                    string?  // e.g. "A3F81D" — shown in blind review mode
  reviewScore:                number?  // Average across all reviewer scores
  createdAt:                  Timestamp
  updatedAt:                  Timestamp
}
```

### `applicationDrafts`

Composite key `yearId_studentId`. Stores in-progress form data across sessions.

### `reviewScores`

Composite key `applicationId_adminId`. One document per reviewer per application, recalculated into `application.reviewScore` on every save.

### `auditLogs`

Append-only record of all admin actions (creates, status changes, score saves).

### Application Status Flow

```
PENDING_ENDORSEMENT
       │
   ┌───┴──────────────┐
   ▼                  ▼
ENDORSED      REJECTED_BY_WING
   │
   ▼
IN_REVIEW
   │
   ├──► REJECTED
   │
   ▼
INTERVIEW
   │
   ├──► REJECTED
   │
   ▼
AWARDED
```

---

## Scripts

| Script | Command | Description |
|---|---|---|
| Dev server | `npm run dev` | Starts Next.js with Turbopack |
| Production build | `npm run build` | Compiles and type-checks |
| Lint | `npm run lint` | Runs ESLint |
| Set admin role | `node scripts/setAdmin.js <email>` | Grants SUPER_ADMIN to a Firebase user |
| Deploy test admin | `node scripts/deployLiveTestAdmin.js` | Seeds a test admin (non-production use) |

---

## Project Structure (key files)

```
src/
├── lib/
│   ├── interfaces/
│   │   ├── core.ts              # All Firestore document types + repository interfaces
│   │   └── application.ts       # PersonalInfo, AcademicInfo, FinancialInfo sub-types
│   ├── constants/
│   │   └── statusConfig.ts      # Single source of truth for status labels + badge styles
│   ├── utils/
│   │   └── date.ts              # Firebase timestamp normalisation utility
│   ├── auth/
│   │   └── middleware.ts        # withAuth / withAdminAuth route wrappers
│   └── api/
│       ├── apiClient.ts         # Authenticated fetch client (admin panel)
│       ├── publicClient.ts      # Unauthenticated fetch client (apply portal)
│       ├── endpoints.ts         # All API URL constants
│       └── queryKeys.ts         # TanStack Query cache key registry
│
├── components/
│   ├── apply/
│   │   ├── ApplicantLogin.tsx
│   │   ├── Step1Personal.tsx
│   │   ├── Step2Academic.tsx
│   │   ├── Step3Financial.tsx
│   │   ├── Step4Submit.tsx
│   │   └── formSchemas.ts       # Shared Zod schemas for all 4 steps
│   └── admin/
│       ├── applications/
│       │   ├── StatusBadge.tsx
│       │   ├── StageStepper.tsx
│       │   ├── StageControlPanel.tsx
│       │   └── ApplicationDetailSections.tsx
│       ├── setup/
│       │   ├── Step2Wings.tsx
│       │   ├── Step3Rubric.tsx
│       │   └── Step4Templates.tsx
│       └── shared/
│           ├── PageHeader.tsx
│           ├── StatCard.tsx
│           └── EmptyState.tsx
```

---

## Roles & Permissions

Roles are stored as Firebase custom claims and checked server-side on every admin API request.

| Role | Capabilities |
|---|---|
| `SUPER_ADMIN` | Full access — cycle management, publishing awards, role assignment |
| `ADMIN` | Review and score applications, manage wings and endorsements |
| `VIEWER` | Read-only access to admin dashboard and applications |

Grant a role using `scripts/setAdmin.js` or the `/api/auth/setup` endpoint (requires `CRON_SECRET`).

---

*Built for NUPS-G KNUST — empowering faithful members through accessible scholarship administration.*
