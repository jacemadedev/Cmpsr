import { create } from 'zustand';
import { supabase } from './supabase';
import type { User } from '@supabase/supabase-js';
import { getSubscription } from './subscription';

interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null; user: User | null }>;
  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  loading: true,
  signIn: async (email: string, password: string) => {
    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (!error && data.user) {
        set({ user: data.user });
        // Ensure user has a subscription
        await getSubscription(data.user.id);
      }
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  },
  signUp: async (email: string, password: string) => {
    try {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
      });

      if (!error && data.user) {
        try {
          await getSubscription(data.user.id);
          set({ user: data.user });
          return { error: null, user: data.user };
        } catch (subscriptionError) {
          console.error('Failed to create initial subscription:', subscriptionError);
          return { error: subscriptionError as Error, user: null };
        }
      }
      return { error, user: null };
    } catch (error) {
      return { error: error as Error, user: null };
    }
  },
  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  },
  setUser: (user) => set({ user, loading: false }),
}));

// Get the set function from useAuth store
const { setUser } = useAuth.getState();

// Initialize auth state
supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === 'SIGNED_IN' && session?.user) {
    setUser(session.user);
  } else if (event === 'SIGNED_OUT') {
    setUser(null);
  } else if (event === 'TOKEN_REFRESHED' && session?.user) {
    setUser(session.user);
  }
});

// Initial session check
supabase.auth.getSession().then(({ data: { session } }) => {
  if (session?.user) {
    setUser(session.user);
  } else {
    setUser(null);
  }
});
