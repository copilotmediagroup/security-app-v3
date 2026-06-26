# Co Pilot Security v3.0.43 — Dispatch Board Command Center

## What changed
The Dispatch Board page has been rebuilt from a basic patrol request table into a full operations command-center page.

## New Dispatch Board sections
- KPI row:
  - Pending Dispatch
  - Online Guards
  - Active Patrols
  - Guard Approvals
  - Reports Ready
- Left queue:
  - Assign Now
  - Scheduled Queue
  - Proof Waiting Review
- Center command area:
  - Dispatch Command Map
  - Recent Activity table
- Right rail:
  - Messages
  - Notifications
  - System Status
  - Quick Actions

## Functional behavior
- Assign buttons use the existing `cp_admin_assign_patrol_request` flow.
- The Dispatch Command Map keeps the v3.0.42 online-guard visibility and Default map reset behavior.
- Quick Actions route to the correct admin screens.
- No new SQL required.
