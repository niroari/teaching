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
        className={`fixed bottom-4 left-4 z-[100] w-11 h-11 rounded-full border shadow-lg flex items-center justify-center backdrop-blur transition-colors ${
          previewAsStudent
            ? "bg-amber-500/90 border-amber-300 text-zinc-950"
            : item
            ? isVisible
              ? "bg-emerald-600/90 border-emerald-300 text-white"
              : "bg-zinc-800/90 border-zinc-600 text-zinc-300"
            : "bg-purple-700/90 border-purple-400 text-white"
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
      className="fixed bottom-4 left-4 z-[100] max-w-[calc(100vw-2rem)] rounded-2xl border border-purple-500/40 bg-[#0d1222]/95 text-[#e8edf8] shadow-2xl backdrop-blur p-2 flex flex-wrap items-center gap-2 text-xs font-bold"
    >
      {item && (
        <button
          type="button"
          onClick={toggleItem}
          disabled={busy}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border transition-colors cursor-pointer disabled:opacity-60 ${
            isVisible
              ? "bg-emerald-500/15 border-emerald-400/50 text-emerald-300 hover:bg-emerald-500/25"
              : "bg-zinc-700/30 border-zinc-500/50 text-zinc-300 hover:bg-zinc-700/50"
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
        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border transition-colors cursor-pointer ${
          previewAsStudent
            ? "bg-amber-500/20 border-amber-400/60 text-amber-300"
            : "border-white/10 text-zinc-300 hover:bg-white/5"
        }`}
        title="לראות את האתר בדיוק כמו תלמיד"
      >
        <UserRound className="w-3.5 h-3.5" />
        <span>{previewAsStudent ? "תצוגת תלמיד פעילה · יציאה" : "תצוגת תלמיד"}</span>
      </button>

      <Link
        href="/admin?tab=visibility"
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 text-purple-300 hover:bg-white/5 transition-colors"
        title="ניהול כל התכנים הגלויים לתלמידים"
      >
        <SlidersHorizontal className="w-3.5 h-3.5" />
        <span>כל התכנים</span>
      </Link>

      {item && !canSee(item.id) && previewAsStudent && (
        <span className="px-2 text-amber-300/80 font-normal">תלמידים רואים כרגע מסך &quot;לא פתוח&quot;</span>
      )}
      {error && <span className="px-2 text-red-300 font-normal">שגיאה בשמירה</span>}

      <button
        type="button"
        onClick={() => setCollapsedPersist(true)}
        className="p-2 rounded-xl text-zinc-400 hover:bg-white/5 cursor-pointer"
        title="מזעור"
        aria-label="מזעור פקדי מורה"
      >
        <ChevronDown className="w-4 h-4" />
      </button>
    </div>
  );
}
