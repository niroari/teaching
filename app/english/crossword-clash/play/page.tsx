"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Trophy,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Printer,
  ChevronRight,
  Shuffle,
  Award,
  Layers,
  Check,
  Plus,
  Minus,
  AlertCircle,
  Volume1
} from "lucide-react";
import { colorMap } from "@/lib/colors";
import { sounds } from "@/lib/sounds";
import { loadActiveGame, saveActiveGame } from "@/lib/crossword/game-storage";
import { dealTeamRack, isWordSolved } from "@/lib/crossword/generator";
import {
  CrosswordGrid,
  CrosswordWord,
  CrosswordCell,
  GameState,
  Team,
  PlacedTile
} from "@/lib/crossword/types";

export default function CrosswordClashPlayPage() {
  const router = useRouter();

  // Comfort Reading Mode
  const [comfortMode, setComfortMode] = useState<"dark" | "light">("dark");
  useEffect(() => {
    const stored = localStorage.getItem("teaching-site-comfort-mode");
    if (stored === "dark" || stored === "light") {
      setComfortMode(stored);
    }
  }, []);

  const toggleComfortMode = () => {
    const next = comfortMode === "dark" ? "light" : "dark";
    setComfortMode(next);
    localStorage.setItem("teaching-site-comfort-mode", next);
  };
  const isLight = comfortMode === "light";

  // Audio state
  const [soundEnabled, setSoundEnabled] = useState(true);
  const toggleSound = () => {
    const next = sounds.toggle();
    setSoundEnabled(next);
  };

  // Game State
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [activeWordId, setActiveWordId] = useState<string | null>(null);

  // Active Team Letter Interaction
  const [selectedRackIndex, setSelectedRackIndex] = useState<number | null>(null);
  const [activeTeamId, setActiveTeamId] = useState<string>("");

  // Placements made in the current turn/round
  // Map of "r,c" => { letter, rackIndex, teamId }
  const [turnPlacements, setTurnPlacements] = useState<
    Record<string, { letter: string; rackIndex: number; teamId: string }>
  >({});

  // Turn Feedback Banner / Toast
  const [turnFeedback, setTurnFeedback] = useState<{
    type: "success" | "penalty" | "word";
    message: string;
    points: number;
  } | null>(null);

  // Timer Ref
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Manual Score Adjustment Modal
  const [scoreAdjustTeam, setScoreAdjustTeam] = useState<Team | null>(null);

  // Load Game on Mount
  useEffect(() => {
    const loaded = loadActiveGame();
    if (!loaded) {
      router.push("/english/crossword-clash");
      return;
    }
    setGameState(loaded);
    if (loaded.teams.length > 0) {
      setActiveTeamId(loaded.teams[loaded.currentTeamIndex || 0].id);
    }
  }, [router]);

  // Sync game state to localStorage
  useEffect(() => {
    if (gameState) {
      saveActiveGame(gameState);
    }
  }, [gameState]);

  // Timer Countdown Effect
  useEffect(() => {
    if (!gameState || !gameState.isTimerRunning || gameState.timeLeft <= 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setGameState(prev => {
        if (!prev) return null;
        if (prev.timeLeft <= 1) {
          // Timer finished
          sounds.playBuzzer();
          return { ...prev, timeLeft: 0, isTimerRunning: false };
        }
        if (prev.timeLeft <= 5) {
          sounds.playTick();
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState?.isTimerRunning, gameState?.timeLeft]);

  if (!gameState) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
        <p>Loading game arena...</p>
      </div>
    );
  }

  const currentTeam =
    gameState.teams.find(t => t.id === activeTeamId) ||
    gameState.teams[gameState.currentTeamIndex] ||
    gameState.teams[0];

  const currentTeamTheme = colorMap[currentTeam.color] || colorMap.sky;

  // Speak word aloud using Web Speech API
  const speakWord = (word: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = "en-US";
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.error("Speech synthesis error:", e);
      }
    }
  };

  // Toggle Timer
  const toggleTimer = () => {
    setGameState(prev => {
      if (!prev) return null;
      return { ...prev, isTimerRunning: !prev.isTimerRunning };
    });
  };

  const resetTimer = () => {
    setGameState(prev => {
      if (!prev) return null;
      return {
        ...prev,
        timeLeft: prev.settings.roundTimerSeconds || 90,
        isTimerRunning: true
      };
    });
  };

  // Handle clicking a letter tile in the rack
  const handleRackTileClick = (index: number) => {
    sounds.playPop();
    if (selectedRackIndex === index) {
      setSelectedRackIndex(null);
    } else {
      setSelectedRackIndex(index);
    }
  };

  // Handle clicking a grid cell
  const handleCellClick = (r: number, c: number) => {
    const cell = gameState.grid.cells[r][c];
    if (!cell.isActive) return;

    setSelectedCell({ row: r, col: c });
    sounds.playPop();

    // Select the active word associated with this cell
    const wordId = cell.acrossWordId || cell.downWordId || null;
    if (wordId) {
      setActiveWordId(wordId);
    }

    // If cell is already permanently revealed, do nothing further
    if (cell.isRevealed) return;

    const cellKey = `${r},${c}`;

    // If this cell already has a placed tile from this turn, remove it
    if (turnPlacements[cellKey]) {
      const removed = turnPlacements[cellKey];
      const updated = { ...turnPlacements };
      delete updated[cellKey];
      setTurnPlacements(updated);
      setSelectedRackIndex(removed.rackIndex);
      return;
    }

    // If a rack tile is currently selected, place it here!
    if (selectedRackIndex !== null) {
      const activePlacingTeam = gameState.teams.find(t => t.id === activeTeamId) || currentTeam;
      const letter = activePlacingTeam.rack[selectedRackIndex];
      if (!letter) return;

      setTurnPlacements({
        ...turnPlacements,
        [cellKey]: {
          letter,
          rackIndex: selectedRackIndex,
          teamId: activePlacingTeam.id
        }
      });
      setSelectedRackIndex(null);
    }
  };

  // Submit Move / End Turn / Check Round (Unified for Simultaneous & Turn-by-Turn)
  const handleSubmitTurn = () => {
    const placedKeys = Object.keys(turnPlacements);
    if (placedKeys.length === 0) {
      alert("אנא הניחו לפחות אות אחת בלוח לפני הבדיקה!");
      return;
    }

    const newGridCells = gameState.grid.cells.map(row => row.map(cell => ({ ...cell })));
    let totalCorrect = 0;
    let totalWrong = 0;

    // Track per-team results: teamId -> stats
    const teamTurnStats: Record<
      string,
      { correct: number; wrong: number; usedIndices: number[]; wordsCompleted: number }
    > = {};

    gameState.teams.forEach(t => {
      teamTurnStats[t.id] = { correct: 0, wrong: 0, usedIndices: [], wordsCompleted: 0 };
    });

    placedKeys.forEach(key => {
      const [rStr, cStr] = key.split(",");
      const r = parseInt(rStr, 10);
      const c = parseInt(cStr, 10);
      const placement = turnPlacements[key];
      const targetCell = newGridCells[r][c];
      const stats = teamTurnStats[placement.teamId] || {
        correct: 0,
        wrong: 0,
        usedIndices: [],
        wordsCompleted: 0
      };

      stats.usedIndices.push(placement.rackIndex);

      if (targetCell.letter.toUpperCase() === placement.letter.toUpperCase()) {
        stats.correct++;
        totalCorrect++;
        targetCell.isRevealed = true;
        targetCell.revealedByTeamId = placement.teamId;
      } else {
        stats.wrong++;
        totalWrong++;
      }
      teamTurnStats[placement.teamId] = stats;
    });

    // Check for newly solved words
    const updatedWords = gameState.grid.words.map(w => ({ ...w }));
    let newWordsCompletedCount = 0;
    const tempGrid: CrosswordGrid = { ...gameState.grid, cells: newGridCells };

    updatedWords.forEach(w => {
      if (!w.solved && isWordSolved(tempGrid, w)) {
        w.solved = true;
        newWordsCompletedCount++;
        speakWord(w.word);

        // Find which team placed letters in this newly completed word
        const contributingKey = placedKeys.find(key => {
          const [rStr, cStr] = key.split(",");
          const r = parseInt(rStr, 10);
          const c = parseInt(cStr, 10);
          if (w.direction === "across") {
            return r === w.row && c >= w.col && c < w.col + w.word.length;
          } else {
            return c === w.col && r === w.row && r < w.row + w.word.length;
          }
        });

        if (contributingKey) {
          const tid = turnPlacements[contributingKey].teamId;
          if (teamTurnStats[tid]) {
            teamTurnStats[tid].wordsCompleted++;
          }
        }
      }
    });

    // Update each team
    const updatedTeams = gameState.teams.map(t => {
      const stats = teamTurnStats[t.id];
      if (!stats || stats.usedIndices.length === 0) {
        return t;
      }

      const ptsCorrect = stats.correct * gameState.settings.pointsPerCorrect;
      const ptsPenalty = stats.wrong * gameState.settings.penaltyPerWrong;
      const ptsWordBonus = stats.wordsCompleted * gameState.settings.wordCompletionBonus;
      const allRackBonus =
        stats.usedIndices.length === 5 && stats.wrong === 0
          ? gameState.settings.allLettersBonus
          : 0;
      const delta = ptsCorrect + ptsPenalty + ptsWordBonus + allRackBonus;

      const remainingRack = t.rack.filter((_, idx) => !stats.usedIndices.includes(idx));
      const freshRack = dealTeamRack(tempGrid, remainingRack);

      return {
        ...t,
        score: Math.max(0, t.score + delta),
        wordsCompleted: t.wordsCompleted + stats.wordsCompleted,
        stats: {
          correctLetters: t.stats.correctLetters + stats.correct,
          wrongLetters: t.stats.wrongLetters + stats.wrong
        },
        rack: freshRack
      };
    });

    // Audio and feedback
    if (newWordsCompletedCount > 0) {
      sounds.playWordComplete();
      setTurnFeedback({
        type: "word",
        message: `סיום סיבוב! הושלמו ${newWordsCompletedCount} מילים בהצלחה (+${
          newWordsCompletedCount * gameState.settings.wordCompletionBonus
        } נק׳ בונוס)!`,
        points: totalCorrect * gameState.settings.pointsPerCorrect
      });
    } else if (totalCorrect > 0) {
      sounds.playSuccess();
      setTurnFeedback({
        type: "success",
        message: `סיום סיבוב! ${totalCorrect} אותיות נכונות שובצו (${
          totalWrong > 0
            ? `הופחתו ${totalWrong * Math.abs(gameState.settings.penaltyPerWrong)} על שגויות`
            : ""
        })`,
        points:
          totalCorrect * gameState.settings.pointsPerCorrect -
          totalWrong * Math.abs(gameState.settings.penaltyPerWrong)
      });
    } else {
      sounds.playBuzzer();
      setTurnFeedback({
        type: "penalty",
        message: `אותיות שגויות! הופחתו נקודות.`,
        points: -totalWrong * Math.abs(gameState.settings.penaltyPerWrong)
      });
    }

    // Check if entire puzzle is solved
    const allSolved = newGridCells.every(row =>
      row.every(cell => !cell.isActive || cell.isRevealed)
    );

    if (allSolved) {
      sounds.playCheer();
      confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
    }

    let nextTeamIndex = gameState.currentTeamIndex;
    let nextRoundNumber = gameState.roundNumber;

    if (gameState.mode === "turn-by-turn") {
      nextTeamIndex = (gameState.currentTeamIndex + 1) % gameState.teams.length;
      if (nextTeamIndex === 0) {
        nextRoundNumber += 1;
      }
    } else {
      nextRoundNumber += 1;
    }

    setGameState({
      ...gameState,
      grid: {
        ...gameState.grid,
        cells: newGridCells,
        words: updatedWords
      },
      teams: updatedTeams,
      currentTeamIndex: nextTeamIndex,
      roundNumber: nextRoundNumber,
      isGameOver: allSolved,
      timeLeft: gameState.settings.roundTimerSeconds || 90,
      isTimerRunning: gameState.settings.roundTimerSeconds > 0
    });

    if (gameState.mode === "turn-by-turn") {
      setActiveTeamId(updatedTeams[nextTeamIndex].id);
    }
    setTurnPlacements({});
    setSelectedRackIndex(null);

    setTimeout(() => {
      setTurnFeedback(null);
    }, 4000);
  };

  // Swap Rack for single active team
  const handleSwapRack = () => {
    if (confirm("האם להחליף את 5 האותיות ולהעביר את התור לקבוצה הבאה?")) {
      const refreshedRack = dealTeamRack(gameState.grid, []);
      const updatedTeams = gameState.teams.map((t, idx) => {
        if (idx === gameState.currentTeamIndex) {
          return { ...t, rack: refreshedRack };
        }
        return t;
      });

      const nextTeamIndex = (gameState.currentTeamIndex + 1) % gameState.teams.length;
      setGameState({
        ...gameState,
        teams: updatedTeams,
        currentTeamIndex: nextTeamIndex,
        timeLeft: gameState.settings.roundTimerSeconds || 90
      });
      setActiveTeamId(updatedTeams[nextTeamIndex].id);
      setTurnPlacements({});
      setSelectedRackIndex(null);
      sounds.playPop();
    }
  };

  // Swap racks for ALL teams (Simultaneous Mode)
  const handleSwapAllRacks = () => {
    if (confirm("האם לרענן את כל 5 האותיות עבור כל הקבוצות?")) {
      const updatedTeams = gameState.teams.map(t => ({
        ...t,
        rack: dealTeamRack(gameState.grid, [])
      }));
      setGameState({
        ...gameState,
        teams: updatedTeams,
        timeLeft: gameState.settings.roundTimerSeconds || 90
      });
      setTurnPlacements({});
      setSelectedRackIndex(null);
      sounds.playPop();
    }
  };

  // Teacher Tool: Reveal Hint for Selected Cell
  const handleTeacherRevealHint = () => {
    if (!selectedCell) {
      alert("אנא בחרו קודם משבצת בלוח כדי לגלות רמז.");
      return;
    }
    const { row, col } = selectedCell;
    const targetCell = gameState.grid.cells[row][col];
    if (!targetCell.isActive || targetCell.isRevealed) return;

    if (confirm(`המורה: האם לגלות את האות '${targetCell.letter}' לתלמידים כרמז?`)) {
      const newGridCells = gameState.grid.cells.map(r => r.map(c => ({ ...c })));
      newGridCells[row][col].isRevealed = true;
      newGridCells[row][col].revealedByTeamId = "teacher";

      // Check if word solved
      const updatedWords = gameState.grid.words.map(w => ({ ...w }));
      const tempGrid: CrosswordGrid = { ...gameState.grid, cells: newGridCells };
      updatedWords.forEach(w => {
        if (!w.solved && isWordSolved(tempGrid, w)) {
          w.solved = true;
          speakWord(w.word);
        }
      });

      setGameState({
        ...gameState,
        grid: {
          ...gameState.grid,
          cells: newGridCells,
          words: updatedWords
        }
      });
      sounds.playSuccess();
    }
  };

  // Manual Score Adjustment
  const handleAdjustScore = (teamId: string, delta: number) => {
    const updated = gameState.teams.map(t => {
      if (t.id === teamId) {
        return { ...t, score: Math.max(0, t.score + delta) };
      }
      return t;
    });
    setGameState({ ...gameState, teams: updated });
  };

  const activeWord = gameState.grid.words.find(w => w.id === activeWordId);

  // Check if a cell is highlighted (belongs to activeWord)
  const isCellInActiveWord = (r: number, c: number) => {
    if (!activeWord) return false;
    if (activeWord.direction === "across") {
      return (
        r === activeWord.row &&
        c >= activeWord.col &&
        c < activeWord.col + activeWord.word.length
      );
    } else {
      return (
        c === activeWord.col &&
        r >= activeWord.row &&
        r < activeWord.row + activeWord.word.length
      );
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 flex flex-col justify-between ${
        isLight ? "bg-slate-100 text-slate-900" : "bg-zinc-950 text-zinc-100"
      }`}
    >
      {/* Top Navbar */}
      <header
        className={`border-b sticky top-0 z-30 backdrop-blur-md px-6 py-3 transition-colors ${
          isLight ? "bg-white/90 border-slate-200" : "bg-zinc-900/90 border-zinc-800"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/english/crossword-clash"
              className={`p-2 rounded-xl border transition-all ${
                isLight
                  ? "bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700"
                  : "bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300"
              }`}
              title="חזרה להגדרות"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm tracking-wide bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                  CROSSWORD CLASH
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-semibold">
                  סיבוב {gameState.roundNumber}
                </span>
                <span className="text-xs text-zinc-500">• {gameState.topic}</span>
              </div>
            </div>
          </div>

          {/* Quick Classroom Toolbar */}
          <div className="flex items-center gap-2">
            {/* Teacher Reveal Hint */}
            <button
              onClick={handleTeacherRevealHint}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isLight
                  ? "bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-800"
                  : "bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-300"
              }`}
              title="גלה אות רמז למשבצת הנבחרת"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>רמז מורה</span>
            </button>

            {/* Printable Student Worksheet */}
            <Link
              href="/english/crossword-clash/printable"
              target="_blank"
              className={`p-2 rounded-xl border transition-all text-xs font-bold flex items-center gap-1.5 ${
                isLight
                  ? "bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700"
                  : "bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300"
              }`}
              title="הדפס דף עבודה לתלמידים"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">דף לתלמיד</span>
            </Link>

            {/* Audio Toggle */}
            <button
              onClick={toggleSound}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isLight
                  ? "bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700"
                  : "bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300"
              }`}
              title={soundEnabled ? "השתק" : "הפעל צליל"}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-cyan-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-zinc-500" />
              )}
            </button>

            {/* Comfort Mode */}
            <button
              onClick={toggleComfortMode}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isLight
                  ? "bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700"
                  : "bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300"
              }`}
              title="Comfort Reading Mode"
            >
              {isLight ? <Moon className="w-4 h-4 text-indigo-500" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 py-4 w-full flex-1 flex flex-col gap-4">
        {/* Teams Scoreboard Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {gameState.teams.map((team, idx) => {
            const theme = colorMap[team.color] || colorMap.sky;
            const isTurn = team.id === currentTeam.id;

            return (
              <div
                key={team.id}
                onClick={() => {
                  if (gameState.mode === "simultaneous") {
                    setActiveTeamId(team.id);
                  }
                }}
                className={`p-2.5 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden ${
                  isTurn
                    ? `${theme.border} ${theme.bg} shadow-lg scale-[1.02]`
                    : isLight
                    ? "bg-white border-slate-200 opacity-80"
                    : "bg-zinc-900/60 border-zinc-800 opacity-80"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-6 h-6 rounded-lg ${theme.solidBg} flex items-center justify-center text-white text-xs font-bold`}
                    >
                      {idx + 1}
                    </div>
                    <span className="font-bold text-xs truncate max-w-[85px]">{team.name}</span>
                  </div>
                  <span className="font-black text-sm text-cyan-400">{team.score}</span>
                </div>

                <div className="flex items-center justify-between text-[10px] text-zinc-500 mt-1">
                  <span>מילים: {team.wordsCompleted}</span>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      setScoreAdjustTeam(team);
                    }}
                    className="hover:text-zinc-300 px-1 py-0.5 rounded"
                    title="עדכן ניקוד ידנית"
                  >
                    ⚖️
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feedback Alert Toast */}
        {turnFeedback && (
          <div
            className={`px-4 py-2.5 rounded-2xl border flex items-center justify-between text-xs font-bold transition-all shadow-md animate-in fade-in slide-in-from-top-2 ${
              turnFeedback.type === "word"
                ? "bg-amber-500/15 border-amber-500/40 text-amber-300"
                : turnFeedback.type === "penalty"
                ? "bg-rose-500/15 border-rose-500/40 text-rose-300"
                : "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
            }`}
          >
            <div className="flex items-center gap-2">
              {turnFeedback.type === "word" ? (
                <Award className="w-4 h-4 text-amber-400" />
              ) : turnFeedback.type === "penalty" ? (
                <XCircle className="w-4 h-4 text-rose-400" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              )}
              <span>{turnFeedback.message}</span>
            </div>
            <span className="text-sm font-black">
              {turnFeedback.points > 0 ? `+${turnFeedback.points}` : turnFeedback.points} נק׳
            </span>
          </div>
        )}

        {/* Board & Clues Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
          {/* Left/Center: 8x10 Crossword Grid (8 cols on lg) */}
          <div
            dir="ltr"
            className={`lg:col-span-7 p-4 md:p-6 rounded-3xl border flex flex-col items-center justify-center transition-all ${
              isLight ? "bg-white border-slate-200 shadow-sm" : "bg-zinc-900/60 border-zinc-800"
            }`}
          >
            {/* Active Selected Clue Highlight Header */}
            {activeWord ? (
              <div
                dir="ltr"
                className={`w-full mb-4 px-4 py-2.5 rounded-2xl border flex items-center justify-between text-xs text-left ${
                  isLight ? "bg-indigo-50 border-indigo-200" : "bg-indigo-950/30 border-indigo-500/30"
                }`}
              >
                <div className="flex items-center gap-2 text-left">
                  <span className="font-bold text-indigo-400 shrink-0">
                    {activeWord.number} {activeWord.direction === "across" ? "Across" : "Down"}:
                  </span>
                  <span className="font-semibold">{activeWord.clue}</span>
                </div>
                <button
                  onClick={() => speakWord(activeWord.word)}
                  className="p-1 rounded-lg hover:bg-indigo-500/20 text-indigo-400 transition-colors shrink-0"
                  title="הקרא הגדרה באנגלית"
                >
                  <Volume1 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="w-full mb-4 text-center text-xs text-zinc-500">
                לחצו על משבצת או הגדרה כדי לראות את המילה המתאימה בלוח
              </div>
            )}

            {/* The Grid Matrix */}
            <div
              dir="ltr"
              className="inline-grid gap-1.5 p-3 rounded-2xl bg-zinc-950/20 border border-zinc-500/10 select-none"
              style={{
                gridTemplateColumns: `repeat(${gameState.grid.cols}, minmax(0, 1fr))`
              }}
            >
              {gameState.grid.cells.map((row, r) =>
                row.map((cell, c) => {
                  const cellKey = `${r},${c}`;
                  const isSelected = selectedCell?.row === r && selectedCell?.col === c;
                  const isHighlighted = isCellInActiveWord(r, c);
                  const placedTile = turnPlacements[cellKey];

                  if (!cell.isActive) {
                    return (
                      <div
                        key={cellKey}
                        className={`w-8 h-8 sm:w-11 sm:h-11 md:w-13 md:h-13 rounded-xl transition-all ${
                          isLight ? "bg-slate-200/60" : "bg-zinc-900/40"
                        }`}
                      />
                    );
                  }

                  // Team who revealed this cell
                  const revealingTeam = cell.revealedByTeamId
                    ? gameState.teams.find(t => t.id === cell.revealedByTeamId)
                    : null;
                  const revealingTheme = revealingTeam
                    ? colorMap[revealingTeam.color] || colorMap.sky
                    : null;

                  const placingTeam = placedTile
                    ? gameState.teams.find(t => t.id === placedTile.teamId)
                    : null;
                  const placingTheme = placingTeam
                    ? colorMap[placingTeam.color] || colorMap.sky
                    : null;

                  return (
                    <div
                      key={cellKey}
                      onClick={() => handleCellClick(r, c)}
                      className={`w-8 h-8 sm:w-11 sm:h-11 md:w-13 md:h-13 rounded-xl border-2 relative flex items-center justify-center font-black select-none cursor-pointer transition-all transform hover:scale-[1.04] ${
                        isSelected
                          ? "border-cyan-400 ring-2 ring-cyan-400/50"
                          : placedTile
                          ? `${placingTheme ? placingTheme.border : "border-amber-400"} ${
                              placingTheme ? placingTheme.bg : "bg-amber-500/20"
                            } animate-pulse`
                          : isHighlighted
                          ? "border-indigo-400/80 bg-indigo-500/15"
                          : isLight
                          ? "border-slate-300 bg-white hover:border-slate-400"
                          : "border-zinc-700 bg-zinc-900/80 hover:border-zinc-500"
                      }`}
                    >
                      {/* Cell Clue Number */}
                      {cell.number && (
                        <span className="absolute top-0.5 left-1 text-[9px] sm:text-[10px] font-bold text-zinc-500 leading-none">
                          {cell.number}
                        </span>
                      )}

                      {/* Team indicator for pending placed tile */}
                      {placedTile && placingTeam && (
                        <span
                          className={`absolute top-0.5 right-1 text-[8px] font-bold ${
                            placingTheme ? placingTheme.badge : "bg-amber-500/20 text-amber-300"
                          } px-1 rounded`}
                        >
                          ק{gameState.teams.indexOf(placingTeam) + 1}
                        </span>
                      )}

                      {/* Display Letter */}
                      {cell.isRevealed ? (
                        <span
                          className={`text-base sm:text-xl md:text-2xl font-black ${
                            revealingTheme ? revealingTheme.text : "text-emerald-400"
                          }`}
                        >
                          {cell.letter}
                        </span>
                      ) : placedTile ? (
                        <span
                          className={`text-base sm:text-xl md:text-2xl font-black ${
                            placingTheme ? placingTheme.text : "text-amber-300"
                          }`}
                        >
                          {placedTile.letter}
                        </span>
                      ) : null}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Clues List & Round Controls (5 cols on lg) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Clues Accordion Box */}
            <div
              dir="ltr"
              className={`p-4 rounded-3xl border flex-1 flex flex-col transition-all overflow-hidden text-left ${
                isLight ? "bg-white border-slate-200 shadow-sm" : "bg-zinc-900/60 border-zinc-800"
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b mb-3">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-indigo-400" />
                  <span className="font-bold text-sm">Clues (הגדרות התשבץ)</span>
                </div>
                <span className="text-xs text-zinc-500">
                  {gameState.grid.words.filter(w => w.solved).length} / {gameState.grid.words.length} solved
                </span>
              </div>

              <div className="space-y-4 overflow-y-auto max-h-[360px] pr-1" dir="ltr">
                {/* Across Clues */}
                <div>
                  <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2 text-left">
                    Across (מאוזן)
                  </h4>
                  <div className="space-y-2">
                    {gameState.grid.words
                      .filter(w => w.direction === "across")
                      .map(w => {
                        const isActive = activeWordId === w.id;
                        return (
                          <div
                            key={w.id}
                            dir="ltr"
                            onClick={() => {
                              setActiveWordId(w.id);
                              setSelectedCell({ row: w.row, col: w.col });
                              sounds.playPop();
                            }}
                            className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-start gap-2 text-left ${
                              isActive
                                ? "border-indigo-500 bg-indigo-500/15 font-semibold"
                                : w.solved
                                ? "border-emerald-500/20 bg-emerald-500/5 line-through opacity-70"
                                : isLight
                                ? "border-slate-200 hover:border-slate-300 bg-slate-50"
                                : "border-zinc-800 hover:border-zinc-700 bg-zinc-900/40"
                            }`}
                          >
                            <span className="font-bold text-indigo-400 shrink-0">{w.number}.</span>
                            <div className="flex-1 text-left">
                              <p className={w.solved ? "line-through text-zinc-500" : ""}>{w.clue}</p>
                            </div>
                            <span className="text-[10px] text-zinc-500 shrink-0">
                              ({w.word.length} letters)
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Down Clues */}
                <div>
                  <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2 text-left">
                    Down (מאונך)
                  </h4>
                  <div className="space-y-2">
                    {gameState.grid.words
                      .filter(w => w.direction === "down")
                      .map(w => {
                        const isActive = activeWordId === w.id;
                        return (
                          <div
                            key={w.id}
                            dir="ltr"
                            onClick={() => {
                              setActiveWordId(w.id);
                              setSelectedCell({ row: w.row, col: w.col });
                              sounds.playPop();
                            }}
                            className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-start gap-2 text-left ${
                              isActive
                                ? "border-cyan-500 bg-cyan-500/15 font-semibold"
                                : w.solved
                                ? "border-emerald-500/20 bg-emerald-500/5 line-through opacity-70"
                                : isLight
                                ? "border-slate-200 hover:border-slate-300 bg-slate-50"
                                : "border-zinc-800 hover:border-zinc-700 bg-zinc-900/40"
                            }`}
                          >
                            <span className="font-bold text-cyan-400 shrink-0">{w.number}.</span>
                            <div className="flex-1 text-left">
                              <p className={w.solved ? "line-through text-zinc-500" : ""}>{w.clue}</p>
                            </div>
                            <span className="text-[10px] text-zinc-500 shrink-0">
                              ({w.word.length} letters)
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>

            {/* Timer & Turn Controller */}
            {gameState.settings.roundTimerSeconds > 0 && (
              <div
                className={`p-4 rounded-3xl border flex items-center justify-between transition-all ${
                  isLight ? "bg-white border-slate-200" : "bg-zinc-900/60 border-zinc-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-lg ${
                      gameState.timeLeft <= 10
                        ? "bg-rose-500/20 text-rose-400 animate-pulse border border-rose-500/40"
                        : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
                    }`}
                  >
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xl font-black">{gameState.timeLeft} שנ׳</span>
                    <p className="text-[10px] text-zinc-500">טיימר סיבוב</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleTimer}
                    className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      gameState.isTimerRunning
                        ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                        : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    }`}
                  >
                    {gameState.isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={resetTimer}
                    className="p-2 rounded-xl border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-all cursor-pointer"
                    title="אפס טיימר"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Interactive Area */}
        {gameState.mode === "simultaneous" ? (
          /* Simultaneous Mode: ALL TEAMS RACKS DISPLAYED SIMULTANEOUSLY */
          <div
            className={`p-4 md:p-5 rounded-3xl border-2 transition-all shadow-xl ${
              isLight ? "bg-white border-slate-200" : "bg-zinc-900/90 border-zinc-800"
            }`}
          >
            {/* Action Bar Above All Racks */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 mb-3 border-b border-zinc-800/60">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
                  ⚡
                </div>
                <div>
                  <h3 className="font-extrabold text-sm md:text-base leading-tight">
                    אותיות כל הקבוצות לסיבוב {gameState.roundNumber} (All Teams&apos; Letters)
                  </h3>
                  <p className={`text-[11px] ${isLight ? "text-slate-500" : "text-zinc-400"}`}>
                    כל הקבוצות רואות את האותיות שלהן יחד. לחצו על אות של קבוצה כדי לשבץ אותה בלוח
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleSwapAllRacks}
                  className="px-3.5 py-2.5 rounded-2xl border border-zinc-700 hover:border-zinc-600 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  title="החלף 5 אותיות עבור כל הקבוצות"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span>החלף לכולם</span>
                </button>

                <button
                  onClick={handleSubmitTurn}
                  className="flex-1 sm:flex-none px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-95 text-white font-extrabold text-xs md:text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>בדוק והזן סיבוב ({Object.keys(turnPlacements).length} שובצו)</span>
                </button>
              </div>
            </div>

            {/* Grid of All Teams and their 5 Letters */}
            <div
              className={`grid gap-3 ${
                gameState.teams.length <= 3
                  ? "grid-cols-1 md:grid-cols-3"
                  : gameState.teams.length === 4
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
                  : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              }`}
            >
              {gameState.teams.map((team, tIdx) => {
                const tTheme = colorMap[team.color] || colorMap.sky;
                const isSelectedTeam = activeTeamId === team.id;
                const placedByThisTeamCount = Object.values(turnPlacements).filter(
                  p => p.teamId === team.id
                ).length;

                return (
                  <div
                    key={team.id}
                    onClick={() => setActiveTeamId(team.id)}
                    className={`p-3 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden ${
                      isSelectedTeam
                        ? `${tTheme.border} ${tTheme.bg} shadow-md`
                        : isLight
                        ? "bg-slate-50 border-slate-200 hover:border-slate-300"
                        : "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700"
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-6 h-6 rounded-lg ${tTheme.solidBg} flex items-center justify-center text-white text-xs font-black shadow-sm`}
                        >
                          {tIdx + 1}
                        </div>
                        <span className="font-extrabold text-xs md:text-sm truncate max-w-[110px]">
                          {team.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {placedByThisTeamCount > 0 && (
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${tTheme.badge} font-bold`}>
                            {placedByThisTeamCount} בלוח
                          </span>
                        )}
                        <span className="font-black text-xs text-cyan-400">{team.score} נק׳</span>
                      </div>
                    </div>

                    {/* 5 Letters Row */}
                    <div className="grid grid-cols-5 gap-1.5" dir="ltr">
                      {team.rack.map((letter, lIdx) => {
                        const isSelected = isSelectedTeam && selectedRackIndex === lIdx;
                        const isPlaced = Object.values(turnPlacements).some(
                          p => p.rackIndex === lIdx && p.teamId === team.id
                        );

                        return (
                          <button
                            key={`${team.id}-${lIdx}`}
                            disabled={isPlaced}
                            onClick={e => {
                              e.stopPropagation();
                              setActiveTeamId(team.id);
                              handleRackTileClick(lIdx);
                            }}
                            className={`h-11 sm:h-12 rounded-xl border-2 flex items-center justify-center font-black text-lg md:text-xl transition-all cursor-pointer select-none ${
                              isPlaced
                                ? "opacity-25 border-dashed border-zinc-600 scale-90"
                                : isSelected
                                ? "border-cyan-400 bg-cyan-400 text-black shadow-lg shadow-cyan-400/30 scale-110 -translate-y-1"
                                : isLight
                                ? "border-slate-300 bg-white hover:border-slate-400 text-slate-900 hover:scale-105"
                                : "border-zinc-700 bg-zinc-800 hover:border-zinc-500 text-zinc-100 hover:scale-105"
                            }`}
                          >
                            {letter}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Turn-by-Turn Mode: Active Team 5-Letter Rack */
          <div
            className={`p-4 md:p-5 rounded-3xl border-2 transition-all shadow-xl ${
              currentTeamTheme.border
            } ${isLight ? "bg-white" : "bg-zinc-900/90"}`}
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Active Team Indicator */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-2xl ${currentTeamTheme.solidBg} flex items-center justify-center text-white font-black text-lg shadow-md`}
                >
                  ★
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-base md:text-lg">{currentTeam.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${currentTeamTheme.badge} font-bold`}>
                      תור פעיל
                    </span>
                  </div>
                  <p className={`text-xs ${isLight ? "text-slate-500" : "text-zinc-400"}`}>
                    בחרו אות מהמגש והניחו במשבצת המתאימה בלוח
                  </p>
                </div>
              </div>

              {/* 5-Letter Rack */}
              <div className="flex items-center gap-2" dir="ltr">
                {currentTeam.rack.map((letter, idx) => {
                  const isSelected = selectedRackIndex === idx;
                  const isPlaced = Object.values(turnPlacements).some(
                    p => p.rackIndex === idx && p.teamId === currentTeam.id
                  );

                  return (
                    <button
                      key={`${currentTeam.id}-${idx}`}
                      disabled={isPlaced}
                      onClick={() => handleRackTileClick(idx)}
                      className={`w-11 h-11 sm:w-13 sm:h-13 rounded-2xl border-2 flex items-center justify-center font-black text-xl md:text-2xl transition-all transform cursor-pointer ${
                        isPlaced
                          ? "opacity-30 border-dashed border-zinc-600 cursor-not-allowed scale-90"
                          : isSelected
                          ? "border-cyan-400 bg-cyan-400 text-black shadow-lg shadow-cyan-400/30 scale-110 -translate-y-1"
                          : isLight
                          ? "border-slate-300 bg-slate-50 text-slate-800 hover:border-slate-400 hover:scale-105"
                          : "border-zinc-700 bg-zinc-800 text-zinc-100 hover:border-zinc-500 hover:scale-105"
                      }`}
                    >
                      {letter}
                    </button>
                  );
                })}
              </div>

              {/* Actions: Submit & Swap */}
              <div className="flex items-center gap-2 w-full md:w-auto">
                <button
                  onClick={handleSwapRack}
                  className="px-3.5 py-3 rounded-2xl border border-zinc-700 hover:border-zinc-600 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  title="החלף את כל 5 האותיות והעבר תור"
                >
                  <Shuffle className="w-4 h-4" />
                  <span className="hidden sm:inline">החלף אותיות</span>
                </button>

                <button
                  onClick={handleSubmitTurn}
                  className="flex-1 md:flex-none px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-95 text-white font-extrabold text-sm md:text-base shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] cursor-pointer"
                >
                  <Check className="w-5 h-5" />
                  <span>בדוק והזן מהלך ({Object.keys(turnPlacements).length})</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Manual Score Adjustment Modal */}
      {scoreAdjustTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div
            className={`w-full max-w-sm p-6 rounded-3xl border space-y-4 shadow-2xl ${
              isLight ? "bg-white border-slate-200" : "bg-zinc-900 border-zinc-800"
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base">עדכון ניקוד ידני: {scoreAdjustTeam.name}</h3>
              <button
                onClick={() => setScoreAdjustTeam(null)}
                className="text-zinc-500 hover:text-zinc-300 font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-zinc-500">
              ניקוד נוכחי: <strong className="text-cyan-400">{scoreAdjustTeam.score}</strong>
            </p>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleAdjustScore(scoreAdjustTeam.id, 10)}
                className="py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold text-xs"
              >
                +10 נקודות
              </button>
              <button
                onClick={() => handleAdjustScore(scoreAdjustTeam.id, -5)}
                className="py-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 font-bold text-xs"
              >
                -5 נקודות
              </button>
              <button
                onClick={() => handleAdjustScore(scoreAdjustTeam.id, 25)}
                className="py-2.5 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 font-bold text-xs"
              >
                +25 (בונוס כיתה)
              </button>
              <button
                onClick={() => handleAdjustScore(scoreAdjustTeam.id, -10)}
                className="py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-300 font-bold text-xs"
              >
                -10 נקודות
              </button>
            </div>

            <button
              onClick={() => setScoreAdjustTeam(null)}
              className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs"
            >
              סיום
            </button>
          </div>
        </div>
      )}

      {/* Game Over Victory Modal */}
      {gameState.isGameOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div
            className={`w-full max-w-lg p-8 rounded-3xl border text-center space-y-6 shadow-2xl ${
              isLight ? "bg-white border-slate-200" : "bg-zinc-900 border-zinc-800"
            }`}
          >
            <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mx-auto text-3xl">
              🏆
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl md:text-3xl font-black">התשבץ הושלם בהצלחה!</h2>
              <p className="text-xs text-zinc-500">כל המילים פוענחו. להלן טבלת הניקוד הסופית:</p>
            </div>

            {/* Podium Leaderboard */}
            <div className="space-y-2">
              {[...gameState.teams]
                .sort((a, b) => b.score - a.score)
                .map((t, idx) => (
                  <div
                    key={t.id}
                    className={`p-3 rounded-2xl border flex items-center justify-between text-xs font-bold ${
                      idx === 0
                        ? "bg-amber-500/15 border-amber-500/40 text-amber-300"
                        : idx === 1
                        ? "bg-slate-300/10 border-slate-300/30 text-slate-300"
                        : "bg-zinc-800/40 border-zinc-800 text-zinc-400"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">
                        {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `${idx + 1}.`}
                      </span>
                      <span>{t.name}</span>
                    </div>
                    <span className="text-sm font-black">{t.score} נקודות</span>
                  </div>
                ))}
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <Link
                href="/english/crossword-clash"
                className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors"
              >
                משחק חדש
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
