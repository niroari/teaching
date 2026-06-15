import React from "react";
import Link from "next/link";
import { ArrowLeft, Map } from "lucide-react";

const WORKSHOPS = [
  {
    slug: "nofadam",
    title: "נופאדם",
    desc: "קריאת נוף והבנת השפעת האדם על הסביבה",
    gradient: "from-amber-950 to-amber-700"
  },
  {
    slug: "mifhaz",
    title: "המהפך הציוני במישור החוף",
    desc: "כיצד שינה הציונות את פני מישור החוף",
    gradient: "from-blue-950 to-blue-700"
  },
  {
    slug: "har",
    title: "ההר כערש האומה",
    desc: "ההר ומשמעותו בעיצוב הזהות הלאומית והתרבותית",
    gradient: "from-yellow-950/80 to-amber-800"
  },
  {
    slug: "teva",
    title: "מפגש טבע בארץ ישראל",
    desc: "הנוף הטבעי של ארץ ישראל — מגוון ביולוגי ואקולוגיה",
    gradient: "from-emerald-950 to-emerald-700"
  },
  {
    slug: "tarbuyot",
    title: "מפגש תרבויות בארץ ישראל",
    desc: "שכבות תרבות, דת ועם שהותירו חותם על הארץ",
    gradient: "from-purple-950 to-purple-700"
  }
];

export default function ShelachHubPage() {
  return (
    <div className="relative min-h-screen bg-[#080c18] text-[#e8edf8] flex flex-col justify-between overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-orange-500/5 via-transparent to-transparent blur-3xl pointer-events-none rounded-full" />

      {/* Main Container */}
      <div className="relative w-full max-w-5xl mx-auto px-6 py-16 flex-1 flex flex-col z-10">
        
        {/* Back link */}
        <Link
          href="/"
          className="self-start inline-flex items-center gap-2 text-sm text-text-muted hover:text-shelach transition-colors mb-8"
        >
          <span>→ חזרה לדף הבית</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-surface border border-border-custom rounded-full text-sm font-bold text-shelach">
            <Map className="w-4 h-4" />
            <span>של״ח</span>
          </div>
          <h1 className="text-4xl font-black text-white mt-4">לימודי ארץ ישראל</h1>
          <p className="text-text-muted text-sm mt-2">בחרו סדנה ללימוד כיתתי או עצמי</p>
        </div>

        {/* Workshops Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-4">
          {WORKSHOPS.map((w) => (
            <Link
              key={w.slug}
              href={`/shelach/${w.slug}`}
              className="group glass-card rounded-2xl border border-border-custom hover:border-shelach/40 hover:shadow-[0_12px_40px_rgba(249,115,22,0.1)] transition-all duration-300 flex flex-col overflow-hidden"
            >
              {/* Header Image Gradient */}
              <div className={`h-36 bg-gradient-to-br ${w.gradient} relative opacity-85 group-hover:opacity-100 transition-opacity`} />
              
              {/* Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-shelach transition-colors">
                    {w.title}
                  </h3>
                  <p className="text-text-muted text-sm mt-3 leading-relaxed">
                    {w.desc}
                  </p>
                </div>
                <div className="mt-8 flex items-center gap-2 text-sm font-bold text-shelach group-hover:translate-x-[-6px] transition-transform">
                  <span>כניסה לסדנה</span>
                  <ArrowLeft className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>

      {/* Footer */}
      <footer className="w-full text-center py-6 border-t border-border-custom text-xs text-text-muted relative z-10 bg-surface/30">
        <span>© {new Date().getFullYear()} ניר עוז-ארי — של״ח וידע הארץ</span>
      </footer>
    </div>
  );
}
