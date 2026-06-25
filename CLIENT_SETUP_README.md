# Co Pilot Security v3.0.27 — Client Properties Polish

## What changed
- Property type now displays under the property name as `Retail` or `Residential` when applicable.
- Removed property Online/Offline behavior.
  - If a property exists in the database, it is considered saved/active.
  - To remove a property from client visibility, remove it from the database/app records.
- Fixed Property Details buttons so text fits inside the button with proper padding.
- Rebuilt the property detail map to match the Guard map style and behavior.
- Guard marker and route line appear only when the guard has accepted or is in-progress on that property assignment.

## SQL
No new SQL required.
