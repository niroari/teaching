"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Maximize2,
  Minimize2,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Award,
  Info,
  Layers,
  FileText,
  AlertTriangle,
  Shield,
  Compass,
  Check,
  X,
  Sparkles,
  ExternalLink,
  BookOpen
} from "lucide-react";

// Snake image data with sources and attributions
const IMAGES = {
  daboia: {
    url: "https://upload.wikimedia.org/wikipedia/commons/2/21/Daboia_palaestinae.jpg",
    author: "Guy Haimovitch",
    license: "CC BY-SA 4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Daboia_palaestinae.jpg",
    commonName: "צפע מצוי (צפע ארצישראלי)"
  },
  echis: {
    url: "https://upload.wikimedia.org/wikipedia/commons/4/45/124413_echis_PikiWiki_Israel.jpg",
    author: "PikiWiki Israel / דרור גלילי",
    license: "CC BY 2.5",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:124413_echis_PikiWiki_Israel.jpg",
    commonName: "אפעה מגוון"
  },
  atractaspis: {
    url: "https://upload.wikimedia.org/wikipedia/commons/8/86/Atractaspis_engaddensis.jpg",
    author: "Zoo Haifa",
    license: "CC BY-SA 3.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Atractaspis_engaddensis.jpg",
    commonName: "שרף עין גדי"
  },
  nummifer: {
    url: "https://upload.wikimedia.org/wikipedia/commons/6/65/Hemorrhois_nummifer.JPG",
    author: "Wikimedia Commons",
    license: "CC BY-SA 3.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Hemorrhois_nummifer.JPG",
    commonName: "זעמן מטבעות"
  },
  jugularis: {
    url: "https://upload.wikimedia.org/wikipedia/commons/c/c6/Dolichophis_jugularis.jpg",
    author: "Wikimedia Commons",
    license: "CC BY-SA 3.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Dolichophis_jugularis.jpg",
    commonName: "זעמן שחור"
  }
};

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    question: "כמה מיני נחשים חיים בישראל, וכמה מתוכם ארסיים ומסוכנים לאדם?",
    options: [
      "41 מינים בישראל, מתוכם 22 ארסיים ומסוכנים.",
      "41 מינים בישראל, מתוכם 9 מינים בלבד ארסיים ומסוכנים.",
      "15 מינים בישראל, מתוכם 9 מינים בלבד ארסיים ומסוכנים.",
      "30 מינים בישראל, מתוכם אף נחש אינו ארסי באמת."
    ],
    correctAnswer: 1,
    explanation: "בישראל יש מגוון עצום של 41 מיני נחשים, אך רובם המוחלט (32 מינים) אינם מזיקים לאדם. רק 9 מינים הם ארסיים ומסוכנים."
  },
  {
    question: "כיצד נוכל להבדיל בין צפע מצוי (ארסי) לזעמן מטבעות (לא ארסי)?",
    options: [
      "לצפע יש גוף שחור מבריק וארוך, בעוד שלזעמן מטבעות יש צבע צהוב חלק.",
      "לצפע יש ראש מעוגל לחלוטין, בעוד שלזעמן מטבעות יש ראש מרובע רחב.",
      "לצפע יש פס עקלקל (זיגזג) רציף וכהה על הגב, בעוד שלזעמן יש כתמים מעוגלים נפרדים (מטבעות).",
      "אי אפשר להבדיל ביניהם בכלל והם נראים בדיוק אותו הדבר."
    ],
    correctAnswer: 2,
    explanation: "זעמן המטבעות מנסה לחקות את הצפע כדי להרחיק טורפים, אך הכתמים על גבו מופרדים לחלוטין (מטבעות) בניגוד לזיגזג הרציף והמחובר שלאורך גב הצפע."
  },
  {
    question: "מדוע שרף עין גדי נחשב למסוכן וייחודי כל כך, ומדוע אסור לתפוס אותו מאחורי הראש?",
    options: [
      "מכיוון שהוא יכול לקפוץ לגובה של 2 מטרים ולהכיש מהאוויר.",
      "שיני הארס שלו פונות לאחור ויוצאות מצדי הפה (הכשה הצידה), ואין עבורו נסיוב (נוגדן) רפואי.",
      "מכיוון שהוא יורק ארס לעיניים ממרחק רב.",
      "הוא אינו מסוכן כלל, אלא רק נראה מאיים בגלל הראש המשולש שלו."
    ],
    correctAnswer: 1,
    explanation: "שרף עין גדי שובר את כל החוקים: הוא דק ושחור, אין לו ראש משולש, הוא מכיש בתנועת נגיחה הצידה ולאחור, ואין לו נסיוב נוגדן רפואי."
  },
  {
    question: "מצאתם נחש בטבע או בגינת הבית. האם מותר לפגוע בו או להרוג אותו?",
    options: [
      "כן, כל נחש הוא סכנה מיידית ומותר להרוג אותו.",
      "מותר להרוג רק נחשים ארסיים כמו צפע, ואסור לפגוע בלא-ארסיים.",
      "לא! כל הנחשים בישראל הם חיות בר מוגנות על פי חוק. אסור לפגוע בהם, לצוד או לגדל אותם.",
      "מותר לפגוע בנחשים רק אם הם נכנסים לתוך שטח מיושב."
    ],
    correctAnswer: 2,
    explanation: "על פי החוק בישראל, כל הנחשים הם חיות בר מוגנות. הם מהווים חלק חיוני מהמערכת האקולוגית כמדבירים טבעיים של מכרסמים. במקרה של סכנה בשטח מיושב יש לקרוא ללוכד נחשים מורשה."
  }
];

export default function Presentation() {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [viewMode, setViewMode] = useState<"presentation" | "page">("presentation");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const presentationRef = useRef<HTMLDivElement>(null);

  // Slide 1 Interactive State
  const [selectedReaction, setSelectedReaction] = useState<number | null>(null);

  // Slide 3 Interactive State (Viper Tabs)
  const [activeViperTab, setActiveViperTab] = useState<"daboia" | "echis">("daboia");

  // Slide 5 Interactive State (Lookalike Slide)
  const [lookalikeView, setLookalikeView] = useState<"side-by-side" | "nummifer" | "jugularis">("side-by-side");

  // Slide 8 Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [activeQuestion, setActiveQuestion] = useState<number>(0);

  // Lightbox State
  const [lightboxImage, setLightboxImage] = useState<typeof IMAGES[keyof typeof IMAGES] | null>(null);

  const totalSlides = 8;

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightboxImage(null);
      }

      if (viewMode !== "presentation") return;

      if (e.key === "ArrowLeft") {
        // In RTL, ArrowLeft goes to the NEXT slide
        handleNext();
      } else if (e.key === "ArrowRight") {
        // In RTL, ArrowRight goes to the PREVIOUS slide
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
  }, [currentSlide, viewMode, lightboxImage]);

  // Handle Fullscreen toggle
  const toggleFullscreen = () => {
    if (!presentationRef.current) return;

    if (!document.fullscreenElement) {
      presentationRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        console.error(`Error enabling fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Sync manual dark mode class with the root element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const handleNext = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const playSound = (type: "correct" | "incorrect" | "click") => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === "correct") {
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
        
        setTimeout(() => {
          const osc2 = audioCtx.createOscillator();
          const gain2 = audioCtx.createGain();
          osc2.connect(gain2);
          gain2.connect(audioCtx.destination);
          osc2.frequency.setValueAtTime(659.25, audioCtx.currentTime); // E5
          gain2.gain.setValueAtTime(0.1, audioCtx.currentTime);
          osc2.start();
          osc2.stop(audioCtx.currentTime + 0.2);
        }, 120);
      } else if (type === "incorrect") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(150, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.35);
      } else {
        osc.frequency.setValueAtTime(1000, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.03);
      }
    } catch (e) {
      console.warn("Audio Context not supported or allowed yet", e);
    }
  };

  // Reset quiz
  const resetQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setActiveQuestion(0);
    playSound("click");
  };

  // Score calculation
  const quizScore = QUIZ_QUESTIONS.reduce((score, q, idx) => {
    return score + (quizAnswers[idx] === q.correctAnswer ? 1 : 0);
  }, 0);

  return (
    <div className={`${isDarkMode ? "dark" : ""} min-h-screen flex flex-col transition-colors duration-300`}>
      {/* Global Header */}
      <header className="bg-white/80 dark:bg-zinc-900/90 border-b border-zinc-200 dark:border-zinc-800 backdrop-blur sticky top-0 z-50 px-4 py-3 sm:px-6 flex justify-between items-center transition-colors">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-550/10 text-emerald-600 dark:text-emerald-400">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
              נחשים בישראל – בין רתע לחשיבות אקולוגית
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 hidden sm:block">מערך שיעור לחטיבת ביניים (כיתות ז'-ט')</p>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="bg-zinc-100 dark:bg-zinc-800 p-0.5 rounded-lg flex items-center gap-1 border border-zinc-200 dark:border-zinc-700">
            <button
              onClick={() => { setViewMode("presentation"); playSound("click"); }}
              className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all ${
                viewMode === "presentation"
                  ? "bg-white dark:bg-zinc-700 text-emerald-600 dark:text-emerald-400 shadow-sm"
                  : "text-zinc-650 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
              }`}
              title="תצוגת מצגת"
            >
              <Layers className="h-3.5 w-3.5" />
              <span className="hidden md:inline">מצגת</span>
            </button>
            <button
              onClick={() => { setViewMode("page"); playSound("click"); }}
              className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all ${
                viewMode === "page"
                  ? "bg-white dark:bg-zinc-700 text-emerald-600 dark:text-emerald-400 shadow-sm"
                  : "text-zinc-650 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
              }`}
              title="תצוגת עמוד רציף"
            >
              <FileText className="h-3.5 w-3.5" />
              <span className="hidden md:inline">עמוד רציף</span>
            </button>
          </div>

          <div className="h-6 w-[1px] bg-zinc-200 dark:bg-zinc-700 mx-1" />

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title={soundEnabled ? "השתק צלילים" : "הפעל צלילים"}
          >
            {soundEnabled ? <Volume2 className="h-4 w-4 text-emerald-500" /> : <VolumeX className="h-4 w-4" />}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => { setIsDarkMode(!isDarkMode); playSound("click"); }}
            className="p-2 rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title={isDarkMode ? "מצב יום" : "מצב לילה"}
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Fullscreen Button */}
          {viewMode === "presentation" && (
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              title="מסך מלא"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 bg-zinc-100 dark:bg-zinc-950 flex flex-col justify-center p-4 sm:p-6 transition-colors duration-300">
        {viewMode === "presentation" ? (
          /* PRESENTATION MODE: Single 16:9 Slide Canvas */
          <div
            ref={presentationRef}
            className="w-full max-w-6xl mx-auto flex flex-col gap-4 fullscreen:max-w-none fullscreen:h-screen fullscreen:bg-zinc-950 fullscreen:dark:bg-zinc-950 fullscreen:flex fullscreen:justify-center fullscreen:items-center fullscreen:p-8 sm:fullscreen:p-12"
          >
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl dark:shadow-emerald-950/5 overflow-hidden border border-zinc-200 dark:border-zinc-800 slide-aspect relative flex flex-col justify-between p-8 sm:p-12 transition-colors duration-300 select-none w-full max-h-full">
              
              {/* Decorative background grid */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(16,185,129,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

              {/* Top Meta info */}
              <div className="flex justify-between items-center z-10 border-b border-zinc-100 dark:border-zinc-800 pb-3 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  נחשי ישראל – שקף {currentSlide + 1} מתוך {totalSlides}
                </span>
                <span className="text-xs text-zinc-400 dark:text-zinc-500">
                  {currentSlide === 0 && "שקף 1: פתיח"}
                  {currentSlide === 1 && "שקף 2: תעודת זהות במספרים"}
                  {currentSlide === 2 && "שקף 3: הארסיים המרכזיים"}
                  {currentSlide === 3 && "שקף 4: שרף עין גדי"}
                  {currentSlide === 4 && "שקף 5: החברים הלא-ארסיים"}
                  {currentSlide === 5 && "שקף 6: חשיבות אקולוגית"}
                  {currentSlide === 6 && "שקף 7: בטיחות קודמת לכל"}
                  {currentSlide === 7 && "שקף 8: סיכום ובוחן פתע"}
                </span>
              </div>

              {/* Animated Slide Content Switcher */}
              <div className="flex-1 flex flex-col justify-center relative overflow-hidden z-10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="h-full flex flex-col justify-center"
                  >
                    {renderSlideContent(currentSlide)}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Bottom Navigation Controls */}
              <div className="flex justify-between items-center z-10 mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                {/* Prev Button */}
                <button
                  onClick={() => { handlePrev(); playSound("click"); }}
                  disabled={currentSlide === 0}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    currentSlide === 0
                      ? "text-zinc-300 dark:text-zinc-700 cursor-not-allowed"
                      : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 active:scale-95"
                  }`}
                >
                  <ArrowRight className="h-4 w-4" />
                  הקודם
                </button>

                {/* Dots indicator */}
                <div className="flex gap-2">
                  {Array.from({ length: totalSlides }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => { setCurrentSlide(idx); playSound("click"); }}
                      className={`h-2.5 rounded-full transition-all duration-300 ${
                        idx === currentSlide
                          ? "w-8 bg-emerald-500"
                          : "w-2.5 bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400 dark:hover:bg-zinc-600"
                      }`}
                      title={`עבור לשקף ${idx + 1}`}
                    />
                  ))}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => { handleNext(); playSound("click"); }}
                  disabled={currentSlide === totalSlides - 1}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    currentSlide === totalSlides - 1
                      ? "text-zinc-300 dark:text-zinc-700 cursor-not-allowed"
                      : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 active:scale-95"
                  }`}
                >
                  הבא
                  <ArrowLeft className="h-4 w-4" />
                </button>
              </div>

            </div>

            {/* Quick Keyboard Help Guide */}
            <div className="text-center text-xs text-zinc-500 dark:text-zinc-400 select-none fullscreen:hidden">
              <span>טיפ מורה: השתמש/י במקשי <strong>חץ שמאל</strong> (הבא), <strong>חץ ימין</strong> (הקודם) או <strong>רווח</strong> (הבא) לניווט.</span>
            </div>
          </div>
        ) : (
          /* PAGE SCROLL MODE: Continuous Layout for Printing / Reviewing */
          <div className="w-full max-w-4xl mx-auto flex flex-col gap-10 py-6">
            <div className="bg-emerald-500/10 dark:bg-emerald-950/20 border border-emerald-500/25 dark:border-emerald-900/40 rounded-xl p-5 text-sm leading-relaxed text-emerald-800 dark:text-emerald-300 shadow-sm">
              <h3 className="font-bold mb-1 flex items-center gap-2">📖 תצוגת מורה מלאה (מערך שיעור רציף)</h3>
              עמוד רציף נועד להכנת שיעור או להדפסה ישירה באמצעות הדפדפן.
            </div>

            {Array.from({ length: totalSlides }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-zinc-900 rounded-2xl p-8 sm:p-10 shadow border border-zinc-200 dark:border-zinc-800 relative transition-colors duration-300"
              >
                <div className="absolute top-6 left-6 text-xs bg-zinc-200 dark:bg-zinc-800 text-zinc-500 px-3 py-1 rounded-full font-bold">
                  שקף {idx + 1}
                </div>
                <div className="border-b border-zinc-100 dark:border-zinc-800 pb-4 mb-6">
                  <span className="text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold block mb-1">
                    נושא השקף
                  </span>
                  <h2 className="text-2xl font-black text-zinc-905 dark:text-zinc-50">
                    {idx === 0 && "שקף 1: פתיח ומבוא"}
                    {idx === 1 && "שקף 2: תעודת זהות במספרים"}
                    {idx === 2 && "שקף 3: הארסיים המרכזיים"}
                    {idx === 3 && "שקף 4: שרף עין גדי – היוצא מן הכלל הקטלני"}
                    {idx === 4 && "שקף 5: החברים הלא-ארסיים ומדבירים טבעיים"}
                    {idx === 5 && "שקף 6: החשיבות האקולוגית של הנחש"}
                    {idx === 6 && "שקף 7: כללי בטיחות ומניעה במפגש עם נחש"}
                    {idx === 7 && "שקף 8: סיכום ובוחן פתע כיתתי"}
                  </h2>
                </div>
                <div className="min-h-[250px] flex flex-col justify-center">
                  {renderSlideContent(idx)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Citations and Image Attributions Footer */}
        <footer className="w-full max-w-4xl mx-auto mt-12 mb-8 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 transition-colors duration-300">
          <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-3 flex items-center gap-2 pb-2 border-b border-zinc-200 dark:border-zinc-800">
            <Info className="h-4 w-4 text-emerald-500" />
            מקורות מידע ותמונות (רישיונות פתוחים)
          </h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4 leading-relaxed">
            כל התמונות במצגת זו לקוחות מרישיונות שימוש חופשיים (Creative Commons / Public Domain) דרך <strong>Wikimedia Commons</strong>. להלן קישורי המקור והקרדיטים ליוצרים:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.values(IMAGES).map((img, idx) => (
              <div key={idx} className="bg-white dark:bg-zinc-950 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 flex items-center gap-3">
                <img
                  src={img.url}
                  alt={img.commonName}
                  onClick={() => setLightboxImage(img)}
                  className="h-10 w-10 object-contain rounded bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 cursor-zoom-in hover:scale-105 transition-transform"
                  title="לחץ להגדלה"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate">{img.commonName}</div>
                  <div className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">
                    יוצר: {img.author} | רישיון: {img.license}
                  </div>
                  <a
                    href={img.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-emerald-600 dark:text-emerald-450 hover:underline flex items-center gap-0.5 mt-0.5"
                  >
                    צפייה בקובץ המקור בויקישיתוף
                    <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </footer>
      </main>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full max-h-[85vh] flex flex-col bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl"
            >
              {/* Close Button */}
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-black/60 hover:bg-black/85 text-white/80 hover:text-white border border-white/10 transition-all cursor-pointer"
                title="סגירה (Esc)"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Image Container */}
              <div className="relative flex-1 flex items-center justify-center min-h-0 p-2 sm:p-4 bg-zinc-950">
                <img
                  src={lightboxImage.url}
                  alt={lightboxImage.commonName}
                  className="max-w-full max-h-[65vh] object-contain rounded-lg shadow-lg"
                />
              </div>

              {/* Footer / Attribution Info */}
              <div className="bg-zinc-900 border-t border-zinc-800 p-4 sm:p-5 text-right" style={{ direction: "rtl" }}>
                <h4 className="text-lg sm:text-xl font-bold text-zinc-100 mb-1">
                  {lightboxImage.commonName}
                </h4>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-400">
                  <div>
                    <span className="font-semibold text-zinc-300">צילום: </span>
                    {lightboxImage.author}
                  </div>
                  <div>
                    <span className="font-semibold text-zinc-300">רישיון: </span>
                    {lightboxImage.license}
                  </div>
                  {lightboxImage.sourceUrl && (
                    <a
                      href={lightboxImage.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-450 hover:underline flex items-center gap-1 inline-flex"
                    >
                      צפייה במקור בוויקישיתוף
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  // Render slides dynamically by index
  function renderSlideContent(index: number) {
    switch (index) {
      case 0:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center flex-1">
            <div className="lg:col-span-7 space-y-4">
              <h2 className="text-4xl sm:text-5xl font-black text-zinc-900 dark:text-zinc-50 leading-tight">
                נחשים בישראל: <br />
                <span className="text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-lg inline-block mt-1">המדריך השלם</span>
              </h2>
              <p className="text-lg text-zinc-600 dark:text-zinc-350 font-medium">
                מי מפחד ממי? נתונים, זנים וכללי התנהגות בשטח.
              </p>
              
              <div className="bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 space-y-3">
                <h4 className="text-xs uppercase tracking-wider font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  💭 שאלה למחשבה לדיון כיתתי
                </h4>
                <p className="text-sm sm:text-base font-semibold leading-relaxed text-zinc-800 dark:text-zinc-200">
                  מי כאן נתקל פעם בנחש בטבע או ליד הבית? <br className="hidden sm:inline" />מה הייתה התגובה הראשונית שלכם? האם הפאניקה שלנו מוצדקת?
                </p>
              </div>
            </div>

            {/* Interactive reaction poll on right */}
            <div className="lg:col-span-5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 space-y-4 shadow-sm">
              <div className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                סקר מהיר בכיתה: מה עושים כשרואים נחש?
              </div>
              <div className="flex flex-col gap-2.5">
                {[
                  { text: "נכנסים לפאניקה ומתחילים לברוח בצעקות!", desc: "תגובת בריחה נפוצה" },
                  { text: "מסתקרנים ומנסים להתקרב כדי לצלם או לראות", desc: "סקרנות ומשיכה" },
                  { text: "קופאים במקום ונסוגים לאחור באטיות ובשקט", desc: "שמירה על קור רוח" },
                  { text: "מחפשים מקל או אבן כדי לפגוע בו ולהתגונן", desc: "ניסיון תקיפה" }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setSelectedReaction(idx); playSound(idx === 2 ? "correct" : "click"); }}
                    className={`w-full text-right p-3 rounded-xl border text-xs sm:text-sm font-medium transition-all ${
                      selectedReaction === idx
                        ? idx === 2
                          ? "bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-300"
                          : "bg-amber-500/10 border-amber-500 text-amber-700 dark:text-amber-300"
                        : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                    }`}
                  >
                    <div className="font-bold flex items-center justify-between">
                      <span>{item.text}</span>
                      {selectedReaction === idx && (idx === 2 ? <Check className="h-4 w-4 text-emerald-500" /> : <Info className="h-4 w-4 text-amber-500" />)}
                    </div>
                    <div className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
              
              <AnimatePresence>
                {selectedReaction !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-zinc-200 dark:bg-zinc-800 text-[11px] sm:text-xs rounded-xl border border-zinc-200 dark:border-zinc-750 text-zinc-600 dark:text-zinc-350 leading-relaxed"
                  >
                    {selectedReaction === 2 ? (
                      <span className="text-emerald-700 dark:text-emerald-300 font-bold block mb-1">מעולה! זוהי התגובה הנכונה ביותר.</span>
                    ) : (
                      <span className="text-amber-700 dark:text-amber-300 font-bold block mb-1">זוהי תגובה טבעית אך מסוכנת!</span>
                    )}
                    נחשים אינם מחפשים בני אדם כדי להכיש אותם. הם יכישו רק אם הם חשים לכודים, מאוימים או כשדורכים עליהם. שמירה על מרחק ונסיגה שקטה מונעת כמעט 100% ממקרי ההכשה!
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="flex flex-col flex-1 h-full justify-between gap-4">
            <div>
              <div className="mb-2">
                <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest bg-emerald-500/15 px-2.5 py-1 rounded">
                  ישראל – מעצמת זוחלים!
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 mt-1">
                  נחשי ישראל במספרים
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center flex-1 mt-2">
              <div className="md:col-span-6 space-y-4">
                <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed font-semibold">
                  בשל מיקומה הייחודי של ישראל כגשר יבשתי המקשר בין שלוש יבשות (אסיה, אפריקה ואירופה), נוצר בה מגוון ביולוגי מדהים.
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-zinc-50 dark:bg-zinc-800 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-center shadow-sm">
                    <div className="text-4xl sm:text-5xl font-black text-emerald-600 dark:text-emerald-400">41</div>
                    <div className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-extrabold mt-1">מיני נחשים בישראל</div>
                  </div>
                  <div className="bg-rose-500/10 dark:bg-rose-950/20 p-5 rounded-xl border border-rose-200 dark:border-rose-900/30 text-center shadow-sm">
                    <div className="text-4xl sm:text-5xl font-black text-rose-600 dark:text-rose-400">9</div>
                    <div className="text-xs sm:text-sm text-rose-600 dark:text-rose-400 font-extrabold mt-1">מינים ארסיים בלבד</div>
                  </div>
                </div>
                
                <div className="text-xs sm:text-sm font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 p-3.5 rounded-lg border border-emerald-500/20 shadow-sm leading-relaxed">
                  השורה התחתונה: רובם המוחלט של הנחשים סביבנו (מעל 78%) אינם מזיקים לנו בכלל!
                </div>
              </div>

              {/* Visual Dot Matrix Grid */}
              <div className="md:col-span-6 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 flex flex-col justify-between h-full shadow-sm">
                <div>
                  <div className="text-xs sm:text-sm font-extrabold text-zinc-700 dark:text-zinc-300 mb-3 flex justify-between items-center">
                    <span>מפת המינים (כל נקודה מייצגת מין של נחש)</span>
                    <span className="text-[10px] text-zinc-500 font-normal">העבירו עכבר לזיהוי</span>
                  </div>
                  
                  {/* 41 Dots */}
                  <div className="grid grid-cols-7 sm:grid-cols-9 gap-2 p-3 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-inner">
                    {Array.from({ length: 41 }).map((_, idx) => {
                      const isVenomous = idx < 9;
                      return (
                        <div
                          key={idx}
                          className={`group relative aspect-square rounded-lg flex items-center justify-center text-[10px] sm:text-xs font-black transition-all duration-300 cursor-help ${
                            isVenomous
                              ? "bg-rose-500 text-white shadow-sm shadow-rose-500/30 hover:scale-110"
                              : "bg-emerald-500/20 text-emerald-700 dark:text-emerald-450 hover:bg-emerald-500/35 hover:scale-110"
                          }`}
                        >
                          {idx + 1}
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-24 bg-zinc-950 text-white text-[9px] text-center p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-lg font-bold">
                            {isVenomous ? "💀 נחש ארסי" : "🌿 לא מזיק"}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Range Information */}
                <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center gap-3">
                  <div className="p-2.5 rounded bg-amber-500/10 text-amber-500 shrink-0 shadow-sm">
                    <Compass className="h-5.5 w-5.5" />
                  </div>
                  <div className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-semibold">
                    <strong>תפוצה נרחבת:</strong> מהחרמון המושלג בצפון ועד אילת הצחיחה בדרום. הסביבה המשתנה בישראל מאפשרת לכל מין למצוא את בית הגידול המושלם עבורו.
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col flex-1 h-full justify-between gap-4">
            <div>
              <div className="mb-2">
                <span className="text-xs font-bold text-rose-500 uppercase tracking-widest bg-rose-500/10 px-2.5 py-1 rounded">
                  להכיר ולכבד (ממרחק)
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 mt-1">
                  הנחשים הארסיים המרכזיים בישראל
                </h3>
              </div>

              {/* Sub-navigation tabs */}
              <div className="flex border-b border-zinc-200 dark:border-zinc-800 mb-2">
                <button
                  onClick={() => { setActiveViperTab("daboia"); playSound("click"); }}
                  className={`py-1.5 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all ${
                    activeViperTab === "daboia"
                      ? "border-rose-500 text-rose-600 dark:text-rose-450"
                      : "border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-350"
                  }`}
                >
                  צפע מצוי (ארצישראלי)
                </button>
                <button
                  onClick={() => { setActiveViperTab("echis"); playSound("click"); }}
                  className={`py-1.5 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all ${
                    activeViperTab === "echis"
                      ? "border-rose-500 text-rose-600 dark:text-rose-450"
                      : "border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-350"
                  }`}
                >
                  אפעה מגוון
                </button>
              </div>
            </div>

            {/* Tab content */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center flex-1 mt-2">
              <div className="md:col-span-7 space-y-3">
                {activeViperTab === "daboia" ? (
                  <>
                    <h4 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                      🐍 צפע מצוי <span className="text-xs text-rose-500 font-bold bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20">הנפוץ והמסוכן ביותר</span>
                    </h4>
                    <div className="space-y-3 text-xs sm:text-sm text-zinc-650 dark:text-zinc-350 font-medium">
                      <p className="leading-relaxed">
                        הנחש הארסי הנפוץ ביותר בישראל. שולט מהצפון ועד לצפון-מרכז הנגב. רוב מקרי ההכשה בארץ מיוחסים למין זה.
                      </p>
                      <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-2">
                        <div className="flex gap-2">
                          <span className="font-bold text-rose-500 shrink-0">סימני זיהוי:</span>
                          <span>גוף חסון ועבה, ראש משולש ורחב הבולט מהצוואר. על גבו <strong>פס עקלקל (זיגזג) כהה ורציף</strong> הנמשך מהראש ועד הזנב.</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="font-bold text-rose-500 shrink-0">סביבת מחיה:</span>
                          <span>אוהב במיוחד אזורים מיושבים, גינות בתים, אזורים חקלאיים וערימות פסולת – שם הוא מוצא מכרסמים.</span>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <h4 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                      🏜️ אפעה מגוון <span className="text-xs text-amber-500 font-bold bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20">מלך המדבר</span>
                    </h4>
                    <div className="space-y-3 text-xs sm:text-sm text-zinc-650 dark:text-zinc-350">
                      <p className="leading-relaxed font-medium">
                        שולט באזורים המדבריים והמצוקים של ישראל (נגב, ערבה, בקעת הירדן ומדבר יהודה). הוא מטפס מצוין ופעיל במיוחד בלילות הקיץ החמים.
                      </p>
                      <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-2 text-xs sm:text-sm">
                        <div className="flex gap-2">
                          <span className="font-bold text-amber-500 shrink-0">סימני זיהוי:</span>
                          <span>קטן ודק יותר מהצפע. בעל צבעי הסוואה מדבריים (חום-צהבהב), ועל גבו סדרת <strong>כתמים בהירים ורוחביים</strong>.</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="font-bold text-amber-500 shrink-0">סביבת מחיה:</span>
                          <span>נחלים יבשים, מדרונות סלעיים, ומקורות מים במדבר. לפעמים מתקרב ליישובים חקלאיים בערבה.</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Photo Display */}
              <div 
                onClick={() => setLightboxImage(activeViperTab === "daboia" ? IMAGES.daboia : IMAGES.echis)}
                className="md:col-span-5 relative group overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 aspect-[4/3] max-h-[255px] w-full flex bg-zinc-100 dark:bg-zinc-900 cursor-zoom-in"
                title="לחץ להגדלה"
              >
                <img
                  src={activeViperTab === "daboia" ? IMAGES.daboia.url : IMAGES.echis.url}
                  alt={activeViperTab === "daboia" ? IMAGES.daboia.commonName : IMAGES.echis.commonName}
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-zinc-950/80 to-transparent p-3 text-white text-[10px] flex justify-between w-full">
                  <span>צילום: {activeViperTab === "daboia" ? IMAGES.daboia.author : IMAGES.echis.author}</span>
                  <span className="bg-emerald-500/90 text-white font-bold px-1 rounded">{activeViperTab === "daboia" ? "צפע מצוי" : "אפעה מגוון"}</span>
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="flex flex-col flex-1 h-full justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-500 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-full uppercase tracking-wider animate-pulse">
                <AlertTriangle className="h-3.5 w-3.5" />
                הארסי ביותר בישראל!
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 mt-1">
                שרף עין גדי – "היוצא מן הכלל" הקטלני
              </h3>
            </div>

            {/* Main content grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center flex-1 mt-2">
              {/* Photo & Distribution */}
              <div className="md:col-span-5 flex flex-col gap-3">
                <div 
                  onClick={() => setLightboxImage(IMAGES.atractaspis)}
                  className="relative group overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 aspect-[4/3] max-h-[255px] w-full flex bg-zinc-100 dark:bg-zinc-900 cursor-zoom-in"
                  title="לחץ להגדלה"
                >
                  <img
                    src={IMAGES.atractaspis.url}
                    alt={IMAGES.atractaspis.commonName}
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 right-3 bg-black/70 text-red-400 border border-red-500/35 px-2 py-0.5 rounded text-[10px] font-bold">
                    שרף עין גדי
                  </div>
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-zinc-950/80 to-transparent p-3 text-white text-[10px]">
                    <span>צילום: {IMAGES.atractaspis.author}</span>
                  </div>
                </div>
                <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-800">
                  <div className="text-xs font-bold text-zinc-500 dark:text-zinc-400">📍 אזורי תפוצה בישראל</div>
                  <div className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 font-semibold mt-0.5">
                    בקעת הירדן, אזור ים המלח (עין גדי – על שמו הוא נקרא) והערבה.
                  </div>
                </div>
              </div>

              {/* Text Cards */}
              <div className="md:col-span-7 flex flex-col justify-center space-y-4">
                <p className="text-xs sm:text-sm text-zinc-650 dark:text-zinc-350 leading-relaxed font-semibold">
                  שרף עין גדי (מכונה גם צפעון שחור) שובר את כל חוקי האצבע המסורתיים לזיהוי נחשים ארסיים, ולכן הוא מסוכן שבעתיים:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-red-500/5 dark:bg-red-950/10 border border-red-500/10 dark:border-red-900/20 rounded-xl space-y-1.5">
                    <div className="text-sm font-extrabold text-red-650 dark:text-red-400">🕵️ מראה מטעה</div>
                    <div className="text-xs sm:text-sm text-zinc-650 dark:text-zinc-300 leading-relaxed">
                      גוף דק, ראש קטן ומעוגל שאינו משולש. צבעו שחור מבריק ואחיד. נראה בדיוק כמו <strong>זעמן שחור צעיר</strong> (שאינו ארסי).
                    </div>
                  </div>
                  <div className="p-3 bg-red-500/5 dark:bg-red-950/10 border border-red-500/10 dark:border-red-900/20 rounded-xl space-y-1.5">
                    <div className="text-sm font-extrabold text-red-650 dark:text-red-400">⚔️ הכשה הצידה</div>
                    <div className="text-xs sm:text-sm text-zinc-650 dark:text-zinc-300 leading-relaxed">
                      שיני הארס פונות לאחור ויכולות לבלוט מצדי הפה. הוא אינו מכיש מקדימה, אלא דוקר הצידה או לאחור בתנועת נגיחה של הראש.
                    </div>
                  </div>
                  <div className="p-3 bg-red-500/5 dark:bg-red-950/10 border border-red-500/10 dark:border-red-900/20 rounded-xl space-y-1.5">
                    <div className="text-sm font-extrabold text-red-650 dark:text-red-400">🖐️ סכנת תפיסה</div>
                    <div className="text-xs sm:text-sm text-zinc-650 dark:text-zinc-300 leading-relaxed">
                      אסור בהחלט לתפוס אותו מאחורי הראש – הוא מסוגל לשלוף שן אחת הצידה ולהכיש את האצבע שמחזיקה אותו!
                    </div>
                  </div>
                  <div className="p-3 bg-red-500/5 dark:bg-red-950/10 border border-red-500/10 dark:border-red-900/20 rounded-xl space-y-1.5">
                    <div className="text-sm font-extrabold text-red-650 dark:text-red-400">❌ אין נוגדן (נסיוב)</div>
                    <div className="text-xs sm:text-sm text-zinc-650 dark:text-zinc-300 leading-relaxed">
                      בניגוד לצפע, לשרף עין גדי <strong>אין נסיוב רפואי</strong>. הטיפול בבית החולים מבוסס על תמיכה רפואית בלבד.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="flex flex-col flex-1 h-full justify-between gap-4">
            <div>
              <div className="mb-2">
                <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2.5 py-1 rounded">
                  המדבירים הטבעיים של הטבע
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 mt-1">
                  החברים הלא-ארסיים של האדם
                </h3>
              </div>

              {/* Interactive display controls */}
              <div className="flex gap-2 bg-zinc-100 dark:bg-zinc-800 p-0.5 rounded-lg border border-zinc-200 dark:border-zinc-700 w-fit">
                <button
                  onClick={() => { setLookalikeView("side-by-side"); playSound("click"); }}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    lookalikeView === "side-by-side"
                      ? "bg-white dark:bg-zinc-700 text-emerald-600 dark:text-emerald-400 shadow-sm"
                      : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-350"
                  }`}
                >
                  השוואת כפילים: צפע מול זעמן מטבעות
                </button>
                <button
                  onClick={() => { setLookalikeView("nummifer"); playSound("click"); }}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    lookalikeView === "nummifer"
                      ? "bg-white dark:bg-zinc-700 text-emerald-600 dark:text-emerald-400 shadow-sm"
                      : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-350"
                  }`}
                >
                  זעמן מטבעות
                </button>
                <button
                  onClick={() => { setLookalikeView("jugularis"); playSound("click"); }}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    lookalikeView === "jugularis"
                      ? "bg-white dark:bg-zinc-700 text-emerald-600 dark:text-emerald-400 shadow-sm"
                      : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-350"
                  }`}
                >
                  זעמן שחור
                </button>
              </div>
            </div>

            {/* Content view */}
            <div className="flex-1 flex flex-col justify-center mt-2">
              {lookalikeView === "side-by-side" && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center flex-1">
                  <div className="md:col-span-7 space-y-4">
                    <h4 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-200 flex items-center gap-2">
                      🔍 הטועה הגדול: איך מבדילים ביניהם?
                    </h4>
                    <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-semibold">
                      זעמן המטבעות הוא נחש לא-ארסי המבצע <strong>חיקוי בייטסיאני</strong>: הוא פיתח דוגמת גב המזכירה את הצפע על מנת להטעות טורפים. בגלל המראה שלו, בני אדם רבים מתבלבלים בינו לבין הצפע והורגים אותו לשווא.
                    </p>
                    
                    <div className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-2.5 shadow-sm">
                      <div className="flex justify-between items-center text-xs sm:text-sm font-extrabold border-b border-zinc-200 dark:border-zinc-700 pb-1.5 mb-1.5">
                        <span className="text-rose-600 dark:text-rose-400">צפע מצוי (💀 ארסי)</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">זעמן מטבעות (🌿 לא ארסי)</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm leading-relaxed font-semibold">
                        <div className="space-y-1 text-rose-600 dark:text-rose-400">
                          <div>• <strong>זיגזג רציף:</strong> פס גב גלי מחובר לחלוטין.</div>
                          <div>• <strong>ראש משולש רחב:</strong> בצורת לב.</div>
                          <div>• <strong>גוף חסון:</strong> קצר ועבה יותר.</div>
                        </div>
                        <div className="space-y-1 text-emerald-600 dark:text-emerald-400">
                          <div>• <strong>מטבעות נפרדים:</strong> עיגולים כהים ומנותקים.</div>
                          <div>• <strong>ראש מעוגל:</strong> אליפטי ועדין.</div>
                          <div>• <strong>גוף דק:</strong> זריז וארוך.</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-5 grid grid-cols-2 gap-3.5">
                    <div 
                      onClick={() => setLightboxImage(IMAGES.daboia)}
                      className="border border-rose-200 dark:border-rose-900/35 rounded-xl overflow-hidden bg-white dark:bg-zinc-900 flex flex-col cursor-zoom-in group shadow-sm"
                      title="לחץ להגדלה"
                    >
                      <img src={IMAGES.daboia.url} alt="צפע" className="h-40 w-full object-contain bg-zinc-50 dark:bg-zinc-950 transition-transform duration-500 group-hover:scale-105" />
                      <div className="p-2 text-center text-xs font-extrabold text-rose-600 dark:text-rose-400 bg-rose-500/10">צפע (פס זיגזג רציף)</div>
                    </div>
                    <div 
                      onClick={() => setLightboxImage(IMAGES.nummifer)}
                      className="border border-emerald-200 dark:border-emerald-900/35 rounded-xl overflow-hidden bg-white dark:bg-zinc-900 flex flex-col cursor-zoom-in group shadow-sm"
                      title="לחץ להגדלה"
                    >
                      <img src={IMAGES.nummifer.url} alt="זעמן מטבעות" className="h-40 w-full object-contain bg-zinc-50 dark:bg-zinc-955 transition-transform duration-500 group-hover:scale-105" />
                      <div className="p-2 text-center text-xs font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10">זעמן מטבעות</div>
                    </div>
                  </div>
                </div>
              )}

              {lookalikeView === "nummifer" && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center flex-1">
                  <div className="md:col-span-7 space-y-4">
                    <h4 className="text-lg sm:text-xl font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                      🐍 זעמן מטבעות <span className="text-xs text-emerald-500 bg-emerald-500/10 px-2 rounded-full font-bold">מגן הבית ושכן מועיל</span>
                    </h4>
                    <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed font-semibold">
                      זעמן המטבעות הוא נחש פעיל יום זריז. הוא אינו ארסי ואינו מהווה סכנה לאדם (אם כי הוא עלול לנשוך אם מציקים לו).
                    </p>
                    <div className="bg-emerald-500/5 dark:bg-emerald-950/10 border border-emerald-500/15 p-4 rounded-xl text-xs sm:text-sm space-y-2 shadow-sm font-semibold">
                      <div className="font-extrabold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5 text-sm sm:text-base">
                        <Shield className="h-5 w-5" />
                        למה הוא חבר יקר?
                      </div>
                      <p className="text-zinc-650 dark:text-zinc-350 leading-relaxed font-medium">
                        הוא מתחרה ישיר עם הצפע על טריטוריה. הימצאות של זעמן מטבעות בגינה מקטינה משמעותית את הסיכוי שצפע יתנחל בה! בנוסף, זעמן המטבעות טורף נחשים אחרים – כולל צפעים צעירים.
                      </p>
                    </div>
                  </div>
                  <div 
                    onClick={() => setLightboxImage(IMAGES.nummifer)}
                    className="md:col-span-5 relative group overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 aspect-[4/3] max-h-[255px] w-full flex bg-zinc-100 dark:bg-zinc-900 cursor-zoom-in shadow-sm"
                    title="לחץ להגדלה"
                  >
                    <img src={IMAGES.nummifer.url} alt={IMAGES.nummifer.commonName} className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-zinc-950/80 to-transparent p-3 text-white text-[10px] flex justify-between w-full">
                      <span>צילום: ויקישיתוף</span>
                      <span className="bg-emerald-500/90 text-white font-bold px-1 rounded font-sans">זעמן מטבעות</span>
                    </div>
                  </div>
                </div>
              )}

              {lookalikeView === "jugularis" && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center flex-1">
                  <div className="md:col-span-7 space-y-4">
                    <h4 className="text-lg sm:text-xl font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                      🐍 זעמן שחור <span className="text-xs text-emerald-500 bg-emerald-500/10 px-2 rounded-full font-bold">ענק הגינות הידידותי</span>
                    </h4>
                    <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed font-semibold">
                      נחש ארוך במיוחד (יכול לעבור 2 מטרים ואף להגיע ל-2.5 מטרים!). הוא מהיר להפליא, פעיל יום, וצבעו של בוגר שחור אחיד, מבריק ומרהיב.
                    </p>
                    <div className="bg-emerald-500/5 dark:bg-emerald-950/10 border border-emerald-500/15 p-4 rounded-xl text-xs sm:text-sm space-y-2 shadow-sm font-semibold">
                      <div className="font-extrabold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5 text-sm sm:text-base">
                        <Sparkles className="h-5 w-5" />
                        נכס עצום לחקלאים ולגינות
                      </div>
                      <p className="text-zinc-650 dark:text-zinc-350 leading-relaxed font-medium">
                        זעמן שחור ניזון בעיקר ממכרסמים (עכברים וחולדות). נחש אחד בגינה מבצע עבודה יעילה יותר מכל רעל או מלכודת. בנוסף, הוא אינו ארסי לחלוטין. הוא פחדן ויעדיף תמיד להימלט מאשר להתמודד עם אדם.
                      </p>
                    </div>
                  </div>
                  <div 
                    onClick={() => setLightboxImage(IMAGES.jugularis)}
                    className="md:col-span-5 relative group overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 aspect-[4/3] max-h-[255px] w-full flex bg-zinc-100 dark:bg-zinc-900 cursor-zoom-in shadow-sm"
                    title="לחץ להגדלה"
                  >
                    <img src={IMAGES.jugularis.url} alt={IMAGES.jugularis.commonName} className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-zinc-950/80 to-transparent p-3 text-white text-[10px] flex justify-between w-full">
                      <span>צילום: ויקישיתוף</span>
                      <span className="bg-emerald-500/90 text-white font-bold px-1 rounded font-sans">זעמן שחור</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="flex flex-col flex-1 h-full justify-between gap-4">
            <div>
              <div className="mb-2">
                <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2.5 py-1 rounded">
                  החשיבות האקולוגית של הנחש
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 mt-1">
                  למה אנחנו חייבים את הנחשים בטבע?
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center flex-1 mt-2">
              <div className="md:col-span-6 space-y-4">
                <p className="text-sm sm:text-base text-zinc-650 dark:text-zinc-300 leading-relaxed font-semibold">
                  הנחשים סובלים מיחסי ציבור גרועים ומרתע עמוק בגלל פחד היסטורי, אך הם מהווים נדבך קריטי לשמירה על הטבע בישראל.
                </p>
                
                <div className="bg-emerald-500/10 dark:bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-5 flex gap-3.5 shadow-sm">
                  <Shield className="h-6 w-6 text-emerald-500 shrink-0 mt-0.5" />
                  <div className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-semibold">
                    <strong>חוק הגנת הטבע:</strong> כל הנחשים בישראל הם חיות בר מוגנות. אסור לפגוע בהם, להרוג אותם, לצוד אותם או לגדל אותם ללא היתר מיוחד מרשות הטבע והגנים.
                  </div>
                </div>
              </div>

              {/* Ecological Cards Grid */}
              <div className="md:col-span-6 grid grid-cols-1 gap-4">
                <div className="p-5 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-start gap-4 shadow-sm">
                  <div className="p-2.5 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-extrabold text-sm shrink-0">01</div>
                  <div>
                    <h4 className="text-base font-extrabold text-zinc-900 dark:text-zinc-100 mb-1">מדבירים ביולוגיים יעילים</h4>
                    <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                      ללא נחשים, אוכלוסיות המכרסמים (עכברים וחולדות) היו מתרבות ללא בקרה. המכרסמים היו הורסים יבולים חקלאיים ומפיצים מחלות קשות לבני אדם.
                    </p>
                  </div>
                </div>

                <div className="p-5 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-start gap-4 shadow-sm">
                  <div className="p-2.5 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-extrabold text-sm shrink-0">02</div>
                  <div>
                    <h4 className="text-base font-extrabold text-zinc-900 dark:text-zinc-100 mb-1">חוליה קריטית בשרשרת המזון</h4>
                    <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                      הנחשים משמשים גם כטורפים וגם כנטרפים. הם מווסתים את אוכלוסיות הטרף שלהם, ומהווים מזון הכרחי לדורסי לילה, חיוויאים (עיטי נחשים) ונמיות.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="flex flex-col flex-1 h-full justify-between gap-4">
            <div>
              <div className="mb-2">
                <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2.5 py-1 rounded">
                  בטיחות קודמת לכל
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 mt-1">
                  פגשנו נחש – מה עושים בפועל?
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch flex-1 mt-2">
              <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
                <p className="text-sm sm:text-base text-zinc-650 dark:text-zinc-300 leading-relaxed font-semibold">
                  מפגש עם נחש יכול להיות מלחיץ, אך פעולה לפי כללים פשוטים תבטיח שאף אחד – לא אתם ולא הנחש – ייפגע.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {[
                    { title: "📏 שומרים על מרחק בטוח", text: "נחשים לא תוקפים סתם. מרחק של 2-3 מטרים מונע לחלוטין את טווח ההכשה של הנחש." },
                    { title: "🚫 לא נוגעים ולא מנסים לתפוס", text: "הניסיון לתפוס או להרוג נחש הוא הגורם הראשי להכשות. שרף עין גדי מוכיח שסימני הזיהוי עלולים להטעות!" },
                    { title: "📞 קוראים ללוכד מוסמך", text: "אם הנחש נמצא בחצר בית או בבית הספר, יש להתרחק ולקרוא מיד ללוכד נחשים מורשה מטעם רט\"ג." },
                    { title: "🥾 בטיחות בטיולים וביציאה לטבע", text: "הולכים בשבילים מסומנים, נועלים נעליים סגורות, ולא מכניסים ידיים למחילות או מתחת לאבנים בלי להסתכל." }
                  ].map((item, idx) => (
                    <div key={idx} className="p-3.5 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-1.5 shadow-sm">
                      <h4 className="text-xs sm:text-sm font-extrabold text-emerald-600 dark:text-emerald-400">{item.title}</h4>
                      <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* visual callout box */}
              <div className="lg:col-span-5 bg-zinc-900 text-white rounded-2xl p-6 border border-zinc-800 flex flex-col justify-between relative overflow-hidden shadow-md">
                <div className="absolute inset-0 bg-emerald-500/[0.03] pointer-events-none" />
                <div className="space-y-4 flex-1 flex flex-col justify-between">
                  <div className="flex items-center gap-2 text-rose-500 font-extrabold text-xs sm:text-sm uppercase tracking-widest">
                    <AlertTriangle className="h-4 w-4 animate-pulse" />
                    שקשוק ואזהרה
                  </div>
                  <h4 className="text-lg sm:text-xl font-black leading-tight text-white">נחש מנסה להרחיק אתכם!</h4>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-medium">
                    כאשר נחש מרגיש מאוים, הוא ינסה להזהיר אתכם לפני שיפעל. צפע מצוי ישמיע <strong>נשיפה רועשת</strong> של אוויר. אפעה מגוון ישפשף קשקשים ויוצר קול רשרוש.
                  </p>
                  <div className="p-4 bg-zinc-800/80 rounded-xl border border-zinc-700/60 text-xs sm:text-sm text-zinc-300 leading-relaxed mt-auto">
                    <strong>מה לעשות כששומעים נשיפה או רשרוש?</strong>
                    <br />קפאו מיד במקום! חפשו בעיניים מהיכן מגיע הקול, ונסוגו באיטיות רבה לכיוון הנגדי. אל תרוצו ואל תזרקו עליו דבר.
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 7:
        return (
          <div className="flex flex-col flex-1 h-full justify-between gap-4">
            {/* Quiz header */}
            <div className="mb-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-zinc-200 dark:border-zinc-800">
              <div>
                <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded">
                  סיכום ובוחן פתע קליל
                </span>
                <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 mt-1">
                  האם אתם מוסמכים כנאמני נחשים?
                </h3>
              </div>
              
              {!quizSubmitted && (
                <div className="text-xs text-zinc-500 dark:text-zinc-400 font-bold bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full">
                  שאלה {activeQuestion + 1} מתוך {QUIZ_QUESTIONS.length}
                </div>
              )}
            </div>

            {/* Quiz main panel */}
            <div className="flex-1 flex flex-col justify-center mt-2">
              {!quizSubmitted ? (
                /* Question card */
                <div className="space-y-5">
                  <div className="text-lg sm:text-xl font-bold text-zinc-800 dark:text-zinc-100 bg-emerald-500/[0.02] border border-emerald-500/10 p-5 rounded-xl shadow-sm leading-relaxed">
                    {QUIZ_QUESTIONS[activeQuestion].question}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {QUIZ_QUESTIONS[activeQuestion].options.map((opt, optIdx) => {
                      const isSelected = quizAnswers[activeQuestion] === optIdx;
                      return (
                        <button
                          key={optIdx}
                          onClick={() => {
                            setQuizAnswers({ ...quizAnswers, [activeQuestion]: optIdx });
                            playSound("click");
                          }}
                          className={`w-full text-right p-4 rounded-xl border text-sm sm:text-base font-semibold transition-all cursor-pointer shadow-sm ${
                            isSelected
                              ? "bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/20"
                              : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                          }`}
                        >
                          <span className="ml-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-650 dark:text-zinc-400 px-2.5 py-1 rounded-md font-black text-sm">
                            {String.fromCharCode(1504 + optIdx)} {/* Hebrew letters: א, ב, ג, ד */}
                          </span>
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {/* Navigation within quiz */}
                  <div className="flex justify-between items-center pt-4 border-t border-zinc-100 dark:border-zinc-800 mt-2">
                    <button
                      onClick={() => {
                        if (activeQuestion > 0) {
                          setActiveQuestion(activeQuestion - 1);
                          playSound("click");
                        }
                      }}
                      disabled={activeQuestion === 0}
                      className={`text-xs sm:text-sm font-bold px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 cursor-pointer ${
                        activeQuestion === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-zinc-50 dark:hover:bg-zinc-800"
                      }`}
                    >
                      שאלה קודמת
                    </button>
                    
                    {activeQuestion < QUIZ_QUESTIONS.length - 1 ? (
                      <button
                        onClick={() => {
                          if (quizAnswers[activeQuestion] !== undefined) {
                            setActiveQuestion(activeQuestion + 1);
                            playSound("click");
                          } else {
                            alert("אנא בחרו תשובה לפני שתמשיכו!");
                          }
                        }}
                        className={`text-xs sm:text-sm font-bold bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-750 shadow transition-all cursor-pointer ${
                          quizAnswers[activeQuestion] === undefined ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        disabled={quizAnswers[activeQuestion] === undefined}
                      >
                        לשאלה הבאה
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          if (Object.keys(quizAnswers).length === QUIZ_QUESTIONS.length) {
                            setQuizSubmitted(true);
                            const finalScore = QUIZ_QUESTIONS.reduce((score, q, idx) => {
                              return score + (quizAnswers[idx] === q.correctAnswer ? 1 : 0);
                            }, 0);
                            playSound(finalScore === QUIZ_QUESTIONS.length ? "correct" : "incorrect");
                          } else {
                            alert("אנא ענו על כל השאלות לפני ההגשה!");
                          }
                        }}
                        className={`text-xs sm:text-sm font-bold bg-emerald-600 text-white px-5 py-2.5 rounded-lg hover:bg-emerald-700 shadow-md transition-all cursor-pointer ${
                          Object.keys(quizAnswers).length !== QUIZ_QUESTIONS.length ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        disabled={Object.keys(quizAnswers).length !== QUIZ_QUESTIONS.length}
                      >
                        הגש בוחן! 📝
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* Quiz Summary Results */
                <div className="space-y-4 text-center max-w-xl mx-auto w-full">
                  <div className="flex justify-center mb-1">
                    <div className="p-4 rounded-full bg-emerald-500/10 text-emerald-500 shadow-inner">
                      <Award className="h-12 w-12" />
                    </div>
                  </div>
                  <h4 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-50">
                    {quizScore === QUIZ_QUESTIONS.length
                      ? "כל הכבוד! ציון מושלם! 🎉"
                      : quizScore >= QUIZ_QUESTIONS.length / 2
                      ? "עבודה יפה! עברתם את הבוחן בהצלחה!"
                      : "מומלץ לחזור על החומר שוב."}
                  </h4>
                  <p className="text-sm sm:text-base text-zinc-550 dark:text-zinc-350 font-extrabold">
                    עניתם נכון על <strong>{quizScore}</strong> שאלות מתוך <strong>{QUIZ_QUESTIONS.length}</strong>.
                  </p>
                  
                  {/* Visual progress score bar */}
                  <div className="w-full max-w-md mx-auto bg-zinc-200 dark:bg-zinc-800 h-3.5 rounded-full overflow-hidden mb-4 border border-zinc-300 dark:border-zinc-700 shadow-inner">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        quizScore === QUIZ_QUESTIONS.length ? "bg-emerald-500" : quizScore >= 2 ? "bg-amber-500" : "bg-red-500"
                      }`}
                      style={{ width: `${(quizScore / QUIZ_QUESTIONS.length) * 100}%` }}
                    />
                  </div>

                  {/* Review answers collapse panels */}
                  <div className="text-right max-h-48 overflow-y-auto space-y-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 bg-zinc-50 dark:bg-zinc-900 shadow-inner">
                    {QUIZ_QUESTIONS.map((q, idx) => {
                      const isCorrect = quizAnswers[idx] === q.correctAnswer;
                      return (
                        <div key={idx} className="p-2.5 border-b border-zinc-150 dark:border-zinc-800 last:border-b-0 text-xs sm:text-sm">
                          <div className="font-extrabold flex items-center gap-1.5 mb-1 text-zinc-800 dark:text-zinc-200">
                            {isCorrect ? <Check className="h-4 w-4 text-emerald-500" /> : <X className="h-4 w-4 text-red-500" />}
                            <span>שאלה {idx + 1}: {isCorrect ? "נכון" : "שגוי"}</span>
                          </div>
                          <p className="text-zinc-500 dark:text-zinc-400 italic font-semibold leading-relaxed">
                            {q.explanation}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    onClick={resetQuiz}
                    className="mt-2 text-sm font-bold text-emerald-600 dark:text-emerald-455 bg-emerald-500/10 border border-emerald-500/20 px-5 py-2.5 rounded-xl hover:bg-emerald-500/20 transition-all cursor-pointer shadow-sm"
                  >
                    נסו שוב 🔄
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  }
}
