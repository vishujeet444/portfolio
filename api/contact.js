/**
 * ============================================================
 * POST /api/contact — Public Contact Form
 * ============================================================
 * • Rate limited: 3 submissions per IP per 10 minutes
 * • Input validated + sanitized
 * • Honeypot bot detection
 * • Saves IP address for spam tracking
 * ============================================================
 */

'use strict';

const { supabase, assertDb } = require('./db');
const {
  setCors, handlePreflight,
  validate, sanitize, rateLimit,
  logRequest, sendError, sendSuccess,
} = require('./_middleware');

module.exports = async (req, res) => {
  setCors(req, res);
  if (handlePreflight(req, res)) return;

  if (!assertDb(res)) return;

  if (req.method !== 'POST') {
    return sendError(res, 405, 'Method Not Allowed. Use POST.', 'METHOD_NOT_ALLOWED');
  }

  // ── Rate Limiting: 3 per 10 minutes per IP ───────────────
  if (!rateLimit(req, 3, 10 * 60 * 1000)) {
    logRequest(req, 429, 'rate limited');
    return sendError(
      res, 429,
      'Too many submissions. Please wait 10 minutes before trying again.',
      'RATE_LIMITED'
    );
  }

  const body = req.body || {};

  // ── Honeypot: bots fill hidden fields, humans don't ──────
  if (body._hp && body._hp.trim() !== '') {
    // Silently accept — don't let bots know they were caught
    logRequest(req, 200, 'honeypot triggered');
    return sendSuccess(res, { message: 'Message sent successfully!' });
  }

  // ── Validate ──────────────────────────────────────────────
  const validationError = validate(
    {
      name:    'string',
      email:   'email',
      message: 'string',
    },
    body
  );

  if (validationError) {
    logRequest(req, 400, validationError);
    return sendError(res, 400, validationError, 'VALIDATION_ERROR');
  }

  // ── Sanitize ─────────────────────────────────────────────
  const name    = sanitize(body.name,    100);
  const email   = sanitize(body.email,   254);
  const message = sanitize(body.message, 2000);

  // Extra length checks after sanitization
  if (name.length < 2)    return sendError(res, 400, 'Name must be at least 2 characters.');
  if (message.length < 5) return sendError(res, 400, 'Message must be at least 5 characters.');

  // ── Save to Supabase ──────────────────────────────────────
  try {
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || null;

    const { data, error } = await supabase
      .from('messages')
      .insert([{ name, email, message, ip_address: ip }])
      .select('id, created_at')
      .single();

    if (error) {
      console.error('[contact] Supabase insert error:', error.message);
      return sendError(res, 500, 'Failed to save message. Please try again.', 'DB_ERROR');
    }

    logRequest(req, 201, `message saved: ${data.id}`);
    return sendSuccess(res, {
      message: 'Your message has been sent! I will get back to you soon. 🎬',
      id: data.id,
      timestamp: data.created_at,
    }, 201);

  } catch (err) {
    console.error('[contact] Unexpected error:', err);
    return sendError(res, 500, 'Internal Server Error', 'INTERNAL_ERROR');
  }
};
