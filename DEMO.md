# Demo Walkthrough

**Project:** Rotary, SSL Certificate Rotation Tool prototype

**Suggested duration:** 3-5 minutes

## Demo flow

1. Start the app using the instructions in `README.md`. Point out the demo environment label and the seeded certificate inventory.
2. Review the summary counters: total certificates, critical expiries, expiring-soon certificates, and fleet health.
3. Use the status tabs to isolate critical certificates. Select `api.kripya.example` and show its endpoint, issuer, expiration date, and SHA-256 fingerprint.
4. Choose **Renew now**. The prototype moves the certificate into renewal-pending state, advances its expiration, and records the event in Recent activity.
5. Choose **Deploy certificate**. The pending state clears and a deployment event shows the target endpoint.
6. Use **Run discovery** or **Sync now** to add a discovery event and update the last-discovery indicator.
7. Search by hostname or endpoint, then show that the responsive layout remains usable at a narrow viewport.

## Feature highlights

- Certificate inventory and expiration risk overview.
- Status filtering and search.
- Certificate detail panel with endpoint and fingerprint metadata.
- Renewal-to-deployment workflow with visible state transitions.
- Recent activity/audit trail for discovery, renewal, and deployment actions.

## Demo boundaries

All records and actions are local simulations using `.example` hostnames. No ACME challenge is performed, no certificate is issued, no remote server is contacted, and the browser state resets on reload. This keeps the evaluation demonstrable without cloud credentials, private keys, or production access.

## Next production increments

1. Implement a backend inventory API and scheduled endpoint discovery adapters.
2. Persist certificate records, ownership, expiry policy, and immutable audit events.
3. Integrate an ACME client plus DNS provider adapters and a secret manager.
4. Add deployment adapters/AWX job templates, verification, rollback, and alert delivery.
5. Add authentication, RBAC, approval controls, and integration tests against non-production systems.
