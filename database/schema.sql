-- ============================================================
-- VISHWAJEET KUMAR PORTFOLIO — Supabase Schema
-- ============================================================
-- Run this entire file once in:
--   Supabase Dashboard → SQL Editor → New Query → Paste → Run
-- ============================================================


-- ─── EXTENSION ───────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- ─── TABLE: messages ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.messages (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL CHECK (char_length(name) <= 100),
  email       TEXT NOT NULL CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  message     TEXT NOT NULL CHECK (char_length(message) <= 2000),
  is_read     BOOLEAN NOT NULL DEFAULT FALSE,
  ip_address  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for sorting by date
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages (created_at DESC);
-- Index for filtering unread
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON public.messages (is_read);


-- ─── TABLE: projects ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.projects (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title         TEXT NOT NULL CHECK (char_length(title) <= 150),
  description   TEXT NOT NULL CHECK (char_length(description) <= 3000),
  category      TEXT NOT NULL CHECK (category IN ('3D', 'Motion', 'Branding', 'UI/UX', 'Other')),
  beauty_image  TEXT NOT NULL,
  wire_image    TEXT,
  clay_image    TEXT,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for public gallery fetch
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects (category);
CREATE INDEX IF NOT EXISTS idx_projects_sort ON public.projects (sort_order ASC, created_at DESC);

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_projects_updated_at ON public.projects;
CREATE TRIGGER trg_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ─── TABLE: experience ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.experience (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role        TEXT NOT NULL CHECK (char_length(role) <= 150),
  company     TEXT NOT NULL CHECK (char_length(company) <= 150),
  duration    TEXT NOT NULL CHECK (char_length(duration) <= 100),
  description TEXT NOT NULL CHECK (char_length(description) <= 2000),
  type        TEXT NOT NULL CHECK (type IN ('work', 'education')),
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_experience_sort ON public.experience (sort_order ASC, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_experience_type ON public.experience (type);


-- ─── ROW LEVEL SECURITY ──────────────────────────────────────

-- Messages: Public INSERT (contact form), Admin-only READ/DELETE
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert" ON public.messages;
CREATE POLICY "Allow public insert"
  ON public.messages FOR INSERT
  TO anon
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin select" ON public.messages;
CREATE POLICY "Allow admin select"
  ON public.messages FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Allow admin delete" ON public.messages;
CREATE POLICY "Allow admin delete"
  ON public.messages FOR DELETE
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Allow admin update" ON public.messages;
CREATE POLICY "Allow admin update"
  ON public.messages FOR UPDATE
  TO authenticated
  USING (true);

-- Projects: Public READ, Admin-only WRITE
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read projects" ON public.projects;
CREATE POLICY "Allow public read projects"
  ON public.projects FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Allow admin write projects" ON public.projects;
CREATE POLICY "Allow admin write projects"
  ON public.projects FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Experience: Public READ, Admin-only WRITE
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read experience" ON public.experience;
CREATE POLICY "Allow public read experience"
  ON public.experience FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Allow admin write experience" ON public.experience;
CREATE POLICY "Allow admin write experience"
  ON public.experience FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);


-- ─── STORAGE BUCKET ──────────────────────────────────────────
-- Run this separately if the bucket doesn't exist yet:
-- Supabase Dashboard → Storage → New Bucket → Name: portfolio-assets → Public: YES

INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-assets', 'portfolio-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Allow admin to upload files
DROP POLICY IF EXISTS "Allow admin uploads" ON storage.objects;
CREATE POLICY "Allow admin uploads"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'portfolio-assets');

-- Allow public to read files
DROP POLICY IF EXISTS "Allow public reads" ON storage.objects;
CREATE POLICY "Allow public reads"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'portfolio-assets');

-- Allow admin to delete files
DROP POLICY IF EXISTS "Allow admin deletes" ON storage.objects;
CREATE POLICY "Allow admin deletes"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'portfolio-assets');


-- ─── DONE ────────────────────────────────────────────────────
-- After running this, go to Authentication → Users → Add user
-- to create your admin login (email + password).
