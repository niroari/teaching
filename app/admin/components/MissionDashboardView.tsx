"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { collection, doc, getDocs, orderBy, query, serverTimestamp, updateDoc } from "firebase/firestore";
import { CheckCircle2, Clock, Loader2, RefreshCw, RotateCcw, Save, Search, XCircle } from "lucide-react";
import { dbFirestore } from "@/lib/firebase";
import {
  AGE_KEY,
  BLANK_SOURCE_KEY,
  BONUS_MAX,
  RUBRIC,
  SOURCES_KEY,
  STAGES,
  TERM_GROUPS,
  blankKey,
  cellKey,
  getDestination,
  valueKey,
  type CheckId,
  type MissionTeam,
  type Question,
} from "@/lib/data/mission-new-home";
import { ANSWER_KEY, QUESTION_NOTES } from "@/lib/mission/answer-key";

interface Props {
  isTeacher: boolean;
  demo: boolean;
  inputStyle: string;
  cardStyle: string;
  borderStyle: string;
  textTitle: string;
  textMuted: string;
  isLight: boolean;
}

const TEAMS = "mission_teams";

const DEMO_TEAM: MissionTeam = {
  id: "DEMO42",
  destinationId: "mars",
  memberIds: ["demo-a", "demo-b"],
  members: [
    { uid: "demo-a", name: "נועה כהן", studentClass: "ח׳2" },
    { uid: "demo-b", name: "איתי לוי", studentClass: "ח׳2" },
  ],
  answers: {
    [blankKey("blank1")]: "0.38",
    [blankKey("blank2")]: "687",
    [BLANK_SOURCE_KEY]: "אתר נאס״א – https://science.nasa.gov/mars/",
    s1q1: "מערכת כדור הארץ היא כל החלקים של כדור הארץ שקשורים זה לזה...",
    [valueKey("s2q6")]: "38",
    s2q6: "55,000,000 ÷ 60,000 = 917 שעות, ÷ 24 = 38 ימים.",
    [valueKey("s2q8")]: "19",
    s3q5: "העונות לא נגרמות מהמרחק אלא מנטיית ציר הסיבוב...",
    [SOURCES_KEY]: "נאס״א – https://science.nasa.gov/mars/",
  },
  drawings: {},
  checks: {
    blank1: { correct: true, attempts: 1, value: "0.38" },
    blank2: { correct: true, attempts: 2, value: "687" },
    travel: { correct: true, attempts: 1, value: "38" },
    weight: { correct: false, attempts: 3, value: "19" },
  },
  termsChecked: ["שנת אור", "כוח הכבידה", "נטיית ציר הסיבוב"],
  stageOwners: { s1: "נועה כהן", s2: "איתי לוי" },
  status: "submitted",
  submittedAt: { seconds: Math.floor(Date.now() / 1000) },
  updatedAt: { seconds: Math.floor(Date.now() / 1000) },
};

const formatDate = (ts?: { seconds: number } | null) =>
  ts ? new Date(ts.seconds * 1000).toLocaleString("he-IL", { dateStyle: "short", timeStyle: "short" }) : "—";

function questionNumbers(questions: Question[]) {
  const map = new Map<string, number>();
  let n = 0;
  for (const q of questions) {
    if (q.kind !== "drawing") n += 1;
    map.set(q.id, n);
  }
  return map;
}

const STATUS_LABEL: Record<MissionTeam["status"], string> = {
  draft: "בעבודה",
  submitted: "ממתין לבדיקה",
  graded: "נבדק",
};

export default function MissionDashboardView({
  isTeacher,
  demo,
  inputStyle,
  cardStyle,
  borderStyle,
  textTitle,
  textMuted,
  isLight,
}: Props) {
  const [teams, setTeams] = useState<MissionTeam[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "draft" | "submitted" | "graded">("submitted");

  const [scores, setScores] = useState<Record<string, string>>({});
  const [bonus, setBonus] = useState("");
  const [stageFeedback, setStageFeedback] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    if (!isTeacher || demo) {
      setTeams(demo ? [DEMO_TEAM] : []);
      return;
    }
    setLoading(true);
    try {
      const snap = await getDocs(query(collection(dbFirestore, TEAMS), orderBy("updatedAt", "desc")));
      setTeams(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<MissionTeam, "id">) })));
    } catch (err) {
      console.error("Error fetching mission teams:", err);
    } finally {
      setLoading(false);
    }
  }, [isTeacher, demo]);

  useEffect(() => {
    // Loading from Firestore is the external system this effect syncs with.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const selected = teams.find((t) => t.id === selectedId) ?? null;

  const select = (team: MissionTeam) => {
    setSelectedId(team.id);
    setScores(Object.fromEntries(RUBRIC.map((c) => [c.id, team.rubricScores?.[c.id] !== undefined ? String(team.rubricScores[c.id]) : ""])));
    setBonus(team.bonus ? String(team.bonus) : "");
    setStageFeedback(team.stageFeedback ?? {});
    setFeedback(team.feedbackTeacher ?? "");
    setSaved(false);
  };

  const filtered = useMemo(() => {
    const q = search.trim();
    return teams.filter((t) => {
      if (filter !== "all" && t.status !== filter) return false;
      if (!q) return true;
      const dest = getDestination(t.destinationId)?.name ?? "";
      return (
        dest.includes(q) ||
        t.id.includes(q.toUpperCase()) ||
        t.members.some((m) => m.name.includes(q) || m.studentClass.includes(q))
      );
    });
  }, [teams, search, filter]);

  const clamp = (v: string, max: number) => Math.max(0, Math.min(max, Number(v) || 0));
  const total = RUBRIC.reduce((s, c) => s + clamp(scores[c.id] ?? "", c.max), 0) + clamp(bonus, BONUS_MAX);

  const patchLocal = (id: string, patch: Partial<MissionTeam>) =>
    setTeams((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));

  const saveGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    const rubricScores = Object.fromEntries(RUBRIC.map((c) => [c.id, clamp(scores[c.id] ?? "", c.max)]));
    const patch = {
      rubricScores,
      bonus: clamp(bonus, BONUS_MAX),
      stageFeedback,
      feedbackTeacher: feedback,
      scoreTeacher: total,
      status: "graded" as const,
    };
    setSaving(true);
    try {
      if (!demo) await updateDoc(doc(dbFirestore, TEAMS, selected.id), { ...patch, gradedAt: serverTimestamp() });
      patchLocal(selected.id, patch);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error("Error saving mission grade:", err);
      window.alert("שמירת הציון נכשלה.");
    } finally {
      setSaving(false);
    }
  };

  const returnForRevision = async () => {
    if (!selected || !window.confirm("להחזיר את העבודה לתלמידים לתיקון? הם יוכלו לערוך ולהגיש שוב.")) return;
    try {
      if (!demo) await updateDoc(doc(dbFirestore, TEAMS, selected.id), { status: "draft" });
      patchLocal(selected.id, { status: "draft" });
    } catch (err) {
      console.error("Error returning mission:", err);
      window.alert("הפעולה נכשלה.");
    }
  };

  const soft = isLight ? "bg-zinc-50 border-zinc-200" : "bg-white/[0.03] border-white/10";
  const keyBox = isLight ? "bg-amber-50 border-amber-200 text-amber-900" : "bg-amber-400/10 border-amber-400/30 text-amber-100";

  const answer = (value?: string) =>
    value && value.trim() ? (
      <p className="text-sm whitespace-pre-wrap leading-relaxed">{value}</p>
    ) : (
      <p className={`text-xs italic ${textMuted}`}>לא נענה</p>
    );

  const checkBadge = (team: MissionTeam, id: CheckId) => {
    const c = team.checks?.[id];
    if (!c) return <span className={`text-[11px] ${textMuted}`}>לא נבדק</span>;
    return (
      <span className={`inline-flex items-center gap-1 text-[11px] font-bold ${c.correct ? "text-emerald-500" : "text-rose-500"}`}>
        {c.correct ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
        {c.correct ? "נכון" : "שגוי"} · {c.attempts} ניסיונות
      </span>
    );
  };

  const renderQuestion = (team: MissionTeam, q: Question, n: number) => {
    const a = team.answers ?? {};
    const dest = ANSWER_KEY[team.destinationId];
    return (
      <div key={q.id} className={`rounded-xl border p-3 space-y-2 ${soft}`}>
        <p className={`text-xs font-bold ${textTitle}`}>
          {q.challenge ? "★ " : `${n}. `}
          {q.prompt}
        </p>
        {q.kind === "drawing" ? (
          team.drawings?.[q.id] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={team.drawings[q.id]} alt="שרטוט התלמידים" className={`w-full max-w-md rounded-lg border ${borderStyle}`} />
          ) : (
            <p className={`text-xs italic ${textMuted}`}>אין שרטוט</p>
          )
        ) : q.kind === "table" || q.kind === "score" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <tbody>
                {(q.rows ?? []).map((row, r) => (
                  <tr key={row} className={`border-t ${borderStyle}`}>
                    <td className="p-1.5 font-bold whitespace-nowrap align-top">{row}</td>
                    {Array.from({ length: q.kind === "score" ? 2 : q.cols?.length ?? 0 }, (_, c) => (
                      <td key={c} className="p-1.5 align-top whitespace-pre-wrap">
                        {a[cellKey(q.id, r, c)] || <span className={textMuted}>—</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <>
            {q.kind === "check" && q.check && (
              <div className="flex flex-wrap items-center gap-3 text-sm">
                {q.check === "age" && <span>גיל: {a[AGE_KEY] || "—"}</span>}
                <span className="font-bold">תשובה: {a[valueKey(q.id)] || "—"}</span>
                {checkBadge(team, q.check)}
              </div>
            )}
            {answer(a[q.id])}
          </>
        )}
        {(QUESTION_NOTES[q.id] || (q.check && dest.display[q.check])) && (
          <div className={`rounded-lg border px-2.5 py-1.5 text-xs leading-relaxed ${keyBox}`}>
            <b>מפתח: </b>
            {q.check && dest.display[q.check] && <span>{dest.display[q.check]}. </span>}
            {QUESTION_NOTES[q.id]}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-right" dir="rtl">
      {/* List */}
      <div className={`lg:col-span-4 rounded-2xl border p-4 space-y-3 ${cardStyle} ${borderStyle}`}>
        <div className="flex items-center justify-between">
          <h2 className={`text-sm font-black ${textTitle}`}>משימת בית חדש ({teams.length})</h2>
          <button type="button" onClick={load} className={`p-1.5 rounded-lg cursor-pointer ${textMuted} hover:text-purple-400`} title="רענון">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
        <div className="relative">
          <Search className={`absolute right-3 top-2.5 w-4 h-4 ${textMuted}`} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="חיפוש שם, כיתה, יעד או קוד"
            className={`w-full rounded-xl border pr-9 pl-3 py-2 text-xs outline-none ${inputStyle}`}
          />
        </div>
        <div className="flex flex-wrap gap-1">
          {(["submitted", "graded", "draft", "all"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer border ${
                filter === f ? "border-purple-500 text-purple-400 bg-purple-500/10" : `${borderStyle} ${textMuted}`
              }`}
            >
              {f === "all" ? "הכל" : STATUS_LABEL[f]} ({f === "all" ? teams.length : teams.filter((t) => t.status === f).length})
            </button>
          ))}
        </div>
        <div className="space-y-2 max-h-[65vh] overflow-y-auto">
          {loading && <Loader2 className="w-5 h-5 animate-spin mx-auto text-purple-400" />}
          {!loading && filtered.length === 0 && <p className={`text-xs text-center py-6 ${textMuted}`}>אין עבודות להצגה.</p>}
          {filtered.map((t) => {
            const d = getDestination(t.destinationId);
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => select(t)}
                className={`w-full text-right rounded-xl border p-3 cursor-pointer transition-colors ${
                  selectedId === t.id ? "border-purple-500 bg-purple-500/10" : `${soft} hover:border-purple-400/50`
                }`}
              >
                <div className={`text-sm font-bold ${textTitle}`}>
                  {d?.emoji} {t.members.map((m) => m.name).join(" ו")}
                </div>
                <div className={`text-[11px] mt-0.5 ${textMuted}`}>
                  {d?.name} · {t.members[0]?.studentClass} · {t.id}
                </div>
                <div className="flex items-center justify-between mt-1.5 text-[11px]">
                  <span className={t.status === "graded" ? "text-emerald-500 font-bold" : t.status === "submitted" ? "text-amber-500 font-bold" : textMuted}>
                    {STATUS_LABEL[t.status]}
                    {t.status === "graded" && ` · ${t.scoreTeacher}`}
                  </span>
                  <span className={`flex items-center gap-1 ${textMuted}`}>
                    <Clock className="w-3 h-3" />
                    {formatDate(t.submittedAt ?? t.updatedAt)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detail */}
      <div className="lg:col-span-8 space-y-4">
        {!selected ? (
          <div className={`rounded-2xl border p-10 text-center text-sm ${cardStyle} ${borderStyle} ${textMuted}`}>
            בחרו עבודה מהרשימה כדי לבדוק אותה.
          </div>
        ) : (
          <>
            <div className={`rounded-2xl border p-5 space-y-3 ${cardStyle} ${borderStyle}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className={`text-lg font-black ${textTitle}`}>
                    {getDestination(selected.destinationId)?.emoji} {getDestination(selected.destinationId)?.name} · קוד {selected.id}
                  </h3>
                  <p className={`text-xs ${textMuted}`}>
                    {selected.members.map((m) => `${m.name} (${m.studentClass})`).join(" · ")} · {STATUS_LABEL[selected.status]} ·
                    הוגש {formatDate(selected.submittedAt)}
                  </p>
                </div>
                {selected.status !== "draft" && (
                  <button
                    type="button"
                    onClick={returnForRevision}
                    className={`px-3 py-1.5 rounded-lg text-xs border flex items-center gap-1.5 cursor-pointer ${borderStyle} ${textMuted} hover:text-purple-400`}
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> החזרה לתיקון
                  </button>
                )}
              </div>

              <div className={`rounded-xl border p-3 space-y-2 ${soft}`}>
                <p className={`text-xs font-bold ${textTitle}`}>נתונים חסרים ומקור</p>
                {getDestination(selected.destinationId)?.blanks.map((b) => (
                  <div key={b.id} className="flex flex-wrap items-center gap-3 text-sm">
                    <span>
                      {b.label}: <b>{selected.answers?.[blankKey(b.id)] || "—"}</b> {b.unit}
                    </span>
                    {checkBadge(selected, b.id)}
                    <span className={`text-xs rounded border px-1.5 py-0.5 ${keyBox}`}>מפתח: {ANSWER_KEY[selected.destinationId].display[b.id]}</span>
                  </div>
                ))}
                {answer(selected.answers?.[BLANK_SOURCE_KEY])}
              </div>
            </div>

            {STAGES.map((stage) => {
              const numbers = questionNumbers(stage.sections.flatMap((sec) => sec.questions));
              const notes = ANSWER_KEY[selected.destinationId].notes;
              return (
                <div key={stage.id} className={`rounded-2xl border p-5 space-y-3 ${cardStyle} ${borderStyle}`}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className={`text-base font-black ${textTitle}`}>
                      {stage.short}: {stage.title}
                    </h4>
                    <span className={`text-xs ${textMuted}`}>הוביל: {selected.stageOwners?.[stage.id] || "לא צוין"}</span>
                  </div>
                  {stage.id === "s3" && (
                    <div className={`rounded-lg border px-3 py-2 text-xs leading-relaxed space-y-0.5 ${keyBox}`}>
                      <div>
                        <b>יום ולילה:</b> {notes.dayNight}
                      </div>
                      <div>
                        <b>עונות:</b> {notes.seasons}
                      </div>
                      <div>
                        <b>שמיים:</b> {notes.sky}
                      </div>
                      <div>
                        <b>ליקויים:</b> {notes.eclipses}
                      </div>
                    </div>
                  )}
                  {stage.id === "s4" && (
                    <div className={`rounded-lg border px-3 py-2 text-xs ${keyBox}`}>
                      <b>משימה לדוגמה:</b> {notes.mission}
                    </div>
                  )}
                  {stage.id === "s5" && (
                    <div className={`rounded-lg border px-3 py-2 text-xs ${keyBox}`}>
                      <b>המלצה סבירה:</b> {notes.recommendation}
                    </div>
                  )}
                  {stage.sections
                    .flatMap((sec) => sec.questions)
                    .map((q) => renderQuestion(selected, q, numbers.get(q.id) ?? 0))}
                  <textarea
                    rows={2}
                    value={stageFeedback[stage.id] ?? ""}
                    onChange={(e) => setStageFeedback((prev) => ({ ...prev, [stage.id]: e.target.value }))}
                    placeholder={`הערה לתלמידים על ${stage.short} (תופיע אצלם בראש השלב)`}
                    className={`w-full rounded-xl border px-3 py-2 text-xs outline-none ${inputStyle}`}
                  />
                </div>
              );
            })}

            <div className={`rounded-2xl border p-5 space-y-3 ${cardStyle} ${borderStyle}`}>
              <h4 className={`text-base font-black ${textTitle}`}>מונחים ומקורות</h4>
              <div className="flex flex-wrap gap-1.5">
                {TERM_GROUPS.flatMap((g) => g.terms).map((term) => {
                  const on = selected.termsChecked?.includes(term);
                  return (
                    <span
                      key={term}
                      className={`text-[11px] rounded-full px-2 py-0.5 border ${
                        on ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-500" : `${borderStyle} ${textMuted}`
                      }`}
                    >
                      {on ? "✓ " : ""}
                      {term}
                    </span>
                  );
                })}
              </div>
              {answer(selected.answers?.[SOURCES_KEY])}
            </div>

            <form onSubmit={saveGrade} className={`rounded-2xl border p-5 space-y-3 sticky bottom-4 ${cardStyle} ${borderStyle}`}>
              <h4 className={`text-base font-black ${textTitle}`}>ציון לפי המחוון</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {RUBRIC.map((c) => (
                  <label key={c.id} className="space-y-1" title={`מצוין: ${c.excellent}`}>
                    <span className={`text-[11px] font-bold ${textMuted}`}>
                      {c.title} (/{c.max})
                    </span>
                    <input
                      type="number"
                      min={0}
                      max={c.max}
                      value={scores[c.id] ?? ""}
                      onChange={(e) => setScores((prev) => ({ ...prev, [c.id]: e.target.value }))}
                      className={`w-full rounded-lg border px-2 py-1.5 text-sm text-center outline-none ${inputStyle}`}
                    />
                  </label>
                ))}
                <label className="space-y-1">
                  <span className={`text-[11px] font-bold ${textMuted}`}>בונוס (/{BONUS_MAX})</span>
                  <input
                    type="number"
                    min={0}
                    max={BONUS_MAX}
                    value={bonus}
                    onChange={(e) => setBonus(e.target.value)}
                    className={`w-full rounded-lg border px-2 py-1.5 text-sm text-center outline-none ${inputStyle}`}
                  />
                </label>
                <div className="flex flex-col justify-end">
                  <span className={`text-[11px] font-bold ${textMuted}`}>סך הכול</span>
                  <span className="text-2xl font-black text-purple-400">{total}</span>
                </div>
              </div>
              <textarea
                rows={3}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="משוב כללי לצוות"
                className={`w-full rounded-xl border px-3 py-2 text-sm outline-none ${inputStyle}`}
              />
              <button
                type="submit"
                disabled={saving}
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl cursor-pointer text-sm flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                {saved ? "הציון נשמר" : "שמירת ציון ומשוב"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
