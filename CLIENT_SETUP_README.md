# Co Pilot Security v3.0.75 — Job Timeline / Audit Trail

## What changed
This build adds a timeline/audit layer across patrol jobs and reports while preserving the v3.0.74 global data logic sync.

## Added
- Job timeline / audit trail panels for active jobs, completed jobs, Report Builder, Report Archive, and Client Reports preview.
- Timeline events for client request, Dispatch assignment, guard acceptance, patrol start, proof upload, job completion, proof review, report publishing, and client view/download.
- Local audit event capture for key workflow actions.
- Export Timeline CSV button for selected jobs.

## Preserved
- v3.0.74 dashboard/report/proof count consistency.
- v3.0.73 full workflow status unification.
- v3.0.72 report/proof count clarity.
- No URL inputs.
- No new SQL required.
