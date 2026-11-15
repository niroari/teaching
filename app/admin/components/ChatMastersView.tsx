"use client";

import React from "react";
import { Search, RefreshCw, CheckCircle, Check, MessagesSquare } from "lucide-react";

export interface ChatAssignment {
  id: string;
  studentId: string;
  studentName: string;
  studentClass: string;
  studentEmail: string;
  character: string;
  messages: Array<{ sender: "user" | "bot"; text: string; timestamp: string }>;
  exitTicketLearned: string;
  exitTicketPenPal: string;
  submittedAt: any;
  status: "submitted" | "graded";
  score: number | null;
  feedback: string | null;
  customCharacterName?: string;
}

const CHARACTERS_MAP: Record<string, { name: string; avatar: string }> = {
  astronaut: { name: "Buddy", avatar: "👨‍🚀" },
  superhero: { name: "Hero", avatar: "🦸‍♂️" },
  builder: { name: "Alex", avatar: "👷" },
  cat: { name: "Luna", avatar: "🐱" },
  sam: { name: "Sam", avatar: "🧑" },
};

const characterOf = (sub: ChatAssignment) =>
  sub.character === "custom"
    ? { name: sub.customCharacterName || "Custom", avatar: "🎭" }
    : CHARACTERS_MAP[sub.character] || { name: sub.character, avatar: "🤖" };

type ListTab = "all" | "pending" | "graded";

interface Props {
  submissions: ChatAssignment[];
  loading: boolean;
  selectedSub: ChatAssignment | null;
  handleSelectSub: (sub: ChatAssignment) => void;
  handleSaveGrade: (e: React.FormEvent) => void;
  gradeInput: string;
  setGradeInput: (v: string) => void;
  feedbackInput: string;
  setFeedbackInput: (v: string) => void;
  isGrading: boolean;
  gradeSuccess: boolean;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  activeListTab: ListTab;
  setActiveListTab: (v: ListTab) => void;
  inputStyle: string;
  cardStyle: string;
  borderStyle: string;
  textTitle: string;
  textMuted: string;
  isLight: boolean;
}

export default function ChatMastersView({
  submissions,
  loading,
  selectedSub,
  handleSelectSub,
  handleSaveGrade,
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
  isLight,
}: Props) {
  const q = searchQuery.toLowerCase();
  const filtered = submissions.filter((sub) => {
    const matches =
      sub.studentName.toLowerCase().includes(q) ||
      (sub.studentClass && sub.studentClass.toLowerCase().includes(q)) ||
      sub.studentEmail.toLowerCase().includes(q);
    if (activeListTab === "pending") return matches && sub.status === "submitted";
    if (activeListTab === "graded") return matches && sub.status === "graded";
    return matches;
  });

  const totalCount = submissions.length;
  const graded = submissions.filter((s) => s.status === "graded");
  const gradedCount = graded.length;
  const pendingCount = totalCount - gradedCount;
  const avgScore =
    gradedCount > 0 ? Math.round(graded.reduce((sum, s) => sum + (s.score || 0), 0) / gradedCount) : 0;

  const subtle = isLight ? "bg-zinc-50" : "bg-white/[0.02]";
  const rowHover = isLight ? "hover:bg-zinc-50" : "hover:bg-white/[0.03]";
  const rowActive = isLight ? "bg-zinc-100" : "bg-white/[0.06]";
  const segActive = isLight ? "bg-white text-zinc-900 shadow-sm" : "bg-white/[0.08] text-zinc-100";

  const stats = [
    { label: "סה״כ הגשות", value: totalCount },
    { label: "ממתינות לבדיקה", value: pendingCount },
    { label: "נבדקו", value: gradedCount },
    { label: "ממוצע ציונים", value: avgScore },
  ];

  return (
    <div className="space-y-6 flex-1 flex flex-col text-right">
      {/* Stats */}
      <div className={`grid grid-cols-2 md:grid-cols-4 rounded-lg border ${borderStyle} ${cardStyle} divide-x divide-x-reverse ${isLight ? "divide-zinc-200" : "divide-white/[0.07]"}`}>
        {stats.map((s) => (
          <div key={s.label} className="px-4 py-3">
            <div className={`text-xs ${textMuted}`}>{s.label}</div>
            <div className={`text-xl font-semibold tabular-nums mt-0.5 ${textTitle}`}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch flex-1 min-h-[520px]">
        {/* List */}
        <div className={`lg:col-span-5 rounded-lg border ${borderStyle} ${cardStyle} flex flex-col overflow-hidden`}>
          <div className={`p-3 space-y-2.5 border-b ${borderStyle}`}>
            <div className="relative">
              <Search className={`w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 ${textMuted}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="חיפוש לפי שם, כיתה או אימייל"
                className={`w-full pr-9 pl-3 py-2 text-sm rounded-md border outline-none ${inputStyle}`}
              />
            </div>
            <div className={`grid grid-cols-3 gap-1 p-0.5 rounded-md text-xs font-medium ${isLight ? "bg-zinc-100" : "bg-white/[0.03]"}`}>
              {(
                [
                  ["all", `הכל ${totalCount}`],
                  ["pending", `ממתין ${pendingCount}`],
                  ["graded", `נבדק ${gradedCount}`],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveListTab(id)}
                  className={`py-1.5 rounded cursor-pointer transition-colors ${
                    activeListTab === id ? segActive : textMuted
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[520px]">
            {loading ? (
              <div className={`flex items-center justify-center gap-2 p-12 text-sm ${textMuted}`}>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>טוען הגשות…</span>
              </div>
            ) : filtered.length === 0 ? (
              <div className={`text-center py-12 text-sm ${textMuted}`}>לא נמצאו הגשות מתאימות.</div>
            ) : (
              <ul className={`divide-y ${isLight ? "divide-zinc-100" : "divide-white/[0.05]"}`}>
                {filtered.map((sub) => {
                  const isSelected = selectedSub?.id === sub.id;
                  const ch = characterOf(sub);
                  const dateStr = sub.submittedAt
                    ? new Date(sub.submittedAt.seconds * 1000).toLocaleDateString("he-IL")
                    : "";
                  return (
                    <li key={sub.id}>
                      <button
                        type="button"
                        onClick={() => handleSelectSub(sub)}
                        className={`w-full px-4 py-3 text-right flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                          isSelected ? rowActive : rowHover
                        }`}
                      >
                        <div className="min-w-0">
                          <div className={`text-sm font-medium truncate ${textTitle}`}>
                            {sub.studentName}
                            {sub.studentClass && <span className={`font-normal ${textMuted}`}> · {sub.studentClass}</span>}
                          </div>
                          <div className={`text-xs mt-0.5 truncate ${textMuted}`}>
                            {dateStr} · {ch.avatar} {ch.name}
                          </div>
                        </div>
                        {sub.status === "graded" ? (
                          <span className={`text-sm font-semibold tabular-nums ${textTitle}`}>{sub.score}</span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-xs text-amber-500 shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            ממתין
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {/* Detail */}
        <div className={`lg:col-span-7 rounded-lg border ${borderStyle} ${cardStyle} flex flex-col overflow-hidden min-h-[520px]`}>
          {!selectedSub ? (
            <div className={`flex-1 flex flex-col items-center justify-center p-12 text-center text-sm gap-3 ${textMuted}`}>
              <MessagesSquare className="w-8 h-8 opacity-40" strokeWidth={1.5} />
              <p className="max-w-xs leading-relaxed">בחרו הגשה מהרשימה כדי לקרוא את השיחה ולתת ציון ומשוב.</p>
            </div>
          ) : (
            <>
              <div className={`px-5 py-4 border-b ${borderStyle} flex items-center justify-between gap-3`}>
                <div className="min-w-0">
                  <h3 className={`text-base font-semibold ${textTitle}`}>
                    {selectedSub.studentName}
                    {selectedSub.studentClass && (
                      <span className={`font-normal ${textMuted}`}> · {selectedSub.studentClass}</span>
                    )}
                  </h3>
                  <p className={`text-xs mt-0.5 ${textMuted}`} dir="ltr" style={{ textAlign: "right" }}>
                    {selectedSub.studentEmail}
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-md border ${borderStyle} ${textMuted} shrink-0`}>
                  שותף שיחה: {characterOf(selectedSub).avatar} {characterOf(selectedSub).name}
                </span>
              </div>

              <div className="flex-1 p-5 overflow-y-auto space-y-6 max-h-[420px]">
                <section className="space-y-2">
                  <h4 className={`text-xs font-medium ${textMuted}`}>תמלול השיחה</h4>
                  <div className={`p-4 rounded-md border ${borderStyle} ${subtle} space-y-3 max-h-[260px] overflow-y-auto`}>
                    {selectedSub.messages.map((msg, idx) => {
                      const isUser = msg.sender === "user";
                      return (
                        <div key={idx} className={`flex w-full ${isUser ? "justify-start" : "justify-end"}`}>
                          <div
                            dir="ltr"
                            className={`max-w-[85%] rounded-lg px-3 py-2 text-sm leading-relaxed ${
                              isUser
                                ? isLight
                                  ? "bg-zinc-900 text-white"
                                  : "bg-zinc-100 text-zinc-900"
                                : `border ${borderStyle} ${isLight ? "bg-white text-zinc-800" : "bg-white/[0.03] text-zinc-200"}`
                            }`}
                          >
                            <div className="text-[11px] mb-0.5 opacity-60 font-medium">
                              {isUser ? selectedSub.studentName : characterOf(selectedSub).name}
                            </div>
                            <p className="text-left break-words">{msg.text}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                <section className="space-y-2">
                  <h4 className={`text-xs font-medium ${textMuted}`}>כרטיס יציאה</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className={`p-3 rounded-md border ${borderStyle}`}>
                      <span className={`block text-xs ${textMuted}`}>דבר אחד שלמדתי</span>
                      <p className={`mt-1 text-sm leading-relaxed ${textTitle}`}>{selectedSub.exitTicketLearned}</p>
                    </div>
                    <div className={`p-3 rounded-md border ${borderStyle}`}>
                      <span className={`block text-xs ${textMuted}`}>3 שאלות לחבר לעט</span>
                      <p className={`mt-1 text-sm leading-relaxed whitespace-pre-wrap ${textTitle}`} dir="ltr">
                        {selectedSub.exitTicketPenPal}
                      </p>
                    </div>
                  </div>
                </section>
              </div>

              <form onSubmit={handleSaveGrade} className={`p-5 border-t ${borderStyle} ${subtle} space-y-3`}>
                <div className="grid grid-cols-4 gap-3">
                  <div className="col-span-3 space-y-1">
                    <label className={`block text-xs ${textMuted}`}>משוב</label>
                    <input
                      type="text"
                      value={feedbackInput}
                      onChange={(e) => setFeedbackInput(e.target.value)}
                      placeholder="משוב קצר לתלמיד"
                      className={`w-full px-3 py-2 text-sm rounded-md border outline-none ${inputStyle}`}
                    />
                  </div>
                  <div className="col-span-1 space-y-1">
                    <label className={`block text-xs ${textMuted}`}>ציון</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={gradeInput}
                      onChange={(e) => setGradeInput(e.target.value)}
                      placeholder="0–100"
                      className={`w-full px-3 py-2 text-sm rounded-md border outline-none text-center tabular-nums ${inputStyle}`}
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center gap-3">
                  {gradeSuccess ? (
                    <span className="text-xs text-emerald-500 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> נשמר
                    </span>
                  ) : (
                    <span />
                  )}
                  <button
                    type="submit"
                    disabled={isGrading}
                    className="px-4 py-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-medium text-sm rounded-md cursor-pointer transition-colors flex items-center gap-1.5"
                  >
                    {isGrading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                    <span>{isGrading ? "שומר…" : "שמירת ציון"}</span>
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
