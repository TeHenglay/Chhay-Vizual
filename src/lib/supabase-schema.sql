-- Create projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to read projects
CREATE POLICY "Allow authenticated users to read projects"
  ON projects
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Create policy for authenticated users to insert projects
CREATE POLICY "Allow authenticated users to insert projects"
  ON projects
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Create policy for authenticated users to delete projects
CREATE POLICY "Allow authenticated users to delete projects"
  ON projects
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- Create storage bucket for project images (if not exists)
-- Note: This needs to be done in Supabase dashboard or via separate API call
-- Go to Storage → Create New Bucket → Name: "projects" → Private
