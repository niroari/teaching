"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Globe, 
  Search, 
  CheckCircle, 
  Moon, 
  Sun, 
  ArrowRight, 
  BookOpen, 
  Clock, 
  Activity,
  Settings,
  Users,
  ChevronDown,
  X,
  Layers,
  Edit2
} from "lucide-react";
import { EARTH_SCIENCES_UNITS, Unit, Lesson } from "@/lib/data/earth-sciences-lessons";

export default function EarthSciencesHubPage() {
  const [comfortMode, setComfortMode] = useState<"dark" | "light">("dark");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeUnitFilter, setActiveUnitFilter] = useState<number | "all">("all");
  
  // Class Tracking states
  const [classes, setClasses] = useState<string[]>(['ח׳1', 'ח׳2', 'ח׳3', 'ח׳4', 'ח׳5']);
  const [completedByClass, setCompletedByClass] = useState<Record<string, string[]>>({});
  const [selectedClassFilter, setSelectedClassFilter] = useState<string | "all">("all");
  const [showClassManager, setShowClassManager] = useState(false);
  const [editingClasses, setEditingClasses] = useState<string[]>(['ח׳1', 'ח׳2', 'ח׳3', 'ח׳4', 'ח׳5']);
  const [activePopoverLesson, setActivePopoverLesson] = useState<string | null>(null);

  // Load state from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Theme
      const storedTheme = localStorage.getItem("teaching-site-comfort-mode");
      if (storedTheme === "light" || storedTheme === "dark") {
        setComfortMode(storedTheme);
      }

      // Classes list
      const storedClasses = localStorage.getItem("teaching-site-classes");
      let activeClasses = ['ח׳1', 'ח׳2', 'ח׳3', 'ח׳4', 'ח׳5'];
      if (storedClasses) {
        try {
          activeClasses = JSON.parse(storedClasses);
          setClasses(activeClasses);
          setEditingClasses(activeClasses);
        } catch (e) {
          console.error(e);
        }
      }

      // Completed lessons by class map
      const storedCompletedByClass = localStorage.getItem("teaching-site-earth-completed-lessons-by-class");
      let completedMap: Record<string, string[]> = {};
      if (storedCompletedByClass) {
        try {
          completedMap = JSON.parse(storedCompletedByClass);
          setCompletedByClass(completedMap);
        } catch (e) {
          console.error(e);
        }
      } else {
        // Migration from old array format if exists
        const storedCompleted = localStorage.getItem("teaching-site-earth-completed-lessons");
        if (storedCompleted) {
          try {
            const oldArray = JSON.parse(storedCompleted);
            if (Array.isArray(oldArray)) {
              oldArray.forEach((lessonId: string) => {
                completedMap[lessonId] = [activeClasses[0]]; // assign to first class
              });
              setCompletedByClass(completedMap);
              localStorage.setItem("teaching-site-earth-completed-lessons-by-class", JSON.stringify(completedMap));
            }
          } catch (e) {
            console.error(e);
          }
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

  // Toggle class complete for popover mode
  const handleToggleClassComplete = (lessonId: string, classNameStr: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const current = completedByClass[lessonId] || [];
    let updated: string[];
    if (current.includes(classNameStr)) {
      updated = current.filter(c => c !== classNameStr);
    } else {
      updated = [...current, classNameStr];
    }
    
    const nextCompleted = {
      ...completedByClass,
      [lessonId]: updated
    };
    setCompletedByClass(nextCompleted);
    if (typeof window !== "undefined") {
      localStorage.setItem("teaching-site-earth-completed-lessons-by-class", JSON.stringify(nextCompleted));
    }
  };

  // Quick toggle single class when class filter is selected
  const handleToggleSingleClass = (lessonId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (selectedClassFilter === "all") return;
    
    const current = completedByClass[lessonId] || [];
    let updated: string[];
    if (current.includes(selectedClassFilter)) {
      updated = current.filter(c => c !== selectedClassFilter);
    } else {
      updated = [...current, selectedClassFilter];
    }
    
    const nextCompleted = {
      ...completedByClass,
      [lessonId]: updated
    };
    setCompletedByClass(nextCompleted);
    if (typeof window !== "undefined") {
      localStorage.setItem("teaching-site-earth-completed-lessons-by-class", JSON.stringify(nextCompleted));
    }
  };

  // Save edited class names
  const handleSaveClasses = () => {
    // Filter empty values and trim
    const cleaned = editingClasses.map(c => c.trim()).filter(c => c.length > 0);
    if (cleaned.length === 0) return;
    
    setClasses(cleaned);
    setShowClassManager(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("teaching-site-classes", JSON.stringify(cleaned));
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

  // Statistics calculation
  const totalLessonsInUnit1 = EARTH_SCIENCES_UNITS.find(u => u.id === 1)?.lessons.length || 0;
  
  const getCompletedCountForClass = (classFilter: string | "all") => {
    const unit1Lessons = EARTH_SCIENCES_UNITS.find(u => u.id === 1)?.lessons || [];
    let count = 0;
    unit1Lessons.forEach(l => {
      const done = completedByClass[l.id] || [];
      if (classFilter === "all") {
        // Average count: count all completions
        count += done.length;
      } else if (done.includes(classFilter)) {
        count++;
      }
    });
    return count;
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

          {/* Controls Right */}
          <div className="flex items-center gap-3">
            {/* Class Manager Button */}
            <button
              onClick={() => {
                setEditingClasses([...classes]);
                setShowClassManager(true);
              }}
              className={`p-2 rounded-xl border ${borderTheme} bg-surface/30 hover:bg-surface-hover/30 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold`}
              title="ניהול שמות הכיתות"
            >
              <Settings className="w-3.5 h-3.5 text-earth" />
              <span className="hidden sm:inline">ניהול כיתות</span>
            </button>

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
        </div>
      </header>

      {/* Main Page Area */}
      <main className="relative w-full max-w-6xl mx-auto px-6 py-12 flex-1 flex flex-col z-10 text-right">
        
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

        {/* Search, Class Selection, and Unit filters */}
        <div className="space-y-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
            
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
            
            {/* Class Filter Selector */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className={`px-3 py-2 rounded-xl border ${borderTheme} bg-surface/10 flex items-center gap-2 text-xs font-bold justify-between`}>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-earth shrink-0" />
                  <span>מעקב עבור:</span>
                </div>
                <select
                  value={selectedClassFilter}
                  onChange={(e) => setSelectedClassFilter(e.target.value)}
                  className="bg-transparent border-none text-earth focus:outline-none text-xs font-extrabold cursor-pointer px-1 mr-1 text-right"
                >
                  <option value="all" className={isLight ? "text-zinc-800" : "text-zinc-950"}>כל הכיתות ({classes.length})</option>
                  {classes.map(c => (
                    <option key={c} value={c} className={isLight ? "text-zinc-800" : "text-zinc-950"}>כיתה {c}</option>
                  ))}
                </select>
              </div>

              {/* Completion tracker badge */}
              <div className={`px-4 py-2.5 rounded-xl border ${borderTheme} bg-surface/10 flex items-center gap-2 text-xs font-bold justify-center`}>
                <CheckCircle className="w-4 h-4 text-earth shrink-0" />
                <span>
                  {selectedClassFilter === "all" ? (
                    `התקדמות כוללת: ${getCompletedCountForClass("all")} מתוך ${totalLessonsInUnit1 * classes.length} שיעורים`
                  ) : (
                    `התקדמות כיתה ${selectedClassFilter}: ${getCompletedCountForClass(selectedClassFilter)} מתוך ${totalLessonsInUnit1} שיעורים`
                  )}
                </span>
              </div>
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
                    const doneClasses = completedByClass[lesson.id] || [];
                    const isAllDone = classes.every(c => doneClasses.includes(c));
                    const isCompletedForSelected = selectedClassFilter !== "all" && doneClasses.includes(selectedClassFilter);
                    const popoverOpen = activePopoverLesson === lesson.id;

                    return (
                      <div
                        key={lesson.id}
                        className={`group ${cardTheme} rounded-2xl border p-5 flex flex-col justify-between min-h-[240px] transition-all hover:scale-[1.01] hover:border-earth/40 hover:shadow-lg relative`}
                      >
                        {/* Upper card block: Wrap Link around text, not the entire container so buttons stay interactive */}
                        <Link
                          href={`/earth-sciences/${unit.slug}/${lesson.id}`}
                          className="flex-grow flex flex-col justify-between"
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
                        </Link>

                        {/* Middle row: Badges of completed classes (only in "all classes" view) */}
                        {unit.id === 1 && selectedClassFilter === "all" && doneClasses.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5 justify-start select-none">
                            {isAllDone ? (
                              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-extrabold rounded-md">
                                הושלם בכל הכיתות 🎉
                              </span>
                            ) : (
                              doneClasses.map(c => (
                                <span key={c} className="px-1.5 py-0.5 bg-earth/10 text-earth border border-earth/20 text-[9px] font-extrabold rounded-md">
                                  כיתה {c}
                                </span>
                              ))
                            )}
                          </div>
                        )}

                        {/* Footer card row */}
                        <div className={`mt-4 pt-3 border-t ${borderTheme} flex justify-between items-center relative z-10`}>
                          {/* Completion Selector / Popover */}
                          {unit.id === 1 ? (
                            selectedClassFilter === "all" ? (
                              <div className="relative">
                                {/* Toggle Popover Button */}
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setActivePopoverLesson(popoverOpen ? null : lesson.id);
                                  }}
                                  className={`flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-lg border cursor-pointer transition-all ${
                                    doneClasses.length > 0
                                      ? "bg-earth/15 text-earth border-earth/40 hover:bg-earth/25"
                                      : `bg-surface/30 border-zinc-700/30 text-text-muted hover:text-white hover:border-zinc-500`
                                  }`}
                                >
                                  <Users className="w-3.5 h-3.5 shrink-0" />
                                  <span>מעקב כיתות ({doneClasses.length})</span>
                                  <ChevronDown className="w-3 h-3 opacity-60" />
                                </button>

                                {/* Popover Menu */}
                                {popoverOpen && (
                                  <>
                                    {/* Backdrop click closer */}
                                    <div 
                                      className="fixed inset-0 z-40" 
                                      onClick={() => setActivePopoverLesson(null)} 
                                    />
                                    <div className={`absolute bottom-full right-0 mb-2 w-36 rounded-xl border p-2.5 shadow-2xl z-50 text-right ${
                                      isLight ? "bg-white border-zinc-200 text-zinc-800" : "bg-slate-900 border-zinc-700 text-[#e8edf8]"
                                    }`}>
                                      <div className="text-[10px] font-black text-text-muted border-b border-border-custom pb-1.5 mb-1.5 flex justify-between items-center">
                                        <button 
                                          onClick={() => setActivePopoverLesson(null)}
                                          className="hover:text-white cursor-pointer"
                                        >
                                          <X className="w-3 h-3" />
                                        </button>
                                        <span>סימון כיתות שהשלימו:</span>
                                      </div>
                                      <div className="space-y-1.5 max-h-44 overflow-y-auto">
                                        {classes.map(c => {
                                          const checked = doneClasses.includes(c);
                                          return (
                                            <button
                                              key={c}
                                              onClick={(e) => handleToggleClassComplete(lesson.id, c, e)}
                                              className="w-full flex items-center justify-between text-xs font-bold py-1 px-1.5 hover:bg-surface-hover/40 rounded-lg cursor-pointer transition-colors"
                                            >
                                              <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[9px] ${
                                                checked 
                                                  ? "bg-earth border-earth text-white" 
                                                  : "border-zinc-500 bg-transparent"
                                              }`}>
                                                {checked && "✓"}
                                              </span>
                                              <span>כיתה {c}</span>
                                            </button>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  </>
                                )}
                              </div>
                            ) : (
                              /* Quick Toggle Button for selected class */
                              <button
                                onClick={(e) => handleToggleSingleClass(lesson.id, e)}
                                className={`flex items-center gap-1.5 text-[10px] font-bold px-3 py-1 rounded-lg border cursor-pointer transition-all ${
                                  isCompletedForSelected
                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                                    : `bg-surface/30 border-zinc-700/30 text-text-muted hover:text-white hover:border-zinc-500`
                                }`}
                              >
                                <CheckCircle className={`w-3.5 h-3.5 ${isCompletedForSelected ? "text-emerald-400" : "text-text-muted"}`} />
                                <span>{isCompletedForSelected ? "הועבר בכיתה" : "סמן כבוצע"}</span>
                              </button>
                            )
                          ) : (
                            /* Under Development Badge for Units 2, 3, 4 */
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
                      </div>
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

      {/* Class Manager Modal */}
      {showClassManager && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-2xl border p-6 text-right shadow-2xl relative ${
            isLight ? "bg-white border-zinc-200 text-zinc-800" : "bg-slate-900 border-zinc-700 text-[#e8edf8]"
          }`}>
            {/* Close Button */}
            <button
              onClick={() => setShowClassManager(false)}
              className={`absolute top-4 left-4 p-1.5 rounded-lg border ${borderTheme} hover:bg-surface-hover/30 cursor-pointer`}
            >
              <X className="w-4 h-4 text-text-muted" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-earth" />
              <h3 className="text-lg font-black text-white">ניהול כיתות 🏫</h3>
            </div>

            <p className={`${textMuted} text-xs leading-relaxed mb-4`}>
              ערוך את שמות 5 הכיתות שלך כדי להתאים אותן למערכת השעות שלך. השינויים יישמרו וישפיעו על תיוג השיעורים.
            </p>

            <div className="space-y-3 mb-6">
              {editingClasses.map((c, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <span className="text-xs text-text-muted w-14 font-semibold">כיתה {i+1}:</span>
                  <input
                    type="text"
                    value={c}
                    onChange={(e) => {
                      const updated = [...editingClasses];
                      updated[i] = e.target.value;
                      setEditingClasses(updated);
                    }}
                    placeholder={`כיתה ${i+1}`}
                    maxLength={15}
                    className={`flex-1 py-1.5 px-3 rounded-lg border ${borderTheme} bg-surface/20 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-earth text-right`}
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowClassManager(false)}
                className={`px-4 py-2 border ${borderTheme} hover:bg-surface-hover/30 text-xs font-bold rounded-lg cursor-pointer`}
              >
                ביטול
              </button>
              <button
                onClick={handleSaveClasses}
                className="px-4 py-2 bg-earth hover:bg-teal-600 text-white text-xs font-bold rounded-lg cursor-pointer shadow-md hover:scale-[1.02] transition-all"
              >
                שמור שינויים
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className={`w-full text-center py-6 border-t ${borderTheme} text-xs ${textMuted} relative z-10 bg-surface/30`}>
        <span>© {new Date().getFullYear()} ניר עוז-ארי — מדעי כדור הארץ והיקום לכיתה ח׳</span>
      </footer>
    </div>
  );
}
