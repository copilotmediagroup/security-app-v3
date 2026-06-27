# Co Pilot Security v3.0.77 — Client Recent Reports Thumbnail Fix

## Upload Instructions
Upload the full contents of this ZIP to the GitHub repository used by Bolt.

Do not run new SQL for this build.

## What changed
This build fixes the missing image problem in the Client Dashboard right-side **Recent Reports** section.

The cards now show a real visual thumbnail when an image exists instead of always using the small document icon.

## Thumbnail priority
1. First available report/proof photo
2. Saved property photo
3. Document icon fallback

## Fixed
- Added proof/property thumbnails to Recent Reports cards.
- Preserved the clean card layout from v3.0.76.
- Added small labels on image thumbnails such as Proof, Property, or Report.
- Kept proof count logic separate from image fallback logic, so no-proof reports can still show the property photo.

## Preserved
- v3.0.76 Client Recent Reports UI Polish.
- v3.0.75 Job Timeline / Audit Trail.
- v3.0.74 Global Dashboard/Report/Proof Logic Sync.
- No URL inputs.
- No new SQL required.
