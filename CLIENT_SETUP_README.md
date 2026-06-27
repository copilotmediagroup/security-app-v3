# Co Pilot Security v3.0.73 — Full Workflow Status Unification

## What changed
This build standardizes workflow language across Client, Guard, and Dispatch so the same job/report/proof stages do not look like different statuses on different pages.

## New shared workflow stages
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

## Pages updated
- Client Reports
- Client patrol request rows
- Guard Completed jobs
- Dispatch Proof Review
- Dispatch Report Builder
- Dispatch Report Archive

## Behavior
- Published client reports now say Published Report instead of generic Completed.
- Pending proof now says Needs Review.
- Report Archive status badges now say Published Report, Draft Report, or Scheduled Report.
- Guard completed jobs now show whether they are waiting for Proof Review, ready for Report Builder, or already Published.
- Report/proof totals from v3.0.72 were preserved.

## SQL
No new SQL required.
