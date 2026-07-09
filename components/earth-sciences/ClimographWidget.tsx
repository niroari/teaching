"use client";

import React, { useState } from "react";
import { Check, X, RefreshCw, BarChart2, HelpCircle } from "lucide-react";

interface ClimateZone {
  id: string;
  name: string;
  desc: string;
  temps: number[]; // 12 months temperature
  precip: number[]; // 12 months precipitation
  annualPrecip: string;
  tempRange: string;
  explanation: string;
}

const CLIMATE_ZONES: ClimateZone[] = [
  {
    id: "tropical",
    name: "אקלים טרופי (ג'ונגל)",
    desc: "ממוקם סמוך לקו המשווה. חם ולח מאוד לאורך כל השנה ללא עונות מוגדרות.",
    temps: [26, 26, 27, 27, 26, 26, 25, 25, 26, 26, 26, 26],
    precip: [250, 220, 280, 310, 290, 180, 150, 190, 220, 260, 300, 280],
    annualPrecip: "2,930 מ\"מ",
    tempRange: "2°C (נמוכה מאוד)",
    explanation: "הטמפרטורה יציבה סביב 26 מעלות בגלל קירבה לקו המשווה (קרינה קבועה). כמויות המשקעים אדירות בכל חודשי השנה בגלל התאיידות מסיבית של מים."
  },
  {
    id: "desert",
    name: "אקלים מדברי יבש",
    desc: "רצועת המדבריות העולמית (קווי רוחב 20-30). חם מאוד ביום, ללא משקעים כמעט.",
    temps: [14, 16, 21, 26, 32, 36, 38, 37, 33, 27, 20, 15],
    precip: [8, 5, 2, 0, 0, 0, 0, 0, 0, 1, 4, 7],
    annualPrecip: "27 מ\"מ (בצורת קשה)",
    tempRange: "24°C (גבוהה מאוד)",
    explanation: "בקיץ חם בצורה קיצונית בשל היעדר עננות המאפשרת קרינה ישירה. בחורף קריר. המשקעים אפסיים בגלל מערכות לחץ גבוה קבועות (רמה ברומטרית) המונעות היווצרות עננים."
  },
  {
    id: "temperate",
    name: "אקלים ממוזג (אירופאי)",
    desc: "קווי רוחב בינוניים. ארבע עונות שנה מוגדרות היטב עם משקעים מפוזרים.",
    temps: [2, 3, 7, 11, 16, 20, 22, 21, 17, 12, 6, 3],
    precip: [65, 55, 60, 50, 60, 70, 75, 80, 70, 65, 70, 75],
    annualPrecip: "815 מ\"מ",
    tempRange: "20°C (בינונית)",
    explanation: "הטמפרטורה משתנה באופן ניכר בין חורף קר (סביב 2 מעלות) לקיץ חמים (סביב 22 מעלות). המשקעים יורדים לאורך כל השנה כמערכות גשם חזיתיות."
  },
  {
    id: "polar",
    name: "אקלים קוטבי (קפוא)",
    desc: "אזורי הקטבים. קור קיצוני מתמשך, רוב השנה מתחת לאפס ומשקעי שלג מועטים.",
    temps: [-28, -30, -26, -18, -8, -2, -1, -3, -9, -17, -23, -27],
    precip: [15, 12, 10, 8, 12, 15, 20, 22, 18, 15, 12, 14],
    annualPrecip: "173 מ\"מ (מדבר קפוא)",
    tempRange: "29°C (גבוהה)",
    explanation: "הטמפרטורה מתחת לאפס כמעט כל השנה בגלל זווית פגיעה שטוחה מאוד של קרני השמש. כמות המשקעים קטנה (נחשב למדבר מבחינת כמות מים) בגלל קור קיצוני המונע התאיידות מים."
  }
];

const MONTHS = ["ינו", "פבר", "מרץ", "אפר", "מאי", "יונ", "יול", "אוג", "ספט", "אוק", "נוב", "דצמ"];

export default function ClimographWidget() {
  const [currentIndex, setCurrentIndex] = useState(0); // Active Climograph to solve
  const [selectedGuess, setSelectedGuess] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const activeZone = CLIMATE_ZONES[currentIndex];

  const handleGuess = (zoneId: string) => {
    if (checked) return;
    setSelectedGuess(zoneId);
  };

  const handleCheck = () => {
    if (!selectedGuess) return;
    setChecked(true);
    const isCorrect = selectedGuess === activeZone.id;
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));
  };

  const handleNext = () => {
    setSelectedGuess(null);
    setChecked(false);
    // Go to next index cyclically
    setCurrentIndex(prev => (prev + 1) % CLIMATE_ZONES.length);
  };

  // Find heights and positions for SVG rendering
  const maxPrecip = Math.max(...activeZone.precip, 100); // normalized height calculation
  const maxPrecipScale = maxPrecip * 1.2;

  // Temperature ranges from -40 to 45
  const getTempY = (temp: number) => {
    const minT = -40;
    const maxT = 45;
    const height = 180;
    // Map temperature to Y coordinate (0 at top, height at bottom)
    const percentage = (temp - minT) / (maxT - minT);
    return height - percentage * height + 10;
  };

  const getPrecipHeight = (p: number) => {
    const height = 180;
    return (p / maxPrecipScale) * height;
  };

  return (
    <div className="w-full bg-surface border border-border-custom rounded-2xl overflow-hidden shadow-xl flex flex-col">
      <div className="flex border-b border-border-custom bg-surface-hover/30 p-4 justify-between items-center">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-earth" />
          <h3 className="font-bold text-white text-sm md:text-base">מפענח הקלימוגרפים הכיתתי</h3>
        </div>
        <div className="text-xs text-text-muted bg-surface rounded-lg px-3 py-1 border border-border-custom font-bold">
          ציון כיתתי: {score.correct} מתוך {score.total}
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="bg-earth/5 border border-earth/20 rounded-xl p-4 flex gap-3 text-xs md:text-sm text-text-muted leading-relaxed">
          <HelpCircle className="w-5 h-5 text-earth shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-white block mb-1">מיומנות גאוגרפית - ניתוח קלימוגרף:</span>
            לפניכם קלימוגרף אנונימי. נתחו את עמודות הגשם הכחולות (משקעים במילימטר) ואת קו הטמפרטורה האדום (במעלות צלזיוס). 
            זהו את אזור האקלים המתאים מתוך האפשרויות למטה!
          </div>
        </div>

        {/* Climograph Display */}
        <div className="bg-zinc-950/40 border border-border-custom rounded-2xl p-6 flex flex-col items-center">
          <div className="w-full max-w-lg relative h-[240px] flex items-end justify-between border-b border-zinc-700/60 pb-8 px-4">
            
            {/* Left Axis: Precipitation (mm) */}
            <div className="absolute left-0 bottom-8 top-2 flex flex-col justify-between text-[9px] text-sky-400 font-bold border-r border-zinc-800 pr-1">
              <span>{Math.round(maxPrecipScale)}mm</span>
              <span>{Math.round(maxPrecipScale * 0.75)}mm</span>
              <span>{Math.round(maxPrecipScale * 0.5)}mm</span>
              <span>{Math.round(maxPrecipScale * 0.25)}mm</span>
              <span>0mm</span>
            </div>

            {/* Right Axis: Temperature (°C) */}
            <div className="absolute right-0 bottom-8 top-2 flex flex-col justify-between text-[9px] text-rose-400 font-bold border-l border-zinc-800 pl-1 text-left">
              <span>45°C</span>
              <span>20°C</span>
              <span>0°C</span>
              <span>-20°C</span>
              <span>-40°C</span>
            </div>

            {/* SVG graph overlay */}
            <svg className="absolute inset-x-12 bottom-8 top-2 w-[calc(100%-6rem)] h-[190px] overflow-visible" pointerEvents="none">
              {/* Grid Lines */}
              <line x1="0" y1={getTempY(0)} x2="100%" y2={getTempY(0)} stroke="rgba(239, 68, 68, 0.2)" strokeDasharray="3 3" />
              <line x1="0" y1="95" x2="100%" y2="95" stroke="rgba(255, 255, 255, 0.05)" />

              {/* Draw Precipitation Bars */}
              {activeZone.precip.map((p, i) => {
                const count = activeZone.precip.length;
                const barWidth = 8;
                // Calculate percentage-based X position
                const xPos = `calc(${i} * (100% / ${count}) + (100% / ${count}) / 2 - ${barWidth / 2}px)`;
                const barHeight = getPrecipHeight(p);
                return (
                  <rect
                    key={i}
                    x={xPos}
                    y={180 - barHeight + 10}
                    width={barWidth}
                    height={barHeight}
                    fill="#38bdf8"
                    opacity="0.7"
                    rx="1"
                  />
                );
              })}

              {/* Draw Temperature Line path */}
              {(() => {
                const points = activeZone.temps.map((t, i) => {
                  const count = activeZone.temps.length;
                  const x = `calc(${i} * (100% / ${count}) + (100% / ${count}) / 2)`;
                  const y = getTempY(t);
                  return `${x},${y}`;
                });
                
                // Construct path in string (using SVG foreignObject for custom path calculation or standard line coordinates)
                // Because CSS calc is complex in standard SVG path string, we can draw individual lines or render circles
                return activeZone.temps.map((t, i) => {
                  if (i === 0) return null;
                  const prevT = activeZone.temps[i - 1];
                  const count = activeZone.temps.length;
                  const x1 = `calc(${i - 1} * (100% / ${count}) + (100% / ${count}) / 2)`;
                  const y1 = getTempY(prevT);
                  const x2 = `calc(${i} * (100% / ${count}) + (100% / ${count}) / 2)`;
                  const y2 = getTempY(t);
                  return (
                    <line
                      key={i}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="#ef4444"
                      strokeWidth="2.5"
                    />
                  );
                });
              })()}

              {/* Draw Temperature Circles */}
              {activeZone.temps.map((t, i) => {
                const count = activeZone.temps.length;
                const x = `calc(${i} * (100% / ${count}) + (100% / ${count}) / 2)`;
                const y = getTempY(t);
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="3.5"
                    fill="#ffffff"
                    stroke="#ef4444"
                    strokeWidth="2"
                  />
                );
              })}
            </svg>

            {/* Months labels along bottom */}
            <div className="absolute inset-x-12 bottom-2 h-5 flex justify-between text-[9px] text-text-muted font-bold">
              {MONTHS.map((m, i) => (
                <span key={i} className="w-[calc(100%/12)] text-center">{m}</span>
              ))}
            </div>
          </div>

          <div className="flex gap-6 mt-4 text-xs">
            <span className="flex items-center gap-1.5 font-bold text-sky-400">
              <span className="w-3.5 h-1.5 bg-sky-400 opacity-70 rounded" />
              <span>עמודות: משקעים (גשם/שלג) ב-mm</span>
            </span>
            <span className="flex items-center gap-1.5 font-bold text-rose-400">
              <span className="w-3.5 h-1 bg-rose-400 rounded-full" />
              <span>קו: טמפרטורה ב-C°</span>
            </span>
          </div>
        </div>

        {/* Statistical helpers */}
        <div className="grid grid-cols-2 gap-4 bg-surface/40 p-4 border border-border-custom rounded-xl">
          <div className="text-right">
            <span className="text-[10px] text-text-muted block">כמות משקעים שנתית מצטברת:</span>
            <span className="text-sm font-black text-sky-400">{checked ? activeZone.annualPrecip : "??? מ\"מ"}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-text-muted block">משרעת טמפרטורה שנתית:</span>
            <span className="text-sm font-black text-rose-400">{checked ? activeZone.tempRange : "??°C"}</span>
          </div>
        </div>

        {/* Options to select */}
        <div className="space-y-3">
          <h5 className="text-xs font-bold text-text-muted">בחרו את אזור האקלים המתאים לקלימוגרף:</h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CLIMATE_ZONES.map(z => {
              const isSelected = selectedGuess === z.id;
              let btnClass = "border-border-custom bg-surface hover:bg-surface-hover hover:border-zinc-600";
              if (isSelected) {
                btnClass = "border-earth bg-earth/10 ring-2 ring-earth/30";
              }
              if (checked) {
                if (z.id === activeZone.id) {
                  btnClass = "border-emerald-500 bg-emerald-950/20 text-emerald-300 ring-2 ring-emerald-500/20";
                } else if (isSelected) {
                  btnClass = "border-red-500 bg-red-950/20 text-red-300 ring-2 ring-red-500/20";
                } else {
                  btnClass = "border-zinc-800 bg-surface/20 opacity-40 cursor-default";
                }
              }

              return (
                <button
                  key={z.id}
                  disabled={checked}
                  onClick={() => handleGuess(z.id)}
                  className={`p-4 rounded-xl border text-right transition-all flex flex-col justify-center h-20 text-xs cursor-pointer ${btnClass}`}
                >
                  <span className="font-bold text-white block">{z.name}</span>
                  <span className="text-[10px] text-text-muted block mt-1 leading-snug">{z.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex gap-4 pt-4 border-t border-border-custom justify-end items-center">
          {checked && (
            <div className="flex-1 text-right text-xs leading-relaxed">
              {selectedGuess === activeZone.id ? (
                <span className="text-emerald-400 font-bold block">✓ תשובה נכונה!</span>
              ) : (
                <span className="text-red-400 font-bold block">✗ טעות. האקלים הנכון הוא {activeZone.name}.</span>
              )}
              <span className="text-text-muted text-[11px] block mt-0.5">{activeZone.explanation}</span>
            </div>
          )}

          {!checked ? (
            <button
              onClick={handleCheck}
              disabled={!selectedGuess}
              className={`px-6 py-2.5 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all ${
                selectedGuess
                  ? "bg-earth hover:bg-teal-600 text-white cursor-pointer"
                  : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
              }`}
            >
              <Check className="w-4 h-4" />
              <span>בדיקת תשובה</span>
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-2.5 bg-earth hover:bg-teal-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <RefreshCw className="w-4 h-4 animate-spin-hover" />
              <span>קלימוגרף הבא ←</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
