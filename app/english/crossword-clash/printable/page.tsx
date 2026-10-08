"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Printer, ArrowLeft } from "lucide-react";
import { loadActiveGame } from "@/lib/crossword/game-storage";
import { PRESET_PACKS } from "@/lib/crossword/presets";
import { generateCrosswordGrid } from "@/lib/crossword/generator";
import { GameState } from "@/lib/crossword/types";

export default function CrosswordPrintablePage() {
  const [gameState, setGameState] = useState<GameState | null>(null);

  useEffect(() => {
    const loaded = loadActiveGame();
    if (loaded) {
      setGameState(loaded);
    } else {
      // Fallback grid if opened directly
      const fallback = PRESET_PACKS[0];
      const grid = generateCrosswordGrid(fallback.words, 8, 10);
      setGameState({
        id: "demo",
        title: "Crossword Clash",
        topic: fallback.name,
        mode: "simultaneous",
        grid,
        teams: [],
        currentTeamIndex: 0,
        roundNumber: 1,
        isTimerRunning: false,
        timeLeft: 0,
        isGameOver: false,
        settings: {
          roundTimerSeconds: 90,
          pointsPerCorrect: 10,
          penaltyPerWrong: -5,
          wordCompletionBonus: 30,
          allLettersBonus: 20,
          showHebrewHints: true
        }
      });
    }
  }, []);

  if (!gameState) {
    return <div className="p-8 text-center font-sans">Loading printable worksheet...</div>;
  }

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-white text-black p-6 font-sans print:p-0" dir="ltr">
      {/* Screen Toolbar (hidden in print) */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <Link
          href="/english/crossword-clash/play"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-xs font-bold transition-all text-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>חזרה למשחק</span>
        </Link>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>הדפס דף עבודה (Print Worksheet)</span>
        </button>
      </div>

      {/* Printable Sheet Container */}
      <div className="max-w-3xl mx-auto border border-black/20 p-6 md:p-8 rounded-xl print:border-none print:p-0" dir="ltr">
        {/* Header */}
        <div className="border-b-2 border-black pb-4 mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-black tracking-tight uppercase">CROSSWORD CLASH</h1>
            <p className="text-sm font-semibold text-slate-600">
              Classroom Vocabulary Challenge • Topic: {gameState.topic}
            </p>
          </div>

          <div className="text-right text-xs space-y-1">
            <p>
              <strong>Group / Team Name:</strong> ____________________
            </p>
            <p>
              <strong>Date:</strong> ____________________
            </p>
          </div>
        </div>

        {/* The 8x10 Grid */}
        <div className="flex justify-center mb-6">
          <div
            dir="ltr"
            className="inline-grid gap-0 border-2 border-black"
            style={{
              gridTemplateColumns: `repeat(${gameState.grid.cols}, minmax(0, 1fr))`
            }}
          >
            {gameState.grid.cells.map((row, r) =>
              row.map((cell, c) => {
                if (!cell.isActive) {
                  return (
                    <div
                      key={`${r}-${c}`}
                      className="w-10 h-10 md:w-12 md:h-12 bg-black border border-black"
                    />
                  );
                }

                return (
                  <div
                    key={`${r}-${c}`}
                    className="w-10 h-10 md:w-12 md:h-12 border border-black relative flex items-center justify-center bg-white"
                  >
                    {cell.number && (
                      <span className="absolute top-0.5 left-1 text-[10px] font-bold leading-none text-black">
                        {cell.number}
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Group Rack Section for Students */}
        <div className="mb-6 p-3 border-2 border-dashed border-black/40 rounded-lg text-center" dir="ltr">
          <p className="text-xs font-bold mb-2 uppercase tracking-wide">
            Your Group&apos;s 5 Letters (אותיות הקבוצה לסיבוב זה):
          </p>
          <div className="flex justify-center gap-2" dir="ltr">
            {[1, 2, 3, 4, 5].map(i => (
              <div
                key={i}
                className="w-9 h-9 border-2 border-black rounded flex items-center justify-center font-bold text-base"
              />
            ))}
          </div>
        </div>

        {/* Clues */}
        <div className="grid grid-cols-2 gap-6 text-xs text-left" dir="ltr">
          {/* Across */}
          <div>
            <h3 className="font-bold border-b border-black pb-1 mb-2 uppercase text-sm">
              Across (מאוזן)
            </h3>
            <div className="space-y-2">
              {gameState.grid.words
                .filter(w => w.direction === "across")
                .map(w => (
                  <div key={w.id} className="leading-tight">
                    <strong>{w.number}.</strong> {w.clue} ({w.word.length} letters)
                  </div>
                ))}
            </div>
          </div>

          {/* Down */}
          <div>
            <h3 className="font-bold border-b border-black pb-1 mb-2 uppercase text-sm">
              Down (מאונך)
            </h3>
            <div className="space-y-2">
              {gameState.grid.words
                .filter(w => w.direction === "down")
                .map(w => (
                  <div key={w.id} className="leading-tight">
                    <strong>{w.number}.</strong> {w.clue} ({w.word.length} letters)
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
