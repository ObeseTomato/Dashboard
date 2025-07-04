/*
  # Create web pages table

  1. New Tables
    - `web_pages`
      - `id` (uuid, primary key)
      - `url` (text, unique)
      - `title` (text)
      - `status` (text) - live, draft, error
      - `last_modified` (timestamp)
      - `page_views` (integer)
      - `avg_time_on_page` (text)
      - `bounce_rate` (numeric)
      - `seo_score` (integer)
      - `load_time` (numeric)
      - `word_count` (integer)
      - `images` (integer)
      - `links` (integer)
      - `meta_description` (text)
      - `keywords` (text[])
      - `issues` (text[])
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `web_pages` table
    - Add policy for authenticated users to manage pages
*/

CREATE TABLE IF NOT EXISTS web_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text UNIQUE NOT NULL,
  title text NOT NULL,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('live', 'draft', 'error')),
  last_modified timestamptz DEFAULT now(),
  page_views integer DEFAULT 0,
  avg_time_on_page text DEFAULT '0:00',
  bounce_rate numeric DEFAULT 0,
  seo_score integer DEFAULT 0 CHECK (seo_score >= 0 AND seo_score <= 100),
  load_time numeric DEFAULT 0,
  word_count integer DEFAULT 0,
  images integer DEFAULT 0,
  links integer DEFAULT 0,
  meta_description text,
  keywords text[] DEFAULT '{}',
  issues text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE web_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage web pages"
  ON web_pages
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert sample data
INSERT INTO web_pages (url, title, status, page_views, avg_time_on_page, bounce_rate, seo_score, load_time, word_count, images, links, meta_description, keywords, issues) VALUES
('/', 'Home - Dr. Sala & Associates', 'live', 3456, '2:34', 32, 92, 1.2, 847, 8, 23, 'Professional psychology and therapy services in Miami, FL. Dr. Sala & Associates offers comprehensive mental health care.', ARRAY['psychology', 'therapy', 'mental health', 'Miami', 'counseling'], ARRAY[]::text[]),
('/services', 'Our Services - Psychology & Therapy', 'live', 1892, '3:12', 28, 88, 1.8, 1234, 12, 34, 'Comprehensive psychology services including individual therapy, couples counseling, and EMDR therapy.', ARRAY['therapy services', 'EMDR', 'couples counseling', 'individual therapy'], ARRAY['Missing alt text on 2 images']),
('/about', 'About Dr. Sala - Licensed Psychologist', 'live', 987, '2:45', 35, 85, 1.5, 692, 5, 18, 'Learn about Dr. Sala''s background, education, and approach to psychology and therapy.', ARRAY['Dr. Sala', 'psychologist', 'credentials', 'experience'], ARRAY['Meta description too short']),
('/contact', 'Contact Us - Schedule Appointment', 'live', 2134, '1:56', 45, 78, 2.1, 345, 3, 12, 'Contact Dr. Sala & Associates to schedule your appointment. Call (305) 555-0123 or use our online form.', ARRAY['contact', 'appointment', 'schedule', 'phone'], ARRAY['Slow loading time', 'Low word count']),
('/blog', 'Mental Health Blog & Resources', 'live', 1567, '4:23', 22, 94, 1.3, 2156, 15, 45, 'Expert insights on mental health, therapy techniques, and wellness tips from Dr. Sala & Associates.', ARRAY['mental health blog', 'therapy tips', 'wellness', 'psychology articles'], ARRAY[]::text[]),
('/insurance', 'Insurance & Payment Options', 'draft', 0, '0:00', 0, 65, 0, 234, 1, 8, '', ARRAY['insurance', 'payment', 'coverage'], ARRAY['Missing meta description', 'Page not published', 'Low word count']);