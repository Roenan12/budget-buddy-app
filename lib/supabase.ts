import { createClient, SupabaseClient } from "@supabase/supabase-js";

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string | undefined;
const supabaseKey = process.env.SUPABASE_KEY as string | undefined;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase URL or Key in environment variables.");
}

try {
  new URL(supabaseUrl);
} catch {
  throw new Error(
    "NEXT_PUBLIC_SUPABASE_URL must be a valid URL (e.g. https://your-project.supabase.co), not an API key."
  );
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);
