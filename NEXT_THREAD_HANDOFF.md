# Next Thread Handoff — Co Pilot Security v3.0.53

Latest build: v3.0.53 CLIENT LOGIN + DISPATCH SIDEBAR FIX

## What changed
- Built from v3.0.52.
- Fixed Client login crash: `dispatchRoutePaths is not defined`.
- Client maps now use `routePath` in client fallback route SVGs instead of the Dispatch-only route variable.
- Added `sidebar-admin`, `sidebar-guard`, and `sidebar-client` role classes to the sidebar.
- Tuned Dispatch/Admin sidebar proportions only to stop profile/nav overlap while keeping the clean global sidebar redesign.
- No new SQL required.
