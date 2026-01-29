# Palette's Journal

## 2026-01-21 - Accessible Radio-Style Buttons

**Learning:** When using buttons to create a radio-group-like selection interface, wrapping them in a `role="radiogroup"` container and giving each button `role="radio"` and `aria-checked` attributes significantly improves accessibility for screen readers. It transforms a list of "clickables" into a semantic group where the user understands they must make a single selection.
**Action:** Always check "card selection" interfaces for radio group semantics. If they behave like exclusive options, use `role="radiogroup"` and `role="radio"`.

## 2026-01-29 - Loading Button Verification
**Learning:** When verifying a loading button that changes its text/label, avoid using `get_by_role("button", name="...")` as the name change breaks the locator immediately after click. Use a stable attribute like `type="submit"` or a class. Also, ensure boolean signal inputs like `[loading]` translate to `aria-busy="true"` (string) in the DOM for accessibility checks.
**Action:** Use stable locators for elements that change state dynamically during verification scripts.
