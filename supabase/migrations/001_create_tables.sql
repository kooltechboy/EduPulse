-- EduPulse Courses Table Migration
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/zgvrgqkkhrrtafdnaklm/sql

CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  teacher_id TEXT,
  teacher_name TEXT,
  grade_level TEXT,
  room TEXT,
  department TEXT,
  semester TEXT,
  banner_color TEXT,
  students TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Allow read access to all users (including anonymous)
CREATE POLICY "Allow public read access" ON courses 
  FOR SELECT USING (true);

-- Allow write access to all users (for demo purposes)
CREATE POLICY "Allow public write access" ON courses 
  FOR ALL USING (true);

-- Create students table
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  grade_level TEXT,
  grade TEXT,
  gpa NUMERIC,
  status TEXT,
  lifecycle_status TEXT,
  email TEXT,
  gender TEXT,
  dob TEXT,
  attendance NUMERIC,
  father_name TEXT,
  mother_name TEXT,
  parent_phone TEXT,
  enrollment_date TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read students" ON students 
  FOR SELECT USING (true);

CREATE POLICY "Allow public write students" ON students 
  FOR ALL USING (true);
