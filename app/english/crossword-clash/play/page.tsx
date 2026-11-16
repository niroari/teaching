"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  Volume2,
  VolumeX,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Printer,
  Shuffle,
  Award,
  Check,
  Volume1,
  Maximize,
  Minimize,
  Scale,
  Zap,
  Star
} from "lucide-react";
import ActivityBar from "@/components/site/ActivityBar";
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

  // Fullscreen (projector)
  const [isFullscreen, setIsFullscreen] = useState(false);
  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

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

  // Board sizing: cells grow to fill the space available on the screen
  const boardRef = useRef<HTMLDivElement | null>(null);
  const [cellSize, setCellSize] = useState(44);
  const gridRows = gameState?.grid.rows ?? 0;
  const gridCols = gameState?.grid.cols ?? 0;
  useEffect(() => {
    const el = boardRef.current;
    if (!el || !gridRows || !gridCols) return;
    const GAP = 6;
    const PAD = 26; // grid padding + border
    const measure = () => {
      const fitsHeight = window.matchMedia("(min-width: 1024px)").matches;
      const byWidth = (el.clientWidth - PAD - GAP * (gridCols - 1)) / gridCols;
      const byHeight = (el.clientHeight - PAD - GAP * (gridRows - 1)) / gridRows;
      const size = fitsHeight ? Math.min(byWidth, byHeight) : byWidth;
      setCellSize(Math.max(24, Math.min(88, Math.floor(size))));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [gridRows, gridCols]);

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
      <div className="min-h-screen flex items-center justify-center bg-card text-fg">
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

  const placedCount = Object.keys(turnPlacements).length;
  const letterFont = Math.round(cellSize * 0.5);
  const numberFont = Math.max(9, Math.round(cellSize * 0.2));

  const renderClue = (w: CrosswordWord, tone: "across" | "down") => {
    const isActive = activeWordId === w.id;
    const toneNum = tone === "across" ? "text-indigo-700 dark:text-indigo-400" : "text-cyan-700 dark:text-cyan-400";
    const toneActive = tone === "across" ? "border-indigo-500 bg-indigo-500/15" : "border-cyan-500 bg-cyan-500/15";
    return (
      <div
        key={w.id}
        dir="ltr"
        onClick={() => {
          setActiveWordId(w.id);
          setSelectedCell({ row: w.row, col: w.col });
          sounds.playPop();
        }}
        className={`px-2.5 py-1.5 rounded-lg border text-sm cursor-pointer transition-colors flex items-start gap-2 text-left ${
          isActive
            ? `${toneActive} font-semibold`
            : w.solved
            ? "border-emerald-500/20 bg-emerald-500/5 opacity-70"
            : "border-line bg-subtle hover:border-line-strong"
        }`}
      >
        <span className={`font-bold shrink-0 ${toneNum}`}>{w.number}.</span>
        <p className={`flex-1 leading-snug ${w.solved ? "line-through text-fg-muted" : ""}`}>{w.clue}</p>
        <span className="text-xs text-fg-muted shrink-0">({w.word.length})</span>
      </div>
    );
  };

  return (
    <div className="flex min-h-dvh flex-col bg-subtle text-fg lg:h-dvh lg:overflow-hidden">
      <ActivityBar
        backHref="/english/crossword-clash"
        backLabel="הגדרות"
        title={
          <span className="flex items-center gap-2">
            <span>Crossword Clash</span>
            <span className="rounded-full border border-line px-2 py-0.5 text-xs font-semibold text-fg-muted">
              סיבוב {gameState.roundNumber}
            </span>
            <span className="truncate text-xs font-normal text-fg-muted">{gameState.topic}</span>
          </span>
        }
      >
        <button
          onClick={handleTeacherRevealHint}
          className="inline-flex h-9 items-center gap-1.5 rounded-md border border-amber-200 bg-amber-50 px-3 text-xs font-bold text-amber-800 transition-colors hover:bg-amber-100 cursor-pointer dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300 dark:hover:bg-amber-500/20"
          title="גלה אות רמז למשבצת הנבחרת"
        >
          <Sparkles className="h-4 w-4" strokeWidth={1.75} />
          <span className="hidden sm:inline">רמז מורה</span>
        </button>
        <Link
          href="/english/crossword-clash/printable"
          target="_blank"
          className="inline-flex h-9 items-center gap-1.5 rounded-md border border-line px-2.5 text-xs font-bold text-fg-muted transition-colors hover:bg-subtle hover:text-fg"
          title="הדפס דף עבודה לתלמידים"
        >
          <Printer className="h-4 w-4" strokeWidth={1.75} />
          <span className="hidden md:inline">דף לתלמיד</span>
        </Link>
        <button
          onClick={toggleSound}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-line text-fg-muted transition-colors hover:bg-subtle hover:text-fg cursor-pointer"
          title={soundEnabled ? "השתק" : "הפעל צליל"}
        >
          {soundEnabled ? <Volume2 className="h-4 w-4" strokeWidth={1.75} /> : <VolumeX className="h-4 w-4" strokeWidth={1.75} />}
        </button>
        <button
          onClick={toggleFullscreen}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-line text-fg-muted transition-colors hover:bg-subtle hover:text-fg cursor-pointer"
          title={isFullscreen ? "יציאה ממסך מלא" : "מסך מלא (למקרן)"}
        >
          {isFullscreen ? <Minimize className="h-4 w-4" strokeWidth={1.75} /> : <Maximize className="h-4 w-4" strokeWidth={1.75} />}
        </button>
      </ActivityBar>

      <main className="mx-auto flex w-full max-w-[1800px] flex-1 flex-col gap-3 px-3 py-3 lg:min-h-0">
        {/* Board + sidebar */}
        <div className="grid grid-cols-1 gap-3 lg:min-h-0 lg:flex-1 lg:grid-cols-[minmax(0,1fr)_minmax(300px,26rem)]">
          {/* Board */}
          <section
            dir="ltr"
            className="relative flex flex-col gap-3 rounded-xl border border-line bg-card p-3 shadow-sm lg:min-h-0"
          >
            {activeWord ? (
              <div className="flex shrink-0 items-center justify-between gap-3 rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-left dark:border-indigo-500/30 dark:bg-indigo-950/30">
                <div className="flex min-w-0 items-baseline gap-2 text-base lg:text-lg">
                  <span className="shrink-0 font-bold text-indigo-700 dark:text-indigo-400">
                    {activeWord.number} {activeWord.direction === "across" ? "Across" : "Down"}:
                  </span>
                  <span className="font-semibold">{activeWord.clue}</span>
                </div>
                <button
                  onClick={() => speakWord(activeWord.word)}
                  className="shrink-0 rounded-md p-1.5 text-indigo-700 transition-colors hover:bg-indigo-500/20 dark:text-indigo-400"
                  title="הקרא הגדרה באנגלית"
                >
                  <Volume1 className="h-5 w-5" strokeWidth={1.75} />
                </button>
              </div>
            ) : (
              <div dir="rtl" className="shrink-0 py-2 text-center text-sm text-fg-muted">
                לחצו על משבצת או הגדרה כדי לראות את המילה המתאימה בלוח
              </div>
            )}

            {/* Feedback toast: overlays the board so it does not push the layout */}
            {turnFeedback && (
              <div
                dir="rtl"
                className={`absolute inset-x-3 top-3 z-20 flex items-center justify-between gap-3 rounded-lg border px-4 py-3 text-sm font-bold shadow-md animate-in fade-in slide-in-from-top-2 ${
                  turnFeedback.type === "word"
                    ? "border-amber-500/40 bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                    : turnFeedback.type === "penalty"
                    ? "border-rose-500/40 bg-rose-50 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                    : "border-emerald-500/40 bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  {turnFeedback.type === "word" ? (
                    <Award className="h-5 w-5" strokeWidth={1.75} />
                  ) : turnFeedback.type === "penalty" ? (
                    <XCircle className="h-5 w-5" strokeWidth={1.75} />
                  ) : (
                    <CheckCircle2 className="h-5 w-5" strokeWidth={1.75} />
                  )}
                  <span>{turnFeedback.message}</span>
                </div>
                <span className="shrink-0 text-base">
                  {turnFeedback.points > 0 ? `+${turnFeedback.points}` : turnFeedback.points} נק׳
                </span>
              </div>
            )}

            <div ref={boardRef} className="flex flex-1 items-center justify-center lg:min-h-0">
              <div
                className="inline-grid select-none rounded-xl border border-line bg-subtle p-3"
                style={{
                  gap: 6,
                  gridTemplateColumns: `repeat(${gameState.grid.cols}, ${cellSize}px)`
                }}
              >
                {gameState.grid.cells.map((row, r) =>
                  row.map((cell, c) => {
                    const cellKey = `${r},${c}`;
                    const isSelected = selectedCell?.row === r && selectedCell?.col === c;
                    const isHighlighted = isCellInActiveWord(r, c);
                    const placedTile = turnPlacements[cellKey];
                    const sizeStyle = { width: cellSize, height: cellSize };

                    if (!cell.isActive) {
                      return <div key={cellKey} style={sizeStyle} className="rounded-lg bg-subtle-hover" />;
                    }

                    const revealingTeam = cell.revealedByTeamId
                      ? gameState.teams.find(t => t.id === cell.revealedByTeamId)
                      : null;
                    const revealingTheme = revealingTeam ? colorMap[revealingTeam.color] || colorMap.sky : null;
                    const placingTeam = placedTile ? gameState.teams.find(t => t.id === placedTile.teamId) : null;
                    const placingTheme = placingTeam ? colorMap[placingTeam.color] || colorMap.sky : null;

                    return (
                      <div
                        key={cellKey}
                        onClick={() => handleCellClick(r, c)}
                        style={sizeStyle}
                        className={`relative flex items-center justify-center rounded-lg border-2 font-black select-none cursor-pointer transition-colors ${
                          isSelected
                            ? "border-cyan-400 ring-2 ring-cyan-400/50"
                            : placedTile
                            ? `${placingTheme ? placingTheme.border : "border-amber-400"} ${
                                placingTheme ? placingTheme.bg : "bg-amber-500/20"
                              } animate-pulse`
                            : isHighlighted
                            ? "border-indigo-400/80 bg-indigo-500/15"
                            : "border-line bg-card hover:border-line-strong"
                        }`}
                      >
                        {cell.number && (
                          <span
                            className="absolute left-1 top-0.5 font-bold leading-none text-fg-muted"
                            style={{ fontSize: numberFont }}
                          >
                            {cell.number}
                          </span>
                        )}

                        {placedTile && placingTeam && (
                          <span
                            className={`absolute right-1 top-0.5 rounded px-1 font-bold leading-tight ${
                              placingTheme ? placingTheme.badge : "bg-amber-500/20 text-amber-700 dark:text-amber-300"
                            }`}
                            style={{ fontSize: Math.max(8, numberFont - 1) }}
                          >
                            ק{gameState.teams.indexOf(placingTeam) + 1}
                          </span>
                        )}

                        {cell.isRevealed ? (
                          <span
                            className={`font-bold ${revealingTheme ? revealingTheme.text : "text-emerald-700 dark:text-emerald-400"}`}
                            style={{ fontSize: letterFont }}
                          >
                            {cell.letter}
                          </span>
                        ) : placedTile ? (
                          <span
                            className={`font-bold ${placingTheme ? placingTheme.text : "text-amber-700 dark:text-amber-300"}`}
                            style={{ fontSize: letterFont }}
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
          </section>

          {/* Sidebar: scores, timer, clues */}
          <aside className="flex flex-col gap-3 lg:min-h-0">
            <div className="grid shrink-0 grid-cols-2 gap-2">
              {gameState.teams.map((team, idx) => {
                const theme = colorMap[team.color] || colorMap.sky;
                const isTurn = team.id === currentTeam.id;
                return (
                  <div
                    key={team.id}
                    onClick={() => {
                      if (gameState.mode === "simultaneous") setActiveTeamId(team.id);
                    }}
                    className={`flex items-center gap-2 rounded-lg border-2 px-2.5 py-1.5 transition-colors cursor-pointer ${
                      isTurn ? `${theme.border} ${theme.bg}` : "border-line bg-card"
                    }`}
                  >
                    <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold text-fg ${theme.solidBg}`}>
                      {idx + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-bold leading-tight">{team.name}</div>
                      <div className="text-[11px] leading-tight text-fg-muted">מילים: {team.wordsCompleted}</div>
                    </div>
                    <span className="text-lg font-bold text-cyan-700 dark:text-cyan-400">{team.score}</span>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setScoreAdjustTeam(team);
                      }}
                      className="rounded p-1 text-fg-subtle transition-colors hover:bg-subtle hover:text-fg"
                      title="עדכן ניקוד ידנית"
                    >
                      <Scale className="h-3.5 w-3.5" strokeWidth={1.75} />
                    </button>
                  </div>
                );
              })}
            </div>

            {gameState.settings.roundTimerSeconds > 0 && (
              <div className="flex shrink-0 items-center justify-between rounded-xl border border-line bg-card px-3 py-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg border ${
                      gameState.timeLeft <= 10
                        ? "animate-pulse border-rose-500/40 bg-rose-500/20 text-rose-700 dark:text-rose-400"
                        : "border-cyan-500/30 bg-cyan-500/10 text-cyan-700 dark:text-cyan-400"
                    }`}
                  >
                    <Clock className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <span className="text-2xl font-bold tabular-nums">{gameState.timeLeft} שנ׳</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleTimer}
                    className={`rounded-lg border p-2 transition-colors cursor-pointer ${
                      gameState.isTimerRunning
                        ? "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400"
                        : "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                    }`}
                    title={gameState.isTimerRunning ? "השהה טיימר" : "הפעל טיימר"}
                  >
                    {gameState.isTimerRunning ? <Pause className="h-4 w-4" strokeWidth={1.75} /> : <Play className="h-4 w-4" strokeWidth={1.75} />}
                  </button>
                  <button
                    onClick={resetTimer}
                    className="rounded-lg border border-line bg-subtle p-2 text-fg transition-colors hover:bg-subtle-hover cursor-pointer"
                    title="אפס טיימר"
                  >
                    <RotateCcw className="h-4 w-4" strokeWidth={1.75} />
                  </button>
                </div>
              </div>
            )}

            <div dir="ltr" className="flex flex-col rounded-xl border border-line bg-card p-3 text-left shadow-sm lg:min-h-0 lg:flex-1">
              <div className="mb-2 flex shrink-0 items-center justify-between border-b border-line pb-2">
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-indigo-700 dark:text-indigo-400" strokeWidth={1.75} />
                  <span className="text-sm font-bold">Clues</span>
                </div>
                <span className="text-xs text-fg-muted">
                  {gameState.grid.words.filter(w => w.solved).length} / {gameState.grid.words.length} solved
                </span>
              </div>
              <div className="max-h-[360px] space-y-3 overflow-y-auto pr-1 lg:max-h-none lg:min-h-0 lg:flex-1">
                <div>
                  <h4 className="mb-1.5 text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                    Across (מאוזן)
                  </h4>
                  <div className="space-y-1.5">
                    {gameState.grid.words.filter(w => w.direction === "across").map(w => renderClue(w, "across"))}
                  </div>
                </div>
                <div>
                  <h4 className="mb-1.5 text-xs font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-400">
                    Down (מאונך)
                  </h4>
                  <div className="space-y-1.5">
                    {gameState.grid.words.filter(w => w.direction === "down").map(w => renderClue(w, "down"))}
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Rack bar */}
        {gameState.mode === "simultaneous" ? (
          <div className="flex shrink-0 flex-col gap-3 rounded-xl border-2 border-line bg-card p-3 shadow-sm lg:flex-row lg:items-stretch">
            <div
              className="grid flex-1 grid-cols-2 gap-2 sm:grid-cols-3 lg:[grid-template-columns:repeat(var(--teams),minmax(0,1fr))]"
              style={{ "--teams": gameState.teams.length } as React.CSSProperties}
            >
              {gameState.teams.map((team, tIdx) => {
                const tTheme = colorMap[team.color] || colorMap.sky;
                const isSelectedTeam = activeTeamId === team.id;
                const placedByThisTeamCount = Object.values(turnPlacements).filter(p => p.teamId === team.id).length;
                return (
                  <div
                    key={team.id}
                    onClick={() => setActiveTeamId(team.id)}
                    className={`rounded-lg border-2 p-2 transition-colors cursor-pointer ${
                      isSelectedTeam ? `${tTheme.border} ${tTheme.bg}` : "border-line bg-subtle"
                    }`}
                  >
                    <div className="mb-1.5 flex items-center justify-between gap-1">
                      <div className="flex min-w-0 items-center gap-1.5">
                        <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded text-[11px] font-bold text-fg ${tTheme.solidBg}`}>
                          {tIdx + 1}
                        </div>
                        <span className="truncate text-sm font-bold">{team.name}</span>
                      </div>
                      {placedByThisTeamCount > 0 && (
                        <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${tTheme.badge}`}>
                          {placedByThisTeamCount} בלוח
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-5 gap-1" dir="ltr">
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
                            className={`flex h-10 items-center justify-center rounded-lg border-2 text-xl font-bold transition-all select-none cursor-pointer xl:h-12 xl:text-2xl ${
                              isPlaced
                                ? "scale-90 border-dashed border-line opacity-25"
                                : isSelected
                                ? "-translate-y-0.5 border-cyan-400 bg-cyan-400 text-black"
                                : "border-line bg-card text-fg hover:border-line-strong"
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

            <div className="flex shrink-0 items-center gap-2 lg:w-52 lg:flex-col lg:items-stretch lg:justify-center">
              <button
                onClick={handleSubmitTurn}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 text-base font-bold text-white transition-opacity hover:opacity-95 cursor-pointer lg:flex-none"
              >
                <Check className="h-5 w-5" strokeWidth={1.75} />
                <span>בדוק סיבוב ({placedCount})</span>
              </button>
              <button
                onClick={handleSwapAllRacks}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-line bg-subtle px-3 py-2.5 text-sm font-bold text-fg transition-colors hover:bg-subtle-hover cursor-pointer"
                title="החלף 5 אותיות עבור כל הקבוצות"
              >
                <Shuffle className="h-4 w-4" strokeWidth={1.75} />
                <span>החלף לכולם</span>
              </button>
              <p className="hidden items-center justify-center gap-1 text-[11px] text-fg-muted lg:flex">
                <Zap className="h-3 w-3" strokeWidth={1.75} />
                כל הקבוצות משחקות יחד
              </p>
            </div>
          </div>
        ) : (
          <div className={`flex shrink-0 flex-col items-center justify-between gap-3 rounded-xl border-2 bg-card px-4 py-3 shadow-sm md:flex-row ${currentTeamTheme.border}`}>
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg text-fg ${currentTeamTheme.solidBg}`}>
                <Star className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold">{currentTeam.name}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${currentTeamTheme.badge}`}>תור פעיל</span>
                </div>
                <p className="text-xs text-fg-muted">בחרו אות מהמגש והניחו במשבצת המתאימה בלוח</p>
              </div>
            </div>

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
                    className={`flex h-12 w-12 items-center justify-center rounded-lg border-2 text-2xl font-bold transition-all cursor-pointer xl:h-14 xl:w-14 xl:text-3xl ${
                      isPlaced
                        ? "scale-90 cursor-not-allowed border-dashed border-line opacity-30"
                        : isSelected
                        ? "-translate-y-1 border-cyan-400 bg-cyan-400 text-black"
                        : "border-line bg-subtle text-fg hover:border-line-strong"
                    }`}
                  >
                    {letter}
                  </button>
                );
              })}
            </div>

            <div className="flex w-full items-center gap-2 md:w-auto">
              <button
                onClick={handleSwapRack}
                className="flex items-center gap-1.5 rounded-lg border border-line bg-subtle px-3.5 py-3 text-sm font-bold text-fg transition-colors hover:bg-subtle-hover cursor-pointer"
                title="החלף את כל 5 האותיות והעבר תור"
              >
                <Shuffle className="h-4 w-4" strokeWidth={1.75} />
                <span className="hidden sm:inline">החלף אותיות</span>
              </button>
              <button
                onClick={handleSubmitTurn}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-base font-bold text-white transition-opacity hover:opacity-95 cursor-pointer md:flex-none"
              >
                <Check className="h-5 w-5" strokeWidth={1.75} />
                <span>בדוק והזן מהלך ({placedCount})</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Manual Score Adjustment Modal */}
      {scoreAdjustTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div
            className={`w-full max-w-sm p-6 rounded-xl border space-y-4 shadow-sm bg-card border-line`}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base">עדכון ניקוד ידני: {scoreAdjustTeam.name}</h3>
              <button
                onClick={() => setScoreAdjustTeam(null)}
                className="text-fg-muted hover:text-fg font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-fg-muted">
              ניקוד נוכחי: <strong className="text-cyan-700 dark:text-cyan-400">{scoreAdjustTeam.score}</strong>
            </p>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleAdjustScore(scoreAdjustTeam.id, 10)}
                className="py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 font-bold text-xs"
              >
                +10 נקודות
              </button>
              <button
                onClick={() => handleAdjustScore(scoreAdjustTeam.id, -5)}
                className="py-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-700 dark:text-rose-400 font-bold text-xs"
              >
                -5 נקודות
              </button>
              <button
                onClick={() => handleAdjustScore(scoreAdjustTeam.id, 25)}
                className="py-2.5 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-700 dark:text-indigo-400 font-bold text-xs"
              >
                +25 (בונוס כיתה)
              </button>
              <button
                onClick={() => handleAdjustScore(scoreAdjustTeam.id, -10)}
                className="py-2.5 rounded-xl bg-subtle border border-line text-fg font-bold text-xs"
              >
                -10 נקודות
              </button>
            </div>

            <button
              onClick={() => setScoreAdjustTeam(null)}
              className="w-full py-2.5 rounded-xl bg-subtle hover:bg-subtle text-fg font-bold text-xs"
            >
              סיום
            </button>
          </div>
        </div>
      )}

      {/* Game Over Victory Modal */}
      {gameState.isGameOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 animate-in fade-in">
          <div
            className={`w-full max-w-lg p-8 rounded-xl border text-center space-y-6 shadow-sm bg-card border-line`}
          >
            <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mx-auto text-3xl">
              🏆
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl md:text-3xl font-bold">התשבץ הושלם בהצלחה!</h2>
              <p className="text-xs text-fg-muted">כל המילים פוענחו. להלן טבלת הניקוד הסופית:</p>
            </div>

            {/* Podium Leaderboard */}
            <div className="space-y-2">
              {[...gameState.teams]
                .sort((a, b) => b.score - a.score)
                .map((t, idx) => (
                  <div
                    key={t.id}
                    className={`p-3 rounded-xl border flex items-center justify-between text-xs font-bold ${
                      idx === 0
                        ? "bg-amber-500/15 border-amber-500/40 text-amber-700 dark:text-amber-300"
                        : idx === 1
                        ? "bg-subtle-hover border-line text-fg"
                        : "bg-subtle border-line text-fg-muted"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">
                        {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `${idx + 1}.`}
                      </span>
                      <span>{t.name}</span>
                    </div>
                    <span className="text-sm font-bold">{t.score} נקודות</span>
                  </div>
                ))}
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <Link
                href="/english/crossword-clash"
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors"
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
