-- Create schools table
CREATE TABLE IF NOT EXISTS schools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  domain TEXT,
  logo_url TEXT,
  address TEXT,
  contact_email TEXT,
  website TEXT,
  subscription_plan TEXT DEFAULT 'free', -- 'free', 'basic', 'premium', 'enterprise'
  subscription_status TEXT DEFAULT 'active',
  settings JSONB DEFAULT '{}',
  theme_colors JSONB DEFAULT '{"primary": "#4F46E5", "secondary": "#64748B"}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on schools
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;

-- Add school_id to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id);
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_super_admin BOOLEAN DEFAULT FALSE;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_users_school_id ON users(school_id);

-- RLS Policies for Schools table
-- Super Admins can see all schools
CREATE POLICY "Super admins can see all schools" ON schools
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.is_super_admin = TRUE
    )
  );

-- Users can view their own school
CREATE POLICY "Users can view their own school" ON schools
  FOR SELECT
  USING (
    id = (
      SELECT school_id FROM users
      WHERE users.id = auth.uid()
    )
  );

-- Function to handle school_id propagation (optional, for future robust tenancy)
-- Ensures new users are associated with a school if context allows (e.g. invite)
-- For now, we rely on application logic to set school_id

-- Seed a default school for migration/dev purposes if none exists
DO $$
DECLARE
  default_school_id UUID;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM schools LIMIT 1) THEN
    INSERT INTO schools (name, slug, subscription_plan)
    VALUES ('EduPulse Academy', 'edupulse-academy', 'enterprise')
    RETURNING id INTO default_school_id;
    
    -- Assign existing users to this default school
    UPDATE users SET school_id = default_school_id WHERE school_id IS NULL;
  END IF;
END $$;
