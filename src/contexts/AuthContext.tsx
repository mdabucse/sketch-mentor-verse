
import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { User, Session } from '@supabase/supabase-js';

// Use Lovable's Supabase integration - no need for env variables
export const supabase = createClient(
  'https://your-project.supabase.co', // This will be handled by Lovable's integration
  'your-anon-key' // This will be handled by Lovable's integration
);

interface AuthContextType {
  currentUser: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
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

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    // Track login activity
    if (data.user) {
      await trackUserActivity(data.user.id, 'login');
    }
  };

  const register = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) throw error;
    
    // Track registration activity
    if (data.user) {
      await trackUserActivity(data.user.id, 'registration');
    }
  };

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
    if (currentUser) {
      await trackUserActivity(currentUser.id, 'logout');
    }
    
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setCurrentUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setCurrentUser(session?.user ?? null);
      setLoading(false);
      
      // Track login activity for OAuth providers
      if (event === 'SIGNED_IN' && session?.user) {
        await trackUserActivity(session.user.id, 'login', {
          provider: session.user.app_metadata?.provider || 'email'
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    currentUser,
    session,
    login,
    register,
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
