"use client";

import React, { useState } from "react";
import { Plus, Minus, Trophy, RotateCcw, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Team {
  id: string;
  name: string;
  score: number;
  color: string;
}

export function Scoreboard() {
  const [teams, setTeams] = useState<Team[]>([
    { id: "1", name: "קבוצה א'", score: 0, color: "bg-blue-500/10 text-blue-500 border-blue-500/30 dark:bg-blue-500/20" },
    { id: "2", name: "קבוצה ב'", score: 0, color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30 dark:bg-emerald-500/20" },
    { id: "3", name: "קבוצה ג'", score: 0, color: "bg-amber-500/10 text-amber-500 border-amber-500/30 dark:bg-amber-500/20" },
    { id: "4", name: "קבוצה ד'", score: 0, color: "bg-rose-500/10 text-rose-500 border-rose-500/30 dark:bg-rose-500/20" },
  ]);

  const updateScore = (id: string, amount: number) => {
    setTeams((prev) =>
      prev.map((team) =>
        team.id === id ? { ...team, score: Math.max(0, team.score + amount) } : team
      )
    );
  };

  const renameTeam = (id: string, newName: string) => {
    setTeams((prev) =>
      prev.map((team) => (team.id === id ? { ...team, name: newName } : team))
    );
  };

  const resetScores = () => {
    setTeams((prev) => prev.map((team) => ({ ...team, score: 0 })));
  };

  const maxScore = Math.max(...teams.map((t) => t.score));
  const hasLeader = maxScore > 0;

  return (
    <div className="w-full bg-card/65 backdrop-blur-md rounded-2xl border border-border-custom p-6 shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-6 border-b border-border-custom pb-4">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6 text-enrichment" />
          <h2 className="text-xl font-bold font-sans tracking-tight text-white">לוח ניקוד כיתתי</h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={resetScores}
          className="text-xs flex items-center gap-1.5 h-8 border-border-custom hover:bg-surface-hover text-text-muted hover:text-white"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          איפוס
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {teams.map((team) => {
          const isLeader = hasLeader && team.score === maxScore;
          return (
            <div
              key={team.id}
              className={`relative flex flex-col items-center p-4 rounded-xl border transition-all duration-300 ${
                isLeader
                  ? "border-amber-500 ring-2 ring-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                  : "border-border-custom hover:border-border-custom-hover"
              } bg-surface/50`}
            >
              {isLeader && (
                <div className="absolute -top-3 right-3 bg-amber-500 text-white rounded-full p-1 shadow-md animate-bounce">
                  <Trophy className="w-3.5 h-3.5" />
                </div>
              )}

              <input
                type="text"
                value={team.name}
                onChange={(e) => renameTeam(team.id, e.target.value)}
                className="w-full text-center text-sm font-semibold mb-2 bg-transparent border-b border-transparent hover:border-border-custom focus:border-enrichment focus:outline-none px-1 pb-0.5 rounded transition-colors text-white"
              />

              <div
                className={`text-4xl font-extrabold my-2 py-1 px-4 rounded-lg font-mono ${team.color} min-w-[70px] text-center`}
              >
                {team.score}
              </div>

              <div className="flex gap-2 mt-2 w-full">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateScore(team.id, -1)}
                  className="h-8 flex-1 border-border-custom hover:bg-rose-500/10 hover:text-rose-500 text-text-muted"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateScore(team.id, 1)}
                  className="h-8 flex-1 border-border-custom hover:bg-emerald-500/10 hover:text-emerald-500 text-text-muted"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
