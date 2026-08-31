"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  MapPin,
  HelpCircle,
  Play,
  Volume2,
  RefreshCw,
  Projector,
  Minimize2,
  ChevronLeft,
  Pause,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { PLACES, Place } from "./places";
import { Scoreboard } from "./components/Scoreboard";
import { SettingsPanel, GameSettings } from "./components/SettingsPanel";
import { Button } from "@/components/ui/button";

export default function IsraelGamePage() {
  // Game states
  const [settings, setSettings] = useState<GameSettings>({
    categories: { cities: true, nature: true, heritage: true, regions: true },
    regions: { north: true, center: true, south: true, jerusalem: true, east: true },
    difficulties: { easy: true, medium: true, hard: true },
    timerDuration: 30,
    voiceEnabled: true,
    englishEnabled: true,
  });

  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>(PLACES);
  const [remainingPlaces, setRemainingPlaces] = useState<Place[]>([]);
  const [currentPlace, setCurrentPlace] = useState<Place | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [isProjectorMode, setIsProjectorMode] = useState(false);

  // Timer states
  const [timeLeft, setTimeLeft] = useState(settings.timerDuration);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Statistics
  const [historyCount, setHistoryCount] = useState(0);

  // Sound generator (Web Audio API)
  const playSound = useCallback((type: "beep" | "success" | "warning" | "tick") => {
    if (typeof window === "undefined") return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === "beep") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } else if (type === "success") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08);
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.16);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } else if (type === "warning") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(140, ctx.currentTime);
        osc.frequency.setValueAtTime(110, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === "tick") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        gain.gain.setValueAtTime(0.02, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      }
    } catch (e) {
      console.error("Audio API error", e);
    }
  }, []);

  // Hebrew Text to Speech
  const speakText = useCallback((text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "he-IL";
      utterance.rate = 0.95;

      const voices = window.speechSynthesis.getVoices();
      const hebrewVoice = voices.find((v) => v.lang.startsWith("he"));
      if (hebrewVoice) {
        utterance.voice = hebrewVoice;
      }
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error("Speech Synthesis error", e);
    }
  }, []);

  // Filter places based on active settings
  const updateFilters = useCallback(() => {
    const filtered = PLACES.filter((place) => {
      const catMatch = settings.categories[place.category];
      const regMatch = settings.regions[place.region];
      const diffMatch = settings.difficulties[place.difficulty];
      return catMatch && regMatch && diffMatch;
    });

    setFilteredPlaces(filtered);
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    setRemainingPlaces(shuffled);
    setCurrentPlace(null);
    setHistoryCount(0);
    setShowHint(false);
    setTimeLeft(settings.timerDuration);
    setIsTimerRunning(false);
  }, [settings]);

  // Handle settings adjustments
  useEffect(() => {
    updateFilters();
  }, [settings, updateFilters]);

  const testVoice = () => {
    if (currentPlace) {
      speakText(currentPlace.name);
    } else {
      speakText("נא לבחור מקום");
    }
  };

  // Select next place
  const selectNextPlace = useCallback(() => {
    if (remainingPlaces.length === 0) {
      if (filteredPlaces.length === 0) {
        alert("אין מקומות תואמים למסננים שנבחרו. אנא שנה את ההגדרות.");
        return;
      }
      playSound("success");
      const reshuffled = [...filteredPlaces].sort(() => Math.random() - 0.5);
      setRemainingPlaces(reshuffled);
      alert("כל המקומות הוצגו! מתחילים סבב חדש.");
      return;
    }

    const nextList = [...remainingPlaces];
    const next = nextList.pop();

    if (next) {
      setCurrentPlace(next);
      setRemainingPlaces(nextList);
      setHistoryCount((prev) => prev + 1);
      setShowHint(false);
      playSound("beep");

      // Reset and trigger timer if enabled
      if (settings.timerDuration > 0) {
        setTimeLeft(settings.timerDuration);
        setIsTimerRunning(true);
      } else {
        setIsTimerRunning(false);
      }

      // Read aloud if enabled
      if (settings.voiceEnabled) {
        setTimeout(() => speakText(next.name), 250);
      }
    }
  }, [remainingPlaces, filteredPlaces, settings, playSound, speakText]);

  // Timer tick effect
  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      timerIntervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current!);
            setIsTimerRunning(false);
            playSound("warning");
            return 0;
          }
          if (prev <= 6) {
            playSound("tick");
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isTimerRunning, timeLeft, playSound]);

  // Reset the game
  const resetGame = () => {
    updateFilters();
    playSound("success");
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (e.code === "Space") {
        e.preventDefault();
        selectNextPlace();
      } else if (e.key === "h" || e.key === "H" || e.key === "י") {
        e.preventDefault();
        setShowHint((prev) => !prev);
      } else if (e.key === "p" || e.key === "P" || e.key === "פ") {
        e.preventDefault();
        setIsProjectorMode((prev) => !prev);
      } else if (e.key === "t" || e.key === "T" || e.key === "א") {
        e.preventDefault();
        if (settings.timerDuration > 0) {
          setIsTimerRunning((prev) => !prev);
        }
      } else if (e.key === "r" || e.key === "R" || e.key === "ר") {
        e.preventDefault();
        resetGame();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectNextPlace, settings.timerDuration, showHint, isProjectorMode]);

  // Style helpers for difficulty badges
  const getDifficultyBadge = (diff: Place["difficulty"]) => {
    switch (diff) {
      case "easy":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "medium":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "hard":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
    }
  };

  const getDifficultyLabel = (diff: Place["difficulty"]) => {
    switch (diff) {
      case "easy":
        return "קל";
      case "medium":
        return "בינוני";
      case "hard":
        return "קשה";
    }
  };

  const getCategoryLabel = (cat: Place["category"]) => {
    switch (cat) {
      case "cities":
        return "יישוב/עיר";
      case "nature":
        return "טבע ומים";
      case "heritage":
        return "מורשת והיסטוריה";
      case "regions":
        return "אזור גיאוגרפי";
    }
  };

  const getRegionLabel = (reg: Place["region"]) => {
    switch (reg) {
      case "north":
        return "צפון";
      case "center":
        return "מרכז";
      case "south":
        return "דרום";
      case "jerusalem":
        return "אזור ירושלים";
      case "east":
        return "מזרח / בקעה";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080c18] text-[#e8edf8] relative overflow-hidden font-sans" dir="rtl">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-enrichment/10 via-transparent to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-enrichment/5 blur-[150px] pointer-events-none" />

      {/* HEADER SECTION */}
      {!isProjectorMode && (
        <header className="relative z-10 w-full max-w-5xl mx-auto px-6 py-4 flex items-center justify-between border-b border-border-custom bg-surface/50 backdrop-blur-md mt-4 rounded-2xl">
          <div className="flex items-center gap-3">
            <Link
              href="/enrichment"
              className="p-2 bg-surface hover:bg-surface-hover border border-border-custom rounded-xl transition-colors text-text-muted hover:text-white"
              title="חזרה להעשרה"
            >
              <ArrowRight className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-enrichment animate-pulse" />
                חידון מפת ישראל
              </h1>
              <p className="text-xs text-text-muted hidden sm:block">
                כלי הקרנה למשחק מפת ישראל בכיתה
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <SettingsPanel settings={settings} onChange={setSettings} />

            <Button
              variant="outline"
              size="icon"
              title="איפוס משחק"
              onClick={resetGame}
              className="border-border-custom hover:bg-surface-hover text-text-muted hover:text-white"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>

            {settings.voiceEnabled && (
              <Button
                variant="outline"
                size="icon"
                title="השמעת שם נוכחי בקול"
                onClick={testVoice}
                className="border-border-custom hover:bg-surface-hover text-text-muted hover:text-white"
              >
                <Volume2 className="w-4 h-4" />
              </Button>
            )}

            <Button
              variant="default"
              onClick={() => setIsProjectorMode(true)}
              className="bg-enrichment hover:bg-enrichment/90 text-white shadow-md gap-2"
            >
              <Projector className="w-4 h-4" />
              <span className="hidden sm:inline">מצב מקרן</span>
            </Button>
          </div>
        </header>
      )}

      {/* MAIN GAME CONTAINER */}
      <main className="relative z-10 flex-1 w-full max-w-5xl mx-auto px-6 py-6 flex flex-col justify-between gap-6">
        
        {/* GAME CONTENT SECTION */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          
          {/* Main Card (Place display) */}
          <div className="lg:col-span-2 flex flex-col justify-between bg-surface/60 backdrop-blur-md border border-border-custom p-6 md:p-10 rounded-3xl shadow-xl transition-all duration-300">
            {/* Top row of card */}
            <div className="flex items-center justify-between">
              {currentPlace ? (
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-surface border border-border-custom text-text-muted font-medium">
                    {getCategoryLabel(currentPlace.category)}
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-surface border border-border-custom text-text-muted font-medium">
                    {getRegionLabel(currentPlace.region)}
                  </span>
                  <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${getDifficultyBadge(currentPlace.difficulty)}`}>
                    רמת {getDifficultyLabel(currentPlace.difficulty)}
                  </span>
                </div>
              ) : (
                <span className="text-sm font-medium text-text-muted">מוכן להפעלה</span>
              )}

              <div className="text-xs font-semibold text-text-muted bg-surface border border-border-custom py-1 px-3 rounded-full">
                {currentPlace
                  ? `הוצגו: ${historyCount} | נותרו: ${remainingPlaces.length}`
                  : `סה"כ מקומות בסינון: ${filteredPlaces.length}`}
              </div>
            </div>

            {/* Giant display area */}
            <div className="flex-1 flex flex-col items-center justify-center text-center my-8 min-h-[220px]">
              {currentPlace ? (
                <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
                  <h2 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-wider text-white drop-shadow-md select-none">
                    {currentPlace.name}
                  </h2>

                  {settings.englishEnabled && (
                    <p className="text-2xl md:text-3xl font-medium text-text-muted select-none">
                      {currentPlace.englishName}
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-4 text-center max-w-md">
                  <HelpCircle className="w-16 h-16 text-enrichment/40 mx-auto animate-bounce" />
                  <h2 className="text-3xl font-extrabold text-white">
                    משחק מפת ישראל בכיתה
                  </h2>
                  <p className="text-text-muted text-sm leading-relaxed">
                    פרסו בכיתה את מפת ישראל הגדולה. לחצו על <b>מקום הבא</b> (או לחצו על מקש <b>רווח</b>) והתלמידים יצטרכו למצוא ולסמן את המקום שיוצג!
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Row - Controls, Timer and Hint Toggle */}
            <div className="space-y-6">
              {currentPlace && showHint && (
                <div className="p-4 rounded-xl bg-surface border border-border-custom text-[#e8edf8] animate-[slideDown_0.25s_ease-out] text-right">
                  <p className="text-sm font-bold text-enrichment mb-1">רמז טקסטואלי:</p>
                  <p className="text-base text-foreground/90">{currentPlace.hint}</p>
                </div>
              )}

              <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
                {/* Timer Display */}
                {settings.timerDuration > 0 && currentPlace && (
                  <div className="flex items-center gap-3 bg-surface/50 hover:bg-surface border border-border-custom p-2.5 rounded-xl transition-colors cursor-pointer"
                       onClick={() => setIsTimerRunning(!isTimerRunning)}>
                    <div className="relative w-12 h-12 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          stroke="currentColor"
                          strokeWidth="3"
                          fill="transparent"
                          className="text-white/5"
                        />
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          stroke="currentColor"
                          strokeWidth="3"
                          fill="transparent"
                          strokeDasharray={125.6}
                          strokeDashoffset={125.6 - (125.6 * timeLeft) / settings.timerDuration}
                          className={`transition-all duration-1000 ${
                            timeLeft <= 5 ? "text-rose-500" : "text-enrichment"
                          }`}
                        />
                      </svg>
                      <span className={`absolute text-sm font-bold font-mono ${timeLeft <= 5 ? "text-rose-500 animate-pulse text-base" : "text-white"}`}>
                        {timeLeft}
                      </span>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-semibold text-text-muted flex items-center gap-1">
                        {isTimerRunning ? (
                          <>
                            <Pause className="w-3 h-3 text-emerald-500" />
                            <span>ספירה לאחור</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3 h-3 text-amber-500" />
                            <span>מושהה</span>
                          </>
                        )}
                      </div>
                      <div className="text-xs text-text-muted">לחץ לעצירה/הפעלה</div>
                    </div>
                  </div>
                )}

                {/* Main Action Buttons */}
                <div className="flex flex-1 md:flex-none justify-end gap-3">
                  {currentPlace && (
                    <Button
                      variant={showHint ? "default" : "outline"}
                      onClick={() => setShowHint(!showHint)}
                      className={`gap-2 h-12 px-6 text-sm font-semibold border-border-custom transition-all duration-200 ${
                        showHint ? "bg-white text-black" : "hover:bg-surface-hover text-text-muted"
                      }`}
                    >
                      <HelpCircle className="w-4 h-4" />
                      <span>{showHint ? "הסתר רמז" : "הצג רמז (H)"}</span>
                    </Button>
                  )}

                  <Button
                    variant="default"
                    size="lg"
                    onClick={selectNextPlace}
                    className="flex-1 md:flex-none h-12 px-8 text-base font-black bg-enrichment hover:bg-enrichment/90 text-white shadow-md gap-2"
                  >
                    <span>מקום הבא</span>
                    <ChevronLeft className="w-5 h-5 shrink-0" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Map Hint Card */}
          <div className="flex flex-col items-center justify-between bg-surface/60 backdrop-blur-md border border-border-custom p-6 rounded-3xl shadow-xl min-h-[450px]">
            <div className="w-full text-right mb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-border-custom pb-2">
                <MapPin className="w-4 h-4 text-enrichment" />
                רמז מפה (מיקום מקורב)
              </h3>
            </div>

            {/* Stylized SVG Map of Israel */}
            <div className="relative w-full flex-1 flex items-center justify-center p-4">
              <div className="relative w-[180px] h-[360px] border border-border-custom/25 rounded-2xl bg-surface/30 flex items-center justify-center">
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full max-h-[340px] text-text-muted/20 fill-transparent stroke-current transition-all duration-300"
                >
                  <path
                    d="M 33 8 L 32 19 L 30 40 L 25 49 L 22 54 L 20 60 L 45 95 L 47 78 L 49 58 L 50 52 L 48 30 L 48 25 L 47 15 L 51 10 L 49 4 Z"
                    className="stroke-text-muted/25 stroke-[1.5] fill-surface/40 hover:fill-surface/60 transition-colors"
                  />

                  {currentPlace && showHint && (
                    <circle
                      cx={currentPlace.coordinates.x}
                      cy={currentPlace.coordinates.y}
                      r="4"
                      className="fill-rose-500 stroke-surface stroke-[1.5] animate-ping"
                    />
                  )}

                  {currentPlace && showHint && (
                    <circle
                      cx={currentPlace.coordinates.x}
                      cy={currentPlace.coordinates.y}
                      r="3"
                      className="fill-rose-600 stroke-white stroke-2 shadow-lg"
                    />
                  )}
                </svg>

                {!showHint && (
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-text-muted/60 text-center select-none p-4">
                    הרמז יציג את מיקום המקום על גבי מפת ישראל מופשטת זו
                  </div>
                )}
                
                {showHint && currentPlace && (
                  <div className="absolute bottom-2 left-2 right-2 bg-surface/90 backdrop-blur-sm border border-border-custom py-1.5 px-3 rounded-lg text-center text-xs font-semibold text-white shadow animate-[fadeIn_0.2s_ease-out]">
                    מיקום כללי: {getRegionLabel(currentPlace.region)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* SCOREBOARD SECTION */}
        <section className="relative z-10 w-full mt-2">
          <Scoreboard />
        </section>
      </main>

      {/* FOOTER */}
      {!isProjectorMode && (
        <footer className="relative z-10 w-full border-t border-border-custom py-4 mt-8 bg-surface/30 text-center text-xs text-text-muted">
          <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              פותח עבור פעילויות למידה חווייתית בגיאוגרפיה ומולדת.
            </div>
            <div className="flex gap-4">
              <span>קיצורי מקשים: <b>רווח</b> - מקום הבא | <b>H</b> - רמז | <b>P</b> - מקרן | <b>T</b> - טיימר</span>
            </div>
          </div>
        </footer>
      )}

      {/* PROJECTOR MODE OVERLAY */}
      {isProjectorMode && (
        <div className="fixed inset-0 z-50 bg-black text-white flex flex-col justify-between p-8 md:p-16 select-none animate-[fadeIn_0.2s_ease-out]">
          
          {/* Top Panel */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <span className="text-xl font-black text-white bg-red-600 px-3 py-1.5 rounded-lg uppercase tracking-wide">
                חידון מפה
              </span>
              <span className="text-sm text-white/50">
                מצאו את המקום הבא על המפה שבכיתה
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-white/40 hidden md:inline">
                קיצורים: [רווח] מקום הבא | [H] הצגת רמז | [Esc] יציאה
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsProjectorMode(false)}
                className="bg-transparent text-white border-white/20 hover:bg-white/10 hover:text-white"
              >
                <Minimize2 className="w-4 h-4 ml-1.5" />
                יציאה ממצב מקרן
              </Button>
            </div>
          </div>

          {/* Central content - Giant Name */}
          <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
            {currentPlace ? (
              <div className="space-y-6">
                {timeLeft <= 5 && settings.timerDuration > 0 && timeLeft > 0 && (
                  <div className="flex items-center gap-2 justify-center text-amber-500 mb-2 animate-bounce">
                    <AlertTriangle className="w-6 h-6" />
                    <span className="text-sm font-semibold">מהרו, הזמן כמעט נגמר!</span>
                  </div>
                )}

                <h2 className="text-7xl md:text-9xl font-black tracking-wider text-white select-none transition-all duration-300">
                  {currentPlace.name}
                </h2>

                {settings.englishEnabled && (
                  <p className="text-3xl md:text-4xl font-semibold text-white/60 select-none">
                    {currentPlace.englishName}
                  </p>
                )}

                {showHint && (
                  <div className="max-w-2xl mx-auto p-6 rounded-2xl bg-white/5 border border-white/10 text-white mt-6 animate-[slideDown_0.2s_ease-out]">
                    <div className="flex justify-center gap-8 mb-4">
                      <span className="text-xs px-2.5 py-1 rounded-full bg-white/10 text-white/80 font-medium">
                        קטגוריה: {getCategoryLabel(currentPlace.category)}
                      </span>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-white/10 text-white/80 font-medium">
                        אזור: {getRegionLabel(currentPlace.region)}
                      </span>
                    </div>
                    <p className="text-lg md:text-xl text-white/90 font-medium leading-relaxed">
                      {currentPlace.hint}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-extrabold text-white/85">
                  מפת ישראל - חידון כיתתי
                </h2>
                <p className="text-white/50 max-w-md mx-auto text-sm">
                  לחצו על מקש <b>רווח</b> כדי להציג את המקום הראשון בגדול על המסך.
                </p>
              </div>
            )}
          </div>

          {/* Bottom Controls / Progress */}
          <div className="flex items-center justify-between border-t border-white/10 pt-4">
            {currentPlace ? (
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowHint(!showHint)}
                className="bg-white/5 text-white border-white/10 hover:bg-white/10 hover:text-white"
              >
                {showHint ? "הסתר רמז [H]" : "הצג רמז [H]"}
              </Button>
            ) : (
              <div />
            )}

            {settings.timerDuration > 0 && currentPlace && (
              <div className="flex items-center gap-4 bg-white/5 p-3 rounded-2xl border border-white/10">
                <div className={`text-4xl font-mono font-bold ${timeLeft <= 5 ? "text-red-500 animate-ping" : "text-white"}`}>
                  {timeLeft}
                </div>
                <div className="text-right">
                  <div className="text-xs text-white/40">זמן שנותר</div>
                  <div className="text-xs font-semibold text-white/80">שניות למציאה במפה</div>
                </div>
              </div>
            )}

            <Button
              variant="default"
              size="lg"
              onClick={selectNextPlace}
              className="bg-white text-black hover:bg-white/90 font-extrabold px-8 py-6 rounded-xl shadow-lg gap-2 text-base"
            >
              <span>מקום הבא</span>
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
