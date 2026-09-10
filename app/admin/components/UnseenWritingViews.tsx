"use client";

import React, { useState } from "react";
import { 
  Search, RefreshCw, BookOpen, CheckCircle, Check, 
  ChevronDown, ChevronUp, FileText, CheckCircle2, XCircle, 
  AlertCircle, Sparkles, MessageSquare, Award 
} from "lucide-react";

export interface StudentAnswerRecord {
  questionId: number;
  questionNumber: number;
  type: string;
  paragraph?: number | string | null;
  prompt: string;
  studentAnswer: string;
  correctAnswer: string;
  firstTrySuccess: boolean;
  attempts: number;
  explanation: string;
  matchedKeywords?: string[];
  missingKeywords?: string[];
}

export interface UnseenAssignment {
  id: string;
  studentId: string;
  studentName: string;
  studentClass: string;
  studentEmail: string;
  unseenTitle: string;
  difficulty: string;
  score: number;
  correctOnFirstTry: number;
  totalQuestions: number;
  submittedAt: any;
  status: "submitted" | "graded";
  scoreTeacher: number | null;
  feedbackTeacher: string | null;
  answers?: StudentAnswerRecord[];
  passage?: {
    title: string;
    difficulty: string;
    paragraphs: string[];
  };
}

export interface WritingAssignment {
  id: string;
  studentId: string;
  studentName: string;
  studentClass: string;
  studentEmail: string;
  taskType: "letter" | "essay";
  prompt: string;
  studentText: string;
  score: number;
  evaluation: {
    score: number;
    grammarFeedback: string;
    improvedVersion: string;
    structureFeedback: { passed: boolean; details: string };
    corrections: Array<{ original: string; corrected: string; explanation: string }>;
  };
  submittedAt: any;
  status: "submitted" | "graded";
  scoreTeacher: number | null;
  feedbackTeacher: string | null;
}

export function UnseenDashboardView({
  unseenSubmissions,
  loadingUnseen,
  selectedUnseen,
  handleSelectUnseen,
  handleSaveUnseenGrade,
  gradeInput,
  setGradeInput,
  feedbackInput,
  setFeedbackInput,
  isGrading,
  gradeSuccess,
  searchQuery,
  setSearchQuery,
  activeListTab,
  setActiveListTab,
  inputStyle,
  cardStyle,
  borderStyle,
  textTitle,
  textMuted,
  isLight
}: {
  unseenSubmissions: UnseenAssignment[];
  loadingUnseen: boolean;
  selectedUnseen: UnseenAssignment | null;
  handleSelectUnseen: (sub: UnseenAssignment) => void;
  handleSaveUnseenGrade: (e: React.FormEvent) => void;
  gradeInput: string;
  setGradeInput: (v: string) => void;
  feedbackInput: string;
  setFeedbackInput: (v: string) => void;
  isGrading: boolean;
  gradeSuccess: boolean;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  activeListTab: "all" | "pending" | "graded";
  setActiveListTab: (v: "all" | "pending" | "graded") => void;
  inputStyle: string;
  cardStyle: string;
  borderStyle: string;
  textTitle: string;
  textMuted: string;
  isLight: boolean;
}) {
  const [showPassageText, setShowPassageText] = useState(false);

  const feedbackPresets = [
    "עבודה מצוינת! פיצוח מדויק של הטקסט וזיהוי נכון של מילות המפתח.",
    "יפה מאוד! הבנה טובה של הרעיונות המרכזיים, מומלץ להרחיב מעט בניסוח שאלות פתוחות.",
    "עבודה טובה! שים לב לשאלת העתקת המשפט - חשוב להעתיק משפט שלם מההתחלה ועד הנקודה.",
    "כל הכבוד על ההתמדה והמענה על כל השאלות!"
  ];

  const handleAddPreset = (preset: string) => {
    if (!feedbackInput) {
      setFeedbackInput(preset);
    } else if (!feedbackInput.includes(preset)) {
      setFeedbackInput(`${feedbackInput}\n${preset}`);
    }
  };

  const filteredUnseenSubmissions = unseenSubmissions.filter(sub => {
    const matchesSearch = 
      sub.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sub.studentClass && sub.studentClass.toLowerCase().includes(searchQuery.toLowerCase())) ||
      sub.studentEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sub.unseenTitle && sub.unseenTitle.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (activeListTab === "pending") return matchesSearch && sub.status === "submitted";
    if (activeListTab === "graded") return matchesSearch && sub.status === "graded";
    return matchesSearch;
  });

  return (
    <div className="space-y-8 flex-1 flex flex-col">
      {/* Search and stats bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search input */}
        <div className="relative w-full md:max-w-md">
          <input
            type="text"
            placeholder="חיפוש לפי שם תלמיד, כיתה או שם האנסין..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pr-10 pl-4 py-2.5 rounded-xl border text-xs outline-none transition-colors text-right ${inputStyle}`}
          />
          <Search className="w-4 h-4 text-zinc-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
        </div>
        
        <div className="text-right">
          <h2 className={`text-xl font-bold ${textTitle}`}>ניהול הגשות אנסין (Unseen Practice)</h2>
          <p className={`text-xs ${textMuted} mt-1`}>
            צפייה במיומנות פיצוח האנסינים של התלמידים, מתן הערכה וציוני מורה משוב.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start flex-1">
        {/* LEFT COLUMN: List of Submissions */}
        <div className="lg:col-span-5 flex flex-col space-y-4 h-full">
          {/* List Header/Sub-tabs */}
          <div className={`p-1.5 rounded-xl ${cardStyle} border ${borderStyle} flex gap-2 flex-row-reverse`}>
            {(["all", "pending", "graded"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveListTab(tab)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeListTab === tab
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-zinc-400 hover:text-[#e8edf8]"
                }`}
              >
                {tab === "all" ? "הכל" : tab === "pending" ? "ממתין" : "נבדק"}
              </button>
            ))}
          </div>

          {/* Submissions List Card */}
          <div className={`p-4 rounded-xl ${cardStyle} border ${borderStyle} flex-1 overflow-y-auto max-h-[460px] space-y-2.5`}>
            {loadingUnseen ? (
              <div className="flex flex-col items-center justify-center p-12 space-y-3">
                <RefreshCw className="w-6 h-6 text-purple-500 animate-spin" />
                <span className={`text-xs ${textMuted}`}>טוען הגשות...</span>
              </div>
            ) : filteredUnseenSubmissions.length === 0 ? (
              <div className="text-center py-12 text-xs text-zinc-500">
                לא נמצאו הגשות מתאימות.
              </div>
            ) : (
              filteredUnseenSubmissions.map((sub) => {
                const isSelected = selectedUnseen?.id === sub.id;
                const dateStr = sub.submittedAt 
                  ? new Date(sub.submittedAt.seconds * 1000).toLocaleDateString("he-IL") 
                  : "";
                
                return (
                  <button
                    key={sub.id}
                    onClick={() => handleSelectUnseen(sub)}
                    className={`w-full p-3.5 rounded-xl border text-right transition-all flex items-center justify-between gap-3 hover:scale-[1.01] cursor-pointer ${
                      isSelected 
                        ? "border-purple-500 bg-purple-500/5 ring-1 ring-purple-500/20" 
                        : `${borderStyle} ${isLight ? "bg-white hover:bg-zinc-50" : "bg-[#0b0f19] hover:bg-[#111727]"}`
                    }`}
                  >
                    {/* Score or Pending badge */}
                    <div>
                      {sub.status === "graded" ? (
                        <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-lg">
                          {sub.scoreTeacher}
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
                          <span>ממתין</span>
                        </span>
                      )}
                    </div>

                    {/* Student Details */}
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <h4 className={`text-xs font-bold ${textTitle}`}>
                          {sub.studentName} {sub.studentClass ? `(${sub.studentClass})` : ""}
                        </h4>
                        <p className="text-[10px] text-zinc-500 mt-0.5">{sub.studentEmail}</p>
                        <div className="flex gap-2 items-center justify-end mt-1.5 text-[9px] text-zinc-500">
                          <span>הוגש ב: {dateStr}</span>
                          <span>•</span>
                          <span className="px-1 rounded bg-zinc-800 text-teal-400 border border-zinc-700/50">
                            {sub.unseenTitle.substring(0, 20)}...
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: Detailed View & Grading Form */}
        <div className="lg:col-span-7 flex flex-col">
          <div className={`rounded-2xl ${cardStyle} border ${borderStyle} flex-1 flex flex-col justify-between overflow-hidden shadow-2xl h-full min-h-[500px]`}>
            
            {!selectedUnseen ? (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-xs text-zinc-500 space-y-4">
                <BookOpen className="w-12 h-12 text-zinc-750 animate-pulse" />
                <p className="max-w-xs leading-relaxed">
                  יש לבחור הגשת תלמיד מרשימת ההגשות משמאל כדי לראות את ביצועי האנסין ולהזין ציון מורה ומשוב.
                </p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col h-full overflow-hidden">
                
                {/* Active Sub Header */}
                <div className={`px-6 py-4 border-b ${borderStyle} flex items-center justify-between ${
                  isLight ? "bg-zinc-50" : "bg-[#0b0f19]/70"
                }`}>
                  <div className="text-right">
                    <h3 className={`text-sm font-black ${textTitle}`}>
                      {selectedUnseen.studentName} {selectedUnseen.studentClass ? `(${selectedUnseen.studentClass})` : ""}
                    </h3>
                    <p className="text-[10px] text-zinc-500 mt-0.5">{selectedUnseen.studentEmail}</p>
                  </div>
                  <span className="text-xs font-bold text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2.5 py-1 rounded-lg">
                    אנסין: {selectedUnseen.unseenTitle}
                  </span>
                </div>

                {/* Review details */}
                <div className="p-6 flex-1 overflow-y-auto space-y-6 text-right">
                  <div className="grid grid-cols-3 gap-3">
                    <div className={`p-4 rounded-xl border ${borderStyle} ${isLight ? "bg-zinc-50" : "bg-[#0c1222]/30"}`}>
                      <span className="text-[10px] text-zinc-500 block mb-1">ציון מיומנות</span>
                      <div className="flex items-baseline gap-1 justify-end">
                        <span className={`text-2xl font-black ${textTitle}`}>{selectedUnseen.score}</span>
                        <span className="text-xs text-zinc-500">/ 100</span>
                      </div>
                    </div>
                    
                    <div className={`p-4 rounded-xl border ${borderStyle} ${isLight ? "bg-zinc-50" : "bg-[#0c1222]/30"}`}>
                      <span className="text-[10px] text-zinc-500 block mb-1">ניסיון ראשון</span>
                      <div className="flex items-baseline gap-1 justify-end">
                        <span className={`text-2xl font-black ${textTitle}`}>{selectedUnseen.correctOnFirstTry}</span>
                        <span className="text-xs text-zinc-500">/ {selectedUnseen.totalQuestions}</span>
                      </div>
                    </div>

                    <div className={`p-4 rounded-xl border ${borderStyle} ${isLight ? "bg-zinc-50" : "bg-[#0c1222]/30"}`}>
                      <span className="text-[10px] text-zinc-500 block mb-1">רמת קושי</span>
                      <span className="inline-block text-xs font-bold px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-teal-400 mt-1">
                        {selectedUnseen.difficulty === "Easy" ? "רמה 1 (קל)" : selectedUnseen.difficulty === "Medium" ? "רמה 2 (בינוני)" : "רמה 3 (קשה)"}
                      </span>
                    </div>
                  </div>

                  {/* Passage Text Toggle */}
                  {selectedUnseen.passage && (
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => setShowPassageText(!showPassageText)}
                        className={`w-full p-3 rounded-xl border flex items-center justify-between text-xs font-bold transition-all cursor-pointer ${
                          isLight ? "bg-zinc-100 hover:bg-zinc-200 border-zinc-300 text-zinc-800" : "bg-zinc-900/80 hover:bg-zinc-850 border-zinc-700 text-zinc-200"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-purple-400" />
                          <span>טקסט האנסין המקורי: {selectedUnseen.passage.title || selectedUnseen.unseenTitle}</span>
                        </div>
                        {showPassageText ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>

                      {showPassageText && (
                        <div className={`p-4 rounded-xl border text-left font-serif leading-relaxed text-sm space-y-3 max-h-60 overflow-y-auto ${
                          isLight ? "bg-white border-zinc-200 text-zinc-800" : "bg-black/40 border-zinc-800 text-zinc-200"
                        }`} dir="ltr">
                          {selectedUnseen.passage.paragraphs.map((para, pIdx) => (
                            <p key={pIdx}>
                              <span className="text-purple-400 font-sans font-bold text-xs mr-2">[{pIdx + 1}]</span>
                              {para}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Question Answers Inspector */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${textTitle} flex items-center gap-1.5`}>
                        <BookOpen className="w-4 h-4 text-purple-400" />
                        פירוט מענה התלמיד לשאלות האנסין ({selectedUnseen.answers?.length || 0} שאלות)
                      </span>
                    </div>

                    {(!selectedUnseen.answers || selectedUnseen.answers.length === 0) ? (
                      <div className={`p-4 rounded-xl border text-center text-xs ${borderStyle} ${textMuted}`}>
                        הגשה זו נשמרה בגרסה קודמת ללא פירוט שאלות מלא (נשמרו ציונים ומדדים כלליים).
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {selectedUnseen.answers.map((ans, idx) => {
                          const isSuccess = (ans as any).isCorrect ?? ans.firstTrySuccess;
                          const isCorrect = ans.firstTrySuccess ?? (isSuccess && ans.attempts === 1);
                          const isPartiallyCorrect = !isCorrect && isSuccess && ans.attempts > 1;
                          const isSkipped = ans.studentAnswer === "skipped" || ans.studentAnswer?.includes("דילג");

                          return (
                            <div 
                              key={idx} 
                              className={`p-4 rounded-xl border text-right space-y-2.5 transition-all ${
                                isCorrect
                                  ? isLight ? "bg-emerald-50/70 border-emerald-300" : "bg-emerald-950/20 border-emerald-500/30"
                                  : isPartiallyCorrect
                                  ? isLight ? "bg-amber-50/70 border-amber-300" : "bg-amber-950/20 border-amber-500/30"
                                  : isLight ? "bg-red-50/70 border-red-300" : "bg-red-950/20 border-red-500/30"
                              }`}
                            >
                              {/* Header */}
                              <div className="flex items-center justify-between flex-row-reverse text-xs">
                                <div className="flex items-center gap-2">
                                  <span className={`font-black ${textTitle}`}>שאלה {ans.questionNumber || idx + 1}</span>
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                                    {ans.type === "mcq" ? "אמריקאית" : ans.type === "open" ? "פתוחה" : ans.type === "copy" ? "העתקת משפט" : ans.type === "true_false" ? "נכון/לא נכון" : "השלמת משפט"}
                                  </span>
                                  {ans.paragraph && (
                                    <span className="text-[10px] text-zinc-400" dir="ltr">
                                      (Par. {ans.paragraph})
                                    </span>
                                  )}
                                </div>

                                <div>
                                  {isCorrect ? (
                                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                                      <CheckCircle2 className="w-3 h-3" />
                                      נכון (ניסיון 1)
                                    </span>
                                  ) : isPartiallyCorrect ? (
                                    <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                                      <AlertCircle className="w-3 h-3" />
                                      נכון (ניסיון 2)
                                    </span>
                                  ) : isSkipped ? (
                                    <span className="text-[10px] font-bold text-zinc-400 bg-zinc-500/10 border border-zinc-500/30 px-2 py-0.5 rounded-full">
                                      דולג
                                    </span>
                                  ) : (
                                    <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                                      <XCircle className="w-3 h-3" />
                                      לא נכון
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Prompt in LTR */}
                              <div className={`text-left font-sans text-xs font-semibold p-2.5 rounded-lg border ${
                                isLight ? "bg-white/80 border-zinc-200 text-zinc-800" : "bg-black/30 border-white/5 text-zinc-200"
                              }`} dir="ltr">
                                {ans.prompt || (ans as any).questionText}
                              </div>

                              {/* Answers Comparison */}
                              <div className="space-y-1.5 text-xs">
                                <div className="flex flex-col gap-1">
                                  <span className="text-[10px] font-bold text-zinc-400">תשובת התלמיד:</span>
                                  <div className={`p-2 rounded-lg text-left text-xs font-mono ${
                                    isCorrect
                                      ? isLight ? "bg-emerald-100/70 text-emerald-900 border border-emerald-300" : "bg-emerald-900/30 text-emerald-200 border border-emerald-700/50"
                                      : isLight ? "bg-rose-100/70 text-rose-900 border border-rose-300" : "bg-rose-900/30 text-rose-200 border border-rose-700/50"
                                  }`} dir="ltr">
                                    {isSkipped ? "(התלמיד בחר לדלג)" : ans.studentAnswer || "(ללא תשובה)"}
                                  </div>
                                </div>

                                {!isCorrect && (
                                  <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-bold text-zinc-400">תשובה נכונה מצופה:</span>
                                    <div className={`p-2 rounded-lg text-left text-xs font-mono ${
                                      isLight ? "bg-emerald-100/70 text-emerald-900 border border-emerald-300" : "bg-emerald-900/30 text-emerald-200 border border-emerald-700/50"
                                    }`} dir="ltr">
                                      {ans.correctAnswer}
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Keywords (if open) */}
                              {ans.type === "open" && (ans.matchedKeywords?.length || ans.missingKeywords?.length) ? (
                                <div className="pt-1 flex flex-wrap gap-1.5 text-[10px]">
                                  {ans.matchedKeywords?.map((kw, kIdx) => (
                                    <span key={kIdx} className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                      ✓ {kw}
                                    </span>
                                  ))}
                                  {ans.missingKeywords?.map((kw, kIdx) => (
                                    <span key={kIdx} className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                                      - {kw}
                                    </span>
                                  ))}
                                </div>
                              ) : null}

                              {/* Explanation */}
                              {ans.explanation && (
                                <p className="text-[11px] text-zinc-400 leading-relaxed bg-black/10 p-2 rounded border border-white/5">
                                  <span className="font-bold text-purple-400">הסבר: </span>
                                  {ans.explanation}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Grading Form footer */}
                <form onSubmit={handleSaveUnseenGrade} className={`p-6 border-t ${borderStyle} ${
                  isLight ? "bg-zinc-50/80" : "bg-[#0b0f19]/40"
                } space-y-4`}>
                  {/* Feedback Presets */}
                  <div className="space-y-1.5 text-right">
                    <span className="text-[10px] text-zinc-400 font-bold block">תבניות משוב מהיר בלחיצה:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {feedbackPresets.map((preset, pIdx) => (
                        <button
                          key={pIdx}
                          type="button"
                          onClick={() => handleAddPreset(preset)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-medium border transition-colors text-right cursor-pointer ${
                            isLight
                              ? "bg-white hover:bg-purple-50 text-purple-700 border-purple-200"
                              : "bg-purple-950/30 hover:bg-purple-900/40 text-purple-300 border-purple-800/50"
                          }`}
                        >
                          + {preset.substring(0, 24)}...
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4 items-end justify-between flex-row-reverse">
                    <div className="w-24 space-y-1 text-right">
                      <label className={`block text-[11px] font-bold ${textTitle}`}>ציון מורה:</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={gradeInput}
                        onChange={(e) => setGradeInput(e.target.value)}
                        className={`w-full px-3 py-2 text-center text-sm font-bold rounded-xl border outline-none ${inputStyle}`}
                        placeholder="0-100"
                        required
                      />
                    </div>
                    
                    <div className="flex-1 space-y-1 text-right">
                      <label className={`block text-[11px] font-bold ${textTitle}`}>הערות המורה ומשוב מקדם למידה:</label>
                      <textarea
                        value={feedbackInput}
                        onChange={(e) => setFeedbackInput(e.target.value)}
                        className={`w-full px-3 py-2 text-xs rounded-xl border outline-none h-14 resize-none ${inputStyle}`}
                        placeholder="כתוב כאן משוב מפורט או בחר תבנית..."
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between flex-row-reverse pt-2">
                    {gradeSuccess ? (
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>הציון והמשוב נשמרו בהצלחה!</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-zinc-500">
                        * עדכון הציון ישנה את הסטטוס של המשימה לנבדק ויופיע לתלמיד.
                      </span>
                    )}

                    <button
                      type="submit"
                      disabled={isGrading}
                      className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md transition-all shrink-0"
                    >
                      {isGrading ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>שומר...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>שמירת ציון ומשוב</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>

              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export function WritingDashboardView({
  writingSubmissions,
  loadingWriting,
  selectedWriting,
  handleSelectWriting,
  handleSaveWritingGrade,
  gradeInput,
  setGradeInput,
  feedbackInput,
  setFeedbackInput,
  isGrading,
  gradeSuccess,
  searchQuery,
  setSearchQuery,
  activeListTab,
  setActiveListTab,
  inputStyle,
  cardStyle,
  borderStyle,
  textTitle,
  textMuted,
  isLight
}: {
  writingSubmissions: WritingAssignment[];
  loadingWriting: boolean;
  selectedWriting: WritingAssignment | null;
  handleSelectWriting: (sub: WritingAssignment) => void;
  handleSaveWritingGrade: (e: React.FormEvent) => void;
  gradeInput: string;
  setGradeInput: (v: string) => void;
  feedbackInput: string;
  setFeedbackInput: (v: string) => void;
  isGrading: boolean;
  gradeSuccess: boolean;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  activeListTab: "all" | "pending" | "graded";
  setActiveListTab: (v: "all" | "pending" | "graded") => void;
  inputStyle: string;
  cardStyle: string;
  borderStyle: string;
  textTitle: string;
  textMuted: string;
  isLight: boolean;
}) {
  const filteredWritingSubmissions = writingSubmissions.filter(sub => {
    const matchesSearch = 
      sub.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sub.studentClass && sub.studentClass.toLowerCase().includes(searchQuery.toLowerCase())) ||
      sub.studentEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sub.prompt && sub.prompt.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (activeListTab === "pending") return matchesSearch && sub.status === "submitted";
    if (activeListTab === "graded") return matchesSearch && sub.status === "graded";
    return matchesSearch;
  });

  return (
    <div className="space-y-8 flex-1 flex flex-col">
      {/* Search and stats bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search input */}
        <div className="relative w-full md:max-w-md">
          <input
            type="text"
            placeholder="חיפוש לפי שם תלמיד, כיתה או הנחיית הכתיבה..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pr-10 pl-4 py-2.5 rounded-xl border text-xs outline-none transition-colors text-right ${inputStyle}`}
          />
          <Search className="w-4 h-4 text-zinc-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
        </div>
        
        <div className="text-right">
          <h2 className={`text-xl font-bold ${textTitle}`}>ניהול הגשות כתיבה (Writing Practice)</h2>
          <p className={`text-xs ${textMuted} mt-1`}>
            הערכת חיבורים ומכתבים של תלמידים, סקירת ניתוח ה-AI, מתן ציון מורה ומשוב מורה.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start flex-1">
        {/* LEFT COLUMN: List of Submissions */}
        <div className="lg:col-span-5 flex flex-col space-y-4 h-full">
          {/* List Header/Sub-tabs */}
          <div className={`p-1.5 rounded-xl ${cardStyle} border ${borderStyle} flex gap-2 flex-row-reverse`}>
            {(["all", "pending", "graded"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveListTab(tab)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeListTab === tab
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-zinc-400 hover:text-[#e8edf8]"
                }`}
              >
                {tab === "all" ? "הכל" : tab === "pending" ? "ממתין" : "נבדק"}
              </button>
            ))}
          </div>

          {/* Submissions List Card */}
          <div className={`p-4 rounded-xl ${cardStyle} border ${borderStyle} flex-1 overflow-y-auto max-h-[460px] space-y-2.5`}>
            {loadingWriting ? (
              <div className="flex flex-col items-center justify-center p-12 space-y-3">
                <RefreshCw className="w-6 h-6 text-purple-500 animate-spin" />
                <span className={`text-xs ${textMuted}`}>טוען הגשות...</span>
              </div>
            ) : filteredWritingSubmissions.length === 0 ? (
              <div className="text-center py-12 text-xs text-zinc-500">
                לא נמצאו הגשות מתאימות.
              </div>
            ) : (
              filteredWritingSubmissions.map((sub) => {
                const isSelected = selectedWriting?.id === sub.id;
                const dateStr = sub.submittedAt 
                  ? new Date(sub.submittedAt.seconds * 1000).toLocaleDateString("he-IL") 
                  : "";
                
                return (
                  <button
                    key={sub.id}
                    onClick={() => handleSelectWriting(sub)}
                    className={`w-full p-3.5 rounded-xl border text-right transition-all flex items-center justify-between gap-3 hover:scale-[1.01] cursor-pointer ${
                      isSelected 
                        ? "border-purple-500 bg-purple-500/5 ring-1 ring-purple-500/20" 
                        : `${borderStyle} ${isLight ? "bg-white hover:bg-zinc-50" : "bg-[#0b0f19] hover:bg-[#111727]"}`
                    }`}
                  >
                    {/* Score or Pending badge */}
                    <div>
                      {sub.status === "graded" ? (
                        <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-lg">
                          {sub.scoreTeacher}
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
                          <span>ממתין</span>
                        </span>
                      )}
                    </div>

                    {/* Student Details */}
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <h4 className={`text-xs font-bold ${textTitle}`}>
                          {sub.studentName} {sub.studentClass ? `(${sub.studentClass})` : ""}
                        </h4>
                        <p className="text-[10px] text-zinc-500 mt-0.5">{sub.studentEmail}</p>
                        <div className="flex gap-2 items-center justify-end mt-1.5 text-[9px] text-zinc-500">
                          <span>הוגש ב: {dateStr}</span>
                          <span>•</span>
                          <span className="px-1 rounded bg-zinc-800 text-purple-400 border border-zinc-700/50">
                            {sub.taskType === "letter" ? "מכתב" : "חיבור"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: Detailed View & Grading Form */}
        <div className="lg:col-span-7 flex flex-col">
          <div className={`rounded-2xl ${cardStyle} border ${borderStyle} flex-1 flex flex-col justify-between overflow-hidden shadow-2xl h-full min-h-[500px]`}>
            
            {!selectedWriting ? (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-xs text-zinc-500 space-y-4">
                <BookOpen className="w-12 h-12 text-zinc-750 animate-pulse" />
                <p className="max-w-xs leading-relaxed">
                  יש לבחור הגשת תלמיד מרשימת ההגשות משמאל כדי לקרוא את הטקסט שלו, לבחון את שגיאות הכתיב/דקדוק והמלצות ה-AI ולהזין ציון מורה ומשוב.
                </p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col h-full overflow-hidden">
                
                {/* Active Sub Header */}
                <div className={`px-6 py-4 border-b ${borderStyle} flex items-center justify-between ${
                  isLight ? "bg-zinc-50" : "bg-[#0b0f19]/70"
                }`}>
                  <div className="text-right">
                    <h3 className={`text-sm font-black ${textTitle}`}>
                      {selectedWriting.studentName} {selectedWriting.studentClass ? `(${selectedWriting.studentClass})` : ""}
                    </h3>
                    <p className="text-[10px] text-zinc-500 mt-0.5">{selectedWriting.studentEmail}</p>
                  </div>
                  <span className="text-xs font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-lg">
                    סוג: {selectedWriting.taskType === "letter" ? "מכתב (Letter)" : "חיבור/פסקה (Essay)"}
                  </span>
                </div>

                {/* Review details */}
                <div className="p-6 flex-1 overflow-y-auto space-y-6 text-right">
                  
                  {/* Prompt Info Box */}
                  <div className={`p-3 rounded-lg border border-l-4 border-l-purple-500 bg-purple-500/5 text-right`}>
                    <span className="text-[10px] text-purple-400 font-bold block mb-1">הנחיית הכתיבה:</span>
                    <p className={`text-xs font-semibold italic ${textTitle}`}>"{selectedWriting.prompt}"</p>
                  </div>

                  {/* Student's text */}
                  <div className="space-y-2">
                    <span className={`block text-xs font-bold ${textTitle}`}>הטקסט שהתלמיד/ה כתב/ה:</span>
                    <p className="bg-black/15 p-4 rounded-xl border border-zinc-800/10 text-sm md:text-base leading-relaxed text-zinc-100 font-medium select-text text-left whitespace-pre-line" dir="ltr" style={{ color: isLight ? '#1f2937' : '#f4f4f5' }}>
                      {selectedWriting.studentText}
                    </p>
                  </div>

                  {/* AI evaluation summary */}
                  <div className={`p-4 rounded-xl border ${borderStyle} ${isLight ? "bg-zinc-50" : "bg-[#0c1222]/30"} space-y-4`}>
                    <div className="flex justify-between items-center flex-row-reverse border-b pb-2 border-zinc-800/10">
                      <span className={`text-xs font-bold ${textTitle}`}>ניתוח ה-AI המובנה במערכת</span>
                      <span className="text-xs font-black text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-lg">
                        ציון AI: {selectedWriting.score}
                      </span>
                    </div>

                    {selectedWriting.evaluation && (
                      <div className="space-y-4 text-xs leading-normal">
                        {/* Structure passed check */}
                        <div className="flex items-center gap-1.5 justify-end">
                          <span className={selectedWriting.evaluation.structureFeedback?.passed ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                            {selectedWriting.evaluation.structureFeedback?.details || "מבנה מכתב/חיבור"}
                          </span>
                          <span className="font-bold">:בדיקת מבנה</span>
                        </div>

                        {/* Grammar Feedback */}
                        <div className="space-y-1">
                          <span className={`block font-bold ${textTitle}`}>משוב דקדוקי כללי מה-AI:</span>
                          <p className={`text-zinc-400 leading-relaxed bg-black/10 p-3 rounded-lg text-[11px]`}>{selectedWriting.evaluation.grammarFeedback}</p>
                        </div>

                        {/* Corrections list */}
                        {selectedWriting.evaluation.corrections && selectedWriting.evaluation.corrections.length > 0 && (
                          <div className="space-y-2">
                            <span className={`block font-bold ${textTitle}`}>תיקוני מילים ודקדוק ספציפיים ({selectedWriting.evaluation.corrections.length}):</span>
                            <div className="border border-zinc-800/10 rounded-xl overflow-hidden text-[11px] leading-normal">
                              <div className="grid grid-cols-3 bg-black/25 p-2 font-bold border-b border-zinc-800/10 text-center">
                                <span>הסבר (בעברית)</span>
                                <span>הצעה לתיקון</span>
                                <span>מקור</span>
                              </div>
                              {selectedWriting.evaluation.corrections.map((corr, idx) => (
                                <div key={idx} className="grid grid-cols-3 p-2 border-b border-zinc-800/5 hover:bg-black/5 text-center items-center">
                                  <span className="text-zinc-450 text-right">{corr.explanation}</span>
                                  <span className="text-emerald-400 font-bold font-mono" dir="ltr">{corr.corrected}</span>
                                  <span className="text-rose-400 font-mono line-through" dir="ltr">{corr.original}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Improved Version */}
                        {selectedWriting.evaluation.improvedVersion && (
                          <div className="space-y-1">
                            <span className={`block font-bold ${textTitle}`}>גרסה משופרת מומלצת על ידי ה-AI:</span>
                            <p className="bg-emerald-500/5 p-3 rounded-lg border border-emerald-500/10 font-mono text-emerald-400 text-[11px] text-left" dir="ltr">
                              {selectedWriting.evaluation.improvedVersion}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                </div>

                {/* Grading Form footer */}
                <form onSubmit={handleSaveWritingGrade} className={`p-6 border-t ${borderStyle} ${
                  isLight ? "bg-zinc-50/50" : "bg-[#0b0f19]/30"
                } space-y-4`}>
                  <div className="flex gap-4 items-end justify-between flex-row-reverse">
                    <div className="w-24 space-y-1 text-right">
                      <label className={`block text-[11px] font-bold ${textTitle}`}>ציון מורה:</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={gradeInput}
                        onChange={(e) => setGradeInput(e.target.value)}
                        className={`w-full px-3 py-2 text-center text-sm font-bold rounded-xl border outline-none ${inputStyle}`}
                        placeholder="0-100"
                        required
                      />
                    </div>
                    
                    <div className="flex-1 space-y-1 text-right">
                      <label className={`block text-[11px] font-bold ${textTitle}`}>הערות המורה ומשוב מקדם למידה:</label>
                      <textarea
                        value={feedbackInput}
                        onChange={(e) => setFeedbackInput(e.target.value)}
                        className={`w-full px-3 py-2 text-xs rounded-xl border outline-none h-14 resize-none ${inputStyle}`}
                        placeholder="כתוב כאן משוב מפורט..."
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between flex-row-reverse pt-2">
                    {gradeSuccess ? (
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>הציון והמשוב נשמרו בהצלחה!</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-zinc-500">
                        * עדכון הציון ישנה את הסטטוס של המשימה לנבדק ויופיע לתלמיד.
                      </span>
                    )}

                    <button
                      type="submit"
                      disabled={isGrading}
                      className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md transition-all shrink-0"
                    >
                      {isGrading ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>שומר...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>שמירת ציון ומשוב</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>

              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
