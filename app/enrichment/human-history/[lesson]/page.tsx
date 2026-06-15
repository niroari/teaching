"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, BookOpen } from "lucide-react";

interface LessonData {
  title: string;
  num: string;
  embedUrl: string;
}

const LESSONS_DATA: Record<string, LessonData> = {
  "lesson-1": {
    num: "שיעור 1",
    title: "המהפכה הקוגניטיבית",
    embedUrl: "https://www.canva.com/design/DAGjYWEBtHk/drNiShoDRcmoekvU14K5xQ/view?embed"
  },
  "lesson-2": {
    num: "שיעור 2",
    title: "כוחם של סיפורים (מדומיינים)",
    embedUrl: "https://www.canva.com/design/DAGjafLYqw4/-IyQTT7zmkmDKzXhJmso1A/view?embed"
  },
  "lesson-3": {
    num: "שיעור 3",
    title: "המהפכה החקלאית",
    embedUrl: "https://www.canva.com/design/DAGjp3qkUFI/tlraJt5yC4_j9EF4tHR--A/view?embed"
  },
  "lesson-4": {
    num: "שיעור 4",
    title: "תוצאות החקלאות",
    embedUrl: "https://www.canva.com/design/DAGli5GaC-w/mv7mM7HYhF7TWxato3N6uQ/view?embed"
  },
  "lesson-5": {
    num: "שיעור 5",
    title: "המהפכה המדעית",
    embedUrl: "https://www.canva.com/design/DAGmA1q4C5w/oqd1LFNk9-fdtY1V80SVhQ/view?embed"
  },
  "lesson-6": {
    num: "שיעור 6",
    title: "העתיד",
    embedUrl: "https://www.canva.com/design/DAGmBB4uuU4/4G-VceCwzVK6No8pSD_hWg/view?embed"
  }
};

export default function LessonPresentationPage() {
  const { lesson } = useParams();
  const slug = typeof lesson === "string" ? lesson : "";
  const data = LESSONS_DATA[slug];

  if (!data) {
    return (
      <div className="min-h-screen bg-[#080c18] text-[#e8edf8] flex items-center justify-center p-6">
        <div className="glass-card max-w-md w-full rounded-2xl p-8 border border-red-500/30 text-center space-y-4">
          <h3 className="text-xl font-bold text-red-400">שיעור לא נמצא</h3>
          <p className="text-text-muted text-sm">הקישור שהזנת אינו תקין.</p>
          <Link href="/enrichment/human-history" className="inline-block px-5 py-2.5 bg-surface hover:bg-surface-hover border border-border-custom rounded-xl font-semibold transition-all">
            חזרה לשיעורי היסטוריה
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#080c18] text-[#e8edf8] flex flex-col justify-between overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent blur-3xl pointer-events-none rounded-full" />

      {/* Main Container */}
      <div className="relative w-full max-w-5xl mx-auto px-6 py-12 flex-1 flex flex-col z-10">
        
        {/* Back Link */}
        <Link
          href="/enrichment/human-history"
          className="self-start inline-flex items-center gap-2 text-sm text-text-muted hover:text-amber-400 transition-colors mb-8"
        >
          <span>→ חזרה לשיעורי היסטוריה</span>
        </Link>

        {/* Header */}
        <div className="mb-8 text-right">
          <p className="text-sm font-bold text-amber-500 tracking-wide">
            {data.num} · קיצור תולדות האנושות
          </p>
          <h1 className="text-3xl font-black text-white mt-2 leading-tight">
            {data.title}
          </h1>
        </div>

        {/* Embedded Presentation Container */}
        <div className="flex-1 w-full bg-surface border border-border-custom rounded-2xl overflow-hidden shadow-2xl relative min-h-[500px] lg:min-h-[600px] flex">
          <iframe
            src={data.embedUrl}
            allowFullScreen
            loading="lazy"
            title={data.title}
            className="w-full h-full border-0 absolute inset-0"
            allow="fullscreen"
          />
        </div>

      </div>

      {/* Footer */}
      <footer className="w-full text-center py-6 border-t border-border-custom text-xs text-text-muted relative z-10 bg-surface/30 shrink-0">
        <span>© {new Date().getFullYear()} ניר עוז-ארי — קיצור תולדות האנושות</span>
      </footer>
    </div>
  );
}
