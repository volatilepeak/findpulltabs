'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  favorites: Set<number>;
  signIn: (email: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  toggleFavorite: (locationId: number) => Promise<void>;
  isFavorite: (locationId: number) => boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  favorites: new Set(),
  signIn: async () => ({ error: null }),
  signOut: async () => {},
  toggleFavorite: async () => {},
  isFavorite: () => false,
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) loadFavorites(session.user.id);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) loadFavorites(session.user.id);
      else setFavorites(new Set());
    });

    return () => subscription.unsubscribe();
  }, []);

  async function loadFavorites(userId: string) {
    const { data } = await supabase
      .from('favorites')
      .select('location_id')
      .eq('user_id', userId);
    if (data) {
      setFavorites(new Set(data.map((f: { location_id: number }) => f.location_id)));
    }
  }

  async function signIn(email: string) {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    return { error };
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    setFavorites(new Set());
  }

  async function handleToggleFavorite(locationId: number) {
    if (!user) return;

    const newFavorites = new Set(favorites);
    if (newFavorites.has(locationId)) {
      newFavorites.delete(locationId);
      setFavorites(newFavorites);
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('location_id', locationId);
    } else {
      newFavorites.add(locationId);
      setFavorites(newFavorites);
      await supabase
        .from('favorites')
        .insert({ user_id: user.id, location_id: locationId });
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        favorites,
        signIn,
        signOut: handleSignOut,
        toggleFavorite: handleToggleFavorite,
        isFavorite: (id) => favorites.has(id),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
