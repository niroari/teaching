"use client";

import React, { useState } from "react";
import { Sun, Globe, Moon, Check, X, RefreshCw, HelpCircle, AlertCircle } from "lucide-react";

interface Planet {
  name: string;
  type: "rocky" | "gaseous";
  desc: string;
  details: string;
}

const PLANETS: Planet[] = [
  { name: "מרקורי (כוכב חמה)", type: "rocky", desc: "הכי קרוב לשמש, קטן ונטול אטמוספרה משמעותית.", details: "מסה: 0.05 מסות ארץ · כבידה: 0.38g · טמפ': 173°C- עד 427°C" },
  { name: "ונוס (נוגה)", type: "rocky", desc: "אטמוספרה סמיכה מאוד מ-CO2, חממה קיצונית.", details: "מסה: 0.81 מסות ארץ · כבידה: 0.9g · טמפ': 462°C (הכי חם)" },
  { name: "כדור הארץ", type: "rocky", desc: "הבית שלנו. מים נוזליים, אטמוספרה מוגנת וחיים.", details: "מסה: 1 מסת ארץ · כבידה: 1g · טמפ': 15°C ממוצע" },
  { name: "מאדים", type: "rocky", desc: "כוכב הלכת האדום. אטמוספרה דלילה, קרח בקטבים.", details: "מסה: 0.11 מסות ארץ · כבידה: 0.38g · טמפ': 60°C- ממוצע" },
  { name: "יופיטר (צדק)", type: "gaseous", desc: "ענק הגזים. הגדול ביותר, בעל עשרות ירחים וסופה ענקית.", details: "מסה: 318 מסות ארץ · כבידה: 2.52g · מורכב בעיקר ממימן והליום" },
  { name: "שבתאי", type: "gaseous", desc: "מפורסם במערכת הטבעות המרהיבה והמפותחת שלו.", details: "מסה: 95 מסות ארץ · כבידה: 1.06g · צפיפות נמוכה ממים" },
  { name: "אורנוס (אורון)", type: "gaseous", desc: "ענק קרח כחלחל, ציר הסיבוב שלו נטוי כמעט לחלוטין על צדו.", details: "מסה: 14 מסות ארץ · כבידה: 0.89g · טמפ': 224°C- (הכי קר)" },
  { name: "נפטון (רהב)", type: "gaseous", desc: "כוכב הלכת המרוחק ביותר. רוחות עזות וצבע כחול עמוק.", details: "מסה: 17 מסות ארץ · כבידה: 1.14g · שנת הקפה: 165 שנות ארץ" }
];

export default function AstronomyWidget() {
  const [activeTab, setActiveTab] = useState<"sorter" | "simulator">("sorter");

  // Sorter State
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  const [sortedPlanets, setSortedPlanets] = useState<Record<string, "rocky" | "gaseous" | null>>(() => {
    const initial: Record<string, "rocky" | "gaseous" | null> = {};
    PLANETS.forEach(p => { initial[p.name] = null; });
    return initial;
  });
  const [showCheck, setShowCheck] = useState(false);

  // Simulator State
  const [simMode, setSimMode] = useState<"rotation" | "revolution" | "moon">("rotation");
  const [playAnim, setPlayAnim] = useState(true);
  const [revolutionStep, setRevolutionStep] = useState<number>(0); // 0: קיץ צפוני, 1: סתיו, 2: חורף צפוני, 3: אביב
  const [moonPhaseIndex, setMoonPhaseIndex] = useState<number>(4); // 0-7 positions of Moon
  const [moonSimSubMode, setMoonSimSubMode] = useState<"basic" | "advanced">("basic");

  const MOON_PHASES = [
    { name: "מולד הירח (New Moon)", desc: "הירח נמצא בין הארץ לשמש. הצד המואר פונה הרחק מאיתנו, ולכן הירח חשוך לחלוטין עבור צופה בכדור הארץ." },
    { name: "סהר צומח (Waxing Crescent)", desc: "חלק קטן ודק מהצד המואר מתחיל להיראות מצד ימין." },
    { name: "רבע ראשון (First Quarter)", desc: "חצי מהירח מואר (הצד הימני) - זווית של 90 מעלות בין השמש, הארץ והירח." },
    { name: "ירח כמעט מלא (Waxing Gibbous)", desc: "רוב הדיסקה מוארת, למעט סהר דק חשוך משמאל." },
    { name: "ירח מלא (Full Moon)", desc: "כדור הארץ נמצא בין השמש לירח. כל הצד המואר פונה אלינו." },
    { name: "ירח מתמעט (Waning Gibbous)", desc: "החלק המואר מתחיל להצטמצם, החלק החשוך מופיע מימין." },
    { name: "רבע אחרון (Third Quarter)", desc: "חצי מהירח מואר (הצד השמאלי) - הירח מתקרב לסיום ההקפה שלו." },
    { name: "סהר מתמעט (Waning Crescent)", desc: "סהר דק בלבד נותר מואר מצד שמאל, לפני מולד חדש." }
  ];

  const handleSort = (type: "rocky" | "gaseous") => {
    if (!selectedPlanet) return;
    setSortedPlanets(prev => ({
      ...prev,
      [selectedPlanet.name]: type
    }));
    setSelectedPlanet(null);
    setShowCheck(false);
  };

  const handleResetSorter = () => {
    const reset: Record<string, "rocky" | "gaseous" | null> = {};
    PLANETS.forEach(p => { reset[p.name] = null; });
    setSortedPlanets(reset);
    setSelectedPlanet(null);
    setShowCheck(false);
  };

  const checkResults = () => {
    setShowCheck(true);
  };

  const isAllSorted = Object.values(sortedPlanets).every(v => v !== null);

  const getPlanetStatusColor = (planet: Planet) => {
    if (!showCheck) return "border-border-custom bg-surface/30";
    const userChoice = sortedPlanets[planet.name];
    if (userChoice === planet.type) return "border-emerald-500/50 bg-emerald-950/20 text-emerald-300";
    return "border-red-500/50 bg-red-950/20 text-red-300";
  };

  const renderMoonPhasePreview = (idx: number) => {
    const size = 36;
    const r = 16;
    const c = size / 2;
    switch (idx) {
      case 0: // New Moon
        return (
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <circle cx={c} cy={c} r={r} fill="#090d16" stroke="#3f3f46" strokeWidth="1.5" />
          </svg>
        );
      case 1: // Waxing Crescent
        return (
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <circle cx={c} cy={c} r={r} fill="#090d16" stroke="#3f3f46" strokeWidth="1.5" />
            <path d={`M ${c} ${c - r} A ${r} ${r} 0 0 1 ${c} ${c + r} A ${r/2} ${r} 0 0 1 ${c} ${c - r}`} fill="#e4e4e7" />
          </svg>
        );
      case 2: // First Quarter
        return (
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <circle cx={c} cy={c} r={r} fill="#090d16" stroke="#3f3f46" strokeWidth="1.5" />
            <path d={`M ${c} ${c - r} A ${r} ${r} 0 0 1 ${c} ${c + r} Z`} fill="#e4e4e7" />
          </svg>
        );
      case 3: // Waxing Gibbous
        return (
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <circle cx={c} cy={c} r={r} fill="#e4e4e7" stroke="#3f3f46" strokeWidth="1.5" />
            <path d={`M ${c} ${c - r} A ${r} ${r} 0 0 0 ${c} ${c + r} A ${r/2} ${r} 0 0 0 ${c} ${c - r}`} fill="#090d16" />
          </svg>
        );
      case 4: // Full Moon
        return (
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <circle cx={c} cy={c} r={r} fill="#e4e4e7" stroke="#e4e4e7" />
            <circle cx={c} cy={c} r={r} fill="none" stroke="#3f3f46" strokeWidth="1.5" />
          </svg>
        );
      case 5: // Waning Gibbous
        return (
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <circle cx={c} cy={c} r={r} fill="#e4e4e7" stroke="#3f3f46" strokeWidth="1.5" />
            <path d={`M ${c} ${c - r} A ${r} ${r} 0 0 1 ${c} ${c + r} A ${r/2} ${r} 0 0 1 ${c} ${c - r}`} fill="#090d16" />
          </svg>
        );
      case 6: // Third Quarter
        return (
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <circle cx={c} cy={c} r={r} fill="#090d16" stroke="#3f3f46" strokeWidth="1.5" />
            <path d={`M ${c} ${c - r} A ${r} ${r} 0 0 0 ${c} ${c + r} Z`} fill="#e4e4e7" />
          </svg>
        );
      case 7: // Waning Crescent
        return (
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <circle cx={c} cy={c} r={r} fill="#090d16" stroke="#3f3f46" strokeWidth="1.5" />
            <path d={`M ${c} ${c - r} A ${r} ${r} 0 0 0 ${c} ${c + r} A ${r/2} ${r} 0 0 0 ${c} ${c - r}`} fill="#e4e4e7" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-surface border border-border-custom rounded-2xl overflow-hidden shadow-xl flex flex-col">
      {/* Widget Header Navigation */}
      <div className="flex border-b border-border-custom bg-surface-hover/30">
        <button
          onClick={() => setActiveTab("sorter")}
          className={`flex-1 py-4 text-sm md:text-base font-bold transition-all text-center cursor-pointer ${
            activeTab === "sorter"
              ? "text-earth border-b-2 border-earth bg-earth/5"
              : "text-text-muted hover:text-foreground"
          }`}
        >
          מיון כוכבי הלכת (סלעיים מול גזיים)
        </button>
        <button
          onClick={() => setActiveTab("simulator")}
          className={`flex-1 py-4 text-sm md:text-base font-bold transition-all text-center cursor-pointer ${
            activeTab === "simulator"
              ? "text-earth border-b-2 border-earth bg-earth/5"
              : "text-text-muted hover:text-foreground"
          }`}
        >
          הדמיית תנועות כדור הארץ והירח
        </button>
      </div>

      <div className="p-6 flex-1">
        {/* Tab 1: Planet Sorter */}
        {activeTab === "sorter" && (
          <div className="space-y-6">
            <div className="bg-earth/5 border border-earth/20 rounded-xl p-4 flex gap-3 text-sm text-text-muted leading-relaxed">
              <HelpCircle className="w-5 h-5 text-earth shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block mb-1 text-base">הנחיות לתרגול בכיתה:</span>
                בחרו כוכב לכת מרשימת הקלפים למטה (הוא יודגש), ולאחר מכן לחצו על אחת משתי הקטגוריות: "כוכבי לכת סלעיים" או "כוכבי לכת גזיים".
                בסיום המיון, לחצו על כפתור <strong>בדיקת תשובות</strong> כדי לראות אם צדקתם!
              </div>
            </div>

            {/* Main Sorting Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Rocky Bucket */}
              <div
                onClick={() => handleSort("rocky")}
                className={`border-2 border-dashed rounded-2xl p-5 flex flex-col items-center justify-start min-h-[160px] cursor-pointer transition-all ${
                  selectedPlanet 
                    ? "border-earth/40 hover:border-earth bg-earth/5 hover:bg-earth/10" 
                    : "border-border-custom hover:border-zinc-700 bg-surface/10"
                }`}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Globe className="w-5 h-5 text-amber-500" />
                  <h4 className="font-bold text-white text-lg">כוכבי לכת סלעיים פנימיים</h4>
                </div>
                <p className="text-xs md:text-sm text-text-muted text-center mb-4 leading-relaxed">ממוקמים קרוב לשמש, בעלי קרום סלעי מוצק, קטנים יחסית, בעלי כבידה נמוכה ומעט ירחים.</p>
                <div className="flex flex-wrap gap-2 justify-center w-full">
                  {PLANETS.filter(p => sortedPlanets[p.name] === "rocky").map(p => (
                    <div
                      key={p.name}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPlanet(p);
                      }}
                      className={`px-4 py-2 rounded-xl border text-sm font-bold cursor-pointer transition-all ${getPlanetStatusColor(p)}`}
                    >
                      {p.name}
                    </div>
                  ))}
                  {PLANETS.filter(p => sortedPlanets[p.name] === "rocky").length === 0 && (
                    <span className="text-sm text-text-muted/60 italic py-2">גררו או מיינו לכאן קלפים</span>
                  )}
                </div>
              </div>

              {/* Gaseous Bucket */}
              <div
                onClick={() => handleSort("gaseous")}
                className={`border-2 border-dashed rounded-2xl p-5 flex flex-col items-center justify-start min-h-[160px] cursor-pointer transition-all ${
                  selectedPlanet 
                    ? "border-earth/40 hover:border-earth bg-earth/5 hover:bg-earth/10" 
                    : "border-border-custom hover:border-zinc-700 bg-surface/10"
                }`}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Globe className="w-5 h-5 text-sky-400" />
                  <h4 className="font-bold text-white text-lg">כוכבי לכת גזיים חיצוניים</h4>
                </div>
                <p className="text-xs md:text-sm text-text-muted text-center mb-4 leading-relaxed">ממוקמים רחוק מהשמש, עשויים גזים (בעיקר מימן והליום), ענקיים, בעלי כבידה חזקה וירחים רבים.</p>
                <div className="flex flex-wrap gap-2 justify-center w-full">
                  {PLANETS.filter(p => sortedPlanets[p.name] === "gaseous").map(p => (
                    <div
                      key={p.name}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPlanet(p);
                      }}
                      className={`px-4 py-2 rounded-xl border text-sm font-bold cursor-pointer transition-all ${getPlanetStatusColor(p)}`}
                    >
                      {p.name}
                    </div>
                  ))}
                  {PLANETS.filter(p => sortedPlanets[p.name] === "gaseous").length === 0 && (
                    <span className="text-sm text-text-muted/60 italic py-2">גררו או מיינו לכאן קלפים</span>
                  )}
                </div>
              </div>
            </div>

            {/* Planets to be sorted */}
            <div className="space-y-3">
              <h5 className="text-sm font-bold text-text-muted">בחרו קלף למיון:</h5>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {PLANETS.map(p => {
                  const isSorted = sortedPlanets[p.name] !== null;
                  const isSelected = selectedPlanet?.name === p.name;
                  return (
                    <button
                      key={p.name}
                      disabled={isSorted && !showCheck}
                      onClick={() => setSelectedPlanet(isSelected ? null : p)}
                      className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between h-28 text-sm cursor-pointer ${
                        isSelected 
                          ? "border-earth bg-earth/10 ring-2 ring-earth/30" 
                          : isSorted 
                            ? "border-zinc-800 bg-surface-hover/20 opacity-40 cursor-default" 
                            : "border-border-custom bg-surface hover:bg-surface-hover hover:border-zinc-600"
                      }`}
                    >
                      <div>
                        <span className="font-bold text-white block">{p.name}</span>
                        <span className="text-xs text-text-muted block mt-1.5 leading-snug truncate-2-lines">{p.desc}</span>
                      </div>
                      <span className="text-[11px] text-text-muted/70 mt-1.5 block truncate">{p.details}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-4 pt-4 border-t border-border-custom justify-end">
              <button
                onClick={handleResetSorter}
                className="px-4 py-2.5 border border-border-custom bg-surface hover:bg-surface-hover text-xs md:text-sm font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>איפוס</span>
              </button>
              <button
                onClick={checkResults}
                disabled={!isAllSorted}
                className={`px-5 py-2.5 text-xs md:text-sm font-bold rounded-xl flex items-center gap-1.5 transition-all ${
                  isAllSorted
                    ? "bg-earth hover:bg-teal-600 text-white cursor-pointer"
                    : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>בדיקת תשובות</span>
              </button>
            </div>

            {/* Feedback Message */}
            {showCheck && (
              <div className="bg-surface border border-border-custom rounded-xl p-4 mt-2">
                <h5 className="font-bold text-white text-base mb-2">סיכום המיון הכיתתי:</h5>
                <ul className="text-sm text-text-muted space-y-2 list-disc pr-4">
                  <li>
                    <strong className="text-amber-400">כוכבי הלכת הסלעיים:</strong> מרקורי, נוגה, כדור הארץ ומאדים. כולם קרובים לחום השמש, קטנים ומוצקים.
                  </li>
                  <li>
                    <strong className="text-sky-400">כוכבי הלכת הגזיים:</strong> צדק, שבתאי, אורנוס ונפטון. מרוחקים, ענקיים ועשויים בעיקר ממעטפות גז עבות סביב ליבות קטנות.
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Movements Simulator */}
        {activeTab === "simulator" && (
          <div className="space-y-6">
            {/* Mode Selectors */}
            <div className="flex flex-wrap gap-2 border-b border-border-custom pb-3">
              <button
                onClick={() => setSimMode("rotation")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  simMode === "rotation" ? "bg-earth text-white" : "bg-surface hover:bg-surface-hover text-text-muted"
                }`}
              >
                סיבוב עצמי (יום ולילה)
              </button>
              <button
                onClick={() => setSimMode("revolution")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  simMode === "revolution" ? "bg-earth text-white" : "bg-surface hover:bg-surface-hover text-text-muted"
                }`}
              >
                הקפה סביב השמש (עונות)
              </button>
              <button
                onClick={() => setSimMode("moon")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  simMode === "moon" ? "bg-earth text-white" : "bg-surface hover:bg-surface-hover text-text-muted"
                }`}
              >
                הקפת הירח (מופעים)
              </button>
            </div>

            {/* Mode 1: Rotation */}
            {simMode === "rotation" && (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
                <div className="md:col-span-3 flex justify-center bg-zinc-950/40 border border-border-custom rounded-2xl p-6 relative overflow-hidden h-[300px]">
                  {/* Sun (Light source from left) */}
                  <div className="absolute -left-16 top-1/2 -translate-y-1/2 w-48 h-48 bg-amber-500 rounded-full blur-2xl opacity-30 pointer-events-none" />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col items-center z-10 text-amber-500">
                    <Sun className="w-16 h-16 animate-pulse" />
                    <span className="text-xs font-bold mt-1">קרינת השמש</span>
                  </div>

                  {/* Earth Sphere representation with rotating axis */}
                  <div className="relative w-48 h-48 top-6 flex items-center justify-center">
                    {/* Shadow Layer */}
                    <div className="absolute inset-0 rounded-full border border-zinc-800 z-10 bg-gradient-to-l from-black/80 via-black/10 to-transparent pointer-events-none" />
                    
                    {/* Tilted Axis line */}
                    <div className="absolute w-[2px] h-60 bg-red-500/40 rotate-[23.5deg] z-0 flex items-center justify-center">
                      <span className="absolute -top-6 text-[11px] text-red-400 font-bold rotate-[-23.5deg]">ציר נטוי 23.5°</span>
                    </div>

                    {/* Earth Body */}
                    <div 
                      className={`w-36 h-36 rounded-full bg-gradient-to-r from-[#1d4ed8] via-[#0ea5e9] to-[#10b981] relative overflow-hidden shadow-2xl flex items-center justify-center ${
                        playAnim ? "animate-[spin_10s_linear_infinite]" : ""
                      }`}
                    >
                      {/* Stylized Continents inside */}
                      <div className="absolute w-8 h-6 bg-emerald-600 rounded-full top-6 left-6" />
                      <div className="absolute w-12 h-8 bg-emerald-600 rounded-full top-12 right-6" />
                      <div className="absolute w-16 h-10 bg-emerald-600 rounded-full bottom-10 left-10" />
                    </div>

                    {/* Indicators */}
                    <div className="absolute left-4 top-8 text-xs text-amber-400 font-bold bg-zinc-950/70 border border-zinc-800 rounded px-2 py-0.5 z-20">
                      יום (מואר)
                    </div>
                    <div className="absolute right-4 bottom-8 text-xs text-slate-400 font-bold bg-zinc-950/70 border border-zinc-800 rounded px-2 py-0.5 z-20">
                      לילה (חשוך)
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-4 text-right">
                  <h4 className="font-bold text-white text-lg">הסיבוב העצמי של כדור הארץ</h4>
                  <p className="text-sm text-text-muted leading-relaxed">
                    כדור הארץ מסתובב סביב צירו (ממערב למזרח) פעם ב-24 שעות. 
                    <br /><br />
                    סיבוב זה הוא הגורם הישיר להיווצרות <strong>מחזור יום ולילה</strong>: 
                    החלק הפונה אל השמש מואר וחווה יום, בעוד החלק הנגדי חשוך וחווה לילה. 
                  </p>
                  
                  <div className="bg-surface/50 border border-border-custom rounded-xl p-3 text-xs md:text-sm text-text-muted space-y-2">
                    <span className="font-bold text-white block text-sm">💡 דגש פדגוגי למניעת טעויות:</span>
                    <span>תלמידים רבים חושבים שהשמש נעה באמת בשמיים. עלינו להבהיר כי זוהי <strong>תנועה מדומה</strong> - השמש יחסית סטטית במרכז המערכת, והתנועה בשמיים נגרמת בגלל הסיבוב של כדור הארץ עצמו!</span>
                  </div>

                  <button
                    onClick={() => setPlayAnim(!playAnim)}
                    className="w-full py-3 bg-surface hover:bg-surface-hover border border-border-custom text-sm font-bold rounded-xl cursor-pointer transition-all"
                  >
                    {playAnim ? "עצור הדמיה" : "הפעל הדמיה"}
                  </button>
                </div>
              </div>
            )}

            {/* Mode 2: Revolution */}
            {simMode === "revolution" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
                  <div className="md:col-span-3 flex justify-center items-center bg-zinc-950/40 border border-border-custom rounded-2xl p-6 relative h-[300px]">
                    {/* The Sun in the center */}
                    <div className="absolute w-16 h-16 bg-amber-500 rounded-full blur-md flex items-center justify-center shadow-lg shadow-amber-500/20 z-10">
                      <Sun className="w-8 h-8 text-yellow-100" />
                    </div>

                    {/* Orbit path (ellipse) */}
                    <div className="absolute w-[240px] h-[160px] border border-dashed border-zinc-700/60 rounded-full z-0" />

                    {/* Earth at 4 positions depending on step */}
                    {/* Step 0: Northern Summer (Right) */}
                    <div 
                      className={`absolute w-8 h-8 rounded-full border border-sky-400 bg-blue-600 transition-all duration-500 flex items-center justify-center z-20 cursor-pointer ${
                        revolutionStep === 0 ? "scale-125 ring-4 ring-earth/30" : "opacity-60"
                      }`}
                      style={{ transform: "translate(120px, 0px)" }}
                      onClick={() => setRevolutionStep(0)}
                    >
                      <Globe className="w-5 h-5 text-emerald-400 rotate-[23.5deg]" />
                      <span className="absolute -bottom-6 text-[11px] font-bold text-white whitespace-nowrap bg-zinc-900/80 px-1.5 py-0.5 rounded">יוני (קיץ צפוני)</span>
                    </div>

                    {/* Step 1: Autumn Equinox (Top) */}
                    <div 
                      className={`absolute w-8 h-8 rounded-full border border-sky-400 bg-blue-600 transition-all duration-500 flex items-center justify-center z-20 cursor-pointer ${
                        revolutionStep === 1 ? "scale-125 ring-4 ring-earth/30" : "opacity-60"
                      }`}
                      style={{ transform: "translate(0px, -80px)" }}
                      onClick={() => setRevolutionStep(1)}
                    >
                      <Globe className="w-5 h-5 text-emerald-400 rotate-[23.5deg]" />
                      <span className="absolute -top-6 text-[11px] font-bold text-white whitespace-nowrap bg-zinc-900/80 px-1.5 py-0.5 rounded">ספטמבר (סתיו)</span>
                    </div>

                    {/* Step 2: Northern Winter (Left) */}
                    <div 
                      className={`absolute w-8 h-8 rounded-full border border-sky-400 bg-blue-600 transition-all duration-500 flex items-center justify-center z-20 cursor-pointer ${
                        revolutionStep === 2 ? "scale-125 ring-4 ring-earth/30" : "opacity-60"
                      }`}
                      style={{ transform: "translate(-120px, 0px)" }}
                      onClick={() => setRevolutionStep(2)}
                    >
                      <Globe className="w-5 h-5 text-emerald-400 rotate-[23.5deg]" />
                      <span className="absolute -bottom-6 text-[11px] font-bold text-white whitespace-nowrap bg-zinc-900/80 px-1.5 py-0.5 rounded">דצמבר (חורף צפוני)</span>
                    </div>

                    {/* Step 3: Spring Equinox (Bottom) */}
                    <div 
                      className={`absolute w-8 h-8 rounded-full border border-sky-400 bg-blue-600 transition-all duration-500 flex items-center justify-center z-20 cursor-pointer ${
                        revolutionStep === 3 ? "scale-125 ring-4 ring-earth/30" : "opacity-60"
                      }`}
                      style={{ transform: "translate(0px, 80px)" }}
                      onClick={() => setRevolutionStep(3)}
                    >
                      <Globe className="w-5 h-5 text-emerald-400 rotate-[23.5deg]" />
                      <span className="absolute -bottom-6 text-[11px] font-bold text-white whitespace-nowrap bg-zinc-900/80 px-1.5 py-0.5 rounded">מרץ (אביב)</span>
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-4 text-right">
                    <h4 className="font-bold text-white text-lg">ההקפה סביב השמש ועונות השנה</h4>
                    <div className="text-sm text-text-muted leading-relaxed space-y-2">
                      <p>
                        כדור הארץ מקיף את השמש במסלול אליפטי פעם ב-365.25 ימים. 
                      </p>
                      <p>
                        בשל <strong>נטיית ציר כדור הארץ</strong> (23.5°), חצי הכדור שפונה ישירות אל השמש משתנה לאורך ההקפה. זהו הגורם הבלעדי ל<strong>עונות השנה</strong>.
                      </p>
                    </div>

                    <div className="bg-earth/5 border border-earth/20 rounded-xl p-3.5 text-xs md:text-sm text-text-muted space-y-2">
                      <span className="font-bold text-white block text-sm">בחרו עונה להסבר במצגת:</span>
                      {revolutionStep === 0 && (
                        <span>☀️ <strong>יוני (קיץ בחצי הכדור הצפוני):</strong> חצי הכדור הצפוני נטוי לקראת השמש, קרני האור פוגעות בו בזווית ישרה (מרוכזת), הימים ארוכים והטמפרטורה גבוהה.</span>
                      )}
                      {revolutionStep === 1 && (
                        <span>🍂 <strong>ספטמבר (סתיו):</strong> שני חצי הכדורים מקבלים קרינה שווה. יום השוויון של הסתיו.</span>
                      )}
                      {revolutionStep === 2 && (
                        <span>❄️ <strong>דצמבר (חורף בחצי הכדור הצפוני):</strong> חצי הכדור הצפוני נטוי הרחק מהשמש, קרני האור פוגעות בזווית חדה ומתפזרות, הימים קצרים והטמפרטורה נמוכה.</span>
                      )}
                      {revolutionStep === 3 && (
                        <span>🌸 <strong>מרץ (אביב):</strong> יום השוויון האביבי. קרינה מאוזנת בין הצפון לדרום.</span>
                      )}
                    </div>

                    {/* Step selection buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={() => setRevolutionStep(0)} className={`py-2 rounded-xl text-xs md:text-sm font-bold cursor-pointer transition-all ${revolutionStep === 0 ? "bg-earth text-white" : "bg-surface text-text-muted"}`}>יוני - קיץ</button>
                      <button onClick={() => setRevolutionStep(1)} className={`py-2 rounded-xl text-xs md:text-sm font-bold cursor-pointer transition-all ${revolutionStep === 1 ? "bg-earth text-white" : "bg-surface text-text-muted"}`}>ספטמבר - סתיו</button>
                      <button onClick={() => setRevolutionStep(2)} className={`py-2 rounded-xl text-xs md:text-sm font-bold cursor-pointer transition-all ${revolutionStep === 2 ? "bg-earth text-white" : "bg-surface text-text-muted"}`}>דצמבר - חורף</button>
                      <button onClick={() => setRevolutionStep(3)} className={`py-2 rounded-xl text-xs md:text-sm font-bold cursor-pointer transition-all ${revolutionStep === 3 ? "bg-earth text-white" : "bg-surface text-text-muted"}`}>מרץ - אביב</button>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-950/10 border border-amber-500/20 rounded-xl p-4 text-xs md:text-sm flex gap-2 text-amber-400">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <span>
                    <strong>הנחיה למורה למניעת תפיסה שגויה:</strong> הדגישו בפני התלמידים כי עונות השנה אינן נגרמות בגלל שינוי במרחק של כדור הארץ מהשמש! למעשה, בינואר (חורף בצפון) כדור הארץ קרוב לשמש מעט יותר מאשר ביולי. הכל תלוי אך ורק ב<strong>זווית פגיעת הקרניים</strong> הנובעת מנטיית הציר!
                  </span>
                </div>
              </div>
            )}

            {/* Mode 3: Moon Phases */}
            {simMode === "moon" && (
              <div className="flex flex-col gap-4">
                {/* Sub-mode selector */}
                {/* Sub-mode selector */}
                <div className="flex gap-2 bg-surface-hover/30 p-1.5 rounded-xl border border-border-custom self-start select-none">
                  <button
                    onClick={() => setMoonSimSubMode("basic")}
                    className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
                      moonSimSubMode === "basic" ? "bg-earth text-white" : "text-text-muted hover:text-white"
                    }`}
                  >
                    הדמיה בסיסית (עברית)
                  </button>
                  <button
                    onClick={() => setMoonSimSubMode("advanced")}
                    className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
                      moonSimSubMode === "advanced" ? "bg-earth text-white" : "text-text-muted hover:text-white"
                    }`}
                  >
                    סימולטור מורחב (PBS / UNL 🌐)
                  </button>
                </div>

                {moonSimSubMode === "basic" ? (
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
                    <div className="md:col-span-3 flex justify-center items-center bg-zinc-950/40 border border-border-custom rounded-2xl p-6 relative h-[300px]">
                      {/* Sun (far left) */}
                      <div className="absolute left-2 top-1/2 -translate-y-1/2 text-amber-500 flex flex-col items-center">
                        <Sun className="w-10 h-10" />
                        <span className="text-[11px] font-bold">אור שמש</span>
                      </div>

                      {/* Central Earth */}
                      <div className="absolute w-12 h-12 bg-blue-600 rounded-full border border-sky-400 flex items-center justify-center z-10">
                        <Globe className="w-7 h-7 text-emerald-400" />
                      </div>

                      {/* Moon Orbit */}
                      <div className="absolute w-[180px] h-[180px] border border-dashed border-zinc-700/60 rounded-full z-0" />

                      {/* Moon positions (8 angles: 0, 45, 90, 135, 180, 225, 270, 315) */}
                      {Array.from({ length: 8 }).map((_, i) => {
                        const angle = (((i + 4) % 8) * Math.PI) / 4;
                        const x = Math.cos(angle) * 90;
                        const y = Math.sin(angle) * 90;
                        const isSelected = moonPhaseIndex === i;
                        
                        return (
                          <button
                            key={i}
                            className={`absolute w-7 h-7 rounded-full border border-zinc-500 bg-black flex items-center justify-center z-20 cursor-pointer overflow-hidden transition-all hover:scale-110 ${
                              isSelected ? "ring-2 ring-earth scale-125 border-white" : "opacity-75"
                            }`}
                            style={{ transform: `translate(${x}px, ${y}px)` }}
                            onClick={() => setMoonPhaseIndex(i)}
                          >
                            <div className="absolute inset-0 flex" dir="ltr">
                              <div className="w-1/2 h-full bg-zinc-300" />
                              <div className="w-1/2 h-full bg-zinc-950" />
                            </div>
                            <span className="absolute text-[10px] font-black z-30 text-zinc-900">{i + 1}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="md:col-span-2 space-y-4 text-right">
                      <h4 className="font-bold text-white text-lg">מופעי הירח (Moon Phases)</h4>
                      <p className="text-sm text-text-muted leading-relaxed">
                        הירח מקיף את כדור הארץ פעם בחודש (כ-29.5 ימים). 
                        <br /><br />
                        כיוון שהירח אינו מייצר אור עצמי אלא רק מחזיר את אור השמש, המראה שלו מהארץ משתנה לפי הזווית שבה אנו רואים את החצי המואר שלו.
                      </p>

                      <div className="bg-earth/5 border border-earth/20 rounded-xl p-4 space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="text-right">
                            <span className="text-xs text-earth font-bold block">עמדה נבחרת: {moonPhaseIndex + 1} מתוך 8</span>
                            <h5 className="font-bold text-white text-sm">{MOON_PHASES[moonPhaseIndex].name}</h5>
                          </div>
                          <div className="shrink-0 bg-zinc-950 p-2 rounded-xl border border-zinc-800 flex items-center justify-center">
                            {renderMoonPhasePreview(moonPhaseIndex)}
                          </div>
                        </div>
                        <p className="text-xs md:text-sm text-text-muted leading-relaxed">
                          {MOON_PHASES[moonPhaseIndex].desc}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => setMoonPhaseIndex(prev => (prev === 0 ? 7 : prev - 1))}
                          className="flex-1 py-2 bg-surface hover:bg-surface-hover border border-border-custom text-xs font-bold rounded-lg cursor-pointer transition-all"
                        >
                          ← הקודם
                        </button>
                        <button
                          onClick={() => setMoonPhaseIndex(prev => (prev === 7 ? 0 : prev + 1))}
                          className="flex-1 py-2 bg-surface hover:bg-surface-hover border border-border-custom text-xs font-bold rounded-lg cursor-pointer transition-all"
                        >
                          הבא ←
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-earth/5 border border-earth/20 rounded-xl p-4 flex gap-3 text-xs md:text-sm text-text-muted leading-relaxed text-right">
                      <HelpCircle className="w-5 h-5 text-earth shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-white block mb-1">הנחיות לסימולטור המורחב:</span>
                        לפניכם הדמיה מלאה של מופעי הירח שפותחה ב-HTML5 על ידי אוניברסיטת נברסקה (UNL). 
                        ניתן לגרור את הירח סביב כדור הארץ, לשנות את זווית השמש, ולראות בזמן אמת את החלק המואר (שמאל למעלה) ואת מופע הירח כפי שהוא נראה מכדור הארץ (ימין למטה).
                      </div>
                    </div>
                    
                    <div className="w-full h-[550px] rounded-2xl overflow-hidden border border-border-custom bg-zinc-950 relative">
                      <iframe 
                        src="https://ccnmtl.github.io/astro-simulations/lunar-phase-simulator/"
                        className="w-full h-full border-0"
                        title="UNL Lunar Phase Simulator"
                      />
                    </div>
                    
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-text-muted bg-surface-hover/20 border border-border-custom rounded-xl p-3">
                      <span>מקור הדמיה: Nebraska Astronomy Applet Project (Columbia Interactive HTML5 Port)</span>
                      <a 
                        href="https://www.pbslearningmedia.org/resource/buac19-68-sci-ess-moonphaseint/lunar-phases-simulation/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-earth hover:underline font-bold inline-flex items-center gap-1 cursor-pointer"
                      >
                        לפתיחת הסימולטור המקורי ב-PBS LearningMedia ↗
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
