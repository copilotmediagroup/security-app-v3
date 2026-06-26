# Co Pilot Security v3.0.44 — Dispatch Live GPS Command Center

## What changed
The Dispatch `Live GPS` page has been rebuilt from a table into a full GPS command-center screen.

## New Live GPS sections
- Header with system status and working navigation buttons
- KPI row:
  - Online Guards
  - Active Patrols
  - Active Properties
  - Alerts
- Live map panel:
  - Live Sync refresh
  - Default map reset
  - View mode selector
  - Layers popover
  - Fullscreen action
  - clickable guard/property markers
- Right rail:
  - Online Guard Roster
  - Selected Property
  - Live GPS Feed
- Bottom section:
  - Recent Route Events table

## Functional behavior
- Offline guards remain hidden.
- Online guard roster rows select the guard and open the map card.
- Selected property card opens the property map card.
- View mode filters map markers:
  - Default
  - Guards Only
  - Properties Only
  - Active Patrols
- Default button resets map bounds.
- Live Sync reloads app data.
- No new SQL required.
