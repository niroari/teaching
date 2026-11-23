"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowRight,
  Printer,
  FileText,
  Target,
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
import { EARTH_SCIENCES_UNITS, type NotebookConcept, type Lesson, type LessonStage } from "@/lib/data/earth-sciences-lessons";
import { TOPICS_CONTENT } from "@/lib/data/earth-sciences-topics-content";

interface Slide {
  title: string;
  content: string;
  visualType: string;
  bullets?: string[];
  imageUrl?: string;
  videoDetailId?: string;
  layout?: "full-width";
}

// Import widgets
import AstronomyWidget from "@/components/earth-sciences/AstronomyWidget";
import AtmosphereWidget from "@/components/earth-sciences/AtmosphereWidget";
import TectonicsWidget from "@/components/earth-sciences/TectonicsWidget";
import FootprintWidget from "@/components/earth-sciences/FootprintWidget";
import TriviaJeopardyWidget from "@/components/earth-sciences/TriviaJeopardyWidget";
import { DigitalWorksheet, AnswerKey } from "@/components/earth-sciences/Worksheet";
import ActivityBar from "@/components/site/ActivityBar";
import { btn } from "@/components/site/ui";

/** Stage lengths of a 40-minute lesson, used when a lesson has no detailed plan of its own. */
const DEFAULT_STAGE_MINUTES = [10, 20, 10] as const;

export default function LessonPresenterConsolePage() {
  const { unit, lesson } = useParams();

  const [cinemaMode, setCinemaMode] = useState(false);
  const [activeTab, setActiveTab] = useState<"slides" | "activity" | "teacherGuide">("slides");
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showInlineWidget, setShowInlineWidget] = useState(false);
  const [showNotebookOverlay, setShowNotebookOverlay] = useState(false);
  const [lightboxImageUrl, setLightboxImageUrl] = useState<string | null>(null);

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
    
    const slides: Slide[] = [];

    // Every lesson opens with a short, striking video.
    if (lessonData.openingVideos && lessonData.openingVideos.length > 0) {
      slides.push({ title: "סרטון פתיחה", content: "", visualType: "video" });
    }

    slides.push({
      title: lessonData.hookTitle || lessonData.title,
      content: lessonData.hook,
      visualType: "hook"
    });

    const topicSlides = lessonData.topics.map((topic, idx) => {
      const richTopic = TOPICS_CONTENT[lessonId]?.[idx];
      return {
        afterTask: richTopic?.afterTask ?? false,
        slide: {
          title: richTopic ? richTopic.title : `נושא למידה ${idx + 1}: ${topic.split(":")[0] || "מושג יסוד"}`,
          content: richTopic ? richTopic.subtitle : topic,
          bullets: richTopic ? richTopic.bullets : [],
          imageUrl: richTopic ? richTopic.imageUrl : undefined,
          videoDetailId: richTopic ? richTopic.videoDetailId : undefined,
          layout: richTopic ? richTopic.layout : undefined,
          visualType: "topic"
        } as Slide
      };
    });

    slides.push(...topicSlides.filter((t) => !t.afterTask).map((t) => t.slide));

    slides.push({
      title: "משימה ועבודה עצמית בכיתה",
      content: lessonData.task.description,
      visualType: "task"
    });

    // Slides for the class summary (stage 3) come after the task.
    slides.push(...topicSlides.filter((t) => t.afterTask).map((t) => t.slide));

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
      <div className="min-h-screen bg-canvas text-fg flex items-center justify-center p-6 text-right font-sans">
        <div className="bg-card border-line max-w-md w-full rounded-xl p-8 border border-red-500/30 text-center space-y-4">
          <h3 className="text-xl font-bold text-red-700 dark:text-red-400">השיעור המבוקש לא נמצא</h3>
          <p className="text-fg-muted text-sm">הקישור שהזנת אינו תקין או שהשיעור עודנו בבנייה.</p>
          <Link href="/earth-sciences" className="inline-block px-5 py-2.5 bg-subtle hover:bg-subtle-hover border border-line rounded-xl font-semibold transition-all">
            חזרה לתוכנית הלימודים
          </Link>
        </div>
      </div>
    );
  }

  // Lessons that are not ready for class yet show an "in development" placeholder.
  if (lessonData.draft) {
    return (
      <div className="min-h-screen bg-canvas text-fg flex items-center justify-center p-6 text-right font-sans">
        <div className="bg-card border-line max-w-lg w-full rounded-xl p-8 md:p-10 border border-amber-500/20 text-center space-y-6 relative overflow-hidden">
          <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-center mx-auto">
            <Edit3 className="w-8 h-8 text-amber-500 animate-pulse" />
          </div>
          
          <div className="space-y-3">
            <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold tracking-widest uppercase">
              יחידה {unitData.id}: {unitData.title}
            </span>
            <h3 className="text-2xl font-bold text-fg">
              השיעור נמצא בתהליך פיתוח 💻
            </h3>
            <p className="text-fg-muted text-sm leading-relaxed max-w-sm mx-auto">
              התוכן, המצגות והיישומונים האינטראקטיביים עבור שיעור זה יעלו בקרוב, לאחר הזנת התוכן המקצועי על ידי המורה.
            </p>
          </div>

          <div className="pt-2">
            <Link 
              href="/earth-sciences" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-teal-600 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer hover:scale-[1.02]"
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
      case "astronomy":
        return <AstronomyWidget initialTab={lessonData.widgetTab ?? 0} />;
      case "atmosphere":
        return <AtmosphereWidget initialTab={lessonData.widgetTab ?? 0} />;
      case "tectonics":
        return <TectonicsWidget />;
      case "footprint":
        return <FootprintWidget />;
      case "trivia-jeopardy":
        return lessonData.trivia ? <TriviaJeopardyWidget bank={lessonData.trivia} /> : null;
      default:
        return null;
    }
  };

  const bgTheme = "bg-canvas text-fg";
  const borderTheme = "border-line";
  const cardTheme = "bg-card border-line shadow-sm";
  const textMuted = "text-fg-muted";
  const titleText = "text-fg";

  return (
    <div className={`relative min-h-screen ${bgTheme} flex flex-col justify-between overflow-hidden transition-colors duration-300`}>
      {/* Background Glow */}
      {/* HEADER: Hide in cinema mode to maximize projector space */}
      {!cinemaMode && (
        <ActivityBar
          backHref="/earth-sciences"
          backLabel="תוכנית הלימודים"
          sticky={false}
          title={
            <>
              <span className="text-accent">יחידה {unitData.id}</span>
              <span className="text-fg-subtle"> · </span>
              {lessonData.title}
            </>
          }
        />
      )}

      {/* Main Container */}
      <div className={`relative w-full max-w-6xl mx-auto px-6 py-6 flex-1 flex flex-col z-10 ${
        cinemaMode ? "fixed inset-0 max-w-none px-4 py-4 bg-card z-50 justify-center" : ""
      }`}>
        
        {/* CINEMA MODE TOP HEADER OVERLAY */}
        {cinemaMode && (
          <div className="absolute top-4 inset-x-6 flex justify-between items-center z-50 text-fg select-none">
            <div className="text-right">
              <span className="text-[10px] text-accent font-bold tracking-wider uppercase">שיעור מוקרן</span>
              <h3 className="text-sm font-bold">{lessonData.title}</h3>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowNotebookOverlay(true)}
                className="px-3.5 py-1.5 rounded-lg border border-amber-500/20 bg-amber-50 dark:bg-amber-950/30 hover:bg-amber-50 dark:hover:bg-amber-950/50 text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5 cursor-pointer transition-all"
                title="הצג מושגים לכתיבה במחברת"
              >
                <BookCopy className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                <span>מושגי מחברת 📝</span>
              </button>
              <button
                onClick={() => setCinemaMode(false)}
                className="px-3.5 py-1.5 rounded-lg border border-line bg-card hover:bg-subtle text-xs font-bold text-fg flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <Minimize2 className="w-4 h-4 text-accent" />
                <span>יציאה ממצב הקרנה (Esc)</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab Selection Row: Hide in Cinema Mode */}
        {!cinemaMode && (
          <div className="flex border-b border-line mb-6 pb-0.5 justify-start gap-4">
            <button
              onClick={() => setActiveTab("slides")}
              className={`pb-2.5 text-xs md:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 relative ${
                activeTab === "slides" ? "text-accent font-bold border-b-2 border-accent" : "text-fg-muted hover:text-fg"
              }`}
            >
              <Presentation className="w-4 h-4" />
              <span>מצגת שיעור להקרנה</span>
            </button>
            <button
              onClick={() => setActiveTab("activity")}
              className={`pb-2.5 text-xs md:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 relative ${
                activeTab === "activity" ? "text-accent font-bold border-b-2 border-accent" : "text-fg-muted hover:text-fg"
              }`}
            >
              <Play className="w-4 h-4" />
              <span>פעילות ויישומונים אינטראקטיביים</span>
            </button>
            <button
              onClick={() => setActiveTab("teacherGuide")}
              className={`pb-2.5 text-xs md:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 relative ${
                activeTab === "teacherGuide" ? "text-accent font-bold border-b-2 border-accent" : "text-fg-muted hover:text-fg"
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
                ? "border-none bg-subtle pt-16 pb-4 px-6 md:px-10" 
                : `bg-gradient-to-br from-white to-zinc-50/50 border-line shadow-sm dark:from-[#0c1226] dark:to-[#080c18] dark:border-teal-500/10`
            }`}>
              
              {/* Top Bar Actions inside Frame (Normal Mode) */}
              {!cinemaMode && (
                <div className="absolute left-4 top-4 flex gap-2 z-30 select-none">
                  <button
                    onClick={() => setShowNotebookOverlay(true)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-sm border-amber-200 bg-amber-50/90 hover:bg-amber-100 text-amber-800 dark:border-amber-500/20 dark:bg-amber-950/40 dark:hover:bg-amber-950/65 dark:text-amber-400`}
                    title="הצג מושגים לכתיבה במחברת"
                  >
                    <BookCopy className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                    <span>מושגי מחברת 📝</span>
                  </button>
                  <button
                    onClick={() => setCinemaMode(true)}
                    className="px-3 py-1.5 rounded-lg border border-line bg-subtle-hover hover:bg-subtle-hover text-xs font-bold text-fg-muted flex items-center gap-1.5 cursor-pointer transition-all shadow-sm"
                    title="מסך מלא להקרנה בכיתה"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-accent" />
                    <span className="hidden sm:inline">מצב הקרנה בכיתה</span>
                  </button>
                </div>
              )}

              {/* SLIDE CARD CONTENT AREA */}
              <div className="flex-1 flex items-center justify-center p-6 md:p-10">
                {showInlineWidget && lessonData.widgetId ? (
                  /* INLINE INTERACTIVE WIDGET DISPLAY */
                  <div className="w-full h-full max-w-4xl relative z-10 flex flex-col justify-between animate-fade-in bg-subtle p-3 rounded-xl border border-line">
                    <div className="flex justify-between items-center mb-3 px-2">
                      <span className="text-xs text-accent font-bold flex items-center gap-1.5">
                        <Play className="w-4 h-4 text-accent shrink-0" />
                        <span>יישומון פעיל - להקרנה/תרגול כיתתי</span>
                      </span>
                      <button
                        onClick={() => setShowInlineWidget(false)}
                        className="px-3 py-1.5 border border-line hover:bg-card rounded-lg text-xs font-bold text-fg-muted cursor-pointer animate-pulse"
                      >
                        סגור יישומון ויציאה לשקף
                      </button>
                    </div>
                    <div className="flex-1 overflow-y-auto max-h-[420px] border border-line rounded-xl">
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
                      cinemaMode ? "border-b-2 border-teal-500/25 pb-4 mb-8" : "border-b border-line pb-4 mb-8"
                    }`}>
                      <span className={`${
                        cinemaMode 
                          ? "text-xs tracking-widest text-teal-700 dark:text-teal-400 font-bold block mb-1" 
                          : "text-[10px] text-accent font-bold uppercase tracking-widest block mb-0.5"
                      }`}>
                        שקף {currentSlideIndex + 1} מתוך {slides.length}
                      </span>
                      <h3 className={`font-black mt-2 tracking-tight ${
                        cinemaMode 
                          ? "text-3xl md:text-4xl lg:text-5xl text-fg" 
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
                      {slides[currentSlideIndex].visualType === "video" && lessonData.openingVideos ? (
                        <div className={`w-full grid gap-5 ${lessonData.openingVideos.length > 1 ? "md:grid-cols-2" : "max-w-3xl mx-auto"}`}>
                          {lessonData.openingVideos.map((video) => (
                            <figure key={video.youtubeId} className="space-y-2 text-right">
                              <div className="aspect-video overflow-hidden rounded-lg border border-line bg-subtle">
                                <iframe
                                  src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?rel=0&modestbranding=1`}
                                  title={video.title}
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                  className="h-full w-full border-0"
                                />
                              </div>
                              <figcaption className="space-y-1">
                                <p className={`font-semibold text-fg ${cinemaMode ? "text-lg" : "text-sm"}`}>{video.title}</p>
                                <p className={`text-fg-muted ${cinemaMode ? "text-base" : "text-sm"}`}>
                                  בזמן הצפייה: {video.watchFor}
                                </p>
                                <a
                                  href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-xs font-medium text-accent underline-offset-4 hover:underline"
                                >
                                  פתיחה ב-YouTube · {Math.floor(video.seconds / 60)}:{String(video.seconds % 60).padStart(2, "0")} דק׳
                                </a>
                              </figcaption>
                            </figure>
                          ))}
                        </div>
                      ) : slides[currentSlideIndex].visualType === "hook" && lessonData.hookImages && lessonData.hookImages.length > 0 ? (
                        <div className="w-full space-y-4">
                          <p className={`whitespace-pre-line leading-relaxed text-right ${
                            cinemaMode ? "text-xl md:text-2xl font-semibold text-fg" : "text-base md:text-lg font-bold text-fg"
                          }`}>
                            {slides[currentSlideIndex].content}
                          </p>
                          <div className={`grid gap-4 ${lessonData.hookImages.length > 1 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 max-w-3xl mx-auto"}`}>
                            {lessonData.hookImages.map((img) => (
                              <figure key={img.src} className="space-y-1.5">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={img.src}
                                  alt={img.caption}
                                  className={`w-full object-cover rounded-lg border border-line cursor-zoom-in ${cinemaMode ? "aspect-[16/10]" : "aspect-[16/9]"}`}
                                  onClick={() => setLightboxImageUrl(img.src)}
                                />
                                <figcaption className="text-sm text-fg-muted text-right">{img.caption}</figcaption>
                              </figure>
                            ))}
                          </div>
                        </div>
                      ) : slides[currentSlideIndex].visualType === "hook" && (lessonData.hookVideoId || lessonData.hookImageUrl) ? (
                        <>
                          {/* Text on Right */}
                          <div className="flex-1 text-right space-y-4">
                            <p className={`whitespace-pre-line leading-relaxed ${
                              cinemaMode 
                                ? "text-xl md:text-2xl lg:text-3xl font-semibold text-fg" 
                                : `text-base md:text-lg lg:text-xl font-extrabold text-fg`
                            }`}>
                              {slides[currentSlideIndex].content}
                            </p>
                          </div>
                          
                          {/* Media on Left */}
                          {lessonData.hookVideoId ? (
                            <div className={`aspect-video bg-card rounded-xl overflow-hidden border shrink-0 relative flex items-center justify-center ${
                              cinemaMode 
                                ? "w-full md:w-6/12 lg:w-7/12 border-teal-500/20" 
                                : "w-full md:w-5/12 shadow-sm border-line"
                            }`}>
                              <iframe
                                src={`https://www.youtube.com/embed/${lessonData.hookVideoId}?rel=0&modestbranding=1`}
                                title="סרטון פתיחה"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full border-0"
                              />
                            </div>
                          ) : lessonData.hookImageUrl === "rotating-earth-css" ? (
                            <div className={`aspect-video bg-card bg-[radial-gradient(circle_at_center,rgba(15,23,42,0.4)_0%,rgba(3,7,18,1)_100%)] rounded-xl overflow-hidden border shrink-0 relative flex items-center justify-center ${
                              cinemaMode 
                                ? "w-full md:w-6/12 lg:w-7/12 border-teal-500/20" 
                                : "w-full md:w-5/12 shadow-sm border-line"
                            }`}>
                              {/* Earth GIF (Zoomed out: w-32 h-32 md:w-36 md:h-36) */}
                              <img
                                src="/blue-marble-rotating.gif"
                                alt="כדור הארץ מסתובב"
                                className="w-32 h-32 md:w-36 md:h-36 object-contain z-10 rounded-full border border-sky-500/10"
                              />
                            </div>
                          ) : (
                            <div className={`shrink-0 relative flex items-center justify-center ${
                              cinemaMode 
                                ? "w-full md:w-6/12 lg:w-7/12" 
                                : "w-full md:w-5/12"
                            }`}>
                              <img
                                src={lessonData.hookImageUrl}
                                alt="גירוי חזותי"
                                className={`max-w-full max-h-[410px] md:max-h-[470px] object-contain rounded-xl border cursor-zoom-in hover:scale-[1.01] transition-transform duration-300 ${
                                  cinemaMode 
                                    ? "border-teal-500/20" 
                                    : "shadow-sm border-line"
                                }`}
                                onClick={() => setLightboxImageUrl(lessonData.hookImageUrl || null)}
                              />
                            </div>
                          )}
                        </>
                      ) : slides[currentSlideIndex].visualType === "notebook" ? (
                        /* NOTEBOOK DESIGN SLIDE */
                        <div className={`w-full bg-amber-50/15 border rounded-xl shadow-inner text-right relative overflow-hidden ${
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
                              <span className={`font-bold text-amber-500/90 ${cinemaMode ? "text-base md:text-lg" : "text-sm"}`}>הנחיית כתיבה לתלמידים 📝</span>
                            </div>
                            <h4 className={`font-black tracking-tight ${
                              cinemaMode 
                                ? "text-xl md:text-2xl lg:text-3xl text-fg" 
                                : `text-lg md:text-xl ${titleText}`
                            }`}>
                              {slides[currentSlideIndex].content}
                            </h4>
                            <div className={`space-y-6`}>
                              {lessonData.notebookSummary.map((concept, cIdx) => (
                                <div key={cIdx} className="space-y-1.5 pr-2">
                                  <strong className={`text-accent font-bold block border-b border-dashed border-accent/20 pb-0.5 ${
                                    cinemaMode ? "text-lg md:text-xl lg:text-2xl" : "text-base md:text-lg"
                                  }`}>
                                    • {concept.term}
                                  </strong>
                                  <p className={`leading-relaxed ${
                                    cinemaMode 
                                      ? "text-sm md:text-base lg:text-lg text-fg font-medium" 
                                      : `text-sm md:text-base text-fg font-bold`
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
                              ? "text-xl md:text-2xl lg:text-3xl font-bold text-teal-700 dark:text-teal-300" 
                              : `text-lg md:text-xl font-extrabold text-fg`
                          }`}>
                            {slides[currentSlideIndex].content}
                          </p>
                          <div className="space-y-4">
                            <h5 className={`font-bold text-accent flex items-center gap-1.5 justify-start ${
                              cinemaMode ? "text-lg md:text-xl lg:text-2xl" : "text-base md:text-lg"
                            }`}>
                              <CheckCircle className={`text-accent shrink-0 ${cinemaMode ? "w-6 h-6" : "w-5 h-5"}`} />
                              <span>הנחיות לביצוע המשימה בכיתה:</span>
                            </h5>
                            <ul className={`list-none pr-0 ${cinemaMode ? "space-y-4 lg:space-y-5" : "space-y-3.5"}`}>
                              {lessonData.task.instructions.map((inst, index) => (
                                <li key={index} className="flex gap-3 justify-start items-start">
                                  <span className={`rounded-full bg-accent-soft border border-accent/20 text-accent font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                                    cinemaMode 
                                      ? "w-8 h-8 text-sm mt-1" 
                                      : "w-6 h-6 text-xs mt-0.5"
                                  }`}>
                                    {index + 1}
                                  </span>
                                  <span className={`leading-relaxed ${
                                    cinemaMode 
                                      ? "text-lg md:text-xl text-fg font-medium" 
                                      : `text-sm md:text-base text-fg font-bold`
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
                              ? "text-xl md:text-2xl lg:text-3xl text-teal-700 dark:text-teal-400" 
                              : `text-lg md:text-xl lg:text-2xl text-teal-400`
                          }`}>
                            {slides[currentSlideIndex].content}
                          </p>
                          <ul className={`list-none pr-0 ${cinemaMode ? "space-y-5 lg:space-y-6" : "space-y-4"}`}>
                            {lessonData.summary.map((sumItem, sIdx) => (
                              <li key={sIdx} className="flex gap-3 justify-start items-start">
                                <span className={`rounded-full bg-teal-400 shrink-0 ${
                                  cinemaMode 
                                    ? "w-3 h-3 mt-2.5" 
                                    : "w-2.5 h-2.5 mt-2"
                                }`} />
                                <span className={`${
                                  cinemaMode 
                                    ? "text-lg md:text-xl lg:text-2xl text-fg font-medium" 
                                    : `text-base md:text-lg ${titleText} font-bold`
                                }`}>{sumItem}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        /* GENERAL TOPIC SLIDE OR VISUAL SLIDE WITH imageUrl */
                        slides[currentSlideIndex].layout === "full-width" ? (
                          /* FULL WIDTH BANNER LAYOUT FOR SUB-TOPIC INTROS - IMAGE DOMINANT */
                          <div className="w-full flex flex-col gap-4 text-center items-stretch justify-center">
                            {/* Massive Wide Image Banner - taking maximum space */}
                            {slides[currentSlideIndex].imageUrl && (
                              <div className="mx-auto relative cursor-zoom-in group transition-all duration-300 w-fit shrink-0">
                                <img
                                  src={slides[currentSlideIndex].imageUrl}
                                  alt={slides[currentSlideIndex].title}
                                  className="w-auto h-52 sm:h-68 md:h-[330px] lg:h-[350px] xl:h-[390px] max-h-[52vh] object-contain rounded-xl border border-line shadow-sm group-hover:scale-[1.01] transition-transform duration-500"
                                  onClick={() => setLightboxImageUrl(slides[currentSlideIndex].imageUrl || null)}
                                />
                                <div className="absolute inset-0 pointer-events-none rounded-xl bg-black/80" />
                                
                                {/* Overlay Subtitle Content */}
                                <div className="absolute bottom-4 right-4 left-4 text-right z-10 pointer-events-none">
                                  <p className="text-fg font-bold text-xs sm:text-sm md:text-base lg:text-lg">
                                    {slides[currentSlideIndex].content}
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* Short & Focused Questions Row */}
                            {slides[currentSlideIndex].bullets && slides[currentSlideIndex].bullets!.length > 0 && (
                              <div className="flex flex-wrap gap-3 justify-center items-center py-1.5 shrink-0 select-none">
                                {slides[currentSlideIndex].bullets!.map((bullet: string, bIdx: number) => (
                                  <span 
                                    key={bIdx} 
                                    className={`px-4 py-2 rounded-xl border ${borderTheme} bg-subtle text-fg dark:bg-teal-500/5 dark:text-teal-400 text-xs md:text-sm font-bold shadow-sm shrink-0`}
                                  >
                                    💬 {bullet}
                                  </span>
                                ))}
                              </div>
                            )}
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
                                      ? "text-xl md:text-2xl lg:text-3xl text-teal-700 dark:text-teal-400 leading-relaxed" 
                                      : `text-lg md:text-xl lg:text-2xl text-teal-400 leading-relaxed`
                                  }`}>
                                    {slides[currentSlideIndex].content}
                                  </p>
                                  <ul className={`list-none pr-0 ${cinemaMode ? "space-y-5 lg:space-y-6" : "space-y-4"}`}>
                                    {slides[currentSlideIndex].bullets!.map((bullet: string, bIdx: number) => (
                                      <li key={bIdx} className="flex gap-3 justify-start items-start">
                                        <span className={`rounded-full bg-teal-400 shrink-0 ${
                                          cinemaMode 
                                            ? "w-3 h-3 mt-2.5" 
                                            : "w-2.5 h-2.5 mt-2"
                                        }`} />
                                        <span className={`${
                                          cinemaMode 
                                            ? "text-lg md:text-xl lg:text-2xl text-fg font-medium leading-relaxed" 
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
                                    ? "text-xl md:text-2xl lg:text-3xl text-fg" 
                                    : `text-xl text-fg`
                                }`}>
                                  {slides[currentSlideIndex].content}
                                </p>
                              )}
                            </div>

                            {/* Optional Image or Video on Left */}
                            {slides[currentSlideIndex].videoDetailId ? (
                              <div className={`aspect-video bg-card rounded-xl overflow-hidden border shrink-0 relative flex items-center justify-center ${
                                cinemaMode 
                                  ? "w-full md:w-6/12 lg:w-7/12 border-teal-500/20" 
                                  : "w-full md:w-5/12 shadow-sm border-line"
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
                              <div className={`shrink-0 relative flex items-center justify-center ${
                                cinemaMode 
                                  ? "w-full md:w-6/12 lg:w-7/12" 
                                  : "w-full md:w-5/12"
                              }`}>
                                <img
                                  src={slides[currentSlideIndex].imageUrl}
                                  alt={slides[currentSlideIndex].title}
                                  className={`max-w-full max-h-[416px] md:max-h-[468px] object-contain rounded-xl border cursor-zoom-in hover:scale-[1.01] transition-transform duration-300 ${
                                    cinemaMode 
                                      ? "border-teal-500/20" 
                                      : "shadow-sm border-line"
                                  }`}
                                  onClick={() => setLightboxImageUrl(slides[currentSlideIndex].imageUrl || null)}
                                />
                              </div>
                            ) : null}
                          </div>
                        )
                      )}
                    </div>

                    {/* Inline Widget activator reminder */}
                    {slides[currentSlideIndex].visualType === "task" && lessonData.widgetId && (
                      <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-3 bg-accent-soft border border-accent/20 rounded-xl p-3 text-xs shrink-0 select-none">
                        <span className="text-accent font-bold text-right">
                          💡 תלמידים יקרים, כעת נפנה לתרגול וחקירה בעזרת היישומון הדיגיטלי הבא:
                        </span>
                        <button
                          onClick={() => setShowInlineWidget(true)}
                          className="px-4 py-1.5 bg-accent hover:bg-teal-600 text-white rounded-lg font-bold cursor-pointer transition-all flex items-center gap-1.5 shrink-0"
                        >
                          <Play className="w-3.5 h-3.5 animate-pulse" />
                          <span>הפעל יישומון להדגמה</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Slider Bottom Navigation Controls */}
              <div className={`w-full border-t p-4 flex justify-between items-center shrink-0 ${
                cinemaMode ? "border-line bg-subtle" : `${borderTheme} bg-surface-hover/20`
              }`}>
                {/* Previous button on the Right under RTL */}
                <button
                  onClick={handlePrevSlide}
                  disabled={currentSlideIndex === 0}
                  className="px-4 py-2 border border-line bg-subtle hover:bg-subtle-hover disabled:opacity-40 disabled:cursor-not-allowed text-fg-muted text-xs font-bold rounded-xl cursor-pointer transition-all flex items-center gap-1.5 select-none"
                >
                  <ChevronRight className="w-4 h-4 shrink-0" />
                  <span>שקף קודם</span>
                </button>

                <div className={`text-[10px] font-bold hidden sm:block ${cinemaMode ? "text-fg-muted" : textMuted}`}>
                  מקשי חצים במקלדת (ימין/שמאל) מנווטים בשקפים
                </div>

                {/* Next button on the Left under RTL */}
                <button
                  onClick={handleNextSlide}
                  disabled={currentSlideIndex === slides.length - 1}
                  className="px-4 py-2 bg-accent hover:bg-teal-600 disabled:bg-subtle disabled:text-fg-muted disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl cursor-pointer transition-all flex items-center gap-1.5 select-none animate-pulse-hover"
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
            {/* The lesson's worksheet, filled in on the site */}
            {lessonData.worksheet && (
              <DigitalWorksheet
                worksheet={lessonData.worksheet}
                lessonId={lessonId}
                printHref={`/earth-sciences/${unitSlug}/${lessonId}/worksheet`}
              />
            )}

            {/* Widget Container */}
            {lessonData.widgetId ? (
              <div className="w-full animate-fade-in">
                {renderWidget()}
              </div>
            ) : lessonData.worksheet ? null : (
              <div className={`p-8 border ${borderTheme} rounded-xl ${cardTheme} text-center space-y-4`}>
                <HelpCircle className="w-12 h-12 text-fg-muted mx-auto" />
                <h4 className={`text-base font-bold ${titleText}`}>אין יישומון דיגיטלי מובנה לשיעור זה</h4>
                <p className={`${textMuted} text-xs max-w-sm mx-auto`}>
                  השיעור מתמקד בדיון כיתתי ושיח טיעוני. עקבו אחר ההנחיות למשימה בשקפי המצגת או במערך השיעור.
                </p>
              </div>
            )}

            {/* Task guidelines card (the worksheet carries its own instructions) */}
            {!lessonData.worksheet && (
            <div className={`p-5 rounded-xl border ${borderTheme} ${cardTheme} text-right space-y-3`}>
              <h4 className={`text-base font-bold ${titleText} flex items-center gap-1.5 justify-start`}>
                <CheckCircle className="w-4 h-4 text-accent shrink-0" />
                <span>הנחיות למשימה המעשית בכיתה</span>
              </h4>
              <p className={`text-xs ${textMuted} font-bold leading-normal`}>
                {lessonData.task.description}
              </p>
              <ol className={`text-xs ${textMuted} space-y-2 list-none pr-0`}>
                {lessonData.task.instructions.map((inst, index) => (
                  <li key={index} className="flex gap-2 justify-start items-start">
                    <span className="w-5 h-5 rounded-full bg-accent-soft border border-accent/20 text-accent text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span className="leading-relaxed">{inst}</span>
                  </li>
                ))}
              </ol>
            </div>
            )}
          </div>
        )}

        {/* TAB 3: TEACHER LESSON PLAN */}
        {activeTab === "teacherGuide" && (
          <div className="flex-1 flex flex-col justify-start space-y-6 text-right">
            
            {/* 40-minute lesson plan: three stages */}
            <LessonPlanView lessonData={lessonData} />

            {/* Worksheet: print links and answer key */}
            {lessonData.worksheet && (
              <div className="p-5 rounded-lg border border-line bg-card space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
                  <h4 className="flex items-center gap-1.5 text-base font-semibold text-fg">
                    <FileText className="w-4 h-4 text-accent shrink-0" strokeWidth={1.75} />
                    <span>דף העבודה: {lessonData.worksheet.title}</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/earth-sciences/${unitSlug}/${lessonId}/worksheet`} target="_blank" className={btn.secondary}>
                      <Printer className="w-4 h-4" strokeWidth={1.75} aria-hidden />
                      <span>דף לתלמידים</span>
                    </Link>
                    <Link href={`/earth-sciences/${unitSlug}/${lessonId}/worksheet?key=1`} target="_blank" className={btn.secondary}>
                      <Printer className="w-4 h-4" strokeWidth={1.75} aria-hidden />
                      <span>מחוון להדפסה</span>
                    </Link>
                  </div>
                </div>
                <AnswerKey worksheet={lessonData.worksheet} />
              </div>
            )}

            {/* Notebook Copied Concepts Guide for Teacher */}
            {lessonData.notebookSummary && lessonData.notebookSummary.length > 0 && (
              <div className={`p-5 rounded-xl border ${borderTheme} ${cardTheme} space-y-3`}>
                <h4 className={`text-sm font-bold ${titleText} flex items-center gap-1.5 justify-start`}>
                  <Edit3 className="w-4 h-4 text-accent shrink-0" />
                  <span>סיכום מושגי יסוד להעתקה למחברת התלמידים:</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {lessonData.notebookSummary.map((concept, cIdx) => (
                    <div key={cIdx} className="bg-subtle p-3 rounded-xl border border-line text-right">
                      <strong className="text-fg text-xs block border-b border-line pb-1 mb-1.5">{concept.term}</strong>
                      <p className={`text-[11px] ${textMuted} leading-relaxed`}>{concept.definition}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}



            {/* Misconception Busters */}
            {lessonData.misconceptions && lessonData.misconceptions.length > 0 && (
              <div className="p-5 rounded-xl border border-amber-500/20 bg-amber-50 dark:bg-amber-950/10 space-y-3 text-right">
                <h4 className="text-sm font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5 justify-start">
                  <Lightbulb className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
                  <span>התמודדות עם תפיסות שגויות וקשיים קוגניטיביים של תלמידים:</span>
                </h4>
                <ul className="text-xs text-fg-muted space-y-2 list-none pr-0">
                  {lessonData.misconceptions.map((mis, mIdx) => (
                    <li key={mIdx} className="flex gap-2 justify-start items-start text-right">
                      <span className="leading-relaxed text-fg">
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
        <footer className={`w-full text-center py-6 border-t ${borderTheme} text-[10px] text-fg-muted relative z-10 bg-subtle shrink-0`}>
          <span>© {new Date().getFullYear()} נקודת ציון — מדעי כדור הארץ והיקום לכיתה ח׳</span>
        </footer>
      )}

      {/* NOTEBOOK OVERLAY PANEL */}
      {showNotebookOverlay && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 select-none animate-fade-in" onClick={() => setShowNotebookOverlay(false)}>
          <div 
            className={`w-full max-w-lg rounded-xl border shadow-sm p-6 md:p-8 text-right relative space-y-6 transform scale-100 transition-all duration-300 bg-amber-50/95 border-amber-200 text-fg dark:bg-subtle dark:border-amber-500/20`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setShowNotebookOverlay(false)}
              className={`absolute top-4 left-4 p-2 rounded-xl transition-all cursor-pointer hover:bg-amber-100 text-fg-muted dark:hover:bg-subtle`}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 justify-start pb-4 border-b border-amber-500/10">
              <BookCopy className="w-7 h-7 text-amber-500 shrink-0" />
              <div>
                <h3 className="text-lg md:text-xl font-bold text-amber-500">
                  מושגי יסוד למחברת 📝
                </h3>
                <p className={`text-xs mt-0.5 text-fg-muted`}>
                  העתקת מושגי מפתח בצורה מסודרת במהלך השיעור
                </p>
              </div>
            </div>

            {lessonData.notebookSummary && lessonData.notebookSummary.length > 0 ? (
              <ul className="space-y-4 pr-0 list-none max-h-[300px] overflow-y-auto pl-2 scrollbar-custom text-right">
                {lessonData.notebookSummary.map((concept: NotebookConcept, cIdx: number) => (
                  <li key={cIdx} className="flex gap-3 justify-start items-start">
                    <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-2" />
                    <div className="flex-1">
                      <strong className="text-amber-500 block text-sm font-bold">{concept.term}</strong>
                      <p className={`text-xs md:text-sm font-medium mt-0.5 leading-relaxed text-fg-muted`}>
                        {concept.definition}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-6 text-fg-muted">
                <p className="text-sm font-bold">אין מושגי מחברת מוגדרים לשיעור זה.</p>
              </div>
            )}

            <div className="pt-2 text-center">
              <button
                onClick={() => setShowNotebookOverlay(false)}
                className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm rounded-xl cursor-pointer transition-all"
              >
                הבנתי, סגור
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IMAGE LIGHTBOX OVERLAY */}
      {lightboxImageUrl && (
        <div 
          className="fixed inset-0 bg-black/95 z-[100] flex flex-col items-center justify-center p-4 cursor-zoom-out select-none animate-fade-in"
          onClick={() => setLightboxImageUrl(null)}
        >
          {/* Close Button */}
          <button 
            onClick={() => setLightboxImageUrl(null)}
            className="fixed top-6 left-6 p-2 rounded-xl bg-subtle border border-line hover:bg-subtle text-fg cursor-pointer z-[110]"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="relative max-w-[90vw] max-h-[85vh] flex items-center justify-center">
            <img 
              src={lightboxImageUrl} 
              alt="תמונה מוגדלת" 
              className="max-w-full max-h-full object-contain rounded-xl shadow-sm border border-line"
              onClick={(e) => e.stopPropagation()} 
            />
          </div>
          
          <span className="text-fg-muted text-xs font-bold mt-4 tracking-wider">
            לחץ בכל מקום או על ה-X ליציאה
          </span>
        </div>
      )}
    </div>
  );
}

/** The teacher's 40-minute plan: goals, preparation and the three stages. */
function LessonPlanView({ lessonData }: { lessonData: Lesson }) {
  const plan = lessonData.plan;
  const stages: LessonStage[] = plan
    ? plan.stages
    : [
        { minutes: DEFAULT_STAGE_MINUTES[0], title: "פתיחה וגירוי חזותי", steps: [lessonData.hook] },
        { minutes: DEFAULT_STAGE_MINUTES[1], title: "עבודה עצמית", steps: [lessonData.task.description, ...lessonData.task.instructions] },
        { minutes: DEFAULT_STAGE_MINUTES[2], title: "סיכום במליאה ומושגים למחברת", steps: lessonData.summary },
      ];
  const total = stages.reduce((sum, s) => sum + s.minutes, 0);

  return (
    <div className="p-5 rounded-lg border border-line bg-card space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
        <h4 className="text-base font-semibold text-fg">מערך השיעור</h4>
        <span className="flex items-center gap-1 text-xs text-fg-muted">
          <Clock className="w-3.5 h-3.5 text-accent" strokeWidth={1.75} />
          <span>שיעור של {total} דקות</span>
          {plan?.textbookPages && <span>· ספר הלימוד: {plan.textbookPages}</span>}
        </span>
      </div>

      {plan && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <h5 className="flex items-center gap-1.5 text-sm font-semibold text-fg">
              <Target className="w-4 h-4 text-accent" strokeWidth={1.75} />
              <span>מטרות</span>
            </h5>
            <ul className="list-disc space-y-1 pr-5 text-sm leading-relaxed text-fg-muted">
              {plan.goals.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
          </div>
          {plan.preparation && plan.preparation.length > 0 && (
            <div className="space-y-2">
              <h5 className="flex items-center gap-1.5 text-sm font-semibold text-fg">
                <CheckCircle className="w-4 h-4 text-accent" strokeWidth={1.75} />
                <span>הכנה לפני השיעור</span>
              </h5>
              <ul className="list-disc space-y-1 pr-5 text-sm leading-relaxed text-fg-muted">
                {plan.preparation.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <ol className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {stages.map((stage, i) => (
          <li key={i} className="space-y-2 rounded-lg border border-line bg-subtle p-4">
            <span className="block text-xs font-semibold text-accent">
              שלב {["א׳", "ב׳", "ג׳"][i]} · {stage.minutes} דקות
            </span>
            <h5 className="text-sm font-semibold text-fg">{stage.title}</h5>
            <ul className="list-disc space-y-1.5 pr-4 text-sm leading-relaxed text-fg-muted">
              {stage.steps.map((step, s) => (
                <li key={s} className="whitespace-pre-line">{step}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  );
}
