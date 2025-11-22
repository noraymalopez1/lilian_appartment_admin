"use client";

import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  const login = async (email: string) => {
    // For this specific request, the user asked for "login and logout functions".
    // Since the UI has email/password fields, I'll implement email/password login.
    // However, the original request didn't specify the exact method (magic link vs password).
    // Given the UI has a password field, I'll assume password login.
    // Wait, the UI in page.tsx has email and password fields.
    // But the user request just said "integrate that function to the login screen".
    // I will implement signInWithPassword.
    throw new Error("Login implementation requires password. Please update useAuth to accept password.");
  };

  const loginWithPassword = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    router.push("/");
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return {
    user,
    loading,
    login: loginWithPassword, // Exposing as 'login' to match the generic request, but it takes 2 args
    logout,
  };
}
