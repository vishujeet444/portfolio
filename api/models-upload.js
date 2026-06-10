/**
 * POST /api/models/upload — Register model after Supabase Storage upload
 * Body: { title, model_url, thumbnail?, description?, software?, category?, tags?, file_format?, file_size?, polycount? }
 * Admin auth required. Client uploads file to storage first, then calls this.
 */

'use strict';

const { supabase, assertDb } = require('./db');
const {
  setCors, handlePreflight, requireAuth,
  sanitize, logRequest, sendError, sendSuccess,
} = require('./_middleware');

function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .slice(0, 200);
}

module.exports = async (req, res) => {
  setCors(req, res);
  if (handlePreflight(req, res)) return;
  if (!assertDb(res)) return;

  if (req.method !== 'POST') {
    return sendError(res, 405, 'POST only', 'METHOD_NOT_ALLOWED');
  }

  const user = await requireAuth(req, res);
  if (!user) return;

  try {
    const body = req.body || {};
    if (!body.title || !body.model_url) {
      return sendError(res, 400, 'title and model_url required', 'VALIDATION_ERROR');
    }

    const payload = {
      title: sanitize(body.title, 200),
      slug: body.slug ? sanitize(body.slug, 220) : `${slugify(body.title)}-${Date.now().toString(36)}`,
      model_url: sanitize(body.model_url, 800),
      thumbnail: body.thumbnail ? sanitize(body.thumbnail, 500) : null,
      description: sanitize(body.description || '', 5000),
      software: sanitize(body.software || '', 200),
      polycount: parseInt(body.polycount, 10) || 0,
      category: body.category || 'Abstract',
      tags: Array.isArray(body.tags) ? body.tags : [],
      featured: !!body.featured,
      visibility: body.visibility !== false,
      file_format: sanitize(body.file_format || 'glb', 10),
      file_size: parseInt(body.file_size, 10) || 0,
      materials: body.materials || [],
    };

    const { data, error } = await supabase.from('models').insert([payload]).select().single();
    if (error) return sendError(res, 500, error.message, 'DB_ERROR');

    logRequest(req, 201, `upload registered ${data.id}`);
    return sendSuccess(res, { model: data }, 201);
  } catch (err) {
    console.error('[models-upload]', err);
    return sendError(res, 500, 'Internal Server Error', 'INTERNAL_ERROR');
  }
};
