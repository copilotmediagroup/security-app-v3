# Co Pilot Security v3.0.50 — Guards Data + Layout Fix

## What changed
This build preserves the v3.0.49 Guards Command Center and fixes the issues found during testing.

## Fixes
- Selected guard detail rail now uses the selected guard record for phone/email.
- Obviously mismatched generic emails are hidden instead of being shown under the wrong guard.
- Online detection is stricter: approved, active, available, or on-duty account status alone does not mean live online.
- GPS status now shows clearer labels:
  - Live now
  - Online saved GPS
  - GPS stale
- Guards table no longer uses the ugly horizontal scrollbar.
- Action buttons are no longer cut off.
- Filter labels are shortened and fit better.
- Right rail is more compact so action buttons stay visible.

## SQL
No new SQL required.
