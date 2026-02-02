# Palette's Journal

## 2026-01-21 - Accessible Radio-Style Buttons

**Learning:** When using buttons to create a radio-group-like selection interface, wrapping them in a `role="radiogroup"` container and giving each button `role="radio"` and `aria-checked` attributes significantly improves accessibility for screen readers. It transforms a list of "clickables" into a semantic group where the user understands they must make a single selection.
**Action:** Always check "card selection" interfaces for radio group semantics. If they behave like exclusive options, use `role="radiogroup"` and `role="radio"`.

## 2026-02-02 - Button Loading States
**Learning:** Adding an integrated loading spinner to a primary button is a high-impact micro-interaction. It prevents rage-clicks and provides immediate feedback. Using `currentColor` for the SVG spinner ensures it automatically adapts to any button variant (primary, outline, ghost) without extra CSS.
**Action:** Default to including a `loading` prop on all button components to encourage developers to use it for async actions.
