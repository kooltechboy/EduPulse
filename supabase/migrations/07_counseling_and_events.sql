-- 07_counseling_and_events.sql
CREATE TABLE IF NOT EXISTS public.counseling_cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  counselor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  type VARCHAR(20),
  status VARCHAR(20),
  priority VARCHAR(10),
  opened_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.counseling_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID NOT NULL REFERENCES public.counseling_cases(id) ON DELETE CASCADE,
  session_date DATE NOT NULL,
  duration_minutes INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.campus_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  type VARCHAR(30),
  event_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  location TEXT,
  organizer TEXT,
  status VARCHAR(20),
  tier VARCHAR(30),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_counseling_cases_tenant ON public.counseling_cases(tenant_id, student_id);
CREATE INDEX IF NOT EXISTS idx_counseling_sessions_case ON public.counseling_sessions(case_id);
CREATE INDEX IF NOT EXISTS idx_campus_events_tenant ON public.campus_events(tenant_id);

-- RLS
ALTER TABLE public.counseling_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.counseling_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campus_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read for users based on tenant_id" ON public.counseling_cases FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Enable all for users based on tenant_id" ON public.counseling_cases FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Enable read for users based on case_id" ON public.counseling_sessions FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Enable all for users based on case_id" ON public.counseling_sessions FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Enable read for users based on tenant_id" ON public.campus_events FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Enable all for users based on tenant_id" ON public.campus_events FOR ALL USING (auth.uid() IS NOT NULL);
