# Next Thread Handoff — Co Pilot Security v3.0.10

Latest build: **v3.0.10 CLIENT PATROL REQUEST FLOW**

## Current rule
User has no Bolt tokens. Do not suggest Bolt AI prompts. Continue only by creating complete GitHub-ready ZIP replacement packages.

## What was built in v3.0.10
- Built from v3.0.9 ACTIVE JOB WORKFLOW.
- Added a client-side patrol request form on the Client `Patrol Requests` page.
- Client can choose saved property, priority, patrol type, proof preference, and instructions.
- Form submits to existing Supabase `cp_submit_patrol_request` RPC.
- New request should show on Admin/Dispatch side as Pending Dispatch.
- Request history is shown under the form.
- Saved property cards on the right can prefill the form.
- No new SQL required.

## Preserved
- Guard dashboard layout.
- Guard Active Job workflow page with clickable steps.
- Online/offline map marker visibility rules.
- Same Supabase backend/config.
- Bottom-right badge.

## Next likely screen
After testing client request submission, verify the Admin Pending Dispatch/Dispatch Board can assign that new patrol to a guard. If not, build the admin dispatch assignment workflow next.
