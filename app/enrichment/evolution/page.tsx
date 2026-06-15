import React from "react";
import Link from "next/link";
import { ArrowLeft, Dna } from "lucide-react";

const EVOLUTION_MODULES = [
  {
    slug: "intro",
    title: "אבולוציה",
    lesson: "שיעור 1",
    desc: "כיצד החיים משתנים לאורך הזמן — מהברירה הטבעית ועד ראיות המדע",
    icon: "🦕",
    stages: "7 שלבים · כולל בוחן",
    accentClass: "hover:border-[#4ade80]/40 hover:shadow-[0_12px_40px_rgba(74,222,128,0.1)] text-[#4ade80]",
    badgeClass: "bg-[#4ade80] text-zinc-950",
    link: "/evolution.html"
  },
  {
    slug: "arms-race",
    title: "מירוץ החימוש בטבע",
    lesson: "שיעור 2",
    desc: "כשטורף ונטרף מפתחים זה את זה — הסוואה, רעלים, וחיקוי מטעה",
    icon: "⚔️",
    stages: "5 שלבים · כולל בוחן",
    accentClass: "hover:border-[#f59e0b]/40 hover:shadow-[0_12px_40px_rgba(245,158,11,0.1)] text-[#f59e0b]",
    badgeClass: "bg-[#f59e0b] text-zinc-950",
    link: "/coevolution.html"
  },
  {
    slug: "human",
    title: "אבולוציה אנושית",
    lesson: "שיעור 3",
    desc: "מאיפה הגענו? המסע של המין האנושי מהאב הקדמון ועד היום",
    icon: "🦴",
    stages: "5 שלבים · כולל בוחן",
    accentClass: "hover:border-[#60a5fa]/40 hover:shadow-[0_12px_40px_rgba(96,165,250,0.1)] text-[#60a5fa]",
    badgeClass: "bg-[#60a5fa] text-zinc-950",
    link: "/humanevolution.html"
  },
  {
    slug: "challenges",
    title: "ויכוחים ואתגרים",
    lesson: "שיעור 4",
    desc: "למה אנשים לא מסכימים עם תיאוריית האבולוציה — ומה המדע עונה",
    icon: "⚖️",
    stages: "5 שלבים · כולל בוחן",
    accentClass: "hover:border-[#a78bfa]/40 hover:shadow-[0_12px_40px_rgba(167,139,250,0.1)] text-[#a78bfa]",
    badgeClass: "bg-[#a78bfa] text-zinc-950",
    link: "/controversies.html"
  }
];

export default function EvolutionHubPage() {
  return (
    <div className="relative min-h-screen bg-[#080c18] text-[#e8edf8] flex flex-col justify-between overflow-hidden">
      {/* Background DNA Glow Pattern */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent blur-3xl pointer-events-none rounded-full" />

      {/* Main Container */}
      <div className="relative w-full max-w-5xl mx-auto px-6 py-12 flex-1 flex flex-col z-10">
        
        {/* Back Link */}
        <Link
          href="/enrichment"
          className="self-start inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-enrichment transition-colors mb-8"
        >
          <span>→ חזרה להעשרה</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface border border-border-custom rounded-full text-xs font-bold text-enrichment">
            <Dna className="w-3.5 h-3.5" />
            <span>מדעי החיים</span>
          </div>
          <h1 className="text-3xl font-black text-white mt-3">לומדות אבולוציה</h1>
          <p className="text-text-muted text-xs mt-2">לומדות אינטראקטיביות להעשרה ולחיזוק הידע</p>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full mt-4">
          {EVOLUTION_MODULES.map((m) => (
            <Link
              key={m.slug}
              href={m.link}
              className={`group glass-card rounded-2xl border border-border-custom transition-all duration-300 p-6 flex flex-col items-center text-center ${m.accentClass}`}
            >
              <span className="text-text-muted text-[10px] font-bold tracking-wider uppercase mb-1">
                {m.lesson}
              </span>
              
              <span className="text-5xl my-4 group-hover:scale-110 transition-transform duration-300 block">
                {m.icon}
              </span>

              <h3 className="text-base font-bold text-white group-hover:text-inherit transition-colors">
                {m.title}
              </h3>
              
              <p className="text-text-muted text-xs mt-3 leading-relaxed flex-1">
                {m.desc}
              </p>

              <span className="text-[10px] text-text-muted font-semibold mt-4 mb-5">
                {m.stages}
              </span>

              <span className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${m.badgeClass}`}>
                להתחיל ←
              </span>
            </Link>
          ))}
        </div>

      </div>

      {/* Footer */}
      <footer className="w-full text-center py-6 border-t border-border-custom text-[10px] text-text-muted relative z-10 bg-surface/30">
        <span>© {new Date().getFullYear()} ניר עוז-ארי — אבולוציה ומדעי החיים</span>
      </footer>
    </div>
  );
}
