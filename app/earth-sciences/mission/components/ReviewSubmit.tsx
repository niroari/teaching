"use client";

import React from "react";
import { AlertTriangle, CheckCircle2, Loader2, Send } from "lucide-react";
import { BONUS_MAX, RUBRIC, SOURCES_KEY, STAGES, TERM_GROUPS, type MissionTeam } from "@/lib/data/mission-new-home";
import { AnswerText, type FieldApi } from "./QuestionField";

interface Props {
  api: FieldApi;
  team: MissionTeam;
  stageOwners: Record<string, string>;
  missing: { step: number; label: string; count: number }[];
  missingDrawings: number;
  onGoTo: (step: number) => void;
  onSetOwner: (stageId: string, value: string) => void;
  onToggleTerm: (term: string, checked: boolean) => void;
  onSubmit: () => void;
  submitting: boolean;
}

export default function ReviewSubmit({
  api,
  team,
  stageOwners,
  missing,
  missingDrawings,
  onGoTo,
  onSetOwner,
  onToggleTerm,
  onSubmit,
  submitting,
}: Props) {
  const t = api.theme;
  const terms = new Set(team.termsChecked ?? []);
  const totalMissing = missing.reduce((s, m) => s + m.count, 0);

  return (
    <div className="space-y-6">
      <section className={`rounded-xl border p-5 space-y-3 ${t.card} ${t.border}`}>
        <h3 className={`text-lg font-bold ${t.title}`}>מה עוד חסר?</h3>
        {totalMissing === 0 ? (
          <p className="flex items-center gap-2 text-sm font-semibold text-emerald-500">
            <CheckCircle2 className="w-4 h-4" /> ענית על כל שאלות החובה.
          </p>
        ) : (
          <ul className="space-y-1.5">
            {missing
              .filter((m) => m.count > 0)
              .map((m) => (
                <li key={m.step}>
                  <button type="button" onClick={() => onGoTo(m.step)} className="text-sm flex items-center gap-2 cursor-pointer hover:underline">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    {m.label}: {m.count} שדות ריקים
                  </button>
                </li>
              ))}
          </ul>
        )}
        {missingDrawings > 0 && <p className={`text-sm ${t.muted}`}>שימו לב: {missingDrawings} שרטוטים עוד ריקים.</p>}
      </section>

      <section className={`rounded-xl border p-5 space-y-4 ${t.card} ${t.border}`}>
        <div>
          <h3 className={`text-lg font-bold ${t.title}`}>רשימת המונחים</h3>
          <p className={`text-sm ${t.muted}`}>סמנו כל מונח שהשתמשתם בו נכון לפחות פעם אחת בעבודה.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {TERM_GROUPS.map((g) => (
            <div key={g.title} className={`rounded-xl border p-3 space-y-2 ${t.soft}`}>
              <p className={`text-sm font-bold ${t.title}`}>{g.title}</p>
              {g.terms.map((term) => (
                <label key={term} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-teal-500"
                    checked={terms.has(term)}
                    disabled={api.locked}
                    onChange={(e) => onToggleTerm(term, e.target.checked)}
                  />
                  <span className={terms.has(term) ? "line-through opacity-70" : ""}>{term}</span>
                </label>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className={`rounded-xl border p-5 space-y-3 ${t.card} ${t.border}`}>
        <h3 className={`text-lg font-bold ${t.title}`}>מי הוביל כל שלב?</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {STAGES.map((s) => (
            <label key={s.id} className="space-y-1">
              <span className={`text-sm font-semibold ${t.title}`}>
                {s.short}: {s.title}
              </span>
              <select
                value={stageOwners[s.id] ?? ""}
                disabled={api.locked}
                onChange={(e) => onSetOwner(s.id, e.target.value)}
                className={`w-full rounded-xl border px-3 py-2 text-sm outline-none ${t.input}`}
              >
                <option value="">בחרו...</option>
                {team.members.map((m) => (
                  <option key={m.uid} value={m.name}>
                    {m.name}
                  </option>
                ))}
                {team.members.length > 1 && <option value="שנינו יחד">שנינו יחד</option>}
              </select>
            </label>
          ))}
        </div>
      </section>

      <section className={`rounded-xl border p-5 space-y-3 ${t.card} ${t.border}`}>
        <h3 className={`text-lg font-bold ${t.title}`}>מקורות</h3>
        <p className={`text-sm ${t.muted}`}>לפחות 2 מקורות: שם האתר וכתובת הקישור, כל מקור בשורה נפרדת.</p>
        <AnswerText api={api} k={SOURCES_KEY} rows={4} placeholder={"נאס״א – https://...\nהידען – https://..."} />
      </section>

      <section className={`rounded-xl border p-5 space-y-3 ${t.card} ${t.border}`}>
        <h3 className={`text-lg font-bold ${t.title}`}>מחוון ההערכה (100 נקודות)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[640px]">
            <thead>
              <tr className={"bg-subtle"}>
                {["קריטריון", "נקודות", "מצוין", "טוב", "דורש שיפור"].map((h) => (
                  <th key={h} className={`text-right p-2 font-bold ${t.title}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RUBRIC.map((c) => (
                <tr key={c.id} className={`border-t ${t.border}`}>
                  <td className={`p-2 font-bold ${t.title}`}>{c.title}</td>
                  <td className="p-2 text-center">{c.max}</td>
                  <td className="p-2">{c.excellent}</td>
                  <td className="p-2">{c.good}</td>
                  <td className="p-2">{c.improve}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className={`text-xs ${t.muted}`}>בונוס (עד {BONUS_MAX} נקודות): מענה מלא על שאלות ה&quot;אתגר&quot;.</p>
      </section>

      {!api.locked && (
        <section className="text-center space-y-2">
          <button
            type="button"
            onClick={onSubmit}
            disabled={submitting}
            className={`inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-base cursor-pointer ${t.accentButton}`}
          >
            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            הגשת הדו&quot;ח לסוכנות
          </button>
          <p className={`text-xs ${t.muted}`}>אחרי ההגשה כבר לא תוכלו לשנות את העבודה.</p>
        </section>
      )}
    </div>
  );
}
