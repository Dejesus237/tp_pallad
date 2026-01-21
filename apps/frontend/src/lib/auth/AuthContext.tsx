"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { fetchMe, loginAndFetchMe, logout, logoutEverywhere } from "@/lib/api/auth";

type MePayload = Awaited<ReturnType<typeof fetchMe>>;

type AuthState = {
  loading: boolean;
  isAuthenticated: boolean;
  me: MePayload | null;
  refresh: () => Promise<void>;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  logoutEverywhere: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<MePayload | null>(null);

  const refresh = async () => {
    try {
      const data = await fetchMe();
      setMe(data);
    } catch {
      setMe(null);
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await refresh();
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo<AuthState>(() => {
    const isAuthenticated = !!me?.authenticated;

    return {
      loading,
      isAuthenticated,
      me,
      refresh,
      login: async (email, password, rememberMe = true) => {
        const data = await loginAndFetchMe({ email, password, rememberMe });
        setMe(data);
      },
      logout: async () => {
        await logout();
        setMe(null);
      },
      logoutEverywhere: async () => {
        await logoutEverywhere();
        setMe(null);
      },
    };
  }, [loading, me]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}