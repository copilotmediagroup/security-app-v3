# Next Thread Handoff — Co Pilot Security v3.0.12

Latest build: **v3.0.12 ACTIVE JOB STAGE BUTTONS**

## Current app direction
- Continue building from the latest uploaded ZIP only.
- No Bolt AI prompts; no tokens available.
- Create complete GitHub-ready ZIP replacement packages.
- Keep the app modern, dark, squared, premium SaaS / command-center style.
- Preserve same Supabase config unless user explicitly changes it.
- No new SQL unless clearly required.

## What was built in v3.0.12
- Guard Active Job workflow button state behavior was corrected.
- Workflow buttons now act like a single-selected stage group:
  - Default dark state when not current.
  - Green when that stage/action is the current selected stage.
  - All other stage/action buttons return to default when one is clicked.
- Previous stages no longer stay green after moving forward.
- The current stage uses green instead of blue.
- Removed the default blue primary styling from **Mark On The Way**.

## Preserved from prior versions
- v3.0.11 Dispatch Dashboard **Assign Now** shortcut.
- v3.0.10 Client Patrol Request flow.
- v3.0.9 Guard Active Job workflow layout.
- v3.0.7/v3.0.8 marker visibility rules:
  - Offline hides guard and property markers.
  - Online shows guard marker only.
  - Property marker shows only during active job.
  - Completed job removes red property marker.

## Next likely test
- Login as Client and request patrol.
- Login as Dispatch and use **Assign Now**.
- Login as Guard and open **Active Job**.
- Confirm each workflow button turns green only when it is the current selected stage.
- Confirm all other workflow buttons remain default.
