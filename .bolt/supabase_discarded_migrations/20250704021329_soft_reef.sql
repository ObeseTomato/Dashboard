/*
  # Create social media posts table

  1. New Tables
    - `social_media_posts`
      - `id` (uuid, primary key)
      - `platform` (text) - instagram, facebook, twitter, linkedin
      - `content` (text)
      - `media_urls` (text[])
      - `hashtags` (text[])
      - `status` (text) - draft, scheduled, published, archived
      - `scheduled_for` (timestamp)
      - `published_at` (timestamp)
      - `engagement_metrics` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `social_media_posts` table
    - Add policy for authenticated users to manage posts
*/

CREATE TABLE IF NOT EXISTS social_media_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL CHECK (platform IN ('instagram', 'facebook', 'twitter', 'linkedin')),
  content text NOT NULL,
  media_urls text[] DEFAULT '{}',
  hashtags text[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'archived')),
  scheduled_for timestamptz,
  published_at timestamptz,
  engagement_metrics jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE social_media_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage social media posts"
  ON social_media_posts
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert sample data
INSERT INTO social_media_posts (platform, content, hashtags, status, published_at, engagement_metrics) VALUES
('instagram', '🧠 Mental Health Tip Tuesday: Taking 5 minutes for deep breathing can significantly reduce daily stress. Try the 4-7-8 technique: breathe in for 4, hold for 7, exhale for 8.', ARRAY['MentalHealth', 'StressRelief', 'DrSalaAssociates'], 'published', now() - interval '1 day', '{"likes": 45, "comments": 8, "shares": 3}'),
('facebook', 'The holiday season can bring unique stressors. Remember: it''s okay to set boundaries, take breaks, and prioritize your mental health. If you''re struggling, professional support is available.', ARRAY['MentalHealth', 'Holidays', 'SelfCare'], 'published', now() - interval '3 days', '{"likes": 67, "comments": 12, "shares": 8}'),
('instagram', 'Creating a safe space for healing is at the heart of what we do. Every session is designed to support your unique journey toward wellness. 💚', ARRAY['Therapy', 'SafeSpace', 'Healing'], 'scheduled', now() + interval '2 hours', '{}');