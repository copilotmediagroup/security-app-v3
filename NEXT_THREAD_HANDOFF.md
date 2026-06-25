# Next Thread Handoff — Co Pilot Security v3.0.14

Latest build: **v3.0.14 LOCKED WORKFLOW STAGES**

## Current project rule
User has no Bolt tokens. Do not suggest Bolt AI prompts. Continue by creating complete GitHub-ready ZIP replacement packages only.

## What was built in v3.0.14
- Tightened the Guard Active Job workflow.
- Workflow is now forward-only from the UI.
- Once the guard advances to the next stage, previous stages lock and cannot be clicked again.
- Locked stage buttons are disabled.
- Locked stages use amber/steel styling, not red, because red suggests an error/danger state.
- Current stage remains green.
- Future stages stay default until selected.
- Added a guard in the workflow update function to prevent backwards stage changes even if a click slips through.
- No new SQL required.

## Preserved from prior builds
- v3.0.13 Inline Proof Upload: Upload Proof is inside Active Job only, opens device picker, shows preview, confirms upload, and keeps guard in the job flow.
- Upload Proof is removed from the Guard sidebar.
- v3.0.11 Dispatch Dashboard Assign Now shortcut.
- v3.0.10 Client Patrol Request flow.
- v3 Guard Active Job workflow design.
- Marker visibility rules: offline hides markers, online shows guard, active job shows property, complete clears property.

## Next suggested test
1. Client submits patrol request.
2. Dispatch uses Assign Now.
3. Guard opens Active Job.
4. Guard clicks Mark On The Way.
5. Confirm Accepted locks and On The Way turns green.
6. Guard clicks Mark Arrived.
7. Confirm Accepted + On The Way lock and Arrived turns green.
8. Continue through Checking Property, Upload Proof, and Complete Job.
