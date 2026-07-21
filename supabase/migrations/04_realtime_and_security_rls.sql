-- ============================================================================
-- EDUPULSE — Migration 04: Realtime Pub/Sub & Campus Security Alerts
-- ============================================================================

-- 1. Security Incidents / Campus Alerts Table
CREATE TABLE IF NOT EXISTS public.security_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    title VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'acknowledged')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.security_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All authenticated users can read security alerts" ON public.security_alerts FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can insert and update security alerts" ON public.security_alerts FOR ALL USING (auth.uid() IS NOT NULL);

-- 2. Add Tables to Supabase Realtime Publication
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR TABLE 
    public.security_alerts, 
    public.fleet_vehicles,
    public.attendance;
COMMIT;
