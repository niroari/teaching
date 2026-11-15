"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useGameState } from "@/app/english-auction/context/GameStateContext";
import { colorMap, colorsList } from "@/lib/colors";
import { Plus, Trash2, Settings2, Users, HelpCircle, Trophy, Play, Music, VolumeX, Sparkles, DollarSign } from "lucide-react";

export default function SetupPage() {
  const router = useRouter();
  const {
    teams,
    settings,
    addTeam,
    removeTeam,
    updateSettings,
    startGame,
    soundEnabled,
    toggleSound,
  } = useGameState();

  const [newTeamName, setNewTeamName] = useState("");
  const [selectedColor, setSelectedColor] = useState(colorsList[0]);
  const [showSettings, setShowSettings] = useState(false);

  const handleAddTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;
    
    // Check if team name already exists
    if (teams.some(t => t.name.toLowerCase() === newTeamName.trim().toLowerCase())) {
      alert("A team with this name already exists!");
      return;
    }

    addTeam(newTeamName.trim(), selectedColor);
    setNewTeamName("");
    // Cycle to next color automatically
    const currentIndex = colorsList.indexOf(selectedColor);
    const nextIndex = (currentIndex + 1) % colorsList.length;
    setSelectedColor(colorsList[nextIndex]);
  };

  const handleStartGame = () => {
    if (teams.length < 2) {
      alert("Please add at least 2 teams to play!");
      return;
    }
    startGame();
    router.push("/english-auction/game");
  };

  return (
    <div className="relative min-h-screen bg-card text-fg flex flex-col items-center justify-between p-6 overflow-hidden">
      {/* Decorative background glow */}
      {/* Header */}
      <header className="relative w-full max-w-6xl flex justify-between items-center py-4 z-10">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-700 dark:text-cyan-400 font-bold text-xl">
            $
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              THE SENTENCE AUCTION
            </h1>
            <p className="text-[10px] text-fg-muted tracking-wider uppercase">Classroom Grammar Game</p>
          </div>
        </div>

        <button
          onClick={toggleSound}
          className="p-3 rounded-xl border border-line hover:border-line bg-subtle text-fg-muted hover:text-fg transition-all cursor-pointer"
          title={soundEnabled ? "Mute Sounds" : "Enable Sounds"}
        >
          {soundEnabled ? <Music className="w-5 h-5 text-cyan-700 dark:text-cyan-400" /> : <VolumeX className="w-5 h-5 text-fg-muted" />}
        </button>
      </header>

      {/* Main Content */}
      <main className="relative w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 my-auto py-8 z-10">
        
        {/* Left Side: Setup & Settings */}
        <section className="lg:col-span-7 flex flex-col gap-6">
          <div className="glass-panel rounded-xl p-8 border border-line shadow-sm">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-cyan-700 dark:text-cyan-400">
              <Users className="w-6 h-6" />
              <span>Team Setup</span>
              <span className="text-sm font-normal text-fg-muted ml-auto">
                {teams.length} {teams.length === 1 ? "team" : "teams"} registered
              </span>
            </h2>

            {/* Add Team Form */}
            <form onSubmit={handleAddTeam} className="flex flex-col gap-5 mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Enter Team Name (e.g., The Champions)..."
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    maxLength={25}
                    className="w-full h-12 bg-subtle border border-line rounded-xl px-4 text-fg placeholder:text-fg-muted focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={!newTeamName.trim()}
                  className="h-12 px-6 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:bg-subtle disabled:text-fg-muted disabled:border-line disabled:cursor-not-allowed text-zinc-950 font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm border border-cyan-400/20"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Team</span>
                </button>
              </div>

              {/* Color Chooser */}
              <div>
                <p className="text-xs text-fg-muted font-medium uppercase tracking-wider mb-2">Select Team Accent Color</p>
                <div className="flex flex-wrap gap-3">
                  {colorsList.map((colorKey) => {
                    const isActive = selectedColor === colorKey;
                    const theme = colorMap[colorKey];
                    return (
                      <button
                        key={colorKey}
                        type="button"
                        onClick={() => setSelectedColor(colorKey)}
                        className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                          isActive
                            ? `${theme.border} bg-zinc-900 scale-110 ring-2 ring-cyan-500/20`
                            : "border-line bg-subtle opacity-70 hover:opacity-100"
                        }`}
                      >
                        <span className={`w-4 h-4 rounded-md ${theme.solidBg} shadow-sm`} />
                      </button>
                    );
                  })}
                </div>
              </div>
            </form>

            {/* Registered Teams Grid */}
            <div className="border-t border-line pt-6">
              {teams.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 border border-dashed border-line rounded-xl bg-subtle text-fg-muted">
                  <Trophy className="w-8 h-8 mb-2 text-fg" />
                  <p className="text-sm">No teams added yet. Add at least two to start.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2">
                  {teams.map((team) => {
                    const theme = colorMap[team.color];
                    return (
                      <div
                        key={team.id}
                        className={`flex justify-between items-center p-3 rounded-xl border ${theme.bg} ${theme.border} transition-all duration-300`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-3 h-3 rounded-full ${theme.solidBg} `} />
                          <span className="font-semibold text-sm truncate max-w-[140px]">{team.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono text-fg-muted bg-subtle px-2 py-0.5 rounded border border-line">
                            ${team.balance}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeTeam(team.id)}
                            className="p-1 rounded-lg text-fg-muted hover:text-rose-700 dark:hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                            title="Remove Team"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Quick Settings Panel toggle */}
          <div className="glass-panel rounded-xl p-6 border border-line shadow-sm">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="w-full flex items-center justify-between text-left font-bold text-lg text-cyan-700 dark:text-cyan-400 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Settings2 className="w-5 h-5" />
                <span>Game Settings</span>
              </span>
              <span className="text-xs text-fg-muted font-normal underline hover:text-cyan-700 dark:hover:text-cyan-300">
                {showSettings ? "Hide Details" : "Show Details"}
              </span>
            </button>

            {showSettings && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-6 pt-6 border-t border-line animate-fadeIn">
                {/* Budget */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-fg-muted font-semibold uppercase tracking-wider">Starting Money</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-muted" />
                    <input
                      type="number"
                      min={100}
                      step={100}
                      max={10000}
                      value={settings.startingBudget}
                      onChange={(e) => updateSettings({ startingBudget: Number(e.target.value) })}
                      className="w-full h-10 bg-card border border-line rounded-xl pl-9 pr-4 text-fg text-sm focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>
                </div>

                {/* Min Increment */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-fg-muted font-semibold uppercase tracking-wider">Minimum Bid Increment</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-muted" />
                    <input
                      type="number"
                      min={10}
                      step={10}
                      max={500}
                      value={settings.minBidIncrement}
                      onChange={(e) => updateSettings({ minBidIncrement: Number(e.target.value) })}
                      className="w-full h-10 bg-card border border-line rounded-xl pl-9 pr-4 text-fg text-sm focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>
                </div>

                {/* Timer Duration */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-fg-muted font-semibold uppercase tracking-wider">Discussion Timer (Seconds)</label>
                  <input
                    type="number"
                    min={5}
                    step={5}
                    max={120}
                    value={settings.timerDuration}
                    onChange={(e) => updateSettings({ timerDuration: Number(e.target.value) })}
                    className="w-full h-10 bg-card border border-line rounded-xl px-4 text-fg text-sm focus:outline-none focus:border-cyan-500/50"
                  />
                </div>

                {/* Scoring Rules Mode */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-fg-muted font-semibold uppercase tracking-wider">Rule Style</label>
                  <div className="grid grid-cols-2 gap-2 p-1 bg-card border border-line rounded-xl h-10 items-center">
                    <button
                      type="button"
                      onClick={() => updateSettings({ scoringMode: "classic" })}
                      className={`text-xs font-semibold rounded-lg h-8 transition-colors cursor-pointer ${
                        settings.scoringMode === "classic"
                          ? "bg-cyan-500 text-zinc-950 shadow-md"
                          : "text-fg-muted hover:text-fg"
                      }`}
                    >
                      Classic Rules
                    </button>
                    <button
                      type="button"
                      onClick={() => updateSettings({ scoringMode: "cash" })}
                      className={`text-xs font-semibold rounded-lg h-8 transition-colors cursor-pointer ${
                        settings.scoringMode === "cash"
                          ? "bg-cyan-500 text-zinc-950 shadow-md"
                          : "text-fg-muted hover:text-fg"
                      }`}
                    >
                      Cash Rules
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Right Side: How to Play / Rules Sheet */}
        <section className="lg:col-span-5 flex flex-col gap-6">
          <div className="glass-panel rounded-xl p-8 border border-line shadow-sm flex flex-col h-full justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                <HelpCircle className="w-6 h-6" />
                <span>How to Play</span>
              </h2>

              <div className="flex flex-col gap-4 text-sm text-fg-muted leading-relaxed" dir="rtl">
                <div className="border-r-2 border-emerald-500/40 pr-3">
                  <h3 className="font-bold text-fg mb-1">הכנה למכירה 🔨</h3>
                  <p>הקבוצות מתחילות עם תקציב כספי (ברירת מחדל: $1,000) אותו הן מנהלות לכל אורך המשחק.</p>
                </div>

                <div className="border-r-2 border-cyan-500/40 pr-3">
                  <h3 className="font-bold text-fg mb-1">הצגת המשפט והתייעצות ⏱️</h3>
                  <p>הקרן את המשפט בכיתה. לקבוצות יש 30 שניות להתייעץ בלחש: האם המשפט נכון או לא נכון מבחינה דקדוקית?</p>
                </div>

                <div className="border-r-2 border-amber-500/40 pr-3">
                  <h3 className="font-bold text-fg mb-1">המכירה הפומבית 💰</h3>
                  <p>המורה מתחיל את המכירה ב-$50. נציגי הקבוצות מרימים ידיים ומציעים הצעות גבוהות יותר ($100, $150...). המשפט נמכר למציע הגבוה ביותר: &quot;Going once, going twice, SOLD!&quot;</p>
                </div>

                <div className="border-r-2 border-purple-500/40 pr-3">
                  <h3 className="font-bold text-fg mb-1">רגע האמת והניקוד 🏆</h3>
                  <p>המורה חושף את התשובה.
                     <br />
                     <strong className="text-emerald-700 dark:text-emerald-400">חוקים קלאסיים:</strong> משפט נכון שנקנה מחזיר את הכסף לקבוצה ומעניק לה נקודה. משפט שגוי גורם לקבוצה להפסיד את סכום ההצעה וללא נקודות.
                     <br />
                     <strong className="text-cyan-700 dark:text-cyan-400">חוקי כסף ישיר:</strong> משפט נכון שנקנה מזכה את הקבוצה בשווי ההצעה. משפט שגוי מוריד לקבוצה את שווי ההצעה מתקציבה.
                  </p>
                </div>
              </div>
            </div>

            {/* Launch Button */}
            <div className="mt-8 border-t border-line pt-6">
              <button
                type="button"
                onClick={handleStartGame}
                className="w-full h-14 text-zinc-950 font-bold rounded-xl flex items-center justify-center gap-3 transition-all duration-300 transform active:scale-95 cursor-pointer bg-cyan-500"
              >
                <Play className="w-6 h-6 fill-current text-fg" />
                <span className="text-lg">Start Game (Projector Mode)</span>
              </button>
              <p className="text-center text-xs text-fg-muted mt-3">
                Setup requires at least 2 teams. Max suggested: 8 teams.
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full max-w-6xl text-center text-xs text-fg-muted py-6 border-t border-line mt-10">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
          <p>© 2026 English Sentence Auction. Designed for teachers & schools.</p>
          <div className="flex items-center gap-1 text-cyan-500/60">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Adrenaline-fueled Grammar Practice</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
