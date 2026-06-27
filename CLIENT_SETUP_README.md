# Co Pilot Security v3.0.70 — Proof Review KPI Status Cleanup

## What changed
This build cleans up the Proof Review totals and labels so the page matches the real workflow.

## Main fixes
- Published/locked proof no longer looks like it skipped approval.
- The Approved KPI now shows the full approval picture:
  - Approved / Ready
  - Published / Locked
- Pending Review language was tightened to Needs Review where appropriate.
- Published proof rows now show Approved + Published.
- Proof locked by a final published report stays locked and cannot be changed.
- Approved-but-not-published proof still shows Include/Remove report controls.
- The detail rail no longer renders the selected proof title twice.

## Preserved from v3.0.69
- Pending proof still shows Approve and Reject buttons on the row.
- Reviewable proof still shows Approve / Reject / Include in the right panel.
- Rejected proof cannot be included in reports.
- Published proof can open Report Archive.

## SQL
No new SQL required.
