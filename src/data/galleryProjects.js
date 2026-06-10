/**
 * Cinematic abstract gallery — Unsplash placeholders.
 */
const img = (id, w = 1920) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const GALLERY_PROJECTS = [
  {
    id: 'obsidian-monolith',
    title: 'Obsidian Monolith',
    category: 'Abstract',
    software: 'Houdini · Redshift',
    year: '2026',
    description:
      'Abstract monolith composition with obsidian shards, particle atmosphere, and museum-grade rim lighting.',
    image: img('photo-1535223289827-42f1e9919769', 1200),
    imageHd: img('photo-1535223289827-42f1e9919769', 1600),
    aspect: 'portrait',
    size: 'medium',
    accent: 'cyan',
  },
  {
    id: 'glass-chrome',
    title: 'Glass & Chrome Geometry',
    category: 'Product',
    software: 'Cinema 4D · Octane',
    year: '2025',
    description:
      'Premium studio render — refractive glass, chrome edges, caustics, and controlled soft bloom.',
    image: img('photo-1526170375885-4d8ecf77b99f', 1200),
    imageHd: img('photo-1526170375885-4d8ecf77b99f', 1920),
    aspect: 'standard',
    size: 'medium',
    accent: 'neon',
  },
  {
    id: 'brutalist-forms',
    title: 'Floating Architectural Forms',
    category: 'Archviz',
    software: '3ds Max · V-Ray',
    year: '2025',
    description:
      'Minimal brutalist volumes suspended in soft fog with drifting white particles and architectural scale.',
    image: img('photo-1501183638710-841dd1904471', 1920),
    imageHd: img('photo-1501183638710-841dd1904471', 2560),
    aspect: 'cinematic',
    size: 'large',
    accent: 'cyan',
  },
  {
    id: 'luxury-sculpture',
    title: 'Luxury Product Sculpture',
    category: 'Product',
    software: 'Maya · Arnold',
    year: '2026',
    description:
      'Matte black sculptural forms with chrome edge highlights and shallow cinematic depth of field.',
    image: img('photo-1505691938895-1758d7feb511', 1200),
    imageHd: img('photo-1505691938895-1758d7feb511', 1920),
    aspect: 'standard',
    size: 'medium',
    accent: 'neon',
  },
  {
    id: 'energy-sphere',
    title: 'Energy Sphere',
    category: 'VFX',
    software: 'Blender · EEVEE',
    year: '2026',
    description:
      'Particle trails orbiting a luminous core — volumetric glow in a dark premium environment.',
    image: img('photo-1558618666-fcd25c85cd64', 1920),
    imageHd: img('photo-1558618666-fcd25c85cd64', 2560),
    aspect: 'cinematic',
    size: 'medium',
    accent: 'cyan',
  },
];

export const GALLERY_CATEGORIES = ['All', 'Abstract', 'Archviz', 'Product', 'VFX'];
