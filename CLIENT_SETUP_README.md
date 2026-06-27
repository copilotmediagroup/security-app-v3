# Co Pilot Security v3.0.71 — Client Report Publish Sync + Timestamp Fix

## What changed
This build fixes the Client Reports mismatch where Dispatch Report Archive showed a newly published report but the Client Reports page appeared to show older patrol timestamps.

## Main fixes
- Client Reports now pulls from the same published report/archive source used by Dispatch Report Archive when available.
- Client Reports now prefers `published_at`, `released_at`, or archive `publishedAt` before patrol/request timestamps.
- Client Reports now sorts by Published On newest first.
- The client table header changed from Date & Time to Published On.
- Each client row shows Published time and Patrol time separately.
- Client report preview shows both Published On and Patrol Time.
- Client report download text and CSV export now include both Published On and Patrol Time.
- Recent Activity now uses published time.
- Client Reports pagination now defaults to 10 rows and shows clearer total/page text.

## Preserved from v3.0.70
- Proof Review KPI/status cleanup remains intact.
- Published proof still displays as Approved + Published / Locked.
- No URL inputs were added.

## SQL
No new SQL required.
