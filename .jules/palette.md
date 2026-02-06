# Palette's Journal

## 2026-01-21 - Accessible Radio-Style Buttons

**Learning:** When using buttons to create a radio-group-like selection interface, wrapping them in a `role="radiogroup"` container and giving each button `role="radio"` and `aria-checked` attributes significantly improves accessibility for screen readers. It transforms a list of "clickables" into a semantic group where the user understands they must make a single selection.
**Action:** Always check "card selection" interfaces for radio group semantics. If they behave like exclusive options, use `role="radiogroup"` and `role="radio"`.

## 2026-02-06 - Consistent Button Loading States

**Learning:** Adding a standardized `loading` input to the base `ButtonComponent` ensures consistent feedback across the application. Using `lucide-angular` icons (like `Loader2`) alongside `aria-busy` and `disabled` attributes provides an accessible and visual indication of processing without requiring custom implementation in every feature.
**Action:** Use the `loading` signal input on `app-button` for all async actions instead of manually managing spinners and disabled states externally.
