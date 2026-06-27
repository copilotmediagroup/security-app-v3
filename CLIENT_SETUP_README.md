# Co Pilot Security v3.0.72 — Global Report/Proof Count Clarity Fix

## What changed
This build clarifies the difference between final report totals and proof/media totals across the app.

## Why this was needed
Some pages showed 8 published reports while Proof Review showed 6 published/locked items. The underlying workflow can be correct because reports may be published with no proof, but the labels made it look like the counts were supposed to match.

## Fixes included
- Report totals now stay consistent across report pages.
- Proof Review labels now clearly say proof/media items instead of sounding like report totals.
- Report Archive shows reports with proof and reports without proof.
- Report Builder shows published reports, reports with proof, and no-proof reports.
- Client Reports shows total reports, published reports, reports with proof, and no-proof reports.
- No-proof published reports remain valid and visible.
- No URL upload fields were added.
- No new SQL required.

## Badge
v3.0.72 GLOBAL REPORT/PROOF COUNT CLARITY FIX
