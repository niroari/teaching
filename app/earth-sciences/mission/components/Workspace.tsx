"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { arrayRemove, arrayUnion, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import confetti from "canvas-confetti";
import { ArrowLeft, ArrowRight, Check, CloudOff, Copy, Loader2, LogOut, Trophy } from "lucide-react";
import { dbFirestore } from "@/lib/firebase";
import { sounds } from "@/lib/sounds";
import {
  ALL_QUESTIONS,
  BLANK_SOURCE_KEY,
  BONUS_MAX,
  RUBRIC,
  SOURCES_KEY,
  STAGES,
  blankKey,
  getDestination,
  isFilled,
  requiredKeys,
  type CheckId,
  type MissionTeam,
  type Stage,
} from "@/lib/data/mission-new-home";
import IntroStep from "./IntroStep";
import QuestionField, { type FieldApi } from "./QuestionField";
import ReviewSubmit from "./ReviewSubmit";
import { TEAMS } from "./TeamGate";
import type { MissionTheme } from "./theme";

type SaveState = "idle" | "saving" | "saved" | "error";

interface Props {
  team: MissionTeam;
  theme: MissionTheme;
  onLeave: () => void;
}

const STEP_LABELS = ["פתיחה ונתונים", ...STAGES.map((s) => s.short), "בדיקה והגשה"];
const INTRO_KEYS = [blankKey("blank1"), blankKey("blank2"), BLANK_SOURCE_KEY];

// Question numbers within a stage; drawings belong to the question before them.
function questionNumbers(stage: Stage) {
  const map = new Map<string, number>();
  let n = 0;
  for (const q of stage.sections.flatMap((sec) => sec.questions)) {
    if (q.kind !== "drawing") n += 1;
    map.set(q.id, n);
  }
  return map;
}

export default function Workspace({ team, theme: t, onLeave }: Props) {
  const destination = getDestination(team.destinationId)!;
  const locked = team.status !== "draft";
  const ref = useMemo(() => doc(dbFirestore, TEAMS, team.id), [team.id]);

  const [step, setStep] = useState(0);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  // Edits waiting to be written, keyed by Firestore field path ("answers.s1q1").
  // They are shown on top of the live document so typing never jumps.
  const pending = useRef<Record<string, string>>({});
  const [pendingView, setPendingView] = useState<Record<string, string>>({});
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flush = useCallback(async () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    const batch = { ...pending.current };
    if (Object.keys(batch).length === 0) return;
    setSaveState("saving");
    try {
      await updateDoc(ref, { ...batch, updatedAt: serverTimestamp() });
      // Keep anything typed while the write was in flight.
      for (const [k, v] of Object.entries(batch)) {
        if (pending.current[k] === v) delete pending.current[k];
      }
      setPendingView({ ...pending.current });
      setSaveState("saved");
    } catch (err) {
      console.error("Autosave failed:", err);
      setSaveState("error");
    }
  }, [ref]);

  const setField = useCallback(
    (path: string, value: string) => {
      if (locked) return;
      pending.current[path] = value;
      setPendingView({ ...pending.current });
      setSaveState("saving");
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(flush, 1200);
    },
    [flush, locked],
  );

  // Save what is left when leaving the page, and warn if a write is still pending.
  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (Object.keys(pending.current).length > 0) {
        flush();
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", warn);
    return () => {
      window.removeEventListener("beforeunload", warn);
      flush();
    };
  }, [flush]);

  const overlay = (prefix: string, base: Record<string, string> | undefined) => {
    const out: Record<string, string> = { ...(base ?? {}) };
    for (const [k, v] of Object.entries(pendingView)) {
      if (k.startsWith(prefix)) out[k.slice(prefix.length)] = v;
    }
    return out;
  };
  const answers = overlay("answers.", team.answers);
  const stageOwners = overlay("stageOwners.", team.stageOwners);

  const runCheck = async (checkId: CheckId, value: string, age?: string) => {
    const res = await fetch("/api/mission-check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ destinationId: team.destinationId, checkId, value, age }),
    });
    const data = (await res.json()) as { ok: boolean; correct?: boolean; hint?: string };
    if (!data.ok) throw new Error("check failed");
    const correct = Boolean(data.correct);
    if (correct) sounds.playSuccess();
    else sounds.playBuzzer();
    const prev = team.checks?.[checkId];
    await updateDoc(ref, {
      [`checks.${checkId}`]: { correct, attempts: (prev?.attempts ?? 0) + 1, value },
      updatedAt: serverTimestamp(),
    });
    return { correct, hint: data.hint ?? "" };
  };

  const api: FieldApi = {
    answers,
    drawings: team.drawings ?? {},
    checks: team.checks ?? {},
    locked,
    destination,
    theme: t,
    setAnswer: (k, v) => setField(`answers.${k}`, v),
    saveDrawing: (qid, url) => {
      if (locked) return;
      setSaveState("saving");
      updateDoc(ref, { [`drawings.${qid}`]: url, updatedAt: serverTimestamp() })
        .then(() => setSaveState("saved"))
        .catch((err) => {
          console.error("Drawing save failed:", err);
          setSaveState("error");
        });
    },
    runCheck,
  };

  // Progress per step: required fields that are filled.
  const progress = useMemo(() => {
    const stepKeys: string[][] = [
      INTRO_KEYS,
      ...STAGES.map((s) => s.sections.flatMap((sec) => sec.questions.flatMap(requiredKeys))),
      [SOURCES_KEY],
    ];
    return stepKeys.map((keys) => ({
      total: keys.length,
      done: keys.filter((k) => isFilled(answers[k])).length,
    }));
  }, [answers]);

  const missing = progress.slice(0, 6).map((p, i) => ({ step: i, label: STEP_LABELS[i], count: p.total - p.done }));
  const missingDrawings = ALL_QUESTIONS.filter((q) => q.kind === "drawing" && !team.drawings?.[q.id]).length;
  const overall = Math.round(
    (progress.reduce((s, p) => s + p.done, 0) / Math.max(1, progress.reduce((s, p) => s + p.total, 0))) * 100,
  );

  const submit = async () => {
    const left = missing.reduce((s, m) => s + m.count, 0) + (isFilled(answers[SOURCES_KEY]) ? 0 : 1);
    const msg =
      left > 0
        ? `עדיין חסרים ${left} שדות. להגיש בכל זאת? אחרי ההגשה אי אפשר לשנות.`
        : "להגיש את הדו״ח לסוכנות? אחרי ההגשה אי אפשר לשנות.";
    if (!window.confirm(msg)) return;
    setSubmitting(true);
    try {
      await flush();
      await updateDoc(ref, { status: "submitted", submittedAt: serverTimestamp(), updatedAt: serverTimestamp() });
      sounds.playCheer();
      confetti({ particleCount: 160, spread: 90, origin: { y: 0.6 } });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Submit failed:", err);
      window.alert("ההגשה לא הצליחה. בדקו את החיבור ונסו שוב.");
    } finally {
      setSubmitting(false);
    }
  };

  const go = (n: number) => {
    flush();
    setStep(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const stage = step >= 1 && step <= STAGES.length ? STAGES[step - 1] : null;
  const numbers = stage ? questionNumbers(stage) : new Map<string, number>();

  const totalScore = RUBRIC.reduce((s, c) => s + (team.rubricScores?.[c.id] ?? 0), 0) + (team.bonus ?? 0);

  return (
    <div className="space-y-5">
      {/* Team header */}
      <section className={`rounded-2xl border p-4 flex flex-wrap items-center justify-between gap-3 ${t.card} ${t.border}`}>
        <div>
          <div className={`text-lg font-black ${t.title}`}>
            {destination.emoji} צוות {destination.name}
          </div>
          <div className={`text-xs ${t.muted}`}>
            {team.members.map((m) => `${m.name} (${m.studentClass})`).join(" · ")}
            {team.members.length < 2 && !locked && " · מחכים לשותף"}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(team.id);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer font-mono ${t.ghostButton}`}
            title="העתקת קוד הצוות"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {team.id}
          </button>
          <span className={`text-xs flex items-center gap-1 ${saveState === "error" ? "text-rose-500" : t.muted}`}>
            {saveState === "saving" && (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> שומר...
              </>
            )}
            {saveState === "saved" && (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" /> נשמר
              </>
            )}
            {saveState === "error" && (
              <>
                <CloudOff className="w-3.5 h-3.5" /> השמירה נכשלה, ננסה שוב בעריכה הבאה
              </>
            )}
          </span>
          <button
            type="button"
            onClick={() => {
              flush();
              onLeave();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer ${t.ghostButton}`}
          >
            <LogOut className="w-3.5 h-3.5" /> כל העבודות
          </button>
        </div>
      </section>

      {/* Status banners */}
      {team.status === "submitted" && (
        <div
          className={`rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm font-semibold ${
            t.isLight ? "text-emerald-700" : "text-emerald-300"
          }`}
        >
          הדו&quot;ח הוגש לסוכנות! המורה יבדוק אותו, והציון יופיע כאן.
        </div>
      )}
      {team.status === "graded" && (
        <section className="rounded-2xl border border-amber-400/50 bg-amber-400/10 p-5 space-y-3">
          <div className={`flex items-center gap-2 text-lg font-black ${t.title}`}>
            <Trophy className="w-5 h-5 text-amber-500" /> הציון שלכם: {team.scoreTeacher ?? totalScore}
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
            {RUBRIC.map((c) => (
              <div key={c.id} className={`rounded-lg border px-3 py-2 ${t.soft}`}>
                {c.title}: <b>{team.rubricScores?.[c.id] ?? 0}</b> / {c.max}
              </div>
            ))}
            <div className={`rounded-lg border px-3 py-2 ${t.soft}`}>
              בונוס: <b>{team.bonus ?? 0}</b> / {BONUS_MAX}
            </div>
          </div>
          {team.feedbackTeacher && <p className="text-sm leading-relaxed whitespace-pre-wrap">{team.feedbackTeacher}</p>}
        </section>
      )}

      {/* Stepper */}
      <nav className="flex gap-2 overflow-x-auto pb-1" aria-label="שלבי העבודה">
        {STEP_LABELS.map((label, i) => {
          const p = progress[i];
          const done = p.total > 0 && p.done === p.total;
          return (
            <button
              key={label}
              type="button"
              onClick={() => go(i)}
              className={`shrink-0 rounded-xl border px-3 py-2 text-xs font-bold cursor-pointer transition-colors ${
                step === i ? "border-teal-400 bg-teal-500/15 " + t.accentText : `${t.soft} ${t.title}`
              }`}
            >
              {done && <Check className="inline w-3.5 h-3.5 ml-1 text-emerald-500" />}
              {label}
              <span className={`block text-[10px] font-normal ${t.muted}`}>
                {p.done}/{p.total}
              </span>
            </button>
          );
        })}
      </nav>
      <div className={`h-1.5 rounded-full overflow-hidden ${t.isLight ? "bg-zinc-200" : "bg-white/10"}`}>
        <div className="h-full bg-teal-500 transition-all" style={{ width: `${overall}%` }} />
      </div>

      {/* Step content */}
      {step === 0 && <IntroStep api={api} />}

      {stage && (
        <div className="space-y-4">
          <section className={`rounded-2xl border p-5 space-y-2 ${t.card} ${t.border}`}>
            <h2 className={`text-2xl font-black ${t.title}`}>
              {stage.short}: {stage.title}
            </h2>
            <p className="text-[15px] leading-relaxed">{stage.intro}</p>
            {stage.terms.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className={`text-xs font-bold ${t.title}`}>מונחי חובה:</span>
                {stage.terms.map((term) => (
                  <span key={term} className="text-xs rounded-full px-2.5 py-0.5 bg-teal-500/15 border border-teal-500/30">
                    {term}
                  </span>
                ))}
              </div>
            )}
            {team.stageFeedback?.[stage.id] && (
              <div className="mt-2 rounded-xl border border-amber-400/40 bg-amber-400/10 p-3 text-sm">
                <b>הערת המורה:</b> {team.stageFeedback[stage.id]}
              </div>
            )}
          </section>
          {stage.sections.map((sec, si) => (
            <div key={si} className="space-y-3">
              {sec.title && <h3 className={`text-lg font-black pt-2 ${t.title}`}>{sec.title}</h3>}
              {sec.questions.map((q) => (
                <QuestionField key={q.id} q={q} number={numbers.get(q.id) ?? 0} api={api} />
              ))}
            </div>
          ))}
        </div>
      )}

      {step === STEP_LABELS.length - 1 && (
        <ReviewSubmit
          api={api}
          team={team}
          stageOwners={stageOwners}
          missing={missing}
          missingDrawings={missingDrawings}
          onGoTo={go}
          onSetOwner={(sid, v) => setField(`stageOwners.${sid}`, v)}
          onToggleTerm={(term, checked) => {
            if (locked) return;
            updateDoc(ref, {
              termsChecked: checked ? arrayUnion(term) : arrayRemove(term),
              updatedAt: serverTimestamp(),
            }).catch((err) => console.error("Term toggle failed:", err));
          }}
          onSubmit={submit}
          submitting={submitting}
        />
      )}

      {/* Prev / next */}
      <div className="flex justify-between pt-2">
        <button
          type="button"
          disabled={step === 0}
          onClick={() => go(step - 1)}
          className={`px-4 py-2 rounded-xl text-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-40 ${t.ghostButton}`}
        >
          <ArrowRight className="w-4 h-4" /> הקודם
        </button>
        {step < STEP_LABELS.length - 1 && (
          <button
            type="button"
            onClick={() => go(step + 1)}
            className={`px-4 py-2 rounded-xl text-sm flex items-center gap-1.5 cursor-pointer ${t.accentButton}`}
          >
            הבא: {STEP_LABELS[step + 1]} <ArrowLeft className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
