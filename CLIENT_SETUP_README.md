# Co Pilot Security v3.0.12 — Active Job Stage Buttons

## What changed
- Updated the Guard **Active Job** workflow button behavior.
- All workflow buttons now start in the default dark style.
- When the guard clicks a workflow stage/action, that stage becomes the current stage and turns green.
- All other workflow buttons return to default styling when one is selected.
- Previous stages no longer stay green after the guard moves forward.
- The current stage now uses green instead of blue.
- Removed the default blue **Mark On The Way** button state.

## Workflow behavior
- **Accepted** is shown as the current stage when the job is first assigned/accepted.
- Clicking **Mark On The Way** turns only that stage/action green.
- Clicking **Mark Arrived** turns only that stage/action green.
- Clicking **Start Checking** turns only that stage/action green.
- Clicking **Open Upload Proof** turns only that stage/action green and opens proof flow.
- Clicking **Complete Job** turns only that stage/action green and completes the request.

## Preserved
- Dispatch Dashboard **Assign Now** shortcut from v3.0.11.
- Client Request Patrol flow from v3.0.10.
- Guard Active Job workflow layout from v3.0.9.
- Map marker visibility rules from v3.0.7/v3.0.8.
- Same Supabase config.
- Bottom-right badge.

## Badge
Bottom-right badge should show:

`v3.0.12 ACTIVE JOB STAGE BUTTONS`

## SQL
No new SQL required.
