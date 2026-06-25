# Co Pilot Security v3.0.3 — Live Guard GPS Map Functions

## What changed
- Go Online starts browser GPS tracking.
- Go Offline stops browser GPS tracking.
- Guard marker is a blue pulse.
- Property marker is a red pulse when a property coordinate/geocode is available.
- Clicking the blue marker opens a live guard card with:
  - photo
  - name
  - email
  - current address from GPS reverse geocoding
  - accuracy
  - online/offline status
- ETA and distance update when GPS changes.
- Route line uses OSRM routing when available and estimated curved fallback if routing fails.

## Requirements
The browser must allow location permission.
For best routing, property records should include latitude/longitude. If not, the app attempts geocoding from the property address.

## Badge
Bottom-right badge should show:

`v3.0.3 LIVE GUARD GPS MAP FUNCTIONS`

## SQL
No new SQL required.
