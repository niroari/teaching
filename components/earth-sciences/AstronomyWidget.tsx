"use client";

import React, { useState } from "react";
import { Check, Moon, Orbit, RotateCcw, Sun } from "lucide-react";
import { Segmented, btn } from "@/components/site/ui";

// Unit 1 widget, three tabs: planet sort (lesson "solar-system"),
// seasons (lesson "seasons") and moon phases (lesson "moon-phases").

// ---------- Planets ----------

type PlanetKind = "rocky" | "giant";

const PLANETS: { name: string; kind: PlanetKind; fact: string }[] = [
  { name: "חמה", kind: "rocky", fact: "הקרוב ביותר לשמש. כמעט בלי אטמוספרה: ביום כ-430°C ובלילה כ-180°C-." },
  { name: "נוגה", kind: "rocky", fact: "כמעט בגודל כדור הארץ. אטמוספרה סמיכה של פחמן דו-חמצני מחממת אותה לכ-460°C." },
  { name: "כדור הארץ", kind: "rocky", fact: "מים נוזליים, אטמוספרה מגינה, וחיים. ירח אחד." },
  { name: "מאדים", kind: "rocky", fact: "אטמוספרה דלילה, קרח בקטבים, ושני ירחים קטנים." },
  { name: "צדק", kind: "giant", fact: "ענק גזים: מסתו פי 318 מכדור הארץ. יותר מ-90 ירחים ידועים." },
  { name: "שבתאי", kind: "giant", fact: "ענק גזים עם הטבעות הבולטות ביותר. יותר מ-270 ירחים ידועים." },
  { name: "אורנוס", kind: "giant", fact: "ענק קרח. הציר שלו שוכב כמעט על הצד." },
  { name: "נפטון", kind: "giant", fact: "ענק קרח, הרחוק ביותר. הקפה אחת סביב השמש נמשכת כ-165 שנה." },
];

function PlanetsTab() {
  const [picked, setPicked] = useState<Record<string, PlanetKind | undefined>>({});
  const [checked, setChecked] = useState(false);
  const allPicked = PLANETS.every((p) => picked[p.name]);
  const correct = PLANETS.filter((p) => picked[p.name] === p.kind).length;

  return (
    <div className="space-y-4">
      <p className="text-sm text-fg-muted">לכל כוכב לכת, בחרו: סלעי או ענק. אחרי הבדיקה תופיע עובדה על כל אחד.</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {PLANETS.map((p) => {
          const choice = picked[p.name];
          const ok = checked && choice === p.kind;
          const bad = checked && choice !== p.kind;
          return (
            <div
              key={p.name}
              className={`rounded-lg border p-3 space-y-2 ${ok ? "border-success bg-success-soft" : bad ? "border-danger bg-danger-soft" : "border-line bg-card"}`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-fg">{p.name}</span>
                <div className="flex gap-1">
                  {(["rocky", "giant"] as const).map((k) => (
                    <button
                      key={k}
                      type="button"
                      disabled={checked}
                      aria-pressed={choice === k}
                      onClick={() => setPicked((s) => ({ ...s, [p.name]: k }))}
                      className={`min-h-8 rounded-md border px-2.5 text-xs transition-colors cursor-pointer disabled:cursor-default ${
                        choice === k ? "border-accent bg-accent-soft text-fg font-medium" : "border-line bg-subtle text-fg-muted hover:text-fg"
                      }`}
                    >
                      {k === "rocky" ? "סלעי" : "ענק"}
                    </button>
                  ))}
                </div>
              </div>
              {checked && <p className="text-xs text-fg-muted leading-relaxed">{p.fact}</p>}
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {!checked ? (
          <button type="button" className={btn.primary} disabled={!allPicked} onClick={() => setChecked(true)}>
            <Check className="w-4 h-4" strokeWidth={1.75} />
            בדיקה
          </button>
        ) : (
          <>
            <span className="text-sm font-medium text-fg">נכונים: {correct} מתוך {PLANETS.length}</span>
            <button type="button" className={btn.secondary} onClick={() => { setPicked({}); setChecked(false); }}>
              <RotateCcw className="w-4 h-4" strokeWidth={1.75} />
              שוב
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ---------- Seasons ----------

/** Jerusalem (31.8°N): noon sun altitude and approximate day length on the four key dates. */
const SEASON_POINTS = [
  { id: "jun", date: "21 ביוני", north: "קיץ", south: "חורף", altitude: 82, day: "קצת יותר מ-14 שעות", tilt: "חצי הכדור הצפוני נוטה אל השמש" },
  { id: "sep", date: "23 בספטמבר", north: "סתיו", south: "אביב", altitude: 58, day: "כ-12 שעות", tilt: "אף חצי כדור לא נוטה אל השמש" },
  { id: "dec", date: "21 בדצמבר", north: "חורף", south: "קיץ", altitude: 35, day: "קצת יותר מ-10 שעות", tilt: "חצי הכדור הצפוני נוטה הרחק מהשמש" },
  { id: "mar", date: "20 במרץ", north: "אביב", south: "סתיו", altitude: 58, day: "כ-12 שעות", tilt: "אף חצי כדור לא נוטה אל השמש" },
] as const;

function SeasonsTab() {
  const [idx, setIdx] = useState(0);
  const p = SEASON_POINTS[idx];
  // Orbit drawing: Sun in the centre, Earth at four positions; the axis always leans the same way.
  const W = 360, H = 200, cx = 180, cy = 100, rx = 140, ry = 62;
  const positions = [
    { x: cx - rx, y: cy }, // Jun: Earth left of the Sun, north pole leans right toward it
    { x: cx, y: cy + ry },
    { x: cx + rx, y: cy },
    { x: cx, y: cy - ry },
  ];
  const tilt = (23.4 * Math.PI) / 180;
  const ax = Math.sin(tilt) * 26, ay = -Math.cos(tilt) * 26; // north pole leans right, toward the Sun in June
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <section className="rounded-lg border border-line bg-card p-4 space-y-3">
        <div className="flex flex-wrap gap-2">
          {SEASON_POINTS.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setIdx(i)}
              aria-pressed={i === idx}
              className={`min-h-9 rounded-md border px-3 text-sm transition-colors cursor-pointer ${
                i === idx ? "border-accent bg-accent-soft text-fg font-medium" : "border-line bg-subtle text-fg-muted hover:text-fg"
              }`}
            >
              {s.date}
            </button>
          ))}
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label={`כדור הארץ במסלולו ב-${p.date}`}>
          <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" className="stroke-line-strong" strokeDasharray="5 4" />
          <circle cx={cx} cy={cy} r={20} className="fill-warning" />
          {positions.map((pos, i) => (
            <g key={i} opacity={i === idx ? 1 : 0.3}>
              <circle cx={pos.x} cy={pos.y} r={14} className="fill-sky-600 dark:fill-sky-400" />
              <line x1={pos.x - ax} y1={pos.y - ay} x2={pos.x + ax} y2={pos.y + ay} strokeWidth={2} className="stroke-fg" />
              <circle cx={pos.x + ax} cy={pos.y + ay} r={2.5} className="fill-fg" />
            </g>
          ))}
        </svg>
        <p className="text-xs text-fg-subtle">הציר נוטה תמיד לאותו כיוון. הנקודה בקצה הציר: הקוטב הצפוני. לא בקנה מידה.</p>
      </section>
      <section className="rounded-lg border border-line bg-card p-4 space-y-3">
        <h4 className="font-semibold text-fg">{p.date}</h4>
        <p className="text-sm text-fg-muted">{p.tilt}.</p>
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="rounded-md bg-subtle p-3">
            <div className="text-xs text-fg-muted">בישראל (חצי הכדור הצפוני)</div>
            <div className="text-lg font-semibold text-fg">{p.north}</div>
          </div>
          <div className="rounded-md bg-subtle p-3">
            <div className="text-xs text-fg-muted">באוסטרליה (חצי הכדור הדרומי)</div>
            <div className="text-lg font-semibold text-fg">{p.south}</div>
          </div>
          <div className="rounded-md bg-subtle p-3">
            <div className="text-xs text-fg-muted">גובה השמש בצהריים בירושלים</div>
            <div className="text-lg font-semibold text-fg">כ-{p.altitude} מעלות</div>
          </div>
          <div className="rounded-md bg-subtle p-3">
            <div className="text-xs text-fg-muted">אורך היום בירושלים</div>
            <div className="text-base font-semibold text-fg">{p.day}</div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ---------- Moon phases ----------

const SYNODIC = 29.53;
const PHASE_NAMES = ["מולד", "סהר מתמלא", "רבע ראשון", "ירח כמעט מלא", "ירח מלא", "ירח מתמעט", "רבע אחרון", "סהר מתמעט"];

/** Moon disc as seen from Israel: lit from the right while waxing, from the left while waning. */
function MoonDisc({ day }: { day: number }) {
  const r = 56;
  const phase = (day % SYNODIC) / SYNODIC; // 0 new, 0.5 full
  const lit = (1 - Math.cos(2 * Math.PI * phase)) / 2; // illuminated fraction
  const waxing = phase < 0.5;
  // Terminator ellipse: x-radius goes from r (new/full) through 0 (quarters).
  const k = Math.abs(1 - 2 * lit) * r;
  const sweepOuter = waxing ? 1 : 0; // outer edge on the right while waxing
  const sweepInner = lit < 0.5 ? (waxing ? 0 : 1) : waxing ? 1 : 0;
  const d = `M 0 ${-r} A ${r} ${r} 0 0 ${sweepOuter} 0 ${r} A ${k} ${r} 0 0 ${sweepInner} 0 ${-r} Z`;
  return (
    <svg viewBox="-64 -64 128 128" className="w-36 h-36" role="img" aria-label={`הירח מואר בכ-${Math.round(lit * 100)}%`}>
      <circle r={r} className="fill-zinc-700 dark:fill-zinc-800" />
      <path d={d} className="fill-zinc-100" />
      <circle r={r} fill="none" className="stroke-line-strong" />
    </svg>
  );
}

function MoonTab() {
  const [day, setDay] = useState(7);
  const phaseIdx = Math.round((day / SYNODIC) * 8) % 8;
  const lit = Math.round(((1 - Math.cos((2 * Math.PI * day) / SYNODIC)) / 2) * 100);
  // Top view: Sun to the right, Moon goes counter-clockwise starting between Earth and Sun.
  const ang = -(day / SYNODIC) * 2 * Math.PI;
  const R = 70, mx = 90 + R * Math.cos(ang), my = 90 + R * Math.sin(ang);
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <section className="rounded-lg border border-line bg-card p-4 space-y-3">
        <label className="block space-y-2">
          <span className="flex justify-between text-sm text-fg">
            <span>ימים מהמולד</span>
            <strong>{day}</strong>
          </span>
          <input
            type="range"
            min={0}
            max={29}
            value={day}
            onChange={(e) => setDay(Number(e.target.value))}
            className="w-full cursor-pointer accent-[var(--accent)]"
            dir="ltr"
          />
        </label>
        <svg viewBox="0 0 220 180" className="w-full h-auto" role="img" aria-label="מבט מעל הקוטב הצפוני: הירח במסלולו סביב כדור הארץ, אור השמש מימין">
          <circle cx={90} cy={90} r={R} fill="none" className="stroke-line-strong" strokeDasharray="4 4" />
          <circle cx={90} cy={90} r={16} className="fill-sky-600 dark:fill-sky-400" />
          <path d="M 90 74 A 16 16 0 0 1 90 106 Z" className="fill-sky-300 dark:fill-sky-200" />
          <circle cx={mx} cy={my} r={8} className="fill-zinc-700" />
          <path d={`M ${mx} ${my - 8} A 8 8 0 0 1 ${mx} ${my + 8} Z`} className="fill-zinc-100" />
          {[30, 60, 90, 120, 150].map((y) => (
            <line key={y} x1={215} x2={190} y1={y} y2={y} strokeWidth={2} className="stroke-warning" />
          ))}
          <text x={200} y={18} textAnchor="middle" className="fill-warning text-[10px]">שמש</text>
        </svg>
        <p className="text-xs text-fg-subtle">מבט מעל הקוטב הצפוני. חצי הירח שפונה לשמש תמיד מואר.</p>
      </section>
      <section className="rounded-lg border border-line bg-card p-4 flex flex-col items-center justify-center gap-3 text-center">
        <span className="text-xs text-fg-muted">כך הירח נראה מישראל</span>
        <MoonDisc day={day} />
        <p className="text-lg font-semibold text-fg">{PHASE_NAMES[phaseIdx]}</p>
        <p className="text-sm text-fg-muted">מואר כ-{lit}% מהדיסקה</p>
      </section>
    </div>
  );
}

// ---------- Widget ----------

type Tab = "planets" | "seasons" | "moon";
const TABS: Tab[] = ["planets", "seasons", "moon"];

export default function AstronomyWidget({ initialTab = 0 }: { initialTab?: number }) {
  const [tab, setTab] = useState<Tab>(TABS[initialTab] ?? "planets");
  return (
    <div className="w-full rounded-xl border border-line bg-subtle p-4 sm:p-5 space-y-4 text-right">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-semibold text-fg">יישומון אסטרונומיה</h3>
        <Segmented<Tab>
          label="לשוניות היישומון"
          value={tab}
          onChange={setTab}
          options={[
            { value: "planets", label: <span className="inline-flex items-center gap-1.5"><Orbit className="w-4 h-4" strokeWidth={1.75} />כוכבי לכת</span> },
            { value: "seasons", label: <span className="inline-flex items-center gap-1.5"><Sun className="w-4 h-4" strokeWidth={1.75} />עונות</span> },
            { value: "moon", label: <span className="inline-flex items-center gap-1.5"><Moon className="w-4 h-4" strokeWidth={1.75} />ירח</span> },
          ]}
        />
      </div>
      {tab === "planets" ? <PlanetsTab /> : tab === "seasons" ? <SeasonsTab /> : <MoonTab />}
    </div>
  );
}
