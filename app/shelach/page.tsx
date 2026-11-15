"use client";

import React from "react";
import PageShell from "@/components/site/PageShell";
import PageHeader from "@/components/site/PageHeader";
import { LinkCard } from "@/components/site/ui";
import { useVisibility } from "@/lib/context/VisibilityContext";

const WORKSHOPS = [
  {
    slug: "nofadam",
    image: "/images/shelach-nofadam.jpg",
    alt: "שדות ובריכות דגים בעמק, מבט מהגלבוע",
    title: "נופאדם",
    desc: "קריאת נוף והבנת השפעת האדם על הסביבה",
    gradient: "from-amber-950 to-amber-700"
  },
  {
    slug: "mifhaz",
    image: "/images/shelach-mifhaz.jpg",
    alt: "קו החוף של תל אביב מהאוויר",
    title: "המהפך הציוני במישור החוף",
    desc: "כיצד שינה הציונות את פני מישור החוף",
    gradient: "from-blue-950 to-blue-700"
  },
  {
    slug: "har",
    image: "/images/shelach-har.jpg",
    alt: "ירושלים, מבט על העיר העתיקה",
    title: "ההר כערש האומה",
    desc: "ההר ומשמעותו בעיצוב הזהות הלאומית והתרבותית",
    gradient: "from-yellow-950/80 to-amber-800"
  },
  {
    slug: "teva",
    image: "/images/shelach-teva.jpg",
    alt: "עגורים בעמק החולה",
    title: "מפגש טבע בארץ ישראל",
    desc: "הנוף הטבעי של ארץ ישראל — מגוון ביולוגי ואקולוגיה",
    gradient: "from-emerald-950 to-emerald-700"
  },
  {
    slug: "tarbuyot",
    image: "/images/shelach-tarbuyot.jpg",
    alt: "גגות העיר העתיקה בירושלים",
    title: "מפגש תרבויות בארץ ישראל",
    desc: "שכבות תרבות, דת ועם שהותירו חותם על הארץ",
    gradient: "from-purple-950 to-purple-700"
  },
  {
    slug: "gicha",
    image: "/images/shelach-gicha.jpg",
    alt: "הרי אילת",
    title: "גיחה מחנאית",
    desc: "חלוקת תפקידים כיתתית ל-39 תלמידים, תחומי אחריות וניהול משימות לקראת היציאה לשדה",
    gradient: "from-orange-950 to-amber-700"
  }
];

export default function ShelachHubPage() {
  const { canSee } = useVisibility();
  return (
    <PageShell subject="shelach" crumbs={[{ label: "של״ח" }]}>
      <PageHeader eyebrow={<span>של״ח</span>} title="לימודי ארץ ישראל" description="בחרו סדנה ללימוד כיתתי או עצמי" />

      {/* Workshops Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {WORKSHOPS.filter((w) => canSee(`shelach.${w.slug}`)).map((w) => (
          <LinkCard key={w.slug} href={`/shelach/${w.slug}`} image={w.image} imageAlt={w.alt} title={w.title} description={w.desc} cta="כניסה לסדנה" />
        ))}
      </div>
    </PageShell>
  );
}
