# Co Pilot Security v3.0.9 — Active Job Workflow

## What changed
- Rebuilt the Guard **Active Job** page into the actual guard workflow screen.
- Removed the old table-dominant layout from Active Job.
- Active Job now shows one current/open assignment with:
  - Job summary
  - Property/client/address details
  - Workflow progress stepper
  - Clickable workflow actions
  - Activity / job log
  - GPS preview
  - Proof progress and notes
  - Recent notifications

## Guard workflow buttons
Guards can now click:
- Mark On The Way
- Mark Arrived
- Start Checking
- Open Upload Proof
- Complete Job

The build uses the existing `cp_guard_update_patrol_request_status` RPC for the database-backed status changes:
- accepted
- in_progress
- completed

The finer UI steps such as On The Way, Arrived, Checking Property, and Upload Proof are stored in browser session state for this build so no new SQL is required.

## Badge
Bottom-right badge should show:

`v3.0.9 ACTIVE JOB WORKFLOW`

## SQL
No new SQL required.
