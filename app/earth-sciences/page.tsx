"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import ActivityBar from "@/components/site/ActivityBar";
import SiteFooter from "@/components/site/SiteFooter";
import { 
  Globe, 
  Search, 
  CheckCircle, 
  BookOpen, 
  Clock, 
  Activity,
  Settings,
  Users,
  ChevronDown,
  ChevronsDownUp,
  ChevronsUpDown,
  X,
  Layers,
  Edit2,
  FolderOpen
} from "lucide-react";
import { EARTH_SCIENCES_UNITS, Unit, Lesson } from "@/lib/data/earth-sciences-lessons";
import { useVisibility } from "@/lib/context/VisibilityContext";
import { earthLessonId } from "@/lib/content-registry";

export default function EarthSciencesHubPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeUnitFilter, setActiveUnitFilter] = useState<number | "all">("all");
  
  // Class Tracking states
  const [classes, setClasses] = useState<string[]>(['ח׳1', 'ח׳2', 'ח׳3', 'ח׳4', 'ח׳5']);
  const [completedByClass, setCompletedByClass] = useState<Record<string, string[]>>({});
  const [selectedClassFilter, setSelectedClassFilter] = useState<string | "all">("all");
  const [showClassManager, setShowClassManager] = useState(false);
  const [editingClasses, setEditingClasses] = useState<string[]>(['ח׳1', 'ח׳2', 'ח׳3', 'ח׳4', 'ח׳5']);
  const [activePopoverLesson, setActivePopoverLesson] = useState<string | null>(null);

  // Collapsible sections (units + resources). Everything starts collapsed on each visit.
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());
  const toggleSection = (key: string) =>
    setOpenSections(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  const openSection = (key: string) =>
    setOpenSections(prev => (prev.has(key) ? prev : new Set(prev).add(key)));
  const isSearching = searchQuery.trim().length > 0;

  // Students only see lessons the teacher made visible; class tracking is a teacher tool.
  const { canSee, bypass: showTeacherTools } = useVisibility();
  const visibleUnits = EARTH_SCIENCES_UNITS.map(unit => ({
    ...unit,
    lessons: unit.lessons.filter(lesson => canSee(earthLessonId(unit.slug, lesson.id))),
  })).filter(unit => unit.lessons.length > 0);
  const showMission = canSee("earth.mission");
  const showResources = canSee("earth.resources");
  const showAtlas = canSee("earth.tectonics");
  const showResourcesSection = showMission || showResources || showAtlas;
  const sectionKeys = [
    ...visibleUnits.map(u => `unit-${u.id}`),
    ...(showResourcesSection ? ["resources"] : []),
  ];
  const allOpen = sectionKeys.length > 0 && sectionKeys.every(k => openSections.has(k));

  // Load state from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {

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
  const filteredUnits = visibleUnits.map(unit => {
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

  // Colors come from the design tokens in globals.css and follow Comfort Mode.
  const bgTheme = "bg-canvas text-fg";
  const borderTheme = "border-line";
  const cardTheme = "bg-card border-line";
  const textMuted = "text-fg-muted";
  const titleText = "text-fg";

  return (
    <div data-subject="earth" className={`site relative min-h-screen ${bgTheme} flex flex-col`}>
      <ActivityBar backHref="/" backLabel="חזרה לפורטל" title="מדעי כדור הארץ">
        {/* Resources Button */}
        {showResourcesSection && (
          <button
            onClick={() => {
              openSection("resources");
              requestAnimationFrame(() => {
                document.getElementById("resources-section")?.scrollIntoView({ behavior: "smooth" });
              });
            }}
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-line px-3 text-sm font-medium text-fg transition-colors hover:bg-subtle cursor-pointer"
            title="משאבים ועזרים דיגיטליים"
          >
            <FolderOpen className="h-4 w-4 text-fg-muted" strokeWidth={1.75} />
            <span className="hidden sm:inline">משאבים ועזרים</span>
          </button>
        )}

        {/* Class Manager Button */}
        {showTeacherTools && (
          <button
            onClick={() => {
              setEditingClasses([...classes]);
              setShowClassManager(true);
            }}
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-line px-3 text-sm font-medium text-fg transition-colors hover:bg-subtle cursor-pointer"
            title="ניהול שמות הכיתות"
          >
            <Settings className="h-4 w-4 text-fg-muted" strokeWidth={1.75} />
            <span className="hidden sm:inline">ניהול כיתות</span>
          </button>
        )}
      </ActivityBar>

      {/* Main Page Area */}
      <main className="relative w-full max-w-6xl mx-auto px-6 py-12 flex-1 flex flex-col z-10 text-right">
        
        {/* Main Title Banner */}
        <div className="text-center mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent-soft border border-line rounded-full text-[13px] font-semibold text-accent">
            <Globe className="w-4 h-4" />
            <span>תוכנית לימודים שנתית - כיתה ח׳</span>
          </div>
          <h1 className={`text-4xl md:text-5xl font-semibold tracking-tight ${titleText} mt-2`}>
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
                className={`w-full py-2.5 pr-10 pl-4 rounded-md border ${borderTheme} bg-subtle text-[13px] font-semibold focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent text-right`}
              />
            </div>
            
            {/* Class Filter Selector (teacher only) */}
            {showTeacherTools && (
            <div className="flex flex-col sm:flex-row gap-3">
              <div className={`px-3 py-2 rounded-md border ${borderTheme} bg-subtle flex items-center gap-2 text-[13px] font-semibold justify-between`}>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-accent shrink-0" />
                  <span>מעקב עבור:</span>
                </div>
                <select
                  value={selectedClassFilter}
                  onChange={(e) => setSelectedClassFilter(e.target.value)}
                  className="bg-transparent border-none text-accent focus:outline-none text-[13px] font-semibold cursor-pointer px-1 mr-1 text-right"
                >
                  <option value="all" className="text-fg">כל הכיתות ({classes.length})</option>
                  {classes.map(c => (
                    <option key={c} value={c} className="text-fg">כיתה {c}</option>
                  ))}
                </select>
              </div>

              {/* Completion tracker badge */}
              <div className={`px-4 py-2.5 rounded-md border ${borderTheme} bg-subtle flex items-center gap-2 text-[13px] font-semibold justify-center`}>
                <CheckCircle className="w-4 h-4 text-accent shrink-0" />
                <span>
                  {selectedClassFilter === "all" ? (
                    `התקדמות כוללת: ${getCompletedCountForClass("all")} מתוך ${totalLessonsInUnit1 * classes.length} שיעורים`
                  ) : (
                    `התקדמות כיתה ${selectedClassFilter}: ${getCompletedCountForClass(selectedClassFilter)} מתוך ${totalLessonsInUnit1} שיעורים`
                  )}
                </span>
              </div>
            </div>
            )}
          </div>

          {/* Unit Filters */}
          <div className="flex flex-row overflow-x-auto scrollbar-none md:flex-nowrap gap-3 pb-2 w-full justify-start items-center">
            <button
              onClick={() => setActiveUnitFilter("all")}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors cursor-pointer border whitespace-nowrap ${
                activeUnitFilter === "all"
                  ? "bg-accent text-primary-foreground border-accent shadow-sm"
                  : `bg-subtle text-fg-muted hover:bg-subtle-hover ${borderTheme}`
              }`}
            >
              כל היחידות ({visibleUnits.reduce((sum, u) => sum + u.lessons.length, 0)})
            </button>
            {visibleUnits.map(unit => (
              <button
                key={unit.id}
                onClick={() => {
                  setActiveUnitFilter(unit.id);
                  openSection(`unit-${unit.id}`);
                }}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors cursor-pointer border whitespace-nowrap ${
                  activeUnitFilter === unit.id
                    ? "bg-accent text-primary-foreground border-accent shadow-sm"
                    : `bg-subtle text-fg-muted hover:bg-subtle-hover ${borderTheme}`
                }`}
              >
                יחידה {unit.id}: {getShortUnitTitle(unit.id)} ({unit.lessons.length})
              </button>
            ))}

            {/* Expand / collapse every section at once */}
            {sectionKeys.length > 0 && (
              <button
                onClick={() => setOpenSections(allOpen ? new Set() : new Set(sectionKeys))}
                className="ms-auto inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-fg-muted hover:text-fg hover:bg-subtle transition-colors cursor-pointer whitespace-nowrap"
              >
                {allOpen ? (
                  <ChevronsDownUp className="w-4 h-4" strokeWidth={1.75} aria-hidden />
                ) : (
                  <ChevronsUpDown className="w-4 h-4" strokeWidth={1.75} aria-hidden />
                )}
                <span>{allOpen ? "סגירת הכל" : "פתיחת הכל"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Units & Lessons Content */}
        {filteredUnits.length > 0 ? (
          <div className="space-y-10">
            {filteredUnits.map(unit => {
              const unitKey = `unit-${unit.id}`;
              // While searching, matching units open on their own so results are visible.
              const unitOpen = isSearching || openSections.has(unitKey);
              return (
              <div key={unit.id} className="space-y-4">
                {/* Unit Header (click to expand / collapse) */}
                <button
                  type="button"
                  onClick={() => toggleSection(unitKey)}
                  aria-expanded={unitOpen}
                  aria-controls={`${unitKey}-lessons`}
                  className={`group/unit w-full border-b ${borderTheme} pb-2 text-right cursor-pointer`}
                >
                  <div className="flex justify-between items-end gap-4">
                    <h3 className={`text-xl font-semibold ${titleText} flex items-center gap-2 group-hover/unit:text-accent transition-colors`}>
                      <ChevronDown
                        className={`w-5 h-5 text-fg-muted shrink-0 transition-transform ${unitOpen ? "" : "rotate-90"}`}
                        strokeWidth={1.75}
                        aria-hidden
                      />
                      <span>יחידה {unit.id}: {unit.title}</span>
                      <span className={`text-sm font-medium ${textMuted} whitespace-nowrap`}>({unit.lessons.length} שיעורים)</span>
                    </h3>
                    <span className={`hidden sm:inline text-xs ${textMuted} font-semibold shrink-0`}>
                      מסגרת הוראה: {unit.hours} שעות שנתיות
                    </span>
                  </div>
                  {unitOpen && (
                    <p className={`${textMuted} text-[13px] mt-1 max-w-4xl`}>
                      {unit.description}
                    </p>
                  )}
                </button>

                {/* Lessons Grid */}
                {unitOpen && (
                <div id={`${unitKey}-lessons`} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {unit.lessons.map((lesson, index) => {
                    const doneClasses = completedByClass[lesson.id] || [];
                    const isAllDone = classes.every(c => doneClasses.includes(c));
                    const isCompletedForSelected = selectedClassFilter !== "all" && doneClasses.includes(selectedClassFilter);
                    const popoverOpen = activePopoverLesson === lesson.id;
                    const fullIndex = EARTH_SCIENCES_UNITS.find(u => u.id === unit.id)?.lessons.findIndex(l => l.id === lesson.id) ?? index;

                    return (
                      <div
                        key={lesson.id}
                        className={`group ${cardTheme} rounded-lg border p-5 flex flex-col justify-between min-h-[240px] transition-colors hover:border-line-strong hover: relative`}
                      >
                        {/* Upper card block: Wrap Link around text, not the entire container so buttons stay interactive */}
                        <Link
                          href={`/earth-sciences/${unit.slug}/${lesson.id}`}
                          className="flex-grow flex flex-col justify-between"
                        >
                          <div className="space-y-3">
                            {/* Top row */}
                            <div className="flex justify-between items-center text-xs font-semibold">
                              {/* Duration Badge */}
                              <span className={`px-2 py-0.5 rounded-md flex items-center gap-1 bg-subtle border ${borderTheme} ${textMuted}`}>
                                <Clock className="w-3 h-3 text-accent shrink-0" />
                                <span>{lesson.duration}</span>
                              </span>

                              {/* Lesson order */}
                              <span className={textMuted}>
                                {lesson.id === "intro-overview" 
                                  ? "שיעור פתיחה" 
                                  : `שיעור ${unit.id === 1 ? fullIndex : fullIndex + 1}`}
                              </span>
                            </div>

                            {/* Title */}
                            <h4 className={`text-base font-semibold ${titleText} group-hover:text-accent transition-colors text-right leading-snug`}>
                              {lesson.title}
                            </h4>

                            {/* Topics List */}
                            <ul className={`space-y-1.5 text-[13px] ${textMuted} text-right list-none pr-0`}>
                              {lesson.topics.slice(0, 3).map((topic, i) => (
                                <li key={i} className="flex gap-1.5 justify-start items-start">
                                  <span className="w-1 h-1 rounded-full bg-accent mt-1.5 shrink-0" />
                                  <span className="leading-tight truncate">{topic}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </Link>

                        {/* Middle row: Badges of completed classes (only in "all classes" view) */}
                        {showTeacherTools && !lesson.draft && selectedClassFilter === "all" && doneClasses.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5 justify-start select-none">
                            {isAllDone ? (
                              <span className="px-2 py-0.5 bg-success-soft text-success border border-success/25 text-xs font-semibold rounded-md">
                                הושלם בכל הכיתות 🎉
                              </span>
                            ) : (
                              doneClasses.map(c => (
                                <span key={c} className="px-1.5 py-0.5 bg-accent-soft text-accent border border-line text-xs font-semibold rounded-md">
                                  כיתה {c}
                                </span>
                              ))
                            )}
                          </div>
                        )}

                        {/* Footer card row */}
                        <div className={`mt-4 pt-3 border-t ${borderTheme} flex justify-between items-center relative z-10`}>
                          {/* Completion Selector / Popover */}
                          {!showTeacherTools ? (
                            <span />
                          ) : !lesson.draft ? (
                            selectedClassFilter === "all" ? (
                              <div className="relative">
                                {/* Toggle Popover Button */}
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setActivePopoverLesson(popoverOpen ? null : lesson.id);
                                  }}
                                  className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg border cursor-pointer transition-colors ${
                                    doneClasses.length > 0
                                      ? "bg-accent-soft text-accent border-line hover:opacity-90"
                                      : `bg-subtle border-line text-fg-muted hover:text-fg hover:border-line-strong`
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
                                    <div className={`absolute bottom-full right-0 mb-2 w-36 rounded-md border p-2.5 z-50 text-right bg-card border-line text-fg`}>
                                      <div className="text-xs font-semibold text-fg-muted border-b border-line pb-1.5 mb-1.5 flex justify-between items-center">
                                        <button 
                                          onClick={() => setActivePopoverLesson(null)}
                                          className="hover:text-fg cursor-pointer"
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
                                              className="w-full flex items-center justify-between text-[13px] font-semibold py-1 px-1.5 hover:bg-subtle-hover rounded-lg cursor-pointer transition-colors"
                                            >
                                              <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-xs ${
                                                checked 
                                                  ? "bg-accent border-accent text-primary-foreground" 
                                                  : "border-line bg-transparent"
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
                                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-lg border cursor-pointer transition-colors ${
                                  isCompletedForSelected
                                    ? "bg-success-soft text-success border-success/25 hover:bg-success-soft"
                                    : `bg-subtle border-line text-fg-muted hover:text-fg hover:border-line-strong`
                                }`}
                              >
                                <CheckCircle className={`w-3.5 h-3.5 ${isCompletedForSelected ? "text-success" : "text-fg-muted"}`} />
                                <span>{isCompletedForSelected ? "הועבר בכיתה" : "סמן כבוצע"}</span>
                              </button>
                            )
                          ) : (
                            /* Under Development Badge for lessons not ready yet */
                            <span className="flex items-center gap-1 text-xs font-semibold text-warning bg-warning-soft border border-warning/25 rounded-lg px-2.5 py-1">
                              <span>בתהליך פיתוח 🛠️</span>
                            </span>
                          )}

                          {/* Indicator for interactive widget */}
                          {!lesson.draft && lesson.widgetId && (
                            <span className="flex items-center gap-1 text-xs font-semibold text-accent bg-accent-soft border border-line rounded-md px-1.5 py-0.5">
                              <Activity className="w-2.5 h-2.5 animate-pulse" />
                              <span>יישומון אינטראקטיבי</span>
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                )}
              </div>
              );
            })}
          </div>
        ) : (
          /* Empty search state */
          <div className={`flex flex-col items-center justify-center p-12 border ${borderTheme} rounded-lg ${cardTheme} text-center space-y-4`}>
            <BookOpen className={`w-12 h-12 ${textMuted}`} />
            <h3 className={`text-lg font-semibold ${titleText}`}>{visibleUnits.length === 0 ? "עדיין אין שיעורים פתוחים" : "לא נמצאו שיעורים מתאימים"}</h3>
            <p className={`${textMuted} text-[13px] max-w-sm`}>
              נסו לשנות את מילת החיפוש או לבחור יחידה אחרת במסננים.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveUnitFilter("all");
              }}
              className="px-4 py-2 bg-accent hover:opacity-90 text-primary-foreground font-semibold text-[13px] rounded-md cursor-pointer transition-colors"
            >
              איפוס מסננים
            </button>
          </div>
        )}

        {/* Section: משאבים ועזרים */}
        {showResourcesSection && (
        <div id="resources-section" className={`w-full mt-16 border-t ${borderTheme} pt-12 text-right space-y-8`}>
          <button
            type="button"
            onClick={() => toggleSection("resources")}
            aria-expanded={openSections.has("resources")}
            aria-controls="resources-content"
            className="group/res w-full text-center sm:text-right space-y-2 cursor-pointer"
          >
            <h2 className={`text-2xl font-semibold tracking-tight ${titleText} flex items-center justify-center sm:justify-start gap-2 group-hover/res:text-accent transition-colors`}>
              <ChevronDown
                className={`w-6 h-6 text-fg-muted shrink-0 transition-transform ${openSections.has("resources") ? "" : "rotate-90"}`}
                strokeWidth={1.75}
                aria-hidden
              />
              <span>משאבים ועזרים 🛠️</span>
            </h2>
            <p className={`${textMuted} text-[13px]`}>
              כלים אינטראקטיביים, סימולטורים ומקורות מידע חיצוניים להעשרת הלמידה במהלך השנה.
            </p>
          </button>

          {openSections.has("resources") && (
          <div id="resources-content" className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            {/* Research assignment: Mission New Home (Unit 1) */}
            {showMission && (
            <Link
              href="/earth-sciences/mission"
              className={`lg:col-span-2 group ${cardTheme} rounded-lg border ${borderTheme} p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-line-strong transition-colors`}
            >
              <div className="space-y-2">
                <h3 className={`text-lg font-semibold ${titleText} flex items-center gap-2`}>
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  עבודת חקר: משימת בית חדש 🚀
                </h3>
                <p className={`${textMuted} text-[13px] leading-relaxed`}>
                  עבודה בזוגות על יחידה 1: בוחרים יעד ליישוב בחלל, חוקרים אותו לפי כל מונחי היחידה, ומגישים דו&quot;ח
                  לסוכנות החלל. העבודה נשמרת אוטומטית ומוגשת אונליין.
                </p>
              </div>
              <span className="shrink-0 self-start sm:self-center px-4 py-2 rounded-md bg-accent text-primary-foreground text-sm font-semibold group-hover:bg-accent transition-colors">
                לכניסה למשימה ←
              </span>
            </Link>
            )}

            {/* Interactive atlas: Earth in Motion (plate tectonics) */}
            {showAtlas && (
            <Link
              href="/earth-sciences/tectonics"
              className={`lg:col-span-2 group ${cardTheme} rounded-lg border ${borderTheme} p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-line-strong transition-colors`}
            >
              <div className="space-y-2">
                <h3 className={`text-lg font-semibold ${titleText} flex items-center gap-2`}>
                  <span className="w-2 h-2 rounded-full bg-warning animate-pulse" />
                  כדור הארץ בתנועה
                </h3>
                <p className={`${textMuted} text-[13px] leading-relaxed`}>
                  אטלס אינטראקטיבי של הלוחות הטקטוניים על גלובוס תלת-ממדי: גבולות לוחות, רעידות אדמה והרי געש,
                  סיורים מודרכים, חידון, ופרק מיוחד על ישראל וים המלח.
                </p>
              </div>
              <span className="shrink-0 self-start sm:self-center px-4 py-2 rounded-md bg-accent text-primary-foreground text-sm font-semibold group-hover:bg-accent transition-colors">
                לפתיחת האטלס ←
              </span>
            </Link>
            )}

            {showResources && (<>
            {/* Tool Card 1: NASA's Eye on the Solar System */}
            <div className={`group ${cardTheme} rounded-lg border ${borderTheme} p-5 flex flex-col justify-between gap-5`}>
              <div className="space-y-2">
                <h3 className={`text-lg font-semibold ${titleText} flex items-center gap-2`}>
                  <span className="w-2 h-2 rounded-full bg-warning animate-pulse" />
                  NASA's Eye on the Solar System 🪐
                </h3>
                <p className={`${textMuted} text-[13px] leading-relaxed`}>
                  הדמיית תלת-ממד אינטראקטיבית מבית נאס"א המאפשרת לחקור את כדור הארץ, כוכבי הלכת, הירחים, האסטרואידים וחלליות המחקר בזמן אמת על בסיס נתונים מדעיים אמיתיים.
                </p>
              </div>

              {/* Interactive Iframe Embed */}
              <div className={`w-full aspect-video rounded-md border ${borderTheme} bg-card overflow-hidden relative shadow-sm`}>
                <iframe 
                  src="https://eyes.nasa.gov/apps/solar-system/#/earth?featured=false&shareButton=false" 
                  className="w-full h-full border-none"
                  allowFullScreen
                  title="NASA's Eye on the Solar System"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Tool Card 2: Lunar Phase Simulator */}
            <div className={`group ${cardTheme} rounded-lg border ${borderTheme} p-5 flex flex-col justify-between gap-5`}>
              <div className="space-y-2">
                <h3 className={`text-lg font-semibold ${titleText} flex items-center gap-2`}>
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  סימולטור מופעי הירח 🌙
                </h3>
                <p className={`${textMuted} text-[13px] leading-relaxed`}>
                  הדמיה אינטראקטיבית מבית אוניברסיטת נברסקה (UNL) המציגה את הקשר הגיאומטרי שבין כדור הארץ, הירח והשמש, ומסבירה כיצד נוצרים מופעי הירח השונים במהלך החודש.
                </p>
              </div>

              {/* Interactive Iframe Embed */}
              <div className={`w-full aspect-video rounded-md border ${borderTheme} bg-card overflow-hidden relative shadow-sm`}>
                <iframe 
                  src="https://ccnmtl.github.io/astro-simulations/lunar-phase-simulator/" 
                  className="w-full h-full border-none"
                  allowFullScreen
                  title="Lunar Phase Simulator"
                  loading="lazy"
                />
              </div>
            </div>
            </>)}
          </div>
          )}
        </div>
        )}
      </main>

      {/* Class Manager Modal */}
      {showClassManager && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-lg border p-6 text-right relative bg-card border-line text-fg`}>
            {/* Close Button */}
            <button
              onClick={() => setShowClassManager(false)}
              className={`absolute top-4 left-4 p-1.5 rounded-lg border ${borderTheme} hover:bg-subtle-hover cursor-pointer`}
            >
              <X className="w-4 h-4 text-fg-muted" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-semibold text-fg">ניהול כיתות 🏫</h3>
            </div>

            <p className={`${textMuted} text-[13px] leading-relaxed mb-4`}>
              ערוך את שמות 5 הכיתות שלך כדי להתאים אותן למערכת השעות שלך. השינויים יישמרו וישפיעו על תיוג השיעורים.
            </p>

            <div className="space-y-3 mb-6">
              {editingClasses.map((c, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <span className="text-[13px] text-fg-muted w-14 font-semibold">כיתה {i+1}:</span>
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
                    className={`flex-1 py-1.5 px-3 rounded-lg border ${borderTheme} bg-subtle text-[13px] font-semibold focus:outline-none focus:ring-1 focus:ring-accent/30 text-right`}
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowClassManager(false)}
                className={`px-4 py-2 border ${borderTheme} hover:bg-subtle-hover text-[13px] font-semibold rounded-lg cursor-pointer`}
              >
                ביטול
              </button>
              <button
                onClick={handleSaveClasses}
                className="px-4 py-2 bg-accent hover:opacity-90 text-primary-foreground text-[13px] font-semibold rounded-lg cursor-pointer shadow-sm transition-colors"
              >
                שמור שינויים
              </button>
            </div>
          </div>
        </div>
      )}

      <SiteFooter />
    </div>
  );
}
