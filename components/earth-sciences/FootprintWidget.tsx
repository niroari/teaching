"use client";

import React, { useState } from "react";
import { HelpCircle, RefreshCw, Check, AlertTriangle, Sparkles, TrendingDown } from "lucide-react";

interface Question {
  id: string;
  text: string;
  category: "food" | "water" | "energy" | "waste" | "transit";
  options: {
    text: string;
    points: number; // impact points
  }[];
}

const QUESTIONS: Question[] = [
  {
    id: "food",
    text: "באיזו תדירות אתם אוכלים בשר או מוצרים מן החי (חלב, ביצים)?",
    category: "food",
    options: [
      { text: "בכל ארוחה כמעט (צריכה גבוהה מאוד)", points: 4 },
      { text: "פעם ביום (צריכה ממוצעת)", points: 3 },
      { text: "כמה פעמים בשבוע (צריכה מופחתת)", points: 2 },
      { text: "צמחוני או טבעוני (ללא בשר או ללא מוצרים מן החי)", points: 1 }
    ]
  },
  {
    id: "transit",
    text: "כיצד אתם מגיעים בדרך כלל לבית הספר או לחוגים?",
    category: "transit",
    options: [
      { text: "ברכב פרטי לבד (הורים מסיעים)", points: 4 },
      { text: "בנסיעה משותפת (קארפול עם חברים)", points: 3 },
      { text: "בתחבורה ציבורית (אוטובוס, רכבת)", points: 2 },
      { text: "ברגל, באופניים או בקורקינט לא ממונע", points: 1 }
    ]
  },
  {
    id: "energy",
    text: "האם מקפידים לכבות אורות, מזגן ומכשירים חשמליים כשיוצאים מהחדר?",
    category: "energy",
    options: [
      { text: "כמעט אף פעם לא, שוכחים לעיתים קרובות", points: 4 },
      { text: "לפעמים כן ולפעמים לא", points: 3 },
      { text: "משתדלים מאוד להקפיד ברוב המקרים", points: 2 },
      { text: "תמיד מקפידים ומכבים הכל באופן קבוע", points: 1 }
    ]
  },
  {
    id: "water",
    text: "מהו אורך המקלחת הממוצע שלכם ביום?",
    category: "water",
    options: [
      { text: "מעל 15 דקות (אוהבים מקלחות ארוכות מאוד)", points: 4 },
      { text: "בין 10 ל-15 דקות", points: 3 },
      { text: "בין 5 ל-10 דקות (זמן סביר)", points: 2 },
      { text: "פחות מ-5 דקות (מקלחת מהירה וחסכונית)", points: 1 }
    ]
  },
  {
    id: "waste",
    text: "האם אתם מפרידים פסולת או ממחזרים בבית?",
    category: "waste",
    options: [
      { text: "לא מפרידים בכלל, הכל הולך לפח הירוק הרגיל", points: 4 },
      { text: "ממחזרים רק נייר ובקבוקים לעיתים רחוקות", points: 3 },
      { text: "מפרידים באופן קבוע בקבוקים, נייר וקרטון", points: 2 },
      { text: "מפרידים הכל: נייר, פלסטיק, זכוכית ואפילו פח כתום או קומפוסט", points: 1 }
    ]
  }
];

export default function FootprintWidget() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const activeQuestion = QUESTIONS[currentStep];

  const handleSelectOption = (points: number) => {
    setAnswers(prev => ({
      ...prev,
      [activeQuestion.id]: points
    }));
  };

  const handleNext = () => {
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentStep(0);
    setShowResults(false);
  };

  // Calculate results
  const totalPoints = Object.values(answers).reduce((sum, val) => sum + val, 0);
  
  // Calculate "Number of Earths needed"
  // Range is from 5 points (all 1s) to 20 points (all 4s)
  // Let's map 5 points -> 1.1 Earths (ideal sustainable living with modern constraints)
  // 20 points -> 4.8 Earths (extremely high footprint)
  const earthsNeeded = Math.round((1.1 + ((totalPoints - 5) / 15) * 3.7) * 10) / 10;
  
  // Area in Dunams (ecological footprint estimate: 1 Earth approx equals 22 global dunams per person)
  const dunamsNeeded = Math.round(earthsNeeded * 22 * 10) / 10;

  const getRecommendations = () => {
    const recs: { title: string; desc: string }[] = [];
    
    if (answers["food"] && answers["food"] >= 3) {
      recs.push({
        title: "צמצום צריכת בשר (יום ללא בשר)",
        desc: "ייצור קילו אחד של בשר בקר דורש כ-15,000 ליטר מים ופולט גזי חממה רבים. מעבר ליום אחד צמחוני בשבוע ('שני צמחוני') יחסוך מאות קילוגרמים של CO2 בשנה."
      });
    }
    if (answers["transit"] && answers["transit"] >= 3) {
      recs.push({
        title: "בחירה בתחבורה פעילה או משותפת",
        desc: "הליכה ברגל או רכיבה על אופניים לבית הספר בריאה יותר ומאפסת פליטות. אם המרחק גדול, שימוש באוטובוס או נסיעה משותפת (קארפול) עם חברים מקטינים דרמטית את טביעת הרגל."
      });
    }
    if (answers["energy"] && answers["energy"] >= 3) {
      recs.push({
        title: "כיבוי מכשירים חכם ושימוש חסכוני",
        desc: "הקפידו לכבות מזגן ואור כשיוצאים מהחדר. אל תשאירו מטענים מחוברים לשקע כשאינם בשימוש (צריכת חשמל 'רפאים')."
      });
    }
    if (answers["water"] && answers["water"] >= 3) {
      recs.push({
        title: "אתגר המקלחת של 5 דקות",
        desc: "קיצור זמן המקלחת ל-5 דקות חוסך עשרות ליטרים של מים מתוקים יקרים בכל יום וכן את האנרגיה הנדרשת לחימום המים."
      });
    }
    if (answers["waste"] && answers["waste"] >= 3) {
      recs.push({
        title: "הצטרפות למיחזור והפחתת פלסטיק",
        desc: "השתמשו בבקבוק מים רב-פעמי במקום בקבוקי פלסטיק חד-פעמיים. הקפידו להשליך אריזות לפח הכתום ונייר לפח הכחול."
      });
    }

    // Default recommendations if they are already very green
    if (recs.length === 0) {
      recs.push({
        title: "הפיצו את הבשורה בכיתה!",
        desc: "טביעת הרגל שלכם מצוינת! אתם יכולים להוביל פרויקט הסברה בבית הספר או לעזור לחברים להבין כיצד לחסוך במשאבים."
      });
    }

    return recs.slice(0, 3); // top 3
  };

  const isCurrentAnswered = answers[activeQuestion?.id] !== undefined;

  return (
    <div className="w-full bg-surface border border-border-custom rounded-2xl overflow-hidden shadow-xl flex flex-col">
      <div className="flex border-b border-border-custom bg-surface-hover/30 p-4 justify-between items-center">
        <div className="flex items-center gap-2">
          <TrendingDown className="w-5 h-5 text-earth" />
          <h3 className="font-bold text-white text-base">מחשבון טביעת רגל אקולוגית כיתתי</h3>
        </div>
        {!showResults && (
          <div className="text-xs sm:text-sm text-text-muted bg-surface rounded-xl px-3.5 py-1.5 border border-border-custom font-bold">
            שאלה {currentStep + 1} מתוך {QUESTIONS.length}
          </div>
        )}
      </div>

      <div className="p-6">
        {!showResults ? (
          <div className="space-y-6">
            {/* Intro */}
            <div className="bg-earth/5 border border-earth/20 rounded-xl p-4 flex gap-3 text-sm text-text-muted leading-relaxed">
              <HelpCircle className="w-5 h-5 text-earth shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block mb-1 text-base">משאבים וקיימות - טביעת רגל אקולוגית:</span>
                ענו על שאלון הצריכה הבא כדי לאמוד את רמת ניצול המשאבים האישית שלכם וכדי להבין את השפעתכם על הפלנטה.
              </div>
            </div>

            {/* Question Text */}
            <div className="space-y-3">
              <span className="px-2 py-0.5 rounded bg-zinc-800 text-earth font-semibold text-xs uppercase">
                קטגוריה: {
                  activeQuestion.category === "food" ? "תזונה" :
                  activeQuestion.category === "transit" ? "תחבורה" :
                  activeQuestion.category === "energy" ? "חשמל ואנרגיה" :
                  activeQuestion.category === "water" ? "משאבי מים" : "פסולת וצריכה"
                }
              </span>
              <h4 className="text-base md:text-lg font-black text-white text-right leading-snug">
                {activeQuestion.text}
              </h4>
            </div>

            {/* Option Buttons */}
            <div className="space-y-3">
              {activeQuestion.options.map((opt, i) => {
                const isSelected = answers[activeQuestion.id] === opt.points;
                return (
                  <button
                    key={i}
                    onClick={() => handleSelectOption(opt.points)}
                    className={`w-full p-4.5 rounded-xl border text-right text-xs sm:text-sm md:text-base transition-all cursor-pointer flex justify-between items-center ${
                      isSelected
                        ? "border-earth bg-earth/15 text-white ring-2 ring-earth/30 font-bold"
                        : "border-border-custom bg-surface hover:bg-surface-hover text-text-muted font-medium"
                    }`}
                  >
                    <span>{opt.text}</span>
                    {isSelected && <Check className="w-4.5 h-4.5 text-earth shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>

            {/* Step Controls */}
            <div className="flex gap-4 pt-4 border-t border-border-custom justify-between">
              <button
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="px-4 py-2.5 border border-border-custom text-text-muted hover:bg-surface-hover disabled:opacity-40 disabled:cursor-not-allowed text-xs md:text-sm font-bold rounded-xl cursor-pointer transition-all"
              >
                ← חזרה
              </button>

              <button
                onClick={handleNext}
                disabled={!isCurrentAnswered}
                className={`px-6 py-2.5 text-xs md:text-sm font-bold rounded-xl transition-all ${
                  isCurrentAnswered
                    ? "bg-earth hover:bg-teal-600 text-white cursor-pointer"
                    : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                }`}
              >
                <span>{currentStep === QUESTIONS.length - 1 ? "חשב תוצאות" : "שאלה הבאה ←"}</span>
              </button>
            </div>
          </div>
        ) : (
          /* Results Mode */
          <div className="space-y-6">
            <div className="flex flex-col items-center text-center p-6 bg-zinc-950/40 border border-border-custom rounded-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-earth/5 via-transparent to-transparent pointer-events-none" />

              <h4 className="text-xs sm:text-sm font-bold text-text-muted">טביעת הרגל האקולוגית שלך דורשת:</h4>
              
              {/* Earths display */}
              <div className="my-6 space-y-1">
                <span className="text-5xl sm:text-6xl font-black text-earth block tracking-tight">
                  {earthsNeeded} <span className="text-lg sm:text-xl font-bold text-white">כדורי ארץ</span>
                </span>
                <span className="text-xs sm:text-sm text-text-muted">
                  אם כל אדם בעולם היה צורך משאבים ומייצר פסולת בדיוק כמוך.
                </span>
              </div>

              {/* Dunams equivalent */}
              <div className="bg-surface border border-border-custom rounded-xl px-4 py-2.5 text-xs sm:text-sm text-text-muted max-w-md">
                שווה ערך ל-<strong>{dunamsNeeded} דונמים</strong> של שטח יבשתי וימי פורה בשנה כדי לקיים את סגנון החיים שלך.
              </div>
            </div>

            {/* Scale comparison */}
            <div className="space-y-2">
              <h5 className="text-xs sm:text-sm font-bold text-white text-right">מפת המדדים:</h5>
              <div className="h-3 w-full bg-zinc-800 rounded-full overflow-hidden flex">
                <div className="h-full bg-emerald-500 w-1/4" title="1-1.5 כדורים (בר קיימא)" />
                <div className="h-full bg-yellow-500 w-1/4" title="1.5-2.5 כדורים (בינוני)" />
                <div className="h-full bg-orange-500 w-1/4" title="2.5-3.5 כדורים (גבוה)" />
                <div className="h-full bg-red-500 w-1/4" title="3.5+ כדורים (קיצוני)" />
              </div>
              <div className="flex justify-between text-[10px] md:text-xs text-text-muted font-semibold">
                <span>4.0+ (קיצוני)</span>
                <span>3.0 (גבוה)</span>
                <span>2.0 (ממוצע)</span>
                <span>1.0 (בר קיימא)</span>
              </div>
            </div>

            {/* Action Recommendations */}
            <div className="space-y-3">
              <h5 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5 justify-start">
                <Sparkles className="w-4.5 h-4.5 text-yellow-400 shrink-0" />
                <span>דרכים מומלצות להקטנת טביעת הרגל שלך:</span>
              </h5>
              <div className="grid grid-cols-1 gap-3">
                {getRecommendations().map((rec, i) => (
                  <div key={i} className="p-4 border border-border-custom bg-surface rounded-xl flex gap-3 text-right">
                    <div className="w-7 h-7 rounded-full bg-earth/10 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-xs text-earth font-bold">{i + 1}</span>
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <strong className="text-white text-xs sm:text-sm block">{rec.title}</strong>
                      <p className="text-xs sm:text-sm text-text-muted leading-relaxed">{rec.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reset Controls */}
            <div className="flex gap-4 pt-4 border-t border-border-custom justify-end">
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-earth hover:bg-teal-600 text-white text-xs md:text-sm font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                <span>מילוי שאלון מחדש</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
