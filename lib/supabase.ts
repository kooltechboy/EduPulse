
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Note: Configured via Environment Variables for Institutional Security
const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
