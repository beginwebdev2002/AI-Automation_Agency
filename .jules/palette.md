# Palette's Journal

## 2026-01-21 - Accessible Radio-Style Buttons

**Learning:** When using buttons to create a radio-group-like selection interface, wrapping them in a `role="radiogroup"` container and giving each button `role="radio"` and `aria-checked` attributes significantly improves accessibility for screen readers. It transforms a list of "clickables" into a semantic group where the user understands they must make a single selection.
**Action:** Always check "card selection" interfaces for radio group semantics. If they behave like exclusive options, use `role="radiogroup"` and `role="radio"`.

## 2026-01-30 - Built-in Loading States for Buttons
**Learning:** Adding a native `loading` state to the generic Button component (using `aria-busy` and a visual spinner) is superior to ad-hoc text changes (e.g., "Loading..."). It preserves layout stability (no width jumps) and provides immediate, standardized feedback across the app without developers needing to reimplement spinner logic every time.
**Action:** When auditing UI libraries, prioritize adding `loading` props to primary action components to encourage consistent async feedback.
