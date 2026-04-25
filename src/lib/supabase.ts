import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lkhirqrpfzxozkyclect.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- Auth helpers ---
export async function signInWithMagicLink(email: string) {
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined,
    },
  });
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

// --- Favorites ---
export async function getFavorites(userId: string): Promise<number[]> {
  const { data, error } = await supabase
    .from('favorites')
    .select('location_id')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching favorites:', error);
    return [];
  }
  return data?.map((f: { location_id: number }) => f.location_id) || [];
}

export async function toggleFavorite(userId: string, locationId: number): Promise<boolean> {
  // Check if already favorited
  const { data: existing } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('location_id', locationId)
    .single();

  if (existing) {
    // Remove
    await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('location_id', locationId);
    return false;
  } else {
    // Add
    await supabase
      .from('favorites')
      .insert({ user_id: userId, location_id: locationId });
    return true;
  }
}

export async function getFavoriteCount(locationId: number): Promise<number> {
  const { count, error } = await supabase
    .from('favorites')
    .select('*', { count: 'exact', head: true })
    .eq('location_id', locationId);

  if (error) return 0;
  return count || 0;
}

// SQL to create the favorites table in Supabase:
/*
CREATE TABLE IF NOT EXISTS favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  location_id INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, location_id)
);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all favorites counts" ON favorites
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own favorites" ON favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites" ON favorites
  FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_favorites_location ON favorites(location_id);
CREATE INDEX idx_favorites_user ON favorites(user_id);
*/
