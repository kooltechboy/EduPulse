-- 08_hr_and_cafeteria.sql
CREATE TABLE IF NOT EXISTS public.hr_staff (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  department TEXT,
  position TEXT,
  hire_date DATE,
  qualifications TEXT[],
  certifications TEXT[],
  salary NUMERIC(10,2),
  status VARCHAR(20),
  emergency_contact TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.leave_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  staff_id UUID NOT NULL REFERENCES public.hr_staff(id) ON DELETE CASCADE,
  staff_name TEXT,
  type VARCHAR(30),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  approved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.cafeteria_menus (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  menu_date DATE UNIQUE NOT NULL,
  meals JSONB DEFAULT '[]'::jsonb,
  special_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.meal_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  student_id UUID UNIQUE NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  student_name TEXT,
  balance NUMERIC(8,2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.meal_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  items JSONB DEFAULT '[]'::jsonb,
  total NUMERIC(8,2),
  payment_method VARCHAR(20),
  status VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_hr_staff_tenant ON public.hr_staff(tenant_id);
CREATE INDEX IF NOT EXISTS idx_leave_requests_tenant ON public.leave_requests(tenant_id, staff_id);
CREATE INDEX IF NOT EXISTS idx_cafeteria_menus_tenant ON public.cafeteria_menus(tenant_id, menu_date);
CREATE INDEX IF NOT EXISTS idx_meal_accounts_tenant ON public.meal_accounts(tenant_id, student_id);
CREATE INDEX IF NOT EXISTS idx_meal_transactions_tenant ON public.meal_transactions(tenant_id, student_id);

-- RLS
ALTER TABLE public.hr_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cafeteria_menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read for users based on tenant_id" ON public.hr_staff FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Enable all for users based on tenant_id" ON public.hr_staff FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Enable read for users based on tenant_id" ON public.leave_requests FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Enable all for users based on tenant_id" ON public.leave_requests FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Enable read for users based on tenant_id" ON public.cafeteria_menus FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Enable all for users based on tenant_id" ON public.cafeteria_menus FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Enable read for users based on tenant_id" ON public.meal_accounts FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Enable all for users based on tenant_id" ON public.meal_accounts FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Enable read for users based on tenant_id" ON public.meal_transactions FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Enable all for users based on tenant_id" ON public.meal_transactions FOR ALL USING (auth.uid() IS NOT NULL);
