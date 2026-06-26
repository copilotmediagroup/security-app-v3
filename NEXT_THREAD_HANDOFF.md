# NEXT THREAD HANDOFF — CO PILOT SECURITY APP

Latest package:
v3.0.65 GLOBAL ACTION LOCK + WORKFLOW QA

Important instruction:
The user is building this app through GitHub ZIP uploads into Bolt. Do not suggest Bolt AI prompts because the user does not have Bolt tokens. All future changes should be made by creating complete GitHub-ready ZIP replacement packages.

App:
Co Pilot Security — a security patrol web app with three portals:
1. Dispatch/Admin
2. Guard
3. Client

Current status:
We just completed a global workflow cleanup build after v3.0.64. The goal was to stop finished actions from staying in repeatable pending/action mode.

Latest build completed:
v3.0.65 GLOBAL ACTION LOCK + WORKFLOW QA

What v3.0.65 changed:
- Added global workflow action-lock helpers.
- Added busy/disabled state for key async action buttons.
- Guard approval actions now lock after approved/rejected status.
- Approved guard applications route Dispatch to the active Guards roster and select the approved guard when available.
- Rejected applications show locked/finished state instead of approve/reject buttons.
- Pending Dispatch assignment now clears selected pending state, moves the request out of Pending Dispatch, and routes Dispatch to Dispatch Board.
- Proof Review locks approved/rejected status decisions.
- Rejected proof cannot be included in client-facing reports.
- Proof changes are blocked after a final report for the patrol has been published.
- Report Builder blocks duplicate publishing for the same completed patrol.
- After publish, Report Builder routes directly to Report Archive and selects the published report.
- Reports Ready count now excludes completed patrols that already have a published local/system report.
- No new SQL required.

Previously completed:
- v3.0.58 CLIENTS COMMAND CENTER
- v3.0.59 ACTIVITY LOG COMMAND CENTER
- v3.0.60 PROOF REVIEW COMMAND CENTER
- v3.0.61 REPORT BUILDER COMMAND CENTER
- v3.0.62 REPORT BUILDER GUARD NAME FIX
- v3.0.63 REPORT ARCHIVE COMMAND CENTER
- v3.0.64 SERVER VERSION QA FIX
- v3.0.65 GLOBAL ACTION LOCK + WORKFLOW QA

Major requirements to preserve:
- Client, Guard, and Dispatch portals must keep the modern dark grid command-center design.
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
Test v3.0.65 end-to-end in Bolt. Specifically test approve/reject guard, assign pending dispatch, approve/reject/include proof, publish report, and confirm each action moves to a finished/locked state. Then continue with dead-code cleanup and global button QA as v3.0.66. Pricing/payment/subscription remains last.
