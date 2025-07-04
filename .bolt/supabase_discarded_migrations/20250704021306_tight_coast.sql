/*
  # Create digital assets table

  1. New Tables
    - `digital_assets`
      - `id` (uuid, primary key)
      - `name` (text)
      - `type` (text) - gmb, website, social_media, directory, review_platform, advertising
      - `status` (text) - active, warning, critical, inactive
      - `priority` (text) - high, medium, low
      - `last_updated` (timestamp)
      - `url` (text)
      - `metrics` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `digital_assets` table
    - Add policy for authenticated users to manage assets
*/

CREATE TABLE IF NOT EXISTS digital_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('gmb', 'website', 'social_media', 'directory', 'review_platform', 'advertising')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'warning', 'critical', 'inactive')),
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  last_updated timestamptz DEFAULT now(),
  url text,
  metrics jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE digital_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage digital assets"
  ON digital_assets
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert sample data
INSERT INTO digital_assets (name, type, status, priority, url, metrics) VALUES
('Google Business Profile', 'gmb', 'active', 'high', 'https://g.page/dr-sala-associates', '{"views": 2847, "clicks": 342, "calls": 28}'),
('Main Website', 'website', 'active', 'high', 'https://drsalaassociates.com', '{"sessions": 1234, "users": 987, "pageviews": 3456}'),
('Facebook Business Page', 'social_media', 'warning', 'medium', 'https://facebook.com/drsalaassociates', '{"followers": 2145, "engagement": 156}'),
('Instagram Profile', 'social_media', 'critical', 'high', 'https://instagram.com/drsalaassociates', '{"followers": 892, "posts": 45}'),
('Psychology Today Profile', 'directory', 'active', 'high', 'https://psychologytoday.com/dr-sala', '{}'),
('Google Ads Campaign', 'advertising', 'active', 'medium', null, '{"impressions": 15420, "clicks": 234, "cost": 567.89}');