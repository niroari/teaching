import React from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";

const ENGLISH_SECTIONS = [
  {
    slug: "sentence-auction",
    title: "The Sentence Auction",
    desc: "משחק מכירה פומבית כיתתי מהנה ומאתגר לתרגול ושיפור חוקי הדקדוק ובניית משפטים באנגלית.",
    bgUrl: "/sentence_auction_cover.png",
    link: "/english-auction",
    badge: "משחק כיתתי"
  },
  {
    slug: "vocab-trainer",
    title: "אימון אוצר מילים (Vocab Trainer)",
    desc: "הוסיפו את המילים שאתם צריכים ללמוד, ותרגלו אותן דרך כרטיסיות, בחנים אינטראקטיביים ומשחקי התאמה מהירים.",
    bgUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80",
    link: "/english/vocab-trainer",
    badge: "תרגול אישי"
  },
  {
    slug: "unseen-practice",
    title: "בלשי האנסין (Unseen Practice)",
    desc: "למדו את השיטה הסודית לפיצוח קטעי קריאה באנגלית בקלות ובמהירות מבלי לקרוא את כל הטקסט מראש!",
    bgUrl: "/detective.png",
    link: "/english/unseen-practice",
    badge: "תרגול אסטרטגיה"
  },
  {
    slug: "adjectives",
    title: "שמות תואר (Adjectives)",
    desc: "מצגת למידה אינטראקטיבית בנושא שמות תואר באנגלית, תפקידם במשפט ושימוש נכון לתיאור שמות עצם.",
    bgUrl: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=800&q=80",
    link: "/english/adjectives",
    badge: "מצגת למידה"
  },
  {
    slug: "simone-biles",
    title: "Simone Biles: Present Tenses",
    desc: "תרגול זמני הווה (Present Simple & Progressive) לכיתה ז׳ המבוסס על סיפורה מעורר ההשראה של סימון ביילס.",
    bgUrl: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80",
    link: "/english/simone-biles",
    badge: "תרגול ומשחק"
  }
];

export default function EnglishHubPage() {
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

        {/* Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-4">
          {ENGLISH_SECTIONS.map((sec) => (
            <Link
              key={sec.slug}
              href={sec.link}
              className="group glass-card rounded-2xl border border-border-custom hover:border-english/40 hover:shadow-[0_12px_40px_rgba(0,200,255,0.1)] transition-all duration-300 flex flex-col overflow-hidden"
            >
              {/* Header Image with Gradient overlay */}
              <div
                className="h-48 bg-cover bg-center relative"
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
              <div className="p-8 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white group-hover:text-english transition-colors">
                    {sec.title}
                  </h3>
                  <p className="text-text-muted text-sm leading-relaxed mt-4">
                    {sec.desc}
                  </p>
                </div>
                <div className="mt-8 flex items-center gap-2 text-sm font-bold text-english group-hover:translate-x-[-6px] transition-transform">
                  <span>כניסה לפעילות</span>
                  <ArrowLeft className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>

      {/* Footer */}
      <footer className="w-full text-center py-6 border-t border-border-custom text-xs text-text-muted relative z-10 bg-surface/30">
        <span>© {new Date().getFullYear()} ניר עוז-ארי — לימודי אנגלית</span>
      </footer>
    </div>
  );
}
