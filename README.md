# Rotary | SSL Certificate Rotation Prototype

A working UI prototype for the SSL Certificate Rotation Tool evaluation. It demonstrates certificate discovery inventory, expiry risk monitoring, renewal and endpoint deployment workflow, and an audit trail using seeded local demo data.

## Selected project

**SSL Certificate Rotation Tool**

Rotary models the lifecycle of discovering certificates, identifying those nearing expiry, renewing them, and deploying the renewed certificate to an endpoint. This submission is intentionally a self-contained prototype: no certificates are requested, no secrets are stored, and no real endpoint is contacted.

## Implemented features

- Certificate inventory with domain, issuer, environment, endpoint, expiry, and fingerprint details.
- Status groups for critical, expiring soon, healthy, and renewal pending certificates.
- Search and status filtering, summary metrics, and selected certificate details.
- Simulated discovery with an audit event and last-discovery indicator.
- Simulated renewal that extends the selected certificate expiry and puts it into a deployment-ready state.
- Simulated deployment that clears the pending state and records the endpoint action in recent activity.
- Responsive desktop and mobile layouts.

All names use the reserved `.example` domain. The UI clearly labels itself as a demo environment. Real ACME issuance, DNS challenges, endpoint deployment, authentication, persistence, alert delivery, and secret management are not implemented in this prototype.

## Requirements

- Node.js 20.19+ or 22.12+
- npm

## Setup and run

```powershell
npm install
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`). To produce and serve a production build:

```powershell
npm run build
npm run preview
```

## Verification

```powershell
npm run build
npm run lint
```

## Submission files

- Source code: this repository/workspace.
- Architecture: [ARCHITECTURE.md](ARCHITECTURE.md).
- Demo walkthrough: [DEMO.md](DEMO.md).
- Acknowledgment reply: [EMAIL_DRAFT.md](EMAIL_DRAFT.md).
- Setup: this README.

## Technology

React 19, TypeScript, Vite, lucide-react, and CSS. Application state is held in React state and seeded locally in `src/App.tsx`; it resets on reload by design.
