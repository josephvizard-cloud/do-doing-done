import { createClient } from '@supabase/supabase-js';

// ─── Supabase Setup ────────────────────────────────────────
// 1. Go to supabase.com → New Project → name it "do-doing-done"
// 2. Copy your project URL and anon key below
// 3. Run the SQL in supabase-schema.sql in the SQL Editor

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://YOUR_PROJECT.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_ANON_KEY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
