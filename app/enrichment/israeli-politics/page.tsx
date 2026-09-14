"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  ArrowLeft,
  Moon, 
  Sun, 
  Presentation, 
  BookOpen, 
  Play, 
  Pause,
  RotateCcw,
  Maximize2, 
  Minimize2, 
  Lightbulb, 
  Clock,
  CheckCircle,
  Plus,
  Trash2,
  Sparkles,
  ShieldAlert,
  Flame,
  Scale,
  Users,
  MessageSquareQuote,
  Send,
  Printer
} from "lucide-react";
import { 
  LESSON_META, 
  LESSON_STAGES, 
  SLIDES_DATA, 
  TIMELINE_STATIONS, 
  CORE_AXES
} from "@/lib/data/israeli-politics-lesson";

interface BoardCard {
  id: string;
  text: string;
  category: "ideological" | "tribal";
}

export default function IsraeliPoliticsLessonPage() {
  // Theme state - persists in localStorage
  const [comfortMode, setComfortMode] = useState<"dark" | "light">("dark");
  const [cinemaMode, setCinemaMode] = useState(false);
  const [activeTab, setActiveTab] = useState<"presentation" | "teacherGuide" | "interactiveBoard">("presentation");
  
  // Slides state
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showTeacherNotes, setShowTeacherNotes] = useState(true);

  // Lesson timer (45 minutes = 2700 seconds)
  const [timerSeconds, setTimerSeconds] = useState(45 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Interactive widgets state
  // Slide 2: Thermometer vote
  const [pulseRating, setPulseRating] = useState<number | null>(null);
  const [pulseVotes, setPulseVotes] = useState<Record<number, number>>({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });

  // Slide 8: Interactive Two-Column Sorting Board
  const [boardCards, setBoardCards] = useState<BoardCard[]>([
    { id: "1", text: "עמדה בנושא שוויון בנטל וגיוס חרדים", category: "ideological" },
    { id: "2", text: "תפיסה כלכלית: שוק חופשי מול מדינת רווחה", category: "ideological" },
    { id: "3", text: "\"המשפחה והחברים שלי תמיד הצביעו ככה\"", category: "tribal" },
    { id: "4", text: "\"רק לא המחנה ההוא, הם לא משלנו\"", category: "tribal" }
  ]);
  const [newCardText, setNewCardText] = useState("");
  const [newCardCategory, setNewCardCategory] = useState<"ideological" | "tribal">("ideological");

  // Slide 10: Ticket Out the Door submission
  const [ticketInput, setTicketInput] = useState("");
  const [submittedTickets, setSubmittedTickets] = useState<string[]>([
    "גיוס שוויוני וחלוקה הוגנת בנטל השירות והמילואים",
    "הורדת יוקר המחיה והדיור לצעירים",
    "החזרת כל החטופים ושיקום יישובי העוטף והצפון"
  ]);

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

  // Timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => Math.max(0, prev - 1));
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSeconds]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Keyboard navigation for presentation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeTab !== "presentation") return;
      // RTL: ArrowRight = previous slide, ArrowLeft = next slide
      if (e.key === "ArrowRight") {
        handlePrevSlide();
      } else if (e.key === "ArrowLeft") {
        handleNextSlide();
      } else if (e.key === "Escape" && cinemaMode) {
        setCinemaMode(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeTab, currentSlideIndex, cinemaMode]);

  const handleNextSlide = () => {
    if (currentSlideIndex < SLIDES_DATA.length - 1) {
      setCurrentSlideIndex(prev => prev + 1);
    }
  };

  const handlePrevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
    }
  };

  const handleAddBoardCard = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newCardText.trim()) return;
    const newCard: BoardCard = {
      id: Date.now().toString(),
      text: newCardText.trim(),
      category: newCardCategory
    };
    setBoardCards(prev => [newCard, ...prev]);
    setNewCardText("");
  };

  const handleDeleteBoardCard = (id: string) => {
    setBoardCards(prev => prev.filter(c => c.id !== id));
  };

  const handlePulseVote = (num: number) => {
    setPulseRating(num);
    setPulseVotes(prev => ({
      ...prev,
      [num]: (prev[num] || 0) + 1
    }));
  };

  const handleAddTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketInput.trim()) return;
    setSubmittedTickets(prev => [ticketInput.trim(), ...prev]);
    setTicketInput("");
  };

  const currentSlide = SLIDES_DATA[currentSlideIndex];
  const isLight = comfortMode === "light";

  return (
    <div 
      dir="rtl"
      className={`min-h-screen transition-colors duration-300 font-sans ${
        isLight 
          ? "bg-[#f8fafc] text-slate-900 selection:bg-blue-100" 
          : "bg-[#080c18] text-[#e8edf8] selection:bg-blue-900"
      }`}
    >
      {/* Background glow effects (Dark Mode only) */}
      {!isLight && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px]" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px]" />
        </div>
      )}

      {/* Main App Layout */}
      <div className={`relative z-10 flex flex-col min-h-screen ${cinemaMode ? "p-2 sm:p-4" : "p-4 sm:p-6 lg:p-8"}`}>
        
        {/* Navigation & Header Bar (Hidden in Cinema mode for clean projection) */}
        {!cinemaMode && (
          <header className="max-w-7xl mx-auto w-full mb-6">
            <div className={`flex flex-wrap items-center justify-between gap-4 pb-4 border-b ${
              isLight ? "border-slate-300" : "border-border-custom"
            }`}>
              
              {/* Breadcrumb & Title */}
              <div className="flex items-center gap-3">
                <Link
                  href="/enrichment"
                  className={`inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-xl border font-bold transition-all ${
                    isLight 
                      ? "bg-white border-slate-300 text-slate-800 hover:text-blue-700 hover:border-blue-400 shadow-sm" 
                      : "bg-surface border-border-custom text-text-muted hover:text-enrichment hover:border-enrichment/40"
                  }`}
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>חזרה להעשרה</span>
                </Link>

                <div className={`h-4 w-px hidden sm:block ${isLight ? "bg-slate-300" : "bg-border-custom"}`} />

                <div className="flex items-center gap-2">
                  <span className="text-xl">🗳️</span>
                  <div>
                    <h1 className={`text-base sm:text-lg font-black tracking-tight ${isLight ? "text-slate-950" : "text-white"}`}>
                      {LESSON_META.title}
                    </h1>
                    <p className={`text-xs hidden md:block ${isLight ? "text-slate-600 font-medium" : "text-text-muted"}`}>
                      {LESSON_META.subtitle}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Controls: Timer, Theme Toggle, Fullscreen */}
              <div className="flex items-center gap-2 sm:gap-3 mr-auto">
                
                {/* 45 Min Timer Widget */}
                <div 
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border font-mono text-sm shadow-sm transition-all ${
                    timerSeconds < 300 
                      ? isLight ? "bg-rose-100 border-rose-300 text-rose-800 font-bold" : "bg-rose-500/10 border-rose-500/40 text-rose-500 font-bold"
                      : isLight 
                        ? "bg-white border-slate-300 text-slate-900" 
                        : "bg-surface border-border-custom text-text-muted"
                  }`}
                  title="שעון עצר מובנה לשיעור (45 דקות)"
                >
                  <Clock className={`w-4 h-4 ${isLight ? "text-blue-700" : "text-blue-400"}`} />
                  <span className="font-black text-sm tracking-wider">{formatTimer(timerSeconds)}</span>
                  <button 
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className={`p-1 transition-colors ${isLight ? "hover:text-blue-700 text-slate-700" : "hover:text-blue-400 text-text-muted"}`}
                    aria-label={isTimerRunning ? "השהה שעון" : "הפעל שעון"}
                  >
                    {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  </button>
                  <button 
                    onClick={() => { setIsTimerRunning(false); setTimerSeconds(45 * 60); }}
                    className={`p-1 transition-colors ${isLight ? "hover:text-blue-700 text-slate-700" : "hover:text-blue-400 text-text-muted"}`}
                    aria-label="אפס שעון"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Comfort Reading Mode Toggle */}
                <button
                  onClick={toggleComfortMode}
                  className={`p-2 rounded-xl border transition-all ${
                    isLight 
                      ? "bg-white border-slate-300 text-amber-600 hover:bg-slate-100 shadow-sm" 
                      : "bg-surface border-border-custom text-blue-400 hover:bg-surface-hover hover:border-border-custom-hover"
                  }`}
                  title={isLight ? "מעבר למצב כהה (חלל)" : "מעבר למצב קריאה רך (בהיר)"}
                  aria-label="החלף ערכת נושא"
                >
                  {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                </button>

                {/* Cinema / Projector Mode */}
                <button
                  onClick={() => setCinemaMode(true)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-black rounded-xl border transition-all ${
                    isLight
                      ? "bg-blue-100/70 border-blue-300 text-blue-800 hover:bg-blue-200 shadow-sm"
                      : "bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20"
                  }`}
                  title="מצב הקרנה לכיתה (מסך נקי)"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">מצב הקרנה</span>
                </button>
              </div>

            </div>

            {/* View Mode Tabs */}
            <div className="flex items-center justify-between gap-4 mt-4">
              <div className={`inline-flex p-1 rounded-2xl border ${isLight ? "bg-slate-200/70 border-slate-300" : "bg-surface border-border-custom"}`}>
                <button
                  onClick={() => setActiveTab("presentation")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    activeTab === "presentation"
                      ? isLight
                        ? "bg-white text-blue-700 shadow-sm border border-slate-300"
                        : "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                      : isLight
                        ? "text-slate-700 hover:text-slate-950 font-semibold"
                        : "text-text-muted hover:text-foreground"
                  }`}
                >
                  <Presentation className="w-4 h-4" />
                  <span>מצגת אינטראקטיבית</span>
                </button>

                <button
                  onClick={() => setActiveTab("teacherGuide")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    activeTab === "teacherGuide"
                      ? isLight
                        ? "bg-white text-blue-700 shadow-sm border border-slate-300"
                        : "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                      : isLight
                        ? "text-slate-700 hover:text-slate-950 font-semibold"
                        : "text-text-muted hover:text-foreground"
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>מערך שיעור למורה (45 דק')</span>
                </button>

                <button
                  onClick={() => setActiveTab("interactiveBoard")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    activeTab === "interactiveBoard"
                      ? isLight
                        ? "bg-white text-blue-700 shadow-sm border border-slate-300"
                        : "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                      : isLight
                        ? "text-slate-700 hover:text-slate-950 font-semibold"
                        : "text-text-muted hover:text-foreground"
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>לוח שיח כיתתי</span>
                </button>
              </div>

              {/* Iron Rule Badge */}
              <div className={`hidden lg:flex items-center gap-2 text-xs px-3.5 py-1.5 rounded-full border ${
                isLight 
                  ? "bg-amber-50/90 border-amber-300 text-slate-800" 
                  : "bg-surface/40 border-border-custom text-text-muted"
              }`}>
                <Sparkles className={`w-3.5 h-3.5 ${isLight ? "text-amber-600" : "text-amber-400"}`} />
                <span className={`font-black ${isLight ? "text-amber-800" : "text-amber-400"}`}>כלל ברזל:</span>
                <span className="font-medium">לא להסכים ולא לשכנע – להבין את המפה ולחדד טיעונים</span>
              </div>
            </div>
          </header>
        )}

        {/* Exit Cinema Mode Floating Button */}
        {cinemaMode && (
          <div className="fixed top-4 left-4 z-50 flex items-center gap-2">
            <button
              onClick={() => setCinemaMode(false)}
              className="flex items-center gap-2 px-4 py-2 bg-black/85 hover:bg-black text-white text-xs font-bold rounded-xl border border-white/20 shadow-2xl backdrop-blur-md transition-all"
            >
              <Minimize2 className="w-4 h-4" />
              <span>יציאה ממצב הקרנה (Esc)</span>
            </button>
            <button
              onClick={toggleComfortMode}
              className="p-2.5 bg-black/85 hover:bg-black text-white rounded-xl border border-white/20 shadow-2xl backdrop-blur-md transition-all"
            >
              {isLight ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-yellow-400" />}
            </button>
          </div>
        )}

        {/* TAB 1: INTERACTIVE PRESENTATION */}
        {activeTab === "presentation" && (
          <main className="max-w-7xl mx-auto w-full flex-1 flex flex-col justify-between">
            
            {/* Slide Viewer Card */}
            <div 
              className={`flex-1 flex flex-col justify-between rounded-3xl border transition-all duration-300 p-6 sm:p-10 relative overflow-hidden shadow-2xl ${
                isLight 
                  ? "bg-white border-slate-300 shadow-slate-200/80" 
                  : "glass-card border-border-custom"
              }`}
            >
              {/* Slide Meta Bar */}
              <div className={`flex items-center justify-between gap-4 pb-4 border-b mb-6 ${
                isLight ? "border-slate-200" : "border-border-custom"
              }`}>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                    isLight 
                      ? "bg-blue-100 text-blue-900 border-blue-300" 
                      : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                  }`}>
                    {currentSlide.badge}
                  </span>
                  <span className={`text-xs font-semibold ${isLight ? "text-slate-700" : "text-text-muted"}`}>
                    {currentSlide.stageName} · זמן מומלץ: {currentSlide.timeHint}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-xs font-mono font-bold ${isLight ? "text-slate-700" : "text-text-muted"}`}>
                    שקופית {currentSlideIndex + 1} מתוך {SLIDES_DATA.length}
                  </span>
                </div>
              </div>

              {/* Slide Body Content */}
              <div className="flex-1 flex flex-col justify-center py-2">
                
                {/* Slide Title & Subtitle */}
                <div className="mb-6 text-right">
                  <h2 className={`text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-3 ${
                    isLight ? "text-slate-950" : "text-white"
                  }`}>
                    {currentSlide.title}
                  </h2>
                  {currentSlide.subtitle && (
                    <p className={`text-base sm:text-xl font-bold ${
                      isLight ? "text-slate-700" : "text-text-muted"
                    }`}>
                      {currentSlide.subtitle}
                    </p>
                  )}
                </div>

                {/* Highlight Quote if present */}
                {currentSlide.quote && (
                  <div className={`p-4 sm:p-6 rounded-2xl border mb-6 flex items-start gap-4 ${
                    isLight 
                      ? "bg-blue-50 border-2 border-blue-300 text-blue-950 shadow-xs" 
                      : "bg-blue-500/10 border-blue-500/30 text-blue-200"
                  }`}>
                    <MessageSquareQuote className={`w-8 h-8 flex-shrink-0 mt-1 ${isLight ? "text-blue-700" : "text-blue-400"}`} />
                    <div className={`text-lg sm:text-2xl leading-relaxed ${isLight ? "font-extrabold text-blue-950" : "font-bold"}`}>
                      {currentSlide.quote}
                    </div>
                  </div>
                )}

                {/* Bullet list if present */}
                {currentSlide.bullets && currentSlide.bullets.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {currentSlide.bullets.map((b, idx) => (
                      <div 
                        key={idx}
                        className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                          isLight 
                            ? "bg-slate-50 border-slate-300 text-slate-900 hover:border-blue-400 hover:bg-blue-50/40 shadow-xs" 
                            : "bg-surface/50 border-border-custom text-slate-200 hover:border-blue-500/40"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <CheckCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isLight ? "text-blue-600" : "text-blue-400"}`} />
                          <p className={`text-sm sm:text-base leading-relaxed ${isLight ? "font-semibold text-slate-900" : "font-medium text-slate-200"}`}>
                            {b}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* SLIDE-SPECIFIC INTERACTIVE WIDGETS */}
                
                {/* WIDGET 1: Class Pulse Thermometer (Slide 2) */}
                {currentSlide.visualType === "pulse" && (
                  <div className={`p-6 rounded-2xl border my-4 ${
                    isLight ? "bg-slate-50 border-slate-300 shadow-sm" : "bg-surface border-border-custom"
                  }`}>
                    <div className="text-center mb-6">
                      <p className={`text-sm font-black mb-2 ${isLight ? "text-slate-800" : "text-text-muted"}`}>
                        הצביעו או סמנו באצבעות: מ-1 עד 5
                      </p>
                      <div className="flex items-center justify-center gap-3 sm:gap-6">
                        {[1, 2, 3, 4, 5].map((num) => {
                          const isSelected = pulseRating === num;
                          return (
                            <button
                              key={num}
                              onClick={() => handlePulseVote(num)}
                              className={`flex flex-col items-center justify-center w-14 h-16 sm:w-20 sm:h-24 rounded-2xl border text-xl sm:text-2xl font-black transition-all ${
                                isSelected
                                  ? "bg-blue-600 text-white border-blue-600 scale-110 shadow-lg shadow-blue-500/30"
                                  : isLight
                                    ? "bg-white border-2 border-slate-300 text-slate-900 hover:border-blue-500 hover:scale-105 shadow-xs"
                                    : "bg-surface-hover border-border-custom text-slate-300 hover:border-blue-500/50 hover:scale-105"
                              }`}
                            >
                              <span>{num}</span>
                              <span className={`text-[10px] font-bold mt-1 ${isLight && !isSelected ? "text-slate-700" : "opacity-90"}`}>
                                {num === 1 ? "מבולבל" : num === 5 ? "שולט" : `דרגה ${num}`}
                              </span>
                              <span className={`text-[10px] font-mono font-bold mt-1 ${
                                isSelected ? "text-blue-100" : isLight ? "text-blue-700" : "text-blue-400"
                              }`}>
                                ({pulseVotes[num] || 0})
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className={`flex flex-wrap items-center justify-center gap-6 text-xs pt-4 border-t ${
                      isLight ? "border-slate-300 text-slate-700 font-bold" : "border-border-custom text-text-muted"
                    }`}>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                        1 = לא מבין בכלל / מרגיש כאוס
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                        3 = מבין חלקית
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        5 = מבין מצוין ושולט בתמונת המצב
                      </span>
                    </div>

                    <div className={`mt-4 p-3 rounded-xl text-xs text-center border font-medium ${
                      isLight 
                        ? "bg-blue-100 border-blue-300 text-blue-950" 
                        : "bg-blue-500/10 border-blue-500/20 text-blue-300"
                    }`}>
                      💡 <strong>הנחיה למורה:</strong> קחו מבט חטוף על הידיים, וקחו 2 תגובות קצרות: אחד שהרים 5 ואחד שהרים 1 או 2.
                    </div>
                  </div>
                )}

                {/* WIDGET 2: Timeline Stations (Slide 4, 5, 6) */}
                {currentSlide.visualType === "timeline-station" && currentSlide.timelineStationId && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 my-4">
                    {TIMELINE_STATIONS.map((station) => {
                      const isCurrent = station.id === currentSlide.timelineStationId;
                      return (
                        <div
                          key={station.id}
                          className={`p-5 rounded-2xl border transition-all duration-300 relative ${
                            isCurrent
                              ? isLight
                                ? "bg-blue-50/90 border-2 border-blue-500 shadow-md ring-4 ring-blue-500/10 text-slate-900"
                                : "bg-gradient-to-b from-blue-950/40 to-surface border-blue-500/60 shadow-xl ring-2 ring-blue-500/20"
                              : isLight 
                                ? "bg-slate-100/90 border border-slate-300 text-slate-900 opacity-80 hover:opacity-100" 
                                : "bg-surface/30 border-border-custom opacity-60 hover:opacity-100"
                          }`}
                        >
                          {isCurrent && (
                            <span className="absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white shadow-xs">
                              תחנה פעילה
                            </span>
                          )}
                          <div className={`text-xs font-black uppercase tracking-wider mb-1 ${
                            isLight ? "text-blue-800" : "text-blue-400"
                          }`}>
                            תחנה {station.stationNum} · {station.years}
                          </div>
                          <h4 className={`text-base font-black mb-3 ${isLight ? "text-slate-950" : "text-white"}`}>
                            {station.title}
                          </h4>
                          
                          <div className="space-y-2.5 text-xs sm:text-sm">
                            <div className={`p-2.5 rounded-xl border ${
                              isLight ? "bg-white border-slate-300 text-slate-900" : "bg-black/20 border-border-custom text-slate-200"
                            }`}>
                              <span className={`font-black block mb-1 ${isLight ? "text-slate-800" : "text-text-muted"}`}>
                                מה קרה בפועל:
                              </span>
                              <p className={`leading-relaxed ${isLight ? "font-medium text-slate-900" : "text-slate-200"}`}>
                                {station.actualEvent}
                              </p>
                            </div>
                            <div className={`p-2.5 rounded-xl border ${
                              isLight 
                                ? "bg-blue-100/90 border-blue-300 text-blue-950" 
                                : "bg-blue-500/10 border-blue-500/20 text-blue-200"
                            }`}>
                              <span className={`font-black block mb-1 ${isLight ? "text-blue-900" : "text-blue-400"}`}>
                                המשמעות לחברה הישראלית:
                              </span>
                              <p className={`leading-relaxed ${isLight ? "font-medium text-blue-950" : "text-blue-200"}`}>
                                {station.societalImpact}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* WIDGET 3: Core Axes Diagram (Slide 7) */}
                {currentSlide.visualType === "axes" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
                    {CORE_AXES.map((axis, i) => (
                      <div
                        key={axis.id}
                        className={`p-6 rounded-2xl border transition-all ${
                          i === 0
                            ? isLight ? "bg-indigo-50/90 border-2 border-indigo-200 text-slate-900" : "bg-indigo-950/20 border-indigo-500/30"
                            : isLight ? "bg-emerald-50/90 border-2 border-emerald-200 text-slate-900" : "bg-emerald-950/20 border-emerald-500/30"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          {i === 0 
                            ? <Users className={`w-5 h-5 ${isLight ? "text-indigo-700" : "text-indigo-400"}`} /> 
                            : <Scale className={`w-5 h-5 ${isLight ? "text-emerald-700" : "text-emerald-400"}`} />}
                          <h3 className={`text-lg font-black ${
                            isLight ? (i === 0 ? "text-indigo-950" : "text-emerald-950") : "text-white"
                          }`}>
                            {axis.name}
                          </h3>
                        </div>
                        <p className={`text-sm font-bold mb-4 leading-relaxed ${
                          isLight ? "text-slate-700" : "text-text-muted"
                        }`}>
                          {axis.question}
                        </p>
                        <div className="space-y-2">
                          {axis.subItems.map((item, idx) => (
                            <div 
                              key={idx}
                              className={`p-2.5 rounded-xl border text-xs sm:text-sm ${
                                isLight 
                                  ? "bg-white border-slate-300 text-slate-900 font-semibold shadow-xs" 
                                  : "bg-surface border-border-custom text-slate-200 font-medium"
                              }`}
                            >
                              • {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* WIDGET 4: Interactive Dialogue Sorting Board (Slide 8) */}
                {currentSlide.visualType === "interactive-board" && (
                  <div className={`p-6 rounded-2xl border my-4 ${
                    isLight ? "bg-slate-50 border-slate-300 shadow-sm" : "bg-surface border-border-custom"
                  }`}>
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                      <div>
                        <h4 className={`text-base font-black ${isLight ? "text-slate-950" : "text-white"}`}>
                          לוח כיתתי שיתופי: מיפוי דברי התלמידים
                        </h4>
                        <p className={`text-xs ${isLight ? "text-slate-700 font-medium" : "text-text-muted"}`}>
                          רשמו על הלוח את טיעוני התלמידים וחלקו אותם בין אידיאולוגיה מנומקת למחנה ושייכות.
                        </p>
                      </div>

                      {/* Add claim input */}
                      <form onSubmit={handleAddBoardCard} className="flex items-center gap-2 flex-1 max-w-md">
                        <input
                          type="text"
                          value={newCardText}
                          onChange={(e) => setNewCardText(e.target.value)}
                          placeholder="הקלידו טיעון שנאמר בכיתה..."
                          className={`flex-1 px-3 py-2 rounded-xl text-xs sm:text-sm border transition-all font-medium ${
                            isLight 
                              ? "bg-white border-slate-300 text-slate-900 placeholder-slate-500 focus:border-blue-600" 
                              : "bg-surface-hover border-border-custom text-white focus:border-blue-400"
                          }`}
                        />
                        <select
                          value={newCardCategory}
                          onChange={(e) => setNewCardCategory(e.target.value as "ideological" | "tribal")}
                          className={`px-2.5 py-2 rounded-xl text-xs border font-bold ${
                            isLight ? "bg-white border-slate-300 text-slate-900" : "bg-surface-hover border-border-custom text-white"
                          }`}
                        >
                          <option value="ideological">אידיאולוגי</option>
                          <option value="tribal">זהות ומחנה</option>
                        </select>
                        <button
                          type="submit"
                          className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1 shadow-xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>הוסף</span>
                        </button>
                      </form>
                    </div>

                    {/* Two Columns Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Column 1: Ideological */}
                      <div className={`p-4 rounded-xl border ${
                        isLight ? "bg-blue-50/80 border-blue-200" : "bg-blue-950/20 border-blue-500/30"
                      }`}>
                        <div className="flex items-center justify-between mb-3">
                          <span className={`font-black text-sm flex items-center gap-1.5 ${
                            isLight ? "text-blue-900" : "text-blue-400"
                          }`}>
                            <Scale className="w-4 h-4" />
                            הצבעה אידיאולוגית מנומקת
                          </span>
                          <span className={`text-xs font-bold ${isLight ? "text-blue-800 font-mono" : "text-text-muted font-mono"}`}>
                            {boardCards.filter(c => c.category === "ideological").length} טיעונים
                          </span>
                        </div>
                        <div className="space-y-2 min-h-[140px]">
                          {boardCards.filter(c => c.category === "ideological").map((card) => (
                            <div
                              key={card.id}
                              className={`p-3 rounded-xl border text-xs sm:text-sm font-semibold flex items-center justify-between gap-2 shadow-xs ${
                                isLight ? "bg-white border-slate-300 text-slate-900" : "bg-surface border-border-custom text-white"
                              }`}
                            >
                              <span>{card.text}</span>
                              <button
                                onClick={() => handleDeleteBoardCard(card.id)}
                                className={`p-1 transition-colors ${
                                  isLight ? "text-slate-500 hover:text-rose-600" : "text-text-muted hover:text-rose-500"
                                }`}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Column 2: Tribal / Identity */}
                      <div className={`p-4 rounded-xl border ${
                        isLight ? "bg-purple-50/80 border-purple-200" : "bg-purple-950/20 border-purple-500/30"
                      }`}>
                        <div className="flex items-center justify-between mb-3">
                          <span className={`font-black text-sm flex items-center gap-1.5 ${
                            isLight ? "text-purple-900" : "text-purple-400"
                          }`}>
                            <Users className="w-4 h-4" />
                            הצבעה של זהות, שייכות ומחנה (&quot;השבט שלי&quot;)
                          </span>
                          <span className={`text-xs font-bold ${isLight ? "text-purple-800 font-mono" : "text-text-muted font-mono"}`}>
                            {boardCards.filter(c => c.category === "tribal").length} טיעונים
                          </span>
                        </div>
                        <div className="space-y-2 min-h-[140px]">
                          {boardCards.filter(c => c.category === "tribal").map((card) => (
                            <div
                              key={card.id}
                              className={`p-3 rounded-xl border text-xs sm:text-sm font-semibold flex items-center justify-between gap-2 shadow-xs ${
                                isLight ? "bg-white border-slate-300 text-slate-900" : "bg-surface border-border-custom text-white"
                              }`}
                            >
                              <span>{card.text}</span>
                              <button
                                onClick={() => handleDeleteBoardCard(card.id)}
                                className={`p-1 transition-colors ${
                                  isLight ? "text-slate-500 hover:text-rose-600" : "text-text-muted hover:text-rose-500"
                                }`}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* Teacher facilitation hints */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-border-custom text-xs">
                      <div className={`p-2.5 rounded-xl border font-medium ${
                        isLight ? "bg-amber-100 border-amber-300 text-amber-950" : "bg-amber-500/10 border-amber-500/20 text-amber-300"
                      }`}>
                        ⚡ <strong>כאשר נשמעת עמדה חריפה (&quot;כולם מושחתים&quot;):</strong><br />
                        שאלו: <em>&quot;בוא נפרק את זה – איזה שינוי מבני או מוסדי היית רוצה לראות?&quot;</em>
                      </div>
                      <div className={`p-2.5 rounded-xl border font-medium ${
                        isLight ? "bg-blue-100 border-blue-300 text-blue-950" : "bg-blue-500/10 border-blue-500/20 text-blue-300"
                      }`}>
                        🔄 <strong>כאשר עולה טיעון חד-צדדי:</strong><br />
                        שאלו: <em>&quot;מי יכול להציג את ההיגיון שעומד מאחורי העמדה ההפוכה, גם אם אינו מסכים?&quot;</em>
                      </div>
                    </div>
                  </div>
                )}

                {/* WIDGET 5: Coalition Dilemma (Slide 9) */}
                {currentSlide.visualType === "coalition-dilemma" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
                    <div className={`p-6 rounded-2xl border ${
                      isLight ? "bg-amber-50/90 border-2 border-amber-200 text-slate-900" : "bg-amber-950/20 border-amber-500/30"
                    }`}>
                      <div className="flex items-center gap-2 mb-3">
                        <Flame className={`w-5 h-5 ${isLight ? "text-amber-600" : "text-amber-500"}`} />
                        <h3 className={`text-lg font-black ${isLight ? "text-amber-950" : "text-white"}`}>
                          גישת ההכרעה החד-משמעית
                        </h3>
                      </div>
                      <p className={`text-sm leading-relaxed mb-3 ${isLight ? "text-slate-700 font-medium" : "text-text-muted"}`}>
                        ממשלה עם רוב מובהק שמממשת מדיניות חדה ואידיאולוגית ברורה ללא פשרות מעכבות.
                      </p>
                      <ul className={`text-xs sm:text-sm space-y-2 ${isLight ? "text-slate-900 font-semibold" : "text-slate-200"}`}>
                        <li>• יתרון: יכולת משילות, החלטות מהירות ומימוש רצון הרוב הבוחר.</li>
                        <li>• מחיר: העמקת הקיטוב, תחושת ניכור של הצד השני ואי-יציבות לאורך זמן.</li>
                      </ul>
                    </div>

                    <div className={`p-6 rounded-2xl border ${
                      isLight ? "bg-blue-50/90 border-2 border-blue-200 text-slate-900" : "bg-blue-950/20 border-blue-500/30"
                    }`}>
                      <div className="flex items-center gap-2 mb-3">
                        <Scale className={`w-5 h-5 ${isLight ? "text-blue-700" : "text-blue-400"}`} />
                        <h3 className={`text-lg font-black ${isLight ? "text-blue-950" : "text-white"}`}>
                          גישת ההסכמות הלאומיות הרחבות
                        </h3>
                      </div>
                      <p className={`text-sm leading-relaxed mb-3 ${isLight ? "text-slate-700 font-medium" : "text-text-muted"}`}>
                        ממשלה רחבה השואפת לגשר על מחלוקות עמוקות דרך פשרות כואבות והסכמות רחבות.
                      </p>
                      <ul className={`text-xs sm:text-sm space-y-2 ${isLight ? "text-slate-900 font-semibold" : "text-slate-200"}`}>
                        <li>• יתרון: איחוי קרעים חברתיים, יציבות משטרית ולגיטימציה רחבה.</li>
                        <li>• מחיר: קושי בהכרעות קשות, ויתור על אידיאלים חדים ושיתוק פוליטי.</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* WIDGET 6: Ticket Out the Door (Slide 10) */}
                {currentSlide.visualType === "ticket-out" && (
                  <div className={`p-6 rounded-2xl border my-4 ${
                    isLight ? "bg-slate-50 border-slate-300 shadow-sm" : "bg-surface border-border-custom"
                  }`}>
                    <div className="mb-4 text-center">
                      <span className={`text-xs font-black px-3 py-1 rounded-full border inline-block mb-2 ${
                        isLight 
                          ? "bg-emerald-100 border-emerald-300 text-emerald-950" 
                          : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                      }`}>
                        משימת סיום אישית · 5 דקות
                      </span>
                      <h4 className={`text-lg font-black ${isLight ? "text-slate-950" : "text-white"}`}>
                        כרטיס יציאה (Ticket Out the Door)
                      </h4>
                      <p className={`text-sm mt-1 max-w-xl mx-auto ${isLight ? "text-slate-800 font-semibold" : "text-text-muted"}`}>
                        &quot;קחו דף ועט או הקלידו כאן: מהו הנושא האחד והחשוב ביותר שהממשלה הבאה חייבת לטפל בו כדי להחזיר את האמון שלך במדינה?&quot;
                      </p>
                    </div>

                    <form onSubmit={handleAddTicket} className="flex gap-2 max-w-xl mx-auto mb-6">
                      <input
                        type="text"
                        value={ticketInput}
                        onChange={(e) => setTicketInput(e.target.value)}
                        placeholder="כתבו במשפט אחד ברור את הנושא הדחוף ביותר..."
                        className={`flex-1 px-4 py-2.5 rounded-xl text-sm border font-medium ${
                          isLight 
                            ? "bg-white border-slate-300 text-slate-900 placeholder-slate-500 focus:border-emerald-600" 
                            : "bg-surface-hover border-border-custom text-white"
                        }`}
                      />
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                      >
                        <Send className="w-4 h-4" />
                        <span>שלח</span>
                      </button>
                    </form>

                    <div className="space-y-2 max-w-xl mx-auto max-h-48 overflow-y-auto pr-1">
                      {submittedTickets.map((ticket, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-xl border text-xs sm:text-sm font-semibold flex items-center gap-2 ${
                            isLight ? "bg-white border-slate-300 text-slate-900 shadow-xs" : "bg-surface border-border-custom text-slate-200"
                          }`}
                        >
                          <span className={`${isLight ? "text-emerald-700" : "text-emerald-500"} font-black`}>#{idx + 1}</span>
                          <span>{ticket}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Slide Navigation Footer Bar */}
              <div className={`pt-6 border-t flex flex-wrap items-center justify-between gap-4 mt-auto ${
                isLight ? "border-slate-200" : "border-border-custom"
              }`}>
                
                {/* Prev Button (In RTL, prev goes to earlier slide) */}
                <button
                  onClick={handlePrevSlide}
                  disabled={currentSlideIndex === 0}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                    currentSlideIndex === 0
                      ? "opacity-30 cursor-not-allowed text-text-muted"
                      : isLight
                        ? "bg-slate-200 hover:bg-slate-300 text-slate-900 font-bold border border-slate-300"
                        : "bg-surface hover:bg-surface-hover text-white border border-border-custom"
                  }`}
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>שקופית קודמת</span>
                </button>

                {/* Slide Thumbnails / Dots */}
                <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-[280px] sm:max-w-md">
                  {SLIDES_DATA.map((s, idx) => (
                    <button
                      key={s.id}
                      onClick={() => setCurrentSlideIndex(idx)}
                      className={`h-2.5 rounded-full transition-all ${
                        idx === currentSlideIndex 
                          ? isLight ? "w-8 bg-blue-600" : "w-8 bg-blue-500"
                          : isLight ? "w-2.5 bg-slate-300 hover:bg-slate-400" : "w-2.5 bg-border-custom hover:bg-text-muted"
                      }`}
                      title={`שקופית ${idx + 1}: ${s.title}`}
                    />
                  ))}
                </div>

                {/* Next Button */}
                <button
                  onClick={handleNextSlide}
                  disabled={currentSlideIndex === SLIDES_DATA.length - 1}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
                    currentSlideIndex === SLIDES_DATA.length - 1
                      ? "opacity-30 cursor-not-allowed text-text-muted"
                      : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                  }`}
                >
                  <span>שקופית הבאה</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* Collapsible Teacher Facilitation Hints for Current Slide */}
            {!cinemaMode && (
              <div className={`mt-4 rounded-2xl border transition-all overflow-hidden ${
                isLight ? "bg-white border-slate-300 shadow-sm" : "bg-surface border-border-custom"
              }`}>
                <button
                  onClick={() => setShowTeacherNotes(!showTeacherNotes)}
                  className={`w-full px-5 py-3 flex items-center justify-between text-xs font-bold transition-colors ${
                    isLight ? "text-slate-800 hover:text-slate-950" : "text-text-muted hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    <span>הערות והנחיות דיאלוג למורה לשקופית זו ({currentSlide.stageName})</span>
                  </div>
                  <span>{showTeacherNotes ? "הסתר ▲" : "הצג הנחיות ▼"}</span>
                </button>

                {showTeacherNotes && (
                  <div className={`px-5 pb-4 pt-1 text-xs sm:text-sm border-t space-y-2 leading-relaxed ${
                    isLight ? "border-slate-200 text-slate-800" : "border-border-custom/50 text-slate-200"
                  }`}>
                    <p className={`font-semibold ${isLight ? "text-slate-900" : "text-foreground"}`}>
                      {currentSlide.teacherNote}
                    </p>
                    {currentSlide.visualType === "interactive-board" && (
                      <p className={isLight ? "text-slate-700 font-medium" : "text-text-muted"}>
                        💡 <strong>כלל להנחיה:</strong> אל תתנו לדיון להפוך למאבק אישי בין תלמידים. אם מישהו תוקף אדם אחר, הזכירו את כלל הברזל: &quot;תוקפים רעיונות וטיעונים – לעולם לא אנשים בכיתה&quot;.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

          </main>
        )}

        {/* TAB 2: TEACHER'S COMPLETE 45-MINUTE GUIDE */}
        {activeTab === "teacherGuide" && (
          <main className="max-w-5xl mx-auto w-full flex-1 space-y-8 py-4">
            
            {/* Guide Header Banner */}
            <div className={`p-8 rounded-3xl border ${
              isLight ? "bg-white border-slate-300 shadow-sm" : "glass-card border-border-custom"
            }`}>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                  isLight ? "bg-blue-100 text-blue-900 border-blue-300" : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                }`}>
                  מערך שיעור מלא למורה · {LESSON_META.duration}
                </span>
                <button 
                  onClick={() => window.print()}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                    isLight 
                      ? "border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-800 shadow-xs" 
                      : "border-border-custom bg-surface hover:bg-surface-hover text-text-muted hover:text-white"
                  }`}
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>הדפסת מערך השיעור</span>
                </button>
              </div>

              <h2 className={`text-3xl font-black mb-3 ${isLight ? "text-slate-950" : "text-white"}`}>
                דף הנחיה לשיעור דיאלוג: {LESSON_META.title}
              </h2>
              
              <p className={`text-base mb-6 leading-relaxed ${isLight ? "text-slate-800 font-medium" : "text-text-muted"}`}>
                <strong className={isLight ? "text-slate-900 font-black" : ""}>מטרה מרכזית:</strong> {LESSON_META.mainGoal}
              </p>

              <div className={`p-4 rounded-2xl border ${
                isLight ? "bg-amber-100 border-amber-300 text-amber-950" : "bg-amber-500/10 border-amber-500/30 text-amber-300"
              }`}>
                <div className="flex items-start gap-3">
                  <ShieldAlert className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isLight ? "text-amber-700" : "text-amber-400"}`} />
                  <div>
                    <strong className={`block text-sm font-black mb-1 ${isLight ? "text-amber-900" : "text-amber-400"}`}>
                      כלל ברזל לשיעור זה:
                    </strong>
                    <p className={`text-xs sm:text-sm leading-relaxed ${isLight ? "font-semibold text-amber-950" : ""}`}>
                      {LESSON_META.ironRule}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Structured Stages Accordions */}
            <div className="space-y-6">
              {LESSON_STAGES.map((stage) => (
                <div 
                  key={stage.id}
                  className={`rounded-3xl border overflow-hidden transition-all ${
                    isLight ? "bg-white border-slate-300 shadow-sm" : "glass-card border-border-custom"
                  }`}
                >
                  <div className={`p-6 border-b flex flex-wrap items-center justify-between gap-4 ${
                    isLight ? "bg-slate-50 border-slate-200" : "bg-surface/30 border-border-custom"
                  }`}>
                    <div>
                      <div className={`text-xs font-black mb-1 ${isLight ? "text-blue-800" : "text-blue-400"}`}>
                        זמן מומלץ: {stage.durationMinutes} דקות
                      </div>
                      <h3 className={`text-xl font-black ${isLight ? "text-slate-950" : "text-white"}`}>
                        {stage.title}
                      </h3>
                      <p className={`text-xs sm:text-sm mt-0.5 ${isLight ? "text-slate-700 font-semibold" : "text-text-muted"}`}>
                        {stage.subtitle}
                      </p>
                    </div>

                    <span className={`text-2xl font-black ${isLight ? "text-slate-400 opacity-60" : "opacity-20"}`}>
                      0{stage.stepNum}
                    </span>
                  </div>

                  <div className="p-6 space-y-6">
                    {stage.items.map((item, idx) => (
                      <div key={idx} className="space-y-3">
                        <h4 className={`text-base font-black flex items-center gap-2 ${isLight ? "text-slate-950" : "text-white"}`}>
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                          {item.title}
                        </h4>
                        
                        <p className={`text-sm leading-relaxed ${isLight ? "text-slate-800 font-medium" : "text-text-muted"}`}>
                          {item.description}
                        </p>

                        {/* Exact Teacher Script in quotes */}
                        {item.teacherScript && (
                          <div className={`p-4 rounded-2xl border text-sm sm:text-base font-semibold leading-relaxed ${
                            isLight 
                              ? "bg-blue-50 border-2 border-blue-200 text-blue-950 shadow-xs" 
                              : "bg-blue-500/10 border-blue-500/20 text-blue-200"
                          }`}>
                            <span className={`text-xs font-black block mb-1 ${isLight ? "text-blue-900" : "text-blue-400"}`}>
                              טקסט להקראה מול הכיתה:
                            </span>
                            {item.teacherScript}
                          </div>
                        )}

                        {/* Bullet guidelines */}
                        {item.guidelines && item.guidelines.length > 0 && (
                          <ul className="space-y-1.5 pr-2">
                            {item.guidelines.map((g, gIdx) => (
                              <li key={gIdx} className={`text-xs sm:text-sm flex items-start gap-2 ${
                                isLight ? "text-slate-900 font-medium" : "text-slate-200"
                              }`}>
                                <span className={`font-bold ${isLight ? "text-blue-700" : "text-blue-500"}`}>•</span>
                                <span>{g}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Banner */}
            <div className={`p-6 rounded-3xl border text-center ${
              isLight ? "bg-slate-100 border-slate-300 text-slate-800 font-semibold" : "bg-surface/50 border-border-custom text-text-muted"
            }`}>
              <p className="text-sm">
                פותח על פי דף ההנחיה הפדגוגי לשיעור דיאלוג: עושים סדר בפוליטיקה הישראלית לקראת הבחירות.
              </p>
            </div>

          </main>
        )}

        {/* TAB 3: DEDICATED FULL DIALOGUE BOARD */}
        {activeTab === "interactiveBoard" && (
          <main className="max-w-6xl mx-auto w-full flex-1 py-4 space-y-6">
            <div className={`p-8 rounded-3xl border ${
              isLight ? "bg-white border-slate-300 shadow-sm" : "glass-card border-border-custom"
            }`}>
              <div className="max-w-2xl mb-6">
                <span className={`text-xs font-bold px-3 py-1 rounded-full border inline-block mb-2 ${
                  isLight ? "bg-blue-100 text-blue-900 border-blue-300" : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                }`}>
                  כלי עבודה אינטראקטיבי ללוח
                </span>
                <h2 className={`text-2xl sm:text-3xl font-black mb-2 ${isLight ? "text-slate-950" : "text-white"}`}>
                  לוח שיח כיתתי: אידיאולוגיה מול שייכות ומחנה
                </h2>
                <p className={`text-sm leading-relaxed ${isLight ? "text-slate-700 font-medium" : "text-text-muted"}`}>
                  השתמשו בלוח זה כדי להציג על גבי מקרן הכיתה את הטיעונים שעולים מהתלמידים במהלך 15 דקות הדיאלוג.
                </p>
              </div>

              {/* Add form */}
              <form onSubmit={handleAddBoardCard} className={`flex flex-wrap gap-3 mb-8 p-4 rounded-2xl border ${
                isLight ? "bg-slate-50 border-slate-300" : "bg-surface/50 border-border-custom"
              }`}>
                <input
                  type="text"
                  value={newCardText}
                  onChange={(e) => setNewCardText(e.target.value)}
                  placeholder="הקלידו כאן טיעון או אמירה שנשמעה בכיתה..."
                  className={`flex-1 min-w-[260px] px-4 py-3 rounded-xl text-sm border font-medium ${
                    isLight ? "bg-white border-slate-300 text-slate-900 placeholder-slate-500 focus:border-blue-600" : "bg-surface-hover border-border-custom text-white"
                  }`}
                />
                <select
                  value={newCardCategory}
                  onChange={(e) => setNewCardCategory(e.target.value as "ideological" | "tribal")}
                  className={`px-4 py-3 rounded-xl text-sm border font-bold ${
                    isLight ? "bg-white border-slate-300 text-slate-900" : "bg-surface-hover border-border-custom text-white"
                  }`}
                >
                  <option value="ideological">עמודה 1: הצבעה אידיאולוגית מנומקת</option>
                  <option value="tribal">עמודה 2: הצבעה של זהות ומחנה (&quot;השבט שלי&quot;)</option>
                </select>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm transition-all shadow-md flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>הוסף ללוח</span>
                </button>
              </form>

              {/* Dual Column Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Col 1 */}
                <div className={`p-6 rounded-2xl border ${
                  isLight ? "bg-blue-50/80 border-blue-200" : "bg-blue-950/20 border-blue-500/30"
                }`}>
                  <div className={`flex items-center justify-between pb-3 border-b mb-4 ${
                    isLight ? "border-blue-200" : "border-border-custom"
                  }`}>
                    <h3 className={`font-black text-lg flex items-center gap-2 ${
                      isLight ? "text-blue-950" : "text-blue-400"
                    }`}>
                      <Scale className="w-5 h-5" />
                      הצבעה אידיאולוגית מנומקת
                    </h3>
                    <span className={`text-xs font-bold ${isLight ? "text-blue-800 font-mono" : "text-text-muted font-mono"}`}>
                      {boardCards.filter(c => c.category === "ideological").length} כרטיסיות
                    </span>
                  </div>
                  <div className="space-y-3 min-h-[260px]">
                    {boardCards.filter(c => c.category === "ideological").map((card) => (
                      <div
                        key={card.id}
                        className={`p-4 rounded-xl border text-sm font-semibold flex items-center justify-between gap-3 shadow-xs ${
                          isLight ? "bg-white border-slate-300 text-slate-900" : "bg-surface border-border-custom text-white"
                        }`}
                      >
                        <span className="leading-relaxed">{card.text}</span>
                        <button
                          onClick={() => handleDeleteBoardCard(card.id)}
                          className={`p-1 transition-colors ${
                            isLight ? "text-slate-500 hover:text-rose-600" : "text-text-muted hover:text-rose-500"
                          }`}
                          title="מחק כרטיסיה"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Col 2 */}
                <div className={`p-6 rounded-2xl border ${
                  isLight ? "bg-purple-50/80 border-purple-200" : "bg-purple-950/20 border-purple-500/30"
                }`}>
                  <div className={`flex items-center justify-between pb-3 border-b mb-4 ${
                    isLight ? "border-purple-200" : "border-border-custom"
                  }`}>
                    <h3 className={`font-black text-lg flex items-center gap-2 ${
                      isLight ? "text-purple-950" : "text-purple-400"
                    }`}>
                      <Users className="w-5 h-5" />
                      הצבעה של זהות ומחנה (&quot;השבט שלי&quot;)
                    </h3>
                    <span className={`text-xs font-bold ${isLight ? "text-purple-800 font-mono" : "text-text-muted font-mono"}`}>
                      {boardCards.filter(c => c.category === "tribal").length} כרטיסיות
                    </span>
                  </div>
                  <div className="space-y-3 min-h-[260px]">
                    {boardCards.filter(c => c.category === "tribal").map((card) => (
                      <div
                        key={card.id}
                        className={`p-4 rounded-xl border text-sm font-semibold flex items-center justify-between gap-3 shadow-xs ${
                          isLight ? "bg-white border-slate-300 text-slate-900" : "bg-surface border-border-custom text-white"
                        }`}
                      >
                        <span className="leading-relaxed">{card.text}</span>
                        <button
                          onClick={() => handleDeleteBoardCard(card.id)}
                          className={`p-1 transition-colors ${
                            isLight ? "text-slate-500 hover:text-rose-600" : "text-text-muted hover:text-rose-500"
                          }`}
                          title="מחק כרטיסיה"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </main>
        )}

      </div>
    </div>
  );
}
