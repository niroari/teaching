"use client";

import React from "react";
import { Lock } from "lucide-react";
import PageShell from "@/components/site/PageShell";
import { EmptyState, LinkCard, Spinner } from "@/components/site/ui";
import { useVisibility } from "@/lib/context/VisibilityContext";
import { CONTENT_ITEMS, Subject } from "@/lib/content-registry";

const SUBJECT_CARDS: { subject: Subject; href: string; title: string; subtitle: string; desc: string; cta: string; image: string }[] = [
  {
    subject: "shelach",
    href: "/shelach",
    title: "של״ח",
    subtitle: "לימודי ארץ ישראל",
    desc: "סדנאות למידה אינטראקטיביות העוסקות בהיסטוריה, גיאוגרפיה, טבע ורב-תרבותיות בארץ ישראל.",
    cta: "כניסה לסדנאות",
    image: "/shelach_cover.png",
  },
  {
    subject: "english",
    href: "/english",
    title: "אנגלית",
    subtitle: "תרגול דקדוק ואוצר מילים",
    desc: "משחק מכירה פומבית כיתתי לתרגול חוקי דקדוק, וכלי אינטראקטיבי לשינון ותרגול מותאם אישית של אוצר מילים.",
    cta: "כניסה לתרגול",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80",
  },
  {
    subject: "enrichment",
    href: "/enrichment",
    title: "העשרה",
    subtitle: "מחוץ לתוכנית הלימודים",
    desc: "לומדות בנושאים מרתקים ומדעיים, כולל מודולים אינטראקטיביים מעמיקים בנושא אבולוציה.",
    cta: "כניסה ללומדות",
    image: "/ev-fossil.jpg",
  },
  {
    subject: "earth",
    href: "/earth-sciences",
    title: "מדעי כדור הארץ",
    subtitle: "תוכנית לימודים שנתית",
    desc: "מצגות, מערכי שיעור אינטראקטיביים ויישומונים מדעיים באסטרונומיה, אטמוספרה, גאוספרה ומשאבים.",
    cta: "כניסה לתוכנית",
    image: "/white-island-volcano.jpg",
  },
];

export default function PortalHomePage() {
  const { loading, canSeeSubject, canSee } = useVisibility();
  const cards = SUBJECT_CARDS.filter((c) => canSeeSubject(c.subject));
  const shownCount = cards.length;
  const openCount = (subject: Subject) => CONTENT_ITEMS.filter((i) => i.subject === subject && canSee(i.id)).length;

  return (
    <PageShell>
      {/* Header Section */}
      <div className="mb-12 max-w-2xl sm:mb-16">
        <p className="text-sm font-medium text-fg-muted">
          <span>פורטל פדגוגי דיגיטלי</span>
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-fg sm:text-5xl">
          ניר עוז-ארי
          <span className="mt-2 block text-xl font-normal tracking-normal text-fg-muted sm:text-2xl">
            חומרי לימוד ולומדות אינטראקטיביות
          </span>
        </h1>
        <p className="mt-5 text-base leading-relaxed text-fg-muted">
          בחרו נושא לימוד כדי להתחיל בשיעור, לומדה או משחק כיתתי אינטראקטיבי.
        </p>
      </div>

      {/* Subjects Grid */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : shownCount === 0 ? (
        <EmptyState icon={<Lock className="h-5 w-5" strokeWidth={1.75} />} title="המורה עוד לא פתח תכנים">
          כשהמורה יפרסם שיעור, מצגת או משימה, הם יופיעו כאן. אם קיבלתם קישור ישיר מהמורה, אפשר להיכנס דרכו.
        </EmptyState>
      ) : (
        <div
          className={`grid grid-cols-1 gap-5 ${
            shownCount >= 4
              ? "sm:grid-cols-2 lg:grid-cols-4"
              : shownCount === 3
              ? "sm:grid-cols-2 lg:grid-cols-3"
              : shownCount === 2
              ? "max-w-3xl sm:grid-cols-2"
              : "max-w-sm"
          }`}
        >
          {cards.map((c, i) => (
            <LinkCard
              key={c.subject}
              subject={c.subject}
              href={c.href}
              image={c.image}
              priority={i < 2}
              title={c.title}
              subtitle={c.subtitle}
              description={c.desc}
              cta={c.cta}
              meta={<span className="text-xs text-fg-subtle tabular-nums">{openCount(c.subject)} פריטים</span>}
            />
          ))}
        </div>
      )}
    </PageShell>
  );
}
