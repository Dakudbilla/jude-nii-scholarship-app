# Jude Nii Scholarship Manager

A robust, modern Next.js 15 web application tailored for the NUPS-G KNUST Scholarship ecosystem. Designed specifically to manage applicant submissions, track multi-year academic criteria, and facilitate anonymous (blind) evaluations by administrators.

## Project Stack & Theme
- **Framework**: Next.js 15 (App Router, Turbopack)
- **Styling**: Tailwind CSS, utilizing a premium NUPS-G **Navy** (`#0f172a`) and **Gold** (`#eab308`) design system.
- **Components**: `lucide-react` (icons), `sonner` (toasts), `framer-motion` (animations).
- **Backend & Database**: Firebase Admin, Firebase Emulator (Firestore + Auth).

---

## Guide: Applicant Workflow

The Applicant portal is designed to provide a seamless, auto-saving, secure method for students to register and track their applications.

### 1. The Gateway (`/` and `/apply`)
- **Landing Page**: Provides high-level scholarship criteria details.
- **Eligibility Quiz**: An animated progression UI verifies user requirements (e.g., active member, GPA standards). No database writes happen here.

### 2. Draft Authentication
- Once passing the gateway, applicants enter their **Student ID** and **Email**.
- The system checks `POST /api/drafts`. If no record exists, it provisions a new application payload. If a record exists, it restores previous states seamlessly regardless of the session.

### 3. The 4-Step Application Form (`/apply/form`)
- **Step 1: Personal Info**: Captures full name, contact details.
- **Step 2: Academic Record**: Captures current Year, Degree, and CWA points.
- **Step 3: Financial & Essays**: Gathers core qualifying variables (Sponsorship status, detailed Financial Hardship & Church Activeness inputs).
- **Step 4: Endorsement Routing**: Applicants select their primary wing. They must declare accuracy to submit.
- **Auto-save**: Every step natively pushes to the backend using `@tanstack/react-query` mutations.

### 4. Status Tracking (`/apply/status`)
- After final submission, applicants authenticate via `/apply/status` to track progress. They can dynamically see status updates (e.g., `PENDING_ENDORSEMENT`, `INTERVIEW`, `REJECTED`, `AWARDED`) and relevant admin feedback notes.

---

## Guide: Admin Workflow

The Admin portal ensures data security, clear rubric management, and simplified workflows for Wing Heads and Internal Reviewers.

### 1. Securing Authentication
- Admins log in at `/admin/login`. 
- The system issues a session token via standard Firebase Auth.
- **Middleware**: `src/lib/auth/middleware.ts` intercepts all API `/api/*` routes. It ensures ONLY superadmins or delegated admins can reach administrative controllers.

### 2. Dashboard Navigation (`/admin/*`)
- **Academic Years**: Control global phases. You can force the system to route applications automatically into the "Active" cycle. You can also toggle "Blind Review" mode for fairness.
- **Wings & Endorsements**: Setup active wing branches. Specific wing heads receive their members' applications matching `PENDING_ENDORSEMENT`.

### 3. Application Review Pipeline (`/admin/applications`)
- Features a premium, filterable data-table tracking every candidate globally.
- **Individual Review & Scoring**: By clicking an application, an admin is taken to individual endpoints resolving to `/admin/applications/[id]`.
- **Blind Review Rendering**: If the cycle is set to Blind Review, the applicant's name and index numbers are hidden across the reviewer UI, replaced with deterministic identifiers (e.g., `ANON-882`).
- **Dynamic Rubrics**: Scorecards automatically inject predefined rubrics with slider inputs matching specific weighting limits (e.g., Need: 40/40, Church Activeness: 30/30).
- **Decisions**: Final outcomes push the status into terminal phases (`INTERVIEW`, `AWARDED`, `REJECTED`).

---

## Local Development & Environment Setup

To run the full stack locally:

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (`.env.local`)
Ensure standard dummy environment keys are present for Emulators to capture logic without breaking:
```env
NEXT_PUBLIC_FIREBASE_PROJECT_ID=demo-jude-nii
NEXT_PUBLIC_FIREBASE_API_KEY=fake-api-key
FIREBASE_AUTH_EMULATOR_HOST="127.0.0.1:9099"
FIRESTORE_EMULATOR_HOST="127.0.0.1:8080"
```

### 3. Boot the Next.js Server
Launch the development server to connect directly to the live Firebase project defined in your environment variables:

```bash
npm run dev
```
