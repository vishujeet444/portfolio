-- ============================================================
-- TABLE: models — Interactive 3D Lab
-- Run in Supabase SQL Editor after main schema.sql
-- ============================================================

CREATE TABLE IF NOT EXISTS public.models (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       TEXT NOT NULL CHECK (char_length(title) <= 200),
  slug        TEXT NOT NULL UNIQUE CHECK (char_length(slug) <= 220),
  thumbnail   TEXT,
  model_url   TEXT NOT NULL,
  description TEXT DEFAULT '' CHECK (char_length(description) <= 5000),
  software    TEXT DEFAULT '' CHECK (char_length(software) <= 200),
  polycount   INTEGER DEFAULT 0,
  category    TEXT NOT NULL DEFAULT 'Abstract' CHECK (category IN ('Abstract', 'Archviz', 'Product', 'Character', 'Environment', 'Other')),
  tags        TEXT[] DEFAULT '{}',
  featured    BOOLEAN NOT NULL DEFAULT FALSE,
  visibility  BOOLEAN NOT NULL DEFAULT TRUE,
  file_format TEXT DEFAULT 'glb',
  file_size   BIGINT DEFAULT 0,
  materials   JSONB DEFAULT '[]'::jsonb,
  views       INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_models_slug ON public.models (slug);
CREATE INDEX IF NOT EXISTS idx_models_featured ON public.models (featured) WHERE featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_models_visibility ON public.models (visibility, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_models_category ON public.models (category);

DROP TRIGGER IF EXISTS trg_models_updated_at ON public.models;
CREATE TRIGGER trg_models_updated_at
  BEFORE UPDATE ON public.models
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE public.models ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read visible models" ON public.models;
CREATE POLICY "Allow public read visible models"
  ON public.models FOR SELECT
  TO anon, authenticated
  USING (visibility = TRUE);

DROP POLICY IF EXISTS "Allow admin all models" ON public.models;
CREATE POLICY "Allow admin all models"
  ON public.models FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Storage folder: portfolio-assets/models/
