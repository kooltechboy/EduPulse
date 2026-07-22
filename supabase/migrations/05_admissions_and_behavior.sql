-- 05_admissions_and_behavior.sql
CREATE TABLE IF NOT EXISTS public.admissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  applied_grade TEXT,
  guardian_name TEXT,
  guardian_phone TEXT,
  stage VARCHAR(20) CHECK (stage IN ('inquiry','applied','review','accepted','enrolled','rejected')),
  documents JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.conduct_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  date DATE NOT NULL,
  student_name TEXT NOT NULL,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  type VARCHAR(10) CHECK (type IN ('merit','demerit')),
  category TEXT NOT NULL,
  points INTEGER NOT NULL,
  reported_by TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.house_points (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  house_name TEXT NOT NULL,
  total_points INTEGER DEFAULT 0,
  color VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_admissions_tenant ON public.admissions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_conduct_tenant_student ON public.conduct_records(tenant_id, student_id);
CREATE INDEX IF NOT EXISTS idx_house_points_tenant ON public.house_points(tenant_id);

-- RLS
ALTER TABLE public.admissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conduct_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.house_points ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read for users based on tenant_id" ON public.admissions FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Enable all for users based on tenant_id" ON public.admissions FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Enable read for users based on tenant_id" ON public.conduct_records FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Enable all for users based on tenant_id" ON public.conduct_records FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Enable read for users based on tenant_id" ON public.house_points FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Enable all for users based on tenant_id" ON public.house_points FOR ALL USING (auth.uid() IS NOT NULL);
