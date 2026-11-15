"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lock } from "lucide-react";
import { useVisibility } from "@/lib/context/VisibilityContext";
import { useAuth } from "@/lib/context/AuthContext";
import ThemeToggle, { ThemeSync } from "@/components/site/ThemeToggle";
import { EmptyState, Spinner, btn } from "@/components/site/ui";
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

  const pathSubject = hubSubjectForPath(pathname) ?? findItemForPath(pathname)?.subject;
  const subject = pathSubject && pathSubject !== "other" ? pathSubject : undefined;

  let content: React.ReactNode;
  if (alwaysOpen) content = children;
  else if (loading) content = <GateLoading />;
  else if (canSeePath(pathname)) content = children;
  else content = <NotOpenYet />;

  return (
    <>
      <ThemeSync />
      {/* Gives every page its subject accent color (see [data-subject] in globals.css). */}
      <div data-subject={subject} className="contents">
        {content}
      </div>
      {needsFloatingToggle(pathname) && (
        <ThemeToggle className="fixed bottom-4 right-4 z-[90] bg-card shadow-sm print:hidden" />
      )}
      {isTeacher && !pathname.startsWith("/admin") && <TeacherVisibilityPill pathname={pathname} />}
    </>
  );
}

/** Pages with no header of their own to hold the Comfort Mode toggle get a floating one. */
const FLOATING_TOGGLE_PREFIXES = [
  "/english-auction",
  "/values-auction",
  "/english/adjectives",
  "/english/past-simple",
  "/english/simone-biles",
  "/enrichment/human-history/",
  "/shelach/",
];

function needsFloatingToggle(pathname: string) {
  if (pathname.startsWith("/shelach/gicha")) return false;
  return FLOATING_TOGGLE_PREFIXES.some((p) => pathname.startsWith(p));
}

function GateLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas">
      <Spinner />
    </div>
  );
}

function NotOpenYet() {
  const { user } = useAuth();
  const pathname = usePathname() || "/";

  return (
    <div className="site relative flex min-h-screen flex-col bg-canvas text-fg">
      <div className="flex h-14 items-center justify-end px-4 sm:px-6">
        <ThemeToggle />
      </div>
      <div className="flex flex-1 items-center justify-center px-4 pb-20 text-center">
        <EmptyState icon={<Lock className="h-5 w-5" strokeWidth={1.75} />} title={<span className="text-xl">התוכן הזה עדיין לא פתוח</span>}>
          <p>
            המורה עדיין לא פתח את העמוד לתלמידים. קיבלתם קישור מהמורה? העמוד ייפתח כאן אוטומטית ברגע שיפורסם.
          </p>
          <div className="flex flex-col justify-center gap-2 pt-6 sm:flex-row">
            <Link href="/" className={btn.primary}>
              לדף הבית
            </Link>
            {!user && (
              <Link href={`/login?redirect=${encodeURIComponent(pathname)}`} className={btn.secondary}>
                התחברות
              </Link>
            )}
          </div>
        </EmptyState>
      </div>
    </div>
  );
}
