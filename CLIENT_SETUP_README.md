# Co Pilot Security v3.0.66 — Dead Code Cleanup + Button QA

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
No new SQL is required for v3.0.66.

Use the existing SQL files only if the database has not already been initialized.
