"use client";

import React from "react";
import {
  Plus,
  Minus,
  Trophy,
  RotateCcw,
  Users,
  UserPlus,
  X,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Team {
  id: string;
  name: string;
  score: number;
  color: string;
}

export const TEAM_COLOR_PALETTES = [
  "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30",
  "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
  "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
  "bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30",
  "bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/30",
  "bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 border-cyan-500/30",
  "bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-500/30",
  "bg-pink-500/15 text-pink-700 dark:text-pink-400 border-pink-500/30",
];

interface ScoreboardProps {
  teams: Team[];
  onUpdateScore: (id: string, amount: number) => void;
  onAwardPoints: (id: string, points: number) => void;
  onRenameTeam: (id: string, newName: string) => void;
  onAddTeam: () => void;
  onRemoveTeam: (id: string) => void;
  onResetScores: () => void;
  currentPlacePoints: number;
  isProjector?: boolean;
  isLight?: boolean;
}

export function Scoreboard({
  teams,
  onUpdateScore,
  onAwardPoints,
  onRenameTeam,
  onAddTeam,
  onRemoveTeam,
  onResetScores,
  currentPlacePoints,
  isProjector = false,
  isLight = false,
}: ScoreboardProps) {
  const maxScore = Math.max(...teams.map((t) => t.score));
  const hasLeader = maxScore > 0;

  return (
    <div
      className={`w-full transition-all duration-300 ${
        isProjector
          ? "bg-subtle rounded-xl border border-line p-5 shadow-sm"
          : "bg-card rounded-xl border border-line p-6 shadow-sm"
      }`}
    >
      {/* Header controls */}
      <div
        className={`flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b ${
          isProjector
            ? "border-line"
            : "border-line"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-xl ${
              isProjector
                ? "bg-subtle text-accent"
                : "bg-blue-50 text-blue-600 dark:bg-accent-soft dark:text-accent"
            }`}
          >
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2
              className={`text-lg md:text-xl font-bold font-sans tracking-tight ${
                isProjector
                  ? "text-fg"
                  : "text-fg"
              }`}
            >
              לוח ניקוד כיתתי
            </h2>
            <div
              className={`text-xs text-fg-muted`}
            >
              {teams.length} קבוצות פעילות • שווי המקום הנוכחי:{" "}
              <b className="text-accent font-bold">+{currentPlacePoints} נק׳</b>
            </div>
          </div>
        </div>

        {/* Action buttons: Add team & Reset */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onAddTeam}
            className={`text-xs flex items-center gap-1.5 h-9 px-3 font-semibold transition-all ${
              isProjector
                ? "bg-subtle text-fg border-line hover:bg-subtle"
                : "bg-subtle border-line hover:bg-subtle-hover text-fg hover:text-fg"
            }`}
          >
            <UserPlus className="w-4 h-4 text-accent" />
            <span>הוסף קבוצה</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onResetScores}
            className={`text-xs flex items-center gap-1.5 h-9 px-3 transition-colors ${
              isProjector
                ? "bg-transparent text-fg-muted border-line hover:bg-subtle hover:text-fg"
                : "border-line hover:bg-subtle text-fg-muted hover:text-fg"
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>איפוס ניקוד</span>
          </Button>
        </div>
      </div>

      {/* Grid of Teams */}
      <div
        className={`grid gap-4 ${
          teams.length <= 3
            ? "grid-cols-1 sm:grid-cols-3"
            : teams.length <= 4
            ? "grid-cols-2 md:grid-cols-4"
            : teams.length <= 6
            ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"
            : "grid-cols-2 sm:grid-cols-4 lg:grid-cols-8"
        }`}
      >
        {teams.map((team) => {
          const isLeader = hasLeader && team.score === maxScore;
          return (
            <div
              key={team.id}
              className={`relative flex flex-col justify-between p-4 rounded-xl border transition-all duration-300 ${
                isLeader
                  ? isProjector
                    ? "border-amber-400 bg-amber-500/10 ring-2 ring-amber-400/40"
                    : "border-amber-400 bg-amber-50/70 ring-2 ring-amber-400/30 shadow-md dark:border-amber-500/70 dark:bg-amber-500/5 dark:ring-amber-500/30"
                  : isProjector
                  ? "border-line bg-subtle hover:border-line"
                  : "border-line bg-subtle hover:border-line"
              }`}
            >
              {/* Leader Trophy */}
              {isLeader && (
                <div
                  className="absolute -top-3.5 right-3 text-black font-bold rounded-full px-2 py-0.5 text-[10px] shadow-sm flex items-center gap-1 animate-bounce bg-amber-500"
                  title="מובילים בטבלה!"
                >
                  <Trophy className="w-3 h-3 text-fg" />
                  <span>מובילים!</span>
                </div>
              )}

              {/* Remove Team Button (only if > 2 teams) */}
              {teams.length > 2 && (
                <button
                  type="button"
                  onClick={() => onRemoveTeam(team.id)}
                  title="הסר קבוצה זו"
                  className={`absolute -top-2 left-2 p-1 rounded-full border opacity-40 hover:opacity-100 transition-opacity bg-subtle-hover hover:bg-rose-100 hover:text-rose-600 border-line dark:hover:bg-rose-500/20 dark:hover:text-rose-400`}
                >
                  <X className="w-3 h-3" />
                </button>
              )}

              {/* Team Name Input */}
              <div className="w-full mt-1 mb-2">
                <input
                  type="text"
                  value={team.name}
                  onChange={(e) => onRenameTeam(team.id, e.target.value)}
                  className={`w-full text-center text-sm font-bold bg-transparent border-b border-transparent hover:border-inherit focus:border-accent focus:outline-none px-1 pb-0.5 rounded transition-colors text-fg`}
                />
              </div>

              {/* Score Number Display */}
              <div
                className={`text-3xl md:text-4xl font-bold my-2 py-2 px-3 rounded-xl font-mono text-center transition-all ${team.color} ${
                  isLeader ? "scale-105" : ""
                }`}
              >
                {team.score}
              </div>

              {/* Action 1: Quick Award Difficulty Points Button */}
              <div className="mt-2 w-full">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => onAwardPoints(team.id, currentPlacePoints)}
                  className="w-full h-8 text-xs font-bold text-white shadow-sm flex items-center justify-center gap-1.5 transition-transform active:scale-95 bg-emerald-600"
                  title={`הוסף +${currentPlacePoints} נק׳ לקבוצה זו`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>+{currentPlacePoints} נק׳</span>
                </Button>
              </div>

              {/* Action 2: Incremental +/- adjustments */}
              <div className="flex items-center gap-1.5 mt-2 w-full">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onUpdateScore(team.id, -1)}
                  className={`h-7 flex-1 border transition-colors ${
                    isProjector
                      ? "border-line hover:bg-rose-500/20 hover:text-rose-700 dark:hover:text-rose-400 text-fg-muted"
                      : "border-line hover:bg-rose-50 hover:text-rose-600 text-fg-muted dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
                  }`}
                  title="הורד 1 נקודה"
                >
                  <Minus className="w-3.5 h-3.5" />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onUpdateScore(team.id, 1)}
                  className={`h-7 flex-1 border transition-colors ${
                    isProjector
                      ? "border-line hover:bg-emerald-500/20 hover:text-emerald-700 dark:hover:text-emerald-400 text-fg-muted"
                      : "border-line hover:bg-emerald-50 hover:text-emerald-600 text-fg-muted dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400"
                  }`}
                  title="הוסף 1 נקודה"
                >
                  <Plus className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
