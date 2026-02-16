import { createClient } from "@supabase/supabase-js";

// Initialize Supabase Client
// We use a singleton-like pattern for the client context
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
