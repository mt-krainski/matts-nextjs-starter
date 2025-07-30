import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/types/database.types";

// Source: https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs?queryGroups=language&language=ts#supabase-utilities
export const createClient = () =>
  createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
