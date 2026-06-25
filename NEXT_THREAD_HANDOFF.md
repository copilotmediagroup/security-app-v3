# Next Thread Handoff — Co Pilot Security v3.0.7

Latest build: v3.0.7 MARKER VISIBILITY FLOW

## Current rule for Guard Dashboard map
- Offline: guard cannot see markers on the map. Both blue guard pulse and red property pulse are hidden.
- Online: guard sees their own blue GPS pulse after browser location is available.
- Property: red property pulse appears only while the guard is online and has an active job.
- Completed job: red property pulse disappears.
- Offline clicked: both red and blue pulses disappear, route/ETA/distance clear, and open cards close.

## What changed from v3.0.6
- Removed `state.patrolRequests[0]` fallback from `guard302CurrentRequest()`.
- Property marker now requires `liveGps.online && active job`.
- Leaflet property marker now also requires guard online + active job.
- Fallback street-grid property marker follows the same rule.
- Offline clears guard location, property location, route points, ETA, distance, and selected card.
- No new SQL.

## Continue next
First test the Guard Dashboard map flow only. Do not jump to another screen until this is verified.
