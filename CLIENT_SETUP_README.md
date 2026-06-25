# Co Pilot Security v3.0.19 — Map Text Stamps

## What changed
- Removed the separate timestamp block from the Route / GPS Map Behavior panel.
- Added timestamps directly onto each text card:
  - Online card: `Online since`
  - Active Job card: `Checked`
  - Offline card: `Last offline`
  - Marker Click card: `Last GPS update`

## Preserved
- Guard stays Online across logout/login until Offline is clicked.
- Route / GPS live map behavior remains the same.
- No new SQL required.
