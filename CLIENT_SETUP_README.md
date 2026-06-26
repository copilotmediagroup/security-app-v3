# Co Pilot Security v3.0.60 — Proof Review Command Center

## What changed
The Dispatch/Admin `Proof Review` page was rebuilt into a modern command-center media evidence review system.

## New Proof Review sections
- Header:
  - System Operational
  - Search proof, guard, property
  - Filters
  - Export
- KPI row:
  - Pending Review
  - Approved
  - Rejected
  - Included in Reports
  - Total Media
  - Expired Proofs
- Tabs:
  - All Proof
  - Pending Review
  - Approved
  - Rejected
  - Included in Reports
- Filters:
  - All Guards
  - All Clients
  - All Properties
  - All Types
  - All Dates
  - Sort
  - Clear Filters
- Main proof list:
  - Checkbox
  - Thumbnail
  - Details
  - Uploaded
  - Status
  - Actions
- Right detail rail:
  - Selected proof preview
  - File metadata
  - Property / address
  - Guard
  - Patrol
  - Uploaded time
  - Notes
  - Approve
  - Reject
  - Include/remove from report
  - Internal note save

## Functional behavior
- Search filters proof records.
- Tabs filter status/included records.
- Dropdown filters update the list.
- Selecting a proof updates the detail rail.
- Approve / Reject / Include in Report update local review state.
- Internal notes save locally.
- Export downloads a CSV of the currently filtered proof review list.
- No URL input was added. Proof comes from guard uploads only.
- No new SQL required.
