/**
 * ============================================================
 * GET|POST|PUT|DELETE /api/projects — Projects CRUD
 * ============================================================
 * • GET    → Public. Supports ?category= and ?sort=
 * • POST   → Admin only. Create project.
 * • PUT    → Admin only. Update project.
 * • DELETE → Admin only. Delete project.
 * ============================================================
 */

'use strict';

const { supabase, assertDb } = require('./db');
const {
  setCors, handlePreflight, requireAuth,
  validate, sanitize,
  logRequest, sendError, sendSuccess,
} = require('./_middleware');

const VALID_CATEGORIES = ['3D', 'Motion', 'Branding', 'UI/UX', 'Other'];
const VALID_SORTS      = ['newest', 'oldest', 'order'];

module.exports = async (req, res) => {
  setCors(req, res);
  if (handlePreflight(req, res)) return;

  if (!assertDb(res)) return;

  // ══ GET: Public — list projects ═══════════════════════════
  if (req.method === 'GET') {
    try {
      const { category, sort = 'newest' } = req.query || {};

      // Validate sort param
      const sortParam = VALID_SORTS.includes(sort) ? sort : 'newest';

      let query = supabase
        .from('projects')
        .select('*');

      // Optional category filter
      if (category && VALID_CATEGORIES.includes(category)) {
        query = query.eq('category', category);
      }

      // Sorting
      if (sortParam === 'oldest') {
        query = query.order('created_at', { ascending: true });
      } else if (sortParam === 'order') {
        query = query.order('sort_order', { ascending: true }).order('created_at', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;

      if (error) {
        console.error('[projects GET] Supabase error:', error.message);
        return sendError(res, 500, error.message, 'DB_ERROR');
      }

      logRequest(req, 200, `returned ${data.length} projects`);
      return res.status(200).json(data);
    } catch (err) {
      console.error('[projects GET] Unexpected error:', err);
      return sendError(res, 500, 'Internal Server Error', 'INTERNAL_ERROR');
    }
  }

  // ── All write methods require authentication ───────────────
  const user = await requireAuth(req, res);
  if (!user) return;

  // ══ POST: Create project ══════════════════════════════════
  if (req.method === 'POST') {
    try {
      const body = req.body || {};

      const validationError = validate(
        {
          title:        'string',
          description:  'string',
          category:     `enum:${VALID_CATEGORIES.join(',')}`,
          beauty_image: 'string',
        },
        body
      );
      if (validationError) return sendError(res, 400, validationError, 'VALIDATION_ERROR');

      const payload = {
        title:        sanitize(body.title,        150),
        description:  sanitize(body.description,  3000),
        category:     body.category,
        beauty_image: sanitize(body.beauty_image, 500),
        wire_image:   body.wire_image  ? sanitize(body.wire_image,  500) : null,
        clay_image:   body.clay_image  ? sanitize(body.clay_image,  500) : null,
        sort_order:   Number.isInteger(body.sort_order) ? body.sort_order : 0,
      };

      if (payload.title.length < 2) return sendError(res, 400, 'Title must be at least 2 characters.');

      const { data, error } = await supabase
        .from('projects')
        .insert([payload])
        .select()
        .single();

      if (error) {
        console.error('[projects POST] Supabase error:', error.message);
        return sendError(res, 500, error.message, 'DB_ERROR');
      }

      logRequest(req, 201, `created project: ${data.id}`);
      return sendSuccess(res, { project: data }, 201);
    } catch (err) {
      console.error('[projects POST] Unexpected error:', err);
      return sendError(res, 500, 'Internal Server Error', 'INTERNAL_ERROR');
    }
  }

  // ══ PUT: Update project ═══════════════════════════════════
  if (req.method === 'PUT') {
    try {
      const body = req.body || {};
      const { id } = body;
      if (!id) return sendError(res, 400, 'Project ID is required.', 'MISSING_ID');

      const updateData = {};
      if (body.title        !== undefined) updateData.title        = sanitize(body.title, 150);
      if (body.description  !== undefined) updateData.description  = sanitize(body.description, 3000);
      if (body.beauty_image !== undefined) updateData.beauty_image = sanitize(body.beauty_image, 500);
      if (body.wire_image   !== undefined) updateData.wire_image   = body.wire_image ? sanitize(body.wire_image, 500) : null;
      if (body.clay_image   !== undefined) updateData.clay_image   = body.clay_image ? sanitize(body.clay_image, 500) : null;
      if (body.sort_order   !== undefined) updateData.sort_order   = parseInt(body.sort_order) || 0;

      if (body.category !== undefined) {
        if (!VALID_CATEGORIES.includes(body.category)) {
          return sendError(res, 400, `Category must be one of: ${VALID_CATEGORIES.join(', ')}.`, 'VALIDATION_ERROR');
        }
        updateData.category = body.category;
      }

      if (Object.keys(updateData).length === 0) {
        return sendError(res, 400, 'No fields to update.', 'EMPTY_UPDATE');
      }

      const { data, error } = await supabase
        .from('projects')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) return sendError(res, 500, error.message, 'DB_ERROR');
      if (!data) return sendError(res, 404, 'Project not found.', 'NOT_FOUND');

      logRequest(req, 200, `updated project: ${id}`);
      return sendSuccess(res, { project: data });
    } catch (err) {
      console.error('[projects PUT] Unexpected error:', err);
      return sendError(res, 500, 'Internal Server Error', 'INTERNAL_ERROR');
    }
  }

  // ══ DELETE: Remove project ════════════════════════════════
  if (req.method === 'DELETE') {
    try {
      const { id } = req.body || {};
      if (!id) return sendError(res, 400, 'Project ID is required.', 'MISSING_ID');

      const { data, error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)
        .select('id')
        .single();

      if (error) return sendError(res, 500, error.message, 'DB_ERROR');
      if (!data) return sendError(res, 404, 'Project not found.', 'NOT_FOUND');

      logRequest(req, 200, `deleted project: ${id}`);
      return sendSuccess(res, { message: 'Project deleted successfully.', id: data.id });
    } catch (err) {
      console.error('[projects DELETE] Unexpected error:', err);
      return sendError(res, 500, 'Internal Server Error', 'INTERNAL_ERROR');
    }
  }

  return sendError(res, 405, 'Method Not Allowed. Use GET, POST, PUT, or DELETE.', 'METHOD_NOT_ALLOWED');
};
