# Next Thread Handoff — Co Pilot Security v3.0.62

Latest build: v3.0.62 REPORT BUILDER GUARD NAME FIX

## What changed
- Built from v3.0.61.
- User reported error when clicking Report Builder: `guardDisplayName is not defined`.
- Fixed by adding global `guardDisplayName(guard = {})`.
- Report Builder Command Center remains intact.
- No new SQL required.
