/**
 * ============================================================
 * VISHWAJEET KUMAR PORTFOLIO — Supabase Client
 * api/db.js
 * ============================================================
 */

'use strict';

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// ─── Guard: Fail loudly with actionable message ───────────────
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  const missing = [];
  if (!SUPABASE_URL) missing.push('SUPABASE_URL');
  if (!SUPABASE_SERVICE_ROLE_KEY) missing.push('SUPABASE_SERVICE_ROLE_KEY');

  console.error(
    `\n❌ MISSING ENV VARS: ${missing.join(', ')}\n` +
    `Set them in: Vercel Dashboard → Project → Settings → Environment Variables\n` +
    `Or locally in: .env.local (for vercel dev)\n`
  );

  // Don't crash the module — let individual routes return 503
}

// ─── Supabase Client (Service Role — server side only) ────────
const supabase = SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    })
  : null;

// ─── Health Check ─────────────────────────────────────────────
async function ping() {
  if (!supabase) return { ok: false, reason: 'env_vars_missing' };
  try {
    const { error } = await supabase.from('messages').select('id').limit(1);
    if (error) return { ok: false, reason: error.message };
    return { ok: true };
  } catch (e) {
    return { ok: false, reason: e.message };
  }
}

// ─── Guard for routes ────────────────────────────────────────
function assertDb(res) {
  if (!supabase) {
    res.status(503).json({
      error: 'Service Unavailable',
      code: 'DB_NOT_CONFIGURED',
      hint: 'SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables are not set.',
    });
    return false;
  }
  return true;
}

module.exports = { supabase, ping, assertDb };
