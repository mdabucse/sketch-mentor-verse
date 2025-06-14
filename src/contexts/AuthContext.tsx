
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  currentUser: User | null;
  session: Session | null;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Activity tracking functions
export const trackUserActivity = async (userId: string, activity: string, details?: any) => {
  try {
    // Check if we have a valid session before tracking
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.log('No active session, skipping activity tracking');
      return;
    }

    const { error } = await supabase
      .from('user_activities')
      .insert({
        user_id: userId,
        activity_type: activity,
        details: details || {},
        timestamp: new Date().toISOString()
      });
    
    if (error) {
      console.error('Error tracking activity:', error);
    }
  } catch (err) {
    console.error('Failed to track activity:', err);
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const loginWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });
    
    if (error) throw error;
    
    // Track Google login activity will be handled by the auth state change
  };

  const logout = async () => {
    // Track logout activity before signing out
    if (currentUser && session) {
      await trackUserActivity(currentUser.id, 'logout');
    }
    
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session);
      setSession(session);
      setCurrentUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session);
      setSession(session);
      setCurrentUser(session?.user ?? null);
      setLoading(false);
      
      // Only track activity when user has an active session
      if (event === 'SIGNED_IN' && session?.user) {
        // Use setTimeout to defer the tracking call to avoid blocking the auth flow
        setTimeout(async () => {
          await trackUserActivity(session.user.id, 'login', {
            provider: session.user.app_metadata?.provider || 'google'
          });
        }, 100);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    currentUser,
    session,
    loginWithGoogle,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
