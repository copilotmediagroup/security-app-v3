# Co Pilot Security v3.0.10 — Client Patrol Request Flow

## What changed
- Added a real client-facing **Request Patrol** workflow on the Client `Patrol Requests` page.
- Client can submit a request using a saved property.
- Fields included:
  - Property
  - Priority
  - Patrol type
  - Proof preference
  - Instructions
- Submission uses the existing Supabase RPC: `cp_submit_patrol_request`.
- New request should appear in Dispatch/Admin `Pending Dispatch` after refresh/login.
- Request history stays on the same page so the client can see workflow movement.

## Preserved
- Same Supabase config.
- Guard Active Job workflow from v3.0.9.
- Map marker visibility rules from v3.0.7/v3.0.8.
- Bottom-right badge.

## Badge
Bottom-right badge should show:

`v3.0.10 CLIENT PATROL REQUEST FLOW`

## SQL
No new SQL required if the existing consolidated SQL/RPCs are already installed.
