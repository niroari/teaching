"use client";

import React from "react";
import { Presentation, Gamepad2, Sparkles } from "lucide-react";
import PageShell from "@/components/site/PageShell";
import PageHeader from "@/components/site/PageHeader";
import { Badge, LinkCard } from "@/components/site/ui";
import { useVisibility } from "@/lib/context/VisibilityContext";

const ENGLISH_SECTIONS = [
  {
    slug: "crossword-clash",
    title: "Crossword Clash",
    desc: "קרב תשבצים בין קבוצות: מניחים אותיות על הלוח ופותרים הגדרות בזמן אמת.",
    image: "/images/crossword-clash.jpg",
    alt: "תשבץ מודפס",
    link: "/english/crossword-clash",
    badge: "משחק כיתתי",
    category: "משחקים"
  },
  {
    slug: "sentence-auction",
    title: "The Sentence Auction",
    desc: "מכירה פומבית כיתתית של משפטים, לתרגול חוקי הדקדוק ובניית משפטים באנגלית.",
    image: "/images/sentence-auction.jpg",
    alt: "פטיש עץ של מכירות פומביות",
    link: "/english-auction",
    badge: "משחק כיתתי",
    category: "משחקים"
  },
  {
    slug: "adjectives",
    title: "Adjectives · שמות תואר",
    desc: "מצגת על שמות תואר: תפקידם במשפט והשימוש בהם לתיאור שמות עצם.",
    image: "/images/adjectives.jpg",
    alt: "עפרונות צבעוניים",
    link: "/english/adjectives",
    badge: "מצגת",
    category: "מצגות"
  },
  {
    slug: "simone-biles",
    title: "Simone Biles: Present Tenses",
    desc: "תרגול Present Simple ו-Present Progressive לכיתה ז׳, דרך סיפורה של המתעמלת סימון ביילס.",
    image: "/images/simone-biles.jpg",
    alt: "סימון ביילס בקפיצה באולימפיאדת ריו",
    link: "/english/simone-biles",
    badge: "מצגת",
    category: "מצגות"
  },
  {
    slug: "past-simple",
    title: "Past Simple · עבר פשוט",
    desc: "מצגת כיתתית: הוספת d/ed/ied לפעלים רגילים, פעלים יוצאי דופן, ומשפטי חיוב ושלילה.",
    image: "/images/past-simple.jpg",
    alt: "שעון כיס ישן",
    link: "/english/past-simple",
    badge: "מצגת",
    category: "מצגות"
  },
  {
    slug: "chat-masters",
    title: "Chat Masters",
    desc: "שיחה באנגלית עם דמות AI לבחירתכם, לתרגול שיחה יומיומית בקצב שלכם וללא לחץ.",
    image: "/images/chat-masters.jpg",
    alt: "אותיות דפוס מעץ",
    link: "/english/chat-masters",
    badge: "פרויקט להגשה",
    category: "פרויקטים"
  }
];

export default function EnglishHubPage() {
  const { canSee } = useVisibility();

  const CATEGORIES = [
    {
      id: "presentations",
      title: "מצגות",
      subtitle: "הסברי דקדוק עם דוגמאות ותרגול",
      icon: Presentation,
      items: ENGLISH_SECTIONS.filter(sec => canSee(`english.${sec.slug}`) && sec.category === "מצגות")
    },
    {
      id: "games",
      title: "משחקים",
      subtitle: "תרגול בקבוצות, מול הלוח",
      icon: Gamepad2,
      items: ENGLISH_SECTIONS.filter(sec => canSee(`english.${sec.slug}`) && sec.category === "משחקים")
    },
    {
      id: "projects",
      title: "פרויקטים",
      subtitle: "משימות מתמשכות, עם אפשרות הגשה למורה",
      icon: Sparkles,
      items: ENGLISH_SECTIONS.filter(sec => canSee(`english.${sec.slug}`) && sec.category === "פרויקטים")
    }
  ];

  return (
    <PageShell
      subject="english"
      crumbs={[{ label: "אנגלית" }]}
    >
      <PageHeader
        title="אנגלית"
        description="מצגות, משחקים ופרויקטים לתרגול דקדוק, אוצר מילים ושיחה."
      />

      {/* Categories Sections */}
      <div className="space-y-14">
        {CATEGORIES.map((cat) => {
          const IconComponent = cat.icon;
          if (cat.items.length === 0) return null;

          return (
            <section key={cat.id} aria-labelledby={`cat-${cat.id}`}>
              {/* Section Header */}
              <div className="mb-5 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-line pb-3">
                <IconComponent className="h-4 w-4 shrink-0 translate-y-0.5 text-accent" strokeWidth={1.75} aria-hidden />
                <h2 id={`cat-${cat.id}`} className="text-lg font-semibold text-fg">{cat.title}</h2>
                <p className="text-sm text-fg-subtle">{cat.subtitle}</p>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {cat.items.map((sec) => (
                  <LinkCard
                    key={sec.slug}
                    href={sec.link}
                    image={sec.image}
                    imageAlt={sec.alt}
                    title={sec.title}
                    description={sec.desc}
                    meta={<Badge>{sec.badge}</Badge>}
                    cta="לפעילות"
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </PageShell>
  );
}
