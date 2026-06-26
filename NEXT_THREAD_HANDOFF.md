# Co Pilot Security v3.0.67 — Proof Upload Confirmation + E2E QA

## What changed
- Guard proof upload now shows preview confirmation before upload.
- Guard receives clear uploading, success, and failure feedback.
- File validation catches unsupported types and oversized photo/video selections before upload.
- Complete Job is blocked while proof is uploading.
- If no proof is attached or the last proof upload failed, Complete Job opens a confirmation modal with Upload Proof or Complete Without Proof.
- Completed jobs with proof are routed to Dispatch Proof Review.
- Completed jobs without proof remain available in Report Builder for no-proof reports.
- Proof Review now defaults/resets to All Dates when a stale Today filter hides existing proof.
- Proof Review rows prefer uploaded_at over created_at so new proof is not hidden by old request dates.
- No URL inputs were added.
- No new SQL required.

# NEXT THREAD HANDOFF — CO PILOT SECURITY APP

Latest package:
v3.0.67 PROOF UPLOAD CONFIRMATION + E2E QA

Important instruction:
The user is building this app through GitHub ZIP uploads into Bolt. Do not suggest Bolt AI prompts because the user does not have Bolt tokens. All future changes should be made by creating complete GitHub-ready ZIP replacement packages.

App:
Co Pilot Security — a security patrol web app with three portals:
1. Dispatch/Admin
2. Guard
3. Client

Current latest build:
v3.0.67 PROOF UPLOAD CONFIRMATION + E2E QA

What v3.0.67 changed:
- Built from v3.0.65 GLOBAL ACTION LOCK + WORKFLOW QA.
- Preserved global approve/reject/finalize/action-lock behavior.
- Added workflow state normalization after app data loads.
- Pending Dispatch now clears stale selected requests that no longer belong in Pending Dispatch.
- Report Builder now routes already-published reports to Report Archive instead of keeping the report in a publishable state.
- Visual-only placeholder icon buttons are marked disabled so they do not look like broken active controls.
- Form submit buttons now show a busy state while saving to reduce double submission.
- Removed duplicate Guard Approval search handler.
- Removed duplicate Guards search handler.
- Removed unreachable approval-notes dead code.
- No new SQL required.

Recently completed builds:
- v3.0.58 CLIENTS COMMAND CENTER
- v3.0.59 ACTIVITY LOG COMMAND CENTER
- v3.0.60 PROOF REVIEW COMMAND CENTER
- v3.0.61 REPORT BUILDER COMMAND CENTER
- v3.0.62 REPORT BUILDER GUARD NAME FIX
- v3.0.63 REPORT ARCHIVE COMMAND CENTER
- v3.0.64 SERVER VERSION QA FIX
- v3.0.65 GLOBAL ACTION LOCK + WORKFLOW QA
- v3.0.67 PROOF UPLOAD CONFIRMATION + E2E QA

Major requirements to preserve:
- Client, Guard, and Dispatch portals must keep the modern dark command-center design.
- Sidebar redesign must remain global and uncluttered.
- Dispatch sidebar profile area must never overlap Dashboard button.
- Guard, Client, and Dispatch maps should share the same real-map style/blueprint.
- Dispatch map can see all saved properties and all online guards.
- Client map can only see the client’s own property/properties and assigned accepted guards.
- Guard map shows the guard’s assigned property route and GPS.
- Guards visible to Dispatch/Client only when online; offline guards visible to no one.
- No URL entry fields for photos/videos anywhere. Users must upload from device only.
- Client can add/edit properties with uploaded images, not image URLs.
- Admin/Dispatch must be able to finalize reports even with no photo/video proof.

Workflow to preserve:
Client request → Pending Dispatch → Assign Guard → Guard accepts → GPS route → Guard uploads proof → Proof Review → Report Builder → Report Archive.

Where to go next:
Upload and test v3.0.67 in Bolt. Test the full workflow end-to-end: client request, dispatch assignment, guard accept/GPS/proof upload, proof review, report builder publish, and report archive. Then continue with any remaining global QA and launch polish. Pricing/payment/subscription remains last.
