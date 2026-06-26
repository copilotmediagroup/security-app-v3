# Co Pilot Security v3.0.63 — Report Archive Command Center

## What changed
The Dispatch/Admin `Report Archive` page was rebuilt into a modern report library and final report management center.

## New Report Archive sections
- Header:
  - System Operational
  - Search reports, clients, properties
  - Filters
  - Export
- KPI row:
  - Total Reports
  - Published
  - Drafts
  - Scheduled
  - Photos Included
  - Videos Included
- Filter bar:
  - All Clients
  - All Properties
  - All Guards
  - All Status
  - Date Range
  - Sort
  - Clear Filters
- Main report table:
  - Checkbox
  - Report
  - Client / Property
  - Patrol / Job
  - Date
  - Status
  - Included media
  - Actions
- Right detail rail:
  - Selected report preview
  - Property photo
  - Report ID
  - Property/address
  - Patrol/job
  - Guard
  - Patrol type
  - Date/time
  - Duration
  - Status
  - Published by
  - Published on
  - Template
  - Summary
  - Included media
  - View Full Report
  - Download Report
  - Share Report
  - Delete Report

## Functional behavior
- Search filters archive rows.
- Dropdown filters update the table.
- Selecting a report updates the right rail.
- CSV export downloads the filtered archive list.
- Download/View Full Report downloads a text report preview placeholder.
- Share uses native share when available or copies share text.
- Delete removes local Report Builder records only; system records are protected.
- No URL inputs were added.
- No new SQL required.
