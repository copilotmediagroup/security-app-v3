# NEXT THREAD HANDOFF — CO PILOT SECURITY APP

Latest package:
v3.0.64 SERVER VERSION QA FIX

Important instruction:
The user is building this app through GitHub ZIP uploads into Bolt. Do not suggest Bolt AI prompts because the user does not have Bolt tokens. All future changes should be made by creating complete GitHub-ready ZIP replacement packages.

App:
Co Pilot Security — a security patrol web app with three portals:
1. Dispatch/Admin
2. Guard
3. Client

Current status:
We are deep into the Dispatch/Admin command-center pages after already redesigning major Client and Dispatch flows. The latest ZIP is a consolidated GitHub-ready app package with fewer than 20 files.

Current latest build:
v3.0.64 SERVER VERSION QA FIX

What was just completed in v3.0.64:
- QA-tested the uploaded v3.0.63 Report Archive package.
- Fixed stale `server.cjs` startup terminal label that still printed `Co Pilot Security v3.0.7 running...`.
- Server startup label now reads from VERSION.txt/package metadata so future builds stay aligned.
- Confirmed syntax checks, npm build, server response, Report Archive render, report actions, and Admin/Guard/Client nav smoke test.
- No new SQL required.

What v3.0.63 completed before this fix:
- Dispatch/Admin → Report Archive was rebuilt into a full report library command center.
- Added KPI cards:
  - Total Reports
  - Published
  - Drafts
  - Scheduled
  - Photos Included
  - Videos Included
- Added report archive filters:
  - Client
  - Property
  - Guard
  - Status
  - Date range
  - Sort
- Added report archive table:
  - Checkbox
  - Report
  - Client / Property
  - Patrol / Job
  - Date
  - Status
  - Included media
  - Actions
- Added selected report right rail:
  - Report preview card
  - Property photo
  - Report ID
  - Property/address
  - Patrol/job
  - Guard
  - Patrol type
  - Date/time
  - Duration
  - Status
  - Published by
  - Published on
  - Template
  - Summary
  - Included media counts
- Added working controls:
  - Search
  - Clear filters
  - Pagination
  - Rows per page
  - CSV export
  - View Full Report
  - Download Report
  - Share Report
  - Delete local report
- No new SQL required.

Most recent fix before that:
v3.0.62 REPORT BUILDER GUARD NAME FIX
- Fixed the Report Builder sidebar error:
  guardDisplayName is not defined
- Added the missing global guardDisplayName helper.
- Preserved the full Report Builder Command Center.

Recently completed Dispatch/Admin command-center pages:
- v3.0.58 CLIENTS COMMAND CENTER
- v3.0.59 ACTIVITY LOG COMMAND CENTER
- v3.0.60 PROOF REVIEW COMMAND CENTER
- v3.0.61 REPORT BUILDER COMMAND CENTER
- v3.0.62 REPORT BUILDER GUARD NAME FIX
- v3.0.63 REPORT ARCHIVE COMMAND CENTER
- v3.0.64 SERVER VERSION QA FIX

Major current app requirements to preserve:
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
- Proof workflow:
  - Client may upload reference photo/video with request.
  - Guard uploads proof during patrol.
  - Dispatch reviews proof.
  - Dispatch chooses which proof is included in client-facing report.
  - Report Builder creates/finalizes report.
  - Report Archive stores report library.

Known architecture:
- Main app files are consolidated into a small GitHub-ready ZIP.
- Current package has fewer than 20 files.
- No new SQL was required for v3.0.63 or v3.0.64.
- The package includes:
  - index.html
  - script.js
  - styles.css
  - config.js
  - supabase-client.js
  - server.cjs
  - build.cjs
  - package.json
  - SQL optional files
  - README/handoff/version files

Where we are going next:
Continue finishing Dispatch/Admin pages and polish:
1. Test Report Archive page after upload.
2. If Report Archive has layout/function issues, fix them first.
3. Continue remaining Dispatch/Admin pages if any are still placeholder or need redesign.
4. Then do global QA:
   - Sidebar across all roles
   - Map consistency
   - Online/offline guard visibility
   - Client property visibility
   - Patrol request → pending dispatch → assign guard → guard accepts → GPS route → proof upload → proof review → report builder → report archive
5. After workflow QA, move toward final app cleanup and launch readiness.
6. Pricing/payment/subscription should remain last, not now.

Build rule:
When asked to build, produce a complete GitHub-ready ZIP replacement package, not code snippets only.
