"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Globe, Search, CheckCircle, Moon, Sun, ArrowRight, BookOpen, Clock, Activity } from "lucide-react";
import { EARTH_SCIENCES_UNITS, Unit, Lesson } from "@/lib/data/earth-sciences-lessons";

export default function EarthSciencesHubPage() {
  const [comfortMode, setComfortMode] = useState<"dark" | "light">("dark");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeUnitFilter, setActiveUnitFilter] = useState<number | "all">("all");
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  // Load state from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("teaching-site-comfort-mode");
      if (storedTheme === "light" || storedTheme === "dark") {
        setComfortMode(storedTheme);
      }

      const storedCompleted = localStorage.getItem("teaching-site-earth-completed-lessons");
      if (storedCompleted) {
        try {
          setCompletedLessons(JSON.parse(storedCompleted));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const toggleComfortMode = () => {
    const nextTheme = comfortMode === "dark" ? "light" : "dark";
    setComfortMode(nextTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem("teaching-site-comfort-mode", nextTheme);
    }
  };

  const handleToggleComplete = (lessonId: string, e: React.MouseEvent) => {
    e.preventDefault(); // prevent navigation
    e.stopPropagation();
    
    let updated: string[];
    if (completedLessons.includes(lessonId)) {
      updated = completedLessons.filter(id => id !== lessonId);
    } else {
      updated = [...completedLessons, lessonId];
    }
    
    setCompletedLessons(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("teaching-site-earth-completed-lessons", JSON.stringify(updated));
    }
  };

  // Filter lessons
  const filteredUnits = EARTH_SCIENCES_UNITS.map(unit => {
    // Filter lessons inside unit based on query
    const lessons = unit.lessons.filter(lesson => {
      const matchesSearch = 
        lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.topics.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (lesson.misconceptions && lesson.misconceptions.some(m => m.toLowerCase().includes(searchQuery.toLowerCase())));
      return matchesSearch;
    });

    return { ...unit, lessons };
  }).filter(unit => {
    // Filter units based on active tab
    if (activeUnitFilter !== "all" && unit.id !== activeUnitFilter) {
      return false;
    }
    // Only show unit if it has lessons matching search
    return unit.lessons.length > 0;
  });

  const getShortUnitTitle = (id: number) => {
    switch (id) {
      case 1: return "אסטרונומיה";
      case 2: return "מזג אוויר ואקלים";
      case 3: return "גאוספרה";
      case 4: return "משאבי טבע";
      default: return "";
    }
  };

  const isLight = comfortMode === "light";
  const bgTheme = isLight ? "bg-[#f4f6fa] text-zinc-800" : "bg-[#080c18] text-[#e8edf8]";
  const borderTheme = isLight ? "border-zinc-200" : "border-border-custom";
  const cardTheme = isLight ? "bg-white border-zinc-200 shadow-sm" : "glass-card";
  const textMuted = isLight ? "text-zinc-500" : "text-text-muted";
  const titleText = isLight ? "text-zinc-900" : "text-white";

  return (
    <div className={`relative min-h-screen ${bgTheme} flex flex-col justify-between overflow-hidden transition-colors duration-300`}>
      {/* Background decoration (Only visible in dark mode for rich aesthetics) */}
      {!isLight && (
        <>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-teal-500/5 via-transparent to-transparent blur-3xl pointer-events-none rounded-full" />
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-teal-500/5 blur-3xl rounded-full pointer-events-none" />
        </>
      )}

      {/* Header bar */}
      <header className={`w-full border-b ${borderTheme} py-4 relative z-20 bg-surface/10 backdrop-blur-md`}>
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          {/* Back button */}
          <Link
            href="/"
            className={`inline-flex items-center gap-1.5 text-xs font-bold ${textMuted} hover:text-earth transition-colors cursor-pointer`}
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>חזרה לפורטל</span>
          </Link>

          {/* Theme Switcher */}
          <button
            onClick={toggleComfortMode}
            className={`p-2 rounded-xl border ${borderTheme} bg-surface/30 hover:bg-surface-hover/30 transition-all cursor-pointer flex items-center gap-2 text-xs font-bold`}
            title="מצב קריאה נוחה"
          >
            {isLight ? (
              <>
                <Moon className="w-4 h-4 text-purple-600" />
                <span className="text-zinc-700">מצב כיתה חשוך</span>
              </>
            ) : (
              <>
                <Sun className="w-4 h-4 text-amber-400 animate-pulse" />
                <span className="text-zinc-300">מצב קריאה בהיר</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Page Area */}
      <main className="relative w-full max-w-6xl mx-auto px-6 py-12 flex-1 flex flex-col z-10">
        
        {/* Main Title Banner */}
        <div className="text-center mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-earth/10 border border-earth/20 rounded-full text-xs font-bold text-earth">
            <Globe className="w-4 h-4" />
            <span>תוכנית לימודים שנתית - כיתה ח׳</span>
          </div>
          <h1 className={`text-4xl md:text-5xl font-black tracking-tight ${titleText} mt-2`}>
            מדעי כדור הארץ והיקום
          </h1>
          <p className={`${textMuted} max-w-2xl mx-auto text-sm leading-relaxed`}>
            האתר מהווה כלי עזר דיגיטלי להעברת שיעורים בכיתה, הקרנת מצגות, לומדות אינטראקטיביות ומטלות בית לתלמידים.
          </p>
        </div>

        {/* Search and Unit filters */}
        <div className="space-y-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <span className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none">
                <Search className={`w-4 h-4 ${textMuted}`} />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="חפשו שיעור, מושג יסוד או נושא..."
                className={`w-full py-2.5 pr-10 pl-4 rounded-xl border ${borderTheme} bg-surface/20 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-earth/50 focus:border-earth text-right`}
              />
            </div>
            
            {/* Completion tracker badge */}
            <div className={`px-4 py-2.5 rounded-xl border ${borderTheme} bg-surface/10 flex items-center gap-2 text-xs text-right font-bold justify-center sm:justify-start`}>
              <CheckCircle className="w-4 h-4 text-earth shrink-0" />
              <span>
                התקדמות שנתית: {completedLessons.length} מתוך {EARTH_SCIENCES_UNITS.reduce((sum, u) => sum + u.lessons.length, 0)} שיעורים
              </span>
            </div>
          </div>

          {/* Unit Filters */}
          <div className="flex flex-row overflow-x-auto scrollbar-none md:flex-nowrap gap-3 pb-2 w-full justify-start items-center">
            <button
              onClick={() => setActiveUnitFilter("all")}
              className={`px-4 py-2 rounded-xl text-sm font-extrabold transition-all cursor-pointer border whitespace-nowrap ${
                activeUnitFilter === "all"
                  ? "bg-earth text-white border-earth shadow-md shadow-teal-500/10"
                  : `bg-surface/30 text-text-muted hover:bg-surface-hover/50 ${borderTheme}`
              }`}
            >
              כל היחידות ({EARTH_SCIENCES_UNITS.reduce((sum, u) => sum + u.lessons.length, 0)})
            </button>
            {EARTH_SCIENCES_UNITS.map(unit => (
              <button
                key={unit.id}
                onClick={() => setActiveUnitFilter(unit.id)}
                className={`px-4 py-2 rounded-xl text-sm font-extrabold transition-all cursor-pointer border whitespace-nowrap ${
                  activeUnitFilter === unit.id
                    ? "bg-earth text-white border-earth shadow-md shadow-teal-500/10"
                    : `bg-surface/30 text-text-muted hover:bg-surface-hover/50 ${borderTheme}`
                }`}
              >
                יחידה {unit.id}: {getShortUnitTitle(unit.id)} ({unit.lessons.length})
              </button>
            ))}
          </div>
        </div>

        {/* Units & Lessons Content */}
        {filteredUnits.length > 0 ? (
          <div className="space-y-10">
            {filteredUnits.map(unit => (
              <div key={unit.id} className="space-y-4">
                {/* Unit Header */}
                <div className={`border-b ${borderTheme} pb-2 text-right`}>
                  <div className="flex justify-between items-end">
                    <h3 className={`text-xl font-bold ${titleText}`}>
                      יחידה {unit.id}: {unit.title}
                    </h3>
                    <span className={`text-[10px] ${textMuted} font-semibold`}>
                      מסגרת הוראה: {unit.hours} שעות שנתיות
                    </span>
                  </div>
                  <p className={`${textMuted} text-xs mt-1 max-w-4xl`}>
                    {unit.description}
                  </p>
                </div>

                {/* Lessons Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {unit.lessons.map((lesson, index) => {
                    const isCompleted = completedLessons.includes(lesson.id);
                    return (
                      <Link
                        key={lesson.id}
                        href={`/earth-sciences/${unit.slug}/${lesson.id}`}
                        className={`group ${cardTheme} rounded-2xl border p-5 flex flex-col justify-between min-h-[220px] transition-all hover:scale-[1.01] hover:border-earth/40 hover:shadow-lg`}
                      >
                        <div className="space-y-3">
                          {/* Top row */}
                          <div className="flex justify-between items-center text-[10px] font-bold">
                            {/* Duration Badge */}
                            <span className={`px-2 py-0.5 rounded-md flex items-center gap-1 bg-surface-hover border ${borderTheme} ${textMuted}`}>
                              <Clock className="w-3 h-3 text-earth shrink-0" />
                              <span>{lesson.duration}</span>
                            </span>

                            {/* Lesson order */}
                            <span className={textMuted}>
                              {lesson.id === "intro-overview" 
                                ? "שיעור פתיחה" 
                                : `שיעור ${unit.id === 1 ? index : index + 1}`}
                            </span>
                          </div>

                          {/* Title */}
                          <h4 className={`text-base font-bold ${titleText} group-hover:text-earth transition-colors text-right leading-snug`}>
                            {lesson.title}
                          </h4>

                          {/* Topics List */}
                          <ul className={`space-y-1.5 text-xs ${textMuted} text-right list-none pr-0`}>
                            {lesson.topics.slice(0, 3).map((topic, i) => (
                              <li key={i} className="flex gap-1.5 justify-start items-start">
                                <span className="w-1 h-1 rounded-full bg-earth mt-1.5 shrink-0" />
                                <span className="leading-tight truncate">{topic}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Footer card row */}
                        <div className={`mt-4 pt-3 border-t ${borderTheme} flex justify-between items-center`}>
                          {/* Completion Box or Under Development Badge */}
                          {unit.id === 1 ? (
                            <button
                              onClick={(e) => handleToggleComplete(lesson.id, e)}
                              className={`flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 rounded-lg border cursor-pointer transition-all ${
                                isCompleted
                                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                  : `bg-surface/30 border-zinc-700/30 text-text-muted hover:text-white hover:border-zinc-500`
                              }`}
                            >
                              <CheckCircle className={`w-3.5 h-3.5 ${isCompleted ? "text-emerald-400" : "text-text-muted"}`} />
                              <span>{isCompleted ? "בוצע בכיתה" : "סמן כבוצע"}</span>
                            </button>
                          ) : (
                            <span className="flex items-center gap-1 text-[10px] font-extrabold text-amber-500 bg-amber-500/10 border border-amber-500/20 rounded-lg px-2.5 py-1">
                              <span>בתהליך פיתוח 🛠️</span>
                            </span>
                          )}

                          {/* Indicator for interactive widget */}
                          {unit.id === 1 && lesson.widgetId && (
                            <span className="flex items-center gap-1 text-[9px] font-extrabold text-earth bg-earth/10 border border-earth/20 rounded-md px-1.5 py-0.5">
                              <Activity className="w-2.5 h-2.5 animate-pulse" />
                              <span>יישומון אינטראקטיבי</span>
                            </span>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty search state */
          <div className={`flex flex-col items-center justify-center p-12 border ${borderTheme} rounded-2xl ${cardTheme} text-center space-y-4`}>
            <BookOpen className={`w-12 h-12 ${textMuted}`} />
            <h3 className={`text-lg font-bold ${titleText}`}>לא נמצאו שיעורים מתאימים</h3>
            <p className={`${textMuted} text-xs max-w-sm`}>
              נסו לשנות את מילת החיפוש או לבחור יחידה אחרת במסננים.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveUnitFilter("all");
              }}
              className="px-4 py-2 bg-earth hover:bg-teal-600 text-white font-bold text-xs rounded-xl cursor-pointer transition-all"
            >
              איפוס מסננים
            </button>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className={`w-full text-center py-6 border-t ${borderTheme} text-xs ${textMuted} relative z-10 bg-surface/30`}>
        <span>© {new Date().getFullYear()} ניר עוז-ארי — מדעי כדור הארץ והיקום לכיתה ח׳</span>
      </footer>
    </div>
  );
}
