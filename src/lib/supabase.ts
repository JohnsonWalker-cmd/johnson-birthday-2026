import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Wish {
  id: number;
  sender: string;
  text: string;
  created_at: string;
}

export interface StarRow {
  id: string;
  x: number;
  y: number;
  memory: string;
  timestamp: number;
  photo: string | null;
  year: number | null;
  created_at: string;
}
