# Co Pilot Security v3.0.7 — Marker Visibility Flow

## What changed
- Fixed Guard Dashboard map marker rules.
- Offline means no markers: blue guard marker and red property marker are both hidden.
- Online shows the guard marker only after browser GPS provides the guard location.
- Property marker appears only when the guard is online and has an active job.
- Completed jobs no longer leave the red property marker on the map.
- Removed fallback behavior that used the first patrol request when there was no active job.
- Offline clears property coordinates, route line, ETA, distance, and any open map card.

## Badge
Bottom-right badge should show:

`v3.0.7 MARKER VISIBILITY FLOW`

## SQL
No new SQL required.

## Test flow
1. Load Guard Dashboard while offline: no blue marker and no red property marker should appear.
2. Click Online: browser GPS starts; blue guard marker appears when location is received.
3. If there is no active job: only the blue guard marker appears.
4. If there is an active assigned/accepted/in-progress job: red property marker appears.
5. Complete the job: red property marker disappears.
6. Click Offline: both red and blue markers disappear.
