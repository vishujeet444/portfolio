# Responsive system

## Breakpoints (`src/lib/breakpoints.ts`)

| Tier    | Width        |
|---------|--------------|
| mobile  | 320–767px    |
| tablet  | 768–1023px   |
| laptop  | 1024–1439px  |
| desktop | 1440–1919px  |
| ultra   | 1920px+      |

## Files

- `src/styles/responsive.css` — layout grids, nav overlay, fluid spacing
- `src/lib/breakpoints.ts` — tiers + particle budgets
- `src/hooks/useMedia.ts` — `matchMedia` + viewport width
- `src/hooks/useDevice.ts` — tier, touch, motion, particles
- `src/context/ResponsiveProvider.jsx` — sets `data-tier` on `<html>`
- `src/components/ResponsiveImage.jsx` — `<picture>` + srcset (Vite, not Next.js)

## Particle budgets (GalaxyScene)

| Tier    | ~Total |
|---------|--------|
| mobile  | 15k    |
| tablet  | 40k    |
| laptop  | 72k    |
| desktop | 100k   |

## QA widths

Test at: 320, 375, 390, 768, 1024, 1366, 1440, 1920px.

Check: no horizontal scroll, readable hero type, gallery 1/2/3 columns, mobile nav fullscreen, lab stacks on phone.
