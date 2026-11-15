"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, RefreshCw } from "lucide-react";

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
  const router = useRouter();
  const slug = typeof lesson === "string" ? lesson : "";
  const data = LESSONS_DATA[slug];

  const [iframeLoading, setIframeLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const replaceCalled = useRef(false);

  useEffect(() => {
    if (!data) return;

    // Prevent iframe history pollution by using location.replace
    if (iframeRef.current && !replaceCalled.current) {
      replaceCalled.current = true;
      iframeRef.current.contentWindow?.location.replace(data.embedUrl);
    }

    // Intercept browser back button
    window.history.pushState(null, "", window.location.href);
    
    const handlePopState = () => {
      router.push("/enrichment/human-history");
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [router, data]);

  if (!data) {
    return (
      <div className="min-h-screen bg-canvas text-fg flex items-center justify-center p-6">
        <div className="bg-card border-line max-w-md w-full rounded-xl p-8 border border-red-500/30 text-center space-y-4">
          <h3 className="text-xl font-bold text-red-700 dark:text-red-400">שיעור לא נמצא</h3>
          <p className="text-fg-muted text-sm">הקישור שהזנת אינו תקין.</p>
          <Link href="/enrichment/human-history" className="inline-block px-5 py-2.5 bg-subtle hover:bg-subtle-hover border border-line rounded-xl font-semibold transition-all">
            חזרה לשיעורי היסטוריה
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-canvas text-fg flex flex-col justify-between overflow-hidden">
      {/* Background glow */}
      {/* Main Container */}
      <div className="relative w-full max-w-5xl mx-auto px-6 py-12 flex-1 flex flex-col z-10">
        
        {/* Back Link */}
        <Link
          href="/enrichment/human-history"
          className="self-start inline-flex items-center gap-2 text-sm text-fg-muted hover:text-amber-700 dark:hover:text-amber-400 transition-colors mb-8"
        >
          <span>→ חזרה לשיעורי היסטוריה</span>
        </Link>

        {/* Header */}
        <div className="mb-8 text-right">
          <p className="text-sm font-bold text-amber-500 tracking-wide">
            {data.num} · קיצור תולדות האנושות
          </p>
          <h1 className="text-3xl font-bold text-fg mt-2 leading-tight">
            {data.title}
          </h1>
        </div>

        {/* Embedded Presentation Container */}
        <div className="flex-1 w-full bg-subtle border border-line rounded-xl overflow-hidden shadow-sm relative min-h-[500px] lg:min-h-[600px] flex items-center justify-center">
          {iframeLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-canvas z-20 space-y-3">
              <RefreshCw className="w-8 h-8 text-amber-500 animate-spin" />
              <span className="text-sm text-fg-muted">טוען שיעור...</span>
            </div>
          )}
          
          <iframe
            ref={iframeRef}
            allowFullScreen
            loading="lazy"
            title={data.title}
            onLoad={() => {
              if (replaceCalled.current) {
                setIframeLoading(false);
              }
            }}
            className="w-full h-full border-0 absolute inset-0"
            allow="fullscreen"
          />
        </div>

      </div>

      {/* Footer */}
      <footer className="w-full text-center py-6 border-t border-line text-xs text-fg-muted relative z-10 bg-subtle shrink-0">
        <span>© {new Date().getFullYear()} נקודת ציון — קיצור תולדות האנושות</span>
      </footer>
    </div>
  );
}
