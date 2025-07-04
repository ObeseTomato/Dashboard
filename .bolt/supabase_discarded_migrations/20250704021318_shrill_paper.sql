/*
  # Create blog posts table

  1. New Tables
    - `blog_posts`
      - `id` (uuid, primary key)
      - `title` (text)
      - `content` (text)
      - `excerpt` (text)
      - `status` (text) - draft, published, archived
      - `author` (text)
      - `category` (text)
      - `tags` (text[])
      - `featured_image` (text)
      - `seo_title` (text)
      - `seo_description` (text)
      - `slug` (text, unique)
      - `published_at` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `blog_posts` table
    - Add policy for authenticated users to manage posts
*/

CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  excerpt text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  author text DEFAULT 'Dr. Sala & Associates',
  category text,
  tags text[] DEFAULT '{}',
  featured_image text,
  seo_title text,
  seo_description text,
  slug text UNIQUE NOT NULL,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage blog posts"
  ON blog_posts
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert sample data
INSERT INTO blog_posts (title, content, excerpt, status, category, tags, slug, published_at) VALUES
('Managing Holiday Anxiety: A Psychologist''s Guide', 'The holiday season, while joyful for many, can trigger significant anxiety and stress...', 'Learn effective strategies for managing holiday anxiety and maintaining mental wellness during the holiday season.', 'published', 'Mental Health', ARRAY['anxiety', 'holidays', 'coping strategies'], 'managing-holiday-anxiety', now() - interval '2 days'),
('Understanding EMDR Therapy', 'Eye Movement Desensitization and Reprocessing (EMDR) is a psychotherapy approach...', 'Discover how EMDR therapy can help process traumatic memories and reduce emotional distress.', 'published', 'Therapy Techniques', ARRAY['EMDR', 'trauma', 'therapy'], 'understanding-emdr-therapy', now() - interval '1 week'),
('Building Healthy Relationships', 'Healthy relationships are fundamental to our mental and emotional well-being...', 'Tips and strategies for building and maintaining healthy relationships in your personal and professional life.', 'draft', 'Relationships', ARRAY['relationships', 'communication', 'mental health'], 'building-healthy-relationships', null);