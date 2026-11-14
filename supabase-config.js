// Rwanda Logistics Hub - Supabase configuration
// Replace these two values with your Supabase Project URL and anon/public key.
// Never put your Supabase service_role key in this file.
window.RLH_SUPABASE_URL = 'https://YOUR-PROJECT-REF.supabase.co';
window.RLH_SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

window.rlhSupabaseReady = Boolean(
  window.RLH_SUPABASE_URL &&
  window.RLH_SUPABASE_ANON_KEY &&
  !window.RLH_SUPABASE_URL.includes('YOUR-PROJECT-REF') &&
  !window.RLH_SUPABASE_ANON_KEY.includes('YOUR_SUPABASE_ANON_KEY')
);

window.rlhDb = window.rlhSupabaseReady
  ? window.supabase.createClient(window.RLH_SUPABASE_URL, window.RLH_SUPABASE_ANON_KEY)
  : null;
