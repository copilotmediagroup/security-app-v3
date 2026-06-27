# NEXT THREAD HANDOFF — CO PILOT SECURITY APP

Latest package:
v3.0.69 PROOF REVIEW APPROVAL BUTTON + LOCK STATUS FIX

Important instruction:
The user is building this app through GitHub ZIP uploads into Bolt. Do not suggest Bolt AI prompts because the user does not have Bolt tokens. All future changes should be made by creating complete GitHub-ready ZIP replacement packages.

App:
Co Pilot Security — a security patrol web app with three portals:
1. Dispatch/Admin
2. Guard
3. Client

Current latest build:
v3.0.69 PROOF REVIEW APPROVAL BUTTON + LOCK STATUS FIX

What v3.0.69 changed:
- Fixed Proof Review status mismatch where proof rows showed Pending Review even though the right rail said Report Already Published.
- Added row-level Approve and Reject buttons for proof that is truly pending and still reviewable.
- Added a Report Published / Locked proof status.
- Added a Report Published tab in Proof Review.
- Locked proof is no longer counted as Pending Review.
- Locked proof shows View Report Archive instead of hidden approve/reject controls.
- Approved proof still allows Include/Remove from Report until the final report is published.
- Rejected proof remains locked and cannot be included in reports.
- Preserved v3.0.68 Client Report preview/download fixes.
- No new SQL required.

Recently completed builds:
- v3.0.65 GLOBAL ACTION LOCK + WORKFLOW QA
- v3.0.66 DEAD CODE CLEANUP + BUTTON QA
- v3.0.67 PROOF UPLOAD CONFIRMATION + E2E QA
- v3.0.68 CLIENT REPORT PREVIEW + DOWNLOAD FIX
- v3.0.69 PROOF REVIEW APPROVAL BUTTON + LOCK STATUS FIX

Major requirements to preserve:
- Keep modern dark command-center design.
- Sidebar redesign stays global and uncluttered.
- Dispatch sidebar profile area must never overlap Dashboard button.
- No URL entry fields for photos/videos anywhere.
- Users must upload photos/videos from device only.
- Dispatch/Admin can finalize reports even with no photo/video proof.
- Client request → Pending Dispatch → Assign Guard → Guard accepts → GPS route → Guard uploads proof → Proof Review → Report Builder → Report Archive.
- Guards visible only when online.
- Dispatch map sees all saved properties and online guards.
- Client map sees only their own properties and guards assigned to accepted patrols.
- Guard map shows assigned property route and GPS.

Next suggested QA:
Upload and test v3.0.69 in Bolt. On Dispatch/Admin → Proof Review, verify:
1. Truly pending proof shows Approve/Reject on the row and in the right rail.
2. Proof locked by a published report shows Report Published, not Pending Review.
3. Approved proof can be included before publishing.
4. Rejected proof cannot be included.
5. Published report proof routes correctly to Report Archive.

Pricing/payment/subscription remains last.
