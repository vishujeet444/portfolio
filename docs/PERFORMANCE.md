# Performance — Gallery & Interactive 3D Lab

## Frontend (Vite + React)

| Technique | Implementation |
|-----------|----------------|
| Code splitting | `Projects`, `Interactive3DLab`, `ModelScene` lazy-loaded via `React.lazy` + `Suspense` |
| Three.js chunk | `vite.config.js` manualChunks: `three`, `r3f` (fiber + drei) |
| Gallery images | WebP via Unsplash `fm=webp`; `<picture>` + `loading="lazy"` + `decoding="async"` |
| HD sources | `imageHd` served only at `min-width: 1280px` |
| 3D loading | Draco decoder path (`gstatic` CDN); `useGLTF` with Suspense fallback spinner |
| Canvas DPR | `dpr={[1, 2]}` caps pixel ratio on retina |
| GPU hint | `powerPreference: 'high-performance'` |

## Target

- **60 FPS** on mid-range GPU with single GLB (&lt;50k tris demo assets)
- Gallery: no layout shift — skeleton pulse until `onLoad`

## Recommended production steps

1. **Replace gallery URLs** with local 4K AVIF/WebP in `/public/gallery/` (smaller than JPEG at same quality).
2. **Compress GLB** with [gltf-transform](https://gltf-transform.dev/) or Blender export + Draco:
   ```bash
   npx @gltf-transform/cli optimize input.glb output.glb --compress draco
   ```
3. **Run `database/models.sql`** in Supabase SQL Editor.
4. **Storage**: allow `models/` and `models/thumbnails/` in `portfolio-assets` bucket policies.
5. **Deploy API**: `vercel.json` rewrites `/api/models` and `/api/models/upload`.

## API

- Public `GET /api/models` returns `visibility = true` only.
- Authenticated admin `GET` returns all rows (including hidden).
- View counter increments on single-model fetch.

## Stack note

Delivery uses **Vite + Vercel serverless + Supabase** (not Next.js/Express). Prisma schema in `prisma/schema.prisma` mirrors the `models` table for reference or future migration.
