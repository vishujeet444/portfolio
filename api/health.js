/**
 * ============================================================
 * GET /api/health — Public Health Check
 * ============================================================
 * Use this to verify the deployment is alive and Supabase
 * is reachable.
 *
 * Response:
 *   200 { status: "ok", supabase: "connected", timestamp }
 *   503 { status: "degraded", supabase: "error: ...", timestamp }
 * ============================================================
 */

'use strict';

const { ping } = require('./db');
const { setCors, handlePreflight } = require('./_middleware');

module.exports = async (req, res) => {
  setCors(req, res);
  if (handlePreflight(req, res)) return;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const dbPing    = await ping();
  const timestamp = new Date().toISOString();
  const status    = dbPing.ok ? 'ok' : 'degraded';
  const httpCode  = dbPing.ok ? 200 : 503;

  return res.status(httpCode).json({
    status,
    supabase:  dbPing.ok ? 'connected' : `error: ${dbPing.reason}`,
    timestamp,
    version:   process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || 'local',
    region:    process.env.VERCEL_REGION || 'unknown',
  });
};
