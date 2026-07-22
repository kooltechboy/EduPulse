-- 06_library_and_inventory.sql
CREATE TABLE IF NOT EXISTS public.library_books (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  title TEXT NOT NULL,
  author TEXT,
  isbn VARCHAR(20) UNIQUE,
  category TEXT,
  copies INTEGER DEFAULT 1,
  available_copies INTEGER DEFAULT 1,
  location TEXT,
  cover_image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.borrow_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  book_id UUID NOT NULL REFERENCES public.library_books(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  borrow_date DATE NOT NULL,
  due_date DATE,
  return_date DATE,
  status VARCHAR(20) CHECK (status IN ('borrowed','returned','overdue')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.inventory_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  name TEXT NOT NULL,
  category TEXT,
  serial_number TEXT,
  location TEXT,
  condition VARCHAR(20) CHECK (condition IN ('excellent','good','fair','poor','broken')),
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  purchase_date DATE,
  warranty_expiry DATE,
  value NUMERIC(10,2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_library_books_tenant ON public.library_books(tenant_id);
CREATE INDEX IF NOT EXISTS idx_borrow_records_tenant ON public.borrow_records(tenant_id, book_id, student_id);
CREATE INDEX IF NOT EXISTS idx_inventory_assets_tenant ON public.inventory_assets(tenant_id);

-- RLS
ALTER TABLE public.library_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.borrow_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read for users based on tenant_id" ON public.library_books FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Enable all for users based on tenant_id" ON public.library_books FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Enable read for users based on tenant_id" ON public.borrow_records FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Enable all for users based on tenant_id" ON public.borrow_records FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Enable read for users based on tenant_id" ON public.inventory_assets FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Enable all for users based on tenant_id" ON public.inventory_assets FOR ALL USING (auth.uid() IS NOT NULL);
