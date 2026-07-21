/* ============================================================================
   EDUPULSE — Supabase Client Service
   Provides connection management, auth state, and dual-mode environment checking.
   ============================================================================ */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Retrieve credentials from environment
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Determine if live Supabase mode is configured
export const isSupabaseConfigured = Boolean(
  SUPABASE_URL && 
  SUPABASE_ANON_KEY && 
  !SUPABASE_URL.includes('your-supabase-url') &&
  SUPABASE_URL.startsWith('http')
);

if (!isSupabaseConfigured) {
  console.warn(
    '[EduPulse Supabase] Live backend URL/Anon key missing in environment. Running in resilient local/demo mode.'
  );
}

// Dummy fallback URL to prevent createClient from throwing invalid URL error during demo mode
const fallbackUrl = 'https://placeholder.supabase.co';
const fallbackKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder';

export const supabase: SupabaseClient = createClient(
  isSupabaseConfigured ? SUPABASE_URL : fallbackUrl,
  isSupabaseConfigured ? SUPABASE_ANON_KEY : fallbackKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);
