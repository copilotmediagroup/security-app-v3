# Co Pilot Security v3.0.13 — Inline Proof Upload Flow

## What changed
- Guard sidebar no longer shows **Upload Proof**.
- There is no separate guard Upload Proof page in the workflow.
- Proof upload now happens inside **Active Job** only.
- When guard taps **Upload Proof** inside the job flow:
  1. The device/browser file picker opens.
  2. Guard selects photo or video proof.
  3. A preview confirmation modal appears.
  4. Guard confirms or cancels.
  5. On confirm, proof uploads through the existing proof storage/RPC flow.
  6. Guard stays on Active Job and can press **Complete Job** next.

## Preserved
- v3.0.12 green current-stage button behavior.
- Client Request Patrol flow.
- Dispatch Assign Now shortcut.
- Guard Active Job workflow layout.
- Same Supabase config.

## Badge
Bottom-right badge should show:

`v3.0.13 INLINE PROOF UPLOAD FLOW`

## SQL
No new SQL required.
