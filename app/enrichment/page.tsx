"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Microscope, Moon, Sun } from "lucide-react";

const ENRICHMENT_TOPICS = [
  {
    slug: "israeli-politics",
    title: "עושים סדר בפוליטיקה הישראלית",
    desc: "שיעור דיאלוג ומצגת אינטראקטיבית: ציר הזמן, שדה הכוחות, אידיאולוגיה מול מחנה ודיון מאוזן ומכבד לקראת הבחירות.",
    icon: "🗳️",
    link: "/enrichment/israeli-politics",
    badge: "שיעור דיאלוג ומצגת"
  },
  {
    slug: "israel-game",
    title: "חידון מפת ישראל",
    desc: "פעילות כיתתית אינטראקטיבית. מקמו מקומות, ערים, ואתרי מורשת רנדומליים על מפת כיתה פיזית.",
    icon: "📍",
    link: "/enrichment/israel-game",
    badge: "משחק כיתתי"
  },
  {
    slug: "evolution",
    title: "אבולוציה",
    desc: "כיצד החיים על כדור הארץ השתנו לאורך מיליארדי שנים — מגוון לומדות אינטראקטיביות.",
    icon: "🧬",
    link: "/enrichment/evolution",
    badge: "4 מודולים"
  },
  {
    slug: "human-history",
    title: "קיצור תולדות האנושות",
    desc: "שישה שיעורים אינטראקטיביים המבוססים על ספרו של יובל נוח הררי - היסטוריה של המין האנושי.",
    icon: "🌍",
    link: "/enrichment/human-history",
    badge: "6 שיעורים"
  },
  {
    slug: "google-earth",
    title: "סיורי Google Earth",
    desc: "סיורים אינטראקטיביים בתלת-ממד. הכירו את לוחות הטקטוניקה של כדור הארץ ועוד.",
    icon: "🗺️",
    link: "/enrichment/google-earth",
    badge: "קובצי KML"
  },
  {
    slug: "snakes",
    title: "נחשים בישראל",
    desc: "מצגת אינטראקטיבית ולמידה על סוגי הנחשים השונים בארץ, התגוננות ועזרה ראשונה.",
    icon: "🐍",
    link: "/snakes",
    badge: "לומדה"
  }
];

export default function EnrichmentHubPage() {
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

  return (
    <div 
      dir="rtl"
      className={`relative min-h-screen flex flex-col justify-between overflow-hidden transition-colors duration-200 ${
        isLight ? "bg-[#f8fafc] text-slate-900" : "bg-[#080c18] text-[#e8edf8]"
      }`}
    >
      {/* Background Glow */}
      {!isLight && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent blur-3xl pointer-events-none rounded-full" />
      )}

      {/* Main Container */}
      <div className="relative w-full max-w-5xl mx-auto px-6 py-12 flex-1 flex flex-col z-10">
        
        {/* Top Controls Row */}
        <div className="flex items-center justify-between gap-4 mb-10">
          <Link
            href="/"
            className={`inline-flex items-center gap-2 text-sm px-3.5 py-2 rounded-xl border font-bold transition-all ${
              isLight 
                ? "bg-white border-slate-300 text-slate-800 hover:text-emerald-700 hover:border-emerald-400 shadow-xs" 
                : "bg-surface border-border-custom text-text-muted hover:text-enrichment hover:border-enrichment/40"
            }`}
          >
            <ArrowRight className="w-4 h-4" />
            <span>חזרה לדף הבית</span>
          </Link>

          <button
            onClick={toggleComfortMode}
            className={`p-2.5 rounded-xl border transition-all ${
              isLight 
                ? "bg-white border-slate-300 text-amber-600 hover:bg-slate-100 shadow-xs" 
                : "bg-surface border-border-custom text-blue-400 hover:bg-surface-hover"
            }`}
            title={isLight ? "מעבר למצב כהה (חלל)" : "מעבר למצב קריאה רך (בהיר)"}
            aria-label="החלף ערכת נושא"
          >
            {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-16">
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-black border ${
            isLight 
              ? "bg-emerald-100 border-emerald-300 text-emerald-900" 
              : "bg-surface border-border-custom text-enrichment"
          }`}>
            <Microscope className="w-4 h-4" />
            <span>העשרה ומדע</span>
          </div>
          <h1 className={`text-4xl sm:text-5xl font-black mt-4 tracking-tight ${
            isLight ? "text-slate-950" : "text-white"
          }`}>
            העשרה מדעית וחברתית
          </h1>
          <p className={`text-base mt-2 max-w-lg mx-auto ${
            isLight ? "text-slate-700 font-semibold" : "text-text-muted"
          }`}>
            נושאים מרתקים, לומדות ושיעורי דיאלוג מחוץ לתוכנית הלימודים הרגילה
          </p>
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-2">
          {ENRICHMENT_TOPICS.map((topic) => (
            <Link
              key={topic.slug}
              href={topic.link}
              className={`group rounded-3xl border transition-all duration-300 p-8 flex flex-col items-center text-center relative overflow-hidden ${
                isLight
                  ? "bg-white border-slate-300 hover:border-emerald-500 hover:shadow-xl shadow-sm hover:translate-y-[-3px]"
                  : "glass-card border-border-custom hover:border-enrichment/40 hover:shadow-[0_12px_40px_rgba(74,222,128,0.1)] hover:translate-y-[-3px]"
              }`}
            >
              {/* Badge */}
              <span className={`absolute top-4 right-4 text-[11px] font-black px-2.5 py-1 rounded-full border transition-all ${
                isLight 
                  ? "bg-slate-100 border-slate-300 text-slate-800 group-hover:border-emerald-400 group-hover:text-emerald-800" 
                  : "bg-surface border-border-custom text-text-muted group-hover:text-enrichment group-hover:border-enrichment/30"
              }`}>
                {topic.badge}
              </span>

              {/* Icon */}
              <span className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300 block mt-2">
                {topic.icon}
              </span>

              <h3 className={`text-xl font-black transition-colors ${
                isLight 
                  ? "text-slate-950 group-hover:text-emerald-700" 
                  : "text-white group-hover:text-enrichment"
              }`}>
                {topic.title}
              </h3>
              
              <p className={`text-sm mt-3 leading-relaxed flex-1 ${
                isLight ? "text-slate-700 font-medium" : "text-text-muted"
              }`}>
                {topic.desc}
              </p>

              <div className={`mt-8 flex items-center gap-2 text-sm font-black transition-transform group-hover:translate-x-[-6px] ${
                isLight ? "text-emerald-800" : "text-enrichment"
              }`}>
                <span>כניסה ללומדה</span>
                <ArrowLeft className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>

      </div>

      {/* Footer */}
      <footer className={`w-full text-center py-6 border-t text-xs font-semibold relative z-10 ${
        isLight 
          ? "border-slate-300 text-slate-700 bg-slate-100" 
          : "border-border-custom text-text-muted bg-surface/30"
      }`}>
        <span>© {new Date().getFullYear()} ניר עוז-ארי — העשרה ומדע</span>
      </footer>
    </div>
  );
}
