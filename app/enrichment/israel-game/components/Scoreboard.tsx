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
  "bg-blue-500/15 text-blue-400 border-blue-500/30",
  "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  "bg-amber-500/15 text-amber-400 border-amber-500/30",
  "bg-rose-500/15 text-rose-400 border-rose-500/30",
  "bg-purple-500/15 text-purple-400 border-purple-500/30",
  "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
  "bg-orange-500/15 text-orange-400 border-orange-500/30",
  "bg-pink-500/15 text-pink-400 border-pink-500/30",
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
          ? "bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-5 shadow-2xl"
          : isLight
          ? "bg-white rounded-3xl border border-zinc-200 p-6 shadow-sm"
          : "bg-surface/60 backdrop-blur-md rounded-3xl border border-border-custom p-6 shadow-xl"
      }`}
    >
      {/* Header controls */}
      <div
        className={`flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b ${
          isProjector
            ? "border-white/10"
            : isLight
            ? "border-zinc-200"
            : "border-border-custom"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-xl ${
              isProjector
                ? "bg-white/10 text-enrichment"
                : isLight
                ? "bg-blue-50 text-blue-600"
                : "bg-enrichment/10 text-enrichment"
            }`}
          >
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2
              className={`text-lg md:text-xl font-black font-sans tracking-tight ${
                isProjector
                  ? "text-white"
                  : isLight
                  ? "text-zinc-900"
                  : "text-white"
              }`}
            >
              לוח ניקוד כיתתי
            </h2>
            <div
              className={`text-xs ${
                isLight ? "text-zinc-500" : "text-text-muted"
              }`}
            >
              {teams.length} קבוצות פעילות • שווי המקום הנוכחי:{" "}
              <b className="text-enrichment font-bold">+{currentPlacePoints} נק׳</b>
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
                ? "bg-white/10 text-white border-white/20 hover:bg-white/20"
                : isLight
                ? "bg-zinc-100 border-zinc-300 hover:bg-zinc-200 text-zinc-800"
                : "border-border-custom hover:bg-surface-hover text-text-muted hover:text-white"
            }`}
          >
            <UserPlus className="w-4 h-4 text-enrichment" />
            <span>הוסף קבוצה</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onResetScores}
            className={`text-xs flex items-center gap-1.5 h-9 px-3 transition-colors ${
              isProjector
                ? "bg-transparent text-white/70 border-white/20 hover:bg-white/10 hover:text-white"
                : isLight
                ? "border-zinc-300 hover:bg-zinc-100 text-zinc-600"
                : "border-border-custom hover:bg-surface-hover text-text-muted hover:text-white"
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
              className={`relative flex flex-col justify-between p-4 rounded-2xl border transition-all duration-300 ${
                isLeader
                  ? isProjector
                    ? "border-amber-400 bg-amber-500/10 ring-2 ring-amber-400/40 shadow-[0_0_20px_rgba(245,158,11,0.25)]"
                    : isLight
                    ? "border-amber-400 bg-amber-50/70 ring-2 ring-amber-400/30 shadow-md"
                    : "border-amber-500/70 bg-amber-500/5 ring-2 ring-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                  : isProjector
                  ? "border-white/10 bg-white/5 hover:border-white/20"
                  : isLight
                  ? "border-zinc-200 bg-zinc-50 hover:border-zinc-300"
                  : "border-border-custom bg-surface/40 hover:border-border-custom-hover"
              }`}
            >
              {/* Leader Trophy */}
              {isLeader && (
                <div
                  className="absolute -top-3.5 right-3 bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-extrabold rounded-full px-2 py-0.5 text-[10px] shadow-lg flex items-center gap-1 animate-bounce"
                  title="מובילים בטבלה!"
                >
                  <Trophy className="w-3 h-3 text-black" />
                  <span>מובילים!</span>
                </div>
              )}

              {/* Remove Team Button (only if > 2 teams) */}
              {teams.length > 2 && (
                <button
                  type="button"
                  onClick={() => onRemoveTeam(team.id)}
                  title="הסר קבוצה זו"
                  className={`absolute -top-2 left-2 p-1 rounded-full border opacity-40 hover:opacity-100 transition-opacity ${
                    isLight
                      ? "bg-zinc-200 hover:bg-rose-100 hover:text-rose-600 border-zinc-300"
                      : "bg-surface hover:bg-rose-500/20 hover:text-rose-400 border-border-custom"
                  }`}
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
                  className={`w-full text-center text-sm font-bold bg-transparent border-b border-transparent hover:border-inherit focus:border-enrichment focus:outline-none px-1 pb-0.5 rounded transition-colors ${
                    isLight ? "text-zinc-900" : "text-white"
                  }`}
                />
              </div>

              {/* Score Number Display */}
              <div
                className={`text-3xl md:text-4xl font-black my-2 py-2 px-3 rounded-xl font-mono text-center transition-all ${team.color} ${
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
                  className="w-full h-8 text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-sm flex items-center justify-center gap-1.5 transition-transform active:scale-95"
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
                      ? "border-white/10 hover:bg-rose-500/20 hover:text-rose-400 text-white/60"
                      : isLight
                      ? "border-zinc-300 hover:bg-rose-50 hover:text-rose-600 text-zinc-600"
                      : "border-border-custom hover:bg-rose-500/10 hover:text-rose-400 text-text-muted"
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
                      ? "border-white/10 hover:bg-emerald-500/20 hover:text-emerald-400 text-white/60"
                      : isLight
                      ? "border-zinc-300 hover:bg-emerald-50 hover:text-emerald-600 text-zinc-600"
                      : "border-border-custom hover:bg-emerald-500/10 hover:text-emerald-400 text-text-muted"
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
