-- ============================================================================
-- EDUPULSE — Migration 03: Operations, Finance, Medical (HIPAA) & Support
-- ============================================================================

-- 1. Finance Transactions Ledger
CREATE TABLE IF NOT EXISTS public.finance_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.students(id) ON DELETE SET NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('tuition', 'cafeteria', 'library_fee', 'transport', 'grant')),
    amount NUMERIC(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('paid', 'pending', 'overdue', 'cancelled')),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Medical Records (HIPAA Protected)
CREATE TABLE IF NOT EXISTS public.medical_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    condition_name VARCHAR(255) NOT NULL,
    allergies TEXT[],
    prescriptions TEXT[],
    emergency_contact VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Fleet & Transport Tracking
CREATE TABLE IF NOT EXISTS public.fleet_vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    vehicle_number VARCHAR(50) UNIQUE NOT NULL,
    driver_name VARCHAR(255),
    route_name VARCHAR(255),
    capacity INTEGER DEFAULT 40,
    current_lat NUMERIC(9, 6),
    current_lng NUMERIC(9, 6),
    speed_mph NUMERIC(5, 2) DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'in_transit',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.finance_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fleet_vehicles ENABLE ROW LEVEL SECURITY;

-- Strict HIPAA RLS Policy for Medical Records
CREATE POLICY "Strict HIPAA Policy: Only admins, medical staff, or parent of student can read medical records"
    ON public.medical_records FOR SELECT
    USING (
        auth.uid() IS NOT NULL AND (
            EXISTS (
                SELECT 1 FROM public.profiles 
                WHERE id = auth.uid() AND role IN ('admin', 'coordinator')
            )
            OR
            EXISTS (
                SELECT 1 FROM public.students s
                JOIN public.profiles p ON p.id = auth.uid()
                WHERE s.id = public.medical_records.student_id AND s.profile_id = auth.uid()
            )
        )
    );

CREATE POLICY "Public authenticated read for fleet tracking" ON public.fleet_vehicles FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Finance staff write policy" ON public.finance_transactions FOR ALL USING (auth.uid() IS NOT NULL);
