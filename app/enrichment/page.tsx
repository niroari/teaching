import React from "react";
import Link from "next/link";
import { ArrowLeft, Microscope } from "lucide-react";

const ENRICHMENT_TOPICS = [
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
    slug: "snakes",
    title: "נחשים בישראל",
    desc: "מצגת אינטראקטיבית ולמידה על סוגי הנחשים השונים בארץ, התגוננות ועזרה ראשונה.",
    icon: "🐍",
    link: "/snakes",
    badge: "לומדה"
  }
];

export default function EnrichmentHubPage() {
  return (
    <div className="relative min-h-screen bg-[#080c18] text-[#e8edf8] flex flex-col justify-between overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent blur-3xl pointer-events-none rounded-full" />

      {/* Main Container */}
      <div className="relative w-full max-w-5xl mx-auto px-6 py-16 flex-1 flex flex-col z-10">
        
        {/* Back Link */}
        <Link
          href="/"
          className="self-start inline-flex items-center gap-2 text-sm text-text-muted hover:text-enrichment transition-colors mb-8"
        >
          <span>→ חזרה לדף הבית</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-surface border border-border-custom rounded-full text-sm font-bold text-enrichment">
            <Microscope className="w-4 h-4" />
            <span>העשרה</span>
          </div>
          <h1 className="text-4xl font-black text-white mt-4">העשרה מדעית</h1>
          <p className="text-text-muted text-sm mt-2">נושאים מרתקים מחוץ לתוכנית הלימודים הרגילה</p>
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-4">
          {ENRICHMENT_TOPICS.map((topic) => (
            <Link
              key={topic.slug}
              href={topic.link}
              className="group glass-card rounded-3xl border border-border-custom hover:border-enrichment/40 hover:shadow-[0_12px_40px_rgba(74,222,128,0.1)] transition-all duration-300 p-8 flex flex-col items-center text-center relative overflow-hidden"
            >
              {/* Badge */}
              <span className="absolute top-4 right-4 text-[10px] font-bold px-2 py-0.5 bg-surface border border-border-custom rounded-full text-text-muted group-hover:text-enrichment group-hover:border-enrichment/30 transition-all">
                {topic.badge}
              </span>

              {/* Icon */}
              <span className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300 block">
                {topic.icon}
              </span>

              <h3 className="text-xl font-bold text-white group-hover:text-enrichment transition-colors">
                {topic.title}
              </h3>
              
              <p className="text-text-muted text-sm mt-3 leading-relaxed flex-1">
                {topic.desc}
              </p>

              <div className="mt-8 flex items-center gap-2 text-sm font-bold text-enrichment group-hover:translate-x-[-6px] transition-transform">
                <span>כניסה ללומדה</span>
                <ArrowLeft className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>

      </div>

      {/* Footer */}
      <footer className="w-full text-center py-6 border-t border-border-custom text-xs text-text-muted relative z-10 bg-surface/30">
        <span>© {new Date().getFullYear()} ניר עוז-ארי — העשרה ומדע</span>
      </footer>
    </div>
  );
}
