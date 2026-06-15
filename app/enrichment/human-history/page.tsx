import React from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";

const HUMAN_HISTORY_LESSONS = [
  {
    num: "שיעור 1",
    slug: "lesson-1",
    title: "המהפכה הקוגניטיבית",
    desc: "כיצד הפך מין של קופי אדם חסרי חשיבות לשליטי כדור הארץ בזכות כוחו של הדמיון.",
    color: "group-hover:text-amber-400 text-amber-500",
    borderGlow: "hover:border-amber-500/40 hover:shadow-[0_12px_40px_rgba(245,158,11,0.1)]"
  },
  {
    num: "שיעור 2",
    slug: "lesson-2",
    title: "המהפכה החקלאית",
    desc: "האם החקלאות הייתה שדרוג לחיי המין האנושי, או שמא המלכודת הגדולה בהיסטוריה?",
    color: "group-hover:text-amber-400 text-amber-500",
    borderGlow: "hover:border-amber-500/40 hover:shadow-[0_12px_40px_rgba(245,158,11,0.1)]"
  },
  {
    num: "שיעור 3",
    slug: "lesson-3",
    title: "איחוד האנושות",
    desc: "שלושת הגורמים המאחדים הגדולים של האנושות: הכסף, האימפריות והדתות הגלובליות.",
    color: "group-hover:text-amber-400 text-amber-500",
    borderGlow: "hover:border-amber-500/40 hover:shadow-[0_12px_40px_rgba(245,158,11,0.1)]"
  },
  {
    num: "שיעור 4",
    slug: "lesson-4",
    title: "המהפכה המדעית",
    desc: "כיצד ההודאה באי-ידיעה והשילוב בין מדע לאימפריאליזם הולידו את העולם המודרני.",
    color: "group-hover:text-amber-400 text-amber-500",
    borderGlow: "hover:border-amber-500/40 hover:shadow-[0_12px_40px_rgba(245,158,11,0.1)]"
  },
  {
    num: "שיעור 5",
    slug: "lesson-5",
    title: "המהפכה התעשייתית",
    desc: "על גילוי האנרגיה וחומרי הגלם החדשים, כניסתו של השעון לחיינו והתמוטטות המשפחה והקהילה.",
    color: "group-hover:text-amber-400 text-amber-500",
    borderGlow: "hover:border-amber-500/40 hover:shadow-[0_12px_40px_rgba(245,158,11,0.1)]"
  },
  {
    num: "שיעור 6",
    slug: "lesson-6",
    title: "העתיד של המין האנושי",
    desc: "מהאינטליגנציה המלאכותית ועד הנדסה גנטית — האם אנחנו בדרך להפוך לאלים?",
    color: "group-hover:text-amber-400 text-amber-500",
    borderGlow: "hover:border-amber-500/40 hover:shadow-[0_12px_40px_rgba(245,158,11,0.1)]"
  }
];

export default function HumanHistoryHubPage() {
  return (
    <div className="relative min-h-screen bg-[#080c18] text-[#e8edf8] flex flex-col justify-between overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent blur-3xl pointer-events-none rounded-full" />

      {/* Main Container */}
      <div className="relative w-full max-w-5xl mx-auto px-6 py-16 flex-1 flex flex-col z-10">
        
        {/* Back Link */}
        <Link
          href="/enrichment"
          className="self-start inline-flex items-center gap-2 text-sm text-text-muted hover:text-amber-400 transition-colors mb-8"
        >
          <span>→ חזרה להעשרה</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-surface border border-border-custom rounded-full text-sm font-bold text-amber-500">
            <BookOpen className="w-4 h-4" />
            <span>היסטוריה אנושית</span>
          </div>
          <h1 className="text-4xl font-black text-white mt-4">קיצור תולדות האנושות</h1>
          <p className="text-text-muted text-sm mt-2">שישה שיעורים בעקבות ספרו של פרופ' יובל נוח הררי</p>
        </div>

        {/* Lessons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-4">
          {HUMAN_HISTORY_LESSONS.map((l) => (
            <Link
              key={l.slug}
              href={`/enrichment/human-history/${l.slug}`}
              className={`group glass-card rounded-2xl border border-border-custom transition-all duration-300 p-6 flex flex-col justify-between ${l.borderGlow}`}
            >
              <div>
                <span className="text-text-muted text-[10px] font-bold tracking-wider uppercase">
                  {l.num}
                </span>
                <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors mt-2">
                  {l.title}
                </h3>
                <p className="text-text-muted text-sm mt-3 leading-relaxed">
                  {l.desc}
                </p>
              </div>

              <div className="mt-8 flex items-center gap-2 text-sm font-bold text-amber-500 group-hover:translate-x-[-6px] transition-transform">
                <span>פתח מצגת שיעור</span>
                <ArrowLeft className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>

      </div>

      {/* Footer */}
      <footer className="w-full text-center py-6 border-t border-border-custom text-xs text-text-muted relative z-10 bg-surface/30">
        <span>© {new Date().getFullYear()} ניר עוז-ארי — קיצור תולדות האנושות</span>
      </footer>
    </div>
  );
}
