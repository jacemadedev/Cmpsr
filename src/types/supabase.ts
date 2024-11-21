import { Session } from '@supabase/supabase-js';

export interface SupabaseSession extends Session {
  access_token: string;
} 