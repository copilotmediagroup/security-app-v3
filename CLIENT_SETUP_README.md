# Co Pilot Security v3.0.20 — Dispatch Guard Messaging

## What changed
- Redesigned the `Messages` page for Dispatch and Guard roles.
- Added a three-column messaging layout:
  - inbox / conversations
  - conversation center
  - conversation details rail
- Added functional development messaging between Dispatch and guards using local browser storage.
- Added quick reply buttons, search, and filters.
- Updated `Guard Approvals` so Dispatch can choose the guard rank before approving.

## Messaging behavior
- Dispatch sees a conversation thread for each approved guard.
- A guard sees their Dispatch conversation thread.
- Messages persist in the same browser via local storage for development use.

## SQL
No new SQL required.
