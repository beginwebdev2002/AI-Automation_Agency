# Palette's Journal

## 2026-01-21 - Accessible Radio-Style Buttons

**Learning:** When using buttons to create a radio-group-like selection interface, wrapping them in a `role="radiogroup"` container and giving each button `role="radio"` and `aria-checked` attributes significantly improves accessibility for screen readers. It transforms a list of "clickables" into a semantic group where the user understands they must make a single selection.
**Action:** Always check "card selection" interfaces for radio group semantics. If they behave like exclusive options, use `role="radiogroup"` and `role="radio"`.

## 2026-02-03 - Lucide Icons in Standalone Components

**Learning:** In this `lucide-angular` (v0.563) setup, passing the icon object directly to the `[img]` input of `<lucide-icon>` (e.g., `<lucide-icon [img]="Loader2">`) is the most reliable way to use icons in Standalone Components without global registration or ModuleWithProviders issues in `imports`.
**Action:** When adding new icons to Standalone Components, import the icon object and pass it via `[img]` property.
