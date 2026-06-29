"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  Globe, 
  Download, 
  HelpCircle, 
  Sun, 
  Moon, 
  Compass, 
  Layers, 
  ExternalLink,
  Info
} from "lucide-react";

// Types for KML projects
interface KmlProject {
  id: string;
  title: string;
  description: string;
  fileSize: string;
  downloadUrl: string;
  defaultEarthUrl: string; // The URL to Google Earth Web
  legend: {
    label: string;
    color: string;
    borderColor: string;
    desc: string;
  }[];
  instructions: string[];
}

const TECTONICS_PROJECT: KmlProject = {
  id: "plate-tectonics",
  title: "טקטוניקת הלוחות — מפת עולם",
  description: "למידה אינטראקטיבית על הלוחות הטקטוניים המרכיבים את קרום כדור הארץ. הקובץ מציג את גבולות הלוחות השונים, סיווגם (גבולות פתיחה, התכנסות והחלקה), כיווני התנועה היחסיים ומיקומי הרי געש מרכזיים ברחבי הגלובוס.",
  fileSize: "219 KB",
  downloadUrl: "/Plate_Tectonics_Hebrew.kml",
  // Standard placeholder for opening Google Earth Web. Teachers can customize this link to their Google Drive Shared Project URL.
  defaultEarthUrl: "https://earth.google.com/web/",
  legend: [
    {
      label: "גבול פתיחה (Divergent)",
      color: "bg-[#ff9900]/20 text-[#ff9900]",
      borderColor: "border-[#ff9900]",
      desc: "לוחות המתרחקים זה מזה (כגון הרכס המרכז-אוקיינוס האטלנטי). יוצר קרום חדש."
    },
    {
      label: "גבול התכנסות (Convergent)",
      color: "bg-[#ef4444]/20 text-[#ef4444]",
      borderColor: "border-[#ef4444]",
      desc: "לוחות המתנגשים זה בזה (כגון יצירת הרי ההימלאיה או אזורי הפחתה). יוצר קימוט או שקיעת קרום."
    },
    {
      label: "גבול החלקה (Transform)",
      color: "bg-[#00f2fe]/20 text-[#00f2fe]",
      borderColor: "border-[#00f2fe]",
      desc: "לוחות המחליקים זה לצד זה באופן אופקי (כגון שבר סן אנדראס או בקע ים המלח)."
    },
    {
      label: "הרי געש פעילים",
      color: "bg-[#ff3b30]/20 text-[#ff3b30]",
      borderColor: "border-[#ff3b30]",
      desc: "סימוני הרי געש פעילים המרוכזים בעיקר לאורך גבולות הלוחות ובאזור טבעת האש."
    }
  ],
  instructions: [
    "הורידו את קובץ ה-KML למחשב שלכם באמצעות לחיצה על כפתור ההורדה.",
    "היכנסו לגרסה האינטרנטית של Google Earth (earth.google.com) בדפדפן המחשב.",
    "לחצו על תפריט 'פרויקטים' (Projects) בסרגל הכלים השמאלי (סמל של סיכה ומפה).",
    "לחצו על כפתור 'פרויקט חדש' (New Project) ובחרו באפשרות 'ייבוא קובץ KML' (Import KML file).",
    "בחרו את קובץ ה-KML שהורדתם בשלב 1. המערכת תטען את הלוחות והסימונים על גבי הגלובוס בתלת-ממד!"
  ]
};

export default function GoogleEarthTours() {
  const [comfortMode, setComfortMode] = useState<"dark" | "light">("dark");
  const [showTeacherGuide, setShowTeacherGuide] = useState(false);

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
    ? "bg-white border-zinc-200 shadow-sm" 
    : "glass-card";

  return (
    <div className={`relative min-h-screen flex flex-col justify-between overflow-hidden transition-colors duration-200 ${bgTheme}`} dir="rtl">
      {/* Background Glow */}
      {!isLight && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent blur-3xl pointer-events-none rounded-full" />
      )}

      {/* Main Container */}
      <div className="relative w-full max-w-4xl mx-auto px-6 py-12 flex-1 flex flex-col z-10">
        
        {/* Top Navigation & Settings */}
        <div className="flex justify-between items-center mb-10">
          {/* Back Link */}
          <Link
            href="/enrichment"
            className={`inline-flex items-center gap-1.5 text-xs font-semibold hover:text-enrichment transition-colors ${textMuted}`}
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>חזרה ללומדות העשרה</span>
          </Link>

          {/* Controls */}
          <div className="flex items-center gap-3">
            {/* Teacher Toggle */}
            <button
              onClick={() => setShowTeacherGuide(!showTeacherGuide)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 border rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isLight 
                  ? "bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-700" 
                  : "bg-surface hover:bg-surface-hover border-border-custom text-zinc-300"
              }`}
            >
              <Info className="w-3.5 h-3.5 text-enrichment" />
              <span>הנחיות למורה</span>
            </button>

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
        </div>

        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <div className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 border rounded-full text-xs font-bold ${
            isLight ? "bg-white border-zinc-200 text-emerald-600" : "bg-surface border-border-custom text-enrichment"
          }`}>
            <Globe className="w-3.5 h-3.5" />
            <span>סיורים גאוגרפיים ב-Google Earth</span>
          </div>
          <h1 className={`text-3xl sm:text-4xl font-black ${textTitle}`}>סיורים תלת-ממדיים בקובצי KML</h1>
          <p className={`text-sm max-w-2xl mx-auto leading-relaxed ${textMuted}`}>
            הכירו את כדור הארץ דרך גאוגרפיה וגאולוגיה אינטראקטיבית. הורידו את קובצי המידע (KML) והעלו אותם ל-Google Earth לקבלת מפות שכבות אינטראקטיביות, מודלים תלת-ממדיים וסיורי שטח דינמיים.
          </p>
        </div>

        {/* Teacher Admin Guidelines Panel */}
        {showTeacherGuide && (
          <div className={`mb-8 p-6 rounded-2xl border transition-all ${
            isLight ? "bg-emerald-50/50 border-emerald-100" : "bg-emerald-950/10 border-emerald-800/30"
          }`}>
            <h3 className={`text-md font-bold text-enrichment mb-2 flex items-center gap-2`}>
              <Info className="w-4 h-4" />
              <span>הנחיות להגדרת הסיור בכיתה (למורים)</span>
            </h3>
            <div className={`text-xs space-y-3 leading-relaxed ${isLight ? "text-zinc-600" : "text-emerald-100/80"}`}>
              <p>
                כדי לאפשר לתלמידים לפתוח את מפת טקטוניקת הלוחות ישירות בתוך דפדפן Google Earth בלחיצת כפתור אחת (ללא צורך בייבוא ידני), מומלץ ליצור <strong>פרויקט Google Earth משותף</strong>:
              </p>
              <ol className="list-decimal list-inside space-y-1.5 pr-1">
                <li>הורידו את קובץ ה-KML מכפתור ההורדה למטה.</li>
                <li>פתחו את <a href="https://earth.google.com/web/" target="_blank" rel="noreferrer" className="underline text-enrichment font-semibold">Google Earth Web</a>, כנסו ללשונית <strong>פרויקטים</strong> (סמל הסיכה והמפה) ולחצו על <strong>ייבוא קובץ KML מהמחשב</strong>.</li>
                <li>לאחר הטעינה, לחצו על כפתור <strong>שיתוף פרויקט</strong> בראש תפריט הפרויקט (מעביר את הפרויקט לאחסון ב-Google Drive שלכם).</li>
                <li>שנו את הגדרות השיתוף ל-<strong>"כל מי שקיבל את הקישור יכול לצפות"</strong> והעתיקו את קישור השיתוף שמתקבל.</li>
                <li>בתוך קוד הקובץ במפתח <code className="px-1.5 py-0.5 bg-black/10 rounded font-mono text-[10px]">TECTONICS_PROJECT.defaultEarthUrl</code> (בשורה 41 בערך בקובץ <code className="px-1 py-0.5 bg-black/10 rounded font-mono text-[10px]">page.tsx</code>), הדביקו את הקישור שהעתקתם.</li>
              </ol>
            </div>
          </div>
        )}

        {/* Project Showcase Section */}
        <div className={`border rounded-3xl p-6 sm:p-8 space-y-8 ${cardStyle}`}>
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b pb-6 border-zinc-200 dark:border-zinc-800">
            {/* Details */}
            <div className="space-y-3 flex-1">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-enrichment/10 rounded-full text-enrichment">
                פעיל כעת
              </span>
              <h2 className={`text-2xl font-black ${textTitle}`}>{TECTONICS_PROJECT.title}</h2>
              <p className={`text-sm leading-relaxed ${textMuted}`}>{TECTONICS_PROJECT.description}</p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row md:flex-col gap-3 min-w-[200px]">
              <a
                href={TECTONICS_PROJECT.defaultEarthUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-enrichment hover:bg-emerald-600 text-zinc-950 font-bold text-sm shadow-lg hover:shadow-emerald-500/10 hover:translate-y-[-2px] transition-all cursor-pointer"
              >
                <Compass className="w-4 h-4" />
                <span>פתיחה ב-Google Earth</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={TECTONICS_PROJECT.downloadUrl}
                download
                className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border font-bold text-sm hover:translate-y-[-2px] transition-all cursor-pointer ${
                  isLight 
                    ? "bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-700" 
                    : "bg-surface hover:bg-surface-hover border-border-custom text-zinc-200 hover:border-enrichment/30"
                }`}
              >
                <Download className="w-4 h-4 text-enrichment" />
                <span>הורדת קובץ KML</span>
                <span className="text-[10px] opacity-60">({TECTONICS_PROJECT.fileSize})</span>
              </a>
            </div>
          </div>

          {/* Graphic Legend (מקרא המפה) */}
          <div className="space-y-4">
            <h3 className={`text-lg font-bold flex items-center gap-2 ${textTitle}`}>
              <Layers className="w-4 h-4 text-enrichment" />
              <span>מקרא המפה (Legend)</span>
            </h3>
            <p className={`text-xs ${textMuted}`}>
              קובץ ה-KML מכיל שכבות מידע צבעוניות המסומנות על פני כדור הארץ. אלו הצבעים שתראו בסיור:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {TECTONICS_PROJECT.legend.map((item, index) => (
                <div 
                  key={index}
                  className={`flex items-start gap-4 p-4 border rounded-2xl transition-all hover:bg-black/5 dark:hover:bg-white/5 ${
                    isLight ? "bg-white border-zinc-100" : "bg-surface/40 border-border-custom"
                  }`}
                >
                  <span className={`w-3.5 h-3.5 rounded-full border-2 shrink-0 mt-1 ${item.color} ${item.borderColor}`} />
                  <div className="space-y-1">
                    <h4 className={`text-sm font-bold ${textTitle}`}>{item.label}</h4>
                    <p className={`text-xs leading-relaxed ${textMuted}`}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Student Instructions */}
          <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <h3 className={`text-lg font-bold flex items-center gap-2 ${textTitle}`}>
              <HelpCircle className="w-4 h-4 text-enrichment" />
              <span>כיצד להשתמש בקובץ? (מדריך לתלמידים)</span>
            </h3>
            
            <div className="space-y-3">
              {TECTONICS_PROJECT.instructions.map((step, index) => (
                <div key={index} className="flex gap-3">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-enrichment/10 text-enrichment text-xs font-bold shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <p className="text-xs sm:text-sm leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer className={`w-full text-center py-6 border-t text-xs relative z-10 bg-surface/10 ${borderTheme} ${textMuted}`}>
        <span>© {new Date().getFullYear()} ניר עוז-ארי — סיורי Google Earth והעשרה מדעית</span>
      </footer>
    </div>
  );
}
