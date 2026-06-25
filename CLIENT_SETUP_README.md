# Co Pilot Security v3.0.33 — Badge Version Sync Fix

## What was wrong
The v3.0.32 package had `index.html` and package metadata updated, but the active `script.js` BUILD constant still said:

`v3.0.31 PATROL REQUESTS POLISH`

The bottom-right badge reads from `script.js`, so it kept showing v3.0.31.

## What changed
- Updated `script.js` BUILD label to `v3.0.33 BADGE VERSION SYNC FIX`.
- Added stronger cache-busted asset URLs in `index.html`.
- Made the badge function recreate/overwrite the badge every second.
- Preserved all v3.0.32 Request Patrol page work.

## SQL
No new SQL required.
