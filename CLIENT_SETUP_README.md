# Co Pilot Security v3.0.64 — Server Version QA Fix

## What changed
This build is a QA/fix package built from `v3.0.63 REPORT ARCHIVE COMMAND CENTER`.

The Report Archive rebuild from v3.0.63 is preserved. The only code fix is the stale `server.cjs` startup message, which still printed `Co Pilot Security v3.0.7 running...` even though the app UI/package metadata were v3.0.63.

## Fixed
- Updated `server.cjs` so the startup terminal label reads from `VERSION.txt` / package metadata.
- Updated app/package metadata to v3.0.64.
- Updated cache-bust strings so Bolt/browser should load the latest files.

## QA completed
- JavaScript syntax check passed for:
  - `build.cjs`
  - `server.cjs`
  - `supabase-client.js`
  - `config.js`
  - `script.js`
- `npm run build` completed successfully.
- Local server returned `index.html` correctly.
- Report Archive rendered with sample admin data.
- Report Archive counted included photo/video proof correctly.
- Admin, Guard, and Client nav views rendered without sandbox runtime errors.

## Preserved from v3.0.63
- Dispatch/Admin Report Archive command-center library.
- KPI row: Total Reports, Published, Drafts, Scheduled, Photos Included, Videos Included.
- Filters: Client, Property, Guard, Status, Date Range, Sort.
- Report archive table and selected report right rail.
- Search, clear filters, pagination, rows per page, CSV export, view/download/share/delete actions.
- Report Archive combines patrol reports, local Report Builder records, and completed patrol requests as draft-ready rows.
- No URL inputs were added.
- No new SQL required.
