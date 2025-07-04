/*
  # Schema Updates for Database Consistency

  1. Updates
    - Ensure all tables have proper constraints and defaults
    - Add missing indexes for performance
    - Update column types for consistency
    - Ensure all tables have RLS enabled

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Enable pgvector extension for vector embeddings if not already enabled
CREATE EXTENSION IF NOT EXISTS vector;

-- Update documents table
DO $$
BEGIN
  -- Ensure embedding column is vector(1536)
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'documents' AND column_name = 'embedding'
  ) THEN
    -- Check if column is not already vector type
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'documents' AND column_name = 'embedding' AND data_type = 'USER-DEFINED' AND udt_name = 'vector'
    ) THEN
      -- Drop the existing column
      ALTER TABLE documents DROP COLUMN embedding;
      -- Add new vector column
      ALTER TABLE documents ADD COLUMN embedding vector(1536);
    END IF;
  ELSE
    -- Add embedding column if it doesn't exist
    ALTER TABLE documents ADD COLUMN embedding vector(1536);
  END IF;

  -- Ensure content is NOT NULL
  ALTER TABLE documents ALTER COLUMN content SET NOT NULL;
  
  -- Ensure created_at has default
  ALTER TABLE documents ALTER COLUMN created_at SET DEFAULT now();
END $$;

-- Update competitors table
DO $$
BEGIN
  -- Ensure name is NOT NULL
  ALTER TABLE competitors ALTER COLUMN name SET NOT NULL;
  
  -- Update distance_km to numeric type if it's not already
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'competitors' AND column_name = 'distance_km' AND data_type != 'numeric'
  ) THEN
    ALTER TABLE competitors ALTER COLUMN distance_km TYPE numeric USING distance_km::numeric;
  END IF;
  
  -- Update specialties to text array if it's not already
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'competitors' AND column_name = 'specialties' AND data_type != 'ARRAY'
  ) THEN
    ALTER TABLE competitors ALTER COLUMN specialties TYPE text[] USING 
      CASE 
        WHEN specialties IS NULL THEN NULL 
        WHEN specialties::text = '{}' THEN '{}'::text[]
        ELSE string_to_array(specialties::text, ',') 
      END;
  END IF;
  
  -- Update key_strengths to text array if it's not already
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'competitors' AND column_name = 'key_strengths' AND data_type != 'ARRAY'
  ) THEN
    ALTER TABLE competitors ALTER COLUMN key_strengths TYPE text[] USING 
      CASE 
        WHEN key_strengths IS NULL THEN NULL 
        WHEN key_strengths::text = '{}' THEN '{}'::text[]
        ELSE string_to_array(key_strengths::text, ',') 
      END;
  END IF;
  
  -- Ensure last_updated has default
  ALTER TABLE competitors ALTER COLUMN last_updated SET DEFAULT now();
END $$;

-- Update tasks table
DO $$
BEGIN
  -- Ensure task_name is NOT NULL
  ALTER TABLE tasks ALTER COLUMN task_name SET NOT NULL;
  
  -- Ensure description is NOT NULL
  ALTER TABLE tasks ALTER COLUMN description SET NOT NULL;
  
  -- Ensure due_date is NOT NULL
  ALTER TABLE tasks ALTER COLUMN due_date SET NOT NULL;
  
  -- Ensure created_at has default
  ALTER TABLE tasks ALTER COLUMN created_at SET DEFAULT now();
  
  -- Ensure updated_at has default
  ALTER TABLE tasks ALTER COLUMN updated_at SET DEFAULT now();
END $$;

-- Update digital_assets table
DO $$
BEGIN
  -- Ensure asset_name is NOT NULL
  ALTER TABLE digital_assets ALTER COLUMN asset_name SET NOT NULL;
  
  -- Ensure asset_type is NOT NULL
  ALTER TABLE digital_assets ALTER COLUMN asset_type SET NOT NULL;
  
  -- Ensure created_at has default
  ALTER TABLE digital_assets ALTER COLUMN created_at SET DEFAULT now();
  
  -- Ensure updated_at has default
  ALTER TABLE digital_assets ALTER COLUMN updated_at SET DEFAULT now();
END $$;

-- Update reviews table
DO $$
BEGIN
  -- Ensure source is NOT NULL
  ALTER TABLE reviews ALTER COLUMN source SET NOT NULL;
  
  -- Ensure review_id_external is NOT NULL
  ALTER TABLE reviews ALTER COLUMN review_id_external SET NOT NULL;
  
  -- Add UNIQUE constraint to review_id_external if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'reviews' AND constraint_name = 'reviews_review_id_external_key'
  ) THEN
    ALTER TABLE reviews ADD CONSTRAINT reviews_review_id_external_key UNIQUE (review_id_external);
  END IF;
  
  -- Ensure created_at has default
  ALTER TABLE reviews ALTER COLUMN created_at SET DEFAULT now();
  
  -- Ensure updated_at has default
  ALTER TABLE reviews ALTER COLUMN updated_at SET DEFAULT now();
END $$;

-- Update agent_outputs table
DO $$
BEGIN
  -- Ensure agent_name is NOT NULL
  ALTER TABLE agent_outputs ALTER COLUMN agent_name SET NOT NULL;
  
  -- Ensure status is NOT NULL
  ALTER TABLE agent_outputs ALTER COLUMN status SET NOT NULL;
  
  -- Ensure run_timestamp has default
  ALTER TABLE agent_outputs ALTER COLUMN run_timestamp SET DEFAULT now();
END $$;

-- Update web_pages table
DO $$
BEGIN
  -- Ensure url is NOT NULL
  ALTER TABLE web_pages ALTER COLUMN url SET NOT NULL;
  
  -- Ensure title is NOT NULL
  ALTER TABLE web_pages ALTER COLUMN title SET NOT NULL;
  
  -- Add UNIQUE constraint to url if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'web_pages' AND constraint_name = 'web_pages_url_key'
  ) THEN
    ALTER TABLE web_pages ADD CONSTRAINT web_pages_url_key UNIQUE (url);
  END IF;
  
  -- Ensure updated_at has default
  ALTER TABLE web_pages ALTER COLUMN updated_at SET DEFAULT now();
END $$;

-- Update kpi_time_series table
DO $$
BEGIN
  -- Ensure source is NOT NULL
  ALTER TABLE kpi_time_series ALTER COLUMN source SET NOT NULL;
  
  -- Ensure metric_name is NOT NULL
  ALTER TABLE kpi_time_series ALTER COLUMN metric_name SET NOT NULL;
  
  -- Ensure metric_value is NOT NULL
  ALTER TABLE kpi_time_series ALTER COLUMN metric_value SET NOT NULL;
  
  -- Ensure date is NOT NULL
  ALTER TABLE kpi_time_series ALTER COLUMN date SET NOT NULL;
  
  -- Ensure created_at has default
  ALTER TABLE kpi_time_series ALTER COLUMN created_at SET DEFAULT now();
END $$;

-- Create indexes for better performance if they don't exist
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents(created_at);
CREATE INDEX IF NOT EXISTS idx_documents_embedding ON documents USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX IF NOT EXISTS idx_competitors_name ON competitors(name);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_digital_assets_type ON digital_assets(asset_type);
CREATE INDEX IF NOT EXISTS idx_digital_assets_status ON digital_assets(status);
CREATE INDEX IF NOT EXISTS idx_reviews_source ON reviews(source);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_agent_outputs_agent_name ON agent_outputs(agent_name);
CREATE INDEX IF NOT EXISTS idx_agent_outputs_run_timestamp ON agent_outputs(run_timestamp);
CREATE INDEX IF NOT EXISTS idx_web_pages_status ON web_pages(status);
CREATE INDEX IF NOT EXISTS idx_kpi_time_series_metric_name ON kpi_time_series(metric_name);
CREATE INDEX IF NOT EXISTS idx_kpi_time_series_date ON kpi_time_series(date);

-- Enable RLS on all tables if not already enabled
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE digital_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_outputs ENABLE ROW LEVEL SECURITY;
ALTER TABLE web_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpi_time_series ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for all tables if they don't exist
DO $$
BEGIN
  -- Documents
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'documents' AND policyname = 'Users can manage documents') THEN
    CREATE POLICY "Users can manage documents"
      ON documents
      FOR ALL
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;

  -- Competitors
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'competitors' AND policyname = 'Users can manage competitors') THEN
    CREATE POLICY "Users can manage competitors"
      ON competitors
      FOR ALL
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;

  -- Tasks
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'tasks' AND policyname = 'Users can manage tasks') THEN
    CREATE POLICY "Users can manage tasks"
      ON tasks
      FOR ALL
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;

  -- Digital Assets
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'digital_assets' AND policyname = 'Users can manage digital assets') THEN
    CREATE POLICY "Users can manage digital assets"
      ON digital_assets
      FOR ALL
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;

  -- Reviews
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reviews' AND policyname = 'Users can manage reviews') THEN
    CREATE POLICY "Users can manage reviews"
      ON reviews
      FOR ALL
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;

  -- Agent Outputs
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'agent_outputs' AND policyname = 'Users can manage agent outputs') THEN
    CREATE POLICY "Users can manage agent outputs"
      ON agent_outputs
      FOR ALL
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;

  -- Web Pages
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'web_pages' AND policyname = 'Users can manage web pages') THEN
    CREATE POLICY "Users can manage web pages"
      ON web_pages
      FOR ALL
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;

  -- KPI Time Series
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'kpi_time_series' AND policyname = 'Users can manage kpi time series') THEN
    CREATE POLICY "Users can manage kpi time series"
      ON kpi_time_series
      FOR ALL
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;