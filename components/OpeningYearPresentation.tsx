"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  ArrowRight,
  Maximize2,
  Minimize2,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Layers,
  FileText,
  Clock,
  Sparkles,
  Calendar,
  Users,
  ShieldAlert,
  GraduationCap,
  Heart,
  MessageSquare,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  DoorOpen,
  Award,
  BookCheck,
  RotateCcw,
  Sparkle
} from "lucide-react";

// --- Types ---
interface TeacherInfo {
  name: string;
  subject: string;
  icon?: string;
  tagColor?: string;
}

interface StickyNote {
  id: string;
  text: string;
  author?: string;
  category: "אווירה ויחס" | "למידה ומבחנים" | "הקשבה ועזרה" | "כללי";
  color: "yellow" | "blue" | "pink" | "green" | "purple";
  likes: number;
}

const DEFAULT_TEACHERS: TeacherInfo[] = [
  { name: "ניר עוז-ארי", subject: "מחנך הכיתה, של״ח ומדעי כדור הארץ", tagColor: "amber" },
  { name: "מורה למתמטיקה", subject: "מתמטיקה (הקבצות)", tagColor: "blue" },
  { name: "מורה לאנגלית", subject: "אנגלית (הקבצות)", tagColor: "sky" },
  { name: "מורה למדעים", subject: "מדע וטכנולוגיה", tagColor: "emerald" },
  { name: "מורה להיסטוריה", subject: "היסטוריה", tagColor: "rose" },
  { name: "מורה לספרות", subject: "ספרות ועברית", tagColor: "indigo" },
  { name: "מורה לתנ״ך", subject: "תנ״ך ומורשת", tagColor: "purple" },
  { name: "מורה לחנ״ג", subject: "חינוך גופני", tagColor: "teal" },
  { name: "מורה לערבית", subject: "שפה ערבית", tagColor: "cyan" },
  { name: "מורה לאמנות / מוזיקה", subject: "אמנויות", tagColor: "pink" }
];

const INITIAL_STICKY_NOTES: StickyNote[] = [
  {
    id: "1",
    text: "להקשיב לנו גם כשאנחנו בלחץ ממבחנים",
    author: "תלמיד/ה",
    category: "הקשבה ועזרה",
    color: "yellow",
    likes: 5
  },
  {
    id: "2",
    text: "שיעורים מעניינים וקלילים עם אנרגיה טובה!",
    author: "תלמיד/ה",
    category: "למידה ומבחנים",
    color: "green",
    likes: 8
  },
  {
    id: "3",
    text: "הוגנות, יחס אישי ואכפתיות לכולם",
    author: "תלמיד/ה",
    category: "אווירה ויחס",
    color: "pink",
    likes: 12
  }
];

export default function OpeningYearPresentation() {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [viewMode, setViewMode] = useState<"presentation" | "page">("presentation");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const presentationRef = useRef<HTMLDivElement>(null);

  // Slide 7: Sticky Notes State
  const [stickyNotes, setStickyNotes] = useState<StickyNote[]>(INITIAL_STICKY_NOTES);
  const [newNoteText, setNewNoteText] = useState<string>("");
  const [newNoteCategory, setNewNoteCategory] = useState<StickyNote["category"]>("אווירה ויחס");
  const [newNoteColor, setNewNoteColor] = useState<StickyNote["color"]>("yellow");
  const [showAddNoteModal, setShowAddNoteModal] = useState<boolean>(false);

  // Slide 2: Active Timetable Day tab
  const [activeDay, setActiveDay] = useState<string>("all");

  const totalSlides = 7;

  // Load persisted theme and sticky notes
  useEffect(() => {
    const savedTheme = localStorage.getItem("teaching-site-comfort-mode");
    if (savedTheme !== null) {
      setIsDarkMode(savedTheme === "dark");
    }
    const savedNotes = localStorage.getItem("h2-opening-year-notes");
    if (savedNotes) {
      try {
        setStickyNotes(JSON.parse(savedNotes));
      } catch (e) {
        console.error("Failed to parse sticky notes", e);
      }
    }
  }, []);

  // Save theme to localStorage
  const handleToggleTheme = () => {
    const nextTheme = !isDarkMode;
    setIsDarkMode(nextTheme);
    localStorage.setItem("teaching-site-comfort-mode", nextTheme ? "dark" : "light");
    playSound("click");
  };

  // Save notes to localStorage
  const saveStickyNotes = (notes: StickyNote[]) => {
    setStickyNotes(notes);
    localStorage.setItem("h2-opening-year-notes", JSON.stringify(notes));
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    const newNote: StickyNote = {
      id: Date.now().toString(),
      text: newNoteText.trim(),
      category: newNoteCategory,
      color: newNoteColor,
      likes: 0
    };

    const updated = [newNote, ...stickyNotes];
    saveStickyNotes(updated);
    setNewNoteText("");
    setShowAddNoteModal(false);
    playSound("correct");
    triggerConfetti();
  };

  const handleDeleteNote = (id: string) => {
    const updated = stickyNotes.filter((n) => n.id !== id);
    saveStickyNotes(updated);
    playSound("click");
  };

  const handleLikeNote = (id: string) => {
    const updated = stickyNotes.map((n) => (n.id === id ? { ...n, likes: n.likes + 1 } : n));
    saveStickyNotes(updated);
    playSound("click");
  };

  const handleResetNotes = () => {
    if (window.confirm("האם לאפס את הפתקיות לברירת המחדל?")) {
      saveStickyNotes(INITIAL_STICKY_NOTES);
      playSound("click");
    }
  };

  // Fullscreen trigger
  const toggleFullscreen = () => {
    if (!presentationRef.current) return;
    if (!document.fullscreenElement) {
      presentationRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => console.error("Error fullscreen", err));
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showAddNoteModal) return;
      if (viewMode !== "presentation") return;

      if (e.key === "ArrowLeft") {
        handleNext();
      } else if (e.key === "ArrowRight") {
        handlePrev();
      } else if (e.key === "Space") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "Home") {
        setCurrentSlide(0);
      } else if (e.key === "End") {
        setCurrentSlide(totalSlides - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlide, viewMode, showAddNoteModal]);

  const handleNext = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide((prev) => prev + 1);
      playSound("click");
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
      playSound("click");
    }
  };

  const playSound = (type: "correct" | "click") => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === "correct") {
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.12);
        setTimeout(() => {
          const osc2 = audioCtx.createOscillator();
          const gain2 = audioCtx.createGain();
          osc2.connect(gain2);
          gain2.connect(audioCtx.destination);
          osc2.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
          gain2.gain.setValueAtTime(0.08, audioCtx.currentTime);
          osc2.start();
          osc2.stop(audioCtx.currentTime + 0.2);
        }, 100);
      } else {
        osc.frequency.setValueAtTime(900, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.04);
      }
    } catch (e) {
      console.warn("Audio Context not ready", e);
    }
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 font-sans ${
        isDarkMode ? "bg-[#080c18] text-[#e8edf8]" : "bg-zinc-50 text-zinc-900"
      }`}
      dir="rtl"
    >
      {/* Top Navigation Bar */}
      <header
        className={`sticky top-0 z-40 border-b backdrop-blur-md px-4 sm:px-8 py-3.5 flex justify-between items-center transition-colors ${
          isDarkMode
            ? "bg-[#0f1526]/90 border-white/10 text-white"
            : "bg-white/90 border-zinc-200 text-zinc-900 shadow-sm"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-amber-500 to-sky-500 text-white shadow-md shadow-amber-500/20">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
              פתיחת שנת הלימודים תשפ״ז 2026-2027
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                ח׳2
              </span>
            </h1>
            <p className="text-xs text-zinc-400 hidden sm:block">
              מצגת פתיחה אינטראקטיבית • מחנך הכיתה: ניר עוז-ארי
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div
            className={`p-1 rounded-xl flex items-center gap-1 border ${
              isDarkMode ? "bg-white/5 border-white/10" : "bg-zinc-100 border-zinc-200"
            }`}
          >
            <button
              onClick={() => { setViewMode("presentation"); playSound("click"); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === "presentation"
                  ? "bg-amber-500 text-zinc-950 shadow"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span className="hidden md:inline">מצגת</span>
            </button>
            <button
              onClick={() => { setViewMode("page"); playSound("click"); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === "page"
                  ? "bg-amber-500 text-zinc-950 shadow"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span className="hidden md:inline">עמוד רציף</span>
            </button>
          </div>

          <div className={`h-6 w-[1px] mx-1 ${isDarkMode ? "bg-white/10" : "bg-zinc-200"}`} />

          {/* Sound Button */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl border transition-all ${
              isDarkMode
                ? "bg-white/5 border-white/10 hover:bg-white/10 text-zinc-300"
                : "bg-zinc-100 border-zinc-200 hover:bg-zinc-200 text-zinc-700"
            }`}
            title={soundEnabled ? "השתק צלילים" : "הפעל צלילים"}
          >
            {soundEnabled ? <Volume2 className="h-4 w-4 text-amber-400" /> : <VolumeX className="h-4 w-4" />}
          </button>

          {/* Comfort Reading Mode Toggle */}
          <button
            onClick={handleToggleTheme}
            className={`p-2 rounded-xl border transition-all ${
              isDarkMode
                ? "bg-white/5 border-white/10 hover:bg-white/10 text-amber-400"
                : "bg-zinc-100 border-zinc-200 hover:bg-zinc-200 text-zinc-800"
            }`}
            title={isDarkMode ? "מצב קריאה בהיר" : "מצב חלל כהה"}
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Fullscreen Button */}
          {viewMode === "presentation" && (
            <button
              onClick={toggleFullscreen}
              className={`p-2 rounded-xl border transition-all ${
                isDarkMode
                  ? "bg-white/5 border-white/10 hover:bg-white/10 text-zinc-300"
                  : "bg-zinc-100 border-zinc-200 hover:bg-zinc-200 text-zinc-700"
              }`}
              title="מסך מלא"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center p-3 sm:p-6 md:p-8 relative">
        {viewMode === "presentation" ? (
          /* PRESENTATION MODE: 16:9 Slide Canvas */
          <div
            ref={presentationRef}
            className="w-full max-w-6xl mx-auto flex flex-col gap-3 fullscreen:max-w-none fullscreen:h-screen fullscreen:flex fullscreen:justify-center fullscreen:items-center fullscreen:p-6"
          >
            {/* The Slide Frame */}
            <div
              className={`w-full rounded-3xl overflow-hidden border shadow-2xl relative flex flex-col justify-between p-6 sm:p-10 transition-all duration-300 select-none min-h-[640px] max-h-[82vh] ${
                isDarkMode
                  ? "bg-[#0f1526] border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
                  : "bg-white border-zinc-200 shadow-[0_20px_40px_rgba(0,0,0,0.08)]"
              }`}
            >
              {/* Background ambient accents */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Slide Header Indicator */}
              <div
                className={`flex justify-between items-center z-10 pb-3 mb-2 border-b ${
                  isDarkMode ? "border-white/10" : "border-zinc-100"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-xs font-black tracking-wide text-amber-500 uppercase">
                    שקופית {currentSlide + 1} מתוך {totalSlides}
                  </span>
                </div>
                <div className="text-xs font-bold text-zinc-400">
                  {currentSlide === 0 && "1. ברוכים הבאים לכיתה ח׳"}
                  {currentSlide === 1 && "2. מערכת שעות שבועית"}
                  {currentSlide === 2 && "3. צוות המורים המלמדים"}
                  {currentSlide === 3 && "4. חוקים ונהלי משמעת"}
                  {currentSlide === 4 && "5. תלמידאות ומוכנות לשיעור"}
                  {currentSlide === 5 && "6. הציפיות שלי מכם"}
                  {currentSlide === 6 && "7. הציפיות שלכם ממני (לוח שיתופי)"}
                </div>
              </div>

              {/* Slide Body */}
              <div className="flex-1 flex flex-col justify-center relative overflow-y-auto overflow-x-hidden z-10 py-2">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, x: 25 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -25 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="h-full flex flex-col justify-center"
                  >
                    {renderSlide(currentSlide)}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Bottom Navigation */}
              <div
                className={`flex justify-between items-center z-10 pt-4 mt-2 border-t ${
                  isDarkMode ? "border-white/10" : "border-zinc-100"
                }`}
              >
                {/* Prev Button (In RTL, Prev is right) */}
                <button
                  onClick={handlePrev}
                  disabled={currentSlide === 0}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all ${
                    currentSlide === 0
                      ? "opacity-30 cursor-not-allowed text-zinc-500"
                      : isDarkMode
                      ? "bg-white/5 hover:bg-white/15 text-white active:scale-95"
                      : "bg-zinc-100 hover:bg-zinc-200 text-zinc-900 active:scale-95"
                  }`}
                >
                  <ArrowRight className="h-4 w-4" />
                  <span>הקודם</span>
                </button>

                {/* Stepper Dots */}
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalSlides }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => { setCurrentSlide(idx); playSound("click"); }}
                      className={`h-2.5 rounded-full transition-all duration-300 ${
                        idx === currentSlide
                          ? "w-8 bg-gradient-to-r from-amber-400 to-amber-500 shadow-lg shadow-amber-500/30"
                          : isDarkMode
                          ? "w-2.5 bg-white/20 hover:bg-white/40"
                          : "w-2.5 bg-zinc-300 hover:bg-zinc-400"
                      }`}
                      title={`מעבר לשקופית ${idx + 1}`}
                    />
                  ))}
                </div>

                {/* Next Button */}
                <button
                  onClick={handleNext}
                  disabled={currentSlide === totalSlides - 1}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all ${
                    currentSlide === totalSlides - 1
                      ? "opacity-30 cursor-not-allowed text-zinc-500"
                      : "bg-gradient-to-r from-amber-500 to-sky-500 hover:from-amber-400 hover:to-sky-400 text-zinc-950 shadow-lg shadow-amber-500/20 active:scale-95"
                  }`}
                >
                  <span>הבא</span>
                  <ArrowLeft className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Quick Keyboard shortcuts helper */}
            <div className="text-center text-xs text-zinc-400 select-none fullscreen:hidden">
              טיפ למורה: ניווט מהיר עם המקשים <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">חץ שמאלה</kbd> (הבא), <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">חץ ימינה</kbd> (הקודם), או <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">רווח</kbd>.
            </div>
          </div>
        ) : (
          /* PAGE CONTINUOUS SCROLL MODE */
          <div className="w-full max-w-4xl mx-auto flex flex-col gap-10 py-6">
            <div
              className={`p-6 rounded-3xl border ${
                isDarkMode ? "bg-[#0f1526] border-white/10 text-zinc-300" : "bg-white border-zinc-200 text-zinc-700 shadow-sm"
              }`}
            >
              <h2 className="text-xl font-bold text-amber-500 flex items-center gap-2 mb-2">
                <BookCheck className="h-5 w-5" />
                מערך שיעור מלא להדפסה והכנה מקדימה
              </h2>
              <p className="text-sm">
                תצוגה זו מרכזת את כל 7 שקופיות השיעור ברצף, ומאפשרת מעבר מהיר על התוכן, הדפסה ישירה או בדיקה לפני השיעור.
              </p>
            </div>

            {Array.from({ length: totalSlides }).map((_, idx) => (
              <div
                key={idx}
                className={`p-8 sm:p-10 rounded-3xl border relative transition-all ${
                  isDarkMode
                    ? "bg-[#0f1526] border-white/10 shadow-xl"
                    : "bg-white border-zinc-200 shadow-md"
                }`}
              >
                <div className="absolute top-6 left-6 text-xs font-black px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  שקופית {idx + 1}
                </div>
                <div className="mb-6 pb-4 border-b border-white/10">
                  <span className="text-xs uppercase font-bold text-amber-500 tracking-wider">
                    נושא {idx + 1}
                  </span>
                  <h3 className="text-2xl font-black mt-1">
                    {idx === 0 && "פתיחת שנת הלימודים תשפ״ז 2026-2027"}
                    {idx === 1 && "מערכת שעות שבועית"}
                    {idx === 2 && "צוות המורים המלמדים בכיתה"}
                    {idx === 3 && "חוקים, משמעת והתנהגות"}
                    {idx === 4 && "תלמידאות ומוכנות לשיעור"}
                    {idx === 5 && "הציפיות שלי מכם"}
                    {idx === 6 && "הציפיות שלכם ממני (לוח שיתופי חי)"}
                  </h3>
                </div>
                <div>{renderSlide(idx)}</div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Slide 7 Add Sticky Note Modal */}
      <AnimatePresence>
        {showAddNoteModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`max-w-md w-full rounded-3xl p-6 sm:p-8 border shadow-2xl ${
                isDarkMode ? "bg-[#0f1526] border-white/20 text-white" : "bg-white border-zinc-200 text-zinc-900"
              }`}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-400" />
                  הוספת ציפייה מהמחנך
                </h3>
                <button
                  onClick={() => setShowAddNoteModal(false)}
                  className="text-zinc-400 hover:text-white text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddNote} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1.5">
                    מה הציפייה שלכם ממני השנה?
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="לדוגמה: להסביר לאט לפני מבחנים, לעשות הפסקות פעילות, להקשיב לנו..."
                    className={`w-full p-3 rounded-2xl border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                      isDarkMode ? "bg-white/5 border-white/10 text-white" : "bg-zinc-50 border-zinc-200 text-zinc-900"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1.5">קטגוריה</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(["אווירה ויחס", "למידה ומבחנים", "הקשבה ועזרה", "כללי"] as const).map((cat) => (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => setNewNoteCategory(cat)}
                        className={`p-2 rounded-xl text-xs font-bold border text-center transition-all ${
                          newNoteCategory === cat
                            ? "bg-amber-500 text-zinc-950 border-amber-400"
                            : isDarkMode
                            ? "bg-white/5 border-white/10 text-zinc-300"
                            : "bg-zinc-100 border-zinc-200 text-zinc-700"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1.5">צבע פתקית</label>
                  <div className="flex gap-3 justify-center">
                    {(["yellow", "green", "pink", "blue", "purple"] as const).map((color) => (
                      <button
                        type="button"
                        key={color}
                        onClick={() => setNewNoteColor(color)}
                        className={`w-8 h-8 rounded-full border-2 transition-transform ${
                          newNoteColor === color ? "scale-125 border-white" : "border-transparent"
                        } ${
                          color === "yellow"
                            ? "bg-amber-300"
                            : color === "green"
                            ? "bg-emerald-300"
                            : color === "pink"
                            ? "bg-pink-300"
                            : color === "blue"
                            ? "bg-sky-300"
                            : "bg-purple-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-sm transition-all shadow-lg shadow-amber-500/20"
                  >
                    הוסף ללוח הכיתתי 📌
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddNoteModal(false)}
                    className={`px-4 py-3 rounded-2xl font-bold text-sm border ${
                      isDarkMode ? "bg-white/5 border-white/10 text-zinc-400" : "bg-zinc-100 border-zinc-200 text-zinc-600"
                    }`}
                  >
                    ביטול
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );

  // --- Dynamic Slide Renderer ---
  function renderSlide(index: number) {
    switch (index) {
      // ----------------------------------------------------
      // SLIDE 1: Title & Welcome
      // ----------------------------------------------------
      case 0:
        return (
          <div className="flex flex-col items-center justify-center text-center py-6 sm:py-10 space-y-6">
            {/* Top Badge */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-sky-500/20 border border-amber-500/30 text-amber-400 font-black text-xs sm:text-sm shadow-inner"
            >
              <Sparkle className="h-4 w-4 text-amber-400 animate-spin-slow" />
              <span>שנת הלימודים תשפ״ז 2026-2027 יוצאת לדרך!</span>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-tight max-w-4xl"
            >
              פתיחת שנת הלימודים <br />
              <span className="bg-gradient-to-r from-amber-400 via-sky-400 to-emerald-400 bg-clip-text text-transparent">
                תשפ״ז 2026-2027
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xl sm:text-3xl font-extrabold text-zinc-300 max-w-2xl"
            >
              ברוכות הבאות וברוכים הבאים לכיתה <span className="text-amber-400 underline decoration-amber-500/50 underline-offset-8 font-black">ח׳2</span>! 🚀
            </motion.p>

            {/* Feature Cards / Highlights */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl pt-4"
            >
              <div
                className={`p-4 rounded-2xl border text-center transition-all ${
                  isDarkMode ? "bg-white/5 border-white/10" : "bg-zinc-50 border-zinc-200 shadow-sm"
                }`}
              >
                <div className="text-2xl mb-1">🎯</div>
                <div className="font-black text-sm">עולים רמה</div>
                <div className="text-xs text-zinc-400 mt-0.5">שנת צמיחה, בגרות והישגים</div>
              </div>

              <div
                className={`p-4 rounded-2xl border text-center transition-all ${
                  isDarkMode ? "bg-white/5 border-white/10" : "bg-zinc-50 border-zinc-200 shadow-sm"
                }`}
              >
                <div className="text-2xl mb-1">🤝</div>
                <div className="font-black text-sm">כיתה מגובשת</div>
                <div className="text-xs text-zinc-400 mt-0.5">אווירה טובה, כבוד ושייכות</div>
              </div>

              <div
                className={`p-4 rounded-2xl border text-center transition-all ${
                  isDarkMode ? "bg-white/5 border-white/10" : "bg-zinc-50 border-zinc-200 shadow-sm"
                }`}
              >
                <div className="text-2xl mb-1">⚡</div>
                <div className="font-black text-sm">שקיפות והוגנות</div>
                <div className="text-xs text-zinc-400 mt-0.5">כללים ברורים להצלחה משותפת</div>
              </div>
            </motion.div>

            {/* Interactive Confetti Button */}
            <motion.button
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 }}
              onClick={() => { triggerConfetti(); playSound("correct"); }}
              className="px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-sky-500 hover:from-amber-400 hover:to-sky-400 text-zinc-950 font-black text-base shadow-xl shadow-amber-500/25 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="h-5 w-5" />
              <span>יאללה מתחילים! 🎊</span>
            </motion.button>
          </div>
        );

      // ----------------------------------------------------
      // SLIDE 2: Timetable (מערכת שעות)
      // ----------------------------------------------------
      case 1:
        return (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2">
              <div>
                <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30">
                  מפת השבוע שלנו 📅
                </span>
                <h2 className="text-3xl sm:text-4xl font-black mt-1">מערכת השעות השבועית</h2>
              </div>

              {/* Day Selector for focus */}
              <div
                className={`flex gap-1 p-1 rounded-xl border text-xs font-bold ${
                  isDarkMode ? "bg-white/5 border-white/10" : "bg-zinc-100 border-zinc-200"
                }`}
              >
                {[
                  { id: "all", label: "כל השבוע" },
                  { id: "sun", label: "א׳" },
                  { id: "mon", label: "ב׳" },
                  { id: "tue", label: "ג׳" },
                  { id: "wed", label: "ד׳" },
                  { id: "thu", label: "ה׳" },
                  { id: "fri", label: "ו׳" }
                ].map((d) => (
                  <button
                    key={d.id}
                    onClick={() => { setActiveDay(d.id); playSound("click"); }}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      activeDay === d.id
                        ? "bg-sky-500 text-zinc-950 shadow"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Timetable Grid Cards */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-3 pt-2">
              {[
                { day: "יום ראשון", id: "sun", hours: "08:00 - 14:30", subjects: ["חינוך ופתיחה", "מתמטיקה", "מתמטיקה", "הפסקה", "אנגלית", "מדעים", "של״ח"] },
                { day: "יום שני", id: "mon", hours: "08:00 - 15:15", subjects: ["היסטוריה", "היסטוריה", "ספרות", "הפסקה", "מתמטיקה", "אנגלית", "חינוך גופני", "תנ״ך"] },
                { day: "יום שלישי", id: "tue", hours: "08:00 - 13:45", subjects: ["מדעים", "מדעים", "עברית", "הפסקה", "של״ח", "אנגלית", "ערבית"] },
                { day: "יום רביעי", id: "wed", hours: "08:00 - 15:15", subjects: ["מתמטיקה", "מתמטיקה", "אנגלית", "הפסקה", "תנ״ך", "היסטוריה", "אמנות", "ספרות"] },
                { day: "יום חמישי", id: "thu", hours: "08:00 - 14:30", subjects: ["חינוך גופני", "מדעים", "ערבית", "הפסקה", "מתמטיקה", "אנגלית", "סיכום שבוע"] },
                { day: "יום שישי", id: "fri", hours: "08:00 - 12:00", subjects: ["של״ח שדה", "תנ״ך", "הפסקה", "שעת מחנך"] }
              ]
                .filter((col) => activeDay === "all" || activeDay === col.id)
                .map((col, idx) => (
                  <div
                    key={idx}
                    className={`rounded-2xl p-4 border flex flex-col justify-between transition-all ${
                      isDarkMode
                        ? "bg-white/5 border-white/10 hover:border-sky-500/40"
                        : "bg-zinc-50 border-zinc-200 hover:border-sky-400 shadow-sm"
                    } ${activeDay !== "all" ? "md:col-span-6 max-w-lg mx-auto w-full" : ""}`}
                  >
                    <div>
                      <div className="flex justify-between items-center pb-2 mb-2 border-b border-white/10">
                        <span className="font-black text-base text-sky-400">{col.day}</span>
                        <span className="text-[10px] text-zinc-400 font-mono">{col.hours}</span>
                      </div>
                      <div className="space-y-1.5">
                        {col.subjects.map((sub, sIdx) => {
                          const isBreak = sub.includes("הפסקה");
                          const isSpecial = sub.includes("חינוך") || sub.includes("שעת מחנך");
                          return (
                            <div
                              key={sIdx}
                              className={`p-2 rounded-xl text-xs font-bold flex items-center justify-between ${
                                isBreak
                                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                  : isSpecial
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                  : isDarkMode
                                  ? "bg-white/5 text-zinc-200"
                                  : "bg-white text-zinc-800 border border-zinc-200"
                              }`}
                            >
                              <span>{sub}</span>
                              <span className="text-[10px] text-zinc-400 font-mono">שעה {sIdx + 1}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            <div
              className={`p-3 rounded-2xl border text-xs font-semibold flex items-center gap-2 ${
                isDarkMode ? "bg-sky-500/10 border-sky-500/20 text-sky-300" : "bg-sky-50 border-sky-200 text-sky-900"
              }`}
            >
              <Clock className="h-4 w-4 text-sky-400 shrink-0" />
              <span>
                <strong>שימו לב:</strong> יש לעקוב אחר שינויי מערכת יומיים ועדכונים שוטפים בלוח המודעות ובמשוב.
              </span>
            </div>
          </div>
        );

      // ----------------------------------------------------
      // SLIDE 3: Teachers (רק שם המורה ומקצוע - לפי הנחיית המשתמש)
      // ----------------------------------------------------
      case 2:
        return (
          <div className="space-y-5">
            <div>
              <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                הנבחרת המלמדת אותנו 👨‍🏫👩‍🏫
              </span>
              <h2 className="text-3xl sm:text-4xl font-black mt-1">מורים המלמדים בכיתה</h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                צוות ההוראה שילווה את כיתה ח׳2 לאורך כל שנת הלימודים
              </p>
            </div>

            {/* Teacher Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
              {DEFAULT_TEACHERS.map((teacher, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.03 }}
                  className={`p-4 rounded-2xl border flex flex-col justify-between transition-all ${
                    idx === 0
                      ? "border-amber-500/60 bg-gradient-to-b from-amber-500/15 to-transparent shadow-lg shadow-amber-500/10"
                      : isDarkMode
                      ? "bg-white/5 border-white/10 hover:border-emerald-500/40"
                      : "bg-zinc-50 border-zinc-200 hover:border-emerald-400 shadow-sm"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-emerald-400 text-zinc-950 flex items-center justify-center font-black text-sm shadow">
                        {teacher.name.split(" ")[0][0]}
                      </div>
                      {idx === 0 && (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-400 text-zinc-950">
                          מחנך
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-black text-white">{teacher.name}</h3>
                    <p className="text-xs font-bold text-emerald-400 mt-1">{teacher.subject}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div
              className={`p-3.5 rounded-2xl border text-xs font-semibold flex items-center gap-2 ${
                isDarkMode ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300" : "bg-emerald-50 border-emerald-200 text-emerald-900"
              }`}
            >
              <Users className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>
                כל המורים פה כדי לעזור לכם להצליח, להבין ולמצות את הפוטנציאל שלכם. שיתוף פעולה וכבוד יוצרים שנה מדהימה!
              </span>
            </div>
          </div>
        );

      // ----------------------------------------------------
      // SLIDE 4: Rules & Discipline (חוקים ונהלים)
      // ----------------------------------------------------
      case 3:
        return (
          <div className="space-y-4">
            <div>
              <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                שקיפות, משמעת והתנהגות ⚖️
              </span>
              <h2 className="text-3xl sm:text-4xl font-black mt-1">חוקים ונהלי משמעת</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch pt-1">
              {/* Left/Col 1: Behavior Table */}
              <div
                className={`lg:col-span-5 p-5 rounded-3xl border flex flex-col justify-between ${
                  isDarkMode ? "bg-white/5 border-white/10" : "bg-zinc-50 border-zinc-200 shadow-sm"
                }`}
              >
                <div>
                  <h3 className="text-base font-black text-rose-400 flex items-center gap-2 mb-3">
                    <Award className="h-5 w-5" />
                    טבלת ציון התנהגות
                  </h3>
                  <p className="text-xs text-zinc-400 mb-4">
                    הציון נקבע באופן שקוף ומדויק על פי מספר הפרות המשמעת שנצברו לאורך המחצית:
                  </p>

                  <div className="space-y-2">
                    {[
                      { range: "1 – 3", grade: "טוב מאוד", badge: "🟢 מצוין", color: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300" },
                      { range: "4 – 5", grade: "טוב", badge: "🟡 תקין", color: "border-amber-500/40 bg-amber-500/10 text-amber-300" },
                      { range: "6 – 7", grade: "בינוני", badge: "🟠 תשומת לב", color: "border-orange-500/40 bg-orange-500/10 text-orange-300" },
                      { range: "8 ומעלה", grade: "טעון שיפור", badge: "🔴 דורש שינוי", color: "border-rose-500/40 bg-rose-500/10 text-rose-300" }
                    ].map((row, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-2xl border flex items-center justify-between font-bold text-xs sm:text-sm ${row.color}`}
                      >
                        <div>
                          <span className="text-xs opacity-75 block text-zinc-400">הפרות משמעת</span>
                          <span className="text-base font-black">{row.range}</span>
                        </div>
                        <div className="text-center">
                          <span className="text-xs opacity-75 block text-zinc-400">ציון בתעודה</span>
                          <span className="text-base font-black">{row.grade}</span>
                        </div>
                        <span className="text-xs font-black px-2.5 py-1 rounded-full bg-black/20">
                          {row.badge}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right/Col 2: Critical Rules Cards */}
              <div className="lg:col-span-7 flex flex-col justify-between gap-3">
                {/* Rule 1: Middle of day tardiness */}
                <div
                  className={`p-4 rounded-2xl border flex gap-3 items-start transition-all ${
                    isDarkMode ? "bg-rose-500/10 border-rose-500/30" : "bg-rose-50 border-rose-200"
                  }`}
                >
                  <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 shrink-0 mt-0.5">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-rose-400">איחורים באמצע היום = הפרת משמעת!</h4>
                    <p className="text-xs sm:text-sm text-zinc-300 mt-1 leading-relaxed">
                      יש בעיה במערכת הצלצולים בבית הספר. <strong>חובה להצטייד בשעון או לדאוג להתעדכן בנעשה סביבכם!</strong> חוסר צלצול אינו תירוץ לאיחור לכיתה.
                    </p>
                  </div>
                </div>

                {/* Rule 2: 2 Violations = Extra Hour */}
                <div
                  className={`p-4 rounded-2xl border flex gap-3 items-start transition-all ${
                    isDarkMode ? "bg-amber-500/10 border-amber-500/30" : "bg-amber-50 border-amber-200"
                  }`}
                >
                  <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
                    <ShieldAlert className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-amber-400">2 הפרות משמעת = הישארות שעה נוספת</h4>
                    <p className="text-xs sm:text-sm text-zinc-300 mt-1 leading-relaxed">
                      בכיתה שלנו צבירה של שתי הפרות משמעת גוררת <strong>הישארות שעה נוספת בתום יום הלימודים</strong> וביצוע משימה לימודית עם ציון.
                    </p>
                  </div>
                </div>

                {/* Rule 3: Exit pass violation */}
                <div
                  className={`p-4 rounded-2xl border flex gap-3 items-start transition-all ${
                    isDarkMode ? "bg-sky-500/10 border-sky-500/30" : "bg-sky-50 border-sky-200"
                  }`}
                >
                  <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-400 shrink-0 mt-0.5">
                    <DoorOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-sky-400">אירוע משמעתי בזמן יציאה מהכיתה</h4>
                    <p className="text-xs sm:text-sm text-zinc-300 mt-1 leading-relaxed">
                      תלמידים בעלי אישור יציאה מהכיתה שיהיו מעורבים באירוע משמעתי בזמן זה – <strong>תירשם להם הפרת משמעת והם יישארו שעה נוספת באותו יום!</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      // ----------------------------------------------------
      // SLIDE 5: Student Conduct & Preparedness (תלמידאות)
      // ----------------------------------------------------
      case 4:
        return (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                מוכנות, כבוד ומשמעת עצמית 🎒✏️
              </span>
              <h2 className="text-3xl sm:text-4xl font-black mt-1">תלמידאות ומוכנות לשיעור</h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                איך מתחילים כל שיעור בצורה מיטבית ומקצועית
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {/* Step 1 */}
              <motion.div
                whileHover={{ y: -4 }}
                className={`p-6 rounded-3xl border flex flex-col justify-between transition-all ${
                  isDarkMode ? "bg-white/5 border-white/10" : "bg-zinc-50 border-zinc-200 shadow-sm"
                }`}
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-2xl mb-4">
                    1
                  </div>
                  <h3 className="text-lg font-black text-white mb-2">עמידה בכניסת המורה</h3>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                    יש <strong>לעמוד עם כניסת המורה לכיתה</strong> כאשר אתם כבר מוכנים פיזית ולימודית לשיעור. עמידה זו מסמלת כבוד הדדי ואיפוס של הכיתה ללמידה.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/10 text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>כבוד הדדי וסדר</span>
                </div>
              </motion.div>

              {/* Step 2 */}
              <motion.div
                whileHover={{ y: -4 }}
                className={`p-6 rounded-3xl border flex flex-col justify-between transition-all ${
                  isDarkMode ? "bg-white/5 border-white/10" : "bg-zinc-50 border-zinc-200 shadow-sm"
                }`}
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-black text-2xl mb-4">
                    2
                  </div>
                  <h3 className="text-lg font-black text-white mb-2">מהי ״מוכנות לשיעור״?</h3>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                    הציוד הנדרש (מחברת, ספר, קלמר וכו') <strong>נמצא ברשותכם על השולחן</strong> ואתם דרוכים ללמידה. <br />
                    <span className="text-rose-400 font-bold block mt-1">
                      ⚠️ אין לגשת ללוקר לאחר תחילת השיעור!
                    </span>
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/10 text-xs font-bold text-sky-400 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>ציוד מוכן מראש</span>
                </div>
              </motion.div>

              {/* Step 3 */}
              <motion.div
                whileHover={{ y: -4 }}
                className={`p-6 rounded-3xl border flex flex-col justify-between transition-all ${
                  isDarkMode ? "bg-white/5 border-white/10" : "bg-zinc-50 border-zinc-200 shadow-sm"
                }`}
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-black text-2xl mb-4">
                    3
                  </div>
                  <h3 className="text-lg font-black text-white mb-2">השלכות אי-מוכנות</h3>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                    אם תגיעו לא מוכנים לשיעור (ללא ציוד / איחור) – <strong>תירשם הערה במשוב</strong> וזה יבוא לידי ביטוי ישיר בציון התלמידאות של אותו מקצוע.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/10 text-xs font-bold text-rose-400 flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4" />
                  <span>השפעה ישירה על המשוב והציון</span>
                </div>
              </motion.div>
            </div>
          </div>
        );

      // ----------------------------------------------------
      // SLIDE 6: My Expectations of You (הציפיות שלי מכם)
      // ----------------------------------------------------
      case 5:
        return (
          <div className="space-y-4">
            <div>
              <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                המצפן הכיתתי של ח׳2 🤝
              </span>
              <h2 className="text-3xl sm:text-4xl font-black mt-1">הציפיות שלי מכם</h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                חמישה עקרונות פשוטים שהופכים את השנה שלנו למנצחת, מהנה ומצמיחה
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
              {/* Point 1 */}
              <div
                className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                  isDarkMode ? "bg-gradient-to-br from-amber-500/10 to-white/5 border-amber-500/30" : "bg-amber-50/70 border-amber-200"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">🌟</span>
                  <h4 className="font-black text-sm text-amber-400">אווירה ושמחה בכיתה</h4>
                </div>
                <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-medium">
                  תמיד לזכור ש<strong>אף אחד לא קם בבוקר ומתבאס שהוא לומד בכיתה ח׳2</strong>. לכולנו יש אחריות מלאה לכך – <strong>גם לי כמחנך!</strong>
                </p>
              </div>

              {/* Point 2 */}
              <div
                className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                  isDarkMode ? "bg-white/5 border-white/10" : "bg-zinc-50 border-zinc-200"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">❤️</span>
                  <h4 className="font-black text-sm text-pink-400">כבוד הדדי ללא פשרות</h4>
                </div>
                <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-medium">
                  <strong>לנהוג בכבוד</strong> אחד כלפי השני ואחת כלפי השנייה – בשפה, ביחס, במרחב האישי ובשיח הקבוצתי.
                </p>
              </div>

              {/* Point 3 */}
              <div
                className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                  isDarkMode ? "bg-white/5 border-white/10" : "bg-zinc-50 border-zinc-200"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">📈</span>
                  <h4 className="font-black text-sm text-emerald-400">אחריות להצלחה לימודית</h4>
                </div>
                <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-medium">
                  שנה שעברה הייתה שנת הסתגלות לחטיבה. <strong>השנה אני מצפה מההישגים הלימודיים של הכיתה לעלות משמעותית!</strong>
                </p>
              </div>

              {/* Point 4 */}
              <div
                className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                  isDarkMode ? "bg-white/5 border-white/10" : "bg-zinc-50 border-zinc-200"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">🧠</span>
                  <h4 className="font-black text-sm text-sky-400">עקביות מנצחת לחץ</h4>
                </div>
                <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-medium">
                  <strong>השקעה של מעט זמן בבית</strong> תוך כדי המחצית עושה הבדל עצום ומורידה את הלחץ לפני מבחנים.
                </p>
              </div>

              {/* Point 5 (Span 2 in lg) */}
              <div
                className={`lg:col-span-2 p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                  isDarkMode ? "bg-gradient-to-r from-sky-500/10 via-purple-500/10 to-transparent border-sky-500/30" : "bg-sky-50 border-sky-200"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">🗣️</span>
                  <h4 className="font-black text-sm text-sky-400">מדברים לפני הפיצוץ</h4>
                </div>
                <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-medium">
                  אני מצפה שתבואו <strong>לדבר איתי לפני הפיצוץ</strong> (מול חבר.ה או מורה) ולא אחריו. יש קושי? תסכול? אי-הבנה? בואו נפתור את זה ביחד בזמן!
                </p>
              </div>
            </div>
          </div>
        );

      // ----------------------------------------------------
      // SLIDE 7: Your Expectations of Me (לוח פתקיות אינטראקטיבי - חלופה ב')
      // ----------------------------------------------------
      case 6:
        return (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-pink-500/20 text-pink-400 border border-pink-500/30">
                  התור שלכם! לוח פתקיות שיתופי 🎯
                </span>
                <h2 className="text-3xl sm:text-4xl font-black mt-1">הציפיות שלכם ממני</h2>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  מה אתם צריכים ממני כמחנך כדי שהשנה תהיה הכי טובה, מעצימה והוגנת שאפשר?
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAddNoteModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-amber-500 hover:from-pink-400 hover:to-amber-400 text-zinc-950 font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-pink-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>הוסף פתקית מהתלמידים</span>
                </button>
                <button
                  onClick={handleResetNotes}
                  className={`p-2.5 rounded-xl border text-zinc-400 hover:text-white transition-all ${
                    isDarkMode ? "bg-white/5 border-white/10" : "bg-zinc-100 border-zinc-200"
                  }`}
                  title="איפוס פתקיות לברירת מחדל"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Sticky Notes Wall Canvas */}
            <div
              className={`p-5 sm:p-6 rounded-3xl border min-h-[360px] max-h-[440px] overflow-y-auto ${
                isDarkMode ? "bg-[#080c18]/80 border-white/10" : "bg-zinc-100/70 border-zinc-200"
              }`}
            >
              {stickyNotes.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center text-zinc-400 space-y-2">
                  <MessageSquare className="h-10 w-10 text-zinc-600" />
                  <p className="text-sm font-bold">הלוח ריק! לחצו על ״הוסף פתקית מהתלמידים״ כדי לרשום תשובות בלייב.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {stickyNotes.map((note) => {
                    const colorStyles =
                      note.color === "yellow"
                        ? "bg-amber-200/95 text-amber-950 shadow-amber-500/10"
                        : note.color === "green"
                        ? "bg-emerald-200/95 text-emerald-950 shadow-emerald-500/10"
                        : note.color === "pink"
                        ? "bg-pink-200/95 text-pink-950 shadow-pink-500/10"
                        : note.color === "blue"
                        ? "bg-sky-200/95 text-sky-950 shadow-sky-500/10"
                        : "bg-purple-200/95 text-purple-950 shadow-purple-500/10";

                    return (
                      <motion.div
                        key={note.id}
                        layout
                        initial={{ scale: 0.8, opacity: 0, rotate: (Math.random() - 0.5) * 4 }}
                        animate={{ scale: 1, opacity: 1, rotate: (Math.random() - 0.5) * 2 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className={`p-4 rounded-2xl shadow-lg border border-black/10 flex flex-col justify-between min-h-[140px] transform hover:scale-105 hover:rotate-0 transition-all ${colorStyles}`}
                      >
                        <div>
                          <div className="flex justify-between items-center pb-1.5 mb-2 border-b border-black/10 text-[11px] font-bold opacity-80">
                            <span>📌 {note.category}</span>
                            <button
                              onClick={() => handleDeleteNote(note.id)}
                              className="text-black/50 hover:text-red-700 transition-colors p-1"
                              title="מחק פתקית"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                          <p className="text-xs sm:text-sm font-black leading-snug">
                            ״{note.text}״
                          </p>
                        </div>

                        <div className="flex justify-between items-center pt-2 mt-2 border-t border-black/10 text-[11px]">
                          <span className="opacity-70 font-semibold">{note.author || "תלמיד/ה בכיתה"}</span>
                          <button
                            onClick={() => handleLikeNote(note.id)}
                            className="flex items-center gap-1 font-bold bg-black/10 hover:bg-black/20 px-2 py-0.5 rounded-full transition-all cursor-pointer"
                          >
                            <Heart className="h-3 w-3 text-red-600 fill-red-600" />
                            <span>{note.likes}</span>
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            <div
              className={`p-3 rounded-2xl border text-xs font-semibold flex items-center justify-between ${
                isDarkMode ? "bg-white/5 border-white/10 text-zinc-300" : "bg-white border-zinc-200 text-zinc-700 shadow-sm"
              }`}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-pink-400" />
                <span>
                  <strong>הערת הנחיה:</strong> במהלך השיעור, שאלו את הכיתה ורשמו כאן את התשובות שלהם. כל הפתקיות נשמרות מיידית!
                </span>
              </div>
              <span className="text-[11px] font-bold text-pink-400">
                סה״כ פתקיות: {stickyNotes.length}
              </span>
            </div>
          </div>
        );

      default:
        return null;
    }
  }
}
