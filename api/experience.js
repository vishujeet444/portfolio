/**
 * ============================================================
 * GET|POST|PUT|DELETE /api/experience — Experience CRUD
 * ============================================================
 * • GET    → Public. Supports ?type=work|education and ?sort=
 * • POST   → Admin only. Add milestone.
 * • PUT    → Admin only. Update milestone.
 * • DELETE → Admin only. Delete milestone.
 * ============================================================
 */

'use strict';

const { supabase, assertDb } = require('./db');
const {
  setCors, handlePreflight, requireAuth,
  validate, sanitize,
  logRequest, sendError, sendSuccess,
} = require('./_middleware');

const VALID_TYPES = ['work', 'education'];

module.exports = async (req, res) => {
  setCors(req, res);
  if (handlePreflight(req, res)) return;

  if (!assertDb(res)) return;

  // ══ GET: Public — list experience ═════════════════════════
  if (req.method === 'GET') {
    try {
      const { type, sort = 'asc' } = req.query || {};

      let query = supabase
        .from('experience')
        .select('*');

      // Optional type filter
      if (type && VALID_TYPES.includes(type)) {
        query = query.eq('type', type);
      }

      // Sort direction
      const ascending = sort !== 'desc';
      query = query
        .order('sort_order', { ascending })
        .order('created_at', { ascending });

      const { data, error } = await query;

      if (error) {
        console.error('[experience GET] Supabase error:', error.message);
        return sendError(res, 500, error.message, 'DB_ERROR');
      }

      logRequest(req, 200, `returned ${data.length} experience items`);
      return res.status(200).json(data);
    } catch (err) {
      console.error('[experience GET] Unexpected error:', err);
      return sendError(res, 500, 'Internal Server Error', 'INTERNAL_ERROR');
    }
  }

  // ── All write methods require authentication ───────────────
  const user = await requireAuth(req, res);
  if (!user) return;

  // ══ POST: Create milestone ════════════════════════════════
  if (req.method === 'POST') {
    try {
      const body = req.body || {};

      const validationError = validate(
        {
          role:        'string',
          company:     'string',
          duration:    'string',
          description: 'string',
          type:        `enum:${VALID_TYPES.join(',')}`,
        },
        body
      );
      if (validationError) return sendError(res, 400, validationError, 'VALIDATION_ERROR');

      const payload = {
        role:        sanitize(body.role,        150),
        company:     sanitize(body.company,     150),
        duration:    sanitize(body.duration,    100),
        description: sanitize(body.description, 2000),
        type:        body.type,
        sort_order:  Number.isInteger(body.sort_order) ? body.sort_order : 0,
      };

      if (payload.role.length < 2)    return sendError(res, 400, 'Role must be at least 2 characters.');
      if (payload.company.length < 2) return sendError(res, 400, 'Company must be at least 2 characters.');

      const { data, error } = await supabase
        .from('experience')
        .insert([payload])
        .select()
        .single();

      if (error) {
        console.error('[experience POST] Supabase error:', error.message);
        return sendError(res, 500, error.message, 'DB_ERROR');
      }

      logRequest(req, 201, `created milestone: ${data.id}`);
      return sendSuccess(res, { experience: data }, 201);
    } catch (err) {
      console.error('[experience POST] Unexpected error:', err);
      return sendError(res, 500, 'Internal Server Error', 'INTERNAL_ERROR');
    }
  }

  // ══ PUT: Update milestone ═════════════════════════════════
  if (req.method === 'PUT') {
    try {
      const body = req.body || {};
      const { id } = body;
      if (!id) return sendError(res, 400, 'Milestone ID is required.', 'MISSING_ID');

      const updateData = {};
      if (body.role        !== undefined) updateData.role        = sanitize(body.role, 150);
      if (body.company     !== undefined) updateData.company     = sanitize(body.company, 150);
      if (body.duration    !== undefined) updateData.duration    = sanitize(body.duration, 100);
      if (body.description !== undefined) updateData.description = sanitize(body.description, 2000);
      if (body.sort_order  !== undefined) updateData.sort_order  = parseInt(body.sort_order) || 0;

      if (body.type !== undefined) {
        if (!VALID_TYPES.includes(body.type)) {
          return sendError(res, 400, `Type must be one of: ${VALID_TYPES.join(', ')}.`, 'VALIDATION_ERROR');
        }
        updateData.type = body.type;
      }

      if (Object.keys(updateData).length === 0) {
        return sendError(res, 400, 'No fields to update.', 'EMPTY_UPDATE');
      }

      const { data, error } = await supabase
        .from('experience')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) return sendError(res, 500, error.message, 'DB_ERROR');
      if (!data) return sendError(res, 404, 'Milestone not found.', 'NOT_FOUND');

      logRequest(req, 200, `updated milestone: ${id}`);
      return sendSuccess(res, { experience: data });
    } catch (err) {
      console.error('[experience PUT] Unexpected error:', err);
      return sendError(res, 500, 'Internal Server Error', 'INTERNAL_ERROR');
    }
  }

  // ══ DELETE: Remove milestone ══════════════════════════════
  if (req.method === 'DELETE') {
    try {
      const { id } = req.body || {};
      if (!id) return sendError(res, 400, 'Milestone ID is required.', 'MISSING_ID');

      const { data, error } = await supabase
        .from('experience')
        .delete()
        .eq('id', id)
        .select('id')
        .single();

      if (error) return sendError(res, 500, error.message, 'DB_ERROR');
      if (!data) return sendError(res, 404, 'Milestone not found.', 'NOT_FOUND');

      logRequest(req, 200, `deleted milestone: ${id}`);
      return sendSuccess(res, { message: 'Milestone deleted successfully.', id: data.id });
    } catch (err) {
      console.error('[experience DELETE] Unexpected error:', err);
      return sendError(res, 500, 'Internal Server Error', 'INTERNAL_ERROR');
    }
  }

  return sendError(res, 405, 'Method Not Allowed. Use GET, POST, PUT, or DELETE.', 'METHOD_NOT_ALLOWED');
};
