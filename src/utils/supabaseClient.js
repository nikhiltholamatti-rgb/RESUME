/**
 * Re-export Supabase client from canonical src/lib/supabaseClient.js
 * Ensures single client instance across the application.
 */
export { supabase } from "../lib/supabaseClient";
export const isSupabaseConfigured = true;
