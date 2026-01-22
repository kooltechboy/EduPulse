-- Add is_super_admin column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_super_admin BOOLEAN DEFAULT FALSE;

-- Update Schools RLS to allow Super Admins to SELECT all schools
CREATE POLICY "Super Admins can view all schools"
  ON schools
  FOR SELECT
  USING (
    exists (
      select 1 from users
      where users.id = auth.uid()
      and users.is_super_admin = true
    )
  );

-- Allow Super Admins to UPDATE schools (e.g. changing subscription plan)
CREATE POLICY "Super Admins can update schools"
  ON schools
  FOR UPDATE
  USING (
    exists (
      select 1 from users
      where users.id = auth.uid()
      and users.is_super_admin = true
    )
  );

-- Function to make a user a super admin (Utility)
CREATE OR REPLACE FUNCTION make_super_admin(user_email TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE users
  SET is_super_admin = TRUE
  WHERE email = user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
