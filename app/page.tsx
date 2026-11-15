"use client";

import React from "react";
import { Lock } from "lucide-react";
import PageShell from "@/components/site/PageShell";
import { EmptyState, LinkCard, Spinner } from "@/components/site/ui";
import { useVisibility } from "@/lib/context/VisibilityContext";
import { CONTENT_ITEMS, Subject } from "@/lib/content-registry";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

const SUBJECT_CARDS: { subject: Subject; href: string; title: string; subtitle: string; desc: string; cta: string; image: string; alt: string }[] = [
  {
    subject: "shelach",
    href: "/shelach",
    title: "של״ח",
    subtitle: "שדה, לאום, חברה",
    desc: "סדנאות על ההיסטוריה, הגאוגרפיה, הטבע והתרבויות של ארץ ישראל, והכנה לגיחות.",
    cta: "לסדנאות",
    image: "/images/shelach.jpg",
    alt: "נוף מדבר יהודה",
  },
  {
    subject: "english",
    href: "/english",
    title: "אנגלית",
    subtitle: "דקדוק, אוצר מילים ושיחה",
    desc: "מצגות דקדוק, משחקי כיתה ותרגול שיחה באנגלית.",
    cta: "לפעילויות",
    image: "/images/english.jpg",
    alt: "אולם ספרייה ישנה עם מדפי ספרים גבוהים",
  },
  {
    subject: "enrichment",
    href: "/enrichment",
    title: "העשרה",
    subtitle: "מעבר לתוכנית הלימודים",
    desc: "אבולוציה, תולדות האדם, אקטואליה וגאוגרפיה: לומדות ומשחקים להרחבת אופקים.",
    cta: "ללומדות",
    image: "/images/enrichment.jpg",
    alt: "ערפילית בצילום טלסקופ החלל ג׳יימס ווב",
  },
  {
    subject: "earth",
    href: "/earth-sciences",
    title: "מדעי כדור הארץ",
    subtitle: "תוכנית שנתית",
    desc: "שיעורים, סימולציות ומשימות חקר באסטרונומיה, באטמוספרה, בגאוספרה ובמשאבי כדור הארץ.",
    cta: "לתוכנית הלימודים",
    image: "/images/earth.jpg",
    alt: "כדור הארץ בצילום מהחלל",
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
        <h1 className="text-4xl font-semibold tracking-tight text-fg sm:text-5xl">
          {SITE_NAME}
          <span className="mt-2 block text-xl font-normal tracking-normal text-fg-muted sm:text-2xl">{SITE_TAGLINE}</span>
        </h1>
        <p className="mt-5 text-base leading-relaxed text-fg-muted">
          שיעורים, מצגות, משימות ומשחקי כיתה במקום אחד. בחרו תחום כדי להתחיל.
        </p>
      </div>

      {/* Subjects Grid */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : shownCount === 0 ? (
        <EmptyState icon={<Lock className="h-5 w-5" strokeWidth={1.75} />} title="עדיין אין תכנים פתוחים">
          תכנים חדשים יופיעו כאן ברגע שהמורה יפרסם אותם. קיבלתם קישור ישיר מהמורה? אפשר להיכנס דרכו.
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
              imageAlt={c.alt}
              priority={i < 2}
              title={c.title}
              subtitle={c.subtitle}
              description={c.desc}
              cta={c.cta}
              meta={<span className="text-xs text-fg-subtle tabular-nums">{openCount(c.subject)} תכנים</span>}
            />
          ))}
        </div>
      )}
    </PageShell>
  );
}
