"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { collection, doc, getDocs, orderBy, query, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Download,
  Loader2,
  RefreshCw,
  RotateCcw,
  Save,
  Search,
  Sparkles,
  Upload,
  Wand2,
  XCircle,
} from "lucide-react";
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
// AI grading drafts made with the /grade-mission Claude Code skill. Teacher-only
// (see firestore.rules); kept off the team doc because students can read that.
const AI_REVIEWS = "mission_ai_reviews";

interface AiReview {
  teamId: string;
  criteria: { id: string; level: "excellent" | "good" | "needs_improvement"; score: number; justification: string }[];
  bonus: number;
  bonusReason: string;
  stageFeedback: Record<string, string>;
  generalFeedback: string;
  teacherFlags: string[];
  total: number;
}

const LEVEL_LABEL: Record<AiReview["criteria"][number]["level"], string> = {
  excellent: "מצוין",
  good: "טוב",
  needs_improvement: "דרוש שיפור",
};

const isAiReview = (r: unknown): r is AiReview => {
  const v = r as AiReview;
  return Boolean(v && typeof v.teamId === "string" && Array.isArray(v.criteria) && typeof v.total === "number");
};

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

const DEMO_REVIEW: AiReview = {
  teamId: "DEMO42",
  criteria: [
    { id: "terms", level: "good", score: 24, justification: "רוב המונחים מופיעים (שנת אור, כוח הכבידה, נטיית ציר). חסרים מונחי שלב 1 ומופעי הירח." },
    { id: "accuracy", level: "excellent", score: 22, justification: "תיקון טעות העונות נכון (s3q5). שנת אור הוגדרה כיחידת זמן (s2q4)." },
    { id: "calc", level: "good", score: 8, justification: "זמן המסע והמשקל נכונים עם דרך. המשקל נבדק כשגוי במערכת 3 פעמים." },
    { id: "research", level: "excellent", score: 10, justification: "שני הנתונים נמצאו, מקור נאס\"א." },
    { id: "recommendation", level: "good", score: 12, justification: "חלק מהתשובות חסרות בדוגמה." },
    { id: "organization", level: "good", score: 8, justification: "חלוקת עבודה מצוינת לשני שלבים בלבד." },
  ],
  bonus: 0,
  bonusReason: "לא נענו שאלות האתגר.",
  stageFeedback: {
    s1: "התחלתם יפה בהגדרת מערכת כדור הארץ. נסו להשלים את טבלת הספירות עד הסוף.",
    s2: "חישוב זמן המסע מסודר וברור – כל הכבוד! שימו לב ששנת אור היא יחידת מרחק ולא זמן.",
    s3: "הסבר מצוין על העונות: הבנתם שהסיבה היא נטיית הציר ולא המרחק מהשמש.",
    s4: "חסרה משימת החלל. חפשו משימה אמיתית שחקרה את מאדים, למשל Perseverance.",
    s5: "כדאי להשלים את המכתב לסוכנות ולהשתמש בו בנתונים שאספתם.",
  },
  generalFeedback: "עבדתם בצורה מסודרת והחישובים שלכם ברורים. הדבר החשוב ביותר לשפר: להשלים את כל השאלות. אתם בדרך הנכונה!",
  teacherFlags: ["זו טיוטת דוגמה (מצב תצוגה)."],
  total: 84,
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
  const [reviews, setReviews] = useState<Record<string, AiReview>>({});
  const [importing, setImporting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const gradeForm = useRef<HTMLFormElement>(null);

  const load = useCallback(async () => {
    if (!isTeacher || demo) {
      setTeams(demo ? [DEMO_TEAM] : []);
      setReviews(demo ? { [DEMO_REVIEW.teamId]: DEMO_REVIEW } : {});
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
    try {
      const snap = await getDocs(collection(dbFirestore, AI_REVIEWS));
      const next: Record<string, AiReview> = {};
      snap.docs.forEach((d) => {
        const r = d.data().result;
        if (isAiReview(r)) next[d.id] = r;
      });
      setReviews(next);
    } catch (err) {
      // Usually means the mission_ai_reviews rule has not been published yet.
      console.error("Error fetching AI reviews:", err);
    }
  }, [isTeacher, demo]);

  const exportSubmitted = () => {
    const submitted = teams.filter((t) => t.status === "submitted");
    if (submitted.length === 0) {
      window.alert("אין עבודות שממתינות לבדיקה.");
      return;
    }
    // No names or emails leave the dashboard: graders see the work only.
    const anonymize = (t: MissionTeam) => {
      const names = new Map(t.members.map((m, i) => [m.name, i === 0 ? "תלמיד א'" : "תלמיד ב'"]));
      return Object.fromEntries(Object.entries(t.stageOwners ?? {}).map(([s, name]) => [s, names.get(name) ?? "אחד מבני הזוג"]));
    };
    const payload = {
      kind: "mission-export",
      version: 1,
      exportedAt: new Date().toISOString(),
      teams: submitted.map((t) => ({
        id: t.id,
        destinationId: t.destinationId,
        answers: t.answers ?? {},
        checks: t.checks ?? {},
        termsChecked: t.termsChecked ?? [],
        stageOwners: anonymize(t),
      })),
    };
    const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `mission-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setNotice(`יוצאו ${submitted.length} עבודות. עכשיו הריצו ב-Claude Code: /grade-mission`);
  };

  const importReviews = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setImporting(true);
    try {
      const parsed = JSON.parse(await file.text());
      if (parsed?.kind !== "mission-ai-grades" || !Array.isArray(parsed.reviews)) {
        window.alert("זה לא קובץ טיוטות של /grade-mission (mission-ai-grades.json).");
        return;
      }
      const known = new Set(teams.map((t) => t.id));
      const valid = (parsed.reviews as unknown[]).filter(isAiReview).filter((r) => known.has(r.teamId));
      if (!demo) {
        await Promise.all(
          valid.map((r) => setDoc(doc(dbFirestore, AI_REVIEWS, r.teamId), { result: r, importedAt: serverTimestamp() })),
        );
      }
      setReviews((prev) => ({ ...prev, ...Object.fromEntries(valid.map((r) => [r.teamId, r])) }));
      const skipped = parsed.reviews.length - valid.length;
      setNotice(`יובאו ${valid.length} טיוטות${skipped ? ` (${skipped} דולגו: צוות לא נמצא או קובץ פגום)` : ""}. התלמידים לא רואים אותן עד שתשמרו.`);
    } catch (err) {
      console.error("Error importing AI reviews:", err);
      window.alert("ייבוא הטיוטות נכשל. ודאו שכלל mission_ai_reviews פורסם ב-Firestore.");
    } finally {
      setImporting(false);
    }
  };

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

  const selectedReview = selected ? reviews[selected.id] : undefined;

  const applyReview = () => {
    if (!selectedReview) return;
    const hasWork = Object.values(scores).some((v) => v !== "") || feedback.trim() || Object.values(stageFeedback).some((v) => v?.trim());
    if (hasWork && !window.confirm("להחליף את הציונים וההערות שכבר בטופס בטיוטת ה-AI?")) return;
    setScores(Object.fromEntries(RUBRIC.map((c) => [c.id, String(selectedReview.criteria.find((x) => x.id === c.id)?.score ?? "")])));
    setBonus(selectedReview.bonus ? String(selectedReview.bonus) : "");
    setStageFeedback(selectedReview.stageFeedback);
    setFeedback(selectedReview.generalFeedback);
    setSaved(false);
  };

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
      <div key={q.id} className={`rounded-md border p-3 space-y-2 ${soft}`}>
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
      <div className={`lg:col-span-4 rounded-lg border p-4 space-y-3 ${cardStyle} ${borderStyle}`}>
        <div className="flex items-center justify-between">
          <h2 className={`text-sm font-semibold ${textTitle}`}>משימת בית חדש ({teams.length})</h2>
          <button type="button" onClick={load} className={`p-1.5 rounded-lg cursor-pointer ${textMuted} hover:text-purple-400`} title="רענון">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={exportSubmitted}
            title="מוריד קובץ עם העבודות שממתינות לבדיקה, בלי שמות תלמידים, לבדיקה ב-Claude Code (/grade-mission)"
            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold border flex items-center justify-center gap-1.5 cursor-pointer ${borderStyle} ${textMuted} hover:text-purple-400`}
          >
            <Download className="w-3.5 h-3.5" /> ייצוא עבודות לבדיקה
          </button>
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            disabled={importing}
            title="בוחרים את mission-ai-grades.json ש-/grade-mission יצר"
            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold border flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60 ${borderStyle} ${textMuted} hover:text-purple-400`}
          >
            {importing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />} ייבוא טיוטות AI
          </button>
          <input ref={fileInput} type="file" accept="application/json,.json" onChange={importReviews} className="hidden" />
        </div>
        {notice && (
          <p className="text-[11px] rounded-md border border-purple-500/30 bg-purple-500/10 text-purple-400 px-2.5 py-1.5 leading-relaxed">{notice}</p>
        )}
        <div className="relative">
          <Search className={`absolute right-3 top-2.5 w-4 h-4 ${textMuted}`} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="חיפוש שם, כיתה, יעד או קוד"
            className={`w-full rounded-md border pr-9 pl-3 py-2 text-xs outline-none ${inputStyle}`}
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
                className={`w-full text-right rounded-md border p-3 cursor-pointer transition-colors ${
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
                    {reviews[t.id] && (
                      <span className="mr-1.5 inline-flex items-center gap-0.5 text-purple-400 font-bold" title={`טיוטת AI: ${reviews[t.id].total}`}>
                        <Sparkles className="w-3 h-3" /> AI {reviews[t.id].total}
                      </span>
                    )}
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
          <div className={`rounded-lg border p-10 text-center text-sm ${cardStyle} ${borderStyle} ${textMuted}`}>
            בחרו עבודה מהרשימה כדי לבדוק אותה.
          </div>
        ) : (
          <>
            <div className={`rounded-lg border p-5 space-y-3 ${cardStyle} ${borderStyle}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className={`text-lg font-semibold ${textTitle}`}>
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

              <div className={`rounded-md border p-3 space-y-2 ${soft}`}>
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
                <div key={stage.id} className={`rounded-lg border p-5 space-y-3 ${cardStyle} ${borderStyle}`}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className={`text-base font-semibold ${textTitle}`}>
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
                    className={`w-full rounded-md border px-3 py-2 text-xs outline-none ${inputStyle}`}
                  />
                </div>
              );
            })}

            <div className={`rounded-lg border p-5 space-y-3 ${cardStyle} ${borderStyle}`}>
              <h4 className={`text-base font-semibold ${textTitle}`}>מונחים ומקורות</h4>
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

            {selectedReview && (
              <div className={`rounded-lg border p-5 space-y-3 ${cardStyle} border-purple-500/40`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className={`text-base font-semibold flex items-center gap-1.5 ${textTitle}`}>
                    <Sparkles className="w-4 h-4 text-purple-400" /> טיוטת בדיקה של AI
                    <span className="text-purple-400 mr-1">{selectedReview.total}</span>
                  </h4>
                  <button
                    type="button"
                    onClick={applyReview}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-1.5 cursor-pointer"
                  >
                    <Wand2 className="w-3.5 h-3.5" /> החל על הטופס
                  </button>
                </div>
                <p className={`text-[11px] ${textMuted}`}>
                  הטיוטה גלויה רק לכם. &quot;החל על הטופס&quot; ממלא את הציונים וההערות, ואפשר לערוך לפני השמירה.
                </p>
                <div className="space-y-1.5">
                  {RUBRIC.map((c) => {
                    const r = selectedReview.criteria.find((x) => x.id === c.id);
                    return (
                      <div key={c.id} className={`rounded-md border px-3 py-2 text-xs ${soft}`}>
                        <div className="flex items-center justify-between gap-2">
                          <b className={textTitle}>{c.title}</b>
                          <span className="font-bold text-purple-400">
                            {r?.score ?? "—"}/{c.max} · {r ? LEVEL_LABEL[r.level] : ""}
                          </span>
                        </div>
                        {r?.justification && <p className={`mt-0.5 leading-relaxed ${textMuted}`}>{r.justification}</p>}
                      </div>
                    );
                  })}
                  <div className={`rounded-md border px-3 py-2 text-xs ${soft}`}>
                    <div className="flex items-center justify-between gap-2">
                      <b className={textTitle}>בונוס</b>
                      <span className="font-bold text-purple-400">
                        {selectedReview.bonus}/{BONUS_MAX}
                      </span>
                    </div>
                    {selectedReview.bonusReason && <p className={`mt-0.5 ${textMuted}`}>{selectedReview.bonusReason}</p>}
                  </div>
                </div>
                {selectedReview.teacherFlags.length > 0 && (
                  <div className={`rounded-lg border px-3 py-2 text-xs space-y-1 ${keyBox}`}>
                    <b className="flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> כדאי לבדוק בעצמכם
                    </b>
                    <ul className="list-disc pr-4 space-y-0.5">
                      {selectedReview.teacherFlags.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <form
              id="mission-grade-form"
              ref={gradeForm}
              onSubmit={saveGrade}
              className={`rounded-lg border p-5 space-y-3 scroll-mt-4 ${cardStyle} ${borderStyle}`}
            >
              <h4 className={`text-base font-semibold ${textTitle}`}>ציון לפי המחוון</h4>
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
                  <span className="text-2xl font-semibold text-purple-400">{total}</span>
                </div>
              </div>
              <textarea
                rows={3}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="משוב כללי לצוות"
                className={`w-full rounded-md border px-3 py-2 text-sm outline-none ${inputStyle}`}
              />
              <button
                type="submit"
                disabled={saving}
                className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-md cursor-pointer text-sm flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                {saved ? "הציון נשמר" : "שמירת ציון ומשוב"}
              </button>
            </form>

            {/* Slim bar that stays in view while reading the work. The full form
                lives at the end of the page so it never covers the answers. */}
            <div
              className={`sticky bottom-4 rounded-lg border px-4 py-2 flex flex-wrap items-center justify-between gap-2 shadow-lg ${cardStyle} ${borderStyle}`}
            >
              <span className={`text-sm ${textMuted}`}>
                סך הכול: <b className="text-purple-400 text-base">{total}</b>
                {selectedReview && <span className="mr-2 text-[11px] text-purple-400">· טיוטת AI: {selectedReview.total}</span>}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => gradeForm.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
                  className={`px-3 py-1.5 rounded-lg text-xs border cursor-pointer ${borderStyle} ${textMuted} hover:text-purple-400`}
                >
                  לטופס הציון ↓
                </button>
                <button
                  type="submit"
                  form="mission-grade-form"
                  disabled={saving}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                >
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : saved ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                  {saved ? "נשמר" : "שמירה"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
