"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  BookOpen,
  ArrowRight,
  Sun,
  Moon,
  Search,
  Compass,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  HelpCircle,
  Award,
  Sparkles,
  RefreshCw,
  Info,
  Clock
} from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import { PRE_GENERATED_UNSEENS, UnseenData } from "@/lib/unseen-data";

// Helper function to calculate Levenshtein distance for spelling tolerance
const getLevenshteinDistance = (a: string, b: string): number => {
  const matrix = Array.from({ length: a.length + 1 }, () =>
    Array(b.length + 1).fill(0)
  );

  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,    // Deletion
          matrix[i][j - 1] + 1,    // Insertion
          matrix[i - 1][j - 1] + 1 // Substitution
        );
      }
    }
  }

  return matrix[a.length][b.length];
};

export default function UnseenPracticePage() {
  const router = useRouter();
  const { user } = useAuth();

  // Theme states
  const [comfortMode, setComfortMode] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  // Difficulty & Custom Generation States
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Easy");
  const [customTopic, setCustomTopic] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Active Unseen Passages States
  const [unseen, setUnseen] = useState<UnseenData>(PRE_GENERATED_UNSEENS.Easy);

  // Game Progress States
  const [currentStep, setCurrentStep] = useState<"intro" | "rules" | "game" | "completed">("intro");
  const [gameSubStep, setGameSubStep] = useState<number>(0); // 0, 1, 2 = paragraph questions; 3 = global question
  
  // Quiz Interaction States
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [openAnswerText, setOpenAnswerText] = useState("");
  const [selfGraded, setSelfGraded] = useState<boolean | null>(null);
  
  // Game Stats
  const [score, setScore] = useState(100);
  const [totalQuestionsAnswered, setTotalQuestionsAnswered] = useState(0);
  const [correctOnFirstTry, setCorrectOnFirstTry] = useState(0);
  const [detectiveName, setDetectiveName] = useState("");

  // Load theme preference from localStorage
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("teaching-site-comfort-mode");
    if (savedTheme === "light" || savedTheme === "dark") {
      setComfortMode(savedTheme);
    }
    if (user?.displayName) {
      setDetectiveName(user.displayName);
    }
  }, [user]);

  const toggleTheme = () => {
    const nextTheme = comfortMode === "dark" ? "light" : "dark";
    setComfortMode(nextTheme);
    localStorage.setItem("teaching-site-comfort-mode", nextTheme);
  };

  const isLight = comfortMode === "light";

  // Dynamic Theme Styling
  const bgTheme = isLight ? "bg-[#f1f5f9]" : "bg-[#080c18]";
  const textTitle = isLight ? "text-zinc-900" : "text-white";
  const textBody = isLight ? "text-zinc-700" : "text-[#e8edf8]";
  const textMuted = isLight ? "text-zinc-500" : "text-slate-400";
  const cardStyle = isLight ? "light-card text-zinc-800" : "glass-card text-[#e8edf8]";
  const borderStyle = isLight ? "border-zinc-200" : "border-border-custom";
  const inputStyle = isLight 
    ? "bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-400 focus:border-teal-500" 
    : "bg-[#0d1222]/80 border-border-custom text-white placeholder:text-zinc-700 focus:border-cyan-500/50";

  // Trigger Gemini AI generation endpoint
  const handleAiGeneration = async () => {
    setAiGenerating(true);
    setAiError(null);
    try {
      const res = await fetch("/api/generate-unseen", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          difficulty,
          topic: customTopic
        })
      });

      const result = await res.json();
      if (res.ok && result.success && result.data) {
        setUnseen(result.data);
        setCurrentStep("rules");
      } else {
        // Handle failure by falling back to pre-generated data and informing the user
        const fallback = PRE_GENERATED_UNSEENS[difficulty];
        setUnseen(fallback);
        console.error("AI Generation failed, using local fallback:", result);
        
        if (result.reason === "missing_api_key") {
          setAiError("מפתח ה-API של Gemini אינו מוגדר בשרת. השתמשנו בקטע קריאה מוכן מראש התואם לרמה שבחרתם!");
        } else {
          setAiError("לא הצלחנו ליצור קטע קריאה חדש כרגע. השתמשנו בקטע קריאה מוכן מראש ברמה שבחרתם!");
        }
        
        // Show fallback after 1.5 seconds
        setTimeout(() => {
          setCurrentStep("rules");
          setAiGenerating(false);
        }, 2000);
        return;
      }
    } catch (error) {
      console.error("Error generating AI text:", error);
      const fallback = PRE_GENERATED_UNSEENS[difficulty];
      setUnseen(fallback);
      setAiError("אירעה שגיאה בחיבור לשרת. טוען קטע קריאה מוכן מראש...");
      
      setTimeout(() => {
        setCurrentStep("rules");
        setAiGenerating(false);
      }, 2000);
      return;
    }
    setAiGenerating(false);
  };

  const startWithLocalPassage = () => {
    setUnseen(PRE_GENERATED_UNSEENS[difficulty]);
    setAiError(null);
    setCurrentStep("rules");
  };

  const startQuiz = () => {
    setGameSubStep(0);
    setSelectedOption(null);
    setShowFeedback(false);
    setIsCorrect(false);
    setOpenAnswerText("");
    setSelfGraded(null);
    setScore(100);
    setAttempts(0);
    setTotalQuestionsAnswered(0);
    setCorrectOnFirstTry(0);
    setCurrentStep("game");
  };

  const handleOptionClick = (optionIdx: number) => {
    if (showFeedback) return;
    setSelectedOption(optionIdx);
    setAttempts((prev) => prev + 1);

    const activeQuestion = gameSubStep < 7 ? unseen.questions[gameSubStep] : unseen.globalQuestion;
    const isCorrectChoice = optionIdx === activeQuestion.answerIndex;

    setIsCorrect(isCorrectChoice);
    setShowFeedback(true);

    if (isCorrectChoice) {
      if (attempts === 0) {
        setCorrectOnFirstTry((prev) => prev + 1);
        // Play success sound / confetti burst for correct answers
        confetti({
          particleCount: 30,
          spread: 40,
          origin: { y: 0.8 }
        });
      }
      setTotalQuestionsAnswered((prev) => prev + 1);
    } else {
      // Deduct score for incorrect tries
      setScore((prev) => Math.max(prev - 15, 20));
    }
  };

  const handleCopyCheck = () => {
    if (showFeedback) return;
    if (!openAnswerText.trim()) return;

    const activeQuestion = unseen.questions[gameSubStep];
    const clean = (str: string) => 
      str.toLowerCase()
         .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()'"?“”‘’]/g, "")
         .replace(/\s+/g, " ")
         .trim();

    const userClean = clean(openAnswerText);
    const targetClean = clean(activeQuestion.targetSentence || "");

    // 1. Check for exact match
    let isCorrectChoice = userClean === targetClean;

    // 2. Check for partial matching and typos if not exact
    if (!isCorrectChoice && targetClean) {
      // Check if user answer is a substring of the target, and contains a minimum amount of words/characters
      const isSubstring = targetClean.includes(userClean) || userClean.includes(targetClean);
      const userWordsCount = userClean.split(" ").filter(Boolean).length;
      const targetWordsCount = targetClean.split(" ").filter(Boolean).length;

      // Allow partial matches if they typed at least 3 words and at least 35% of the target words
      const hasMinLength = userClean.length >= Math.min(10, targetClean.length * 0.3);
      const hasMinWords = userWordsCount >= Math.min(3, Math.ceil(targetWordsCount * 0.35));

      if (isSubstring && hasMinLength && hasMinWords) {
        isCorrectChoice = true;
      } else {
        // Also check spelling tolerance (Levenshtein distance <= 15% of length, min 2 edits)
        const dist = getLevenshteinDistance(userClean, targetClean);
        const maxAllowedDist = Math.max(2, Math.floor(targetClean.length * 0.15));
        if (dist <= maxAllowedDist) {
          isCorrectChoice = true;
        }
      }
    }

    setIsCorrect(isCorrectChoice);
    setAttempts((prev) => prev + 1);
    setShowFeedback(true);

    if (isCorrectChoice) {
      if (attempts === 0) {
        setCorrectOnFirstTry((prev) => prev + 1);
        confetti({
          particleCount: 30,
          spread: 40,
          origin: { y: 0.8 }
        });
      }
      setTotalQuestionsAnswered((prev) => prev + 1);
    } else {
      setScore((prev) => Math.max(prev - 15, 20));
    }
  };

  const handleOpenCheck = () => {
    if (showFeedback) return;
    if (!openAnswerText.trim()) return;

    setAttempts((prev) => prev + 1);
    setShowFeedback(true);
    // Open questions use self-grading, but we initialize correctness status
    setIsCorrect(false);
  };

  const handleSelfGrade = (correct: boolean) => {
    setSelfGraded(correct);
    setIsCorrect(correct);

    if (correct) {
      if (attempts === 1) { // check if first try
        setCorrectOnFirstTry((prev) => prev + 1);
        confetti({
          particleCount: 30,
          spread: 40,
          origin: { y: 0.8 }
        });
      }
      setTotalQuestionsAnswered((prev) => prev + 1);
    } else {
      setScore((prev) => Math.max(prev - 15, 20));
    }
  };

  const handleNextStep = () => {
    setSelectedOption(null);
    setShowFeedback(false);
    setIsCorrect(false);
    setOpenAnswerText("");
    setSelfGraded(null);
    setAttempts(0);

    if (gameSubStep < 7) {
      setGameSubStep((prev) => prev + 1);
    } else {
      // Finished all questions
      setCurrentStep("completed");
      // Fire big confetti celebration
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };

  if (!mounted) return null;

  return (
    <div className={`relative min-h-screen ${bgTheme} ${textBody} flex flex-col justify-between overflow-hidden transition-colors duration-300`}>
      {/* Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-teal-500/5 via-transparent to-transparent blur-3xl pointer-events-none rounded-full" />

      {/* Top Navbar */}
      <header className={`w-full border-b ${borderStyle} py-4 px-6 relative z-10 transition-colors`}>
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link
            href="/english"
            className={`inline-flex items-center gap-1 text-xs font-bold ${textMuted} hover:text-teal-500 transition-colors`}
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>חזרה ללימודי אנגלית</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl border ${borderStyle} ${
                isLight ? "bg-white hover:bg-zinc-100" : "bg-surface hover:bg-surface-hover"
              } transition-colors cursor-pointer`}
              title="שינוי מצב קריאה"
            >
              {isLight ? <Moon className="w-4 h-4 text-zinc-700" /> : <Sun className="w-4 h-4 text-yellow-400" />}
            </button>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-500/10 border border-teal-500/20 rounded-full text-xs font-bold text-teal-500">
              <Compass className="w-3.5 h-3.5 animate-spin-slow" />
              <span>בלשי האנסין</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-10 flex flex-col justify-center z-10 relative">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: INTRO SCREEN */}
          {currentStep === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8 max-w-2xl mx-auto text-center"
            >
              <div className="space-y-3">
                <h1 className={`text-4xl md:text-5xl font-black ${textTitle} tracking-tight leading-tight`}>
                  מלכודת האנסין והשיטה הסודית
                </h1>
                <p className={`${textMuted} text-base max-w-lg mx-auto`}>
                  האם אתם קוראים את כל הטקסט באנגלית לפני שאתם מתחילים לענות? **זו טעות קריטית!** למדו כיצד לפתור אנסין כמו בלש אמיתי.
                </p>
              </div>

              {/* Interactive Demo Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-right">
                
                {/* The Wrong Way */}
                <div className={`p-6 rounded-2xl border border-rose-500/20 bg-rose-500/5 space-y-4`}>
                  <div className="flex items-center gap-2 text-rose-500 font-bold">
                    <AlertTriangle className="w-5 h-5 shrink-0" />
                    <h3 className="text-lg">הדרך הרגילה (המלכודת)</h3>
                  </div>
                  <ul className={`text-xs space-y-2.5 ${textBody}`}>
                    <li className="flex items-start gap-1.5">
                      <span className="text-rose-500 font-bold">✗</span>
                      <span>קוראים 400 מילים באנגלית ישר על ההתחלה.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-rose-500 font-bold">✗</span>
                      <span>מתעייפים, מאבדים ריכוז ושוכחים הכל עד שמגיעים לשאלות.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-rose-500 font-bold">✗</span>
                      <span>מבזבזים 10 דקות יקרות רק על קריאה ראשונית.</span>
                    </li>
                  </ul>
                  <div className="pt-2 flex items-center gap-2 text-[10px] text-rose-400 font-semibold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>זמן מבוזבז: גבוה מאוד | רמת עייפות: מקסימלית</span>
                  </div>
                </div>

                {/* The Detective Way */}
                <div className={`p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 space-y-4`}>
                  <div className="flex items-center gap-2 text-emerald-500 font-bold">
                    <Sparkles className="w-5 h-5 shrink-0" />
                    <h3 className="text-lg">שיטת הבלש (המנצחת)</h3>
                  </div>
                  <ul className={`text-xs space-y-2.5 ${textBody}`}>
                    <li className="flex items-start gap-1.5">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>קוראים את שאלה 1 בלבד ומזהים מילות מפתח.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>ניגשים רק לפסקה הראשונה ודגים את התשובה תוך דקה.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>השאלות תמיד מסודרות לפי סדר הטקסט - מתקדמים צעד אחר צעד!</span>
                    </li>
                  </ul>
                  <div className="pt-2 flex items-center gap-2 text-[10px] text-emerald-400 font-semibold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>זמן מבוזבז: אפס | יעילות פתרון: 100%</span>
                  </div>
                </div>

              </div>

              {/* Game Setup Box */}
              <div className={`p-6 md:p-8 rounded-3xl border ${borderStyle} ${cardStyle} text-right space-y-6 max-w-xl mx-auto shadow-xl relative overflow-hidden`}>
                <div className="space-y-1.5 relative z-10">
                  <h3 className="text-xl font-extrabold">התחלת משימת בלשות</h3>
                  <p className={`text-xs ${textMuted}`}>בחרו רמת קושי והתחילו לפתור נכון</p>
                </div>

                {/* Detective Name input */}
                <div className="space-y-1.5 z-10 relative">
                  <label className="text-xs font-bold">שם הבלש/ת:</label>
                  <input
                    type="text"
                    placeholder="הכניסו את שמכם..."
                    value={detectiveName}
                    onChange={(e) => setDetectiveName(e.target.value)}
                    className={`w-full h-10 px-4 rounded-xl text-sm outline-none transition-colors border ${inputStyle}`}
                  />
                </div>

                {/* Difficulty Selector */}
                <div className="space-y-2 z-10 relative">
                  <label className="text-xs font-bold block">רמת קושי:</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(["Easy", "Medium", "Hard"] as const).map((lvl) => {
                      const isActive = difficulty === lvl;
                      let activeColorClass = "";
                      if (isActive) {
                        if (lvl === "Easy") activeColorClass = "bg-emerald-500/10 text-emerald-400 border-emerald-500/40";
                        else if (lvl === "Medium") activeColorClass = "bg-amber-500/10 text-amber-400 border-amber-500/40";
                        else activeColorClass = "bg-rose-500/10 text-rose-400 border-rose-500/40";
                      }
                      return (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setDifficulty(lvl)}
                          className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            isActive 
                              ? activeColorClass 
                              : `border-zinc-700/30 ${isLight ? "bg-white hover:bg-zinc-100 text-zinc-700" : "bg-[#080c18]/80 text-[#e8edf8] hover:text-white"}`
                          }`}
                        >
                          {lvl === "Easy" ? "רמה 1" : lvl === "Medium" ? "רמה 2" : "רמה 3"}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* AI Prompt Input */}
                <div className="space-y-2 border-t pt-4 border-dashed border-zinc-700/20 z-10 relative">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-teal-400" />
                    <label className="text-xs font-bold">תרצו ליצור טקסט חדש בעזרת בינה מלאכותית?</label>
                  </div>
                  <input
                    type="text"
                    placeholder="נושא מבוקש (למשל: Space exploration, Animals, Music, Science)..."
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    className={`w-full h-10 px-4 rounded-xl text-xs outline-none transition-colors border ${inputStyle}`}
                  />
                  <p className="text-[10px] text-zinc-500 leading-normal">
                    * אם תבחרו ליצור עם בינה מלאכותית, המערכת תפעיל את מודל Gemini ליצירת טקסט ושאלות ייחודיים במיוחד עבורכם.
                  </p>
                </div>

                {/* Submit Action */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={handleAiGeneration}
                    disabled={aiGenerating}
                    className="flex-1 h-11 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md"
                  >
                    {aiGenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>יוצר קטע קריאה עם Gemini...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>צור קטע קריאה חדש עם AI</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={startWithLocalPassage}
                    disabled={aiGenerating}
                    className={`px-5 h-11 rounded-xl border font-bold text-xs cursor-pointer transition-all ${
                      isLight 
                        ? "border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-700" 
                        : "border-border-custom bg-surface hover:bg-surface-hover text-white"
                    }`}
                  >
                    התחל עם קטע מוכן
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: THE DETECTIVE RULES */}
          {currentStep === "rules" && (
            <motion.div
              key="rules"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="max-w-2xl mx-auto space-y-8 text-right"
            >
              <div className="text-center space-y-2">
                <Award className="w-10 h-10 text-teal-400 mx-auto" />
                <h2 className={`text-3xl font-black ${textTitle}`}>יומן חוקי הבלש</h2>
                <p className={`${textMuted} text-xs`}>קראו בעיון את הכללים שיחסכו לכם המון זמן ומאמץ במבחנים באנגלית</p>
              </div>

              {aiError && (
                <div className="text-xs text-amber-500 font-semibold bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl flex items-start gap-2">
                  <Info className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{aiError}</span>
                </div>
              )}

              {/* Rules Stack */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Rule 1 */}
                <div className={`p-5 rounded-2xl border ${borderStyle} ${cardStyle} space-y-2`}>
                  <div className="flex items-center gap-2 text-teal-500 font-bold">
                    <span className="w-6 h-6 bg-teal-500/10 rounded-full flex items-center justify-center text-xs text-teal-400">1</span>
                    <h4 className="text-sm">השאלות קודם כל!</h4>
                  </div>
                  <p className={`text-xs leading-relaxed ${textMuted}`}>
                    אל תסתכלו בכלל על הטקסט! קראו את השאלה הראשונה קודם, תבינו מה מחפשים, ורק אז גשו לקטע.
                  </p>
                </div>

                {/* Rule 2 */}
                <div className={`p-5 rounded-2xl border ${borderStyle} ${cardStyle} space-y-2`}>
                  <div className="flex items-center gap-2 text-teal-500 font-bold">
                    <span className="w-6 h-6 bg-teal-500/10 rounded-full flex items-center justify-center text-xs text-teal-400">2</span>
                    <h4 className="text-sm">חיפוש מילות מפתח</h4>
                  </div>
                  <p className={`text-xs leading-relaxed ${textMuted}`}>
                    סמנו בשאלה מילים בולטות: שמות פרטיים (עם אות גדולה), מספרים, שנים, או פעלים ייחודיים שיבלטו לעין בטקסט.
                  </p>
                </div>

                {/* Rule 3 */}
                <div className={`p-5 rounded-2xl border ${borderStyle} ${cardStyle} space-y-2`}>
                  <div className="flex items-center gap-2 text-teal-500 font-bold">
                    <span className="w-6 h-6 bg-teal-500/10 rounded-full flex items-center justify-center text-xs text-teal-400">3</span>
                    <h4 className="text-sm">סדר כרונולוגי ברור</h4>
                  </div>
                  <p className={`text-xs leading-relaxed ${textMuted}`}>
                    השאלות תמיד מסודרות לפי סדר הטקסט. שאלה 1 תהיה תמיד בפסקה 1, שאלה 2 בפסקה 2, וכך הלאה.
                  </p>
                </div>

                {/* Rule 4 */}
                <div className={`p-5 rounded-2xl border ${borderStyle} ${cardStyle} space-y-2`}>
                  <div className="flex items-center gap-2 text-teal-500 font-bold">
                    <span className="w-6 h-6 bg-teal-500/10 rounded-full flex items-center justify-center text-xs text-teal-400">4</span>
                    <h4 className="text-sm">קריאת רמזים בסוגריים</h4>
                  </div>
                  <p className={`text-xs leading-relaxed ${textMuted}`}>
                    שימו לב למכוונים כמו `(lines 4-7)` או `(paragraph 2)`. הם מצביעים בדיוק על האזור שבו נמצאת התשובה!
                  </p>
                </div>

              </div>

              {/* Start game trigger */}
              <div className="text-center pt-4">
                <button
                  onClick={startQuiz}
                  className="px-8 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-zinc-950 font-bold text-sm cursor-pointer shadow-md transition-all inline-flex items-center gap-2"
                >
                  <span>התחל במשימת הבלש</span>
                  <ArrowRight className="w-4 h-4 rotate-180" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: THE GAME/QUIZ */}
          {currentStep === "game" && (
            <motion.div
              key="game"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-right items-stretch"
            >
              
              {/* Left Column: Questions, Answers & Instructions */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                
                {/* Score & Progress header */}
                <div className={`p-4 rounded-2xl border ${borderStyle} ${cardStyle} flex items-center justify-between text-xs`}>
                  <div className="flex items-center gap-1">
                    <span className="font-extrabold text-teal-500">{score}</span>
                    <span className={textMuted}>נקודות מיומנות</span>
                  </div>
                  <div className={textMuted}>
                    שאלה <span className="font-bold text-white">{gameSubStep + 1}</span> מתוך 8
                  </div>
                </div>

                {/* The active Question */}
                <div className={`p-6 rounded-2xl border ${borderStyle} ${cardStyle} space-y-6 shadow-lg flex-1 flex flex-col justify-between`}>
                  {(() => {
                    const activeQuestion = gameSubStep < 7 
                      ? unseen.questions[gameSubStep] 
                      : { ...unseen.globalQuestion, type: "mcq" as const, linesHint: "" };
                    const qType = activeQuestion.type;

                    return (
                      <div className="space-y-6 flex-1 flex flex-col justify-between">
                        <div className="space-y-4">
                          {/* Header: Clue category */}
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-full border border-teal-500/20">
                              {gameSubStep < 7 ? `רמז לפסקה ${(activeQuestion as any).paragraphIndex !== undefined ? (activeQuestion as any).paragraphIndex + 1 : ""}` : "רמז מסכם"}
                            </span>
                            {gameSubStep < 7 && (
                              <span className="text-[10px] text-zinc-500 font-bold flex items-center gap-1">
                                <Search className="w-3.5 h-3.5" />
                                <span>מיקום: {activeQuestion.linesHint}</span>
                              </span>
                            )}
                          </div>

                          {/* Question text */}
                          <h3 className={`text-lg md:text-xl font-bold ${textTitle} leading-relaxed`} dir="ltr">
                            {activeQuestion.question}
                          </h3>

                          {/* Options / Inputs rendering based on type */}
                          {qType === "mcq" && (
                            <div className="space-y-2.5 pt-2">
                              {(activeQuestion.options || []).map((opt, idx) => {
                                const isSelected = selectedOption === idx;
                                const isOptCorrect = idx === activeQuestion.answerIndex;
                                
                                let optStyle = isLight
                                  ? "border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-800"
                                  : "border-border-custom bg-[#0d1222]/50 hover:bg-surface-hover text-zinc-300";

                                if (showFeedback) {
                                  if (isOptCorrect) {
                                    optStyle = "border-emerald-500 bg-emerald-500/10 text-emerald-400 font-bold";
                                  } else if (isSelected) {
                                    optStyle = "border-rose-500 bg-rose-500/10 text-rose-400";
                                  } else {
                                    optStyle = "opacity-40 border-zinc-800";
                                  }
                                }

                                return (
                                  <button
                                    key={idx}
                                    onClick={() => handleOptionClick(idx)}
                                    disabled={showFeedback}
                                    className={`w-full py-3 px-4 rounded-xl border text-right text-xs transition-all flex items-center justify-between cursor-pointer ${optStyle}`}
                                    dir="ltr"
                                  >
                                    <span className="flex-1 text-left">{opt}</span>
                                    <span className="font-bold opacity-30 select-none ml-2">
                                      {idx === 0 ? "A" : idx === 1 ? "B" : idx === 2 ? "C" : "D"}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          )}

                          {qType === "copy" && (
                            <div className="space-y-4 pt-2">
                              <div className="space-y-2">
                                <p className={`text-xs font-bold text-teal-400`}>העתיקו את המשפט במדויק מתוך הפסקה המודגשת מימין:</p>
                                <input
                                  type="text"
                                  placeholder="הקלידו או העתיקו והדביקו כאן את המשפט..."
                                  value={openAnswerText}
                                  onChange={(e) => setOpenAnswerText(e.target.value)}
                                  disabled={showFeedback}
                                  className={`w-full h-11 px-4 rounded-xl text-xs outline-none transition-colors border ${inputStyle}`}
                                  dir="ltr"
                                />
                              </div>
                              {!showFeedback && (
                                <button
                                  onClick={handleCopyCheck}
                                  disabled={!openAnswerText.trim()}
                                  className="w-full h-10 rounded-xl bg-teal-600 hover:bg-teal-500 text-zinc-950 font-bold text-xs cursor-pointer transition-colors"
                                >
                                  בדקו את העתקתכם
                                </button>
                              )}
                            </div>
                          )}

                          {qType === "open" && (
                            <div className="space-y-4 pt-2">
                              <div className="space-y-2">
                                <p className={`text-xs font-bold text-teal-400`}>כתבו תשובה קצרה באנגלית לשאלה:</p>
                                <textarea
                                  placeholder="כתבו את תשובתכם באנגלית כאן..."
                                  value={openAnswerText}
                                  onChange={(e) => setOpenAnswerText(e.target.value)}
                                  disabled={showFeedback}
                                  rows={3}
                                  className={`w-full p-3 rounded-xl text-xs outline-none transition-colors border resize-none ${inputStyle}`}
                                  dir="ltr"
                                />
                              </div>
                              {!showFeedback && (
                                <button
                                  onClick={handleOpenCheck}
                                  disabled={!openAnswerText.trim()}
                                  className="w-full h-10 rounded-xl bg-teal-600 hover:bg-teal-500 text-zinc-950 font-bold text-xs cursor-pointer transition-colors"
                                >
                                  בדקו את תשובתכם
                                </button>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Feedback Explanation */}
                        <AnimatePresence>
                          {showFeedback && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              className="space-y-4 pt-4 border-t border-dashed border-zinc-700/20"
                            >
                              {qType === "open" && selfGraded === null ? (
                                /* Open answer self-grading panel */
                                <div className="space-y-4">
                                  {(() => {
                                    const kwList = activeQuestion.keywords || [];
                                    const userWords = openAnswerText.toLowerCase();
                                    const matchedKws = kwList.filter(kw => userWords.includes(kw.toLowerCase()));
                                    if (matchedKws.length > 0) {
                                      return (
                                        <div className="text-[11px] text-emerald-500 font-bold bg-emerald-500/5 p-2 rounded-lg border border-emerald-500/10">
                                          מצוין! שילבתם מילים חשובות בתשובה: {matchedKws.join(", ")}
                                        </div>
                                      );
                                    }
                                    return null;
                                  })()}
                                  
                                  <div className={`space-y-1.5 p-3.5 rounded-xl border ${borderStyle} ${
                                    isLight ? "bg-zinc-100" : "bg-[#0d1222]/30"
                                  }`}>
                                    <h5 className="text-xs font-bold text-teal-400">תשובה לדוגמה (באנגלית):</h5>
                                    <p className={`text-xs font-medium italic ${isLight ? "text-zinc-800" : "text-zinc-200"}`} dir="ltr">
                                      {activeQuestion.suggestedAnswer}
                                    </p>
                                  </div>
                                  
                                  <div className="space-y-1.5">
                                    <h5 className="text-xs font-bold text-teal-400">הסבר בעברית:</h5>
                                    <p className={`text-xs leading-relaxed ${textMuted}`}>
                                      {activeQuestion.explanation}
                                    </p>
                                  </div>

                                  <div className="space-y-3 pt-3 border-t border-dashed border-zinc-700/20">
                                    <p className={`text-xs font-bold ${isLight ? "text-zinc-800" : "text-white"}`}>
                                      האם תשובתכם נכונה בהשוואה לתשובה המוצעת?
                                    </p>
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => handleSelfGrade(true)}
                                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold text-xs rounded-xl transition-colors cursor-pointer shadow-sm"
                                      >
                                        כן, עניתי נכון!
                                      </button>
                                      <button
                                        onClick={() => handleSelfGrade(false)}
                                        className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-zinc-950 font-bold text-xs rounded-xl transition-colors cursor-pointer shadow-sm"
                                      >
                                        לא, טעיתי
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                /* Standard check feedback (MCQ, Copy, or completed Open) */
                                <div className="space-y-4">
                                  <div className="flex items-start gap-2.5">
                                    {isCorrect ? (
                                      <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                    ) : (
                                      <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                                    )}
                                    <div className="space-y-1 flex-1">
                                      <h4 className={`text-xs font-bold ${isCorrect ? "text-emerald-400" : "text-rose-400"}`}>
                                        {isCorrect ? "תשובה נכונה! כל הכבוד!" : "טעות. נסו שוב כדי ללמוד!"}
                                      </h4>
                                      <p className={`text-xs leading-relaxed ${textMuted}`}>
                                        {activeQuestion.explanation}
                                      </p>
                                    </div>
                                  </div>

                                  {/* Continue trigger */}
                                  <div className="text-left">
                                    <button
                                      onClick={isCorrect ? handleNextStep : () => setShowFeedback(false)}
                                      className={`px-5 py-2 rounded-xl text-zinc-950 font-bold text-xs transition-all cursor-pointer ${
                                        isCorrect 
                                          ? "bg-teal-500 hover:bg-teal-400" 
                                          : isLight ? "bg-zinc-200 hover:bg-zinc-300 text-zinc-700" : "bg-white hover:bg-zinc-100"
                                      }`}
                                    >
                                      {isCorrect ? (gameSubStep < 7 ? "המשך לרמז הבא ←" : "סיום המשימה וקבלת תעודה ←") : "נסו שוב"}
                                    </button>
                                  </div>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Right Column: Reading Passages */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                
                {/* Passage card */}
                <div className={`p-6 md:p-8 rounded-2xl border ${borderStyle} ${cardStyle} shadow-lg space-y-6 flex-1 flex flex-col justify-between`}>
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b pb-4 border-dashed border-zinc-700/20">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-teal-400" />
                        <h2 className={`text-xl font-bold ${textTitle}`}>{unseen.title}</h2>
                      </div>
                      <span className={`text-[10px] ${textMuted}`}>
                        רמה: <span className="font-bold text-teal-500">{unseen.difficulty === "Easy" ? "1 - מתחילים" : unseen.difficulty === "Medium" ? "2 - בינוני" : "3 - מתקדמים"}</span>
                      </span>
                    </div>

                    {/* Paragraph List with active highlight */}
                    <div className="space-y-6" dir="ltr">
                      {unseen.paragraphs.map((para, idx) => {
                        const isParagraphActive = gameSubStep === 7 
                          ? true 
                          : (gameSubStep < 7 && unseen.questions[gameSubStep]?.paragraphIndex === idx);
                        const blurClass = isParagraphActive ? "border-teal-500/30 scale-[1.01]" : "blur-[2px] opacity-25 scale-95 pointer-events-none";

                        // Determine line numbering dynamically from questions
                        const maxLineNum = (() => {
                          let max = 15;
                          if (unseen.questions && Array.isArray(unseen.questions)) {
                            unseen.questions.forEach(q => {
                              if (q.linesHint) {
                                const matches = q.linesHint.match(/\d+/g);
                                if (matches) {
                                  matches.forEach(numStr => {
                                    const num = parseInt(numStr, 10);
                                    if (num > max) max = num;
                                  });
                                }
                              }
                            });
                          }
                          return max;
                        })();
                        const linesPerParagraph = Math.ceil(maxLineNum / 3) || 5;
                        const startLineNum = idx * linesPerParagraph + 1;

                        const words = para ? para.trim().split(/\s+/) : [];
                        const totalWords = words.length;
                        const wordsPerLine = totalWords > 0 ? Math.ceil(totalWords / linesPerParagraph) : 0;
                        const paragraphLines: string[] = [];
                        let curIdx = 0;
                        
                        for (let i = 0; i < linesPerParagraph; i++) {
                          if (i === linesPerParagraph - 1) {
                            paragraphLines.push(words.slice(curIdx).join(" "));
                          } else {
                            paragraphLines.push(words.slice(curIdx, curIdx + wordsPerLine).join(" "));
                            curIdx += wordsPerLine;
                          }
                        }

                        return (
                          <div
                            key={idx}
                            className={`p-4 rounded-xl border ${borderStyle} transition-all duration-300 ${blurClass} relative`}
                          >
                            <span className="absolute -top-3 left-4 text-[9px] font-black bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/20 text-teal-400 select-none">
                              Paragraph {idx + 1}
                            </span>
                            
                            <div className="space-y-2 pt-2">
                              {paragraphLines.map((lineText, lineIdx) => {
                                const lineNum = startLineNum + lineIdx;
                                const showLineNum = lineNum === 1 || lineNum % 5 === 0;

                                return (
                                  <div key={lineIdx} className="flex items-start gap-3">
                                    <div className="w-6 flex shrink-0 justify-end select-none text-[11px] font-black font-mono pt-1 text-teal-500/70" style={{ minWidth: "1.5rem" }}>
                                      {showLineNum ? lineNum : ""}
                                    </div>
                                    <p className="flex-1 text-sm md:text-base leading-relaxed text-zinc-100 font-medium select-text text-left" style={{ color: isLight ? '#27272a' : '#f4f4f5' }}>
                                      {lineText}
                                    </p>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Detective Dictionary (מילון עזר) */}
                  <div className={`pt-4 border-t border-dashed border-zinc-700/20 space-y-2`}>
                    <h4 className="text-xs font-bold text-teal-400 flex items-center gap-1.5 justify-end">
                      <span>מילון עזר לבלש</span>
                      <Info className="w-4.5 h-4.5" />
                    </h4>
                    <div className="flex flex-wrap gap-2 justify-end">
                      {unseen.vocabularyHints.map((hint, idx) => (
                        <div
                          key={idx}
                          className={`text-xs px-2.5 py-1 rounded-lg border ${borderStyle} ${
                            isLight ? "bg-zinc-50 hover:bg-zinc-100" : "bg-[#0d1222]/50 hover:bg-surface-hover"
                          } transition-all flex items-center gap-1.5`}
                        >
                          <span className={`font-bold ${isLight ? "text-zinc-800" : "text-white"}`} dir="ltr">{hint.word}</span>
                          <span className="opacity-40">=</span>
                          <span className={textMuted}>{hint.translation}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

            </motion.div>
          )}

          {/* STEP 4: COMPLETED SCREEN */}
          {currentStep === "completed" && (
            <motion.div
              key="completed"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-xl mx-auto text-center space-y-8"
            >
              {/* Badge Certificate */}
              <div className={`p-8 md:p-10 rounded-3xl border border-teal-500/20 bg-teal-500/5 relative overflow-hidden shadow-2xl space-y-6`}>
                
                {/* Sparkle animations */}
                <div className="absolute top-4 left-4 text-yellow-400 animate-pulse">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="absolute bottom-4 right-4 text-teal-400 animate-pulse">
                  <Sparkles className="w-5 h-5" />
                </div>

                <div className="space-y-2">
                  <Award className="w-20 h-20 text-yellow-500 mx-auto animate-bounce" />
                  <h2 className="text-3xl font-black text-white uppercase tracking-tight">תעודת בלש מוסמך</h2>
                  <p className="text-teal-400 text-xs font-bold uppercase tracking-wider">Unseen Detective Academy</p>
                </div>

                {/* Certificate info */}
                <div className="space-y-4 py-4 border-y border-dashed border-teal-500/20">
                  <p className={`${textBody} text-base`}>
                    תעודה זו מוענקת בזאת לבלש/ת
                  </p>
                  <p className="text-2xl font-black text-white underline decoration-teal-500 decoration-2 underline-offset-4">
                    {detectiveName.trim() || "בלש מוסמך"}
                  </p>
                  <p className={`${textMuted} text-xs leading-relaxed max-w-sm mx-auto`}>
                    על סיום מוצלח של משימת פיצוח קטעי קריאה באנגלית ברמת קושי <span className="font-bold text-teal-400">{unseen.difficulty === "Easy" ? "1 (מתחילים)" : unseen.difficulty === "Medium" ? "2 (בינוני)" : "3 (מתקדמים)"}</span> באמצעות השיטה הסודית ופירוק הטקסט לפי פסקאות.
                  </p>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 divide-x divide-teal-500/20 text-center">
                  <div className="p-2">
                    <p className="text-[10px] text-slate-400 uppercase font-bold">ציון מיומנות</p>
                    <p className="text-3xl font-extrabold text-white mt-1">{score}</p>
                  </div>
                  <div className="p-2">
                    <p className="text-[10px] text-slate-400 uppercase font-bold">תשובות נכונות (ניסיון 1)</p>
                    <p className="text-3xl font-extrabold text-teal-400 mt-1">{correctOnFirstTry} / 8</p>
                  </div>
                </div>

              </div>

              {/* Strategy Reminder Box */}
              <div className={`p-5 rounded-2xl border ${borderStyle} ${cardStyle} text-right space-y-3`}>
                <h4 className="text-sm font-bold text-teal-400 flex items-center gap-1.5 justify-end">
                  <span>זכרו את השיטה לכל אנסין עתידי:</span>
                  <CheckCircle className="w-4 h-4" />
                </h4>
                <p className={`text-xs leading-relaxed ${textMuted}`}>
                  במבחן הבא שלכם באנגלית, אל תקראו את כל האנסין. גשו לשאלה 1, חפשו מילות מפתח, ופתרו פסקה-פסקה. תחסכו 50% מהזמן ותשמרו על ריכוז שיא!
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => setCurrentStep("intro")}
                  className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-zinc-950 font-bold text-xs transition-all cursor-pointer shadow-md"
                >
                  שחק שוב / שנה רמה
                </button>
                <button
                  onClick={() => router.push("/english")}
                  className={`px-6 py-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                    isLight 
                      ? "border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-700" 
                      : "border-border-custom bg-surface hover:bg-surface-hover text-white"
                  }`}
                >
                  חזרה לאזור האנגלית
                </button>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className={`w-full text-center py-6 border-t ${borderStyle} text-xs ${textMuted} relative z-10 bg-surface/30 shrink-0 transition-colors`}>
        <span>© {new Date().getFullYear()} ניר עוז-ארי — בלשי האנסין באנגלית</span>
      </footer>
    </div>
  );
}
