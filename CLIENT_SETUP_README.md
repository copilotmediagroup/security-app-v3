# Co Pilot Security v3.0.14 — Locked Workflow Stages

## What changed
- Guard Active Job workflow is now forward-only.
- When a guard moves to the next stage, the previous stage locks.
- Locked stages cannot be clicked again.
- Current stage turns green.
- Future stages stay default until selected.
- Locked stages use an amber/steel locked color because red reads like an error or danger state.

## Flow behavior
Example:
1. Guard starts at **Accepted**.
2. Guard clicks **Mark On The Way**.
3. **Accepted** locks.
4. **On The Way** turns green.
5. Guard clicks **Mark Arrived**.
6. **Accepted** and **On The Way** lock.
7. **Arrived** turns green.

## Preserved
- Upload Proof stays inline inside Active Job.
- No separate Guard Upload Proof page in sidebar.
- Proof picker opens device/browser photo-video selection.
- Preview confirmation appears before upload.
- Client Request Patrol flow.
- Dispatch Assign Now shortcut.
- Same Supabase config.

## Badge
Bottom-right badge should show:

`v3.0.14 LOCKED WORKFLOW STAGES`

## SQL
No new SQL required.
