"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, GraduationCap, LogIn, LogOut, User } from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";

export default function PortalHomePage() {
  const { user, logout } = useAuth();

  return (
    <div className="relative min-h-screen bg-[#080c18] text-[#e8edf8] flex flex-col justify-between overflow-hidden">
      {/* Top Header Bar */}
      <header className="w-full max-w-6xl mx-auto px-6 pt-8 flex justify-between items-center relative z-20">
        <div className="flex items-center gap-2">
          {/* Subtle decoration or leave empty */}
        </div>
        <div>
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-surface border border-border-custom rounded-xl px-4 py-2 text-xs text-zinc-300">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-bold">שלום, {user.displayName || user.email || "תלמיד/ה"}</span>
              </div>
              <button
                onClick={() => logout()}
                className="px-3.5 py-2 rounded-xl border border-red-950/40 bg-red-950/10 hover:bg-red-900/20 text-red-400 text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>התנתק</span>
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-zinc-950 text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 shadow-lg shadow-cyan-500/10 border border-cyan-400/20"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>התחברות תלמידים</span>
            </Link>
          )}
        </div>
      </header>

      {/* Dynamic Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/5 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-sky-500/5 blur-3xl rounded-full pointer-events-none" />

      {/* Main Container */}
      <div className="relative w-full max-w-6xl mx-auto px-6 py-12 flex-1 flex flex-col justify-center items-center z-10">
        
        {/* Header Section */}
        <div className="text-center mb-20 space-y-4">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-surface border border-border-custom rounded-full text-sm font-bold text-text-muted">
            <GraduationCap className="w-4 h-4 text-amber-400" />
            <span>פורטל פדגוגי דיגיטלי</span>
          </div>
          <h1 className="text-6xl font-black tracking-tight text-white mt-6">
            ניר עוז-ארי
            <span className="block mt-3 text-3xl font-bold bg-gradient-to-r from-amber-400 via-sky-400 to-emerald-400 bg-clip-text text-transparent">
              חומרי לימוד ולומדות אינטראקטיביות
            </span>
          </h1>
          <p className="text-text-muted max-w-xl mx-auto text-base md:text-lg leading-relaxed pt-2">
            בחרו נושא לימוד כדי להתחיל בשיעור, לומדה או משחק כיתתי אינטראקטיבי.
          </p>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          
          {/* Card: של"ח */}
          <Link
            href="/shelach"
            className="group glass-card rounded-2xl border border-border-custom hover:border-shelach/40 hover:shadow-[0_12px_40px_rgba(249,115,22,0.12)] transition-all duration-300 flex flex-col overflow-hidden"
          >
            {/* Header Image with Gradient overlay */}
            <div
              className="h-48 bg-cover bg-center relative"
              style={{
                backgroundImage: `url('/shelach_cover.png')`
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#080c18] via-transparent to-transparent opacity-80" />
            </div>
            {/* Body */}
            <div className="p-8 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white group-hover:text-shelach transition-colors">של״ח</h3>
                <p className="text-sm font-semibold text-shelach/80 mt-1.5">לימודי ארץ ישראל</p>
                <p className="text-text-muted text-sm leading-relaxed mt-4">
                  סדנאות למידה אינטראקטיביות העוסקות בהיסטוריה, גיאוגרפיה, טבע ורב-תרבותיות בארץ ישראל.
                </p>
              </div>
              <div className="mt-8 flex items-center gap-2 text-sm font-bold text-shelach group-hover:translate-x-[-6px] transition-transform">
                <span>כניסה לסדנאות</span>
                <ArrowLeft className="w-4 h-4" />
              </div>
            </div>
          </Link>

          {/* Card: אנגלית */}
          <Link
            href="/english"
            className="group glass-card rounded-2xl border border-border-custom hover:border-english/40 hover:shadow-[0_12px_40px_rgba(0,200,255,0.12)] transition-all duration-300 flex flex-col overflow-hidden"
          >
            {/* Header Image */}
            <div
              className="h-48 bg-cover bg-center relative"
              style={{
                backgroundImage: `url('/english_cover.png')`
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#080c18] via-transparent to-transparent opacity-80" />
            </div>
            {/* Body */}
            <div className="p-8 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white group-hover:text-english transition-colors">אנגלית</h3>
                <p className="text-sm font-semibold text-english/80 mt-1.5">תרגול דקדוק ואוצר מילים</p>
                <p className="text-text-muted text-sm leading-relaxed mt-4">
                  משחק מכירה פומבית כיתתי לתרגול חוקי דקדוק, וכלי אינטראקטיבי לשינון ותרגול מותאם אישית של אוצר מילים.
                </p>
              </div>
              <div className="mt-8 flex items-center gap-2 text-sm font-bold text-english group-hover:translate-x-[-6px] transition-transform">
                <span>כניסה לתרגול</span>
                <ArrowLeft className="w-4 h-4" />
              </div>
            </div>
          </Link>

          {/* Card: העשרה */}
          <Link
            href="/enrichment"
            className="group glass-card rounded-2xl border border-border-custom hover:border-enrichment/40 hover:shadow-[0_12px_40px_rgba(34,197,94,0.12)] transition-all duration-300 flex flex-col overflow-hidden"
          >
            {/* Header Image */}
            <div
              className="h-48 bg-cover bg-center relative"
              style={{
                backgroundImage: `url('https://www.spacecentre.co.uk/media/5hhl423f/jwst-carina-nebula.jpg?anchor=center&rmode=crop&width=1000&height=600&format=webp&quality=80')`
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#080c18] via-transparent to-transparent opacity-80" />
            </div>
            {/* Body */}
            <div className="p-8 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white group-hover:text-enrichment transition-colors">העשרה</h3>
                <p className="text-sm font-semibold text-enrichment/80 mt-1.5">מחוץ לתוכנית הלימודים</p>
                <p className="text-text-muted text-sm leading-relaxed mt-4">
                  לומדות בנושאים מרתקים ומדעיים, כולל מודולים אינטראקטיביים מעמיקים בנושא אבולוציה.
                </p>
              </div>
              <div className="mt-8 flex items-center gap-2 text-sm font-bold text-enrichment group-hover:translate-x-[-6px] transition-transform">
                <span>כניסה ללומדות</span>
                <ArrowLeft className="w-4 h-4" />
              </div>
            </div>
          </Link>

        </div>
      </div>

      {/* Footer */}
      <footer className="w-full text-center py-6 border-t border-border-custom text-xs text-text-muted relative z-10 bg-surface/30">
        <span>© {new Date().getFullYear()} ניר עוז-ארי — כל הזכויות שמורות</span>
      </footer>
    </div>
  );
}
