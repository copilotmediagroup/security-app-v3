# NEXT THREAD HANDOFF — CO PILOT SECURITY APP

Latest package:
v3.0.72 GLOBAL REPORT/PROOF COUNT CLARITY FIX

Important instruction:
The user is building this app through GitHub ZIP uploads into Bolt. Do not suggest Bolt AI prompts because the user does not have Bolt tokens. All future changes should be made by creating complete GitHub-ready ZIP replacement packages.

App:
Co Pilot Security — a security patrol web app with three portals:
1. Dispatch/Admin
2. Guard
3. Client

Current latest build:
v3.0.72 GLOBAL REPORT/PROOF COUNT CLARITY FIX

What was just fixed:
- User noticed some pages showed 8 published reports while Proof Review showed 6 published/locked items.
- The app was mixing final report totals with proof/media totals.
- v3.0.72 clarifies this globally.
- Report totals now stay consistent across Report Builder, Report Archive, Client Reports, and Proof Review.
- Proof Review now labels proof/media counts separately from report counts.
- Report Archive now shows Published Reports, Reports With Proof, Reports No Proof, Photos Included, Videos Included, and Drafts/Scheduled.
- Report Builder now shows Published Reports, Reports With Proof, Reports No Proof, and proof-media clarity.
- Client Reports now shows Total Reports, Published Reports, Reports With Proof, Reports No Proof, and This Month.
- This makes the valid workflow clear: example, 8 reports published, 6 with proof, 2 without proof.
- No new SQL required.

Recent builds:
- v3.0.67 PROOF UPLOAD CONFIRMATION + E2E QA
- v3.0.68 CLIENT REPORT PREVIEW + DOWNLOAD FIX
- v3.0.69 PROOF REVIEW APPROVAL BUTTON + LOCK STATUS FIX
- v3.0.70 PROOF REVIEW KPI STATUS CLEANUP
- v3.0.71 CLIENT REPORT PUBLISH SYNC + TIMESTAMP FIX
- v3.0.72 GLOBAL REPORT/PROOF COUNT CLARITY FIX

Major requirements to preserve:
- Modern dark command-center design.
- Sidebar redesign must stay global and uncluttered.
- Dispatch sidebar profile area must never overlap Dashboard button.
- Maps across Guard, Client, and Dispatch should share the same real-map style.
- Dispatch map sees all saved properties and all online guards.
- Client map sees only their properties and guards assigned to their accepted patrols.
- Guard map shows assigned property route and GPS.
- Guards visible only when online.
- No URL entry fields for photos/videos anywhere. Upload from device only.
- Client can add/edit properties with uploaded images only.
- Dispatch/Admin can finalize reports even with no photo/video proof.

Workflow to preserve:
Client request → Pending Dispatch → Assign Guard → Guard accepts → GPS route → Guard uploads proof → Complete job → Proof Review → Report Builder → Report Archive → Client Reports.

Suggested next step:
v3.0.73 FULL WORKFLOW LAUNCH QA — test every role end-to-end and clean remaining buttons, states, queues, and layout issues before final mobile/layout polish.
