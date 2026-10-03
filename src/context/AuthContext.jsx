import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext(null);

/**
 * AuthProvider component that wraps the application.
 * Manages Supabase authentication state, listens for auth changes,
 * and provides auth actions (Google OAuth, Sign out, and helpers).
 */
export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // 1. Fetch initial session on mount
    async function getInitialSession() {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error retrieving Supabase session:", error.message);
        }
        if (mounted) {
          setSession(data?.session ?? null);
          setUser(data?.session?.user ?? null);
        }
      } catch (err) {
        console.error("Unexpected error during auth initialization:", err);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    getInitialSession();

    // 2. Subscribe to Supabase auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  /**
   * Google OAuth login: redirects to Google, then returns to /dashboard
   */
  const signInWithGoogle = async () => {
    return await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/dashboard",
      },
    });
  };

  /**
   * Sign out the active user session
   */
  const signOut = async () => {
    return await supabase.auth.signOut();
  };

  /**
   * Non-breaking email/password handlers for existing UI components
   */
  const signIn = async (email, password) => {
    return await supabase.auth.signInWithPassword({ email, password });
  };

  const signUp = async (email, password, options = {}) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: options?.full_name ? { full_name: options.full_name } : undefined,
      },
    });
  };

  const resetPassword = async (email) => {
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/login?reset=true",
    });
  };

  const value = {
    user,
    session,
    loading,
    signInWithGoogle,
    signOut,
    signIn,
    signUp,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Custom hook to access auth context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
