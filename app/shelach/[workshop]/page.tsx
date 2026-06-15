"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, BookOpen, ChevronDown } from "lucide-react";

const WORKSHOPS_DATA: Record<string, { title: string; desc: string }> = {
  nofadam: {
    title: "נופאדם",
    desc: "קריאת נוף והבנת השפעת האדם על הסביבה"
  },
  mifhaz: {
    title: "המהפך הציוני במישור החוף",
    desc: "כיצד שינה הציונות את פני מישור החוף"
  },
  har: {
    title: "ההר כערש האומה",
    desc: "ההר ומשמעותו בעיצוב הזהות הלאומית והתרבותית"
  },
  teva: {
    title: "מפגש טבע בארץ ישראל",
    desc: "הנוף הטבעי של ארץ ישראל — מגוון ביולוגי ואקולוגיה"
  },
  tarbuyot: {
    title: "מפגש תרבויות בארץ ישראל",
    desc: "שכבות תרבות, דת ועם שהותירו חותם על הארץ"
  }
};

export default function WorkshopPage() {
  const { workshop } = useParams();
  const slug = typeof workshop === "string" ? workshop : "";
  const data = WORKSHOPS_DATA[slug] || { title: "סדנה לא נמצאה", desc: "" };

  // Accordion state (array of booleans for 6 lessons)
  const [openLessons, setOpenLessons] = useState<boolean[]>(new Array(6).fill(false));

  const toggleLesson = (index: number) => {
    setOpenLessons(prev => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  return (
    <div className="relative min-h-screen bg-[#080c18] text-[#e8edf8] flex flex-col justify-between overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-orange-500/5 via-transparent to-transparent blur-3xl pointer-events-none rounded-full" />

      {/* Main Container */}
      <div className="relative w-full max-w-3xl mx-auto px-6 py-16 flex-1 flex flex-col z-10">
        
        {/* Back Link */}
        <Link
          href="/shelach"
          className="self-start inline-flex items-center gap-2 text-sm text-text-muted hover:text-shelach transition-colors mb-8"
        >
          <span>→ חזרה לסדנאות של״ח</span>
        </Link>

        {/* Header */}
        <div className="mb-12 text-right">
          <p className="text-sm font-bold text-shelach tracking-wide">של״ח · סדנה</p>
          <h1 className="text-4xl font-black text-white mt-3 leading-tight">{data.title}</h1>
          <p className="text-text-muted text-base mt-3 leading-relaxed">{data.desc}</p>
        </div>

        {/* Lessons Accordion */}
        <div className="space-y-4">
          {new Array(6).fill(null).map((_, index) => {
            const isOpen = openLessons[index];
            return (
              <div
                key={index}
                className={`glass-card rounded-2xl border transition-all duration-200 overflow-hidden ${isOpen ? 'border-shelach/40' : 'border-border-custom'}`}
              >
                {/* Header */}
                <button
                  onClick={() => toggleLesson(index)}
                  className="w-full flex items-center justify-between px-6 py-5 cursor-pointer text-right focus:outline-none"
                >
                  <span className="font-bold text-base text-white hover:text-shelach transition-colors">
                    שיעור {index + 1}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-text-muted transition-transform duration-200 ${isOpen ? 'rotate-180 text-shelach' : ''}`} />
                </button>

                {/* Body Content */}
                {isOpen && (
                  <div className="px-6 pb-6 pt-3 space-y-5 border-t border-border-custom/50 bg-[#0c1222]/30">
                    
                    {/* Presentations Section */}
                    <div className="space-y-2">
                      <h4 className="text-xs text-shelach font-bold tracking-wider">מצגות לשיעור</h4>
                      <div className="bg-[#111827]/40 border border-border-custom rounded-xl p-4 flex justify-between items-center text-sm">
                        <span className="text-text-muted">מצגת לשיעור זה תתווסף בקרוב</span>
                        <span className="text-[10px] px-2.5 py-1 bg-surface border border-border-custom rounded-full text-text-muted font-bold">בקרוב</span>
                      </div>
                    </div>

                    {/* Activities Section */}
                    <div className="space-y-2">
                      <h4 className="text-xs text-shelach font-bold tracking-wider">פעילויות ובחנים</h4>
                      <div className="bg-[#111827]/40 border border-border-custom rounded-xl p-4 flex justify-between items-center text-sm">
                        <span className="text-text-muted">פעילות לשיעור זה תתווסף בקרוב</span>
                        <span className="text-[10px] px-2.5 py-1 bg-surface border border-border-custom rounded-full text-text-muted font-bold">בקרוב</span>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>

      {/* Footer */}
      <footer className="w-full text-center py-6 border-t border-border-custom text-xs text-text-muted relative z-10 bg-surface/30">
        <span>© {new Date().getFullYear()} ניר עוז-ארי — של״ח וידע הארץ</span>
      </footer>
    </div>
  );
}
