"use client";

import React, { useState } from "react";
import { Award, CheckCircle2, XCircle, ArrowLeft, RotateCcw, HelpCircle, Compass, ShieldAlert, Activity } from "lucide-react";

interface Question {
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  icon: React.ReactNode;
}

export default function EarthExplorerWidget() {
  const [gameState, setGameState] = useState<"welcome" | "quiz" | "score">("welcome");
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  const QUESTIONS: Question[] = [
    {
      text: "מהו גילו המוערך של כדור הארץ?",
      options: [
        "כ-6,000 שנים בלבד",
        "כ-200 מיליון שנים (תקופת הדינוזאורים)",
        "כ-4.5 מיליארד שנים",
        "כ-13.8 מיליארד שנים (גיל היקום)"
      ],
      correctAnswer: 2,
      explanation: "כדור הארץ נוצר לפני כ-4.54 מיליארד שנים, מעט אחרי היווצרות מערכת השמש עצמה. היקום כולו זקן בהרבה - כ-13.8 מיליארד שנים!",
      icon: <Compass className="w-8 h-8 text-amber-500" />
    },
    {
      text: "מהו אחוז המים המתוקים מתוך כלל המים בכדור הארץ?",
      options: [
        "כ-3% בלבד",
        "כ-30%",
        "כ-70%",
        "כ-97%"
      ],
      correctAnswer: 0,
      explanation: "כ-97% מכלל המים בכדור הארץ הם מים מלוחים באוקיינוסים ובימים. רק כ-3% הם מים מתוקים, ורובם הגדול כלוא בקרחונים ובמי תהום עמוקים!",
      icon: <Activity className="w-8 h-8 text-sky-500" />
    },
    {
      text: "איזו שכבה גזית מגינה עלינו מפני קרינת השמש המסוכנת (קרינת UV)?",
      options: [
        "שכבת החמצן",
        "שכבת האוזון",
        "המגנטוספרה",
        "שכבת גזי החממה"
      ],
      correctAnswer: 1,
      explanation: "שכבת האוזון (O3) ממוקמת באטמוספרה ובולעת את רוב קרינת ה-UV המזיקה של השמש, מה שאיפשר לחיים להתפתח ולצאת אל היבשה.",
      icon: <ShieldAlert className="w-8 h-8 text-teal-500" />
    },
    {
      text: "מהו הכוח המרכזי שגורם ליבשות לזוז לאורך מיליוני שנים?",
      options: [
        "זרמי מים תת-קרקעיים חזקים",
        "כוח המשיכה של הירח",
        "זרמי ערבול (קונבקציה) במעטפת כדור הארץ",
        "סיבוב כדור הארץ סביב צירו"
      ],
      correctAnswer: 2,
      explanation: "חום עצום מליבת כדור הארץ מניע זרמי ערבול איטיים במעטפת הסלעית הצמיגית (מתחת לקרום). זרמים אלו גורמים ללוחות הטקטוניים לזוז.",
      icon: <Compass className="w-8 h-8 text-red-500" />
    },
    {
      text: "איזה ממקורות האנרגיה הבאים אינו נחשב למשאב מתחדש?",
      options: [
        "אנרגיה סולארית (שמש)",
        "פחם ואנרגיה פוסילית",
        "אנרגיית רוח",
        "אנרגיית מים זורמים"
      ],
      correctAnswer: 1,
      explanation: "פחם, נפט וגז טבעי נוצרו משאריות אורגניות במשך מאות מיליוני שנים. אנו מנצלים אותם בקצב מהיר פי מיליון מקצב היווצרותם, ולכן הם מתכלים.",
      icon: <HelpCircle className="w-8 h-8 text-emerald-500" />
    },
    {
      text: "כמה זמן לוקח לאור השמש להגיע אלינו לכדור הארץ?",
      options: [
        "פחות משנייה אחת",
        "כ-8 דקות",
        "כ-24 שעות",
        "שנה שלמה"
      ],
      correctAnswer: 1,
      explanation: "האור נע במהירות עצומה של כ-300,000 קילומטרים בשנייה, אך המרחק לשמש הוא כ-150 מיליון קילומטרים, ולכן לוקח לאור כ-8 דקות ו-20 שניות להגיע אלינו!",
      icon: <Compass className="w-8 h-8 text-yellow-500" />
    },
    {
      text: "מהי הטמפרטורה המשוערת בגלעין הפנימי של כדור הארץ?",
      options: [
        "כ-100 מעלות צלזיוס (נקודת רתיחה)",
        "כ-1,500 מעלות צלזיוס (לבה רותחת)",
        "כ-6,000 מעלות צלזיוס (חם כמו פני השמש)",
        "כ-100,000 מעלות צלזיוס"
      ],
      correctAnswer: 2,
      explanation: "הגלעין הפנימי של כדור הארץ מורכב בעיקר מברזל וניקל מוצקים בטמפרטורה מדהימה של כ-6,000 מעלות צלזיוס - חם כמו פני השטח של השמש!",
      icon: <Activity className="w-8 h-8 text-red-500" />
    },
    {
      text: "היכן נמצא המקום היבש ביותר בכדור הארץ (שאינו בקטבים)?",
      options: [
        "מדבר יהודה (ישראל)",
        "מדבר סהרה (אפריקה)",
        "מדבר אטקמה (צ'ילה)",
        "יער האמזונס (ברזיל)"
      ],
      correctAnswer: 2,
      explanation: "מדבר אטקמה בצ'ילה הוא המקום היבש ביותר בעולם. באזורים מסוימים בו לא נמדד גשם מעולם! הוא כה יבש ודומה למאדים שסוכנויות חלל בוחנות בו רכבי מאדים.",
      icon: <ShieldAlert className="w-8 h-8 text-orange-500" />
    },
    {
      text: "כמה מים מתוקים נדרשים בממוצע כדי לייצר המבורגר בקר יחיד?",
      options: [
        "כ-10 ליטרים",
        "כ-100 ליטרים",
        "כ-500 ליטרים",
        "כ-2,400 ליטרים"
      ],
      correctAnswer: 3,
      explanation: "ייצור בשר בקר דורש כמויות עצומות של מים להשקיית המזון שלו, שתייה ועיבוד. המבורגר אחד 'עולה' לכדור הארץ כ-2,400 ליטרים של מים!",
      icon: <Activity className="w-8 h-8 text-blue-500" />
    },
    {
      text: "מאיפה מגיע רוב החמצן שאנו נושמים בכדור הארץ?",
      options: [
        "מיערות הגשם (כמו האמזונס)",
        "מאצות ופיטופלנקטון באוקיינוסים",
        "מהרי געש פעילים",
        "משכבת האוזון"
      ],
      correctAnswer: 1,
      explanation: "למרות שיערות הגשם מכונים 'הריאות של כדור הארץ', רוב החמצן באטמוספרה (בין 50% ל-80%) מיוצר על ידי אצות וצמחים מיקרוסקופיים באוקיינוסים בתהליך פוטוסינתזה!",
      icon: <HelpCircle className="w-8 h-8 text-teal-400" />
    }
  ];

  const handleStart = () => {
    setGameState("quiz");
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsChecked(false);
    setScore(0);
  };

  const handleSelectOption = (optIdx: number) => {
    if (isChecked) return;
    setSelectedOption(optIdx);
  };

  const handleCheck = () => {
    if (selectedOption === null) return;
    setIsChecked(true);
    if (selectedOption === QUESTIONS[currentIdx].correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx === QUESTIONS.length - 1) {
      setGameState("score");
    } else {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsChecked(false);
    }
  };

  const getOptionStyle = (optIdx: number) => {
    if (!isChecked) {
      return selectedOption === optIdx
        ? "border-earth bg-earth/10 text-white font-extrabold"
        : "border-border-custom bg-surface hover:bg-surface-hover/80 text-text-muted";
    }

    const isCorrect = optIdx === QUESTIONS[currentIdx].correctAnswer;
    const isSelected = optIdx === selectedOption;

    if (isCorrect) {
      return "border-emerald-500 bg-emerald-950/20 text-emerald-300 font-extrabold";
    }
    if (isSelected) {
      return "border-red-500 bg-red-950/20 text-red-300 font-extrabold";
    }
    return "border-border-custom bg-surface opacity-45 text-text-muted";
  };

  return (
    <div className="w-full bg-[#090d16] border border-zinc-800/80 rounded-2xl p-6 min-h-[460px] flex flex-col justify-between select-none relative overflow-hidden shadow-2xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(20,184,166,0.1),transparent_70%)] pointer-events-none" />

      {gameState === "welcome" && (
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 py-6 z-10">
          <div className="w-20 h-20 rounded-full bg-earth/10 border-2 border-earth flex items-center justify-center shadow-lg shadow-teal-500/10 animate-bounce">
            <Compass className="w-10 h-10 text-earth" />
          </div>
          <div className="space-y-3 max-w-lg">
            <h3 className="text-2xl md:text-3xl font-black text-white">חידון כדור הארץ הגדול! 🧠</h3>
            <p className="text-base text-text-muted leading-relaxed">
              התכוננו לשנת הלימודים הבאה עלינו לטובה!
              לפניכם 5 שאלות טריוויה מפתיעות ומסקרנות על כוכב הלכת הייחודי שלנו.
              נסו לגלות כמה אתם כבר יודעים!
            </p>
          </div>
          <button
            onClick={handleStart}
            className="px-10 py-4 bg-earth hover:bg-teal-600 text-white font-extrabold rounded-xl transition-all shadow-md shadow-teal-500/20 cursor-pointer animate-pulse-hover text-lg"
          >
            בואו נתחיל לשחק
          </button>
        </div>
      )}

      {gameState === "quiz" && (
        <div className="flex-1 flex flex-col justify-between z-10 space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
            <span className="text-sm text-text-muted font-bold">
              שאלה {currentIdx + 1} מתוך {QUESTIONS.length}
            </span>
            <div className="flex items-center gap-2 text-sm text-amber-400 font-extrabold bg-amber-500/10 border border-amber-500/20 px-3.5 py-1.5 rounded-lg">
              <Award className="w-4.5 h-4.5 shrink-0" />
              <span>ניקוד: {score} נקודות</span>
            </div>
          </div>

          <div className="flex items-start gap-4 text-right py-2">
            <div className="shrink-0 p-3 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center">
              {QUESTIONS[currentIdx].icon}
            </div>
            <div className="space-y-1.5">
              <span className="text-xs text-earth font-black tracking-widest uppercase">אתגר פתיחה</span>
              <h4 className="text-lg md:text-xl lg:text-2xl font-black text-white leading-snug">
                {QUESTIONS[currentIdx].text}
              </h4>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 py-2">
            {QUESTIONS[currentIdx].options.map((opt, oIdx) => (
              <button
                key={oIdx}
                onClick={() => handleSelectOption(oIdx)}
                disabled={isChecked}
                className={`w-full p-4.5 border rounded-xl text-right text-sm md:text-base font-bold transition-all flex items-center gap-3.5 cursor-pointer ${getOptionStyle(
                  oIdx
                )}`}
              >
                <span className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs md:text-sm shrink-0 ${
                  selectedOption === oIdx 
                    ? "bg-earth/20 border-earth text-earth font-black"
                    : "border-zinc-800 text-zinc-500 bg-zinc-950"
                }`}>
                  {String.fromCharCode(65 + oIdx)}
                </span>
                <span className="leading-snug">{opt}</span>
              </button>
            ))}
          </div>

          <div className="min-h-[110px] flex flex-col justify-end">
            {!isChecked ? (
              <button
                onClick={handleCheck}
                disabled={selectedOption === null}
                className="w-full py-3.5 bg-earth hover:bg-teal-600 disabled:bg-zinc-900 disabled:text-zinc-600 disabled:border-zinc-800 disabled:cursor-not-allowed text-white font-extrabold rounded-xl transition-all border border-transparent cursor-pointer text-sm md:text-base flex items-center justify-center gap-1.5"
              >
                <span>בדוק תשובה</span>
              </button>
            ) : (
              <div className="space-y-3.5 animate-fade-in text-right">
                <div className={`p-4 border rounded-xl flex gap-3.5 ${
                  selectedOption === QUESTIONS[currentIdx].correctAnswer
                    ? "bg-emerald-950/20 border-emerald-500/25 text-emerald-300"
                    : "bg-red-950/20 border-red-500/25 text-red-300"
                }`}>
                  <div className="shrink-0 mt-0.5">
                    {selectedOption === QUESTIONS[currentIdx].correctAnswer ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-sm font-black block">
                      {selectedOption === QUESTIONS[currentIdx].correctAnswer ? "תשובה נכונה! כל הכבוד 🌟" : "תשובה לא נכונה. לא נורא!"}
                    </span>
                    <p className="text-xs md:text-sm leading-relaxed text-zinc-300 font-medium">
                      {QUESTIONS[currentIdx].explanation}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleNext}
                  className="w-full py-3.5 bg-zinc-800 hover:bg-zinc-700 text-white font-extrabold rounded-xl transition-all cursor-pointer text-sm md:text-base flex items-center justify-center gap-1.5"
                >
                  <span>{currentIdx === QUESTIONS.length - 1 ? "סיום החידון וצפייה בתוצאה" : "שאלה הבאה"}</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FINAL SCORE REPORT VIEW */}
      {gameState === "score" && (
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 py-6 z-10">
          <div className="w-20 h-20 rounded-full bg-amber-500/10 border-2 border-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/10 animate-pulse">
            <Award className="w-10 h-10 text-amber-500" />
          </div>
          <div className="space-y-2 max-w-md">
            <span className="text-[10px] text-earth font-black uppercase tracking-widest">תוצאה סופית</span>
            <h3 className="text-2xl font-black text-white">השלמתם את חידון הפתיחה!</h3>
            <p className="text-3xl font-black text-earth mt-2">{score} מתוך {QUESTIONS.length}</p>
            <p className="text-sm text-text-muted leading-relaxed mt-2.5">
              {score === QUESTIONS.length
                ? "מושלם! אתם אלופי כדור הארץ האמיתיים 🌍 מחכה לנו שנה מרתקת ביחד!"
                : score >= 3
                ? "עבודה מצוינת! יש לכם בסיס חזק ומוצלח של ידע במדעים 👍"
                : "כל הכבוד על הניסיון! השנה נלמד את כל התשובות לעומקן 📚"}
            </p>
          </div>
          <button
            onClick={handleStart}
            className="px-6 py-2.5 bg-surface hover:bg-surface-hover border border-border-custom text-white font-extrabold rounded-xl transition-all cursor-pointer text-sm flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4 text-earth" />
            <span>נסו שוב</span>
          </button>
        </div>
      )}
    </div>
  );
}
