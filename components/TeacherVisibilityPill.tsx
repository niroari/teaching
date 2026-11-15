"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, UserRound, SlidersHorizontal, ChevronDown, Loader2 } from "lucide-react";
import { useVisibility } from "@/lib/context/VisibilityContext";
import { useStoredValue } from "@/lib/hooks/useStoredValue";
import { findItemForPath, hubSubjectForPath, isAlwaysOpenPath } from "@/lib/content-registry";

const COLLAPSED_KEY = "teaching-site-teacher-pill-collapsed";

/** Floating teacher control: publish/hide the current page and switch to student view. */
export default function TeacherVisibilityPill({ pathname }: { pathname: string }) {
  const { canSee, visibleIds, setVisible, previewAsStudent, setPreviewAsStudent, saving, error } = useVisibility();
  const [collapsedStored, setCollapsedStored] = useStoredValue(COLLAPSED_KEY);
  const collapsed = collapsedStored === "1";
  const [fullscreen, setFullscreen] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const onFs = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  const setCollapsedPersist = (v: boolean) => setCollapsedStored(v ? "1" : null);

  // Never draw over a projected presentation.
  if (fullscreen) return null;

  const item = !isAlwaysOpenPath(pathname) && !hubSubjectForPath(pathname) ? findItemForPath(pathname) : null;
  const isVisible = item ? visibleIds.has(item.id) : false;

  const toggleItem = async () => {
    if (!item) return;
    setBusy(true);
    try {
      await setVisible([item.id], !isVisible);
    } catch {
      // error is surfaced through context
    } finally {
      setBusy(false);
    }
  };

  if (collapsed) {
    return (
      <button
        type="button"
        onClick={() => setCollapsedPersist(false)}
        className={`fixed bottom-4 left-4 z-[100] flex h-11 w-11 items-center justify-center rounded-full border shadow-md transition-colors cursor-pointer ${
          previewAsStudent
            ? "border-amber-500 bg-amber-400 text-zinc-950"
            : item && isVisible
            ? "border-emerald-700 bg-emerald-600 text-white"
            : "border-line-strong bg-card text-fg-muted"
        }`}
        title="פקדי מורה: מה התלמידים רואים"
        aria-label="פתיחת פקדי מורה"
      >
        {item && !isVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
      </button>
    );
  }

  return (
    <div
      dir="rtl"
      className="fixed bottom-4 left-4 z-[100] flex max-w-[calc(100vw-2rem)] flex-wrap items-center gap-1 rounded-lg border border-line-strong bg-card p-1.5 text-[13px] font-medium text-fg shadow-lg"
    >
      {item && (
        <button
          type="button"
          onClick={toggleItem}
          disabled={busy}
          className={`flex items-center gap-1.5 rounded-md px-3 py-2 transition-colors cursor-pointer disabled:opacity-60 ${
            isVisible ? "bg-success-soft text-success" : "bg-subtle text-fg-muted hover:text-fg"
          }`}
          title={isVisible ? "לחצו כדי להסתיר מהתלמידים" : "לחצו כדי לפרסם לתלמידים"}
        >
          {busy || saving ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : isVisible ? (
            <Eye className="w-3.5 h-3.5" />
          ) : (
            <EyeOff className="w-3.5 h-3.5" />
          )}
          <span>{isVisible ? "גלוי לתלמידים" : "מוסתר מהתלמידים"}</span>
          <span className="font-normal opacity-70 max-w-[160px] truncate">· {item.title}</span>
        </button>
      )}

      <button
        type="button"
        onClick={() => setPreviewAsStudent(!previewAsStudent)}
        className={`flex items-center gap-1.5 rounded-md px-3 py-2 transition-colors cursor-pointer ${
          previewAsStudent ? "bg-warning-soft text-warning" : "text-fg-muted hover:bg-subtle hover:text-fg"
        }`}
        title="לראות את האתר בדיוק כמו תלמיד"
      >
        <UserRound className="w-3.5 h-3.5" />
        <span>{previewAsStudent ? "תצוגת תלמיד פעילה · יציאה" : "תצוגת תלמיד"}</span>
      </button>

      <Link
        href="/admin?tab=visibility"
        className="flex items-center gap-1.5 rounded-md px-3 py-2 text-fg-muted transition-colors hover:bg-subtle hover:text-fg"
        title="ניהול כל התכנים הגלויים לתלמידים"
      >
        <SlidersHorizontal className="w-3.5 h-3.5" />
        <span>כל התכנים</span>
      </Link>

      {item && !canSee(item.id) && previewAsStudent && (
        <span className="px-2 font-normal text-warning">תלמידים רואים כרגע מסך &quot;לא פתוח&quot;</span>
      )}
      {error && <span className="px-2 font-normal text-danger">שגיאה בשמירה</span>}

      <button
        type="button"
        onClick={() => setCollapsedPersist(true)}
        className="rounded-md p-2 text-fg-subtle hover:bg-subtle hover:text-fg cursor-pointer"
        title="מזעור"
        aria-label="מזעור פקדי מורה"
      >
        <ChevronDown className="w-4 h-4" />
      </button>
    </div>
  );
}
