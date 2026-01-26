## 2024-05-22 - Missing Pagination in Core Service

**Learning:** Found `findAllAppointments` returning all records without limits. This is a ticking time bomb for memory and response times as data grows.
**Action:** Always verify list endpoints have pagination or strict limits, especially when doing `populate`.

## 2024-06-25 - Polled Endpoint Indexing

**Learning:** Found `getQueue` endpoint being polled every 5s but doing a sort on unindexed combination (`status`, `sequenceNumber`).
**Action:** Always check polling endpoints for optimal indexes, as they amplify inefficient queries.

## 2025-01-26 - Unbounded Chat History Growth

**Learning:** Found `history` array in Chat documents growing indefinitely, which would eventually hit the 16MB document limit and crash.
**Action:** Always use `$slice` in `$push` updates for array fields that function as a sliding window or log to enforce limits at the database level.
