"use client";

import React, { useState, useEffect } from "react";
import { 
  Sun, 
  Wind, 
  CloudRain, 
  Thermometer, 
  Check, 
  X, 
  RefreshCw, 
  Play, 
  Pause, 
  Sparkles, 
  Maximize2, 
  Minimize2,
  ChevronRight,
  TrendingUp,
  Layers,
  ArrowRight,
  Gauge
} from "lucide-react";

// Types for Climograph Matching Game (Tab 3)
interface ClimateZone {
  id: string;
  name: string;
  desc: string;
  temps: number[];
  precip: number[];
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

interface AtmosphereWidgetProps {
  initialTab?: number;
}

export default function AtmosphereWidget({ initialTab = 0 }: AtmosphereWidgetProps) {
  const [activeTab, setActiveTab] = useState<number>(initialTab);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Sync state with HTML5 Fullscreen API
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const toggleFullScreen = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  // Keep activeTab updated if initialTab prop changes
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // ==========================================
  // TAB 1 STATE: Albedo & Radiation Balance
  // ==========================================
  const [selectedSurface, setSelectedSurface] = useState<string>("snow");
  const [feedbackLoopActive, setFeedbackLoopActive] = useState<boolean>(false);
  const [tempAnomaly, setTempAnomaly] = useState<number>(0);

  const surfaces: Record<string, { name: string; albedo: number; desc: string; color: string; rgb: string }> = {
    snow: { 
      name: "שלג טרי", 
      albedo: 0.90, 
      desc: "שלג בוהק מחזיר 90% מקרינת השמש ישירות לחלל ושומר על הקטבים קרים.", 
      color: "bg-slate-100 text-slate-800",
      rgb: "241, 245, 249"
    },
    ice: { 
      name: "קרחון ים", 
      albedo: 0.70, 
      desc: "קרח ממוסס מעט פחות מחזיר אך עדיין שומר על אפקט קירור משמעותי.", 
      color: "bg-sky-200 text-sky-900",
      rgb: "186, 230, 253"
    },
    forest: { 
      name: "יער מחטני", 
      albedo: 0.15, 
      desc: "עלווה כהה בולעת 85% מהקרינה לטובת פוטוסינתזה ויוצרת סביבה חמימה.", 
      color: "bg-emerald-950 text-emerald-300",
      rgb: "2, 48, 32"
    },
    ocean: { 
      name: "אוקיינוס פתוח", 
      albedo: 0.08, 
      desc: "מים פתוחים וכהים בולעים 92% מהקרינה, צוברים חום רב ומעלים טמפרטורה.", 
      color: "bg-blue-900 text-blue-200",
      rgb: "30, 58, 138"
    },
    asphalt: { 
      name: "אספלט עירוני", 
      albedo: 0.05, 
      desc: "כבישים ומבנים כהים בולעים כמעט את כל הקרינה ויוצרים 'אי חום עירוני'.", 
      color: "bg-zinc-800 text-zinc-300",
      rgb: "39, 39, 42"
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (feedbackLoopActive) {
      interval = setInterval(() => {
        setTempAnomaly(prev => {
          if (prev >= 2.5) {
            // Melt ice to ocean
            setSelectedSurface("ocean");
            return 2.5;
          }
          return Number((prev + 0.1).toFixed(2));
        });
      }, 300);
    } else {
      setTempAnomaly(0);
      setSelectedSurface("snow");
    }
    return () => clearInterval(interval);
  }, [feedbackLoopActive]);

  // ==========================================
  // TAB 2 STATE: Pressure & Wind Engine
  // ==========================================
  const [tempA, setTempA] = useState<number>(10); // Area A Temperature (°C)
  const [tempB, setTempB] = useState<number>(35); // Area B Temperature (°C)

  // Calculate pressure from temperature: hotter = lower pressure (air rises)
  // Base pressure 1013 hPa
  const pressA = Math.round(1013 - (tempA - 15) * 1.2);
  const pressB = Math.round(1013 - (tempB - 15) * 1.2);
  const pressDiff = Math.abs(pressA - pressB);
  
  // Wind blows from High to Low pressure
  const windDirection = pressA > pressB ? "left-to-right" : pressB > pressA ? "right-to-left" : "none";
  const windSpeed = Math.min(Math.round(pressDiff * 1.5), 65);

  // ==========================================
  // TAB 3 STATE: Climograph Matching Game
  // ==========================================
  const [gameIndex, setGameIndex] = useState(0);
  const [selectedGuess, setSelectedGuess] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const activeZone = CLIMATE_ZONES[gameIndex];
  const maxPrecip = Math.max(...activeZone.precip, 100);
  const maxPrecipScale = maxPrecip * 1.2;

  const getTempY = (temp: number) => {
    const minT = -40;
    const maxT = 45;
    const height = 140;
    const ratio = (temp - minT) / (maxT - minT);
    return height - (ratio * height) + 20; // 20px padding offset
  };

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

  const handleNextGame = () => {
    setSelectedGuess(null);
    setChecked(false);
    setGameIndex(prev => (prev + 1) % CLIMATE_ZONES.length);
  };

  // ==========================================
  // TAB 4 STATE: Greenhouse Effect & Warming
  // ==========================================
  const [co2Ppm, setCo2Ppm] = useState<number>(280); // Slider 280 ppm - 850 ppm
  
  // Calculate temp based on CO2 ppm
  // Pre-industrial base temp 14.5 °C at 280 ppm
  const globalTemp = Number((14.5 + (co2Ppm - 280) * 0.007).toFixed(1));

  // Determine greenhouse state
  const isOptimal = co2Ppm <= 400;
  const isHigh = co2Ppm > 400 && co2Ppm <= 600;
  const isDangerous = co2Ppm > 600;

  return (
    <div className={`w-full text-right relative flex flex-col justify-between overflow-hidden ${
      isFullScreen 
        ? "fixed inset-0 z-[100] bg-slate-950 p-6 h-screen w-screen" 
        : "bg-slate-950/20 border border-zinc-800/80 rounded-2xl p-6 min-h-[600px]"
    }`}>
      
      {/* HEADER SECTION */}
      <div className="flex flex-row justify-between items-center border-b border-zinc-800 pb-4 mb-4 shrink-0 gap-4">
        <div>
          <span className="text-[10px] text-earth font-black block">מערכת מזג אוויר ואקלים אינטראקטיבית</span>
          <h3 className="text-sm md:text-base font-extrabold text-white">
            {activeTab === 0 && "☀️ מאזן קרינה ואפקט האלבדו"}
            {activeTab === 1 && "🌀 מנוע לחצי אוויר ויצירת רוחות"}
            {activeTab === 2 && "📊 יישומון ניתוח קלימוגרפים כיתתי"}
            {activeTab === 3 && "🌡️ אפקט החממה וזיהום אטמוספרי"}
            {activeTab === 4 && "🏆 לוח בקרה ואנליזה של היחידה"}
          </h3>
        </div>

        <div className="flex gap-2">
          {/* Fullscreen Toggle */}
          <button 
            onClick={toggleFullScreen}
            className="p-1.5 md:p-2 rounded-xl border border-zinc-800 bg-surface/30 hover:bg-surface-hover/30 text-text-muted hover:text-white transition-all cursor-pointer flex items-center gap-1 text-xs font-bold"
          >
            {isFullScreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isFullScreen ? "חלון רגיל" : "מסך מלא"}</span>
          </button>
        </div>
      </div>

      {/* TABS CONTROLLERS */}
      <div className="grid grid-cols-4 gap-2 mb-4 shrink-0">
        {[
          { label: "אלבדו וקרינה", icon: Sun, tab: 0 },
          { label: "לחצים ורוחות", icon: Wind, tab: 1 },
          { label: "משחק קלימוגרף", icon: BarChartIcon, tab: 2 },
          { label: "חממה ופחמן", icon: Thermometer, tab: 3 }
        ].map(item => (
          <button
            key={item.tab}
            onClick={() => setActiveTab(item.tab)}
            className={`py-3 px-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer border flex flex-col md:flex-row items-center justify-center gap-1.5 ${
              activeTab === item.tab 
                ? "bg-earth border-earth text-white shadow-lg shadow-teal-500/10" 
                : "bg-zinc-900 border-zinc-800 text-text-muted hover:border-zinc-700 hover:text-white"
            }`}
          >
            <item.icon className="w-4 h-4" />
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* CONTENT BLOCK - Dynamic scroll-free layouts */}
      <div className={`flex-grow flex flex-col justify-between overflow-hidden min-h-0 ${isFullScreen ? "max-h-[72vh]" : "max-h-[580px]"}`}>
        
        {/* ========================================== */}
        {/* TAB 0: ALBEDO & RADIATION BALANCE */}
        {/* ========================================== */}
        {activeTab === 0 && (
          <div className="w-full h-full flex flex-col justify-between gap-4">
            
            {/* Visual simulation block */}
            <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-4 flex-1 flex flex-col md:flex-row gap-4 items-center min-h-[220px]">
              
              {/* Animation box */}
              <div className="relative w-full md:w-1/2 h-full min-h-[160px] bg-slate-900/60 border border-zinc-800 rounded-xl overflow-hidden flex items-center justify-center p-2">
                
                {/* Surface background visualization */}
                <div 
                  className="absolute bottom-0 inset-x-0 h-10 border-t border-white/10 transition-all duration-300"
                  style={{ backgroundColor: `rgb(${surfaces[selectedSurface].rgb})` }}
                />

                {/* Animated Sunbeam and Reflections */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 200 120">
                    {/* Incoming Sunbeam */}
                    <line x1="20" y1="20" x2="100" y2="100" stroke="#f59e0b" strokeWidth="4" strokeDasharray="3 3" className="animate-pulse" />
                    <text x="25" y="15" fill="#f59e0b" className="text-[10px] font-black">קרינת שמש (100%)</text>
                    
                    {/* Reflected Beam */}
                    {surfaces[selectedSurface].albedo > 0.05 && (
                      <line 
                        x1="100" 
                        y1="100" 
                        x2={100 + (surfaces[selectedSurface].albedo * 80)} 
                        y2={100 - (surfaces[selectedSurface].albedo * 80)} 
                        stroke="#fef08a" 
                        strokeWidth={2.5 + (surfaces[selectedSurface].albedo * 3.5)} 
                      />
                    )}
                    
                    {/* Heat absorbed wave */}
                    <path 
                      d={`M 100 100 Q 95 70 100 40 T 100 10`}
                      fill="none" 
                      stroke="#ef4444" 
                      strokeWidth={2 + (1 - surfaces[selectedSurface].albedo) * 5} 
                      className="animate-pulse"
                      strokeDasharray="2 2"
                    />

                    {/* Albedo text label */}
                    <text x="95" y="112" fill="#fff" textAnchor="middle" className="text-[11px] font-black">
                      {surfaces[selectedSurface].name} (אלבדו: {Math.round(surfaces[selectedSurface].albedo * 100)}%)
                    </text>
                    <text x="140" y="30" fill="#fef08a" className="text-[10px] font-bold">
                      החזרה: {Math.round(surfaces[selectedSurface].albedo * 100)}%
                    </text>
                    <text x="75" y="30" fill="#f87171" className="text-[10px] font-bold">
                      בליעה: {Math.round((1 - surfaces[selectedSurface].albedo) * 100)}%
                    </text>
                  </svg>
                </div>

                <div className="absolute top-2 right-2 bg-slate-950/80 border border-zinc-800 rounded-lg px-2.5 py-1 flex items-center gap-1.5">
                  <Sun className="w-4 h-4 text-amber-500 animate-spin-slow" />
                  <span className="text-xs font-black text-white">הדמיית קרינה</span>
                </div>
              </div>

              {/* Text explanations and surface selectors */}
              <div className="w-full md:w-1/2 flex flex-col justify-between h-full space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-black text-white">בחרו סוג משטח:</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {Object.keys(surfaces).map(s => (
                      <button
                        key={s}
                        onClick={() => setSelectedSurface(s)}
                        className={`py-3 px-1 rounded-xl text-xs font-bold cursor-pointer border transition-all text-center ${
                          selectedSurface === s 
                            ? "bg-amber-500 border-amber-500 text-slate-950 font-black shadow-md" 
                            : "bg-zinc-900 border-zinc-800 text-text-muted hover:border-zinc-700"
                        }`}
                      >
                        {surfaces[s].name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 text-right">
                  <span className="text-xs text-earth font-black block mb-1">כיצד המשטח משפיע:</span>
                  <p className="text-xs md:text-sm text-white font-medium leading-relaxed">{surfaces[selectedSurface].desc}</p>
                </div>

                {/* Feedback Loop Feature */}
                <div className="flex items-center justify-between bg-teal-950/15 border border-teal-500/20 rounded-xl p-3.5">
                  <div>
                    <span className="text-xs text-teal-400 font-black block mb-0.5">לולאת משוב קרחונים 🔄</span>
                    <span className="text-xs md:text-sm text-white font-bold block">
                      {feedbackLoopActive 
                        ? `התחממות: ${tempAnomaly > 0 ? "+" : ""}${tempAnomaly}°C (הקרח נמס, האלבדו צונח)` 
                        : "הדמיית התחממות והמסת קרחונים בקטבים"}
                    </span>
                  </div>

                  <button
                    onClick={() => setFeedbackLoopActive(!feedbackLoopActive)}
                    className={`px-4 py-2 rounded-xl text-xs md:text-sm font-extrabold transition-all cursor-pointer border ${
                      feedbackLoopActive 
                        ? "bg-red-600 border-red-600 text-white" 
                        : "bg-teal-600 border-teal-600 text-white"
                    }`}
                  >
                    {feedbackLoopActive ? "עצור לולאה" : "הפעל לולאה"}
                  </button>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ========================================== */}
        {/* TAB 1: PRESSURE & WIND ENGINE */}
        {/* ========================================== */}
        {activeTab === 1 && (
          <div className="w-full h-full flex flex-col justify-between gap-4">
            
            {/* Simulation controls */}
            <div className="grid grid-cols-2 gap-4 shrink-0">
              {/* Area A */}
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 space-y-2 text-right">
                <span className="text-xs font-black text-sky-400 block">אזור א' (Area A)</span>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-text-muted">טמפרטורה:</span>
                  <span className="text-sm font-black text-white">{tempA}°C</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="45" 
                  value={tempA} 
                  onChange={(e) => setTempA(Number(e.target.value))}
                  className="w-full accent-teal-500 cursor-pointer h-2.5 bg-zinc-800 rounded-lg"
                />
                <div className="flex justify-between items-center text-xs text-text-muted pt-1">
                  <span>לחץ ברומטרי:</span>
                  <span className="font-extrabold text-white text-xs sm:text-sm">{pressA} hPa ({pressA > 1013 ? "רמה" : "שקע"})</span>
                </div>
              </div>

              {/* Area B */}
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 space-y-2 text-right">
                <span className="text-xs font-black text-purple-400 block">אזור ב' (Area B)</span>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-text-muted">טמפרטורה:</span>
                  <span className="text-sm font-black text-white">{tempB}°C</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="45" 
                  value={tempB} 
                  onChange={(e) => setTempB(Number(e.target.value))}
                  className="w-full accent-teal-500 cursor-pointer h-2.5 bg-zinc-800 rounded-lg"
                />
                <div className="flex justify-between items-center text-xs text-text-muted pt-1">
                  <span>לחץ ברומטרי:</span>
                  <span className="font-extrabold text-white text-xs sm:text-sm">{pressB} hPa ({pressB > 1013 ? "רמה" : "שקע"})</span>
                </div>
              </div>
            </div>

            {/* Visual simulation block */}
            <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-4 flex-1 flex flex-col justify-between min-h-[180px] relative">
              
              <div className="absolute top-2 right-2 bg-slate-950/80 border border-zinc-800 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5">
                <Wind className="w-4 h-4 text-sky-400" />
                <span className="text-xs font-black text-white">הדמיית מפל לחצים</span>
              </div>

              {/* Dynamics Animation Arena */}
              <div className="flex-1 flex justify-between items-center relative overflow-hidden px-10">
                
                {/* Area A dynamics */}
                <div className="flex flex-col items-center space-y-1.5">
                  <div className={`w-10 h-10 rounded-full border flex items-center justify-center font-extrabold text-sm ${
                    pressA > 1013 
                      ? "border-sky-500/40 bg-sky-950/50 text-sky-400 animate-pulse" 
                      : "border-orange-500/40 bg-orange-950/50 text-orange-400"
                  }`}>
                    {pressA > 1013 ? "H" : "L"}
                  </div>
                  <span className="text-xs font-bold text-text-muted">אזור לחץ {pressA > 1013 ? "גבוה (רמה)" : "נמוך (שקע)"}</span>
                  
                  {/* Air movement arrow */}
                  <span className="text-xs font-black text-white">
                    {pressA > 1013 ? "⬇️ אוויר שוקע" : "⬆️ אוויר עולה"}
                  </span>
                </div>

                {/* Wind connector animation */}
                <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
                  {windDirection === "none" ? (
                    <span className="text-xs md:text-sm text-text-muted font-bold">אין רוח (לחצים שווים)</span>
                  ) : (
                    <div className="space-y-2 w-full flex flex-col items-center">
                      <span className="text-xs md:text-sm text-white font-black animate-pulse">
                        💨 מהירות רוח: {windSpeed} קמ\"ש
                      </span>
                      
                      {/* Animated drifting arrow */}
                      <div className="w-full h-3 bg-zinc-900 border border-zinc-800 rounded-full overflow-hidden relative">
                        <div 
                          className={`absolute inset-y-0 w-10 bg-sky-400 rounded-full ${
                            windDirection === "left-to-right" ? "animate-drift-right" : "animate-drift-left"
                          }`}
                        />
                      </div>
                      <span className="text-[10px] md:text-xs text-sky-400 font-bold">
                        {windDirection === "left-to-right" ? "משב רוח מאזור א' לאזור ב'" : "משב רוח מאזור ב' לאזור א'"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Area B dynamics */}
                <div className="flex flex-col items-center space-y-1.5">
                  <div className={`w-10 h-10 rounded-full border flex items-center justify-center font-extrabold text-sm ${
                    pressB > 1013 
                      ? "border-sky-500/40 bg-sky-950/50 text-sky-400 animate-pulse" 
                      : "border-orange-500/40 bg-orange-950/50 text-orange-400"
                  }`}>
                    {pressB > 1013 ? "H" : "L"}
                  </div>
                  <span className="text-xs font-bold text-text-muted">אזור לחץ {pressB > 1013 ? "גבוה (רמה)" : "נמוך (שקע)"}</span>
                  
                  {/* Air movement arrow */}
                  <span className="text-xs font-black text-white">
                    {pressB > 1013 ? "⬇️ אוויר שוקע" : "⬆️ אוויר עולה"}
                  </span>
                </div>

              </div>

              {/* Educational feedback text */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-center mt-2">
                <p className="text-xs md:text-sm font-bold text-white leading-relaxed">
                  💡 האוויר נע תמיד מאזור הלחץ הגבוה (האוויר הכבד והקר) לאזור הלחץ הנמוך (האוויר החם והקל).
                </p>
              </div>

            </div>

          </div>
        )}

        {/* ========================================== */}
        {/* TAB 2: CLIMOGRAPH MATCHING GAME */}
        {/* ========================================== */}
        {activeTab === 2 && (
          <div className="w-full h-full flex flex-col justify-between gap-4">
            
            <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-4 flex-1 flex flex-col md:flex-row gap-4 items-center min-h-[220px]">
              
              {/* SVG Climograph Display */}
              <div className="w-full md:w-1/2 bg-slate-900/60 border border-zinc-800 rounded-xl p-2 h-full min-h-[180px] flex items-center justify-center relative">
                
                <svg className="w-full h-full min-h-[160px]" viewBox="0 0 240 180">
                  {/* Grid Lines */}
                  {[0, 1, 2, 3, 4].map(i => {
                    const y = 20 + i * 35;
                    return (
                      <line key={i} x1="30" y1={y} x2="210" y2={y} stroke="#27272a" strokeWidth="0.5" />
                    );
                  })}

                  {/* Precipitation Bars (Blue columns) */}
                  {activeZone.precip.map((pr, i) => {
                    const x = 33 + i * 15;
                    const height = (pr / maxPrecipScale) * 140;
                    const y = 160 - height;
                    return (
                      <rect 
                        key={i} 
                        x={x} 
                        y={y} 
                        width="8" 
                        height={height} 
                        fill="#38bdf8" 
                        opacity="0.6" 
                        rx="1"
                      />
                    );
                  })}

                  {/* Temperature Line (Red line) */}
                  <path 
                    d={activeZone.temps.map((temp, i) => {
                      const x = 37 + i * 15;
                      const y = getTempY(temp);
                      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
                    }).join(" ")}
                    fill="none" 
                    stroke="#ef4444" 
                    strokeWidth="2.5" 
                  />

                  {/* Temperature Dots */}
                  {activeZone.temps.map((temp, i) => {
                    const x = 37 + i * 15;
                    const y = getTempY(temp);
                    return (
                      <circle key={i} cx={x} cy={y} r="2.5" fill="#fca5a5" stroke="#ef4444" strokeWidth="1" />
                    );
                  })}

                  {/* Months text labels */}
                  {MONTHS.map((m, i) => (
                    <text key={i} x={37 + i * 15} y="172" fill="#a1a1aa" textAnchor="middle" className="text-[8px] md:text-[9px] font-bold">
                      {m}
                    </text>
                  ))}

                  {/* Axes labels */}
                  <text x="25" y="15" fill="#ef4444" textAnchor="end" className="text-[8px] font-black">T (°C)</text>
                  <text x="215" y="15" fill="#38bdf8" textAnchor="start" className="text-[8px] font-black">P (mm)</text>
                </svg>

                {/* Score badge */}
                <div className="absolute top-2 right-2 bg-slate-950/80 border border-zinc-800 rounded-lg px-2.5 py-1 flex items-center gap-1.5">
                  <Gauge className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-black text-white">ניקוד: {score.correct}/{score.total}</span>
                </div>
              </div>

              {/* Game interaction board */}
              <div className="w-full md:w-1/2 flex flex-col justify-between h-full space-y-4 text-right">
                <div className="space-y-1.5">
                  <span className="text-xs text-earth font-black block">משימה לתלמיד:</span>
                  <h4 className="text-sm font-black text-white leading-snug">
                    איזה אזור אקלים מיוצג בקלימוגרף שלפניכם?
                  </h4>
                  <p className="text-xs text-text-muted leading-relaxed">
                    שימו לב למשרעת הטמפרטורה (הפרש הקו האדום) וכמויות הגשם לאורך החודשים.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {CLIMATE_ZONES.map(zone => {
                    const isSelected = selectedGuess === zone.id;
                    const isCorrect = zone.id === activeZone.id;
                    
                    let buttonClass = "bg-zinc-900 border-zinc-800 text-text-muted hover:border-zinc-700";
                    if (isSelected) {
                      if (checked) {
                        buttonClass = isCorrect 
                          ? "bg-emerald-600 border-emerald-600 text-white font-black" 
                          : "bg-red-600 border-red-600 text-white font-black";
                      } else {
                        buttonClass = "bg-amber-500 border-amber-500 text-slate-950 font-black";
                      }
                    } else if (checked && isCorrect) {
                      buttonClass = "bg-emerald-950 border-emerald-500/40 text-emerald-400";
                    }

                    return (
                      <button
                        key={zone.id}
                        disabled={checked}
                        onClick={() => handleGuess(zone.id)}
                        className={`py-3 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer border text-center ${buttonClass}`}
                      >
                        {zone.name}
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-2">
                  {!checked ? (
                    <button
                      onClick={handleCheck}
                      disabled={!selectedGuess}
                      className="flex-1 py-3 bg-earth hover:bg-teal-600 text-white font-black text-xs md:text-sm rounded-xl cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all text-center"
                    >
                      בדיקת תשובה 🔍
                    </button>
                  ) : (
                    <button
                      onClick={handleNextGame}
                      className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-black text-xs md:text-sm rounded-xl cursor-pointer transition-all text-center flex items-center justify-center gap-1.5"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>קלימוגרף הבא</span>
                    </button>
                  )}
                </div>

              </div>

            </div>

            {/* Answer explanation card */}
            {checked && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-right animate-fade-in flex-shrink-0">
                <span className="text-xs text-earth font-black block mb-1">ניתוח אקלימי:</span>
                <div className="flex items-center gap-2 text-xs md:text-sm text-white mb-1">
                  <span><strong>משרעת:</strong> {activeZone.tempRange}</span>
                  <span className="text-zinc-700">|</span>
                  <span><strong>סך גשם שנתי:</strong> {activeZone.annualPrecip}</span>
                </div>
                <p className="text-xs md:text-sm text-text-muted leading-relaxed">
                  {activeZone.explanation}
                </p>
              </div>
            )}

          </div>
        )}

        {/* ========================================== */}
        {/* TAB 3: GREENHOUSE EFFECT & CARBON */}
        {/* ========================================== */}
        {activeTab === 3 && (
          <div className="w-full h-full flex flex-col justify-between gap-4">
            
            {/* Slider bar */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2 text-right shrink-0">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-sm md:text-base font-black text-white">ריכוז פחמן דו-חמצני באטמוספרה:</span>
                  <span className="text-xs text-text-muted block">(מדד פחמן דו-חמצני באטמוספרה בחלקיקים למיליון)</span>
                </div>
                <span className="text-base md:text-lg font-black text-amber-500 bg-amber-500/10 px-3 py-1 rounded-lg">{co2Ppm} ppm</span>
              </div>

              <input 
                type="range" 
                min="280" 
                max="850" 
                value={co2Ppm} 
                onChange={(e) => setCo2Ppm(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer h-3 bg-zinc-800 rounded-lg"
              />

              <div className="flex justify-between text-xs text-text-muted">
                <span>עידן טרום-תעשייתי (280 ppm)</span>
                <span>עידן מודרני (420 ppm)</span>
                <span>תחזית קיצון (850 ppm)</span>
              </div>
            </div>

            {/* Visual simulation block */}
            <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-4 flex-1 flex flex-col md:flex-row gap-4 items-center min-h-[200px]">
              
              {/* Graphic area */}
              <div className="w-full md:w-1/2 bg-slate-900/60 border border-zinc-800 rounded-xl h-full min-h-[160px] flex items-center justify-center relative overflow-hidden">
                
                {/* Earth representation */}
                <div className="w-24 h-24 rounded-full bg-blue-900 border-2 border-sky-400/30 flex items-center justify-center relative">
                  <div className="w-20 h-20 rounded-full bg-emerald-800/35 blur-sm" />
                  
                  {/* Temperature readout inside Earth */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-[9px] font-bold text-text-muted">חום עולמי:</span>
                    <span className="text-sm md:text-base font-black text-white">{globalTemp}°C</span>
                  </div>
                </div>

                {/* Greenhouse blanket boundary line */}
                <div 
                  className={`absolute w-40 h-40 rounded-full border-2 border-dashed transition-all duration-300 ${
                    isOptimal ? "border-emerald-500/40 bg-emerald-500/5" :
                    isHigh ? "border-amber-500/60 bg-amber-500/10 animate-pulse" :
                    "border-red-500 bg-red-500/15 animate-ping-slow"
                  }`}
                />

                {/* Heat rays bounces */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 200 160">
                  {/* Incoming light */}
                  <line x1="20" y1="20" x2="80" y2="60" stroke="#f59e0b" strokeWidth="1.5" />
                  
                  {/* Outgoing heat bouncing back */}
                  <path 
                    d="M 120 100 L 155 125 L 140 90 L 120 100" 
                    fill="none" 
                    stroke="#ef4444" 
                    strokeWidth={isOptimal ? "1.5" : isHigh ? "2.5" : "4"} 
                    className="animate-pulse"
                  />
                  
                  <text x="145" y="145" fill="#f87171" className="text-[10px] font-black">
                    {isOptimal ? "חום בורח" : "קרינת חום נלכדת!"}
                  </text>
                </svg>

                <div className="absolute top-2 right-2 bg-slate-950/80 border border-zinc-800 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-earth" />
                  <span className="text-xs font-black text-white">אפקט החממה</span>
                </div>
              </div>

              {/* Feedback and text */}
              <div className="w-full md:w-1/2 flex flex-col justify-between h-full space-y-4 text-right">
                
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                  <span className="text-xs text-earth font-black block mb-1">ניתוח מצב אטמוספרי:</span>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`w-3 h-3 rounded-full ${
                      isOptimal ? "bg-emerald-500" : isHigh ? "bg-amber-500" : "bg-red-500"
                    }`} />
                    <span className="text-xs md:text-sm font-black text-white">
                      {isOptimal && "מצב מאוזן וטבעי (Optimal)"}
                      {isHigh && "אפקט חממה מוגבר (High)"}
                      {isDangerous && "סכנת התחממות קיצונית (Dangerous)"}
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-text-muted leading-relaxed">
                    {isOptimal && "שכבת גזי החממה דקה ומאפשרת לחום עודף לברוח לחלל. הטמפרטורה יציבה ותומכת חיים."}
                    {isHigh && "כמויות הפחמן הדו-חמצני מתעבות. השמיכה האטמוספרית מתעבה ולוכדת קרינה תרמית גדולה יותר."}
                    {isDangerous && "ריכוז פחמן קיצוני גורם ללכידה כמעט מוחלטת של קרינת חום. סכנה להמסת שלגים מהירה ועונות יובש קיצוניות."}
                  </p>
                </div>

                <div className="bg-teal-950/15 border border-teal-500/20 rounded-xl p-3.5 flex items-center gap-2.5">
                  <TrendingUp className="w-5 h-5 text-teal-400 shrink-0" />
                  <p className="text-xs md:text-sm text-white leading-relaxed">
                    <strong>אנלוגיית השמיכה:</strong> אפקט החממה הוא שמיכה חיונית עבור כדור הארץ. שמיכה אחת שומרת עלינו חמים ונעים, אך פליטת פחמן ענקי היא כמו להתכסות בעשר שמיכות עבות - המביאה להזעה וחום קיצוני.
                  </p>
                </div>

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}

// Icon helper
function BarChartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}
