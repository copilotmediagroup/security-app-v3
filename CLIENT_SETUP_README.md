# Co Pilot Security v3.0.8 — Current Assignment Button Cleanup

## What changed
- Removed the duplicate Online button from the Current Assignment card.
- Removed the duplicate Offline button from the Current Assignment card.
- Current Assignment now keeps only one action: Open Active Job.
- Online and Offline controls remain below the Route / GPS map, where the guard controls live GPS.
- Preserved the v3.0.7 map marker flow: offline hides both markers; online shows the guard marker; property marker appears only during an active job.

## Badge
Bottom-right badge should show:

`v3.0.8 CURRENT ASSIGNMENT BUTTON CLEANUP`

## SQL
No new SQL required.

## Test flow
1. Open Guard Dashboard.
2. Current Assignment card should show only Open Active Job.
3. Route / GPS card should still show Online and Offline below the map.
4. Online should turn green and start GPS.
5. Offline should turn red and remove guard/property markers.
