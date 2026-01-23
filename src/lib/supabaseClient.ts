import { createClient } from '@supabase/supabase-js';

// User will need to fill these in
// User will need to fill these in
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = SUPABASE_URL !== "" && SUPABASE_ANON_KEY !== "";

// Fallback to prevent crash if keys are missing
export const supabase = createClient(
    isSupabaseConfigured ? SUPABASE_URL : "https://placeholder.supabase.co",
    isSupabaseConfigured ? SUPABASE_ANON_KEY : "placeholder"
);
