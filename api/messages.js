/**
 * ============================================================
 * GET|PATCH|DELETE /api/messages — Admin: Message Management
 * ============================================================
 * • GET    → List messages (paginated, filterable)
 * • PATCH  → Mark message as read
 * • DELETE → Delete a message
 * All methods require admin auth.
 * ============================================================
 */

'use strict';

const { supabase, assertDb } = require('./db');
const {
  setCors, handlePreflight, requireAuth,
  logRequest, sendError, sendSuccess,
} = require('./_middleware');

module.exports = async (req, res) => {
  setCors(req, res);
  if (handlePreflight(req, res)) return;

  if (!assertDb(res)) return;

  // ── All methods require authentication ────────────────────
  const user = await requireAuth(req, res);
  if (!user) return; // requireAuth already sent 401

  // ══ GET: List messages ════════════════════════════════════
  if (req.method === 'GET') {
    try {
      const { page = '1', limit = '20', unread } = req.query || {};

      const pageNum  = Math.max(1, parseInt(page) || 1);
      const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 20));
      const offset   = (pageNum - 1) * limitNum;

      let query = supabase
        .from('messages')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limitNum - 1);

      // Filter unread only
      if (unread === 'true') {
        query = query.eq('is_read', false);
      }

      const { data, error, count } = await query;

      if (error) {
        console.error('[messages GET] Supabase error:', error.message);
        return sendError(res, 500, error.message, 'DB_ERROR');
      }

      logRequest(req, 200, `returned ${data.length}/${count} messages`);
      return res.status(200).json({
        data,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: count,
          pages: Math.ceil(count / limitNum),
        },
      });
    } catch (err) {
      console.error('[messages GET] Unexpected error:', err);
      return sendError(res, 500, 'Internal Server Error', 'INTERNAL_ERROR');
    }
  }

  // ══ PATCH: Mark as read ═══════════════════════════════════
  if (req.method === 'PATCH') {
    try {
      const { id } = req.body || {};
      if (!id) return sendError(res, 400, 'Message ID is required.', 'MISSING_ID');

      const { data, error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', id)
        .select('id, is_read')
        .single();

      if (error) return sendError(res, 500, error.message, 'DB_ERROR');
      if (!data) return sendError(res, 404, 'Message not found.', 'NOT_FOUND');

      logRequest(req, 200, `message ${id} marked read`);
      return sendSuccess(res, { message: 'Marked as read.', id: data.id });
    } catch (err) {
      console.error('[messages PATCH] Unexpected error:', err);
      return sendError(res, 500, 'Internal Server Error', 'INTERNAL_ERROR');
    }
  }

  // ══ DELETE ═══════════════════════════════════════════════
  if (req.method === 'DELETE') {
    try {
      const { id } = req.body || {};
      if (!id) return sendError(res, 400, 'Message ID is required.', 'MISSING_ID');

      const { data, error } = await supabase
        .from('messages')
        .delete()
        .eq('id', id)
        .select('id')
        .single();

      if (error) return sendError(res, 500, error.message, 'DB_ERROR');
      if (!data) return sendError(res, 404, 'Message not found.', 'NOT_FOUND');

      logRequest(req, 200, `message ${id} deleted`);
      return sendSuccess(res, { message: 'Message deleted successfully.', id: data.id });
    } catch (err) {
      console.error('[messages DELETE] Unexpected error:', err);
      return sendError(res, 500, 'Internal Server Error', 'INTERNAL_ERROR');
    }
  }

  return sendError(res, 405, 'Method Not Allowed. Use GET, PATCH, or DELETE.', 'METHOD_NOT_ALLOWED');
};
