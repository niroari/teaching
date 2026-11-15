"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lock, Moon, Sun, Loader2 } from "lucide-react";
import { useVisibility } from "@/lib/context/VisibilityContext";
import { useAuth } from "@/lib/context/AuthContext";
import { useComfortMode } from "@/lib/hooks/useComfortMode";
import { findItemForPath, hubSubjectForPath, isAlwaysOpenPath } from "@/lib/content-registry";
import TeacherVisibilityPill from "@/components/TeacherVisibilityPill";

/**
 * Wraps every page. Students and logged-out visitors only get pages the teacher made visible;
 * the teacher sees everything (unless browsing in student view).
 */
export default function ContentGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/";
  const { loading, canSeePath, isTeacher } = useVisibility();
  const alwaysOpen = isAlwaysOpenPath(pathname);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production" && !alwaysOpen && !hubSubjectForPath(pathname) && !findItemForPath(pathname)) {
      console.warn(
        `[ContentGate] "${pathname}" is not registered in lib/content-registry.ts, so students can never open it. Register it to make it controllable.`
      );
    }
  }, [pathname, alwaysOpen]);

  let content: React.ReactNode;
  if (alwaysOpen) content = children;
  else if (loading) content = <GateLoading />;
  else if (canSeePath(pathname)) content = children;
  else content = <NotOpenYet />;

  return (
    <>
      {content}
      {isTeacher && !pathname.startsWith("/admin") && <TeacherVisibilityPill pathname={pathname} />}
    </>
  );
}

function GateLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080c18] text-text-muted">
      <Loader2 className="w-6 h-6 animate-spin" />
    </div>
  );
}

function NotOpenYet() {
  const { isLight, toggle } = useComfortMode();
  const { user } = useAuth();
  const pathname = usePathname() || "/";

  return (
    <div
      className={`relative min-h-screen flex flex-col items-center justify-center px-4 text-center ${
        isLight ? "bg-[#f4f6fa] text-zinc-800" : "bg-[#080c18] text-[#e8edf8]"
      }`}
    >
      <button
        type="button"
        onClick={toggle}
        className={`absolute top-6 left-4 p-2.5 rounded-xl border transition-colors ${
          isLight ? "bg-white border-zinc-200 hover:bg-zinc-100" : "bg-[#0f1526]/80 border-border-custom hover:bg-[#161d35]"
        }`}
        title="Comfort Reading Mode (שינוי ניגודיות/צבע)"
        aria-label="החלפת מצב תצוגה בהיר/כהה"
      >
        {isLight ? <Moon className="w-4 h-4 text-purple-600" /> : <Sun className="w-4 h-4 text-amber-400" />}
      </button>

      <div
        className={`max-w-md w-full rounded-2xl border p-8 space-y-5 ${
          isLight ? "light-card border-zinc-200" : "glass-card border-border-custom"
        }`}
      >
        <div
          className={`mx-auto w-14 h-14 rounded-2xl flex items-center justify-center border ${
            isLight ? "bg-purple-50 border-purple-200 text-purple-600" : "bg-purple-500/10 border-purple-500/30 text-purple-300"
          }`}
        >
          <Lock className="w-6 h-6" />
        </div>
        <h1 className={`text-2xl font-black ${isLight ? "text-zinc-900" : "text-white"}`}>התוכן הזה עדיין לא פתוח</h1>
        <p className={`text-sm leading-relaxed ${isLight ? "text-zinc-600" : "text-text-muted"}`}>
          המורה עוד לא פתח את העמוד הזה לתלמידים. אם קיבלתם קישור מהמורה, נסו שוב בעוד רגע: התוכן ייפתח כאן אוטומטית ברגע שהוא יפורסם.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-zinc-950 text-sm font-bold transition-colors"
          >
            לדף הבית
          </Link>
          {!user && (
            <Link
              href={`/login?redirect=${encodeURIComponent(pathname)}`}
              className={`px-5 py-2.5 rounded-xl border text-sm font-bold transition-colors ${
                isLight ? "border-zinc-300 hover:bg-zinc-100" : "border-border-custom hover:bg-white/5"
              }`}
            >
              התחברות
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
