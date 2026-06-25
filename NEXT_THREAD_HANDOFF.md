# Next Thread Handoff — Co Pilot Security v3.0.29

Latest build: v3.0.29 CLIENT PROPERTY PHOTO UPLOAD FIX

## What changed
- Built from v3.0.28.
- Fixed Client Edit Property save by calling `cp_core_save_property` first, then fallback property save RPC attempts.
- Removed all visible photo URL input from client property edit/add modal.
- Property photo changes now require device image upload.
- Upload target bucket: `property-photos`.
- No new SQL required.
