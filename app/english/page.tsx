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
    title: "Crossword Clash (קרוסוורד קלאש)",
    desc: "קרב תשבצים כיתתי חווייתי בהשראת Crossword Master. קבוצות מתחרות בהנחת אותיות בלוח ופענוח הגדרות בזמן אמת.",
    bgUrl: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=800&q=80",
    link: "/english/crossword-clash",
    badge: "משחק כיתתי חדש",
    category: "משחקים"
  },
  {
    slug: "sentence-auction",
    title: "The Sentence Auction",
    desc: "משחק מכירה פומבית כיתתי מהנה ומאתגר לתרגול ושיפור חוקי הדקדוק ובניית משפטים באנגלית.",
    bgUrl: "/sentence_auction_cover.png",
    link: "/english-auction",
    badge: "משחק כיתתי",
    category: "משחקים"
  },
  {
    slug: "adjectives",
    title: "שמות תואר (Adjectives)",
    desc: "מצגת למידה אינטראקטיבית בנושא שמות תואר באנגלית, תפקידם במשפט ושימוש נכון לתיאור שמות עצם.",
    bgUrl: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=800&q=80",
    link: "/english/adjectives",
    badge: "מצגת למידה",
    category: "מצגות"
  },
  {
    slug: "simone-biles",
    title: "Simone Biles: Present Tenses",
    desc: "תרגול זמני הווה (Present Simple & Progressive) לכיתה ז׳ המבוסס על סיפורה מעורר ההשראה של סימון ביילס.",
    bgUrl: "/simone_biles_cover.png",
    link: "/english/simone-biles",
    badge: "מצגת למידה",
    category: "מצגות"
  },
  {
    slug: "past-simple",
    title: "עבר פשוט (Past Simple)",
    desc: "מצגת למידה כיתתית בנושא עבר פשוט (Past Simple), חוקי הדקדוק, הוספת d/ed/ied לפעלים רגילים, פעלים יוצאי דופן (Irregular Verbs) ומבנה משפטי חיוב ושלילה.",
    bgUrl: "/past_simple_cover.png",
    link: "/english/past-simple",
    badge: "מצגת למידה",
    category: "מצגות"
  },
  {
    slug: "chat-masters",
    title: "שיחה עם חבר AI (Chat Masters)",
    desc: "נהלו שיחה באנגלית עם חבר בינה מלאכותית, בחרו את האופי שלו ותרגלו שיחה יומיומית באנגלית בסביבה תומכת ללא לחץ.",
    bgUrl: "https://images.unsplash.com/photo-1531747118685-ca8fa6e08806?auto=format&fit=crop&w=800&q=80",
    link: "/english/chat-masters",
    badge: "פרויקט כיתתי",
    category: "פרויקטים"
  }
];

export default function EnglishHubPage() {
  const { canSee } = useVisibility();

  const CATEGORIES = [
    {
      id: "presentations",
      title: "מצגות",
      subtitle: "מצגות למידה והסברי דקדוק אינטראקטיביים",
      icon: Presentation,
      items: ENGLISH_SECTIONS.filter(sec => canSee(`english.${sec.slug}`) && sec.category === "מצגות")
    },
    {
      id: "games",
      title: "משחקים",
      subtitle: "משחקים כיתתיים ואינטראקטיביים לתרגול חווייתי",
      icon: Gamepad2,
      items: ENGLISH_SECTIONS.filter(sec => canSee(`english.${sec.slug}`) && sec.category === "משחקים")
    },
    {
      id: "projects",
      title: "פרויקטים",
      subtitle: "פרויקטים מעשיים ושימוש בבינה מלאכותית לתרגול שפה",
      icon: Sparkles,
      items: ENGLISH_SECTIONS.filter(sec => canSee(`english.${sec.slug}`) && sec.category === "פרויקטים")
    }
  ];

  return (
    <PageShell
      subject="english"
      crumbs={[{ label: "אנגלית" }]}
      footer={<span>© {new Date().getFullYear()} ניר עוז-ארי — לימודי אנגלית</span>}
    >
      <PageHeader
        eyebrow={<span>אנגלית</span>}
        title="לימודי אנגלית"
        description="בחרו כלי לתרגול דקדוק או שינון אוצר מילים"
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
                    title={sec.title}
                    description={sec.desc}
                    meta={<Badge>{sec.badge}</Badge>}
                    cta="כניסה לפעילות"
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
