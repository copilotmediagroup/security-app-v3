# Co Pilot Security v3.0.74 — Global Data Logic Sync + Dashboard Fix

## What changed
This build centralizes report/proof/dashboard logic so dashboard widgets stop disagreeing with the detailed pages.

## Fixed
- Dispatch Dashboard `Proof Waiting Review` now matches Proof Review `Needs Review`.
- Dispatch Priority Queue no longer counts published/locked proof as waiting review.
- Client Dashboard `Recent Reports` now uses the same normalized published report source as Client Reports.
- Client Dashboard Recent Reports cards now show title, property name, address, proof count, and published time.
- Client Dashboard Recent Activity status chips now show correct workflow stages for accepted/started/uploaded/completed events.

## Preserved
- v3.0.73 full workflow status unification.
- v3.0.72 report/proof count clarity.
- No URL inputs.
- No new SQL required.
