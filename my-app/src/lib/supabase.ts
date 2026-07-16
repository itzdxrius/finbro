import {createClient} from "@supabase/supabase-js"

/* 
Other pages like Login.tsx and Register.tsx should do
import {supabase} from '../lib/supabase' to use supabase client
*/

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(url, key);