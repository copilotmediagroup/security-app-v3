# Co Pilot Security v3.0.49 — Guards Command Center

## What changed
The Admin `Guards` page has been rebuilt from a basic card/list page into a full guard-management command center.

## New Guards page sections
- Header:
  - System Operational
  - Search Guards
  - Notifications
  - Refresh
- KPI row:
  - Total Guards
  - Online Now
  - On Patrol
  - Off Duty
  - Pending Approval
  - Alerts
- Main guard table:
  - Guard photo/name/ID
  - Rank
  - Status
  - Current assignment
  - Last GPS update
  - Messages
  - Response time
  - Actions
- Right detail rail:
  - Guard profile header
  - Current location
  - Current assignment
  - Shift status
  - Last check-in
  - Patrols completed today
  - Phone/email
  - Mini live-location map
  - Message / View Route / Assign Patrol / View Profile
  - Recent activity
  - Certifications & skills

## Functional behavior
- Search filters the table.
- Status/duty/rank/approval filters update the table.
- Clicking a row opens the right rail.
- Message opens the guard/dispatch message thread.
- View Route opens Live GPS focused on the guard.
- Assign Patrol routes to Pending Dispatch.
- Refresh reloads data.
- Clear Filters resets the guard table.
- Pagination and rows per page work.
- No new SQL required.
