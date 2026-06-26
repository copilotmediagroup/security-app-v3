# Co Pilot Security v3.0.48 — Scheduled Queue Data + Layout Fix

## What changed
- Fixed Scheduled Queue data detection.
- Scheduled Queue now pulls in:
  - Scheduled Patrol
  - Recurring Patrol
  - Vacation Watch
  - future-dated patrol requests
  - schedule metadata saved locally when client submits a scheduled request
- Fixed the visual layout problems from v3.0.47:
  - removed white horizontal scrollbars
  - restored visible All Scheduled tab
  - wrapped tabs cleanly
  - wrapped filters cleanly
  - tightened table columns
  - auto-selects first schedule when data exists

## Functional behavior
- Client scheduled/recurring/vacation submissions are remembered locally after submit.
- Scheduled Queue includes those requests without requiring new SQL.
- Existing buttons from v3.0.47 are preserved.
- No new SQL required.
