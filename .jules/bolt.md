## 2024-05-22 - Missing Pagination in Core Service

**Learning:** Found `findAllAppointments` returning all records without limits. This is a ticking time bomb for memory and response times as data grows.
**Action:** Always verify list endpoints have pagination or strict limits, especially when doing `populate`.

## 2024-06-25 - Polled Endpoint Indexing

**Learning:** Found `getQueue` endpoint being polled every 5s but doing a sort on unindexed combination (`status`, `sequenceNumber`).
**Action:** Always check polling endpoints for optimal indexes, as they amplify inefficient queries.

## 2024-10-24 - Unbounded Chat History Growth

**Learning:** `ChatService` was appending messages to `history` array without limit. This would lead to document size exceeding 16MB and performance degradation.
**Action:** Used `$slice` in `$push` to cap array size at database level, ensuring predictable performance and preventing failures.
