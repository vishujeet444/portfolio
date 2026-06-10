# Performance — Helios Portfolio (Optimized)

## Architecture

| Layer | Strategy |
|-------|----------|
| Scroll reveals | `useIntersectionReveal` — Intersection Observer + CSS `opacity`/`transform` (no GSAP) |
| Smooth scroll | Native `scroll-behavior: smooth` (Lenis removed) |
| Background | Mobile: static CSS fog · Tablet+: lightweight WebGL galaxy (~80% fewer particles) |
| 3D Lab | `ModelScene` mounts only when section in view; `frameloop` pauses off-screen |
| Code splitting | Galaxy, Projects, Lab, About, Skills, Experience, Contact, CustomCursor lazy-loaded |
| Images | WebP via Unsplash `fm=webp`; `loading="lazy"` + `decoding="async"` |

## Particle budgets (total)

| Tier | Particles | WebGL |
|------|-----------|-------|
| Mobile | 0 | Off — CSS ambient only |
| Tablet | ~6k | Lite |
| Laptop | ~13k | Lite |
| Desktop | ~19k | Full |
| Ultra | ~23k | Full |

## Vite chunks

- `three` — Three.js core
- `r3f` — React Three Fiber + Drei
- `motion` — Framer Motion (modals/nav only)

## Removed for performance

- GSAP / ScrollTrigger (~45 KB gzip)
- Lenis smooth scroll (perpetual RAF)
- `@react-three/postprocessing` (unused)
- Grain overlay (SVG turbulence filter)
- Nebula, dust, multi-ring systems, scroll-parallax camera
- Ambient scroll parallax + animated starfield
- Filter/blur animations

## Lighthouse targets

Performance 95+ · Accessibility 95+ · Best Practices 95+ · SEO 95+

Run: Chrome DevTools → Lighthouse → Mobile + Desktop

## Production checklist

1. Local gallery WebP/AVIF in `/public/gallery/`
2. Compress GLB with Draco (`npx @gltf-transform/cli optimize`)
3. Set `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` on Vercel
4. Run `database/models.sql` in Supabase
