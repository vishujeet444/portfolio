/**
 * ============================================================
 * VISHWAJEET KUMAR PORTFOLIO — Shared API Middleware
 * api/_middleware.js
 * ============================================================
 * Single source of truth for: CORS, Auth, Validation,
 * Sanitization, Rate Limiting, and Logging.
 * ============================================================
 */

'use strict';

// ─── CORS ────────────────────────────────────────────────────
const ALLOWED_ORIGINS = [
  'https://vishwajeetkumar.vercel.app',
  'https://www.vishwajeetkumar.vercel.app',
  // Add your custom domain here if you have one
];

function setCors(req, res) {
  const origin = req.headers.origin;

  // Allow in dev (vercel dev) or if origin matches whitelist
  if (!origin || ALLOWED_ORIGINS.includes(origin) || process.env.NODE_ENV !== 'production') {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  } else {
    res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGINS[0]);
  }

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Authorization, Content-Type, X-Requested-With, Accept'
  );

  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
}

// ─── PREFLIGHT HANDLER ───────────────────────────────────────
function handlePreflight(req, res) {
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true;
  }
  return false;
}

// ─── LOGGING ─────────────────────────────────────────────────
function logRequest(req, status, extra = '') {
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 'unknown';
  const ts = new Date().toISOString();
  console.log(`[${ts}] ${req.method} ${req.url} — ${status} | IP: ${ip}${extra ? ' | ' + extra : ''}`);
}

// ─── AUTH ─────────────────────────────────────────────────────
// Import lazily to avoid circular deps — db.js imports nothing from here
let _supabase = null;
function getSupabase() {
  if (!_supabase) {
    _supabase = require('./db').supabase;
  }
  return _supabase;
}

async function requireAuth(req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized', code: 'NO_TOKEN' });
    return null;
  }

  const token = authHeader.split(' ')[1];

  try {
    const { data: { user }, error } = await getSupabase().auth.getUser(token);
    if (error || !user) {
      res.status(401).json({ error: 'Unauthorized', code: 'INVALID_TOKEN' });
      return null;
    }
    return user;
  } catch (e) {
    console.error('[requireAuth] Error:', e.message);
    res.status(401).json({ error: 'Unauthorized', code: 'AUTH_ERROR' });
    return null;
  }
}

// ─── VALIDATION ──────────────────────────────────────────────
/**
 * validate({ fieldName: 'string'|'email'|'enum:a,b' }, body)
 * Returns null on success, or an error string.
 */
function validate(schema, body) {
  for (const [field, rule] of Object.entries(schema)) {
    const value = body[field];

    if (value === undefined || value === null || value === '') {
      return `Field "${field}" is required.`;
    }

    if (rule === 'email') {
      const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRx.test(String(value))) {
        return `Field "${field}" must be a valid email address.`;
      }
    }

    if (rule.startsWith('enum:')) {
      const allowed = rule.slice(5).split(',');
      if (!allowed.includes(String(value))) {
        return `Field "${field}" must be one of: ${allowed.join(', ')}.`;
      }
    }

    if (rule.startsWith('maxlen:')) {
      const max = parseInt(rule.slice(7));
      if (String(value).length > max) {
        return `Field "${field}" must not exceed ${max} characters.`;
      }
    }
  }
  return null; // all good
}

// ─── SANITIZATION ────────────────────────────────────────────
function sanitize(str, maxLen = 2000) {
  if (typeof str !== 'string') return '';
  return str
    .trim()
    .slice(0, maxLen)
    // Strip potential HTML/script injection
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
}

// ─── RATE LIMITER ────────────────────────────────────────────
// In-memory store: { ip: [timestamp, ...] }
// Works per serverless function instance (good enough for Vercel)
const rateLimitStore = new Map();

/**
 * rateLimit(req, maxRequests, windowMs)
 * Returns true if request is allowed, false if rate-limited.
 */
function rateLimit(req, maxRequests = 5, windowMs = 10 * 60 * 1000) {
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 'unknown';
  const now = Date.now();

  if (!rateLimitStore.has(ip)) {
    rateLimitStore.set(ip, []);
  }

  // Clean up old timestamps outside the window
  const timestamps = rateLimitStore.get(ip).filter(ts => now - ts < windowMs);
  timestamps.push(now);
  rateLimitStore.set(ip, timestamps);

  return timestamps.length <= maxRequests;
}

// ─── RESPONSE HELPERS ────────────────────────────────────────
function sendError(res, status, message, code = null) {
  const body = { error: message };
  if (code) body.code = code;
  return res.status(status).json(body);
}

function sendSuccess(res, data, status = 200) {
  return res.status(status).json({ success: true, ...data });
}

// ─── EXPORTS ─────────────────────────────────────────────────
module.exports = {
  setCors,
  handlePreflight,
  requireAuth,
  validate,
  sanitize,
  rateLimit,
  logRequest,
  sendError,
  sendSuccess,
};
