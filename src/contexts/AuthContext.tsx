import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType, Profile } from '../types';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This function runs once on startup to check for an existing session.
    const checkInitialSession = async () => {
      try {
        // Attempt to get the current session. This might throw the refresh token error.
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          setUser(profile || null);
        } else {
          setUser(null);
        }
      } catch (error) {
        // This will catch the "Invalid Refresh Token" error and other initialization errors.
        console.error("Error checking initial session:", error);
        setUser(null);
      } finally {
        // This block is GUARANTEED to run, permanently fixing the stuck loading state.
        setIsLoading(false);
      }
    };

    checkInitialSession();

    // This listener handles subsequent authentication changes (e.g., user logs in or out).
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        setUser(profile || null);
      } else {
        setUser(null);
      }
    });

    // Cleanup the subscription on component unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; isAdmin: boolean; }> => {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError || !authData.user) {
      console.error('Login failed:', authError?.message);
      throw new Error(authError?.message || 'Invalid login credentials.');
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', authData.user.id)
      .single();

    if (profileError) {
      console.error('Failed to fetch profile on login:', profileError.message);
      return { success: true, isAdmin: false };
    }
    
    return { success: true, isAdmin: profile?.is_admin || false };
  };

  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; error: string | null; requiresConfirmation: boolean; }> => {
    const trimmedEmail = email.trim();
    const { data, error } = await supabase.auth.signUp({
      email: trimmedEmail,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (error) {
      console.error('Registration failed:', error.message);
      return { success: false, error: error.message, requiresConfirmation: false };
    }
    
    const requiresConfirmation = data.user !== null && data.session === null;
    
    return { success: true, error: null, requiresConfirmation };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('skillHunter_cart');
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
