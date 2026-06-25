# Next Thread Handoff — Co Pilot Security v3.0.3

Latest build: v3.0.3 LIVE GUARD GPS MAP FUNCTIONS

## What changed
- Built from v3.0.2.
- Guard Dashboard layout stays in the mockup 3-column structure.
- Added functional GPS map logic:
  - Go Online starts navigator.geolocation.watchPosition.
  - Go Offline stops tracking.
  - Blue pulsing guard marker.
  - Red pulsing property marker when active job property coordinates/geocode exists.
  - Click guard marker for live guard card.
  - Guard card shows live reverse-geocoded address.
  - ETA/distance update as guard moves.
  - Route line uses OSRM if available, fallback curved route if not.

## Notes
- No new SQL required.
- For best property routing, property table should include latitude/longitude. Without coords, the app attempts Nominatim geocoding from address.
- Browser location permission required.
