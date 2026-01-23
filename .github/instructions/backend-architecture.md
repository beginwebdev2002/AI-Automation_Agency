---
trigger: model_decision
description: ./apps/api/src/**/
---

# 🏛️ Architectural Rules: Hexagonal Architecture (Medical Luxury API)

This API powers the "Mavluda Azizova" ecosystem. Every line of code must reflect a premium service standard.

## 🧱 Layer Definitions & Business Logic

- **Domain (Core)**: Represents the high-end beauty services, premium inventory (dresses), and VIP client entities.
- **Application (Use Cases)**: Booking logic for `@mavluda_beauty_house` and rental flows for `@aliya_wedding_room`.
- **Infrastructure**: MongoDB adapters, SMS gateways for VIP notifications, and Instagram API integrations.

## 📁 Business Domain Mapping

All modules must follow the client's business structure:

- `booking-module`: High-priority scheduling for VIP clients.
- `inventory-module`: Management of luxury wedding dresses (Aliya Wedding Room).
- `partnership-module`: Tracking influencer collaborations and promo codes.

## 🚫 Dependency Rules

- Infrastructure (Repositories/Controllers) -> Application -> Domain.
- **Domain must remain pure**: No references to external libraries.
