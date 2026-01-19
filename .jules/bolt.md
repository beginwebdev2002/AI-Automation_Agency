## 2024-05-22 - Missing Pagination in Core Service
**Learning:** Found `findAllAppointments` returning all records without limits. This is a ticking time bomb for memory and response times as data grows.
**Action:** Always verify list endpoints have pagination or strict limits, especially when doing `populate`.
