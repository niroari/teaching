"use client";

import React from "react";
import { BLANK_SOURCE_KEY, DESTINATIONS, GUIDELINES, STORY, blankKey, type Destination } from "@/lib/data/mission-new-home";
import { AnswerText, NumericCheck, type FieldApi } from "./QuestionField";

const BLANK = "?? חפשו";

function Cell({ value, mine }: { value: string | null; mine: boolean }) {
  if (value === null) {
    return <span className="inline-block px-1.5 py-0.5 rounded bg-amber-400/90 text-zinc-900 text-[11px] font-black">{mine ? BLANK : "?"}</span>;
  }
  return <>{value}</>;
}

export default function IntroStep({ api }: { api: FieldApi }) {
  const t = api.theme;
  const mine = api.destination;

  const tableA: { label: string; get: (d: Destination) => string | null }[] = [
    { label: "מה זה", get: (d) => d.kind },
    { label: "מקיף את", get: (d) => d.orbits },
    { label: "מרחק מכדור הארץ", get: (d) => d.distance },
    { label: "זמן שהאור עובר מהיעד אלינו", get: (d) => d.lightTime },
    { label: "קוטר (ק\"מ)", get: (d) => d.diameter },
    { label: "כבידה (כדור הארץ = 1)", get: (d) => d.gravity },
  ];
  const tableB: { label: string; get: (d: Destination) => string | null }[] = [
    { label: "אורך יום", get: (d) => d.day },
    { label: "אורך שנה", get: (d) => d.year },
    { label: "נטיית ציר", get: (d) => d.tilt },
    { label: "אטמוספרה", get: (d) => d.atmosphere },
    { label: "טמפרטורה ממוצעת", get: (d) => d.temperature },
    { label: "מים", get: (d) => d.water },
    { label: "פרט מיוחד", get: (d) => d.special },
  ];

  const renderTable = (title: string, cols: typeof tableA) => (
    <div className="space-y-2">
      <h4 className={`text-sm font-bold ${t.title}`}>{title}</h4>
      <div className={`overflow-x-auto rounded-xl border ${t.border}`}>
        <table className="w-full text-xs min-w-[720px]">
          <thead>
            <tr className={t.isLight ? "bg-zinc-100" : "bg-white/5"}>
              <th className={`text-right p-2 font-bold ${t.title}`}>יעד</th>
              {cols.map((c) => (
                <th key={c.label} className={`text-right p-2 font-bold ${t.title}`}>
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DESTINATIONS.map((d) => {
              const isMine = d.id === mine.id;
              return (
                <tr
                  key={d.id}
                  className={`border-t ${t.border} ${isMine ? (t.isLight ? "bg-teal-50" : "bg-teal-500/10") : ""}`}
                >
                  <td className={`p-2 font-bold whitespace-nowrap ${isMine ? t.accentText : t.title}`}>
                    {d.emoji} {d.name}
                  </td>
                  {cols.map((c) => (
                    <td key={c.label} className="p-2 align-top leading-relaxed">
                      <Cell value={c.get(d)} mine={isMine} />
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <section className={`rounded-2xl border p-5 space-y-3 ${t.card} ${t.border}`}>
        <h3 className={`text-xl font-black ${t.title}`}>המשימה: בית חדש לאנושות</h3>
        {STORY.map((p) => (
          <p key={p} className="text-[15px] leading-relaxed">
            {p}
          </p>
        ))}
      </section>

      <section className={`rounded-2xl border p-5 space-y-3 ${t.card} ${t.border}`}>
        <h3 className={`text-lg font-black ${t.title}`}>הנחיות לצוות</h3>
        <ul className="list-disc pr-5 space-y-1.5 text-sm leading-relaxed">
          {GUIDELINES.map((g) => (
            <li key={g}>{g}</li>
          ))}
        </ul>
      </section>

      <section className={`rounded-2xl border p-5 space-y-4 ${t.card} ${t.border}`}>
        <div>
          <h3 className={`text-lg font-black ${t.title}`}>כרטיסי נתונים</h3>
          <p className={`text-sm ${t.muted}`}>
            היעד שלכם מודגש. המספרים מעוגלים. שימו לב לשני הפרטים שמסומנים &quot;{BLANK}&quot;.
          </p>
        </div>
        {renderTable("טבלה א: מיקום ומבנה", tableA)}
        {renderTable("טבלה ב: תנאי חיים", tableB)}
        <p className={`text-xs ${t.muted}`}>
          להשוואה, בכדור הארץ: יום של 24 שעות, שנה של 365 ימים, נטיית ציר של 23.5° וטמפרטורה ממוצעת של 15°C. האור מהשמש מגיע אלינו
          בתוך כ-8 דקות.
        </p>
      </section>

      <section className={`rounded-2xl border p-5 space-y-3 ${t.card} ${t.border}`}>
        <h3 className={`text-lg font-black ${t.title}`}>
          השלימו את הנתונים החסרים על {mine.emoji} {mine.name}
        </h3>
        {mine.blanks.map((b) => (
          <NumericCheck key={b.id} api={api} checkId={b.id} k={blankKey(b.id)} label={b.label} unit={b.unit} />
        ))}
        <div className="space-y-1.5">
          <p className={`text-sm font-semibold ${t.title}`}>מאיפה לקחתם את הנתונים? (שם האתר וקישור)</p>
          <AnswerText api={api} k={BLANK_SOURCE_KEY} rows={2} placeholder="לדוגמה: אתר נאס״א, https://..." />
        </div>
      </section>
    </div>
  );
}
