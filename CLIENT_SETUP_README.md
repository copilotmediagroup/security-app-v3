# Co Pilot Security v3.0.46 — Dispatch Route Distance ETA Fix

## What changed
- Dispatch assigned patrol routes no longer use a simple straight line.
- Dispatch maps now request road-route geometry and cache it in browser session storage.
- If the route service is unavailable, the app uses a bent route-style fallback path instead of a straight connector.
- Dispatch Command Map now shows:
  - Route Distance
  - ETA
- Pending Dispatch now shows route-aware distance from the selected/nearest online guard to the destination.
- Pending Dispatch mini map now draws a route preview between the selected/nearest guard and the property.
- Guard dropdown options show estimated distance and ETA.
- Changing the selected guard refreshes the mini map and distance/ETA.

## Preserved
- v3.0.45 Pending Dispatch page design.
- Existing assignment flow.
- Online-only guard visibility.
- No new SQL required.
