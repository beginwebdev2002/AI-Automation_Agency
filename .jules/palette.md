# Palette's Journal

## 2026-01-21 - Accessible Radio-Style Buttons

**Learning:** When using buttons to create a radio-group-like selection interface, wrapping them in a `role="radiogroup"` container and giving each button `role="radio"` and `aria-checked` attributes significantly improves accessibility for screen readers. It transforms a list of "clickables" into a semantic group where the user understands they must make a single selection.
**Action:** Always check "card selection" interfaces for radio group semantics. If they behave like exclusive options, use `role="radiogroup"` and `role="radio"`.

## 2026-01-27 - Aria-Pressed for Toggle Buttons
**Learning:** For category filters or multi-select lists implemented with buttons or clickable divs, `aria-pressed` provides immediate state feedback to screen readers. relying solely on visual cues (like border color) excludes non-visual users.
**Action:** When creating custom toggle or filter components, always bind `[attr.aria-pressed]` to the selection state signal.
