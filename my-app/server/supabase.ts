import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

// Server-only client — uses the service_role key, which bypasses RLS.
// Never import this file from anything under src/.
const url = process.env.VITE_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(url, serviceKey);
