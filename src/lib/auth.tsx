"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase, hasSupabase } from "./supabase";

const GUEST_KEY = "staynest.guest.v1";

type AuthState = {
  user: User | null;
  session: Session | null;
  isGuest: boolean;
  loading: boolean;
  displayName: string;
  signUp: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<{ error?: string }>;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  continueAsGuest: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      setIsGuest(localStorage.getItem(GUEST_KEY) === "1");
    } catch {
      /* ignore */
    }
    if (!hasSupabase) {
      setLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        setIsGuest(false);
        try {
          localStorage.removeItem(GUEST_KEY);
        } catch {
          /* ignore */
        }
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, fullName: string) => {
      if (!hasSupabase) return { error: "Auth is not configured." };
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      if (error) return { error: error.message };
      return {};
    },
    []
  );

  const signIn = useCallback(async (email: string, password: string) => {
    if (!hasSupabase) return { error: "Auth is not configured." };
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return { error: error.message };
    return {};
  }, []);

  const signOut = useCallback(async () => {
    if (hasSupabase) await supabase.auth.signOut();
    setIsGuest(false);
    try {
      localStorage.removeItem(GUEST_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const continueAsGuest = useCallback(() => {
    setIsGuest(true);
    try {
      localStorage.setItem(GUEST_KEY, "1");
    } catch {
      /* ignore */
    }
  }, []);

  const displayName =
    (user?.user_metadata?.full_name as string) ||
    user?.email?.split("@")[0] ||
    (isGuest ? "Guest" : "");

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isGuest,
        loading,
        displayName,
        signUp,
        signIn,
        signOut,
        continueAsGuest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
