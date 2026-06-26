# Co Pilot Security v3.0.45 — Pending Dispatch Command Center

## What changed
The Admin `Pending Dispatch` page has been rebuilt from a basic table into a full assignment command-center page.

## New Pending Dispatch sections
- Header:
  - System Operational
  - Search requests
  - Filter toggle
  - Refresh
- KPI row:
  - Total Pending
  - High Priority
  - Average Response
  - Assigned Today
  - SLA At Risk
- Main queue:
  - Priority tabs
  - Filter dropdowns
  - Request table
  - Pagination
  - Rows per page
- Right rail:
  - Selected request details
  - Property image
  - Address/client/property details
  - Special instructions
  - Mini route map
  - Assign Guard button

## Functional behavior
- Search filters the pending request table.
- Priority tabs filter All / High / Medium / Low.
- Dropdown filters update the table.
- Clear Filters resets everything.
- Refresh reloads data.
- Clicking a row selects it and updates the right rail.
- Assign buttons use the existing assignment flow.
- Auto Assign assigns the first pending request to the first online guard.
- Assign Selected assigns checked requests to online guards.
- No new SQL required.
