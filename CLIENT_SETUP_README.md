# Co Pilot Security v3.0.16 — Completed Proof Display

## What changed
- Corrected the inline proof flow intent:
  - Guard taps `Upload Proof` inside Active Job.
  - Device/browser picker opens.
  - Guard selects photo/video.
  - Preview confirmation appears.
  - Guard confirms.
  - Proof is now uploaded and saved to the job.
  - Guard stays inside Active Job and can complete the job.
- Completed jobs now show the uploaded proof count and preview tiles.
- Added a local display backup so uploaded proof can still show on Completed even if Supabase app data does not immediately return proof items for the guard role.

## SQL
No new SQL required.
