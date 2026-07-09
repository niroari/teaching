"use client";

import React, { useState } from "react";
import { HelpCircle, RefreshCw, Layers, Zap } from "lucide-react";

interface BoundaryType {
  id: string;
  name: string;
  subName: string;
  desc: string;
  features: string[];
  israelExample: string;
  animationLabel: string;
}

const BOUNDARY_TYPES: BoundaryType[] = [
  {
    id: "divergent",
    name: "גבול פתיחה (Divergent)",
    subName: "התרחקות לוחות",
    desc: "הלוחות נפרדים ומתרחקים זה מזה בשל זרמי ערבול עולים במעטפת. נוצר קרום חדש.",
    features: [
      "רכסים מרכז-אוקייניים (הרי געש תת-ימיים)",
      "בקעי יבשה עמוקים (Rift Valleys)",
      "עליית מגמה רציפה היוצרת סלעי בזלת (יסוד)"
    ],
    israelExample: "ים סוף (הנוצר מהתרחקות לוח ערב מהלוח האפריקאי).",
    animationLabel: "מתח והתרחקות"
  },
  {
    id: "convergent",
    name: "גבול התכנסות (Convergent)",
    subName: "התנגשות לוחות",
    desc: "הלוחות נעים זה לקראת זה. לוח אוקייני כבד שוקע מתחת ללוח יבשתי (אזור הפחתה) או ששני לוחות יבשתיים מתנגשים ומתקמטים.",
    features: [
      "רכסי הרים גבוהים ונופי קימוט (קימוט קרום)",
      "תהומות אוקייניים עמוקים באזורי הפחתה",
      "הרי געש פעילים בשל התכת קרום ששקע למעמקים"
    ],
    israelExample: "הרי הקימוט בנגב (קמרים כמו המכתשים) נוצרו בעקיפין מלחצי התכנסות היסטוריים.",
    animationLabel: "לחיצה והתנגשות"
  },
  {
    id: "transform",
    name: "גבול החלקה (Transform)",
    subName: "תנועה אופקית מקבילה",
    desc: "הלוחות מחליקים זה לצד זה בכיוונים מנוגדים או במהירויות שונות. קרום לא נוצר ולא נהרס.",
    features: [
      "שברים גאולוגיים (שבר ישר וארוך)",
      "חיכוך עצום שננעל וגורם ל<strong>רעידות אדמה חזקות</strong> בעת שחרור פתאומי",
      "היעדר פעילות געשית (אין מאגמה שעולה)"
    ],
    israelExample: "הבקע הסורי-אפריקני ושבר ים המלח (הלוח הערבי מחליק צפונה ביחס ללוח האפריקאי).",
    animationLabel: "חיכוך והחלקה"
  }
];

export default function TectonicsWidget() {
  const [activeBoundary, setActiveBoundary] = useState<string>("divergent");
  const [animState, setAnimState] = useState<"idle" | "animating" | "finished">("idle");
  const [triggerShake, setTriggerShake] = useState(false);

  const selected = BOUNDARY_TYPES.find(b => b.id === activeBoundary) || BOUNDARY_TYPES[0];

  const runAnimation = () => {
    if (animState === "animating") return;
    setAnimState("animating");

    if (activeBoundary === "transform") {
      // Custom shake effect for earthquake
      setTimeout(() => {
        setTriggerShake(true);
        setTimeout(() => {
          setTriggerShake(false);
          setAnimState("finished");
        }, 1200);
      }, 1000);
    } else {
      setTimeout(() => {
        setAnimState("finished");
      }, 2000);
    }
  };

  const resetAnimation = () => {
    setAnimState("idle");
    setTriggerShake(false);
  };

  const handleSelectBoundary = (id: string) => {
    setActiveBoundary(id);
    setAnimState("idle");
    setTriggerShake(false);
  };

  return (
    <div className="w-full bg-surface border border-border-custom rounded-2xl overflow-hidden shadow-xl flex flex-col">
      {/* Selector Tabs */}
      <div className="flex border-b border-border-custom bg-surface-hover/30">
        {BOUNDARY_TYPES.map(b => (
          <button
            key={b.id}
            onClick={() => handleSelectBoundary(b.id)}
            className={`flex-1 py-4 text-xs md:text-sm font-bold transition-all text-center cursor-pointer ${
              activeBoundary === b.id
                ? "text-earth border-b-2 border-earth bg-earth/5"
                : "text-text-muted hover:text-foreground"
            }`}
          >
            {b.name.split(" ")[0]} {b.name.split(" ")[1]}
            <span className="block text-[10px] text-text-muted mt-0.5">{b.subName}</span>
          </button>
        ))}
      </div>

      <div className="p-6 space-y-6">
        <div className="bg-earth/5 border border-earth/20 rounded-xl p-4 flex gap-3 text-xs md:text-sm text-text-muted leading-relaxed">
          <HelpCircle className="w-5 h-5 text-earth shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-white block mb-1">דינמיקה פנימית - טקטוניקת הלוחות:</span>
            בחרו את סוג גבול הלוח כדי לחקור את הכוחות הפועלים בתוך קרום כדור הארץ. 
            לחצו על כפתור <strong>הפעל כוחות גאולוגיים</strong> כדי לראות את האנימציה המדגימה היווצרות נופים ורעידות אדמה.
          </div>
        </div>

        {/* Dynamic Graphic Container */}
        <div className="bg-zinc-950/50 border border-border-custom rounded-2xl p-6 flex flex-col items-center overflow-hidden min-h-[260px] relative justify-center">
          {/* Earth's Core/Mantle Background Glow */}
          <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-red-600/20 to-transparent blur-md pointer-events-none" />

          <div 
            className={`w-full max-w-md h-40 relative flex items-center justify-center transition-all ${
              triggerShake ? "animate-[bounce_0.1s_infinite]" : ""
            }`}
          >
            {/* DIVERGENT ANIMATION */}
            {activeBoundary === "divergent" && (
              <div className="w-full h-full flex items-center justify-between relative px-8">
                {/* Left Plate */}
                <div 
                  className={`w-2/5 h-20 bg-zinc-700 border-t-4 border-emerald-500 rounded-lg flex items-center justify-center text-[10px] font-bold text-zinc-300 relative transition-transform duration-1000 ${
                    animState === "animating" || animState === "finished" ? "-translate-x-6" : ""
                  }`}
                >
                  לוח אפריקאי
                  {/* Left movement arrow */}
                  <span className="absolute -top-6 left-2 text-red-500 text-lg">←</span>
                </div>

                {/* Central Magma Rising Zone */}
                <div className="flex-1 h-full flex flex-col items-center justify-end relative">
                  {/* Magma stream */}
                  <div 
                    className={`w-4 bg-gradient-to-t from-red-600 to-amber-500 rounded-full transition-all duration-1000 ${
                      animState === "animating" || animState === "finished" ? "h-28 opacity-100 animate-pulse" : "h-6 opacity-0"
                    }`}
                  />
                  {/* New crust forming */}
                  {animState === "finished" && (
                    <div className="absolute bottom-10 w-12 h-6 bg-red-950/60 border-t-2 border-red-500 text-[8px] text-red-300 font-bold flex items-center justify-center rounded">
                      קרום בזלתי צעיר
                    </div>
                  )}
                  <span className="text-[9px] text-red-400 font-black mt-1">עליית מאגמה לוהטת</span>
                </div>

                {/* Right Plate */}
                <div 
                  className={`w-2/5 h-20 bg-zinc-700 border-t-4 border-emerald-500 rounded-lg flex items-center justify-center text-[10px] font-bold text-zinc-300 relative transition-transform duration-1000 ${
                    animState === "animating" || animState === "finished" ? "translate-x-6" : ""
                  }`}
                >
                  לוח ערבי
                  {/* Right movement arrow */}
                  <span className="absolute -top-6 right-2 text-red-500 text-lg">→</span>
                </div>
              </div>
            )}

            {/* CONVERGENT ANIMATION */}
            {activeBoundary === "convergent" && (
              <div className="w-full h-full flex items-center justify-center relative px-4">
                {/* Left Oceanic Plate (subducting) */}
                <div 
                  className={`w-5/12 h-14 bg-zinc-800 border-t-4 border-blue-500 rounded-lg flex items-center justify-center text-[10px] font-bold text-zinc-400 relative transition-all duration-1000 ${
                    animState === "animating" || animState === "finished" 
                      ? "translate-x-8 translate-y-6 rotate-12 scale-95" 
                      : ""
                  }`}
                >
                  לוח אוקייני (כבד)
                  <span className="absolute -top-6 right-2 text-blue-500 text-lg">→</span>
                </div>

                {/* Collision/Friction sparks */}
                {animState === "animating" && (
                  <div className="w-8 h-8 rounded-full bg-yellow-400/30 flex items-center justify-center absolute z-20 animate-ping">
                    <Zap className="w-4 h-4 text-yellow-400" />
                  </div>
                )}

                {/* Right Continental Plate (buckling/folding) */}
                <div 
                  className={`w-5/12 h-20 bg-zinc-700 border-t-4 border-amber-600 rounded-lg flex flex-col items-center justify-center text-[10px] font-bold text-zinc-200 relative transition-all duration-1000 ${
                    animState === "animating" || animState === "finished" 
                      ? "-translate-x-2 border-t-8 border-red-500" 
                      : ""
                  }`}
                >
                  <span>לוח יבשתי</span>
                  {animState === "finished" && (
                    <span className="text-[9px] text-yellow-400 font-bold bg-zinc-950/80 px-1 rounded mt-1">רכס הרים מקומט</span>
                  )}
                  <span className="absolute -top-6 left-2 text-red-500 text-lg">←</span>
                </div>
              </div>
            )}

            {/* TRANSFORM ANIMATION */}
            {activeBoundary === "transform" && (
              <div className="w-full h-32 flex flex-col justify-between relative py-2">
                {/* Top Plate moving Left */}
                <div 
                  className={`w-full h-12 bg-zinc-700 border-b-2 border-dashed border-red-500/30 rounded-lg flex items-center justify-center text-[10px] font-bold text-zinc-300 relative transition-transform duration-[1200ms] ${
                    animState === "animating" || animState === "finished" ? "-translate-x-12" : ""
                  }`}
                >
                  הלוח הערבי (נע צפונה)
                  <span className="absolute top-1 left-4 text-red-500 text-sm">←</span>
                </div>

                {/* Friction Zone / Earthquake indicator */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                  {animState === "animating" && (
                    <div className="px-3 py-1 bg-red-600 border border-red-400 text-white font-black text-xs rounded-full animate-bounce flex items-center gap-1">
                      <Zap className="w-3 h-3 text-yellow-300" />
                      <span>רעידת אדמה!</span>
                    </div>
                  )}
                  {animState === "finished" && (
                    <div className="px-3 py-1 bg-zinc-900/90 border border-zinc-700 text-text-muted text-[10px] font-bold rounded-lg">
                      שחרור מתח העתק
                    </div>
                  )}
                </div>

                {/* Bottom Plate moving Right */}
                <div 
                  className={`w-full h-12 bg-zinc-800 border-t-2 border-dashed border-red-500/30 rounded-lg flex items-center justify-center text-[10px] font-bold text-zinc-400 relative transition-transform duration-[1200ms] ${
                    animState === "animating" || animState === "finished" ? "translate-x-12" : ""
                  }`}
                >
                  הלוח האפריקאי (סטטי/איטי)
                  <span className="absolute bottom-1 right-4 text-red-500 text-sm">→</span>
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-4 mt-4 z-10">
            <button
              onClick={resetAnimation}
              className="px-3 py-1.5 border border-border-custom bg-surface hover:bg-surface-hover text-[11px] font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-all"
            >
              <RefreshCw className="w-3 h-3" />
              <span>איפוס כוחות</span>
            </button>
            <button
              onClick={runAnimation}
              disabled={animState === "animating"}
              className="px-4 py-1.5 bg-earth hover:bg-teal-600 text-white text-[11px] font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>הפעל כוחות גאולוגיים</span>
            </button>
          </div>
        </div>

        {/* Text descriptions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-border-custom">
          <div className="md:col-span-2 space-y-3 text-right">
            <h4 className="font-bold text-white text-base">
              {selected.name} — {selected.subName}
            </h4>
            <p className="text-xs text-text-muted leading-relaxed">
              {selected.desc}
            </p>
            <div className="bg-surface/50 border border-border-custom rounded-xl p-3 text-xs">
              <strong className="text-earth block mb-1">דוגמה מקומית בארץ/אזור:</strong>
              <span className="text-text-muted">{selected.israelExample}</span>
            </div>
          </div>

          <div className="space-y-3 text-right bg-surface-hover/20 p-4 border border-border-custom rounded-xl">
            <h5 className="text-xs font-bold text-white flex items-center gap-1.5 justify-start">
              <Layers className="w-3.5 h-3.5 text-earth shrink-0" />
              <span>צורות נוף ותופעות עיקריות</span>
            </h5>
            <ul className="text-[11px] text-text-muted space-y-2 list-none pr-0">
              {selected.features.map((f, index) => (
                <li key={index} className="flex gap-1.5 justify-start items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-earth mt-1.5 shrink-0" />
                  <span className="leading-normal">{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
