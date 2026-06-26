# Co Pilot Security v3.0.47 — Scheduled Queue Command Center

## What changed
The Admin `Scheduled Queue` page has been rebuilt from a basic table into a full schedule management command-center page.

## New Scheduled Queue sections
- Header:
  - System Operational
  - Search schedules
  - Notifications
  - Refresh
- KPI row:
  - Total Scheduled
  - Today
  - This Week
  - Recurring Routes
  - Unassigned
  - SLA Risk
- Main queue:
  - All Scheduled / Today / This Week / Recurring / Unassigned / Completed tabs
  - Filter dropdowns
  - Schedule table
  - Pagination
  - Rows per page
- Right rail:
  - Selected Schedule
  - Property photo and property/client details
  - Assigned Guard
  - Next Run / Recurrence / Duration / Services / Instructions
  - Upcoming Runs
  - Route Preview

## Functional behavior
- Search filters the schedule table.
- Tabs filter by schedule group.
- Filters update the table.
- Clear resets tabs/search/filters.
- Refresh reloads data.
- Clicking a row selects it and updates the right rail.
- Auto Assign assigns unassigned schedules to online guards using local browser overrides.
- Bulk Reschedule moves selected schedules to the next run window using local browser overrides.
- Pause/Resume Schedule toggles local status.
- Reassign Guard selects the first available online guard.
- No new SQL required.
