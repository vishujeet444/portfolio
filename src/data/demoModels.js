/** Fallback demo models when API / Supabase unavailable */
export const DEMO_MODELS = [
  {
    id: 'demo-helmet',
    title: 'Damaged Helmet',
    slug: 'damaged-helmet',
    thumbnail: null,
    model_url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb',
    description: 'Industry-standard PBR test asset with detailed wear and metal response.',
    software: 'Blender · glTF Sample',
    polycount: 14556,
    category: 'Product',
    tags: ['PBR', 'Demo', 'Metal'],
    featured: true,
    visibility: true,
    file_format: 'glb',
    materials: ['Leather', 'Metal', 'Glass'],
  },
  {
    id: 'demo-duck',
    title: 'Rubber Duck',
    slug: 'rubber-duck',
    thumbnail: null,
    model_url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb',
    description: 'Classic low-poly reference mesh for material and lighting tests.',
    software: 'Maya',
    polycount: 4212,
    category: 'Abstract',
    tags: ['Low-poly', 'Demo'],
    featured: false,
    visibility: true,
    file_format: 'glb',
    materials: ['Rubber'],
  },
];

export const DRACO_DECODER = 'https://www.gstatic.com/draco/versioned/decoders/1.5.6/';
