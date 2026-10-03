import { createClient } from "@supabase/supabase-js";

/**
 * Supabase Client Initialization
 * Reads credentials from Vite environment variables (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY).
 * Throws a descriptive error if either environment variable is missing.
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables! Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env or .env.local file."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
