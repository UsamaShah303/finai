# Finlink Hero Section

A standalone export of the Finlink landing-page hero: a soft sky gradient background with parallax clouds and a skyline, an editorial serif headline, and a floating laptop dashboard.

## Contents

```
src/
  pages/Index.tsx       # The hero section component
  index.css             # Design tokens, gradients, animations
  assets/
    hero-dashboard.png  # Laptop with finance dashboard (transparent bg)
    hero-clouds.png     # Cloud layer used 3x for parallax
    hero-skyline.png    # City skyline used 3x for parallax
tailwind.config.ts      # Tailwind theme with brand colors
```

## Stack requirements

- React 18 + TypeScript
- Vite (with `@/` alias pointing to `src/`)
- Tailwind CSS v3
- shadcn/ui base setup (the file uses standard semantic tokens like
  `bg-background`, `text-foreground`, `border-border` defined in `index.css`)

## How to use

1. Drop `src/pages/Index.tsx` into your routes (e.g. as `/`).
2. Replace your existing `src/index.css` with the one provided, or merge the
   `:root` tokens, `@layer utilities`, and `@keyframes` blocks.
3. Replace `tailwind.config.ts` or merge the `brand` color family and the
   `shadow-phone` / `shadow-soft` extensions into your existing config.
4. Copy the three assets into `src/assets/`. They are already imported via
   ES6 `import` at the top of `Index.tsx`.
5. Make sure the Google Fonts import (Fraunces + Inter) at the top of
   `index.css` is preserved — the `font-display` class depends on Fraunces.

## Design tokens

- Sky gradient: `--sky-top` → `--sky-mid` → `--sky-bottom`
- Brand greens: `--brand-green`, `--brand-green-soft`, `--brand-green-deep`
- Phone/laptop shadow: `--shadow-phone`
- Animations: `animate-float`, `animate-drift`, `animate-drift-slow`,
  `animate-drift-reverse`

All colors are HSL and live in `index.css` — never hardcode colors in the
component.

## Customization quick wins

- Rename brand: change "Finlink" in the nav (line ~37 of `Index.tsx`).
- Swap headline: edit the `<h1>` inside the Hero block.
- Replace dashboard: drop a new image into `src/assets/hero-dashboard.png`
  (keep transparent background for best results).
- Tweak parallax depth: adjust the `factor` numbers passed to `py(...)` on
  each parallax layer.
