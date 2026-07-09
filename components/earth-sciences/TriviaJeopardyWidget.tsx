"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, 
  Play, 
  HelpCircle, 
  Check, 
  X, 
  Award, 
  RotateCcw, 
  Plus, 
  Minus, 
  Volume2, 
  Sparkles,
  Maximize2,
  Minimize2
} from "lucide-react";

interface Question {
  q: string;
  a: string;
}

const CATEGORIES = [
  "ספירות ויחסי גומלין",
  "היקום ומערכת השמש",
  "תנועות כדור הארץ והירח",
  "חקר החלל והשפעת האדם"
];

const VALUES = [100, 200, 300, 400, 500];

const QUESTIONS: Record<string, Question[]> = {
  // Category 0: ספירות ויחסי גומלין
  "0": [
    { q: "מהי ה'ספירה' הכוללת את כל המים בכדור הארץ במצבי הצבירה השונים?", a: "הידרוספרה (ספירת המים)" },
    { q: "כיצד נקראת שכבת הגזים הדקה המקיפה את כדור הארץ בזכות כוח המשיכה שלו ומסננת קרינה מזיקה?", a: "אטמוספרה (ספירת האוויר)" },
    { q: "תנו דוגמה ליחסי גומלין בין הדו-כיווניים של ביוספרה (חיים) לאטמוספרה (גזים).", a: "פוטוסינתזה: צמחים הקולטים פחמן דו-חמצני ופולטים חמצן, או יצורים הנושמים חמצן ופולטים פחמן דו-חמצני." },
    { q: "מהו ה'אלבדו' וכיצד המסת שלגים בקטבים יוצרת לולאת משוב חיובית המאיצה את התחממות כדור הארץ?", a: "אלבדו הוא מדד להחזרת קרינה. שלג בהיר מחזיר את רוב הקרינה. המסת שלגים חושפת מים או אדמה כהים הבולעים את החום ומאיצים התחממות והמסה נוספות." },
    { q: "הסבירו כיצד התפרצות הר געש (גאוספרה) משפיעה ישירות על האטמוספרה, ההידרוספרה והביוספרה.", a: "פליטת גזים ואפר (אטמוספרה), חומציות גשמים וזיהום מקורות מים (הידרוספרה), פגיעה מיידית בצומח ובחי ולבסוף העשרת הקרקע במינרלים (ביוספרה)." }
  ],
  // Category 1: היקום ומערכת השמש
  "1": [
    { q: "מהו כוכב הלכת הגדול ביותר במערכת השמש שלנו, המוגדר כענק גזים?", a: "צדק (יופיטר)" },
    { q: "מהי יחידת המידה המשמשת למדידת מרחקים עצומים ביקום, המוגדרת כמרחק שהאור עובר בשנה אחת?", a: "שנת אור (כ-9.46 טריליון קילומטרים)" },
    { q: "מהם 3 הבדלים מרכזיים בין כוכבי לכת סלעיים פנימיים לכוכבי לכת גזיים חיצוניים?", a: "סלעיים: קרובים לשמש, קטנים יותר, בעלי קרום מוצק, ואין להם מערכות טבעות. גזיים: מרוחקים, ענקיים, עשויים גזים, ירחים רבים וטבעות." },
    { q: "מהו שמו של כוח המשיכה המונע מכוכבי הלכת לעוף לחלל הפתוח ומחזיק אותם במסלול סביב השמש, ועל פי אילו שני גורמים הוא נקבע?", a: "כוח הכבידה (גרביטציה). נקבע לפי המסה של הגופים והמרחק ביניהם." },
    { q: "מדוע כוכב הלכת נוגה (ונוס) חם יותר מכוכב הלכת כוכב חמה (מרקורי), אף על פי שמרקורי קרוב הרבה יותר לשמש?", a: "בשל אפקט חממה קיצוני בנוגה, הנגרם מאטמוספרה סמיכה מאוד של פחמן דו-חמצני (CO2) הלוכדת את קרינת השמש ומונעת ממנה להיפלט החוצה." }
  ],
  // Category 2: תנועות כדור הארץ והירח
  "2": [
    { q: "כמה זמן נמשך סיבוב עצמי אחד של כדור הארץ סביב צירו, ואיזו תופעה יומיומית הוא גורם?", a: "24 שעות (יממה אחת), והוא גורם למחזור יום ולילה." },
    { q: "מהי הסיבה הישירה להיווצרות עונות השנה בכדור הארץ?", a: "נטיית ציר כדור הארץ (23.5 מעלות) ביחס לאנך למישור המילקה בשילוב עם תנועת ההקפה השנתית שלו סביב השמש." },
    { q: "מדוע אנו רואים את הירח בצורות שונות לאורך החודש (מופעי הירח), והאם הירח מפיק אור עצמי?", a: "הירח אינו מפיק אור עצמי אלא מחזיר את אור השמש. ככל שהוא מקיף את הארץ, משתנה הזווית שבה אנו רואים את החלק המואר שלו." },
    { q: "מהן תופעות הגאות והשפל באוקיינוסים, ואיזה גרם שמיים אחראי להן בעיקר?", a: "עליית מפלס מי הים (גאות) וירידתו (שפל) פעמיים ביום, הנגרמות בעיקר בשל כוח המשיכה של הירח (והשמש)." },
    { q: "תארו את מיקום גרמי השמים (שמש, ארץ, ירח) במהלך ליקוי חמה ובמהלך ליקוי לבנה.", a: "ליקוי חמה: הירח עובר ישירות בין השמש לכדור הארץ ומסתיר אותה. ליקוי לבנה: כדור הארץ עובר בין השמש לירח ומטיל עליו את צילו." }
  ],
  // Category 3: חקר החלל והשפעת האדם
  "3": [
    { q: "מהי 'פסולת חלל' וכיצד היא נוצרת?", a: "לוויינים שיצאו משימוש, חלקי משגרים וחלקי מתכת שנותרו במסלול סביב כדור הארץ עקב פעילות האדם בחלל." },
    { q: "תנו 2 דוגמאות לטכנולוגיות יומיומיות שפותחו במקור עבור משימות חקר החלל ומשמשות אותנו בכדור הארץ.", a: "ניווט GPS, פנלים סולאריים, מסנני מים מתקדמים, ספוג זיכרון (מזרנים), מצלמות זעירות בטלפונים, גלאי עשן." },
    { q: "מהו 'אפקט קסלר' ומהי הסכנה הטמונה בו לחיינו המודרניים?", a: "תרחיש שבו שרשרת התנגשויות של פסולת חלל במסלול נמוך תיצור עוד ועוד רסיסים, עד שהמסלול סביב כדור הארץ יהפוך לבלתי שמיש ותקשורת לוויינית תושבת." },
    { q: "מהם ההבדלים הפונקציונליים בין גשושית מחקר (Space Probe) ללוויין תקשורת (Satellite)?", a: "גשושית: חללית לא מאוישת הנשלחת לחלל העמוק/כוכבי לכת אחרים לאיסוף מידע. לוויין: מקיף את כדור הארץ לשימושי תקשורת, ניווט, תצפית מזג אוויר וביטחון." },
    { q: "הציגו טיעון אחד בעד המשך תקצוב חקר החלל וטיעון אחד נגד (השקעה רק בכדור הארץ).", a: "בעד: פיתוחים טכנולוגיים פורצי דרך, גילוי משאבים חדשים, והרחבת הידע האנושי. נגד: בכדור הארץ יש משברים חמורים (עוני, שינויי אקלים, בריאות) המצריכים הפניית משאבים מיידית." }
  ]
};

interface Team {
  name: string;
  score: number;
}

export default function TriviaJeopardyWidget() {
  const [gameStarted, setGameStarted] = useState(false);
  const [numTeams, setNumTeams] = useState<number>(3);
  const [teams, setTeams] = useState<Team[]>([]);
  const [activeTeamIdx, setActiveTeamIdx] = useState<number>(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  // Board state: tracks which cell is played (col-row)
  const [playedCells, setPlayedCells] = useState<Record<string, boolean>>({});
  
  // Selected question modal
  const [activeQuestion, setActiveQuestion] = useState<{
    col: number;
    rowIdx: number;
    points: number;
    q: string;
    a: string;
  } | null>(null);
  
  const [answerRevealed, setAnswerRevealed] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  // Sync state with HTML5 Fullscreen API
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const toggleFullScreen = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  // Initialize game
  const handleStartGame = () => {
    const initializedTeams: Team[] = Array.from({ length: numTeams }).map((_, i) => ({
      name: `קבוצה ${String.fromCharCode(65 + i)}`, // Group A, B, C, D
      score: 0
    }));
    setTeams(initializedTeams);
    setActiveTeamIdx(0);
    setPlayedCells({});
    setGameOver(false);
    setGameStarted(true);
  };

  const handleCellClick = (col: number, rowIdx: number, points: number) => {
    const cellKey = `${col}-${rowIdx}`;
    if (playedCells[cellKey]) return;

    const questionData = QUESTIONS[String(col)][rowIdx];
    setActiveQuestion({
      col,
      rowIdx,
      points,
      q: questionData.q,
      a: questionData.a
    });
    setAnswerRevealed(false);
  };

  const handleScoreChange = (teamIdx: number, amount: number) => {
    setTeams(prev => prev.map((t, idx) => {
      if (idx === teamIdx) {
        return { ...t, score: t.score + amount };
      }
      return t;
    }));
  };

  const handleResolveQuestion = (correct: boolean) => {
    if (!activeQuestion) return;
    
    const cellKey = `${activeQuestion.col}-${activeQuestion.rowIdx}`;
    setPlayedCells(prev => ({ ...prev, [cellKey]: true }));
    
    const scoreModifier = correct ? activeQuestion.points : -activeQuestion.points;
    handleScoreChange(activeTeamIdx, scoreModifier);

    // Check if game is over (all 20 cells played)
    const nextPlayedCount = Object.keys(playedCells).length + 1;
    if (nextPlayedCount === 20) {
      setGameOver(true);
    } else {
      // Rotate active team turn
      setActiveTeamIdx(prev => (prev + 1) % teams.length);
    }
    
    setActiveQuestion(null);
  };

  const handleSkipQuestion = () => {
    if (!activeQuestion) return;
    const cellKey = `${activeQuestion.col}-${activeQuestion.rowIdx}`;
    setPlayedCells(prev => ({ ...prev, [cellKey]: true }));
    
    // Check game over
    const nextPlayedCount = Object.keys(playedCells).length + 1;
    if (nextPlayedCount === 20) {
      setGameOver(true);
    } else {
      setActiveTeamIdx(prev => (prev + 1) % teams.length);
    }
    
    setActiveQuestion(null);
  };

  // Get podium ranking
  const getSortedTeams = () => {
    return [...teams].sort((a, b) => b.score - a.score);
  };

  const mainContainerClasses = isFullScreen
    ? "fixed inset-0 z-[100] bg-slate-950 p-6 flex flex-col justify-between overflow-hidden text-right h-screen w-screen"
    : "w-full bg-slate-950/20 border border-zinc-800/80 rounded-2xl p-6 text-right relative min-h-[600px] flex flex-col justify-between";

  return (
    <div className={mainContainerClasses}>
      
      {/* 1. SETUP SCREEN */}
      {!gameStarted && (
        <div className="max-w-md mx-auto py-12 flex flex-col items-center justify-center space-y-6 text-center w-full relative">
          {/* Setup screen fullscreen toggle button */}
          <button 
            onClick={toggleFullScreen}
            className="absolute top-0 left-0 p-2 rounded-xl border border-zinc-800 bg-surface/30 hover:bg-surface-hover/30 text-text-muted hover:text-white transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            title="מסך מלא"
          >
            {isFullScreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span>{isFullScreen ? "חלון רגיל" : "מסך מלא"}</span>
          </button>

          <div className="w-16 h-16 bg-earth/10 border border-earth/20 rounded-full flex items-center justify-center text-earth animate-bounce">
            <Award className="w-8 h-8" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-black text-white">הגדרת טריוויה כיתתית (Jeopardy)</h3>
            <p className="text-xs text-text-muted max-w-sm">
              חלקו את התלמידים בכיתה לקבוצות, בחרו את מספר הקבוצות והגדירו את שמותיהן כדי להתחיל בתחרות!
            </p>
          </div>

          <div className="w-full space-y-4 text-right">
            <div>
              <label className="block text-xs font-bold text-text-muted mb-2">מספר קבוצות משתתפות:</label>
              <div className="grid grid-cols-3 gap-2">
                {[2, 3, 4].map(n => (
                  <button
                    key={n}
                    onClick={() => setNumTeams(n)}
                    className={`py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer border ${
                      numTeams === n 
                        ? "bg-earth border-earth text-white shadow-lg shadow-teal-500/10" 
                        : "bg-surface border-zinc-800 text-text-muted hover:border-zinc-700"
                    }`}
                  >
                    {n} קבוצות
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleStartGame}
            className="w-full py-3 bg-earth hover:bg-teal-600 text-white font-bold text-sm rounded-xl cursor-pointer shadow-md hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>התחל בחידון 🚀</span>
          </button>
        </div>
      )}

      {/* 2. GAME ACTIVE SCREEN */}
      {gameStarted && !gameOver && (
        <div className="flex-1 flex flex-col justify-between space-y-4 select-none overflow-hidden h-full">
          
          {/* Active Turn banner */}
          <div className={`flex flex-row justify-between items-center bg-zinc-900/60 border border-zinc-800/80 rounded-2xl gap-3 text-right flex-shrink-0 ${
            isFullScreen ? "p-3" : "p-4"
          }`}>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-earth shrink-0" />
              <div>
                <span className="text-[10px] text-text-muted font-bold block">תור הקבוצה לבחור משבצת:</span>
                <span className="text-sm md:text-base font-extrabold text-white">
                  👉 {teams[activeTeamIdx]?.name}
                </span>
              </div>
            </div>
            
            <div className="flex gap-2">
              {/* Full Screen Toggle Button */}
              <button
                onClick={toggleFullScreen}
                className="px-3 py-1.5 border border-earth/40 bg-earth/10 hover:bg-earth/20 text-xs font-bold text-earth rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
              >
                {isFullScreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                <span>{isFullScreen ? "חלון רגיל" : "מסך מלא"}</span>
              </button>

              <button 
                onClick={() => {
                  if (confirm("האם ברצונך לאפס את המשחק ולהתחיל מחדש?")) {
                    setGameStarted(false);
                  }
                }}
                className="px-3 py-1.5 border border-zinc-800 hover:bg-zinc-800 text-xs font-bold text-text-muted rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">אתחול משחק</span>
              </button>
              <button 
                onClick={() => setGameOver(true)}
                className="px-3 py-1.5 border border-red-500/20 bg-red-950/15 hover:bg-red-950/30 text-xs font-bold text-red-400 rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">סיום משחק</span>
              </button>
            </div>
          </div>

          {/* Jeopardy Grid Board */}
          <div className={`overflow-x-auto pb-2 flex-grow flex items-center justify-center ${isFullScreen ? "max-h-[54vh] py-1" : "py-2"}`}>
            <div className="w-full min-w-[640px] grid grid-cols-4 gap-3.5 h-full">
              
              {/* Columns Header */}
              {CATEGORIES.map((cat, idx) => (
                <div 
                  key={idx} 
                  className={`bg-earth/10 border border-earth/20 rounded-xl p-2 text-center flex flex-col items-center justify-center shadow-sm ${
                    isFullScreen ? "h-[8vh] min-h-[48px] max-h-[64px]" : "min-h-[64px]"
                  }`}
                >
                  <span className="text-[9px] font-bold text-earth block">קטגוריה {idx + 1}</span>
                  <span className={`font-extrabold text-white leading-tight ${isFullScreen ? "text-[10px]" : "text-xs"}`}>{cat}</span>
                </div>
              ))}

              {/* Grid Cells (Points) */}
              {VALUES.map((val, rowIdx) => (
                <React.Fragment key={rowIdx}>
                  {CATEGORIES.map((_, col) => {
                    const cellKey = `${col}-${rowIdx}`;
                    const played = playedCells[cellKey];
                    
                    return (
                      <button
                        key={cellKey}
                        disabled={played}
                        onClick={() => handleCellClick(col, rowIdx, val)}
                        className={`rounded-xl border text-center font-black transition-all flex flex-col items-center justify-center cursor-pointer select-none ${
                          isFullScreen ? "h-[7vh] min-h-[38px] max-h-[55px]" : "h-20"
                        } ${
                          played
                            ? "bg-zinc-900/40 border-zinc-900 text-zinc-700 line-through opacity-30 cursor-default"
                            : "bg-zinc-900 border-zinc-800 text-amber-500 hover:scale-[1.03] hover:border-amber-500/50 hover:bg-zinc-800/80 shadow-md text-base md:text-lg"
                        }`}
                      >
                        {played ? (
                          <Check className="w-4 h-4 text-zinc-600" />
                        ) : (
                          <span>{val}</span>
                        )}
                      </button>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Scoreboard block */}
          <div className="space-y-2 flex-shrink-0">
            <h4 className="text-[10px] font-black text-text-muted">לוח ניקוד כיתתי 📊</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {teams.map((t, idx) => {
                const isActive = idx === activeTeamIdx;
                const colors = [
                  "border-sky-500/30 bg-sky-950/20 text-sky-400",
                  "border-purple-500/30 bg-purple-950/20 text-purple-400",
                  "border-emerald-500/30 bg-emerald-950/20 text-emerald-400",
                  "border-amber-500/30 bg-amber-950/20 text-amber-400"
                ];
                
                return (
                  <div
                    key={idx}
                    className={`rounded-2xl border flex flex-col justify-between items-center transition-all ${
                      colors[idx % colors.length]
                    } ${isActive ? "ring-2 ring-white/30 scale-[1.02] border-white/20" : "opacity-85"} ${
                      isFullScreen ? "p-2" : "p-4"
                    }`}
                  >
                    {/* Team Name Input */}
                    <div className="flex items-center gap-1.5 w-full justify-center">
                      <input
                        type="text"
                        value={t.name}
                        onChange={(e) => {
                          const updated = [...teams];
                          updated[idx].name = e.target.value;
                          setTeams(updated);
                        }}
                        className="bg-transparent border-none text-center font-extrabold text-xs focus:outline-none focus:ring-1 focus:ring-white/30 rounded px-1 text-white w-20"
                      />
                      <Edit2Icon className="w-3 h-3 text-white/50" />
                    </div>

                    {/* Team Score */}
                    <span className={`font-black text-white ${isFullScreen ? "text-lg py-0.5" : "text-xl py-2"}`}>{t.score}</span>

                    {/* Manual Score adjustments */}
                    <div className="flex gap-2 w-full justify-center">
                      <button
                        onClick={() => handleScoreChange(idx, -50)}
                        className="p-1 rounded bg-zinc-800/80 hover:bg-zinc-700 text-white cursor-pointer"
                        title="הפחת 50 נקודות"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleScoreChange(idx, 50)}
                        className="p-1 rounded bg-zinc-800/80 hover:bg-zinc-700 text-white cursor-pointer"
                        title="הוסף 50 נקודות"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 3. GAME OVER OVERLAY SCREEN */}
      {gameStarted && gameOver && (
        <div className="max-w-md mx-auto py-8 text-center space-y-6 flex flex-col items-center justify-center animate-fade-in select-none w-full relative">
          {/* Fullscreen toggle button on game over */}
          <button 
            onClick={toggleFullScreen}
            className="absolute top-0 left-0 p-2 rounded-xl border border-zinc-800 bg-surface/30 hover:bg-surface-hover/30 text-text-muted hover:text-white transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold"
          >
            {isFullScreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span>{isFullScreen ? "חלון רגיל" : "מסך מלא"}</span>
          </button>

          <div className="relative">
            <Award className="w-20 h-20 text-amber-500 animate-bounce" />
            <Sparkles className="w-6 h-6 text-amber-400 absolute -top-1 -right-1 animate-pulse" />
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl font-black text-white">סיום המשחק! 🏁</h3>
            <p className="text-xs text-text-muted">
              כל הכבוד לכל הקבוצות על מאמץ מדהים ושיתוף פעולה מושלם!
            </p>
          </div>

          {/* Podium ranking board */}
          <div className="w-full bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 space-y-3.5 text-right">
            <h4 className="text-xs font-black text-text-muted border-b border-zinc-800 pb-2">דירוג קבוצות סופי:</h4>
            <div className="space-y-2">
              {getSortedTeams().map((t, idx) => (
                <div 
                  key={idx} 
                  className={`flex items-center justify-between p-3 rounded-xl border text-sm font-bold ${
                    idx === 0 
                      ? "border-amber-500/30 bg-amber-950/20 text-amber-300" 
                      : "border-zinc-800 bg-zinc-900/40 text-zinc-300"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                      idx === 0 ? "bg-amber-500 text-slate-950" : "bg-zinc-800 text-zinc-400"
                    }`}>
                      {idx + 1}
                    </span>
                    <span>{t.name}</span>
                  </div>
                  <span className="font-black text-base text-white">{t.score} נקודות</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setGameStarted(false)}
            className="w-full py-3 bg-earth hover:bg-teal-600 text-white font-bold text-sm rounded-xl cursor-pointer shadow-md hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>שחק שוב 🔄</span>
          </button>
        </div>
      )}

      {/* 4. ACTIVE QUESTION MODAL WINDOW */}
      {activeQuestion && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[110] flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-slate-900 border border-zinc-800 rounded-3xl p-6 md:p-8 text-right shadow-2xl relative space-y-6 animate-scale-up">
            
            {/* Header info */}
            <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
              <span className="text-xs text-text-muted font-bold">
                הקבוצה המשיבה: <strong className="text-white text-sm">{teams[activeTeamIdx]?.name}</strong>
              </span>
              <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 font-black text-sm rounded-xl">
                {activeQuestion.points} נקודות
              </span>
            </div>

            {/* Question Text */}
            <div className="space-y-2 py-2">
              <span className="text-[10px] text-earth font-black block">השאלה:</span>
              <p className="text-base md:text-lg font-bold text-white leading-relaxed">
                {activeQuestion.q}
              </p>
            </div>

            {/* Hidden Answer block */}
            {answerRevealed ? (
              <div className="bg-earth/5 border border-earth/20 rounded-2xl p-4 md:p-5 space-y-2 animate-fade-in">
                <span className="text-[10px] text-earth font-black block">התשובה הנכונה:</span>
                <p className="text-sm md:text-base font-bold text-emerald-400 leading-relaxed">
                  ✅ {activeQuestion.a}
                </p>
              </div>
            ) : (
              <button
                onClick={() => setAnswerRevealed(true)}
                className="w-full py-4 border-2 border-dashed border-zinc-800 hover:border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800/40 text-sm font-black text-text-muted hover:text-white rounded-2xl transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5"
              >
                <Volume2 className="w-5 h-5 text-earth animate-pulse" />
                <span>חשוף תשובה נכונה</span>
              </button>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => handleResolveQuestion(true)}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>תשובה נכונה (+{activeQuestion.points})</span>
              </button>
              
              <button
                onClick={() => handleResolveQuestion(false)}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1.5"
              >
                <X className="w-4 h-4" />
                <span>תשובה שגויה (-{activeQuestion.points})</span>
              </button>
              
              <button
                onClick={handleSkipQuestion}
                className="py-3 px-4 border border-zinc-800 hover:bg-zinc-800 text-xs font-bold text-text-muted rounded-xl cursor-pointer transition-colors"
              >
                דלג ללא שינוי ניקוד
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Edit Icon helper
function Edit2Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}
