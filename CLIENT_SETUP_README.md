# Co Pilot Security v3.0.28 — Client Edit Property

## What changed
- Client can now click `Edit Property` from the Property Details panel.
- A polished modal opens with editable fields:
  - Property Name
  - Property Type: Retail / Residential
  - Street Address
  - City
  - State
  - ZIP
  - Property Photo URL
  - Latitude / Longitude
  - Notes
- Client can also use `Add Property` to open the same modal for a new property.
- Saves through the existing Supabase RPC: `cp_save_property_for_client`.

## SQL
No new SQL required.

## Note
The current database table does not include a dedicated `property_type` column. The Retail/Residential display choice is saved locally in browser storage for the development UI.
