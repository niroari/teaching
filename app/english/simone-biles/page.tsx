"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, BookOpen, RefreshCw } from "lucide-react";

export default function SimoneBilesPage() {
  const [iframeLoading, setIframeLoading] = useState(true);
  const router = useRouter();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const replaceCalled = useRef(false);

  useEffect(() => {
    // Prevent iframe history pollution by using location.replace
    if (iframeRef.current && !replaceCalled.current) {
      replaceCalled.current = true;
      iframeRef.current.contentWindow?.location.replace("https://gamma.app/embed/7djedatyxrp4fbu");
    }

    // Intercept browser back button
    window.history.pushState(null, "", window.location.href);
    
    const handlePopState = () => {
      router.push("/english");
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [router]);

  return (
    <div className="relative min-h-screen bg-[#080c18] text-[#e8edf8] flex flex-col justify-between overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-cyan-500/5 via-transparent to-transparent blur-3xl pointer-events-none rounded-full" />

      {/* Main Container */}
      <div className="relative w-full max-w-5xl mx-auto px-6 py-12 flex-1 flex flex-col z-10">
        
        {/* Back Link */}
        <Link
          href="/english"
          className="self-start inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-english transition-colors mb-8"
        >
          <ArrowRight className="w-3.5 h-3.5" />
          <span>חזרה ללימודי אנגלית</span>
        </Link>

        {/* Header */}
        <div className="text-right mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface border border-border-custom rounded-full text-xs font-bold text-english mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>זמני הווה לכיתה ז׳ (Present Tenses)</span>
          </div>
          <h1 className="text-3xl font-black text-white">Simone Biles – A Real Hero</h1>
          <p className="text-text-muted text-xs mt-1.5">תרגול אינטראקטיבי של Present Simple & Present Progressive המבוסס על סיפורה מעורר ההשראה של סימון ביילס</p>
        </div>

        {/* Embedded Presentation Container */}
        <div className="flex-1 w-full bg-surface border border-border-custom rounded-2xl overflow-hidden shadow-2xl relative min-h-[500px] lg:min-h-[600px] flex items-center justify-center">
          {iframeLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#080c18]/80 z-20 space-y-3">
              <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
              <span className="text-sm text-text-muted">טוען תרגול...</span>
            </div>
          )}
          
          <iframe
            ref={iframeRef}
            allowFullScreen
            loading="lazy"
            title="Simone Biles – A Real Hero"
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
      <footer className="w-full text-center py-6 border-t border-border-custom text-xs text-text-muted relative z-10 bg-surface/30">
        <span>© {new Date().getFullYear()} ניר עוז-ארי — תרגול אנגלית</span>
      </footer>
    </div>
  );
}
