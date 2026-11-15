"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/lib/context/AuthContext";
import ThemeToggle from "@/components/site/ThemeToggle";
import SiteFooter from "@/components/site/SiteFooter";
import { LogIn, UserPlus, Mail, Lock, User, ArrowRight, Sparkles } from "lucide-react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, signInWithGoogle, loading: authLoading } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user && !authLoading) {
      const redirectUrl = searchParams.get("redirect") || "/";
      router.push(redirectUrl);
    }
  }, [user, authLoading, router, searchParams]);

  // UI state
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email.trim() || !password.trim()) {
      setError("אנא מלאו את כל השדות המבוקשים.");
      setLoading(false);
      return;
    }

    if (mode === "signup" && !displayName.trim()) {
      setError("אנא הזינו שם תצוגה.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("הסיסמה חייבת להכיל לפחות 6 תווים.");
      setLoading(false);
      return;
    }

    try {
      if (mode === "signin") {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
        await updateProfile(userCredential.user, {
          displayName: displayName.trim()
        });
        // Force state refresh
        router.refresh();
      }
      
      const redirectUrl = searchParams.get("redirect") || "/";
      router.push(redirectUrl);
    } catch (err: any) {
      console.error("Authentication error details:", err);
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setError("כתובת האימייל או הסיסמה אינם נכונים.");
      } else if (err.code === "auth/email-already-in-use") {
        setError("כתובת האימייל הזו כבר רשומה במערכת.");
      } else if (err.code === "auth/invalid-email") {
        setError("כתובת האימייל אינה תקינה.");
      } else if (err.code === "auth/operation-not-allowed") {
        setError("הרשמה באמצעות אימייל וסיסמה אינה מופעלת בפרויקט Firebase זה. אנא הפעילו את אפשרות ה-Email/Password תחת Authentication -> Sign-in method בקונסולת Firebase.");
      } else if (err.code === "auth/weak-password") {
        setError("הסיסמה חלשה מדי. אנא בחרו סיסמה חזקה יותר.");
      } else {
        setError(`אירעה שגיאה: ${err.message || err.code || "אנא נסו שוב מאוחר יותר."}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithGoogle();
      const redirectUrl = searchParams.get("redirect") || "/";
      router.push(redirectUrl);
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/unauthorized-domain") {
        setError("שגיאה: הדומיין אינו מורשה ב-Firebase. אנא הוסיפו את דומיין האתר הנוכחי לרשימת הדומיינים המורשים בקונסולת Firebase (תחת Authentication -> Settings).");
      } else if (err.code !== "auth/popup-closed-by-user") {
        setError("החיבור באמצעות גוגל נכשל. אנא נסו שוב.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-canvas text-fg flex items-center justify-center">
        <div className="text-sm text-fg-muted animate-pulse">בטוען פרטי משתמש...</div>
      </div>
    );
  }

  return (
    <div className="site relative flex min-h-screen flex-col bg-canvas text-fg">
      <div className="flex h-14 items-center justify-end px-4 sm:px-6">
        <ThemeToggle />
      </div>

      {/* Main Form container */}
      <div className="relative w-full max-w-md mx-auto px-6 py-10 flex-1 flex flex-col justify-center z-10">
        
        {/* Logo / Header */}
        <div className="text-center mb-8 space-y-2">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-fg-muted hover:text-fg transition-colors mb-4">
            <ArrowRight className="w-3.5 h-3.5" />
            <span>חזרה לדף הבית</span>
          </Link>

          <h1 className="text-3xl font-semibold text-fg">
            כניסת תלמידים
          </h1>
          <p className="text-fg-muted text-sm">התחברו כדי לשמור את ההתקדמות שלכם ולהגיש משימות</p>
        </div>

        {/* Auth Box */}
        <div className="rounded-lg border border-line bg-card p-6 md:p-8 space-y-6">
          {/* Mode Tabs */}
          <div className="grid grid-cols-2 gap-1 rounded-lg border border-line bg-subtle p-1">
            <button
              onClick={() => { setMode("signin"); setError(""); }}
              className={`py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                mode === "signin"
                  ? "bg-card text-fg shadow-sm"
                  : "text-fg-muted hover:text-fg"
              }`}
            >
              התחברות
            </button>
            <button
              onClick={() => { setMode("signup"); setError(""); }}
              className={`py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                mode === "signup"
                  ? "bg-card text-fg shadow-sm"
                  : "text-fg-muted hover:text-fg"
              }`}
            >
              הרשמה
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleEmailSubmit} className="space-y-4 text-right">
            {mode === "signup" && (
              <div className="space-y-1.5">
                <label className="text-sm text-fg-muted font-semibold block">שם מלא</label>
                <div className="relative flex items-center">
                  <span className="absolute right-3 text-fg-muted">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    id="displayName"
                    name="displayName"
                    autoComplete="name"
                    placeholder="הזינו את שמכם..."
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full h-11 bg-card border border-line-strong rounded-md pr-10 pl-3 text-sm text-fg placeholder:text-fg-subtle focus:outline-none focus:border-fg"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm text-fg-muted font-semibold block">כתובת אימייל</label>
              <div className="relative flex items-center">
                <span className="absolute right-3 text-fg-muted">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  dir="ltr"
                  className="w-full h-11 bg-card border border-line-strong rounded-md pr-10 pl-3 text-sm text-fg placeholder:text-fg-subtle focus:outline-none focus:border-fg text-right"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm text-fg-muted font-semibold block">סיסמה</label>
              <div className="relative flex items-center">
                <span className="absolute right-3 text-fg-muted">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  id="password"
                  name="password"
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  placeholder="לפחות 6 תווים..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  dir="ltr"
                  className="w-full h-11 bg-card border border-line-strong rounded-md pr-10 pl-3 text-sm text-fg placeholder:text-fg-subtle focus:outline-none focus:border-fg text-right"
                />
              </div>
            </div>

            {error && (
              <div className="text-sm text-danger font-medium bg-danger-soft border border-transparent p-2.5 rounded-md">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-md bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors border border-cyan-400/20"
            >
              {loading ? (
                <span>טוען…</span>
              ) : mode === "signin" ? (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>התחבר לחשבון</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>צור חשבון חדש</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-line"></div>
            <span className="flex-shrink mx-4 text-xs text-fg-muted uppercase font-semibold">או באמצעות</span>
            <div className="flex-grow border-t border-line"></div>
          </div>

          {/* Google Button */}
          <button
            onClick={handleGoogleSubmit}
            disabled={loading}
            className="w-full h-11 rounded-md bg-card hover:bg-subtle border border-line-strong text-fg font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-50"
          >
            {/* Google Icon SVG */}
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>התחברות עם Google</span>
          </button>
        </div>

      </div>

      <SiteFooter />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-canvas text-fg flex items-center justify-center">
        <div className="text-sm text-fg-muted animate-pulse">טוען…</div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
