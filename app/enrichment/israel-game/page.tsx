"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  MapPin,
  HelpCircle,
  Play,
  RefreshCw,
  Projector,
  Minimize2,
  Maximize2,
  ChevronLeft,
  Pause,
  AlertTriangle,
  ArrowRight,
  Sun,
  Moon,
  Sparkles,
  Trophy,
} from "lucide-react";
import { PLACES, Place } from "./places";
import {
  Scoreboard,
  Team,
  TEAM_COLOR_PALETTES,
} from "./components/Scoreboard";
import { SettingsPanel, GameSettings } from "./components/SettingsPanel";
import { IsraelMapHint } from "./components/IsraelMapHint";
import { Button } from "@/components/ui/button";

const DIFFICULTY_POINTS: Record<Place["difficulty"], number> = {
  easy: 10,
  medium: 20,
  hard: 30,
};

const DEFAULT_TEAMS: Team[] = [
  {
    id: "1",
    name: "קבוצה א'",
    score: 0,
    color: TEAM_COLOR_PALETTES[0],
  },
  {
    id: "2",
    name: "קבוצה ב'",
    score: 0,
    color: TEAM_COLOR_PALETTES[1],
  },
  {
    id: "3",
    name: "קבוצה ג'",
    score: 0,
    color: TEAM_COLOR_PALETTES[2],
  },
  {
    id: "4",
    name: "קבוצה ד'",
    score: 0,
    color: TEAM_COLOR_PALETTES[3],
  },
];

export default function IsraelGamePage() {
  // Theme / Comfort reading mode
  const [comfortMode, setComfortMode] = useState<"dark" | "light">("dark");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("teaching-site-comfort-mode");
      if (stored === "light" || stored === "dark") {
        setComfortMode(stored);
      }
    }
  }, []);

  const toggleComfortMode = () => {
    const next = comfortMode === "dark" ? "light" : "dark";
    setComfortMode(next);
    if (typeof window !== "undefined") {
      localStorage.setItem("teaching-site-comfort-mode", next);
    }
  };

  const isLight = comfortMode === "light";

  // Game settings (audio removed completely)
  const [settings, setSettings] = useState<GameSettings>({
    categories: { cities: true, nature: true, heritage: true, regions: true },
    regions: {
      north: true,
      center: true,
      south: true,
      jerusalem: true,
      east: true,
    },
    difficulties: { easy: true, medium: true, hard: true },
    timerDuration: 30,
    englishEnabled: true,
  });

  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>(PLACES);
  const [remainingPlaces, setRemainingPlaces] = useState<Place[]>([]);
  const [currentPlace, setCurrentPlace] = useState<Place | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [isProjectorMode, setIsProjectorMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Teams & Scores state (persisted in localStorage)
  const [teams, setTeams] = useState<Team[]>(DEFAULT_TEAMS);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("israel-game-teams");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length >= 2) {
            setTeams(parsed);
          }
        }
      } catch (e) {
        console.error("Error loading teams", e);
      }
    }
  }, []);

  const saveTeams = (newTeams: Team[]) => {
    setTeams(newTeams);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("israel-game-teams", JSON.stringify(newTeams));
      } catch (e) {
        console.error("Error saving teams", e);
      }
    }
  };

  const handleUpdateScore = (id: string, amount: number) => {
    saveTeams(
      teams.map((t) =>
        t.id === id ? { ...t, score: Math.max(0, t.score + amount) } : t
      )
    );
  };

  const handleAwardPoints = (id: string, points: number) => {
    saveTeams(
      teams.map((t) =>
        t.id === id ? { ...t, score: Math.max(0, t.score + points) } : t
      )
    );
  };

  const handleRenameTeam = (id: string, newName: string) => {
    saveTeams(
      teams.map((t) => (t.id === id ? { ...t, name: newName } : t))
    );
  };

  const handleAddTeam = () => {
    const letters = [
      "א'",
      "ב'",
      "ג'",
      "ד'",
      "ה'",
      "ו'",
      "ז'",
      "ח'",
      "ט'",
      "י'",
      "י\"א",
      "י\"ב",
    ];
    const letter = letters[teams.length % letters.length] || `${teams.length + 1}`;
    const nextColor =
      TEAM_COLOR_PALETTES[teams.length % TEAM_COLOR_PALETTES.length];

    const newTeam: Team = {
      id: Date.now().toString(),
      name: `קבוצה ${letter}`,
      score: 0,
      color: nextColor,
    };
    saveTeams([...teams, newTeam]);
  };

  const handleRemoveTeam = (id: string) => {
    if (teams.length <= 2) return;
    saveTeams(teams.filter((t) => t.id !== id));
  };

  const handleResetScores = () => {
    saveTeams(teams.map((t) => ({ ...t, score: 0 })));
  };

  // Timer states
  const [timeLeft, setTimeLeft] = useState(settings.timerDuration);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Statistics
  const [historyCount, setHistoryCount] = useState(0);

  // Current place difficulty points
  const currentPlacePoints = currentPlace
    ? DIFFICULTY_POINTS[currentPlace.difficulty]
    : 10;

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

  // Select next place
  const selectNextPlace = useCallback(() => {
    if (remainingPlaces.length === 0) {
      if (filteredPlaces.length === 0) {
        alert("אין מקומות תואמים למסננים שנבחרו. אנא שנה את ההגדרות.");
        return;
      }
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

      // Reset and trigger timer if enabled
      if (settings.timerDuration > 0) {
        setTimeLeft(settings.timerDuration);
        setIsTimerRunning(true);
      } else {
        setIsTimerRunning(false);
      }
    }
  }, [remainingPlaces, filteredPlaces, settings]);

  // Timer tick effect (without any audio/sound)
  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      timerIntervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current!);
            setIsTimerRunning(false);
            return 0;
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
  }, [isTimerRunning, timeLeft]);

  // Reset the game
  const resetGame = () => {
    updateFilters();
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
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
      } else if (e.key === "Escape" && isProjectorMode) {
        setIsProjectorMode(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectNextPlace, settings.timerDuration, showHint, isProjectorMode]);

  // Style helpers for difficulty badges
  const getDifficultyBadge = (diff: Place["difficulty"]) => {
    switch (diff) {
      case "easy":
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
      case "medium":
        return "bg-amber-500/15 text-amber-400 border-amber-500/30";
      case "hard":
        return "bg-rose-500/15 text-rose-400 border-rose-500/30";
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
        return "יישוב / עיר";
      case "nature":
        return "טבע ומים";
      case "heritage":
        return "מורשת והיסטוריה";
      case "regions":
        return "חבל ארץ ואזור";
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

  const bgPage = isLight
    ? "bg-[#f8fafc] text-zinc-900"
    : "bg-[#080c18] text-[#e8edf8]";

  return (
    <div
      className={`min-h-screen flex flex-col relative overflow-hidden font-sans transition-colors duration-200 ${bgPage}`}
      dir="rtl"
    >
      {/* Background glow effects */}
      {!isLight && (
        <>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-enrichment/10 via-transparent to-transparent blur-3xl pointer-events-none rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-enrichment/5 blur-[150px] pointer-events-none" />
        </>
      )}

      {/* HEADER SECTION */}
      {!isProjectorMode && (
        <header
          className={`relative z-10 w-full max-w-5xl mx-auto px-6 py-4 flex items-center justify-between border mt-4 rounded-2xl backdrop-blur-md transition-colors ${
            isLight
              ? "bg-white/80 border-zinc-200 shadow-sm"
              : "bg-surface/50 border-border-custom"
          }`}
        >
          <div className="flex items-center gap-3">
            <Link
              href="/enrichment"
              className={`p-2 rounded-xl border transition-colors ${
                isLight
                  ? "bg-zinc-100 hover:bg-zinc-200 border-zinc-300 text-zinc-700"
                  : "bg-surface hover:bg-surface-hover border-border-custom text-text-muted hover:text-white"
              }`}
              title="חזרה להעשרה"
            >
              <ArrowRight className="w-5 h-5" />
            </Link>
            <div>
              <h1
                className={`text-xl md:text-2xl font-black tracking-tight flex items-center gap-2 ${
                  isLight ? "text-zinc-950" : "text-white"
                }`}
              >
                <MapPin className="w-5 h-5 text-enrichment animate-pulse" />
                חידון מפת ישראל
              </h1>
              <p
                className={`text-xs hidden sm:block ${
                  isLight ? "text-zinc-500" : "text-text-muted"
                }`}
              >
                משחק כיתתי חווייתי למפת ישראל עם לוח ניקוד מובנה
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme / Comfort reading mode toggle */}
            <Button
              variant="outline"
              size="icon"
              onClick={toggleComfortMode}
              title={isLight ? "מעבר למצב כהה" : "מעבר למצב קריאה בהיר"}
              className={`transition-colors ${
                isLight
                  ? "border-zinc-300 bg-zinc-100 hover:bg-zinc-200 text-amber-600"
                  : "border-border-custom hover:bg-surface-hover text-text-muted hover:text-white"
              }`}
            >
              {isLight ? (
                <Moon className="w-4 h-4 text-zinc-700" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400" />
              )}
            </Button>

            {/* Settings dialog */}
            <SettingsPanel settings={settings} onChange={setSettings} />

            {/* Reset game button */}
            <Button
              variant="outline"
              size="icon"
              title="ערבוב מחדש של המקומות"
              onClick={resetGame}
              className={`transition-colors ${
                isLight
                  ? "border-zinc-300 bg-zinc-100 hover:bg-zinc-200 text-zinc-700"
                  : "border-border-custom hover:bg-surface-hover text-text-muted hover:text-white"
              }`}
            >
              <RefreshCw className="w-4 h-4" />
            </Button>

            {/* Projector mode button */}
            <Button
              variant="default"
              onClick={() => setIsProjectorMode(true)}
              className="bg-enrichment hover:bg-enrichment/90 text-white shadow-md gap-2 font-bold"
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
          <div
            className={`lg:col-span-2 flex flex-col justify-between border p-6 md:p-8 rounded-3xl transition-all duration-300 ${
              isLight
                ? "bg-white border-zinc-200 shadow-sm"
                : "bg-surface/60 backdrop-blur-md border-border-custom shadow-xl"
            }`}
          >
            {/* Top row of card */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-4 border-inherit">
              {currentPlace ? (
                <div className="flex flex-wrap gap-2 items-center">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full border font-medium ${
                      isLight
                        ? "bg-zinc-100 border-zinc-300 text-zinc-800"
                        : "bg-surface border-border-custom text-text-muted"
                    }`}
                  >
                    {getCategoryLabel(currentPlace.category)}
                  </span>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full border font-medium ${
                      isLight
                        ? "bg-zinc-100 border-zinc-300 text-zinc-800"
                        : "bg-surface border-border-custom text-text-muted"
                    }`}
                  >
                    {getRegionLabel(currentPlace.region)}
                  </span>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full border font-bold ${getDifficultyBadge(
                      currentPlace.difficulty
                    )}`}
                  >
                    רמת {getDifficultyLabel(currentPlace.difficulty)}
                  </span>

                  {/* Difficulty points worth badge */}
                  <span className="text-xs px-2.5 py-1 rounded-full bg-enrichment/15 text-enrichment border border-enrichment/30 font-extrabold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>+{currentPlacePoints} נק׳ למציאה</span>
                  </span>
                </div>
              ) : (
                <span
                  className={`text-sm font-semibold ${
                    isLight ? "text-zinc-500" : "text-text-muted"
                  }`}
                >
                  מוכן להפעלה
                </span>
              )}

              <div
                className={`text-xs font-semibold py-1 px-3 rounded-full border ${
                  isLight
                    ? "bg-zinc-100 border-zinc-300 text-zinc-700"
                    : "bg-surface border-border-custom text-text-muted"
                }`}
              >
                {currentPlace
                  ? `הוצגו: ${historyCount} | נותרו: ${remainingPlaces.length}`
                  : `סה"כ מקומות בסינון: ${filteredPlaces.length}`}
              </div>
            </div>

            {/* Giant display area */}
            <div className="flex-1 flex flex-col items-center justify-center text-center my-8 min-h-[220px]">
              {currentPlace ? (
                <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
                  <h2
                    className={`text-6xl md:text-8xl lg:text-9xl font-black tracking-wider drop-shadow-md select-none ${
                      isLight ? "text-zinc-950" : "text-white"
                    }`}
                  >
                    {currentPlace.name}
                  </h2>

                  {settings.englishEnabled && (
                    <p
                      className={`text-2xl md:text-3xl font-medium select-none ${
                        isLight ? "text-zinc-600" : "text-text-muted"
                      }`}
                    >
                      {currentPlace.englishName}
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-4 text-center max-w-md">
                  <HelpCircle className="w-16 h-16 text-enrichment/50 mx-auto animate-bounce" />
                  <h2
                    className={`text-3xl font-extrabold ${
                      isLight ? "text-zinc-950" : "text-white"
                    }`}
                  >
                    משחק מפת ישראל בכיתה
                  </h2>
                  <p
                    className={`text-sm leading-relaxed ${
                      isLight ? "text-zinc-600" : "text-text-muted"
                    }`}
                  >
                    פרסו בכיתה את מפת ישראל הגדולה. לחצו על <b>מקום הבא</b> (או
                    לחצו על מקש <b>רווח</b>) והתלמידים יצטרכו למצוא ולסמן את
                    המקום שיוצג!
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Row - Controls, Timer and Hint Toggle */}
            <div className="space-y-6">
              {currentPlace && showHint && (
                <div
                  className={`p-4 rounded-2xl border text-right animate-[slideDown_0.25s_ease-out] ${
                    isLight
                      ? "bg-amber-50/70 border-amber-200 text-zinc-900"
                      : "bg-surface border-border-custom text-white"
                  }`}
                >
                  <p className="text-sm font-bold text-enrichment mb-1">
                    רמז טקסטואלי:
                  </p>
                  <p className="text-base font-medium leading-relaxed">
                    {currentPlace.hint}
                  </p>
                </div>
              )}

              <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
                {/* Timer Display */}
                {settings.timerDuration > 0 && currentPlace && (
                  <div
                    className={`flex items-center gap-3 border p-2.5 rounded-2xl transition-colors cursor-pointer ${
                      isLight
                        ? "bg-zinc-100 hover:bg-zinc-200/80 border-zinc-300"
                        : "bg-surface/50 hover:bg-surface border-border-custom"
                    }`}
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                  >
                    <div className="relative w-12 h-12 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          stroke="currentColor"
                          strokeWidth="3"
                          fill="transparent"
                          className={isLight ? "text-zinc-300" : "text-white/5"}
                        />
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          stroke="currentColor"
                          strokeWidth="3"
                          fill="transparent"
                          strokeDasharray={125.6}
                          strokeDashoffset={
                            125.6 -
                            (125.6 * timeLeft) / settings.timerDuration
                          }
                          className={`transition-all duration-1000 ${
                            timeLeft <= 5 ? "text-rose-500" : "text-enrichment"
                          }`}
                        />
                      </svg>
                      <span
                        className={`absolute text-sm font-bold font-mono ${
                          timeLeft <= 5
                            ? "text-rose-500 animate-pulse text-base"
                            : isLight
                            ? "text-zinc-900"
                            : "text-white"
                        }`}
                      >
                        {timeLeft}
                      </span>
                    </div>

                    <div className="text-right">
                      <div
                        className={`text-xs font-semibold flex items-center gap-1 ${
                          isLight ? "text-zinc-700" : "text-text-muted"
                        }`}
                      >
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
                      <div
                        className={`text-xs ${
                          isLight ? "text-zinc-500" : "text-text-muted"
                        }`}
                      >
                        לחץ לעצירה/הפעלה
                      </div>
                    </div>
                  </div>
                )}

                {/* Main Action Buttons */}
                <div className="flex flex-1 md:flex-none justify-end gap-3">
                  {currentPlace && (
                    <Button
                      variant={showHint ? "default" : "outline"}
                      onClick={() => setShowHint(!showHint)}
                      className={`gap-2 h-12 px-6 text-sm font-bold transition-all duration-200 ${
                        showHint
                          ? "bg-enrichment text-white hover:bg-enrichment/90"
                          : isLight
                          ? "border-zinc-300 text-zinc-800 hover:bg-zinc-100"
                          : "border-border-custom hover:bg-surface-hover text-text-muted"
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

          {/* Regional Zone Map Hint Card (No exact dots) */}
          <div className="flex flex-col">
            <IsraelMapHint
              place={currentPlace}
              showHint={showHint}
              isLight={isLight}
            />
          </div>
        </div>

        {/* SCOREBOARD SECTION */}
        <section className="relative z-10 w-full mt-2">
          <Scoreboard
            teams={teams}
            onUpdateScore={handleUpdateScore}
            onAwardPoints={handleAwardPoints}
            onRenameTeam={handleRenameTeam}
            onAddTeam={handleAddTeam}
            onRemoveTeam={handleRemoveTeam}
            onResetScores={handleResetScores}
            currentPlacePoints={currentPlacePoints}
            isLight={isLight}
          />
        </section>
      </main>

      {/* FOOTER */}
      {!isProjectorMode && (
        <footer
          className={`relative z-10 w-full border-t py-4 mt-8 text-center text-xs transition-colors ${
            isLight
              ? "bg-zinc-100/80 border-zinc-200 text-zinc-600"
              : "bg-surface/30 border-border-custom text-text-muted"
          }`}
        >
          <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>פעילות למידה חווייתית בגיאוגרפיה ומולדת לכיתה.</div>
            <div className="flex gap-4 font-mono">
              <span>
                קיצורים: <b>רווח</b> מקום הבא | <b>H</b> רמז | <b>P</b> מקרן |{" "}
                <b>T</b> טיימר
              </span>
            </div>
          </div>
        </footer>
      )}

      {/* PROJECTOR MODE OVERLAY */}
      {isProjectorMode && (
        <div className="fixed inset-0 z-50 bg-[#060913] text-white flex flex-col justify-between p-6 md:p-10 select-none overflow-y-auto animate-[fadeIn_0.2s_ease-out]">
          {/* Top Bar of Projector */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <span className="text-base md:text-lg font-black text-white bg-red-600 px-3 py-1.5 rounded-xl uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-red-600/30">
                <Projector className="w-4 h-4" />
                מצב מקרן כיתתי
              </span>
              <span className="text-xs md:text-sm text-white/60 hidden sm:inline">
                {currentPlace
                  ? `הוצגו: ${historyCount} | נותרו: ${remainingPlaces.length}`
                  : "מוכן להתחלה"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-white/40 hidden lg:inline">
                קיצורים: [רווח] מקום הבא | [H] רמז | [Esc] יציאה
              </span>

              {/* Fullscreen button */}
              <Button
                variant="outline"
                size="sm"
                onClick={toggleFullscreen}
                className="bg-transparent text-white border-white/20 hover:bg-white/10"
                title="מסך מלא"
              >
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </Button>

              {/* Exit projector button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsProjectorMode(false)}
                className="bg-transparent text-white border-white/20 hover:bg-white/10 hover:text-white"
              >
                <Minimize2 className="w-4 h-4 ml-1.5" />
                <span>יציאה ממקרן</span>
              </Button>
            </div>
          </div>

          {/* Center Stage: Place Display & Map Hint side-by-side */}
          <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 py-6 my-auto">
            {/* Left/Center: Main Place Question Display */}
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
              {currentPlace ? (
                <div className="space-y-4 w-full max-w-3xl animate-[fadeIn_0.3s_ease-out]">
                  {/* Badges row */}
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <span className="text-xs px-3 py-1 rounded-full bg-white/10 text-white font-medium border border-white/15">
                      {getCategoryLabel(currentPlace.category)}
                    </span>
                    <span className="text-xs px-3 py-1 rounded-full bg-white/10 text-white font-medium border border-white/15">
                      {getRegionLabel(currentPlace.region)}
                    </span>
                    <span
                      className={`text-xs px-3 py-1 rounded-full border font-bold ${getDifficultyBadge(
                        currentPlace.difficulty
                      )}`}
                    >
                      רמת {getDifficultyLabel(currentPlace.difficulty)}
                    </span>
                    {/* Points worth badge */}
                    <span className="text-xs px-3 py-1 rounded-full bg-enrichment/20 text-enrichment border border-enrichment/40 font-extrabold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>+{currentPlacePoints} נקודות</span>
                    </span>
                  </div>

                  {/* Giant place name */}
                  <h2 className="text-7xl md:text-9xl font-black tracking-wider text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)] select-none">
                    {currentPlace.name}
                  </h2>

                  {/* English Name */}
                  {settings.englishEnabled && (
                    <p className="text-3xl md:text-4xl font-semibold text-white/60 select-none">
                      {currentPlace.englishName}
                    </p>
                  )}

                  {/* Text Hint if toggled */}
                  {showHint && (
                    <div className="max-w-xl mx-auto p-5 rounded-2xl bg-white/10 border border-white/20 text-white text-right animate-[slideDown_0.2s_ease-out]">
                      <p className="text-xs font-bold text-enrichment mb-1">
                        רמז מנחה:
                      </p>
                      <p className="text-lg md:text-xl font-medium leading-relaxed">
                        {currentPlace.hint}
                      </p>
                    </div>
                  )}

                  {/* Timer alert in projector */}
                  {timeLeft <= 5 && settings.timerDuration > 0 && timeLeft > 0 && (
                    <div className="flex items-center gap-2 justify-center text-amber-400 animate-bounce">
                      <AlertTriangle className="w-5 h-5" />
                      <span className="text-sm font-bold">
                        מהרו! הזמן לסיום השאלה כמעט נגמר!
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4 max-w-md text-center">
                  <Trophy className="w-16 h-16 text-enrichment/40 mx-auto animate-pulse" />
                  <h2 className="text-4xl font-black text-white">
                    חידון מפת ישראל הכיתתי
                  </h2>
                  <p className="text-white/60 text-base">
                    לחצו על <b>מקום הבא</b> (או על מקש <b>רווח</b>) כדי להציג את
                    השאלה הראשונה על המסך.
                  </p>
                </div>
              )}
            </div>

            {/* Optional Map Region Hint in Projector Mode (displayed when showHint is active) */}
            {showHint && currentPlace && (
              <div className="w-full max-w-xs animate-[slideDown_0.25s_ease-out]">
                <IsraelMapHint
                  place={currentPlace}
                  showHint={showHint}
                  isProjector
                />
              </div>
            )}
          </div>

          {/* Controls bar above scoreboard */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-4 mb-4">
            <div className="flex items-center gap-3">
              {currentPlace && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setShowHint(!showHint)}
                  className={`border transition-all ${
                    showHint
                      ? "bg-white text-black hover:bg-white/90 font-bold"
                      : "bg-white/10 text-white border-white/20 hover:bg-white/20 font-semibold"
                  }`}
                >
                  <HelpCircle className="w-4 h-4 ml-1.5" />
                  <span>{showHint ? "הסתר רמז [H]" : "הצג רמז [H]"}</span>
                </Button>
              )}

              {/* Timer status */}
              {settings.timerDuration > 0 && currentPlace && (
                <div
                  className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-xl border border-white/15 cursor-pointer hover:bg-white/15 transition-colors"
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  title="לחץ לעצירה/הפעלה של הטיימר"
                >
                  <div
                    className={`text-2xl font-mono font-black ${
                      timeLeft <= 5 ? "text-rose-400 animate-ping" : "text-white"
                    }`}
                  >
                    {timeLeft} ש׳
                  </div>
                  <div className="text-xs text-white/50">
                    {isTimerRunning ? "טיימר פעיל" : "טיימר מושהה"}
                  </div>
                </div>
              )}
            </div>

            {/* Big Next Place button */}
            <Button
              variant="default"
              size="lg"
              onClick={selectNextPlace}
              className="bg-white text-black hover:bg-white/90 font-black px-10 py-6 rounded-2xl shadow-xl gap-2 text-lg transition-transform active:scale-95"
            >
              <span>מקום הבא</span>
              <ChevronLeft className="w-6 h-6" />
            </Button>
          </div>

          {/* PROJECTOR EMBEDDED SCOREBOARD */}
          <div className="w-full">
            <Scoreboard
              teams={teams}
              onUpdateScore={handleUpdateScore}
              onAwardPoints={handleAwardPoints}
              onRenameTeam={handleRenameTeam}
              onAddTeam={handleAddTeam}
              onRemoveTeam={handleRemoveTeam}
              onResetScores={handleResetScores}
              currentPlacePoints={currentPlacePoints}
              isProjector
            />
          </div>
        </div>
      )}
    </div>
  );
}
