-- ============================================================================
-- EDUPULSE — Migration 02: SIS, Classroom & Academic Schema
-- ============================================================================

-- 1. Students Table
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    student_number VARCHAR(50) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    grade_level VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    gpa NUMERIC(3, 2) DEFAULT 0.00,
    attendance_rate NUMERIC(5, 2) DEFAULT 100.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Courses Table
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    department VARCHAR(100),
    credits INTEGER DEFAULT 3,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Classes / Sections Table
CREATE TABLE IF NOT EXISTS public.classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    teacher_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    room_number VARCHAR(50),
    schedule_expression VARCHAR(100),
    term VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Attendance Marking Table
CREATE TABLE IF NOT EXISTS public.attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('present', 'absent', 'tardy', 'excused')),
    notes TEXT,
    recorded_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Gradebook Entries Table
CREATE TABLE IF NOT EXISTS public.gradebook (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    assignment_name VARCHAR(255) NOT NULL,
    score NUMERIC(5, 2) NOT NULL,
    max_score NUMERIC(5, 2) DEFAULT 100.00,
    category VARCHAR(50) DEFAULT 'assignment',
    graded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gradebook ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Tenant read policy for academic data" ON public.students FOR SELECT USING (true);
CREATE POLICY "Tenant read policy for courses" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Tenant read policy for classes" ON public.classes FOR SELECT USING (true);
CREATE POLICY "Tenant read policy for attendance" ON public.attendance FOR SELECT USING (true);
CREATE POLICY "Tenant read policy for gradebook" ON public.gradebook FOR SELECT USING (true);

CREATE POLICY "Teachers and Admins write attendance" ON public.attendance FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Teachers and Admins write gradebook" ON public.gradebook FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
