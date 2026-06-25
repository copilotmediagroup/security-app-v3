# Co Pilot Security v3.0.4 — Real Map Marker Cards

## What changed
- Real Leaflet/OpenStreetMap street map layer added.
- Guard card does not appear by default.
- Blue guard marker only appears while online.
- Click blue guard marker to open guard card.
- Guard card has an X close button.
- Red property marker opens property card.
- Property card shows property photo if available, property name, owner/client name, and property address.
- Go Offline removes the guard marker.
- Online button is green only while online.
- Offline button is red only after clicking offline.

## Notes
- Browser must allow location permission.
- Real map tiles require internet access in the browser.
- For best property marker/routing, property records should include latitude/longitude. Otherwise the app attempts geocoding from the property address.

## Badge
Bottom-right badge should show:
`v3.0.4 REAL MAP MARKER CARDS`

## SQL
No new SQL required.
