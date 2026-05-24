/**
 * ============================================================
 * GET /api/stats — Admin: Dashboard Statistics
 * ============================================================
 * Returns counts of messages, projects, experience entries,
 * plus unread message count and last message timestamp.
 * Requires admin auth.
 * ============================================================
 */

'use strict';

const { supabase, assertDb } = require('./db');
const {
  setCors, handlePreflight, requireAuth,
  logRequest, sendError,
} = require('./_middleware');

module.exports = async (req, res) => {
  setCors(req, res);
  if (handlePreflight(req, res)) return;

  if (!assertDb(res)) return;

  if (req.method !== 'GET') {
    return sendError(res, 405, 'Method Not Allowed. Use GET.', 'METHOD_NOT_ALLOWED');
  }

  // Admin only
  const user = await requireAuth(req, res);
  if (!user) return;

  try {
    // Run all 4 queries in parallel for speed
    const [
      messagesResult,
      unreadResult,
      projectsResult,
      experienceResult,
      lastMessageResult,
    ] = await Promise.all([
      supabase.from('messages').select('*', { count: 'exact', head: true }),
      supabase.from('messages').select('*', { count: 'exact', head: true }).eq('is_read', false),
      supabase.from('projects').select('*', { count: 'exact', head: true }),
      supabase.from('experience').select('*', { count: 'exact', head: true }),
      supabase.from('messages').select('created_at').order('created_at', { ascending: false }).limit(1).single(),
    ]);

    // Surface any errors
    const errors = [messagesResult, unreadResult, projectsResult, experienceResult]
      .filter(r => r.error)
      .map(r => r.error.message);

    if (errors.length > 0) {
      console.error('[stats GET] Supabase errors:', errors);
      return sendError(res, 500, errors[0], 'DB_ERROR');
    }

    logRequest(req, 200, 'stats fetched');

    return res.status(200).json({
      success: true,
      stats: {
        messages: {
          total:  messagesResult.count  ?? 0,
          unread: unreadResult.count    ?? 0,
          last_received: lastMessageResult.data?.created_at || null,
        },
        projects: {
          total: projectsResult.count ?? 0,
        },
        experience: {
          total: experienceResult.count ?? 0,
        },
      },
      generated_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[stats GET] Unexpected error:', err);
    return sendError(res, 500, 'Internal Server Error', 'INTERNAL_ERROR');
  }
};
