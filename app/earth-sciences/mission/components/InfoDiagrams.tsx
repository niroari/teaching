import React from "react";
import type { DiagramId } from "@/lib/data/mission-info-sheets";

// Small inline diagrams for the stage info sheets. Lines and labels use
// currentColor so they read in both the dark theme and Comfort Reading Mode.
const SUN = "#f59e0b";
const EARTH = "#0ea5e9";
const LIT = "#e5e7eb";
const DARK = "#475569";

const label = { fill: "currentColor", fontSize: 11, textAnchor: "middle" as const, fontFamily: "inherit" };

function Arrow({ id }: { id: string }) {
  return (
    <marker id={id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
    </marker>
  );
}

function Spheres() {
  const items = [
    { x: 60, y: 38, icon: "🌬️", name: "אטמוספרה", color: "#38bdf8" },
    { x: 200, y: 38, icon: "💧", name: "הידרוספרה", color: "#3b82f6" },
    { x: 200, y: 122, icon: "🌱", name: "ביוספרה", color: "#22c55e" },
    { x: 60, y: 122, icon: "🪨", name: "גאוספרה", color: "#a16207" },
  ];
  return (
    <svg viewBox="0 0 260 160" className="w-full h-auto">
      <defs>
        <Arrow id="sph-a" />
      </defs>
      {items.map((it, i) => {
        const next = items[(i + 1) % items.length];
        return (
          <line
            key={it.name}
            x1={it.x + (next.x - it.x) * 0.25}
            y1={it.y + (next.y - it.y) * 0.25}
            x2={it.x + (next.x - it.x) * 0.75}
            y2={it.y + (next.y - it.y) * 0.75}
            stroke="currentColor"
            strokeOpacity={0.5}
            strokeWidth={1.5}
            markerEnd="url(#sph-a)"
          />
        );
      })}
      <circle cx={130} cy={80} r={20} fill={EARTH} fillOpacity={0.85} />
      <text x={130} y={86} {...label} fontSize={16}>
        🌍
      </text>
      {items.map((it) => (
        <g key={it.name}>
          <circle cx={it.x} cy={it.y} r={22} fill={it.color} fillOpacity={0.2} stroke={it.color} />
          <text x={it.x} y={it.y + 6} {...label} fontSize={18}>
            {it.icon}
          </text>
          <text x={it.x} y={it.y + (it.y < 80 ? -27 : 36)} {...label}>
            {it.name}
          </text>
        </g>
      ))}
    </svg>
  );
}

function SolarSystem() {
  const planets = [
    { r: 3, c: "#a8a29e" },
    { r: 5, c: "#fbbf24" },
    { r: 5, c: EARTH },
    { r: 4, c: "#ef4444" },
    { r: 12, c: "#f97316" },
    { r: 10, c: "#eab308" },
    { r: 8, c: "#22d3ee" },
    { r: 8, c: "#6366f1" },
  ];
  let x = 40;
  const xs = planets.map((p, i) => {
    x += (i === 4 ? 26 : 12) + p.r;
    const at = x;
    x += p.r;
    return at;
  });
  return (
    <svg viewBox="0 0 260 110" className="w-full h-auto">
      <circle cx={0} cy={50} r={34} fill={SUN} />
      {planets.map((p, i) => (
        <circle key={i} cx={xs[i]} cy={50} r={p.r} fill={p.c} />
      ))}
      <path d={`M${xs[0] - 4},72 v6 H${xs[3] + 4} v-6`} fill="none" stroke="currentColor" strokeOpacity={0.6} />
      <text x={(xs[0] + xs[3]) / 2} y={94} {...label}>
        סלעיים
      </text>
      <path d={`M${xs[4] - 12},72 v6 H${xs[7] + 8} v-6`} fill="none" stroke="currentColor" strokeOpacity={0.6} />
      <text x={(xs[4] + xs[7]) / 2} y={94} {...label}>
        גזיים
      </text>
      <text x={18} y={100} {...label}>
        השמש
      </text>
    </svg>
  );
}

function Gravity() {
  return (
    <svg viewBox="0 0 260 110" className="w-full h-auto">
      <defs>
        <Arrow id="grav-a" />
      </defs>
      <circle cx={60} cy={50} r={32} fill={SUN} fillOpacity={0.85} />
      <text x={60} y={98} {...label}>
        מסה גדולה
      </text>
      <circle cx={210} cy={50} r={12} fill={EARTH} />
      <text x={210} y={98} {...label}>
        מסה קטנה
      </text>
      <line x1={194} y1={50} x2={96} y2={50} stroke="currentColor" strokeWidth={2} markerStart="url(#grav-a)" markerEnd="url(#grav-a)" />
      <text x={145} y={40} {...label}>
        משיכה
      </text>
    </svg>
  );
}

function Motions() {
  return (
    <svg viewBox="0 0 260 130" className="w-full h-auto">
      <defs>
        <Arrow id="mot-a" />
      </defs>
      <ellipse cx={130} cy={62} rx={105} ry={42} fill="none" stroke="currentColor" strokeOpacity={0.45} strokeDasharray="4 4" />
      <path d="M 60 25 Q 130 8 200 25" fill="none" stroke="currentColor" strokeOpacity={0.7} markerEnd="url(#mot-a)" />
      <circle cx={130} cy={62} r={16} fill={SUN} />
      <g transform="translate(235 62) rotate(23.5)">
        <line x1={0} y1={-20} x2={0} y2={20} stroke="currentColor" strokeWidth={1.5} />
        <circle r={10} fill={EARTH} />
        <path d="M -14 -4 A 14 6 0 0 0 14 -4" fill="none" stroke="currentColor" markerEnd="url(#mot-a)" />
      </g>
      <text x={130} y={122} {...label}>
        הקפה סביב השמש = שנה
      </text>
      <text x={222} y={102} {...label}>
        סיבוב = יום
      </text>
    </svg>
  );
}

// One moon phase: dark disc, lit right half, and an ellipse that is lit (gibbous) or dark (crescent).
function Moon({ cx, lit }: { cx: number; lit: number }) {
  const r = 14;
  const cy = 34;
  if (lit <= 0) return <circle cx={cx} cy={cy} r={r} fill={DARK} />;
  if (lit >= 1) return <circle cx={cx} cy={cy} r={r} fill={LIT} />;
  const rx = Math.abs(1 - 2 * lit) * r;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={DARK} />
      <path d={`M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r} Z`} fill={LIT} />
      {rx > 0.5 && <ellipse cx={cx} cy={cy} rx={rx} ry={r} fill={lit > 0.5 ? LIT : DARK} />}
    </g>
  );
}

function Phases() {
  const phases = [
    { lit: 0, name: "חדש" },
    { lit: 0.25, name: "סהר" },
    { lit: 0.5, name: "חצי" },
    { lit: 0.75, name: "כמעט מלא" },
    { lit: 1, name: "מלא" },
  ];
  return (
    <svg viewBox="0 0 260 74" className="w-full h-auto">
      {phases.map((p, i) => {
        const cx = 234 - i * 52; // read right to left
        return (
          <g key={p.name}>
            <Moon cx={cx} lit={p.lit} />
            <text x={cx} y={66} {...label}>
              {p.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function Eclipse() {
  return (
    <svg viewBox="0 0 260 100" className="w-full h-auto">
      <polygon points="135,43 135,57 230,62 230,38" fill="currentColor" fillOpacity={0.18} />
      <circle cx={35} cy={50} r={30} fill={SUN} />
      <circle cx={135} cy={50} r={7} fill={DARK} stroke="currentColor" strokeOpacity={0.4} />
      <circle cx={228} cy={50} r={16} fill={EARTH} />
      <text x={35} y={95} {...label}>
        שמש
      </text>
      <text x={135} y={95} {...label}>
        ירח
      </text>
      <text x={228} y={95} {...label}>
        כדור הארץ
      </text>
      <text x={185} y={30} {...label} fontSize={10}>
        צל
      </text>
    </svg>
  );
}

function Tools() {
  return (
    <svg viewBox="0 0 260 110" className="w-full h-auto">
      <circle cx={45} cy={55} r={36} fill="none" stroke="currentColor" strokeOpacity={0.35} strokeDasharray="3 4" />
      <circle cx={45} cy={55} r={18} fill={EARTH} />
      <text x={45} y={52} {...label} fontSize={14}>
        🔭
      </text>
      <text x={81} y={42} {...label} fontSize={16}>
        🛰️
      </text>
      <line x1={100} y1={55} x2={205} y2={55} stroke="currentColor" strokeOpacity={0.35} strokeDasharray="2 5" />
      <text x={200} y={50} {...label} fontSize={16}>
        🚀
      </text>
      <circle cx={235} cy={55} r={14} fill="#ef4444" fillOpacity={0.8} />
      <text x={45} y={104} {...label}>
        טלסקופ
      </text>
      <text x={95} y={104} {...label}>
        לוויין
      </text>
      <text x={210} y={104} {...label}>
        גשושית
      </text>
    </svg>
  );
}

const DIAGRAMS: Record<DiagramId, () => React.ReactElement> = {
  spheres: Spheres,
  solarSystem: SolarSystem,
  gravity: Gravity,
  motions: Motions,
  phases: Phases,
  eclipse: Eclipse,
  tools: Tools,
};

export default function InfoDiagram({ id }: { id: DiagramId }) {
  const Diagram = DIAGRAMS[id];
  return <Diagram />;
}
