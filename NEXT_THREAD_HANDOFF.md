# Next Thread Handoff — Co Pilot Security v3.0.9

Latest build: v3.0.9 ACTIVE JOB WORKFLOW

## What changed
- Built from v3.0.8 CURRENT ASSIGNMENT BUTTON CLEANUP.
- Guard Active Job page is no longer a patrol request table.
- Active Job now acts as the guard's open job workflow page.
- The page matches the approved mockup direction:
  - Top active job summary card
  - Workflow progress stepper
  - Quick workflow action buttons
  - Activity / Job Log
  - Right rail with Route/GPS, Open Job Details, Proof/Notes, and Notifications
- Workflow buttons include:
  - Mark On The Way
  - Mark Arrived
  - Start Checking
  - Open Upload Proof
  - Complete Job
- Existing Supabase RPC `cp_guard_update_patrol_request_status` is used for accepted/in_progress/completed transitions.
- Finer workflow stages are stored in sessionStorage for now, so no new SQL is required.
- Preserves v3.0.8 marker rules:
  - Offline hides both markers
  - Online shows guard marker only
  - Property marker shows only during an active job
  - Completed job removes property marker

## Badge
`v3.0.9 ACTIVE JOB WORKFLOW`

## SQL
No new SQL required.

## Next step
Test guard Active Job page and confirm the workflow buttons update the page correctly. Then continue one screen at a time.
