"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Presentation, Gamepad2, GraduationCap, Sparkles } from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";

const ENGLISH_SECTIONS = [
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
    slug: "vocab-trainer",
    title: "אימון אוצר מילים (Vocab Trainer)",
    desc: "הוסיפו את המילים שאתם צריכים ללמוד, ותרגלו אותן דרך כרטיסיות, בחנים אינטראקטיביים ומשחקי התאמה מהירים.",
    bgUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80",
    link: "/english/vocab-trainer",
    badge: "תרגול אישי",
    category: "למידה ותרגול"
  },
  {
    slug: "unseen-practice",
    title: "בלשי האנסין (Unseen Practice)",
    desc: "למדו את השיטה הסודית לפיצוח קטעי קריאה באנגלית בקלות ובמהירות מבלי לקרוא את כל הטקסט מראש!",
    bgUrl: "/detective.png",
    link: "/english/unseen-practice",
    badge: "תרגול אסטרטגיה",
    category: "למידה ותרגול"
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
    slug: "writing-practice",
    title: "תרגול כתיבה (Writing Practice)",
    desc: "שפרו את מיומנות הכתיבה שלכם באנגלית. כיתבו חיבורים או מכתבים וקבלו משוב מיידי מבוסס בינה מלאכותית על דקדוק, מבנה ואוצר מילים.",
    bgUrl: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80",
    link: "/english/writing-practice",
    badge: "אימון כתיבה",
    category: "למידה ותרגול"
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
  const { user } = useAuth();
  const isTeacher = user && (user.email === "niroari@gmail.com" || user.email === "nirozari@gmail.com");

  const sections = [...ENGLISH_SECTIONS];
  if (isTeacher) {
    sections.push({
      slug: "chat-masters-admin",
      title: "לוח מורה: Chat Masters",
      desc: "צפו בשיחות של התלמידים עם ה-AI, העריכו את כרטיסי היציאה והזינו ציונים ומשוב מורה.",
      bgUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80",
      link: "/english/chat-masters/admin",
      badge: "לוח מורה",
      category: "פרויקטים"
    });
  }

  const CATEGORIES = [
    {
      id: "practice",
      title: "למידה ותרגול",
      subtitle: "שינון אוצר מילים, כתיבה ושיפור מיומנויות",
      icon: GraduationCap,
      colorClass: "text-teal-400 bg-teal-500/10 border-teal-500/20",
      items: sections.filter(sec => sec.category === "למידה ותרגול")
    },
    {
      id: "presentations",
      title: "מצגות",
      subtitle: "מצגות למידה והסברי דקדוק אינטראקטיביים",
      icon: Presentation,
      colorClass: "text-sky-400 bg-sky-500/10 border-sky-500/20",
      items: sections.filter(sec => sec.category === "מצגות")
    },
    {
      id: "games",
      title: "משחקים",
      subtitle: "משחקים כיתתיים ואינטראקטיביים לתרגול חווייתי",
      icon: Gamepad2,
      colorClass: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      items: sections.filter(sec => sec.category === "משחקים")
    },
    {
      id: "projects",
      title: "פרויקטים",
      subtitle: "פרויקטים מעשיים ושימוש בבינה מלאכותית לתרגול שפה",
      icon: Sparkles,
      colorClass: "text-purple-400 bg-purple-500/10 border-purple-500/20",
      items: sections.filter(sec => sec.category === "פרויקטים")
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#080c18] text-[#e8edf8] flex flex-col justify-between overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-cyan-500/5 via-transparent to-transparent blur-3xl pointer-events-none rounded-full" />

      {/* Main Container */}
      <div className="relative w-full max-w-5xl mx-auto px-6 py-16 flex-1 flex flex-col z-10">
        
        {/* Back Link */}
        <Link
          href="/"
          className="self-start inline-flex items-center gap-2 text-sm text-text-muted hover:text-english transition-colors mb-8"
        >
          <span>→ חזרה לדף הבית</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-surface border border-border-custom rounded-full text-sm font-bold text-english">
            <BookOpen className="w-4 h-4" />
            <span>אנגלית</span>
          </div>
          <h1 className="text-4xl font-black text-white mt-4">לימודי אנגלית</h1>
          <p className="text-text-muted text-sm mt-2">בחרו כלי לתרגול דקדוק או שינון אוצר מילים</p>
        </div>

        {/* Categories Sections */}
        <div className="space-y-16 w-full mt-4">
          {CATEGORIES.map((cat) => {
            const IconComponent = cat.icon;
            if (cat.items.length === 0) return null;

            return (
              <div key={cat.id} className="relative space-y-6">
                {/* Section Header */}
                <div className="flex items-center gap-3 border-b border-[#1e293b]/70 pb-4 justify-start">
                  <div className={`p-2 rounded-xl border ${cat.colorClass} flex items-center justify-center shrink-0`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{cat.title}</h2>
                    <p className="text-text-muted text-xs mt-0.5">{cat.subtitle}</p>
                  </div>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                  {cat.items.map((sec) => (
                    <Link
                      key={sec.slug}
                      href={sec.link}
                      className="group glass-card rounded-2xl border border-border-custom hover:border-english/40 hover:shadow-[0_12px_40px_rgba(0,200,255,0.1)] transition-all duration-300 flex flex-col overflow-hidden"
                    >
                      {/* Header Image with Gradient overlay */}
                      <div
                        className="h-40 bg-cover bg-center relative"
                        style={{
                          backgroundImage: `url('${sec.bgUrl}')`
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-[#080c18] via-transparent to-transparent opacity-80" />
                        
                        {/* Badge */}
                        <span className="absolute top-4 right-4 text-[10px] font-bold px-2.5 py-1 bg-surface/80 border border-border-custom rounded-full text-text-muted group-hover:text-english group-hover:border-english/30 transition-all">
                          {sec.badge}
                        </span>
                      </div>

                      {/* Body */}
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-white group-hover:text-english transition-colors">
                            {sec.title}
                          </h3>
                          <p className="text-text-muted text-xs leading-relaxed mt-3">
                            {sec.desc}
                          </p>
                        </div>
                        <div className="mt-6 flex items-center gap-2 text-xs font-bold text-english group-hover:translate-x-[-4px] transition-transform">
                          <span>כניסה לפעילות</span>
                          <ArrowLeft className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Footer */}
      <footer className="w-full text-center py-6 border-t border-border-custom text-xs text-text-muted relative z-10 bg-surface/30">
        <span>© {new Date().getFullYear()} ניר עוז-ארי — לימודי אנגלית</span>
      </footer>
    </div>
  );
}
