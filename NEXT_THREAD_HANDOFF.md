# Next Thread Handoff — Co Pilot Security v3.0.28

Latest build: v3.0.28 CLIENT EDIT PROPERTY

## What changed
- Built from v3.0.27.
- Added functional Client Edit Property modal.
- Added Add Property modal using the same form.
- Saves property fields through existing RPC `cp_save_property_for_client`.
- Retail/Residential type display persists locally due to no existing database `property_type` column.
- No new SQL required.
