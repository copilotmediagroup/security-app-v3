# Co Pilot Security v3.0.67 — Proof Upload Confirmation + E2E QA

## What changed
- Guard proof upload now shows preview confirmation before upload.
- Guard receives clear uploading, success, and failure feedback.
- File validation catches unsupported types and oversized photo/video selections before upload.
- Complete Job is blocked while proof is uploading.
- If no proof is attached or the last proof upload failed, Complete Job opens a confirmation modal with Upload Proof or Complete Without Proof.
- Completed jobs with proof are routed to Dispatch Proof Review.
- Completed jobs without proof remain available in Report Builder for no-proof reports.
- Proof Review now defaults/resets to All Dates when a stale Today filter hides existing proof.
- Proof Review rows prefer uploaded_at over created_at so new proof is not hidden by old request dates.
- No URL inputs were added.
- No new SQL required.

# Co Pilot Security v3.0.67 — Dead Code Cleanup + Button QA

## What changed
This build is a cleanup and global QA pass built from v3.0.65.

It preserves the workflow locks from v3.0.65 and adds cleanup around stale selections, duplicate handlers, visual-only buttons, and double-submit protection.

## Main fixes
- Preserved approve/reject/finalize action locks.
- Added workflow state normalization after app data loads.
- Pending Dispatch now clears stale selected requests if the request has already moved forward.
- Report Builder routes already-published reports into Report Archive instead of leaving the report in a publishable state.
- Visual-only icon buttons with no live action are marked disabled so they no longer look like broken active buttons.
- Submit buttons enter a busy state while saving to prevent double submissions.
- Removed duplicate Guard Approval search input handler.
- Removed duplicate Guards search input handler.
- Removed unreachable dead code from the approval notes click path.

## Preserved requirements
- Modern dark command-center design.
- Global uncluttered sidebar.
- Dispatch/Admin, Guard, and Client portals.
- Device upload only for photos/videos.
- No URL entry fields for media.
- Client property image upload flow.
- Guard proof upload flow.
- Proof Review → Report Builder → Report Archive flow.
- Report finalization even with no proof.

## SQL
No new SQL is required for v3.0.67.

Use the existing SQL files only if the database has not already been initialized.
