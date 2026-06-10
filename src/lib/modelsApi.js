import { DEMO_MODELS } from '../data/demoModels';

const API = '/api/models';

export async function fetchModels({ featured } = {}) {
  try {
    const q = featured ? '?featured=true' : '';
    const res = await fetch(`${API}${q}`);
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    return Array.isArray(data) && data.length ? data : DEMO_MODELS;
  } catch {
    return DEMO_MODELS;
  }
}

export async function fetchModelBySlug(slug) {
  try {
    const res = await fetch(`${API}?slug=${encodeURIComponent(slug)}`);
    if (!res.ok) throw new Error('Not found');
    return res.json();
  } catch {
    return DEMO_MODELS.find((m) => m.slug === slug) || null;
  }
}
