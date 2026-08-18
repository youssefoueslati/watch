/*
# Create watches and watch_submissions tables (single-tenant, no auth)

1. New Tables
- `watches` — the catalog of curated/restored timepieces shown to visitors.
  - id (uuid, primary key)
  - brand (text, not null) — e.g. "Seiko", "Longines"
  - model (text, not null) — model name
  - reference (text) — reference / part number
  - caliber (text) — movement caliber identifier
  - movement_type (text) — "Automatic" | "Manual Wind" | "Quartz" | "Solar"
  - era (text) — e.g. "1970s", "1980s"
  - year (int) — approximate year of manufacture
  - case_size_mm (numeric) — case diameter in millimeters
  - lug_width_mm (numeric) — lug width in millimeters
  - price (numeric) — asking price in USD
  - condition_rating (numeric) — 0–10 scale, e.g. 8.5
  - status (text) — "Available" | "Reserved" | "Sold"
  - category (text) — "Automatic" | "Chronograph" | "Dress" | "Quartz" | "Bangle"
  - primary_image (text) — URL of the primary photo
  - gallery (jsonb) — array of photo URLs for the detail carousel
  - service_history (text) — notes on recent service / restoration
  - authenticity_notes (text) — notes on crystal, case polishing, originality
  - timekeeping_accuracy (text) — e.g. "+3 sec/day"
  - description (text) — short marketing description
  - created_at (timestamptz)

- `watch_submissions` — leads from the "Sell / Trade Your Watch" form.
  - id (uuid, primary key)
  - brand (text, not null)
  - model (text, not null)
  - asking_price (numeric)
  - photo_urls (text) — comma-separated or single photo URL supplied by visitor
  - contact_name (text)
  - contact_email (text)
  - notes (text)
  - status (text) — "new" | "reviewed" | "accepted" | "declined"
  - created_at (timestamptz)

2. Security
- Enable RLS on both tables.
- `watches` is intentionally public catalog data: anon + authenticated may SELECT.
  Only authenticated staff may INSERT / UPDATE / DELETE (so visitors cannot mutate inventory).
- `watch_submissions` accepts INSERTs from anon (the lead form) but only authenticated
  staff may SELECT / UPDATE / DELETE submissions (visitor privacy + spam control).
*/

CREATE TABLE IF NOT EXISTS watches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand text NOT NULL,
  model text NOT NULL,
  reference text,
  caliber text,
  movement_type text,
  era text,
  year int,
  case_size_mm numeric,
  lug_width_mm numeric,
  price numeric NOT NULL DEFAULT 0,
  condition_rating numeric,
  status text NOT NULL DEFAULT 'Available',
  category text,
  primary_image text,
  gallery jsonb DEFAULT '[]'::jsonb,
  service_history text,
  authenticity_notes text,
  timekeeping_accuracy text,
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE watches ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_watches" ON watches;
CREATE POLICY "anon_read_watches" ON watches FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_watches" ON watches;
CREATE POLICY "auth_insert_watches" ON watches FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_watches" ON watches;
CREATE POLICY "auth_update_watches" ON watches FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_watches" ON watches;
CREATE POLICY "auth_delete_watches" ON watches FOR DELETE
  TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS watch_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand text NOT NULL,
  model text NOT NULL,
  asking_price numeric,
  photo_urls text,
  contact_name text,
  contact_email text,
  notes text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE watch_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_submissions" ON watch_submissions;
CREATE POLICY "anon_insert_submissions" ON watch_submissions FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_read_submissions" ON watch_submissions;
CREATE POLICY "auth_read_submissions" ON watch_submissions FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_update_submissions" ON watch_submissions;
CREATE POLICY "auth_update_submissions" ON watch_submissions FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_submissions" ON watch_submissions;
CREATE POLICY "auth_delete_submissions" ON watch_submissions FOR DELETE
  TO authenticated USING (true);
