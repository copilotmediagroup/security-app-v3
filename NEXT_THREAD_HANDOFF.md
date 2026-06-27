# NEXT THREAD HANDOFF — CO PILOT SECURITY APP

Latest package:
v3.0.73 FULL WORKFLOW STATUS UNIFICATION

Important instruction:
The user is building this app through GitHub ZIP uploads into Bolt. Do not suggest Bolt AI prompts because the user does not have Bolt tokens. All future changes should be made by creating complete GitHub-ready ZIP replacement packages.

App:
Co Pilot Security — a security patrol web app with three portals:
1. Dispatch/Admin
2. Guard
3. Client

Current latest build:
v3.0.73 FULL WORKFLOW STATUS UNIFICATION

What v3.0.73 completed:
- Added shared workflow stage language across the app.
- Added a workflow stage strip to Client Reports, Proof Review, Report Builder, and Report Archive.
- Standardized major stages:
  - Client Request
  - Pending Dispatch
  - Guard Assigned
  - Guard Accepted
  - Patrol In Progress
  - Proof Uploaded
  - Job Completed
  - Proof Review
  - Report Builder
  - Published Report
- Client Reports now uses Published Report instead of generic Completed.
- Proof Review now uses Needs Review for actionable pending proof.
- Report Archive badges now say Published Report, Draft Report, and Scheduled Report.
- Guard Completed jobs now show whether jobs are waiting for proof review, ready for report builder, or already published.
- Client request rows now use the same workflow-stage language.
- Preserved v3.0.72 count clarity: Published Reports vs Reports With Proof vs Reports No Proof.
- No new SQL required.

Recent build history:
- v3.0.68 CLIENT REPORT PREVIEW + DOWNLOAD FIX
- v3.0.69 PROOF REVIEW APPROVAL BUTTON + LOCK STATUS FIX
- v3.0.70 PROOF REVIEW KPI STATUS CLEANUP
- v3.0.71 CLIENT REPORT PUBLISH SYNC + TIMESTAMP FIX
- v3.0.72 GLOBAL REPORT/PROOF COUNT CLARITY FIX
- v3.0.73 FULL WORKFLOW STATUS UNIFICATION

Major requirements to preserve:
- Client request → Pending Dispatch → Assign Guard → Guard accepts → GPS route → Guard uploads proof → Proof Review → Report Builder → Report Archive.
- No URL entry fields for photos/videos anywhere.
- Users must upload from device only.
- Dispatch/Admin can finalize reports even with no photo/video proof.
- Published reports must reflect in Client Reports.
- Offline guards must not be visible on maps.
- Sidebar redesign must stay global and uncluttered.

Recommended next build:
v3.0.74 JOB TIMELINE / AUDIT TRAIL
Add a consistent timeline to requests, reports, completed jobs, and archive so each record shows the full chain of custody.
