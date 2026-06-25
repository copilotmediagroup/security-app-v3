# Co Pilot Security v3.0.29 — Client Property Photo Upload Fix

## What changed
- Fixed the Client Edit Property save error by using the existing `cp_core_save_property` RPC first.
- Added compatibility fallback attempts for older property save RPC names/signatures.
- Removed the visible `Property Photo URL` input.
- Client property photos are now changed only by uploading an image from the device.
- Existing photo is preserved when no new image is selected.
- New property photo uploads use Supabase Storage bucket `property-photos`.

## SQL
No new SQL required.
