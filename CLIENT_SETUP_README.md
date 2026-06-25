# Co Pilot Security v3.0.11 — Dispatch Assign Now

## What changed
- Added a Dispatch Dashboard **Assign Now** shortcut panel for development/testing.
- Pending client patrol requests now appear directly on the Dispatch Dashboard.
- Each pending request includes:
  - Request number
  - Property name
  - Property address
  - Priority/time
  - Guard selector
  - **Assign Now** button
- **Assign Now** is fully wired to the existing Supabase RPC:
  - `cp_admin_assign_patrol_request`
- On success, the app reloads data and the request should become assigned to the selected guard.

## Development testing flow
1. Client submits a patrol request.
2. Dispatch/Admin sees it on Dashboard under **Assign Now**.
3. Dispatch chooses a guard and clicks **Assign Now**.
4. Guard logs in and sees the job in Guard Dashboard / Active Job.
5. Guard moves the job through workflow, uploads proof, then completes.

## Preserved
- Same Supabase config.
- Client Request Patrol flow from v3.0.10.
- Guard Active Job workflow from v3.0.9.
- Map marker visibility rules from v3.0.7/v3.0.8.
- Bottom-right badge.

## Badge
Bottom-right badge should show:

`v3.0.11 DISPATCH ASSIGN NOW`

## SQL
No new SQL required if the existing consolidated SQL/RPCs are already installed.
