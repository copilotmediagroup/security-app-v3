# Co Pilot Security v3.0.18 — Persistent GPS Status

## What changed
- Route / GPS `Map Behavior` panel is now date/time stamped.
- It shows:
  - Current Date / Time
  - Status Changed
  - Online Since
  - Last GPS Update
- Guard Online/Offline state now works like this:
  - If guard clicks Online, the online state is saved.
  - If guard logs out while Online, they are still Online.
  - When guard logs back in, Online is restored.
  - Guard stays Online until they click Offline.
  - Clicking Offline clears guard/property markers and route data.

## SQL
No new SQL required.
