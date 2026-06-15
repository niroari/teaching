"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGameState } from "@/app/english-auction/context/GameStateContext";
import { colorMap } from "@/lib/colors";
import confetti from "canvas-confetti";
import { 
  Volume2, VolumeX, Clock, ArrowLeft, ArrowRight, RotateCcw, 
  HelpCircle, CheckCircle2, XCircle, Gavel, Sparkles, Sliders, 
  Tv, Settings, AlertTriangle, RefreshCw, Undo2, Award, Info, Trophy
} from "lucide-react";

export default function GamePage() {
  const router = useRouter();
  const {
    teams,
    settings,
    sentences,
    currentSentenceIndex,
    purchasedSentences,
    revealedSentences,
    gameStarted,
    isGameOver,
    timeLeft,
    isTimerActive,
    soundEnabled,
    startTimer,
    pauseTimer,
    resetTimer,
    recordSale,
    cancelSale,
    revealSentence,
    nextSentence,
    prevSentence,
    jumpToSentence,
    toggleSound,
    resetGame
  } = useGameState();

  // Redirect to setup if game hasn't been initialized
  useEffect(() => {
    if (!gameStarted) {
      router.push("/english-auction");
    }
  }, [gameStarted, router]);

  // UI state
  const [showTeacherControls, setShowTeacherControls] = useState(true);
  const [selectedBidderId, setSelectedBidderId] = useState<string>("");
  const [bidAmount, setBidAmount] = useState<number>(100);
  const [showGridNavigator, setShowGridNavigator] = useState(false);

  const currentSentence = sentences[currentSentenceIndex];
  const saleLog = currentSentence ? purchasedSentences[currentSentence.id] : null;
  const isRevealed = currentSentence ? revealedSentences.includes(currentSentence.id) : false;

  // Sync selected bidder and default bid when sentence changes
  useEffect(() => {
    if (teams.length > 0) {
      setSelectedBidderId(teams[0].id);
    }
    setBidAmount(settings.minBidIncrement);
  }, [currentSentenceIndex, teams, settings]);

  // Confetti trigger when a correct answer is revealed
  useEffect(() => {
    if (isRevealed && currentSentence?.isCorrect && saleLog) {
      const duration = 2.5 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 50 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: NodeJS.Timeout = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [isRevealed, currentSentence, saleLog]);

  if (!currentSentence) return null;

  // Sorting teams:
  // Classic mode: Sort by points (score) first, then balance
  // Cash mode: Sort by balance
  const sortedTeams = [...teams].sort((a, b) => {
    if (settings.scoringMode === "classic") {
      if (b.score !== a.score) return b.score - a.score;
      return b.balance - a.balance;
    }
    return b.balance - a.balance;
  });

  const handleRecordBid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBidderId) return;
    
    const bidder = teams.find(t => t.id === selectedBidderId);
    if (!bidder) return;

    if (bidder.balance < bidAmount) {
      alert(`Oops! ${bidder.name} does not have enough money (Balance: $${bidder.balance}).`);
      return;
    }

    recordSale(selectedBidderId, bidAmount);
  };

  const handleReveal = () => {
    revealSentence(currentSentence.id);
  };

  // Quick bid adjustments
  const adjustBid = (amount: number) => {
    setBidAmount(prev => Math.max(settings.minBidIncrement, prev + amount));
  };

  // Find winner for game over display
  const winningTeam = sortedTeams[0];

  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between overflow-hidden">
      
      {/* Dynamic Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full bg-gradient-to-b from-cyan-500/5 via-transparent to-transparent blur-3xl pointer-events-none rounded-full" />
      
      {/* Top Bar */}
      <header className="relative w-full px-6 py-4 flex justify-between items-center bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900 z-30">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              if (confirm("Are you sure you want to exit to Setup? All scores will be reset.")) {
                resetGame();
                router.push("/english-auction");
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-900/40 text-xs text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Setup</span>
          </button>
          
          <div className="h-4 w-px bg-zinc-800" />
          
          <div>
            <span className="text-[10px] text-zinc-500 tracking-wider uppercase font-semibold">Sentence</span>
            <div className="text-sm font-bold text-cyan-400">
              {currentSentenceIndex + 1} <span className="text-zinc-600 font-normal">/</span> {sentences.length}
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-6 h-1 bg-zinc-900 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all duration-300"
            style={{ width: `${((currentSentenceIndex + 1) / sentences.length) * 100}%` }}
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Grid View Trigger */}
          <button
            onClick={() => setShowGridNavigator(!showGridNavigator)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
              showGridNavigator 
                ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40" 
                : "border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Overview
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="p-2 rounded-lg border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 cursor-pointer"
            title={soundEnabled ? "Mute Sounds" : "Enable Sounds"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-zinc-600" />}
          </button>

          {/* Teacher Controls Toggle */}
          <button
            onClick={() => setShowTeacherControls(!showTeacherControls)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
              showTeacherControls 
                ? "bg-cyan-500 text-zinc-950 border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]" 
                : "border-zinc-800 hover:border-zinc-700 bg-zinc-900/40 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{showTeacherControls ? "Hide Controls" : "Teacher Panel"}</span>
          </button>
        </div>
      </header>

      {/* Overview Grid Modal Overlay */}
      {showGridNavigator && (
        <div className="absolute inset-0 bg-zinc-950/90 backdrop-blur-md z-40 flex items-center justify-center p-6">
          <div className="glass-panel w-full max-w-4xl p-8 rounded-3xl border border-zinc-800 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-cyan-400">Sentence Board Overview</h3>
                <p className="text-xs text-zinc-500">Jump directly to any sentence in the game</p>
              </div>
              <button
                onClick={() => setShowGridNavigator(false)}
                className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-sm cursor-pointer"
              >
                Close
              </button>
            </div>
            
            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-3 max-h-[60vh] overflow-y-auto pr-2 py-1">
              {sentences.map((sentence, index) => {
                const isBought = purchasedSentences[sentence.id];
                const isRev = revealedSentences.includes(sentence.id);
                const isCurrent = currentSentenceIndex === index;
                
                let btnClass = "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700";
                if (isCurrent) {
                  btnClass = "bg-cyan-950 text-cyan-400 border-cyan-500 ring-1 ring-cyan-500/30 font-bold scale-105";
                } else if (isRev) {
                  btnClass = sentence.isCorrect 
                    ? "bg-emerald-950/40 text-emerald-400 border-emerald-500/50" 
                    : "bg-rose-950/40 text-rose-400 border-rose-500/50";
                } else if (isBought) {
                  btnClass = "bg-amber-950/40 text-amber-400 border-amber-500/50";
                }

                return (
                  <button
                    key={sentence.id}
                    onClick={() => {
                      jumpToSentence(index);
                      setShowGridNavigator(false);
                    }}
                    className={`h-12 rounded-xl border flex flex-col items-center justify-center text-sm font-semibold transition-all cursor-pointer ${btnClass}`}
                  >
                    <span>{index + 1}</span>
                    <span className="text-[8px] opacity-65 uppercase tracking-tighter">
                      {isRev ? (sentence.isCorrect ? "Correct" : "Error") : isBought ? "Sold" : "Open"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Game Grid */}
      <main className="flex-1 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 z-20">
        
        {/* Left / Middle: Projector Stage */}
        <section className={`transition-all duration-300 ${showTeacherControls ? "lg:col-span-8" : "lg:col-span-12"} flex flex-col justify-between gap-6`}>
          
          {/* Main Sentence Card */}
          <div className="glass-panel flex-1 rounded-3xl p-8 border border-zinc-900 shadow-2xl flex flex-col justify-between items-center text-center relative overflow-hidden min-h-[380px]">
            {/* Background design accents */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-cyan-500/2 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/2 rounded-full blur-2xl pointer-events-none" />

            {/* Top Tag */}
            <div className="w-full flex justify-between items-center border-b border-zinc-900/60 pb-4">
              <span className="text-xs font-semibold text-zinc-500 tracking-widest uppercase">
                {currentSentence.category === "correct" ? "Standard" : currentSentence.category === "incorrect" ? "Spotted Error" : "Tricky Question"}
              </span>
              
              {/* Auction Hammer overlay badge */}
              {saleLog && !isRevealed && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider animate-pulse">
                  <Gavel className="w-3.5 h-3.5" />
                  <span>SOLD</span>
                </div>
              )}

              {isRevealed && (
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  currentSentence.isCorrect 
                    ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400" 
                    : "bg-rose-500/10 border border-rose-500/30 text-rose-400"
                }`}>
                  {currentSentence.isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  <span>{currentSentence.isCorrect ? "Correct Sentence" : "Grammar Error"}</span>
                </div>
              )}
            </div>

            {/* Giant Sentence Text */}
            <div className="my-auto py-8">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight select-all selection:bg-cyan-500/30 px-4">
                &quot;{currentSentence.text}&quot;
              </h2>
            </div>

            {/* Revealed Answer Overlay & Explanation */}
            {isRevealed ? (
              <div className={`w-full p-6 rounded-2xl border mt-6 animate-fadeIn ${
                currentSentence.isCorrect 
                  ? "bg-emerald-950/20 border-emerald-500/20 text-emerald-100" 
                  : "bg-rose-950/20 border-rose-500/20 text-rose-100"
              }`} dir="rtl">
                <div className="flex items-center gap-2 mb-2 font-extrabold text-lg">
                  {currentSentence.isCorrect ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span className="text-emerald-400">משפט תקין! (Correct)</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-rose-400" />
                      <span className="text-rose-400">יש טעות! (Incorrect)</span>
                    </>
                  )}
                </div>
                
                <p className="text-sm text-zinc-300 leading-relaxed mb-4">
                  {currentSentence.explanation}
                </p>

                {currentSentence.correction && (
                  <div className="border-t border-zinc-900 pt-3 text-left" dir="ltr">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase block tracking-wider mb-1">Correct Version:</span>
                    <span className="font-mono text-sm sm:text-base font-semibold text-emerald-400 bg-zinc-950/80 px-3 py-1.5 rounded-lg border border-zinc-900 inline-block">
                      {currentSentence.correction}
                    </span>
                  </div>
                )}
              </div>
            ) : saleLog ? (
              <div className="w-full p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex flex-col sm:flex-row justify-between items-center gap-2 mt-6">
                <div className="flex items-center gap-2">
                  <Gavel className="w-5 h-5 text-amber-400" />
                  <span className="text-sm font-semibold text-zinc-300">
                    Sold to <strong className="text-white">{teams.find(t => t.id === saleLog.teamId)?.name}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-mono font-bold text-amber-400">${saleLog.price}</span>
                  {showTeacherControls && (
                    <button
                      onClick={() => cancelSale(currentSentence.id)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-zinc-800 hover:border-rose-500/30 hover:bg-rose-500/10 text-[10px] font-bold text-zinc-400 hover:text-rose-400 cursor-pointer transition-colors"
                    >
                      <Undo2 className="w-3 h-3" />
                      <span>Undo Sale</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="w-full flex items-center justify-between text-xs text-zinc-500 mt-6 border-t border-zinc-900/60 pt-4">
                <span>Auction is currently open for bids</span>
                <span className="flex items-center gap-1 text-cyan-500/60 font-semibold animate-pulse">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Start the timer to begin deliberation</span>
                </span>
              </div>
            )}
          </div>

          {/* Leaderboard Scoreboard */}
          <div className="glass-panel rounded-3xl p-6 border border-zinc-900 shadow-2xl">
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-cyan-400" />
              <span>Leaderboard Scoreboard</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {sortedTeams.map((team, rank) => {
                const theme = colorMap[team.color];
                // Count sentences this team bought
                const teamSales = Object.entries(purchasedSentences)
                  .filter(([_, log]) => log.teamId === team.id)
                  .map(([sId, _]) => Number(sId));
                
                return (
                  <div 
                    key={team.id} 
                    className={`flex flex-col justify-between p-3 rounded-2xl border transition-all duration-300 ${theme.bg} ${theme.border} relative overflow-hidden`}
                  >
                    {/* Rank Badge */}
                    <div className="absolute top-1 right-1.5 text-[8px] font-bold text-zinc-600">
                      #{rank + 1}
                    </div>

                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`w-2 h-2 rounded-full ${theme.solidBg}`} />
                      <span className="font-bold text-xs truncate max-w-[80px]" title={team.name}>
                        {team.name}
                      </span>
                    </div>

                    <div className="flex flex-col gap-0.5 mb-2">
                      <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Balance</span>
                      <span className="text-sm font-mono font-bold text-zinc-100">${team.balance}</span>
                    </div>

                    <div className="flex justify-between items-center border-t border-zinc-900/50 pt-1.5 mt-auto">
                      {settings.scoringMode === "classic" && (
                        <div>
                          <span className="text-[8px] text-zinc-500 uppercase block tracking-wider">Score</span>
                          <span className="text-xs font-bold text-emerald-400">{team.score} pts</span>
                        </div>
                      )}
                      
                      <div className="ml-auto">
                        <span className="text-[8px] text-zinc-500 uppercase block tracking-wider">Bought</span>
                        <div className="flex gap-0.5 mt-0.5">
                          {teamSales.length === 0 ? (
                            <span className="text-[9px] text-zinc-600 font-semibold">-</span>
                          ) : (
                            teamSales.map((sId) => {
                              const s = sentences.find(x => x.id === sId);
                              const isRev = revealedSentences.includes(sId);
                              let indicatorColor = "bg-amber-500/60"; // sold but not revealed
                              if (isRev) {
                                indicatorColor = s?.isCorrect ? "bg-emerald-500" : "bg-rose-500";
                              }
                              return (
                                <span 
                                  key={sId} 
                                  className={`w-1.5 h-1.5 rounded-full ${indicatorColor}`} 
                                  title={`Sentence #${sId}`} 
                                />
                              );
                            })
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Right Section: Teacher Control Dashboard */}
        {showTeacherControls && (
          <section className="lg:col-span-4 flex flex-col gap-6 animate-slideInRight">
            
            {/* Timer Controller */}
            <div className="glass-panel rounded-3xl p-6 border border-zinc-900 shadow-xl flex flex-col items-center">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Deliberation Timer</span>
              
              <div className="flex items-center gap-6">
                {/* Large Circle Timer */}
                <div className={`relative w-24 h-24 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                  timeLeft <= 5 
                    ? "border-rose-500 animate-pulse-timer bg-rose-500/5" 
                    : isTimerActive 
                      ? "border-cyan-500 bg-cyan-500/2" 
                      : "border-zinc-800"
                }`}>
                  <div className="flex flex-col items-center">
                    <span className={`text-3xl font-mono font-black ${
                      timeLeft <= 5 ? "text-rose-400" : "text-white"
                    }`}>
                      {timeLeft}
                    </span>
                    <span className="text-[8px] text-zinc-500 uppercase tracking-widest">Sec</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col gap-2">
                  {isTimerActive ? (
                    <button
                      onClick={pauseTimer}
                      className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-xs font-bold rounded-xl border border-zinc-700 transition-colors cursor-pointer"
                    >
                      Pause
                    </button>
                  ) : (
                    <button
                      onClick={startTimer}
                      disabled={timeLeft === 0}
                      className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-950 text-xs font-black rounded-xl transition-colors cursor-pointer"
                    >
                      Start Clock
                    </button>
                  )}
                  <button
                    onClick={resetTimer}
                    className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* Auction Action Drawer */}
            <div className="glass-panel rounded-3xl p-6 border border-zinc-900 shadow-xl flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-zinc-300 border-b border-zinc-900/60 pb-3 mb-4 flex items-center gap-2">
                  <Gavel className="w-5 h-5 text-amber-500" />
                  <span>Auctioneer Desk</span>
                </h3>

                {/* Case 1: Sentence already revealed */}
                {isRevealed ? (
                  <div className="flex flex-col items-center text-center py-6">
                    <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-2" />
                    <h4 className="font-bold text-zinc-200">Answer Revealed</h4>
                    <p className="text-xs text-zinc-500 mt-1 px-4 leading-relaxed">
                      Scores have been computed. Advance to the next sentence to continue bidding.
                    </p>
                  </div>
                ) 
                /* Case 2: Sentence sold but not revealed */
                : saleLog ? (
                  <div className="flex flex-col gap-4 py-2">
                    <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${colorMap[teams.find(t => t.id === saleLog.teamId)?.color || 'sky'].solidBg}`} />
                        <span className="font-bold text-sm text-zinc-300">
                          {teams.find(t => t.id === saleLog.teamId)?.name}
                        </span>
                      </div>
                      <span className="font-mono font-bold text-amber-400">${saleLog.price}</span>
                    </div>

                    <button
                      onClick={handleReveal}
                      className="w-full h-14 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-zinc-950 font-black rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/20 cursor-pointer transform hover:-translate-y-0.5 transition-all duration-200"
                    >
                      <Sparkles className="w-5 h-5 fill-current text-zinc-950" />
                      <span>REVEAL ANSWER!</span>
                    </button>
                    
                    {/* Bypass Option */}
                    <div className="text-center mt-2">
                      <button
                        onClick={handleReveal}
                        className="text-[10px] text-zinc-500 hover:text-zinc-400 underline cursor-pointer"
                      >
                        Reveal without winner (Pass)
                      </button>
                    </div>
                  </div>
                ) 
                /* Case 3: Sentence is open for bids */
                : (
                  <form onSubmit={handleRecordBid} className="flex flex-col gap-4">
                    {/* Bidding Team Selection */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Select Winning Team</label>
                      <div className="grid grid-cols-2 gap-2">
                        {teams.map((team) => {
                          const theme = colorMap[team.color];
                          const isSelected = selectedBidderId === team.id;
                          return (
                            <button
                              key={team.id}
                              type="button"
                              onClick={() => setSelectedBidderId(team.id)}
                              className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all truncate flex items-center gap-2 cursor-pointer ${
                                isSelected
                                  ? `${theme.border} ${theme.bg} text-white shadow-md`
                                  : "bg-zinc-900 border-zinc-900 text-zinc-400 hover:border-zinc-800"
                              }`}
                            >
                              <span className={`w-2 h-2 rounded-full ${theme.solidBg}`} />
                              <span className="truncate">{team.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Winning Price Input */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Winning Hammer Price</label>
                      
                      <div className="flex gap-2">
                        {/* Adjust Bid Buttons */}
                        <button
                          type="button"
                          onClick={() => adjustBid(-settings.minBidIncrement)}
                          className="w-10 h-10 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-bold rounded-xl flex items-center justify-center cursor-pointer transition-colors"
                        >
                          -
                        </button>
                        
                        <div className="relative flex-1">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-zinc-500 text-sm">$</span>
                          <input
                            type="number"
                            min={50}
                            step={50}
                            value={bidAmount}
                            onChange={(e) => setBidAmount(Number(e.target.value))}
                            className="w-full h-10 bg-zinc-900/60 border border-zinc-800 rounded-xl pl-7 pr-3 text-sm text-zinc-200 focus:outline-none focus:border-cyan-500/50 text-center font-mono font-bold"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => adjustBid(settings.minBidIncrement)}
                          className="w-10 h-10 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-bold rounded-xl flex items-center justify-center cursor-pointer transition-colors"
                        >
                          +
                        </button>
                      </div>

                      {/* Quick bid helpers */}
                      <div className="grid grid-cols-4 gap-1.5 mt-1.5">
                        {[50, 100, 200, 500].map((inc) => (
                          <button
                            key={inc}
                            type="button"
                            onClick={() => setBidAmount(inc)}
                            className="py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-[10px] font-mono font-bold text-zinc-500 hover:text-zinc-300 cursor-pointer border border-zinc-900"
                          >
                            ${inc}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={teams.length === 0}
                      className="w-full h-12 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-950 font-black rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-amber-950/10 cursor-pointer transition-all mt-2"
                    >
                      <Gavel className="w-4 h-4" />
                      <span>SOLD! (Record Sale)</span>
                    </button>
                  </form>
                )}
              </div>

              {/* Navigation & Controls */}
              <div className="border-t border-zinc-900 pt-6 mt-6 flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={prevSentence}
                    disabled={currentSentenceIndex === 0}
                    className="h-10 px-3 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed border border-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>
                  
                  <button
                    onClick={nextSentence}
                    disabled={currentSentenceIndex === sentences.length - 1}
                    className="h-10 px-3 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed border border-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Quick Pass Reveal */}
                {!saleLog && !isRevealed && (
                  <button
                    onClick={handleReveal}
                    className="w-full py-2 bg-zinc-900 hover:bg-zinc-800 border border-dashed border-zinc-800 hover:border-zinc-700 text-[10px] text-zinc-500 hover:text-zinc-300 font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    No Bidders? Reveal Answer (Pass)
                  </button>
                )}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Game Over Screen Overlay */}
      {isGameOver && (
        <div className="absolute inset-0 bg-zinc-950/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 animate-fadeIn">
          {/* Confetti decorations */}
          <div className="text-center max-w-xl flex flex-col items-center gap-4">
            <Trophy className="w-20 h-20 text-yellow-500 animate-bounce drop-shadow-[0_0_20px_rgba(234,179,8,0.4)]" />
            <h2 className="text-4xl font-extrabold bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
              AUCTION GAME OVER!
            </h2>
            <p className="text-zinc-400 text-sm mt-1">
              All sentences have been bidding on and analyzed.
            </p>

            {winningTeam && (
              <div className={`mt-6 p-6 rounded-3xl border glass-panel flex flex-col items-center gap-2 ${colorMap[winningTeam.color].bg} ${colorMap[winningTeam.color].border}`}>
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">Winning Group</span>
                <h3 className="text-2xl font-black">{winningTeam.name}</h3>
                <div className="flex items-center gap-6 mt-3 text-sm font-mono">
                  <div>
                    <span className="text-[10px] text-zinc-500 block uppercase">Balance</span>
                    <strong className="text-yellow-400 text-lg">${winningTeam.balance}</strong>
                  </div>
                  {settings.scoringMode === "classic" && (
                    <div>
                      <span className="text-[10px] text-zinc-500 block uppercase">Points</span>
                      <strong className="text-emerald-400 text-lg">{winningTeam.score} pts</strong>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Scoreboard Rank List */}
            <div className="w-full max-w-sm mt-8 border border-zinc-900 rounded-2xl p-4 bg-zinc-900/10 flex flex-col gap-2">
              <h4 className="text-left text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">Final Rankings</h4>
              {sortedTeams.map((team, index) => (
                <div key={team.id} className="flex justify-between items-center text-xs py-1 border-b border-zinc-900/60 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-zinc-500 font-mono">#{index + 1}</span>
                    <span className={`w-2 h-2 rounded-full ${colorMap[team.color].solidBg}`} />
                    <span className="font-semibold">{team.name}</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-zinc-400">${team.balance}</span>
                    {settings.scoringMode === "classic" && (
                      <span className="text-emerald-400 font-bold">{team.score}p</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-10 w-full max-w-sm">
              <button
                onClick={() => {
                  if (confirm("Reset the game and start a new session?")) {
                    resetGame();
                    router.push("/english-auction");
                  }
                }}
                className="flex-1 py-3 px-4 bg-cyan-600 hover:bg-cyan-500 text-zinc-950 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Play Again</span>
              </button>
              
              <button
                onClick={() => {
                  if (confirm("Go back to setup? All scores will be reset.")) {
                    resetGame();
                    router.push("/english-auction");
                  }
                }}
                className="flex-1 py-3 px-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Return to Setup</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Small floating info banner at bottom */}
      <footer className="w-full text-center text-[10px] text-zinc-600 py-3 bg-zinc-950 border-t border-zinc-950">
        Tip: Hover to copy sentences. Present correct sentences as winning purchases.
      </footer>

    </div>
  );
}
