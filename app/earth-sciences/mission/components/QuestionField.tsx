"use client";

import React, { useState } from "react";
import { CheckCircle2, Loader2, Sparkles, XCircle } from "lucide-react";
import {
  AGE_KEY,
  cellKey,
  valueKey,
  type CheckId,
  type Destination,
  type MissionTeam,
  type Question,
} from "@/lib/data/mission-new-home";
import DrawingCanvas from "./DrawingCanvas";
import type { MissionTheme } from "./theme";

export interface FieldApi {
  answers: Record<string, string>;
  drawings: Record<string, string>;
  checks: NonNullable<MissionTeam["checks"]>;
  locked: boolean;
  destination: Destination;
  theme: MissionTheme;
  setAnswer: (key: string, value: string) => void;
  saveDrawing: (qid: string, dataUrl: string) => void;
  runCheck: (checkId: CheckId, value: string, age?: string) => Promise<{ correct: boolean; hint: string }>;
}

const textareaBase = "w-full rounded-xl border px-3.5 py-2.5 text-sm leading-relaxed outline-none transition-colors resize-y";

export function AnswerText({ api, k, rows = 3, placeholder }: { api: FieldApi; k: string; rows?: number; placeholder?: string }) {
  return (
    <textarea
      dir="rtl"
      rows={rows}
      value={api.answers[k] ?? ""}
      disabled={api.locked}
      placeholder={placeholder ?? "כתבו כאן את התשובה..."}
      onChange={(e) => api.setAnswer(k, e.target.value)}
      className={`${textareaBase} ${api.theme.input} disabled:opacity-80`}
    />
  );
}

// A numeric answer box with a server-side "check" button.
export function NumericCheck({
  api,
  checkId,
  k,
  label,
  unit,
  ageKey,
}: {
  api: FieldApi;
  checkId: CheckId;
  k: string;
  label: string;
  unit: string;
  ageKey?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const saved = api.checks[checkId];
  const current = api.answers[k] ?? "";
  // A saved result only counts while the box still holds the value that was checked.
  const status = saved && saved.value === current ? (saved.correct ? "correct" : "wrong") : null;
  const t = api.theme;

  const onCheck = async () => {
    setBusy(true);
    setHint(null);
    try {
      const res = await api.runCheck(checkId, current, ageKey ? api.answers[ageKey] : undefined);
      setHint(res.hint);
    } catch {
      setHint("הבדיקה לא הצליחה. נסו שוב בעוד רגע.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={`rounded-xl border p-3 space-y-2 ${t.soft}`}>
      <div className="flex flex-wrap items-center gap-2">
        {ageKey && (
          <label className="flex items-center gap-2 text-sm">
            <span className={t.muted}>הגיל שלי בכדור הארץ:</span>
            <input
              dir="ltr"
              inputMode="decimal"
              value={api.answers[ageKey] ?? ""}
              disabled={api.locked}
              onChange={(e) => api.setAnswer(ageKey, e.target.value)}
              className={`w-16 rounded-lg border px-2 py-1.5 text-sm text-center outline-none ${t.input}`}
            />
          </label>
        )}
        <label className="flex items-center gap-2 text-sm">
          <span className={`font-semibold ${t.title}`}>{label}:</span>
          <input
            dir="ltr"
            inputMode="decimal"
            value={current}
            disabled={api.locked}
            onChange={(e) => api.setAnswer(k, e.target.value)}
            className={`w-32 rounded-lg border px-2 py-1.5 text-sm text-center outline-none ${t.input}`}
          />
          {unit && <span className={t.muted}>{unit}</span>}
        </label>
        {!api.locked && (
          <button
            type="button"
            onClick={onCheck}
            disabled={busy || !current.trim()}
            className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 cursor-pointer ${t.accentButton}`}
          >
            {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            בדיקה
          </button>
        )}
        {status === "correct" && (
          <span className="flex items-center gap-1 text-xs font-bold text-emerald-500">
            <CheckCircle2 className="w-4 h-4" /> נכון
          </span>
        )}
        {status === "wrong" && (
          <span className="flex items-center gap-1 text-xs font-bold text-rose-500">
            <XCircle className="w-4 h-4" /> עוד לא
          </span>
        )}
        {saved && saved.attempts > 0 && <span className={`text-[11px] ${t.muted}`}>ניסיונות: {saved.attempts}</span>}
      </div>
      {hint && <p className={`text-xs ${status === "correct" ? "text-emerald-500" : t.muted}`}>{hint}</p>}
    </div>
  );
}

function CellInput({ api, k }: { api: FieldApi; k: string }) {
  return (
    <textarea
      dir="rtl"
      rows={2}
      value={api.answers[k] ?? ""}
      disabled={api.locked}
      onChange={(e) => api.setAnswer(k, e.target.value)}
      className={`w-full min-w-[140px] rounded-lg border px-2 py-1.5 text-xs leading-relaxed outline-none resize-y ${api.theme.input}`}
    />
  );
}

export default function QuestionField({ q, number, api }: { q: Question; number: number; api: FieldApi }) {
  const t = api.theme;
  const d = api.destination;

  const unitFor = (checkId: CheckId) => {
    if (checkId === "travel") return d.travelUnit;
    if (checkId === "radio") return d.radioUnit;
    if (checkId === "weight") return "ק\"ג";
    if (checkId === "age") return "שנים של היעד";
    return "";
  };

  return (
    <div className={`rounded-2xl border p-4 sm:p-5 space-y-3 ${t.card} ${t.border}`}>
      <div className="flex gap-3">
        <span
          className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
            q.challenge ? "bg-amber-400 text-zinc-900" : "bg-teal-500/15 " + t.accentText
          }`}
        >
          {q.challenge ? "★" : number}
        </span>
        <div className="space-y-2 flex-1">
          <p className={`text-[15px] leading-relaxed font-semibold ${t.title}`}>
            {q.challenge && <span className="text-amber-500 ml-1">(רשות, בונוס)</span>}
            {q.prompt}
          </p>
          {q.sub && (
            <ul className={`list-disc pr-5 space-y-1 text-sm ${t.muted}`}>
              {q.sub.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          )}
          {q.hint && <p className={`text-xs ${t.muted}`}>{q.hint}</p>}
        </div>
      </div>

      {(q.kind === "text" || q.kind === "long") && <AnswerText api={api} k={q.id} rows={q.kind === "long" ? 9 : 3} />}

      {q.kind === "check" && q.check && (
        <div className="space-y-2">
          <NumericCheck
            api={api}
            checkId={q.check}
            k={valueKey(q.id)}
            label={q.valueLabel ?? "התשובה"}
            unit={unitFor(q.check)}
            ageKey={q.check === "age" ? AGE_KEY : undefined}
          />
          <AnswerText api={api} k={q.id} rows={4} placeholder="כתבו את דרך החישוב ואת ההסבר..." />
        </div>
      )}

      {q.kind === "drawing" && (
        <DrawingCanvas
          value={api.drawings[q.id]}
          disabled={api.locked}
          theme={t}
          onSave={(url) => api.saveDrawing(q.id, url)}
        />
      )}

      {(q.kind === "table" || q.kind === "score") && q.rows && (
        <div className="overflow-x-auto -mx-1 px-1">
          <table className="w-full text-sm border-separate border-spacing-1.5">
            <thead>
              <tr>
                <th className={`text-right text-xs font-bold p-1 ${t.muted}`}>{q.kind === "score" ? "תנאי" : "ספירה"}</th>
                {(q.kind === "score" ? ["ציון (1–5)", "נימוק"] : q.cols ?? []).map((c) => (
                  <th key={c} className={`text-right text-xs font-bold p-1 ${t.muted}`}>
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {q.rows.map((row, r) => (
                <tr key={row}>
                  <td className={`align-top text-xs font-semibold p-1 whitespace-nowrap ${t.title}`}>{row}</td>
                  {q.kind === "score" ? (
                    <>
                      <td className="align-top p-0.5 w-24">
                        <select
                          value={api.answers[cellKey(q.id, r, 0)] ?? ""}
                          disabled={api.locked}
                          onChange={(e) => api.setAnswer(cellKey(q.id, r, 0), e.target.value)}
                          className={`w-full rounded-lg border px-2 py-1.5 text-sm outline-none ${t.input}`}
                        >
                          <option value="">—</option>
                          {[1, 2, 3, 4, 5].map((n) => (
                            <option key={n} value={String(n)}>
                              {n}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="align-top p-0.5">
                        <CellInput api={api} k={cellKey(q.id, r, 1)} />
                      </td>
                    </>
                  ) : (
                    (q.cols ?? []).map((_, c) => (
                      <td key={c} className="align-top p-0.5">
                        <CellInput api={api} k={cellKey(q.id, r, c)} />
                      </td>
                    ))
                  )}
                </tr>
              ))}
              {q.kind === "score" && (
                <tr>
                  <td className={`text-xs font-black p-1 ${t.title}`}>סך הכול</td>
                  <td className={`text-sm font-black p-1 text-center ${t.accentText}`}>
                    {q.rows.reduce((sum, _, r) => sum + (Number(api.answers[cellKey(q.id, r, 0)]) || 0), 0)} / {q.rows.length * 5}
                  </td>
                  <td />
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
