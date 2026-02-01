# Palette's Journal

## 2026-01-21 - Accessible Radio-Style Buttons

**Learning:** When using buttons to create a radio-group-like selection interface, wrapping them in a `role="radiogroup"` container and giving each button `role="radio"` and `aria-checked` attributes significantly improves accessibility for screen readers. It transforms a list of "clickables" into a semantic group where the user understands they must make a single selection.
**Action:** Always check "card selection" interfaces for radio group semantics. If they behave like exclusive options, use `role="radiogroup"` and `role="radio"`.

## 2026-02-01 - Centralized Button Loading State

**Learning:** Centralizing the `loading` state within the shared `ButtonComponent` (handling spinner injection, `disabled` attribute, and `aria-busy` automatically) drastically simplifies feature-level forms like `LoginFormComponent`. It ensures consistent visual feedback and accessibility compliance across the application without developers needing to manually implement spinners or manage aria attributes in every form.
**Action:** Identify other shared interactive components (e.g., inputs with validation, cards with async content) that can benefit from built-in state management to enforce consistent UX and accessibility patterns.
