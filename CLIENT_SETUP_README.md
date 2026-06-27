# Co Pilot Security v3.0.58 — Clients Command Center

## What changed
The Dispatch/Admin `Clients` page was rebuilt into a modern command-center client management page.

## New Clients page sections
- Header:
  - System Operational
  - Search clients
  - Filters button
  - Add Client button
- KPI row:
  - Total Clients
  - Active Clients
  - Active Contracts
  - Monthly Revenue
  - Contracts Expiring
  - Past Due
- Main client table:
  - Client
  - Client Type
  - Contact
  - Sites
  - Contract
  - Status
  - Revenue
  - Actions
- Right detail rail:
  - Client logo/profile
  - Overview / Sites / Contracts / Notes tabs
  - Primary contact
  - Email
  - Phone
  - Client type
  - Region
  - Account manager
  - Date added
  - Monthly revenue
  - Service tags
  - Site/request/report stats
  - View Full Profile
  - Edit Client

## Functional behavior
- Search filters the client table.
- Tabs filter All, Active, Inactive, Prospects, On Hold.
- Dropdown filters update the table.
- Clear Filters resets the page.
- Selecting a client updates the right detail rail.
- Pagination and rows per page are wired.
- Add Client, Export, Columns, Edit, View, and Menu actions are placeholder workflows for the next build.
- No new SQL required.
