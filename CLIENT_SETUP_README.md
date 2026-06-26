# Co Pilot Security v3.0.65 — Global Action Lock + Workflow QA

## What changed
This build cleans up the workflow behavior globally so completed actions do not stay in repeatable pending mode.

## Main fixes
- Approve/reject actions now lock after completion.
- Lockable buttons enter a busy/disabled state while processing to reduce double-click duplicate actions.
- Approved guards move to the active Guards roster view.
- Rejected guard applications show a locked/finished state instead of approve/reject buttons.
- Assigned patrols move out of Pending Dispatch and route Dispatch to the Dispatch Board.
- Proof Review locks approved/rejected proof decisions.
- Rejected proof cannot be included in reports.
- Proof cannot be changed after the report for that patrol is published.
- Report Builder blocks duplicate publishing for the same completed patrol.
- Published reports route directly into Report Archive.

## Preserved
- v3.0.64 server version QA fix.
- v3.0.63 Report Archive Command Center.
- Upload-only photos/videos. No URL upload fields were added.
- Admin can publish/finalize reports with no proof after confirmation.
- No new SQL required.

## Install
Upload this ZIP to GitHub/Bolt as the full replacement package.

## SQL
No new SQL is required for v3.0.65.
