"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<any>;
  logout: () => Promise<void>;
}

function isMobileBrowser() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  // iPadOS reports a desktop Mac user agent, so check for touch as well.
  return /android|iphone|ipad|ipod|mobile/i.test(ua) || (/macintosh/i.test(ua) && navigator.maxTouchPoints > 1);
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Finish a mobile redirect sign-in. The user itself arrives through
    // onAuthStateChanged; this only surfaces errors.
    getRedirectResult(auth).catch((err) => {
      console.error("Google redirect sign-in failed:", err);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    // Mobile browsers block the sign-in popup silently (no error, the promise
    // just never settles), so on phones and tablets go straight to a full-page
    // redirect. It works because sign-in runs on our own domain (lib/firebase.ts).
    if (isMobileBrowser()) {
      return signInWithRedirect(auth, googleProvider);
    }
    try {
      return await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      if (err.code === "auth/popup-blocked") {
        return signInWithRedirect(auth, googleProvider);
      }
      throw err;
    }
  };

  const logout = async () => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("teaching-site-vocab-words");
        localStorage.removeItem("teaching-site-vocab-words_guest");
      } catch (e) {
        console.error("Error clearing guest vocab on logout:", e);
      }
    }
    return signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
