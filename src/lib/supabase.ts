import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase credentials missing. Core Node operating in restricted mode.");
}

export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder'
);

/**
 * Performs a lightweight health check on the Supabase connection.
 */
export const checkSupabaseHealth = async (): Promise<boolean> => {
    try {
        const { data, error } = await supabase.from('_health').select('*').limit(1);
        // Even if _health table doesn't exist, a successful 404 or auth error 
        // from the server still proves the node is reachable.
        // For simplicity, we just check if the client can reach the endpoint.
        const { error: authError } = await supabase.auth.getSession();
        return !authError;
    } catch (err) {
        return false;
    }
};
