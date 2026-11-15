"use client";

import React from "react";
import PageShell from "@/components/site/PageShell";
import PageHeader from "@/components/site/PageHeader";
import { Badge, LinkCard } from "@/components/site/ui";
import { useVisibility } from "@/lib/context/VisibilityContext";

const ENRICHMENT_TOPICS = [
  {
    slug: "israeli-politics",
    image: "/images/enrichment-israeli-politics.jpg",
    alt: "משכן הכנסת",
    title: "עושים סדר בפוליטיקה הישראלית",
    desc: "שיעור דיאלוג ומצגת אינטראקטיבית: ציר הזמן, שדה הכוחות, אידיאולוגיה מול מחנה ודיון מאוזן ומכבד לקראת הבחירות.",
    icon: "🗳️",
    link: "/enrichment/israeli-politics",
    badge: "שיעור דיאלוג ומצגת"
  },
  {
    slug: "israel-game",
    image: "/images/enrichment-israel-game.jpg",
    alt: "ישראל, סיני והנילוס מתחנת החלל",
    title: "חידון מפת ישראל",
    desc: "פעילות כיתתית אינטראקטיבית. מקמו מקומות, ערים, ואתרי מורשת רנדומליים על מפת כיתה פיזית.",
    icon: "📍",
    link: "/enrichment/israel-game",
    badge: "משחק כיתתי"
  },
  {
    slug: "evolution",
    image: "/images/enrichment-evolution.jpg",
    alt: "מאובן ארכאופטריקס, ברלין",
    title: "אבולוציה",
    desc: "כיצד החיים על כדור הארץ השתנו לאורך מיליארדי שנים — מגוון לומדות אינטראקטיביות.",
    icon: "🧬",
    link: "/enrichment/evolution",
    badge: "4 מודולים"
  },
  {
    slug: "human-history",
    image: "/images/enrichment-human-history.jpg",
    alt: "ציורי מערת לאסקו (העתק)",
    title: "קיצור תולדות האנושות",
    desc: "שישה שיעורים אינטראקטיביים המבוססים על ספרו של יובל נוח הררי - היסטוריה של המין האנושי.",
    icon: "🌍",
    link: "/enrichment/human-history",
    badge: "6 שיעורים"
  },
  {
    slug: "google-earth",
    image: "/images/enrichment-google-earth.jpg",
    alt: "העתק סן אנדראס מהאוויר",
    title: "סיורי Google Earth",
    desc: "סיורים אינטראקטיביים בתלת-ממד. הכירו את לוחות הטקטוניקה של כדור הארץ ועוד.",
    icon: "🗺️",
    link: "/enrichment/google-earth",
    badge: "קובצי KML"
  },
  {
    slug: "snakes",
    image: "/images/enrichment-snakes.jpg",
    alt: "צפע ארצישראלי",
    title: "נחשים בישראל",
    desc: "מצגת אינטראקטיבית ולמידה על סוגי הנחשים השונים בארץ, התגוננות ועזרה ראשונה.",
    icon: "🐍",
    link: "/snakes",
    badge: "לומדה"
  }
];

export default function EnrichmentHubPage() {
  const { canSee } = useVisibility();
  return (
    <PageShell subject="enrichment" crumbs={[{ label: "העשרה" }]}>
      <PageHeader
        eyebrow={<span>העשרה ומדע</span>}
        title="העשרה מדעית וחברתית"
        description="נושאים מרתקים, לומדות ושיעורי דיאלוג מחוץ לתוכנית הלימודים הרגילה"
      />

      {/* Topics Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {ENRICHMENT_TOPICS.filter((topic) => canSee(`enrichment.${topic.slug}`)).map((topic) => (
          <LinkCard
            key={topic.slug}
            href={topic.link}
            image={topic.image}
            imageAlt={topic.alt}
            title={topic.title}
            description={topic.desc}
            meta={<Badge>{topic.badge}</Badge>}
            cta="כניסה ללומדה"
          />
        ))}
      </div>
    </PageShell>
  );
}
