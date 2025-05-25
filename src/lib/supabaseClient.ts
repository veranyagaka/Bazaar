import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ajhabtajwwtnkqxaelwg.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqaGFidGFqd3d0bmtxeGFlbHdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxMDkzOTMsImV4cCI6MjA2MzY4NTM5M30.RJgCDeX7kVjlqyvC3_fVm13O_sGVW83M-hwootQ1DkU";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);