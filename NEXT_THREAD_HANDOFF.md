# Next Thread Handoff — Co Pilot Security v3.0.57

Latest build: v3.0.57 SIDEBAR PROFILE NAV STACK FIX

## What changed
- Built from v3.0.56.
- User was correct that the Dispatch profile was still sitting over the Dashboard button.
- This build changes the sidebar markup and CSS, not just spacing:
  - Profile card is wrapped in `admin-profile-zone`.
  - Admin sidebar grid reserves 124px for that profile zone.
  - Nav list starts in the next grid row.
- Guard and Client sidebars preserved.
- No new SQL required.
