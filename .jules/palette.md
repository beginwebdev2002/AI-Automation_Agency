# Palette's Journal

## 2026-01-21 - Accessible Radio-Style Buttons

**Learning:** When using buttons to create a radio-group-like selection interface, wrapping them in a `role="radiogroup"` container and giving each button `role="radio"` and `aria-checked` attributes significantly improves accessibility for screen readers. It transforms a list of "clickables" into a semantic group where the user understands they must make a single selection.
**Action:** Always check "card selection" interfaces for radio group semantics. If they behave like exclusive options, use `role="radiogroup"` and `role="radio"`.

## 2026-01-31 - Responsive Loading States

**Learning:** Adding `flex items-center justify-center` to button styles enables seamless integration of loading spinners without disrupting layout, but requires careful default width handling (e.g. `inline-flex` vs `w-full`). Using `currentColor` for spinners ensures they automatically match the button variant's text color.
**Action:** Standardize button components to use flexbox and `currentColor` SVGs for loading states.
