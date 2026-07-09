"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowRight, 
  Moon, 
  Sun, 
  Presentation, 
  BookOpen, 
  Play, 
  CheckCircle, 
  Maximize2, 
  Minimize2, 
  HelpCircle, 
  Lightbulb, 
  Clock,
  Edit3,
  ChevronLeft,
  ChevronRight,
  BookCopy,
  X
} from "lucide-react";
import { EARTH_SCIENCES_UNITS, NotebookConcept } from "@/lib/data/earth-sciences-lessons";
import { TOPICS_CONTENT } from "@/lib/data/earth-sciences-topics-content";

interface Slide {
  title: string;
  content: string;
  visualType: string;
  bullets?: string[];
  imageUrl?: string;
  videoDetailId?: string;
}

// Import widgets
import AstronomyWidget from "@/components/earth-sciences/AstronomyWidget";
import ClimographWidget from "@/components/earth-sciences/ClimographWidget";
import TectonicsWidget from "@/components/earth-sciences/TectonicsWidget";
import FootprintWidget from "@/components/earth-sciences/FootprintWidget";
import EarthExplorerWidget from "@/components/earth-sciences/EarthExplorerWidget";

export default function LessonPresenterConsolePage() {
  const { unit, lesson } = useParams();
  const router = useRouter();

  // Theme states
  const [comfortMode, setComfortMode] = useState<"dark" | "light">("dark");
  const [cinemaMode, setCinemaMode] = useState(false);
  const [activeTab, setActiveTab] = useState<"slides" | "activity" | "teacherGuide">("slides");
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showInlineWidget, setShowInlineWidget] = useState(false);
  const [showNotebookOverlay, setShowNotebookOverlay] = useState(false);

  // Load theme from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("teaching-site-comfort-mode");
      if (storedTheme === "light" || storedTheme === "dark") {
        setComfortMode(storedTheme);
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

  // Keyboard navigation for slides
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeTab !== "slides") return;
      if (e.key === "ArrowRight") {
        handlePrevSlide(); // Hebrew RTL direction: Prev slide is on the right
      } else if (e.key === "ArrowLeft") {
        handleNextSlide(); // Next slide is on the left
      } else if (e.key === "Escape" && cinemaMode) {
        setCinemaMode(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeTab, currentSlideIndex, cinemaMode]);

  // Find Unit and Lesson data
  const unitSlug = typeof unit === "string" ? unit : "";
  const lessonId = typeof lesson === "string" ? lesson : "";

  const unitData = EARTH_SCIENCES_UNITS.find(u => u.slug === unitSlug);
  const lessonData = unitData?.lessons.find(l => l.id === lessonId);

  // Reset slide and widget state when changing lesson
  useEffect(() => {
    setCurrentSlideIndex(0);
    setShowInlineWidget(false);
  }, [lessonId]);

  // Slide content generator
  const generateSlides = (): Slide[] => {
    if (!lessonData) return [];
    
    const slides: Slide[] = [
      {
        title: lessonData.hookTitle || lessonData.title,
        content: lessonData.hook,
        visualType: "hook"
      }
    ];

    lessonData.topics.forEach((topic, idx) => {
      const richTopics = TOPICS_CONTENT[lessonId];
      const richTopic = richTopics && richTopics[idx];

      slides.push({
        title: richTopic ? richTopic.title : `נושא למידה ${idx + 1}: ${topic.split(":")[0] || "מושג יסוד"}`,
        content: richTopic ? richTopic.subtitle : topic,
        bullets: richTopic ? richTopic.bullets : [],
        imageUrl: richTopic ? richTopic.imageUrl : undefined,
        videoDetailId: richTopic ? richTopic.videoDetailId : undefined,
        visualType: "topic"
      });
    });

    slides.push({
      title: "משימה ועבודה עצמית בכיתה",
      content: lessonData.task.description,
      visualType: "task"
    });

    if (lessonData.notebookSummary && lessonData.notebookSummary.length > 0) {
      slides.push({
        title: "📝 כתיבה במחברת - מושגים להעתקה",
        content: "העתיקו את המושגים הבאים למחברת שלכם בדיוק ובכתב קריא:",
        visualType: "notebook"
      });
    }

    slides.push({
      title: "סיכום המושגים המרכזיים",
      content: "מושגי חובה שהגדרנו היום:",
      visualType: "summary"
    });

    return slides;
  };

  const slides = generateSlides();

  if (!unitData || !lessonData) {
    return (
      <div className="min-h-screen bg-[#080c18] text-[#e8edf8] flex items-center justify-center p-6 text-right font-sans">
        <div className="glass-card max-w-md w-full rounded-2xl p-8 border border-red-500/30 text-center space-y-4">
          <h3 className="text-xl font-bold text-red-400">השיעור המבוקש לא נמצא</h3>
          <p className="text-text-muted text-sm">הקישור שהזנת אינו תקין או שהשיעור עודנו בבנייה.</p>
          <Link href="/earth-sciences" className="inline-block px-5 py-2.5 bg-surface hover:bg-surface-hover border border-border-custom rounded-xl font-semibold transition-all">
            חזרה לתוכנית הלימודים
          </Link>
        </div>
      </div>
    );
  }

  // Intercept and render a beautiful "Under Construction" placeholder page for Units 2, 3, 4
  if (unitData.id !== 1) {
    return (
      <div className="min-h-screen bg-[#080c18] text-[#e8edf8] flex items-center justify-center p-6 text-right font-sans">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent blur-3xl pointer-events-none rounded-full" />
        <div className="glass-card max-w-lg w-full rounded-3xl p-8 md:p-10 border border-amber-500/20 text-center space-y-6 relative overflow-hidden backdrop-blur-xl">
          <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(245,158,11,0.1)]">
            <Edit3 className="w-8 h-8 text-amber-500 animate-pulse" />
          </div>
          
          <div className="space-y-3">
            <span className="text-[10px] text-amber-400 font-black tracking-widest uppercase">
              יחידה {unitData.id}: {unitData.title}
            </span>
            <h3 className="text-2xl font-black text-white">
              השיעור נמצא בתהליך פיתוח 💻
            </h3>
            <p className="text-text-muted text-sm leading-relaxed max-w-sm mx-auto">
              התוכן, המצגות והיישומונים האינטראקטיביים עבור שיעור זה יעלו בקרוב, לאחר הזנת התוכן המקצועי על ידי המורה.
            </p>
          </div>

          <div className="pt-2">
            <Link 
              href="/earth-sciences" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-earth hover:bg-teal-600 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all cursor-pointer hover:scale-[1.02]"
            >
              <ArrowRight className="w-4 h-4" />
              <span>חזרה ללוח השיעורים</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleNextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(prev => prev + 1);
      setShowInlineWidget(false);
    }
  };

  const handlePrevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
      setShowInlineWidget(false);
    }
  };

  // Select widget to render based on widgetId
  const renderWidget = () => {
    switch (lessonData.widgetId) {
      case "earth-explorer":
        return <EarthExplorerWidget />;
      case "astronomy":
        return <AstronomyWidget />;
      case "climograph":
        return <ClimographWidget />;
      case "tectonics":
        return <TectonicsWidget />;
      case "footprint":
        return <FootprintWidget />;
      default:
        return null;
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
      {/* Background Glow */}
      {!isLight && !cinemaMode && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-teal-500/5 via-transparent to-transparent blur-3xl pointer-events-none rounded-full" />
      )}

      {/* HEADER: Hide in cinema mode to maximize projector space */}
      {!cinemaMode && (
        <header className={`w-full border-b ${borderTheme} py-4 relative z-20 bg-surface/10 backdrop-blur-md shrink-0`}>
          <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
            {/* Back to Earth Hub */}
            <Link
              href="/earth-sciences"
              className={`inline-flex items-center gap-1.5 text-xs font-bold ${textMuted} hover:text-earth transition-colors cursor-pointer`}
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>חזרה לתוכנית הלימודים</span>
            </Link>

            {/* Title display */}
            <div className="hidden md:block text-right">
              <span className={`text-[10px] font-bold text-earth`}>
                יחידה {unitData.id}: {unitData.title.split(" - ")[0]}
              </span>
              <h2 className={`text-sm font-black ${titleText}`}>
                {lessonData.title}
              </h2>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleComfortMode}
              className={`p-2 rounded-xl border ${borderTheme} bg-surface/30 hover:bg-surface-hover/30 transition-all cursor-pointer flex items-center gap-2 text-xs font-bold`}
            >
              {isLight ? (
                <>
                  <Moon className="w-4 h-4 text-purple-600" />
                  <span className="text-zinc-700">מצב כיתה חשוך</span>
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="text-zinc-300">מצב קריאה בהיר</span>
                </>
              )}
            </button>
          </div>
        </header>
      )}

      {/* Main Container */}
      <div className={`relative w-full max-w-6xl mx-auto px-6 py-6 flex-1 flex flex-col z-10 ${
        cinemaMode ? "fixed inset-0 max-w-none px-4 py-4 bg-zinc-950 z-50 justify-center" : ""
      }`}>
        
        {/* CINEMA MODE TOP HEADER OVERLAY */}
        {cinemaMode && (
          <div className="absolute top-4 inset-x-6 flex justify-between items-center z-50 text-white select-none">
            <div className="text-right">
              <span className="text-[10px] text-earth font-black tracking-wider uppercase">שיעור מוקרן</span>
              <h3 className="text-sm font-bold">{lessonData.title}</h3>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowNotebookOverlay(true)}
                className="px-3.5 py-1.5 rounded-lg border border-amber-500/20 bg-amber-950/30 hover:bg-amber-950/50 text-xs font-bold text-amber-400 flex items-center gap-1.5 cursor-pointer transition-all"
                title="הצג מושגים לכתיבה במחברת"
              >
                <BookCopy className="w-4 h-4 text-amber-400" />
                <span>מושגי מחברת 📝</span>
              </button>
              <button
                onClick={() => setCinemaMode(false)}
                className="px-3.5 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-xs font-bold text-zinc-300 flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <Minimize2 className="w-4 h-4 text-earth" />
                <span>יציאה ממצב הקרנה (Esc)</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab Selection Row: Hide in Cinema Mode */}
        {!cinemaMode && (
          <div className="flex border-b border-zinc-800/80 mb-6 pb-0.5 justify-start gap-4">
            <button
              onClick={() => setActiveTab("slides")}
              className={`pb-2.5 text-xs md:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 relative ${
                activeTab === "slides" ? "text-earth font-black border-b-2 border-earth" : "text-text-muted hover:text-foreground"
              }`}
            >
              <Presentation className="w-4 h-4" />
              <span>מצגת שיעור להקרנה</span>
            </button>
            <button
              onClick={() => setActiveTab("activity")}
              className={`pb-2.5 text-xs md:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 relative ${
                activeTab === "activity" ? "text-earth font-black border-b-2 border-earth" : "text-text-muted hover:text-foreground"
              }`}
            >
              <Play className="w-4 h-4" />
              <span>פעילות ויישומונים אינטראקטיביים</span>
            </button>
            <button
              onClick={() => setActiveTab("teacherGuide")}
              className={`pb-2.5 text-xs md:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 relative ${
                activeTab === "teacherGuide" ? "text-earth font-black border-b-2 border-earth" : "text-text-muted hover:text-foreground"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>מערך שיעור והנחיות מורה</span>
            </button>
          </div>
        )}

        {/* TAB 1: PRESENTATION SLIDES VIEWER */}
        {activeTab === "slides" && (
          <div className="flex-1 flex flex-col justify-between space-y-4">
            {/* Presentation Frame */}
            <div className={`flex-1 w-full rounded-3xl overflow-hidden shadow-2xl relative min-h-[520px] md:min-h-[580px] border flex flex-col justify-between transition-all duration-300 ${
              cinemaMode 
                ? "border-none bg-zinc-950/80 pt-16 pb-4 px-6 md:px-10" 
                : `${isLight 
                    ? "bg-gradient-to-br from-white to-zinc-50/50 border-zinc-200 shadow-sm" 
                    : "bg-gradient-to-br from-[#0c1226] to-[#080c18] border-teal-500/10 shadow-[0_20px_50px_rgba(20,184,166,0.06)] hover:shadow-[0_20px_50px_rgba(20,184,166,0.12)]"
                  }`
            }`}>
              
              {/* Top Bar Actions inside Frame (Normal Mode) */}
              {!cinemaMode && (
                <div className="absolute left-4 top-4 flex gap-2 z-30 select-none">
                  <button
                    onClick={() => setShowNotebookOverlay(true)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-sm ${
                      isLight 
                        ? "border-amber-200 bg-amber-50/90 hover:bg-amber-100 text-amber-800" 
                        : "border-amber-500/20 bg-amber-950/40 hover:bg-amber-950/65 text-amber-400"
                    }`}
                    title="הצג מושגים לכתיבה במחברת"
                  >
                    <BookCopy className="w-3.5 h-3.5 text-amber-400" />
                    <span>מושגי מחברת 📝</span>
                  </button>
                  <button
                    onClick={() => setCinemaMode(true)}
                    className="px-3 py-1.5 rounded-lg border border-border-custom bg-surface-hover/85 hover:bg-surface-hover text-xs font-bold text-text-muted flex items-center gap-1.5 cursor-pointer transition-all shadow-sm"
                    title="מסך מלא להקרנה בכיתה"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-earth" />
                    <span className="hidden sm:inline">מצב הקרנה בכיתה</span>
                  </button>
                </div>
              )}

              {/* SLIDE CARD CONTENT AREA */}
              <div className="flex-1 flex items-center justify-center p-6 md:p-10">
                {showInlineWidget && lessonData.widgetId ? (
                  /* INLINE INTERACTIVE WIDGET DISPLAY */
                  <div className="w-full h-full max-w-4xl relative z-10 flex flex-col justify-between animate-fade-in bg-zinc-950/90 p-3 rounded-2xl border border-zinc-800/80">
                    <div className="flex justify-between items-center mb-3 px-2">
                      <span className="text-xs text-earth font-bold flex items-center gap-1.5">
                        <Play className="w-4 h-4 text-earth shrink-0" />
                        <span>יישומון פעיל - להקרנה/תרגול כיתתי</span>
                      </span>
                      <button
                        onClick={() => setShowInlineWidget(false)}
                        className="px-3 py-1.5 border border-zinc-800 hover:bg-zinc-900 rounded-lg text-xs font-bold text-zinc-400 cursor-pointer animate-pulse"
                      >
                        סגור יישומון ויציאה לשקף
                      </button>
                    </div>
                    <div className="flex-1 overflow-y-auto max-h-[420px] border border-zinc-900 rounded-xl">
                      {renderWidget()}
                    </div>
                  </div>
                ) : (
                  /* STANDARD SLIDES CONTENTS */
                  <div className={`w-full flex flex-col justify-between h-full relative select-none ${
                    cinemaMode ? "max-w-5xl lg:max-w-6xl" : "max-w-4xl"
                  }`}>
                    {/* Slide content header */}
                    <div className={`text-right shrink-0 ${
                      cinemaMode ? "border-b-2 border-teal-500/25 pb-4 mb-8" : "border-b border-border-custom/40 pb-4 mb-8"
                    }`}>
                      <span className={`${
                        cinemaMode 
                          ? "text-xs tracking-widest text-teal-400 font-black block mb-1" 
                          : "text-[10px] text-earth font-black uppercase tracking-widest block mb-0.5"
                      }`}>
                        שקף {currentSlideIndex + 1} מתוך {slides.length}
                      </span>
                      <h3 className={`font-black mt-2 tracking-tight ${
                        cinemaMode 
                          ? "text-3xl md:text-4xl lg:text-5xl text-white" 
                          : `text-2xl md:text-3xl ${titleText}`
                      }`}>
                        {slides[currentSlideIndex].title}
                      </h3>
                    </div>

                    {/* Core slide text and media */}
                    <div className={`flex-grow flex flex-col md:flex-row gap-8 items-center justify-center py-2 ${
                      cinemaMode 
                        ? "w-full" 
                        : "overflow-y-auto max-h-[460px] md:max-h-[520px]"
                    }`}>
                      
                      {/* HOOK SLIDE WITH YOUTUBE OR IMAGE MEDIA */}
                      {slides[currentSlideIndex].visualType === "hook" && (lessonData.hookVideoId || lessonData.hookImageUrl) ? (
                        <>
                          {/* Text on Right */}
                          <div className="flex-1 text-right space-y-4">
                            <p className={`whitespace-pre-line leading-relaxed ${
                              cinemaMode 
                                ? "text-xl md:text-2xl lg:text-3xl font-semibold text-zinc-100" 
                                : `text-base md:text-lg lg:text-xl font-extrabold ${isLight ? "text-zinc-800" : "text-zinc-200"}`
                            }`}>
                              {slides[currentSlideIndex].content}
                            </p>
                          </div>
                          
                          {/* Media on Left */}
                          <div className={`aspect-video bg-zinc-900 rounded-2xl overflow-hidden border shrink-0 relative flex items-center justify-center ${
                            cinemaMode 
                              ? "w-full md:w-6/12 lg:w-7/12 shadow-[0_15px_50px_rgba(20,184,166,0.25)] border-teal-500/20" 
                              : "w-full md:w-5/12 shadow-lg border-zinc-800/40"
                          }`}>
                            {lessonData.hookVideoId ? (
                              <iframe
                                src={`https://www.youtube.com/embed/${lessonData.hookVideoId}?rel=0&modestbranding=1`}
                                title="סרטון פתיחה"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full border-0"
                              />
                            ) : lessonData.hookImageUrl === "rotating-earth-css" ? (
                              <>
                                {/* Stars background space simulation */}
                                <div className="absolute inset-0 bg-[#020617] bg-[radial-gradient(circle_at_center,rgba(15,23,42,0.4)_0%,rgba(3,7,18,1)_100%)] flex items-center justify-center" />
                                
                                {/* Earth GIF (Zoomed out: w-32 h-32 md:w-36 md:h-36) */}
                                <img
                                  src="/blue-marble-rotating.gif"
                                  alt="כדור הארץ מסתובב"
                                  className="w-32 h-32 md:w-36 md:h-36 object-contain z-10 rounded-full shadow-[0_0_40px_rgba(14,165,233,0.2)] border border-sky-500/10"
                                />
                              </>
                            ) : (
                              <img
                                src={lessonData.hookImageUrl}
                                alt="גירוי חזותי"
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                        </>
                      ) : slides[currentSlideIndex].visualType === "notebook" ? (
                        /* NOTEBOOK DESIGN SLIDE */
                        <div className={`w-full bg-amber-50/15 border rounded-3xl shadow-inner text-right relative overflow-hidden ${
                          cinemaMode 
                            ? "max-w-4xl p-8 md:p-10 border-amber-900/20" 
                            : "max-w-3xl p-6 md:p-8 border-amber-900/15"
                        }`}>
                          {/* Ruled lines overlay */}
                          <div className={`absolute inset-0 bg-[linear-gradient(rgba(146,128,100,0.08)_1px,transparent_1px)] pointer-events-none ${
                            cinemaMode ? "bg-[size:100%_36px]" : "bg-[size:100%_28px]"
                          }`} />
                          {/* Notebook margin line */}
                          <div className={`absolute top-0 bottom-0 w-[1px] bg-red-500/20 ${
                            cinemaMode ? "right-12" : "right-8"
                          }`} />
                          
                          <div className={`relative z-10 space-y-6 ${
                            cinemaMode ? "pr-10" : "pr-6"
                          }`}>
                            <div className="flex items-center gap-1.5 justify-start">
                              <Edit3 className={`text-amber-500 shrink-0 ${cinemaMode ? "w-6 h-6" : "w-5 h-5"}`} />
                              <span className={`font-black text-amber-500/90 ${cinemaMode ? "text-base md:text-lg" : "text-sm"}`}>הנחיית כתיבה לתלמידים 📝</span>
                            </div>
                            <h4 className={`font-black tracking-tight ${
                              cinemaMode 
                                ? "text-xl md:text-2xl lg:text-3xl text-zinc-100" 
                                : `text-lg md:text-xl ${titleText}`
                            }`}>
                              {slides[currentSlideIndex].content}
                            </h4>
                            <div className={`space-y-6`}>
                              {lessonData.notebookSummary.map((concept, cIdx) => (
                                <div key={cIdx} className="space-y-1.5 pr-2">
                                  <strong className={`text-earth font-black block border-b border-dashed border-earth/20 pb-0.5 ${
                                    cinemaMode ? "text-lg md:text-xl lg:text-2xl" : "text-base md:text-lg"
                                  }`}>
                                    • {concept.term}
                                  </strong>
                                  <p className={`leading-relaxed ${
                                    cinemaMode 
                                      ? "text-sm md:text-base lg:text-lg text-zinc-300 font-medium" 
                                      : `text-sm md:text-base ${isLight ? "text-zinc-700" : "text-zinc-300"} font-bold`
                                  }`}>
                                    {concept.definition}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : slides[currentSlideIndex].visualType === "task" ? (
                        /* TASK/MISSION DESIGN SLIDE */
                        <div className={`w-full text-right ${cinemaMode ? "max-w-4xl space-y-8" : "max-w-3xl space-y-6"}`}>
                          <p className={`leading-relaxed border-b border-dashed border-earth/30 pb-4 ${
                            cinemaMode 
                              ? "text-xl md:text-2xl lg:text-3xl font-black text-teal-300" 
                              : `text-lg md:text-xl font-extrabold ${isLight ? "text-zinc-900" : "text-zinc-100"}`
                          }`}>
                            {slides[currentSlideIndex].content}
                          </p>
                          <div className="space-y-4">
                            <h5 className={`font-black text-earth flex items-center gap-1.5 justify-start ${
                              cinemaMode ? "text-lg md:text-xl lg:text-2xl" : "text-base md:text-lg"
                            }`}>
                              <CheckCircle className={`text-earth shrink-0 ${cinemaMode ? "w-6 h-6" : "w-5 h-5"}`} />
                              <span>הנחיות לביצוע המשימה בכיתה:</span>
                            </h5>
                            <ul className={`list-none pr-0 ${cinemaMode ? "space-y-4 lg:space-y-5" : "space-y-3.5"}`}>
                              {lessonData.task.instructions.map((inst, index) => (
                                <li key={index} className="flex gap-3 justify-start items-start">
                                  <span className={`rounded-full bg-earth/10 border border-earth/20 text-earth font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                                    cinemaMode 
                                      ? "w-8 h-8 text-sm mt-1" 
                                      : "w-6 h-6 text-xs mt-0.5"
                                  }`}>
                                    {index + 1}
                                  </span>
                                  <span className={`leading-relaxed ${
                                    cinemaMode 
                                      ? "text-lg md:text-xl text-zinc-200 font-medium" 
                                      : `text-sm md:text-base ${isLight ? "text-zinc-800" : "text-zinc-200"} font-bold`
                                  }`}>{inst}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ) : slides[currentSlideIndex].visualType === "summary" ? (
                        /* SUMMARY SLIDE */
                        <div className={`w-full text-right ${cinemaMode ? "max-w-4xl space-y-6" : "max-w-3xl space-y-5"}`}>
                          <p className={`font-black border-b border-zinc-800/80 pb-4 ${
                            cinemaMode 
                              ? "text-xl md:text-2xl lg:text-3xl text-teal-400" 
                              : `text-lg md:text-xl lg:text-2xl text-teal-400`
                          }`}>
                            {slides[currentSlideIndex].content}
                          </p>
                          <ul className={`list-none pr-0 ${cinemaMode ? "space-y-5 lg:space-y-6" : "space-y-4"}`}>
                            {lessonData.summary.map((sumItem, sIdx) => (
                              <li key={sIdx} className="flex gap-3 justify-start items-start">
                                <span className={`rounded-full bg-teal-400 shrink-0 ${
                                  cinemaMode 
                                    ? "w-3 h-3 mt-2.5 shadow-[0_0_10px_rgba(20,184,166,0.8)]" 
                                    : "w-2.5 h-2.5 mt-2 shadow-[0_0_8px_rgba(20,184,166,0.6)]"
                                }`} />
                                <span className={`${
                                  cinemaMode 
                                    ? "text-lg md:text-xl lg:text-2xl text-zinc-100 font-medium" 
                                    : `text-base md:text-lg ${titleText} font-bold`
                                }`}>{sumItem}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        /* GENERAL TOPIC SLIDE OR VISUAL SLIDE WITH imageUrl */
                        <div className="w-full flex flex-col md:flex-row gap-8 items-center justify-center">
                          {/* Text on Right */}
                          <div className={`flex-1 text-right ${cinemaMode ? "max-w-4xl space-y-6" : "max-w-3xl space-y-5"}`}>
                            {slides[currentSlideIndex].bullets && slides[currentSlideIndex].bullets!.length > 0 ? (
                              <div className="space-y-6">
                                <p className={`font-black border-b border-zinc-800/80 pb-4 ${
                                  cinemaMode 
                                    ? "text-xl md:text-2xl lg:text-3xl text-teal-400 leading-relaxed" 
                                    : `text-lg md:text-xl lg:text-2xl text-teal-400 leading-relaxed`
                                }`}>
                                  {slides[currentSlideIndex].content}
                                </p>
                                <ul className={`list-none pr-0 ${cinemaMode ? "space-y-5 lg:space-y-6" : "space-y-4"}`}>
                                  {slides[currentSlideIndex].bullets!.map((bullet: string, bIdx: number) => (
                                    <li key={bIdx} className="flex gap-3 justify-start items-start">
                                      <span className={`rounded-full bg-teal-400 shrink-0 ${
                                        cinemaMode 
                                          ? "w-3 h-3 mt-2.5 shadow-[0_0_10px_rgba(20,184,166,0.8)]" 
                                          : "w-2.5 h-2.5 mt-2 shadow-[0_0_8px_rgba(20,184,166,0.6)]"
                                      }`} />
                                      <span className={`${
                                        cinemaMode 
                                          ? "text-lg md:text-xl lg:text-2xl text-zinc-100 font-medium leading-relaxed" 
                                          : `text-base md:text-lg ${titleText} font-bold leading-relaxed`
                                      }`}>{bullet}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ) : (
                              /* FALLBACK SIMPLE TOPIC SLIDE */
                              <p className={`whitespace-pre-line font-bold leading-relaxed ${
                                cinemaMode 
                                  ? "text-xl md:text-2xl lg:text-3xl text-zinc-200" 
                                  : `text-xl ${isLight ? "text-zinc-800" : "text-zinc-200"}`
                              }`}>
                                {slides[currentSlideIndex].content}
                              </p>
                            )}
                          </div>

                          {/* Optional Image or Video on Left */}
                          {slides[currentSlideIndex].videoDetailId ? (
                            <div className={`aspect-video bg-zinc-900 rounded-2xl overflow-hidden border shrink-0 relative flex items-center justify-center ${
                              cinemaMode 
                                ? "w-full md:w-6/12 lg:w-7/12 shadow-[0_15px_50px_rgba(20,184,166,0.25)] border-teal-500/20" 
                                : "w-full md:w-5/12 shadow-lg border-zinc-800/40"
                            }`}>
                              <iframe
                                src={`https://www.youtube.com/embed/${slides[currentSlideIndex].videoDetailId}?rel=0&modestbranding=1`}
                                title={slides[currentSlideIndex].title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full border-0"
                              />
                            </div>
                          ) : slides[currentSlideIndex].imageUrl ? (
                            <div className={`aspect-video bg-zinc-900 rounded-2xl overflow-hidden border shrink-0 relative flex items-center justify-center ${
                              cinemaMode 
                                ? "w-full md:w-6/12 lg:w-7/12 shadow-[0_15px_50px_rgba(20,184,166,0.25)] border-teal-500/20" 
                                : "w-full md:w-5/12 shadow-lg border-zinc-800/40"
                            }`}>
                              <img
                                src={slides[currentSlideIndex].imageUrl}
                                alt={slides[currentSlideIndex].title}
                                className="w-full h-full object-contain"
                              />
                            </div>
                          ) : null}
                        </div>
                      )}
                    </div>

                    {/* Inline Widget activator reminder */}
                    {slides[currentSlideIndex].visualType === "task" && lessonData.widgetId && (
                      <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-3 bg-earth/10 border border-earth/20 rounded-xl p-3 text-xs shrink-0 select-none">
                        <button
                          onClick={() => setShowInlineWidget(true)}
                          className="px-4 py-1.5 bg-earth hover:bg-teal-600 text-white rounded-lg font-bold cursor-pointer transition-all flex items-center gap-1.5 shrink-0"
                        >
                          <Play className="w-3.5 h-3.5 animate-pulse" />
                          <span>הפעל יישומון להדגמה</span>
                        </button>
                        <span className="text-earth font-bold text-right">
                          💡 תלמידים יקרים, כעת נפנה לתרגול וחקירה בעזרת היישומון הדיגיטלי הבא:
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Slider Bottom Navigation Controls */}
              <div className={`w-full border-t p-4 flex justify-between items-center shrink-0 ${
                cinemaMode ? "border-zinc-800 bg-zinc-900/40" : `${borderTheme} bg-surface-hover/20`
              }`}>
                {/* Previous button on the Right under RTL */}
                <button
                  onClick={handlePrevSlide}
                  disabled={currentSlideIndex === 0}
                  className="px-4 py-2 border border-border-custom bg-surface hover:bg-surface-hover disabled:opacity-40 disabled:cursor-not-allowed text-text-muted text-xs font-bold rounded-xl cursor-pointer transition-all flex items-center gap-1.5 select-none"
                >
                  <ChevronRight className="w-4 h-4 shrink-0" />
                  <span>שקף קודם</span>
                </button>

                <div className={`text-[10px] font-black hidden sm:block ${cinemaMode ? "text-zinc-500" : textMuted}`}>
                  מקשי חצים במקלדת (ימין/שמאל) מנווטים בשקפים
                </div>

                {/* Next button on the Left under RTL */}
                <button
                  onClick={handleNextSlide}
                  disabled={currentSlideIndex === slides.length - 1}
                  className="px-4 py-2 bg-earth hover:bg-teal-600 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl cursor-pointer transition-all flex items-center gap-1.5 select-none animate-pulse-hover"
                >
                  <span>שקף הבא</span>
                  <ChevronLeft className="w-4 h-4 shrink-0" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ACTIVE WIDGET / DIRECT TASK ACTIVITY */}
        {activeTab === "activity" && (
          <div className="flex-1 flex flex-col justify-start space-y-6">
            {/* Widget Container */}
            {lessonData.widgetId ? (
              <div className="w-full animate-fade-in">
                {renderWidget()}
              </div>
            ) : (
              <div className={`p-8 border ${borderTheme} rounded-2xl ${cardTheme} text-center space-y-4`}>
                <HelpCircle className="w-12 h-12 text-text-muted mx-auto" />
                <h4 className={`text-base font-bold ${titleText}`}>אין יישומון דיגיטלי מובנה לשיעור זה</h4>
                <p className={`${textMuted} text-xs max-w-sm mx-auto`}>
                  השיעור מתמקד בדיון כיתתי ושיח טיעוני. עקבו אחר ההנחיות למשימה בשקפי המצגת או במערך השיעור.
                </p>
              </div>
            )}

            {/* Task guidelines card */}
            <div className={`p-5 rounded-2xl border ${borderTheme} ${cardTheme} text-right space-y-3`}>
              <h4 className={`text-base font-bold ${titleText} flex items-center gap-1.5 justify-start`}>
                <CheckCircle className="w-4 h-4 text-earth shrink-0" />
                <span>הנחיות למשימה המעשית בכיתה</span>
              </h4>
              <p className={`text-xs ${textMuted} font-bold leading-normal`}>
                {lessonData.task.description}
              </p>
              <ol className={`text-xs ${textMuted} space-y-2 list-none pr-0`}>
                {lessonData.task.instructions.map((inst, index) => (
                  <li key={index} className="flex gap-2 justify-start items-start">
                    <span className="w-5 h-5 rounded-full bg-earth/10 border border-earth/20 text-earth text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span className="leading-relaxed">{inst}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}

        {/* TAB 3: TEACHER LESSON PLAN */}
        {activeTab === "teacherGuide" && (
          <div className="flex-1 flex flex-col justify-start space-y-6 text-right">
            
            {/* Pedagogical 3-Step Lesson Plan */}
            <div className={`p-5 rounded-2xl border ${borderTheme} ${cardTheme} space-y-4`}>
              <div className="flex justify-between items-center border-b border-border-custom pb-2">
                <span className={`text-[10px] ${textMuted} font-semibold flex items-center gap-1`}>
                  <Clock className="w-3.5 h-3.5 text-earth" />
                  <span>שיעור תלת-שלבי מומלץ (50 דקות)</span>
                </span>
                <h4 className={`text-base font-bold ${titleText}`}>מערך השיעור</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Step 1 */}
                <div className="space-y-2 bg-surface/20 p-4 border border-border-custom/50 rounded-xl flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-black text-earth block">שלב א׳ (15 דקות)</span>
                    <h5 className={`font-bold text-xs ${titleText} mt-1`}>הצגת הנושא וגירוי חזותי</h5>
                    <p className={`text-[11px] ${textMuted} leading-relaxed mt-2`}>
                      {lessonData.hook}
                    </p>
                  </div>
                  <span className={`text-[9px] font-bold ${textMuted} mt-4`}>מטרת השלב: חיבור אינטואיטיבי של התלמידים.</span>
                </div>

                {/* Step 2 */}
                <div className="space-y-2 bg-surface/20 p-4 border border-border-custom/50 rounded-xl flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-black text-earth block">שלב ב׳ (25 דקות)</span>
                    <h5 className={`font-bold text-xs ${titleText} mt-1`}>עבודה עצמית וחקר פעיל</h5>
                    <p className={`text-[11px] ${textMuted} leading-relaxed mt-2`}>
                      {lessonData.task.description} המשימה כוללת עבודה קבוצתית או מילוי שאלונים ביישומון.
                    </p>
                  </div>
                  <span className={`text-[9px] font-bold ${textMuted} mt-4`}>מטרת השלב: התמודדות עצמאית ומיון נתונים.</span>
                </div>

                {/* Step 3 */}
                <div className="space-y-2 bg-surface/20 p-4 border border-border-custom/50 rounded-xl flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-black text-earth block">שלב ג׳ (10 דקות)</span>
                    <h5 className={`font-bold text-xs ${titleText} mt-1`}>סיכום כיתתי במליאה</h5>
                    <p className={`text-[11px] ${textMuted} leading-relaxed mt-2`}>
                      הצגת הממצאים במליאה, דיון טיעוני כיתתי וחיזוק המושגים המדעיים: 
                      {lessonData.summary.slice(0, 2).join(" · ")}
                    </p>
                  </div>
                  <span className={`text-[9px] font-bold ${textMuted} mt-4`}>מטרת השלב: הבנייה רשמית של ידע והגדרות.</span>
                </div>
              </div>
            </div>

            {/* Notebook Copied Concepts Guide for Teacher */}
            {lessonData.notebookSummary && lessonData.notebookSummary.length > 0 && (
              <div className={`p-5 rounded-2xl border ${borderTheme} ${cardTheme} space-y-3`}>
                <h4 className={`text-sm font-bold ${titleText} flex items-center gap-1.5 justify-start`}>
                  <Edit3 className="w-4 h-4 text-earth shrink-0" />
                  <span>סיכום מושגי יסוד להעתקה למחברת התלמידים:</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {lessonData.notebookSummary.map((concept, cIdx) => (
                    <div key={cIdx} className="bg-surface/10 p-3 rounded-xl border border-border-custom text-right">
                      <strong className="text-white text-xs block border-b border-border-custom pb-1 mb-1.5">{concept.term}</strong>
                      <p className={`text-[11px] ${textMuted} leading-relaxed`}>{concept.definition}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}



            {/* Misconception Busters */}
            {lessonData.misconceptions && lessonData.misconceptions.length > 0 && (
              <div className="p-5 rounded-2xl border border-amber-500/20 bg-amber-950/10 space-y-3 text-right">
                <h4 className="text-sm font-bold text-amber-400 flex items-center gap-1.5 justify-start">
                  <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>התמודדות עם תפיסות שגויות וקשיים קוגניטיביים של תלמידים:</span>
                </h4>
                <ul className="text-xs text-text-muted space-y-2 list-none pr-0">
                  {lessonData.misconceptions.map((mis, mIdx) => (
                    <li key={mIdx} className="flex gap-2 justify-start items-start text-right">
                      <span className="leading-relaxed text-zinc-300">
                        ⚠️ <strong>תפיסה מוטעית נפוצה:</strong> {mis}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

      </div>

      {/* FOOTER: Hide in cinema mode */}
      {!cinemaMode && (
        <footer className={`w-full text-center py-6 border-t ${borderTheme} text-[10px] text-text-muted relative z-10 bg-surface/30 shrink-0`}>
          <span>© {new Date().getFullYear()} ניר עוז-ארי — מדעי כדור הארץ והיקום לכיתה ח׳</span>
        </footer>
      )}

      {/* NOTEBOOK OVERLAY PANEL */}
      {showNotebookOverlay && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] flex items-center justify-center p-4 select-none animate-fade-in" onClick={() => setShowNotebookOverlay(false)}>
          <div 
            className={`w-full max-w-lg rounded-3xl border shadow-2xl p-6 md:p-8 text-right relative space-y-6 transform scale-100 transition-all duration-300 ${
              isLight 
                ? "bg-amber-50/95 border-amber-200 text-zinc-800" 
                : "bg-zinc-900/95 border-amber-500/20 text-zinc-100"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setShowNotebookOverlay(false)}
              className={`absolute top-4 left-4 p-2 rounded-xl transition-all cursor-pointer ${
                isLight ? "hover:bg-amber-100 text-zinc-600" : "hover:bg-zinc-800 text-zinc-400"
              }`}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 justify-start pb-4 border-b border-amber-500/10">
              <BookCopy className="w-7 h-7 text-amber-500 shrink-0" />
              <div>
                <h3 className="text-lg md:text-xl font-black text-amber-500">
                  מושגי יסוד למחברת 📝
                </h3>
                <p className={`text-xs mt-0.5 ${isLight ? "text-zinc-500" : "text-zinc-400"}`}>
                  העתקת מושגי מפתח בצורה מסודרת במהלך השיעור
                </p>
              </div>
            </div>

            {lessonData.notebookSummary && lessonData.notebookSummary.length > 0 ? (
              <ul className="space-y-4 pr-0 list-none max-h-[300px] overflow-y-auto pl-2 scrollbar-custom text-right">
                {lessonData.notebookSummary.map((concept: NotebookConcept, cIdx: number) => (
                  <li key={cIdx} className="flex gap-3 justify-start items-start">
                    <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-2 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                    <div className="flex-1">
                      <strong className="text-amber-500 block text-sm font-black">{concept.term}</strong>
                      <p className={`text-xs md:text-sm font-medium mt-0.5 leading-relaxed ${isLight ? "text-zinc-600" : "text-zinc-300"}`}>
                        {concept.definition}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-6 text-text-muted">
                <p className="text-sm font-bold">אין מושגי מחברת מוגדרים לשיעור זה.</p>
              </div>
            )}

            <div className="pt-2 text-center">
              <button
                onClick={() => setShowNotebookOverlay(false)}
                className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm rounded-xl cursor-pointer transition-all shadow-[0_4px_12px_rgba(245,158,11,0.25)]"
              >
                הבנתי, סגור
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
