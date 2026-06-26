# NEXT THREAD HANDOFF — CO PILOT SECURITY APP

Latest package:
v3.0.68 CLIENT REPORT PREVIEW + DOWNLOAD FIX

Important instruction:
The user is building this app through GitHub ZIP uploads into Bolt. Do not suggest Bolt AI prompts because the user does not have Bolt tokens. All future changes should be made by creating complete GitHub-ready ZIP replacement packages.

App:
Co Pilot Security — a security patrol web app with three portals:
1. Dispatch/Admin
2. Guard
3. Client

Current latest build:
v3.0.68 CLIENT REPORT PREVIEW + DOWNLOAD FIX

What v3.0.68 changed:
- Built from v3.0.67 PROOF UPLOAD CONFIRMATION + E2E QA.
- Fixed Client Reports eye/view button so it opens a real selected report preview panel instead of showing a placeholder toast.
- Fixed Client Reports download button so it downloads an existing report URL when available or generates a client-facing report text file when no PDF exists yet.
- Added selected report right-rail preview with report ID, property/address, patrol type, date/time, officer, duration, request, proof count, summary, and included-proof status.
- Added selected row styling on Client Reports.
- Added working Client Reports CSV export.
- Removed placeholder client report messages saying preview/download are future features.
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
- v3.0.66 DEAD CODE CLEANUP + BUTTON QA
- v3.0.67 PROOF UPLOAD CONFIRMATION + E2E QA
- v3.0.68 CLIENT REPORT PREVIEW + DOWNLOAD FIX

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
Client request → Pending Dispatch → Assign Guard → Guard accepts → GPS route → Guard uploads proof → Proof Review → Report Builder → Report Archive → Client Reports.

Where to go next:
Upload and test v3.0.68 in Bolt. Test Client Reports view/download buttons, then continue launch QA around remaining placeholder actions, mobile layout tightening, and final workflow polish. Pricing/payment/subscription remains last.
