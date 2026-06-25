# Next Thread Handoff — Co Pilot Security v3.0.0

Latest build: v3.0.0 EXACT DASHBOARD GRID REBUILD

## User direction

The user is deleting all files in the current GitHub repository and starting a new Bolt project. This ZIP is meant to be imported into that clean repo.

## Build goal

Code the exact dashboard layout language from the generated mockup breakdown:

- `.app-shell` grid: `220px 1fr`
- `.dashboard-grid`: `minmax(0, 1fr) 340px`
- `.kpi-row`: `repeat(4, 1fr)`
- `.top-panel-grid`: `1.35fr 1fr`
- left main canvas: Dispatch Overview, Priority Queue, Command Map, Recent Activity
- right rail: Active Patrols, Messages, Notifications, System Status
- bottom-right hard badge

## Important

This is a clean package, not another layered v2/v1 patch.

## Badge

Bottom-right badge must display:
`v3.0.0 EXACT DASHBOARD GRID REBUILD`

## SQL

No new SQL required.

## Next development approach

1. Verify login works.
2. Verify Dispatch dashboard layout first.
3. Do not move to Guard/Client visual redesign until Dispatch dashboard structure is approved.
4. Keep every change in this clean v3 foundation only.
