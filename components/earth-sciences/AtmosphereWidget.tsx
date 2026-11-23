"use client";

import React, { useMemo, useState } from "react";
import { Check, RotateCcw, Sun, BarChart3, X } from "lucide-react";
import { Segmented, btn } from "@/components/site/ui";

// Unit 2 widget, two tabs: albedo (lesson "radiation-balance-atmosphere")
// and a climograph matching game (lesson "climate-zones").

// ---------- Albedo ----------

/** Typical albedo (share of sunlight reflected) of common surfaces, mid-range values. */
const SURFACES = [
  { id: "snow", name: "שלג טרי", albedo: 0.85, range: "80–90%" },
  { id: "sea-ice", name: "קרח ים", albedo: 0.6, range: "50–70%" },
  { id: "sand", name: "חול מדבר בהיר", albedo: 0.35, range: "30–40%" },
  { id: "grass", name: "דשא", albedo: 0.25, range: "כ-25%" },
  { id: "forest", name: "יער", albedo: 0.12, range: "10–15%" },
  { id: "asphalt", name: "אספלט", albedo: 0.07, range: "5–10%" },
  { id: "ocean", name: "ים פתוח", albedo: 0.07, range: "6–10%" },
] as const;

const SEA_ICE_ALBEDO = 0.6;
const OCEAN_ALBEDO = 0.07;

function AlbedoTab() {
  const [surfaceId, setSurfaceId] = useState<string>("snow");
  const [iceCover, setIceCover] = useState(100);
  const surface = SURFACES.find((s) => s.id === surfaceId) ?? SURFACES[0];
  const reflected = Math.round(surface.albedo * 100);

  const regionAlbedo = (iceCover / 100) * SEA_ICE_ALBEDO + (1 - iceCover / 100) * OCEAN_ALBEDO;
  const regionAbsorbed = Math.round((1 - regionAlbedo) * 100);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <section className="rounded-lg border border-line bg-card p-4 space-y-4">
        <h4 className="font-semibold text-fg">כמה אור מחזיר כל משטח?</h4>
        <div className="flex flex-wrap gap-2">
          {SURFACES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSurfaceId(s.id)}
              aria-pressed={s.id === surfaceId}
              className={`min-h-9 rounded-md border px-3 text-sm transition-colors cursor-pointer ${
                s.id === surfaceId ? "border-accent bg-accent-soft text-fg font-medium" : "border-line bg-subtle text-fg-muted hover:text-fg"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-fg">מוחזר לחלל: <strong>{reflected}%</strong></span>
            <span className="text-fg-muted">נבלע ומחמם: <strong className="text-fg">{100 - reflected}%</strong></span>
          </div>
          <div className="flex h-6 w-full overflow-hidden rounded-md border border-line" aria-hidden>
            <div className="bg-warning/50 transition-all duration-500" style={{ width: `${reflected}%` }} />
            <div className="bg-danger/70 transition-all duration-500" style={{ width: `${100 - reflected}%` }} />
          </div>
          <p className="text-sm text-fg-muted leading-relaxed">
            האלבדו של {surface.name}: בערך {surface.range}. כל המשטחים מקבלים אותה כמות אור. ההבדל הוא כמה מהאור כל משטח מחזיר, וכמה הוא בולע.
          </p>
        </div>
      </section>

      <section className="rounded-lg border border-line bg-card p-4 space-y-4">
        <h4 className="font-semibold text-fg">משוב הקרח-אלבדו</h4>
        <p className="text-sm text-fg-muted leading-relaxed">
          אזור בים הקוטב הצפוני. הזיזו את המחוון וראו מה קורה כשהקרח נמס והים הכהה נחשף.
        </p>
        <label className="block space-y-2">
          <span className="flex justify-between text-sm text-fg">
            <span>שטח מכוסה בקרח</span>
            <strong>{iceCover}%</strong>
          </span>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={iceCover}
            onChange={(e) => setIceCover(Number(e.target.value))}
            className="w-full cursor-pointer accent-[var(--accent)]"
            dir="ltr"
          />
        </label>
        <div className="flex h-16 w-full overflow-hidden rounded-md border border-line" dir="ltr" aria-hidden>
          <div className="bg-sky-950 dark:bg-sky-900 transition-all duration-300" style={{ width: `${100 - iceCover}%` }} />
          <div className="bg-sky-50 dark:bg-sky-100 transition-all duration-300" style={{ width: `${iceCover}%` }} />
        </div>
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="rounded-md bg-subtle p-3">
            <div className="text-xs text-fg-muted">אלבדו האזור</div>
            <div className="text-xl font-semibold text-fg">{Math.round(regionAlbedo * 100)}%</div>
          </div>
          <div className="rounded-md bg-subtle p-3">
            <div className="text-xs text-fg-muted">קרינה שנבלעת</div>
            <div className="text-xl font-semibold text-danger">{regionAbsorbed}%</div>
          </div>
        </div>
        <p className="text-sm text-fg leading-relaxed">
          פחות קרח ← אלבדו נמוך יותר ← נבלעת יותר קרינה ← הים מתחמם ← עוד קרח נמס.
        </p>
      </section>
    </div>
  );
}

// ---------- Climograph game ----------

const MONTHS = ["ינו", "פבר", "מרץ", "אפר", "מאי", "יונ", "יול", "אוג", "ספט", "אוק", "נוב", "דצמ"];

type ZoneId = "tropical" | "desert" | "temperate" | "polar";

const ZONES: { id: ZoneId; name: string }[] = [
  { id: "tropical", name: "טרופי" },
  { id: "desert", name: "מדברי" },
  { id: "temperate", name: "ממוזג" },
  { id: "polar", name: "קוטבי" },
];

/** Climate normals 1991–2020 (INMET, NOAA, Met Office). Temperature in °C, precipitation in mm. */
const STATIONS: { name: string; zone: ZoneId; temps: number[]; precip: number[]; why: string }[] = [
  {
    name: "מנאוס, ברזיל",
    zone: "tropical",
    temps: [26.6, 26.6, 26.6, 26.7, 27.0, 27.3, 27.5, 28.2, 28.6, 28.5, 28.0, 27.2],
    precip: [306, 297, 321, 331, 233, 117, 67, 56, 79, 114, 188, 254],
    why: "חם כל השנה (כ-27°C), משרעת של 2°C בלבד, וכ-2,360 מ\"מ גשם. ליד קו המשווה.",
  },
  {
    name: "אסואן, מצרים",
    zone: "desert",
    temps: [16.3, 18.6, 22.9, 28.0, 32.2, 34.4, 35.1, 35.0, 32.7, 29.2, 22.7, 17.6],
    precip: [0.1, 0, 0.6, 0.3, 0.1, 0, 0, 0, 0.1, 0.7, 0, 0.1],
    why: "כמעט אין עמודות: כ-2 מ\"מ בשנה. משרעת גדולה, כ-19°C. חגורת הלחץ הגבוה סביב קו רוחב 30°.",
  },
  {
    name: "לונדון, בריטניה",
    zone: "temperate",
    temps: [5.6, 5.8, 7.9, 10.5, 13.7, 16.8, 19.0, 18.7, 15.9, 12.3, 8.4, 5.9],
    precip: [59, 45, 39, 42, 46, 47, 46, 53, 50, 65, 67, 57],
    why: "חורף קריר וקיץ מתון, וגשם בכמויות דומות בכל החודשים (כ-615 מ\"מ). הרוחות המערביות.",
  },
  {
    name: "אוטקיאגוויק, אלסקה",
    zone: "polar",
    temps: [-24.2, -24.4, -23.6, -15.6, -5.2, 2.2, 5.4, 4.3, 0.9, -6.0, -14.6, -21.3],
    precip: [4, 5, 5, 5, 7, 11, 25, 28, 20, 14, 9, 6],
    why: "תשעה חודשים מתחת לאפס, ומעט משקעים (כ-137 מ\"מ). מדבר קר ליד הקוטב.",
  },
];

function Climograph({ temps, precip }: { temps: number[]; precip: number[] }) {
  const W = 360, H = 220, L = 34, R = 34, T = 12, B = 26;
  const pw = W - L - R, ph = H - T - B;
  const tMin = -30, tMax = 40, pMax = 350;
  const ty = (t: number) => T + (ph * (tMax - t)) / (tMax - tMin);
  const py = (p: number) => T + ph * (1 - Math.min(p, pMax) / pMax);
  const bw = pw / 12;
  const line = temps.map((t, i) => `${L + i * bw + bw / 2},${ty(t)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="קלימוגרף: טמפרטורה בקו ומשקעים בעמודות" direction="ltr">
      {[-30, -20, -10, 0, 10, 20, 30, 40].map((t) => (
        <g key={t}>
          <line x1={L} x2={W - R} y1={ty(t)} y2={ty(t)} className="stroke-line" strokeDasharray={t === 0 ? "4 3" : undefined} />
          <text x={L - 5} y={ty(t) + 3.5} textAnchor="end" className="fill-danger text-[9px]">{t}</text>
        </g>
      ))}
      {[0, 100, 200, 300].map((p) => (
        <text key={p} x={W - R + 5} y={py(p) + 3.5} className="fill-sky-700 dark:fill-sky-300 text-[9px]">{p}</text>
      ))}
      {precip.map((p, i) => (
        <rect key={i} x={L + i * bw + bw * 0.15} y={py(p)} width={bw * 0.7} height={T + ph - py(p)} className="fill-sky-400/80 dark:fill-sky-500/70" />
      ))}
      <polyline points={line} fill="none" strokeWidth={2.5} className="stroke-danger" />
      {temps.map((t, i) => (
        <circle key={i} cx={L + i * bw + bw / 2} cy={ty(t)} r={2.5} className="fill-danger" />
      ))}
      {MONTHS.map((m, i) => (
        <text key={m} x={L + i * bw + bw / 2} y={H - 8} textAnchor="middle" className="fill-fg-muted text-[9px]">{m}</text>
      ))}
      <rect x={L} y={T} width={pw} height={ph} fill="none" className="stroke-line-strong" />
    </svg>
  );
}

function ClimographTab() {
  const order = useMemo(() => [2, 0, 3, 1], []);
  const [round, setRound] = useState(0);
  const [guess, setGuess] = useState<ZoneId | null>(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const done = round >= order.length;
  const station = STATIONS[order[Math.min(round, order.length - 1)]];
  const correct = guess === station.zone;

  const check = () => {
    if (!guess) return;
    setChecked(true);
    if (guess === station.zone) setScore((s) => s + 1);
  };
  const next = () => {
    setRound((r) => r + 1);
    setGuess(null);
    setChecked(false);
  };
  const restart = () => {
    setRound(0);
    setGuess(null);
    setChecked(false);
    setScore(0);
  };

  if (done) {
    return (
      <div className="rounded-lg border border-line bg-card p-6 text-center space-y-3">
        <p className="text-lg font-semibold text-fg">זיהיתם נכון {score} מתוך {order.length} קלימוגרפים</p>
        <button type="button" onClick={restart} className={btn.secondary}>
          <RotateCcw className="w-4 h-4" strokeWidth={1.75} />
          שוב מההתחלה
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[3fr_2fr]">
      <section className="rounded-lg border border-line bg-card p-4">
        <div className="flex justify-between text-sm text-fg-muted mb-2">
          <span>קלימוגרף {round + 1} מתוך {order.length}</span>
          <span>נכונים: {score}</span>
        </div>
        <Climograph temps={station.temps} precip={station.precip} />
        <div className="flex justify-between text-xs mt-1">
          <span className="text-danger">קו: טמפרטורה (°C)</span>
          <span className="text-sky-700 dark:text-sky-300">עמודות: משקעים (מ&quot;מ)</span>
        </div>
      </section>
      <section className="rounded-lg border border-line bg-card p-4 space-y-3">
        <h4 className="font-semibold text-fg">לאיזה אזור אקלים שייך הקלימוגרף?</h4>
        <div className="grid grid-cols-2 gap-2">
          {ZONES.map((z) => {
            const isPicked = guess === z.id;
            const showRight = checked && z.id === station.zone;
            const showWrong = checked && isPicked && !correct;
            return (
              <button
                key={z.id}
                type="button"
                disabled={checked}
                onClick={() => setGuess(z.id)}
                aria-pressed={isPicked}
                className={`min-h-11 rounded-md border px-3 text-sm transition-colors cursor-pointer disabled:cursor-default ${
                  showRight
                    ? "border-success bg-success-soft text-success font-medium"
                    : showWrong
                      ? "border-danger bg-danger-soft text-danger"
                      : isPicked
                        ? "border-accent bg-accent-soft text-fg font-medium"
                        : "border-line bg-subtle text-fg-muted hover:text-fg"
                }`}
              >
                {z.name}
              </button>
            );
          })}
        </div>
        {!checked ? (
          <button type="button" onClick={check} disabled={!guess} className={`${btn.primary} w-full`}>
            בדיקה
          </button>
        ) : (
          <div className="space-y-3">
            <p className={`flex items-center gap-1.5 text-sm font-medium ${correct ? "text-success" : "text-danger"}`}>
              {correct ? <Check className="w-4 h-4" strokeWidth={1.75} /> : <X className="w-4 h-4" strokeWidth={1.75} />}
              {correct ? "נכון!" : "לא בדיוק."} זה {station.name}.
            </p>
            <p className="text-sm text-fg-muted leading-relaxed">{station.why}</p>
            <button type="button" onClick={next} className={`${btn.secondary} w-full`}>
              {round + 1 < order.length ? "לקלימוגרף הבא" : "לתוצאה"}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

// ---------- Widget ----------

type Tab = "albedo" | "climograph";

export default function AtmosphereWidget({ initialTab = 0 }: { initialTab?: number }) {
  const [tab, setTab] = useState<Tab>(initialTab === 1 ? "climograph" : "albedo");
  return (
    <div className="w-full rounded-xl border border-line bg-subtle p-4 sm:p-5 space-y-4 text-right">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-semibold text-fg">יישומון מזג אוויר ואקלים</h3>
        <Segmented<Tab>
          label="לשוניות היישומון"
          value={tab}
          onChange={setTab}
          options={[
            { value: "albedo", label: <span className="inline-flex items-center gap-1.5"><Sun className="w-4 h-4" strokeWidth={1.75} />אלבדו וקרינה</span> },
            { value: "climograph", label: <span className="inline-flex items-center gap-1.5"><BarChart3 className="w-4 h-4" strokeWidth={1.75} />משחק קלימוגרפים</span> },
          ]}
        />
      </div>
      {tab === "albedo" ? <AlbedoTab /> : <ClimographTab />}
    </div>
  );
}
