## 2024-05-22 - Missing Pagination in Core Service

**Learning:** Found `findAllAppointments` returning all records without limits. This is a ticking time bomb for memory and response times as data grows.
**Action:** Always verify list endpoints have pagination or strict limits, especially when doing `populate`.

## 2024-06-25 - Polled Endpoint Indexing

**Learning:** Found `getQueue` endpoint being polled every 5s but doing a sort on unindexed combination (`status`, `sequenceNumber`).
**Action:** Always check polling endpoints for optimal indexes, as they amplify inefficient queries.

## 2026-01-28 - Unoptimized Polling in Queue Dashboard
**Learning:** Found `QueueDashboardComponent` polling every 5s inside Angular Zone, triggering global change detection on every tick.
**Action:** Always wrap `setInterval` in `NgZone.runOutsideAngular` and re-enter zone only on state change.
