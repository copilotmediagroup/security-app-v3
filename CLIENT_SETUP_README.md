# Co Pilot Security v3.0.76 — Client Recent Reports UI Polish

## Upload Instructions
Upload the full contents of this ZIP to the GitHub repository used by Bolt.

Do not run new SQL for this build.

## What changed
This build fixes the Client Dashboard right-side **Recent Reports** visual issue.

The report data source from v3.0.74/v3.0.75 is preserved, but the dashboard cards now render as clean compact report cards instead of being squeezed by the full Client Reports table styling.

## Fixed
- Recent Reports cards no longer use the wide table row layout from the full Reports page.
- Raw Request # / long ID titles are replaced with clean client-facing report titles.
- Report/reference ID is shown smaller, not as the main title.
- Property name, address, proof count, and published time are spaced cleaner.
- Long addresses wrap/clamp instead of crushing the card.
- Recent Reports panel bottom padding has been tightened.

## Preserved
- v3.0.75 Job Timeline / Audit Trail.
- v3.0.74 Global Dashboard/Report/Proof Logic Sync.
- No URL inputs.
- No new SQL required.
