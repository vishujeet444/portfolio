/**
 * /api/models — Interactive 3D Lab CRUD
 * GET (public visible) | POST | PUT | DELETE | PATCH (feature)
 * Query: ?id= & ?slug= & ?featured=true
 */

'use strict';

const { supabase, assertDb } = require('./db');
const {
  setCors, handlePreflight, requireAuth,
  validate, sanitize,
  logRequest, sendError, sendSuccess,
} = require('./_middleware');

const VALID_CATEGORIES = ['Abstract', 'Archviz', 'Product', 'Character', 'Environment', 'Other'];

function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 200);
}

module.exports = async (req, res) => {
  setCors(req, res);
  if (handlePreflight(req, res)) return;
  if (!assertDb(res)) return;

  const { id, slug, featured } = req.query || {};

  if (req.method === 'GET') {
    try {
      if (id || slug) {
        let q = supabase.from('models').select('*');
        if (id) q = q.eq('id', id);
        else q = q.eq('slug', slug);
        const { data, error } = await q.single();
        if (error) return sendError(res, error.code === 'PGRST116' ? 404 : 500, error.message, 'DB_ERROR');
        if (!data.visibility) {
          const user = await requireAuth(req, res);
          if (!user) return;
        }
        await supabase.from('models').update({ views: (data.views || 0) + 1 }).eq('id', data.id);
        return res.status(200).json(data);
      }

      let q = supabase.from('models').select('*');

      const authHeader = req.headers.authorization;
      let isAdmin = false;
      if (authHeader?.startsWith('Bearer ')) {
        const { data: { user } } = await supabase.auth.getUser(authHeader.split(' ')[1]);
        isAdmin = !!user;
      }
      if (!isAdmin) q = q.eq('visibility', true);

      if (featured === 'true') q = q.eq('featured', true);
      q = q.order('featured', { ascending: false }).order('created_at', { ascending: false });

      const { data, error } = await q;
      if (error) return sendError(res, 500, error.message, 'DB_ERROR');
      logRequest(req, 200, `${data.length} models`);
      return res.status(200).json(data);
    } catch (err) {
      console.error('[models GET]', err);
      return sendError(res, 500, 'Internal Server Error', 'INTERNAL_ERROR');
    }
  }

  if (req.method === 'PATCH' && req.body?.action === 'feature') {
    const user = await requireAuth(req, res);
    if (!user) return;
    try {
      const { id: modelId, featured: isFeatured } = req.body;
      if (!modelId) return sendError(res, 400, 'Model id required', 'MISSING_ID');
      const { data, error } = await supabase
        .from('models')
        .update({ featured: !!isFeatured })
        .eq('id', modelId)
        .select()
        .single();
      if (error) return sendError(res, 500, error.message, 'DB_ERROR');
      return sendSuccess(res, { model: data });
    } catch (err) {
      return sendError(res, 500, 'Internal Server Error', 'INTERNAL_ERROR');
    }
  }

  const user = await requireAuth(req, res);
  if (!user) return;

  if (req.method === 'POST') {
    try {
      const body = req.body || {};
      const validationError = validate(
        {
          title: 'string',
          model_url: 'string',
        },
        body
      );
      if (validationError) return sendError(res, 400, validationError, 'VALIDATION_ERROR');

      const modelSlug = body.slug ? sanitize(body.slug, 220) : slugify(body.title);
      const payload = {
        title: sanitize(body.title, 200),
        slug: modelSlug,
        thumbnail: body.thumbnail ? sanitize(body.thumbnail, 500) : null,
        model_url: sanitize(body.model_url, 800),
        description: sanitize(body.description || '', 5000),
        software: sanitize(body.software || '', 200),
        polycount: parseInt(body.polycount, 10) || 0,
        category: VALID_CATEGORIES.includes(body.category) ? body.category : 'Abstract',
        tags: Array.isArray(body.tags) ? body.tags.map((t) => sanitize(String(t), 50)).slice(0, 12) : [],
        featured: !!body.featured,
        visibility: body.visibility !== false,
        file_format: sanitize(body.file_format || 'glb', 10),
        file_size: parseInt(body.file_size, 10) || 0,
        materials: body.materials || [],
      };

      const { data, error } = await supabase.from('models').insert([payload]).select().single();
      if (error) return sendError(res, 500, error.message, 'DB_ERROR');
      logRequest(req, 201, `model ${data.id}`);
      return sendSuccess(res, { model: data }, 201);
    } catch (err) {
      console.error('[models POST]', err);
      return sendError(res, 500, 'Internal Server Error', 'INTERNAL_ERROR');
    }
  }

  if (req.method === 'PUT') {
    try {
      const body = req.body || {};
      if (!body.id) return sendError(res, 400, 'Model id required', 'MISSING_ID');

      const updateData = {};
      if (body.title !== undefined) updateData.title = sanitize(body.title, 200);
      if (body.slug !== undefined) updateData.slug = sanitize(body.slug, 220);
      if (body.thumbnail !== undefined) updateData.thumbnail = body.thumbnail ? sanitize(body.thumbnail, 500) : null;
      if (body.model_url !== undefined) updateData.model_url = sanitize(body.model_url, 800);
      if (body.description !== undefined) updateData.description = sanitize(body.description, 5000);
      if (body.software !== undefined) updateData.software = sanitize(body.software, 200);
      if (body.polycount !== undefined) updateData.polycount = parseInt(body.polycount, 10) || 0;
      if (body.category !== undefined && VALID_CATEGORIES.includes(body.category)) updateData.category = body.category;
      if (body.tags !== undefined) updateData.tags = body.tags;
      if (body.featured !== undefined) updateData.featured = !!body.featured;
      if (body.visibility !== undefined) updateData.visibility = !!body.visibility;
      if (body.materials !== undefined) updateData.materials = body.materials;

      const { data, error } = await supabase.from('models').update(updateData).eq('id', body.id).select().single();
      if (error) return sendError(res, 500, error.message, 'DB_ERROR');
      if (!data) return sendError(res, 404, 'Not found', 'NOT_FOUND');
      return sendSuccess(res, { model: data });
    } catch (err) {
      return sendError(res, 500, 'Internal Server Error', 'INTERNAL_ERROR');
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { id: modelId } = req.body || {};
      if (!modelId) return sendError(res, 400, 'Model id required', 'MISSING_ID');
      const { data, error } = await supabase.from('models').delete().eq('id', modelId).select('id').single();
      if (error) return sendError(res, 500, error.message, 'DB_ERROR');
      if (!data) return sendError(res, 404, 'Not found', 'NOT_FOUND');
      return sendSuccess(res, { message: 'Deleted', id: data.id });
    } catch (err) {
      return sendError(res, 500, 'Internal Server Error', 'INTERNAL_ERROR');
    }
  }

  return sendError(res, 405, 'Method not allowed', 'METHOD_NOT_ALLOWED');
};
