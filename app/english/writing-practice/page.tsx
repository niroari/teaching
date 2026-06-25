"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Mail, FileText, Sparkles, Sun, Moon, ArrowLeft } from "lucide-react";

export default function WritingPracticeDashboard() {
  const [comfortMode, setComfortMode] = useState<"dark" | "light">("dark");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("teaching-site-comfort-mode");
      if (stored === "light" || stored === "dark") {
        setComfortMode(stored);
      }
    }
  }, []);

  const toggleComfortMode = () => {
    const next = comfortMode === "dark" ? "light" : "dark";
    setComfortMode(next);
    if (typeof window !== "undefined") {
      localStorage.setItem("teaching-site-comfort-mode", next);
    }
  };

  const isLight = comfortMode === "light";
  const bgTheme = isLight ? "bg-[#f4f6fa] text-zinc-800" : "bg-[#080c18] text-[#e8edf8]";
  const borderTheme = isLight ? "border-zinc-200" : "border-border-custom";
  const textTitle = isLight ? "text-zinc-900" : "text-white";
  const textMuted = isLight ? "text-zinc-500" : "text-text-muted";
  const cardStyle = isLight 
    ? "bg-white border-zinc-200 shadow-sm hover:shadow-md hover:border-zinc-300" 
    : "bg-[#0c1222]/60 border-border-custom hover:border-cyan-500/30 hover:shadow-[0_12px_40px_rgba(0,200,255,0.08)]";

  return (
    <div className={`relative min-h-screen flex flex-col justify-between overflow-hidden transition-colors duration-200 ${bgTheme}`}>
      {/* Background Glow */}
      {!isLight && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-cyan-500/5 via-transparent to-transparent blur-3xl pointer-events-none rounded-full" />
      )}

      {/* Main Container */}
      <div className="relative w-full max-w-4xl mx-auto px-6 py-12 flex-1 flex flex-col z-10">
        
        {/* Top bar with back link and theme toggle */}
        <div className="flex justify-between items-center mb-12">
          {/* Back Link */}
          <Link
            href="/english"
            className={`inline-flex items-center gap-1.5 text-xs font-semibold hover:text-cyan-500 transition-colors ${textMuted}`}
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>חזרה ללימודי אנגלית</span>
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={toggleComfortMode}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 border rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              isLight 
                ? "bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-700" 
                : "bg-surface hover:bg-surface-hover border-border-custom text-zinc-300"
            }`}
          >
            {isLight ? (
              <>
                <Moon className="w-3.5 h-3.5 text-amber-600" />
                <span>מצב קריאה כהה</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>מצב קריאה בהיר</span>
              </>
            )}
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 border rounded-full text-xs font-bold ${isLight ? "bg-white border-zinc-200 text-cyan-600" : "bg-surface border-border-custom text-english"}`}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>תרגול כתיבה באנגלית (Writing Practice)</span>
          </div>
          <h1 className={`text-4xl font-black ${textTitle}`}>אימון כתיבה באנגלית</h1>
          <p className={`text-sm max-w-lg mx-auto leading-relaxed ${textMuted}`}>
            שפרו את כושר הביטוי, הדקדוק והמבנה שלכם באנגלית. בחרו את מסלול הכתיבה שלכם, הזינו חיבור או מכתב, וקבלו משוב מיידי ומדויק מבינה מלאכותית הכולל תיקון שגיאות והצעה לשיפור.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          
          {/* Card 1: Letter Writing */}
          <Link
            href="/english/writing-practice/letter"
            className={`group border rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 ${cardStyle}`}
          >
            <div className="space-y-6">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isLight ? "bg-cyan-50 text-cyan-600" : "bg-cyan-500/10 text-cyan-400"}`}>
                <Mail className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className={`text-2xl font-bold transition-colors group-hover:text-cyan-500 ${textTitle}`}>
                  כתיבת מכתב (Letter Writing)
                </h3>
                <p className={`text-xs ${isLight ? "text-cyan-600" : "text-cyan-400"} font-semibold`}>
                  מכתבים אישיים לחבר, מכתבי תודה, או מכתבים רשמיים
                </p>
                <p className={`text-sm leading-relaxed pt-2 ${textMuted}`}>
                  למדו את המבנה הנכון של מכתב באנגלית (תאריך, פנייה, גוף המכתב, ברכת פרידה וחתימה). תרגלו כתיבת מכתב באורך של 10-15 שורות וקבלו משוב על דקדוק ומבנה המכתב.
                </p>
              </div>
            </div>
            
            <div className="mt-8 flex items-center gap-2 text-sm font-bold text-cyan-500 group-hover:translate-x-[-6px] transition-transform">
              <span>התחלת תרגול מכתבים</span>
              <ArrowLeft className="w-4 h-4" />
            </div>
          </Link>

          {/* Card 2: Essay Writing */}
          <Link
            href="/english/writing-practice/essay"
            className={`group border rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 ${cardStyle}`}
          >
            <div className="space-y-6">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isLight ? "bg-cyan-50 text-cyan-600" : "bg-cyan-500/10 text-cyan-400"}`}>
                <FileText className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className={`text-2xl font-bold transition-colors group-hover:text-cyan-500 ${textTitle}`}>
                  חיבור דעה / פסקה (Essay Writing)
                </h3>
                <p className={`text-xs ${isLight ? "text-cyan-600" : "text-cyan-400"} font-semibold`}>
                  כתיבת חיבורים קצרים, הבעת עמדה ופסקאות תיאוריות
                </p>
                <p className={`text-sm leading-relaxed pt-2 ${textMuted}`}>
                  תרגלו כתיבה טיעונית מובנית: הצגת רעיון מוביל (Topic Sentence), פיתוח טיעונים באמצעות מילות קישור (Connectors), וסיכום. תרגלו כתיבת חיבור של 10-15 שורות.
                </p>
              </div>
            </div>
            
            <div className="mt-8 flex items-center gap-2 text-sm font-bold text-cyan-500 group-hover:translate-x-[-6px] transition-transform">
              <span>התחלת תרגול חיבורים</span>
              <ArrowLeft className="w-4 h-4" />
            </div>
          </Link>

        </div>

      </div>

      {/* Footer */}
      <footer className={`w-full text-center py-6 border-t text-xs relative z-10 bg-surface/10 ${borderTheme} ${textMuted}`}>
        <span>© {new Date().getFullYear()} ניר עוז-ארי — אימון כתיבה באנגלית</span>
      </footer>
    </div>
  );
}
