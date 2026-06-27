# NEXT THREAD HANDOFF — CO PILOT SECURITY APP

Latest package:
v3.0.70 PROOF REVIEW KPI STATUS CLEANUP

Important instruction:
The user is building this app through GitHub ZIP uploads into Bolt. Do not suggest Bolt AI prompts because the user does not have Bolt tokens. All future changes should be made by creating complete GitHub-ready ZIP replacement packages.

App:
Co Pilot Security — security patrol web app with three portals:
1. Dispatch/Admin
2. Guard
3. Client

Current latest build:
v3.0.70 PROOF REVIEW KPI STATUS CLEANUP

What was just fixed:
- Proof Review KPI/status wording was confusing after v3.0.69.
- User correctly noticed Approved showed 1 while several items were Published/Locked.
- v3.0.70 fixes this by treating published/locked proof as part of the approved/finalized proof path.
- Approved KPI now shows Approved Total with breakdown: ready + published.
- Published/locked proof now displays as Approved + Published.
- Pending Review language was tightened to Needs Review where appropriate.
- Report Published tab label changed to Published / Locked.
- Approved tab label changed to Approved / Ready.
- Detail rail duplicate proof title was removed.

Workflow expectation now:
Needs Review → Approve/Reject → Approved / Ready → Include in Report → Report Builder → Publish → Approved + Published / Locked.

Recent builds:
- v3.0.65 GLOBAL ACTION LOCK + WORKFLOW QA
- v3.0.66 DEAD CODE CLEANUP + BUTTON QA
- v3.0.67 PROOF UPLOAD CONFIRMATION + E2E QA
- v3.0.68 CLIENT REPORT PREVIEW + DOWNLOAD FIX
- v3.0.69 PROOF REVIEW APPROVAL BUTTON + LOCK STATUS FIX
- v3.0.70 PROOF REVIEW KPI STATUS CLEANUP

Major requirements to preserve:
- Modern dark command-center UI.
- No Bolt AI prompts; ZIP replacement packages only.
- No URL entry fields for photos/videos.
- Users upload from device only.
- Dispatch can finalize reports even with no proof.
- Pending proof should show Approve/Reject.
- Approved proof should not be approved twice; next action is Include/Remove.
- Published proof is locked and cannot be changed.
- Client sees only their own properties/reports.
- Guard online/offline controls map visibility.

SQL:
No new SQL required for v3.0.70.
