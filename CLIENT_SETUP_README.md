# Co Pilot Security v3.0.5 — Real Map Init Fix

## What changed
- Fixed blank map behavior by forcing Leaflet to initialize after Guard Dashboard render.
- Added a retry initialization pass.
- Added a fallback street-grid map with street names if Leaflet/CDN tiles fail.
- Changed buttons:
  - `Go Online` is now `Online`
  - `Go Offline` is now `Offline`
- Online button turns green only while online.
- Offline button turns red after clicking offline.
- Guard marker is hidden while offline and appears when online.

## Badge
Bottom-right badge should show:

`v3.0.5 REAL MAP INIT FIX`

## SQL
No new SQL required.
