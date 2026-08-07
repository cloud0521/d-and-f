import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
export const weddingSlug = import.meta.env.VITE_WEDDING_SLUG;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey);

// The wedding experience must still render when a deployment is missing its
// optional RSVP environment values. RSVP actions handle this unavailable state.
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabasePublishableKey)
  : null;
