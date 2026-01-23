---
trigger: model_decision
description: ./apps/admin-panel/src/**/
globs: frontend/**/
---

# ⚡ Signals Best Practices: Premium Content Delivery

Since the client's business is highly visual (High-res bridal photos), performance is key.

## 🖼️ Media Management with Signals

- Use `computed()` to handle image transformations and lazy loading states.
- Implement a `loading` signal for high-resolution galleries to ensure smooth transitions.

## 📈 State Patterns

- `private _activeCollection = signal<WeddingCollection | null>(null)`
- Use `effect()` strictly for analytics tracking or direct DOM manipulation for premium animations.

## 🚀 Performance

- Group UI updates using `batch()` during bulk inventory uploads (e.g., adding 50 new dresses).
