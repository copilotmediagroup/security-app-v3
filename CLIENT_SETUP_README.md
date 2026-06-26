# Co Pilot Security v3.0.61 — Report Builder Command Center

## What changed
The Dispatch/Admin `Report Builder` page was rebuilt into a modern command-center final report creation workflow.

## New Report Builder sections
- Header:
  - System Operational
  - Search reports, clients, guards
  - Templates
  - Settings
  - New Report
- KPI row:
  - Draft Reports
  - Ready To Publish
  - Published Reports
  - Total Reports
  - Photos Included
  - Videos Included
- Builder steps:
  - Select Patrol
  - Select Proof
  - Build Report
  - Review & Publish
- Completed patrol selector:
  - Client
  - Property
  - Patrol / Job
  - Refresh
- Selected job card:
  - Property photo
  - Completed badge
  - Client
  - Property
  - Patrol Type
  - Guard
  - Date
  - Time
  - Duration
- Proof selector:
  - Guard-uploaded photo/video proof cards only
  - Select All
  - Pagination
  - Items per page
- Right rail:
  - Live report preview
  - Report paper layout
  - Report options
  - Template
  - Report title
  - Include guard notes
  - Include patrol summary
  - Save as Draft
  - Review & Publish

## Functional behavior
- Selecting a completed patrol updates the job card and report preview.
- Selecting proof updates the report preview and selected proof count.
- Report title, template, and report options update live.
- Save as Draft stores a local report record.
- Review & Publish stores a published local report record.
- If no proof is selected, Dispatch can still publish after confirmation.
- No URL input was added anywhere.
- No new SQL required.
