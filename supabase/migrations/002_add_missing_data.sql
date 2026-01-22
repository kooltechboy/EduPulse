
-- 002_add_missing_data.sql
-- Run this in Supabase SQL Editor

-- Add fields to students
ALTER TABLE students ADD COLUMN IF NOT EXISTS balance_owed NUMERIC DEFAULT 0;
ALTER TABLE students ADD COLUMN IF NOT EXISTS last_payment_status TEXT DEFAULT 'Pending';
ALTER TABLE students ADD COLUMN IF NOT EXISTS documents JSONB DEFAULT '[]';
ALTER TABLE students ADD COLUMN IF NOT EXISTS situational_notes TEXT;

-- Create Invoices Table
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id),
  student_name TEXT,
  amount NUMERIC NOT NULL,
  due_date DATE,
  status TEXT CHECK (status IN ('Draft', 'Sent', 'Paid', 'Overdue')),
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Admissions Candidates Table
CREATE TABLE IF NOT EXISTS admissions_candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  applied_grade TEXT,
  status TEXT DEFAULT 'Inquiry',
  date_applied DATE DEFAULT CURRENT_DATE,
  parent_name TEXT,
  sentiment_score NUMERIC,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE admissions_candidates ENABLE ROW LEVEL SECURITY;

-- Policies (Open for demo)
CREATE POLICY "Public read invoices" ON invoices FOR SELECT USING (true);
CREATE POLICY "Public write invoices" ON invoices FOR ALL USING (true);
CREATE POLICY "Public read admissions" ON admissions_candidates FOR SELECT USING (true);
CREATE POLICY "Public write admissions" ON admissions_candidates FOR ALL USING (true);
