import React from "react";
import PageShell from "@/components/site/PageShell";
import PageHeader from "@/components/site/PageHeader";
import { LinkCard } from "@/components/site/ui";

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
    title: "כוחם של סיפורים (מדומיינים)",
    desc: "על מיתוסים משותפים, סדר מדומיין והיכולת של אלפי זרים לשתף פעולה סביב סיפורים משותפים.",
    color: "group-hover:text-amber-400 text-amber-500",
    borderGlow: "hover:border-amber-500/40 hover:shadow-[0_12px_40px_rgba(245,158,11,0.1)]"
  },
  {
    num: "שיעור 3",
    slug: "lesson-3",
    title: "המהפכה החקלאית",
    desc: "האם ביות הצמחים והבעלי חיים היה שדרוג לחיינו, או שמא המלכודת הגדולה ביותר בהיסטוריה?",
    color: "group-hover:text-amber-400 text-amber-500",
    borderGlow: "hover:border-amber-500/40 hover:shadow-[0_12px_40px_rgba(245,158,11,0.1)]"
  },
  {
    num: "שיעור 4",
    slug: "lesson-4",
    title: "תוצאות החקלאות",
    desc: "על חרדות המחר, יצירת המעמדות והאי-שוויון, וצמיחתן של אימפריות וערים גדולות בעקבות החקלאות.",
    color: "group-hover:text-amber-400 text-amber-500",
    borderGlow: "hover:border-amber-500/40 hover:shadow-[0_12px_40px_rgba(245,158,11,0.1)]"
  },
  {
    num: "שיעור 5",
    slug: "lesson-5",
    title: "המהפכה המדעית",
    desc: "כיצד ההודאה באי-ידיעה והשילוב בין מדע, כוח וכסף הולידו את העולם המודרני והתעשייתי.",
    color: "group-hover:text-amber-400 text-amber-500",
    borderGlow: "hover:border-amber-500/40 hover:shadow-[0_12px_40px_rgba(245,158,11,0.1)]"
  },
  {
    num: "שיעור 6",
    slug: "lesson-6",
    title: "העתיד",
    desc: "מהנדסה גנטית ועד בינה מלאכותית — האם ההומו סאפיינס בדרך להחליף את עצמו בישות חדשה?",
    color: "group-hover:text-amber-400 text-amber-500",
    borderGlow: "hover:border-amber-500/40 hover:shadow-[0_12px_40px_rgba(245,158,11,0.1)]"
  }
];

export default function HumanHistoryHubPage() {
  return (
    <PageShell
      subject="enrichment"
      crumbs={[{ label: "העשרה", href: "/enrichment" }, { label: "קיצור תולדות האנושות" }]}
    >
      <PageHeader
        eyebrow={<span>היסטוריה אנושית</span>}
        title="קיצור תולדות האנושות"
        description="שישה שיעורים בעקבות ספרו של פרופ' יובל נוח הררי"
      />

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {HUMAN_HISTORY_LESSONS.map((l) => (
          <LinkCard
            key={l.slug}
            href={`/enrichment/human-history/${l.slug}`}
            meta={<span className="text-xs font-medium text-fg-subtle">{l.num}</span>}
            title={l.title}
            description={l.desc}
            cta="פתח מצגת שיעור"
          />
        ))}
      </div>
    </PageShell>
  );
}
