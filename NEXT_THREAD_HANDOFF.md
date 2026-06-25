# Next Thread Handoff — Co Pilot Security v3.0.30

Latest build: v3.0.30 CLIENT PATROL REQUESTS REDESIGN

## What changed
- Built from v3.0.29.
- Redesigned Client Patrol Requests page.
- Supports Immediate Patrol, Vacation Watch, Recurring Patrol, and Scheduled Patrol UI flows.
- Uses existing cp_submit_patrol_request RPC with advanced schedule args when available and fallback support.
- No URL inputs for photos/videos; reference upload picker is device-only.
- No new SQL required.
