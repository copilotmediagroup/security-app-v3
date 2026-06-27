# Co Pilot Security v3.0.69 — Proof Review Approval Button + Lock Status Fix

## What changed
This build fixes the Proof Review confusion where a proof row could still show **Pending Review** while the right-side detail panel said the proof was locked because the final report was already published.

## Fixes
- Pending proof that can still be reviewed now shows row-level **Approve** and **Reject** buttons.
- The right detail rail still shows the full **Approve / Reject / Include in Report / Save Note** workflow for reviewable proof.
- Proof connected to an already-published final report now shows **Report Published** instead of **Pending Review**.
- Locked proof is no longer counted as Pending Review.
- A new **Report Published** tab makes locked proof easy to identify.
- Locked proof includes a **View Report Archive** action.
- Rejected proof remains blocked from report inclusion.

## Preserved
- v3.0.68 Client Reports preview/download fix.
- v3.0.67 proof upload confirmation behavior.
- v3.0.65/v3.0.66 global action-lock behavior.
- No URL media inputs.
- No new SQL required.
