# Co Pilot Security v3.0.51 — Guard Approvals Command Center

## What changed
The Admin `Guard Approvals` page has been rebuilt from basic approval cards into a full onboarding review command center.

## New Guard Approvals sections
- Header with search and refresh
- KPI row:
  - Total Applications
  - Pending Review
  - Approved Today
  - Rejected
  - Interview Needed
  - Missing Docs
- Tabs:
  - All Applications
  - Pending
  - Interview
  - Approved
  - Rejected
- Filters:
  - Status
  - Rank
  - Experience
  - Background Check
  - Sort
- Applicant table:
  - Applicant
  - Rank Applied For
  - Experience
  - License Status
  - Background Check
  - Availability
  - Submitted
  - Status
  - Actions
- Right rail:
  - Applicant profile
  - Phone/email/location
  - Experience
  - Guard card
  - Certifications
  - Onboarding checklist
  - Review notes
  - Approve / Request Info / Schedule Interview / Reject

## Functional behavior
- Search filters applicants.
- Tabs filter applications by status.
- Dropdown filters update the table.
- Rows select the applicant and update the right rail.
- Approve and Reject use the existing signup approval/rejection flow for signup rows.
- Request Info and Schedule Interview save local workflow state and update the UI.
- No new SQL required.
