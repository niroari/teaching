import React from "react";
import PageShell from "@/components/site/PageShell";
import PageHeader from "@/components/site/PageHeader";
import { LinkCard } from "@/components/site/ui";

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
    <PageShell subject="enrichment" crumbs={[{ label: "העשרה", href: "/enrichment" }, { label: "אבולוציה" }]}>
      <PageHeader
        eyebrow={<span>מדעי החיים</span>}
        title="לומדות אבולוציה"
        description="לומדות אינטראקטיביות להעשרה ולחיזוק הידע"
      />

      {/* Modules Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {EVOLUTION_MODULES.map((m) => (
          <LinkCard
            key={m.slug}
            href={m.link}
            meta={
              <span className="text-xs font-medium text-fg-subtle">
                {m.lesson} · {m.stages}
              </span>
            }
            title={m.title}
            description={m.desc}
            cta="להתחיל"
          />
        ))}
      </div>
    </PageShell>
  );
}
