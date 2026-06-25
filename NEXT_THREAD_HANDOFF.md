# Next Thread Handoff — Co Pilot Security v3.0.8

Latest build: v3.0.8 CURRENT ASSIGNMENT BUTTON CLEANUP

## What changed from v3.0.7
- Removed duplicate Online and Offline buttons from the Guard Dashboard Current Assignment card.
- Current Assignment card now keeps only Open Active Job.
- Online and Offline controls remain below the Route / GPS map only.
- No SQL changes.

## Current Guard Dashboard map rule
- Offline: guard cannot see markers on the map. Both blue guard pulse and red property pulse are hidden.
- Online: guard sees their own blue GPS pulse after browser location is available.
- Property: red property pulse appears only while the guard is online and has an active job.
- Completed job: red property pulse disappears.
- Offline clicked: both red and blue pulses disappear, route/ETA/distance clear, and open cards close.

## Continue next
First test the Guard Dashboard button cleanup and map flow only. Do not jump to another screen until this is verified.
