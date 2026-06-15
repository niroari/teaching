"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { Sentence, builtInSentences } from "@/lib/sentences";
import { sounds } from "@/lib/sounds";

export interface Team {
  id: string;
  name: string;
  color: string; // Tailwind color class key (e.g. "emerald", "amber", "rose", "sky", "violet", "pink")
  balance: number;
  score: number; // points for correct sentences (in Classic mode)
}

export interface GameSettings {
  startingBudget: number;
  minBidIncrement: number;
  scoringMode: "classic" | "cash";
  timerDuration: number;
  soundEnabled: boolean;
}

export interface PurchaseLog {
  teamId: string;
  price: number;
}

interface GameStateContextType {
  teams: Team[];
  settings: GameSettings;
  sentences: Sentence[];
  currentSentenceIndex: number;
  purchasedSentences: Record<number, PurchaseLog>; // sentenceId -> purchase details
  revealedSentences: number[]; // sentenceId list
  gameStarted: boolean;
  isGameOver: boolean;
  timeLeft: number;
  isTimerActive: boolean;
  soundEnabled: boolean;
  
  // Actions
  addTeam: (name: string, color: string) => void;
  removeTeam: (id: string) => void;
  updateTeam: (id: string, name: string, color: string, balance: number) => void;
  updateSettings: (settings: Partial<GameSettings>) => void;
  startGame: () => void;
  resetGame: () => void;
  
  // Bidding & Play
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  recordSale: (teamId: string, price: number) => void;
  cancelSale: (sentenceId: number) => void;
  revealSentence: (sentenceId: number) => void;
  nextSentence: () => void;
  prevSentence: () => void;
  jumpToSentence: (index: number) => void;
  toggleSound: () => void;
}

const defaultSettings: GameSettings = {
  startingBudget: 1000,
  minBidIncrement: 50,
  scoringMode: "classic",
  timerDuration: 30,
  soundEnabled: true,
};

const GameStateContext = createContext<GameStateContextType | undefined>(undefined);

export const GameStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // --- Game State Variables ---
  const [teams, setTeams] = useState<Team[]>([]);
  const [settings, setSettings] = useState<GameSettings>(defaultSettings);
  const [sentences, setSentences] = useState<Sentence[]>(builtInSentences);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState<number>(0);
  const [purchasedSentences, setPurchasedSentences] = useState<Record<number, PurchaseLog>>({});
  const [revealedSentences, setRevealedSentences] = useState<number[]>([]);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(defaultSettings.timerDuration);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // --- Load Game State from LocalStorage on mount ---
  useEffect(() => {
    const savedTeams = localStorage.getItem("sa_teams");
    const savedSettings = localStorage.getItem("sa_settings");
    const savedIndex = localStorage.getItem("sa_current_index");
    const savedPurchased = localStorage.getItem("sa_purchased");
    const savedRevealed = localStorage.getItem("sa_revealed");
    const savedStarted = localStorage.getItem("sa_started");
    const savedSound = localStorage.getItem("sa_sound_enabled");
    const savedSentences = localStorage.getItem("sa_sentences");

    if (savedTeams) setTeams(JSON.parse(savedTeams));
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(parsed);
      setTimeLeft(parsed.timerDuration);
    }
    if (savedIndex) setCurrentSentenceIndex(Number(savedIndex));
    if (savedPurchased) setPurchasedSentences(JSON.parse(savedPurchased));
    if (savedRevealed) setRevealedSentences(JSON.parse(savedRevealed));
    if (savedStarted) setGameStarted(JSON.parse(savedStarted));
    if (savedSound) {
      const enabled = JSON.parse(savedSound);
      setSoundEnabled(enabled);
      sounds.toggle(enabled);
    }
    if (savedSentences) setSentences(JSON.parse(savedSentences));
  }, []);

  // --- Save State helpers ---
  const saveTeams = (newTeams: Team[]) => {
    setTeams(newTeams);
    localStorage.setItem("sa_teams", JSON.stringify(newTeams));
  };

  const saveSettings = (newSettings: GameSettings) => {
    setSettings(newSettings);
    localStorage.setItem("sa_settings", JSON.stringify(newSettings));
  };

  // --- Core Configuration Actions ---
  const addTeam = (name: string, color: string) => {
    const newTeam: Team = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      color,
      balance: settings.startingBudget,
      score: 0,
    };
    saveTeams([...teams, newTeam]);
  };

  const removeTeam = (id: string) => {
    saveTeams(teams.filter((t) => t.id !== id));
  };

  const updateTeam = (id: string, name: string, color: string, balance: number) => {
    const updated = teams.map((t) => {
      if (t.id === id) {
        return { ...t, name, color, balance };
      }
      return t;
    });
    saveTeams(updated);
  };

  const updateSettings = (newFields: Partial<GameSettings>) => {
    const updatedSettings = { ...settings, ...newFields };
    saveSettings(updatedSettings);

    // Apply starting budget updates to teams if game hasn't started yet
    if (!gameStarted && newFields.startingBudget !== undefined) {
      saveTeams(
        teams.map((t) => ({ ...t, balance: updatedSettings.startingBudget, score: 0 }))
      );
    }

    if (newFields.timerDuration !== undefined) {
      setTimeLeft(updatedSettings.timerDuration);
    }

    if (newFields.soundEnabled !== undefined) {
      setSoundEnabled(updatedSettings.soundEnabled);
      sounds.toggle(updatedSettings.soundEnabled);
      localStorage.setItem("sa_sound_enabled", JSON.stringify(updatedSettings.soundEnabled));
    }
  };

  const toggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    sounds.toggle(nextState);
    updateSettings({ soundEnabled: nextState });
  };

  const startGame = () => {
    if (teams.length === 0) {
      // Add default teams if none defined
      const defaultTeams: Team[] = [
        { id: "t1", name: "Team Blue", color: "sky", balance: settings.startingBudget, score: 0 },
        { id: "t2", name: "Team Emerald", color: "emerald", balance: settings.startingBudget, score: 0 },
        { id: "t3", name: "Team Amber", color: "amber", balance: settings.startingBudget, score: 0 },
      ];
      saveTeams(defaultTeams);
    }

    // Shuffle sentences on game start so they are mixed
    const shuffleSentences = (array: Sentence[]): Sentence[] => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };
    const shuffled = shuffleSentences(builtInSentences);
    setSentences(shuffled);
    localStorage.setItem("sa_sentences", JSON.stringify(shuffled));

    setGameStarted(true);
    setCurrentSentenceIndex(0);
    setPurchasedSentences({});
    setRevealedSentences([]);
    setTimeLeft(settings.timerDuration);
    setIsTimerActive(false);

    localStorage.setItem("sa_started", "true");
    localStorage.setItem("sa_current_index", "0");
    localStorage.setItem("sa_purchased", "{}");
    localStorage.setItem("sa_revealed", "[]");
  };

  const resetGame = () => {
    setGameStarted(false);
    setCurrentSentenceIndex(0);
    setPurchasedSentences({});
    setRevealedSentences([]);
    setTimeLeft(settings.timerDuration);
    setIsTimerActive(false);
    setSentences(builtInSentences);
    localStorage.removeItem("sa_sentences");

    // Reset team balances and scores
    saveTeams(
      teams.map((t) => ({ ...t, balance: settings.startingBudget, score: 0 }))
    );

    localStorage.setItem("sa_started", "false");
    localStorage.setItem("sa_current_index", "0");
    localStorage.setItem("sa_purchased", "{}");
    localStorage.setItem("sa_revealed", "[]");
  };

  // --- Bidding & Timer Control ---
  const startTimer = () => {
    setIsTimerActive(true);
  };

  const pauseTimer = () => {
    setIsTimerActive(false);
  };

  const resetTimer = () => {
    setIsTimerActive(false);
    setTimeLeft(settings.timerDuration);
  };

  // Timer tick effect
  useEffect(() => {
    if (isTimerActive && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsTimerActive(false);
            sounds.playGavel(); // Gavel when timer expires
            return 0;
          }
          // Play tick sound for final 5 seconds
          if (prev <= 6) {
            sounds.playTick();
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isTimerActive, timeLeft]);

  // Record a bid purchase
  const recordSale = (teamId: string, price: number) => {
    const currentSentence = sentences[currentSentenceIndex];
    if (!currentSentence) return;

    // Pause timer since sentence is sold
    setIsTimerActive(false);
    sounds.playGavel();

    // 1. Log the purchase
    const updatedPurchased = {
      ...purchasedSentences,
      [currentSentence.id]: { teamId, price },
    };
    setPurchasedSentences(updatedPurchased);
    localStorage.setItem("sa_purchased", JSON.stringify(updatedPurchased));

    // 2. Adjust team balance immediately
    const updatedTeams = teams.map((team) => {
      if (team.id === teamId) {
        return {
          ...team,
          balance: team.balance - price,
        };
      }
      return team;
    });
    saveTeams(updatedTeams);
  };

  const cancelSale = (sentenceId: number) => {
    const log = purchasedSentences[sentenceId];
    if (!log) return;

    // Refund team balance
    const updatedTeams = teams.map((team) => {
      if (team.id === log.teamId) {
        return {
          ...team,
          balance: team.balance + log.price,
        };
      }
      return team;
    });
    saveTeams(updatedTeams);

    // Remove from logs
    const updatedPurchased = { ...purchasedSentences };
    delete updatedPurchased[sentenceId];
    setPurchasedSentences(updatedPurchased);
    localStorage.setItem("sa_purchased", JSON.stringify(updatedPurchased));

    // Remove from revealed if it was there
    if (revealedSentences.includes(sentenceId)) {
      const updatedRevealed = revealedSentences.filter((id) => id !== sentenceId);
      setRevealedSentences(updatedRevealed);
      localStorage.setItem("sa_revealed", JSON.stringify(updatedRevealed));

      // Re-adjust score/cash if they got it back
      const sentence = sentences.find((s) => s.id === sentenceId);
      if (sentence) {
        const teamRefund = updatedTeams.map((team) => {
          if (team.id === log.teamId) {
            let refundScore = team.score;
            let refundBalance = team.balance;
            
            if (settings.scoringMode === "classic") {
              if (sentence.isCorrect) {
                refundScore = Math.max(0, team.score - 1);
              }
            } else {
              // cash mode: correct got bid money *back* as rewards. Incorrect lost it.
              // (Since we already refunded the bid itself, we undo the gain/loss of cash mode)
              if (sentence.isCorrect) {
                // If correct, they had gained the bid amount in addition. So subtract it.
                refundBalance = team.balance - log.price;
              } else {
                // If incorrect, they had lost it. Since they were refunded, no changes needed.
              }
            }

            return {
              ...team,
              score: refundScore,
              balance: refundBalance
            };
          }
          return team;
        });
        saveTeams(teamRefund);
      }
    }
  };

  // Reveal correct/incorrect answer and apply rules
  const revealSentence = (sentenceId: number) => {
    if (revealedSentences.includes(sentenceId)) return;

    const sentence = sentences.find((s) => s.id === sentenceId);
    if (!sentence) return;

    // Mark as revealed
    const updatedRevealed = [...revealedSentences, sentenceId];
    setRevealedSentences(updatedRevealed);
    localStorage.setItem("sa_revealed", JSON.stringify(updatedRevealed));

    const log = purchasedSentences[sentenceId];

    // Trigger audio success or buzzer
    if (sentence.isCorrect) {
      sounds.playSuccess();
    } else {
      sounds.playBuzzer();
    }

    if (log) {
      const updatedTeams = teams.map((team) => {
        if (team.id === log.teamId) {
          let newScore = team.score;
          let newBalance = team.balance;

          if (settings.scoringMode === "classic") {
            if (sentence.isCorrect) {
              // Classic Mode: Keep the money, earn 1 point!
              newScore = team.score + 1;
              newBalance = team.balance + log.price; // Refund bid amount (they don't lose money on correct sentences)
            } else {
              // Classic Mode: Lose bid amount (already deducted during recordSale)
            }
          } else {
            // Cash Mode:
            // Correct sentence: Team wins the value of the bid (Refund their bid + give them another equivalent amount!)
            if (sentence.isCorrect) {
              newBalance = team.balance + log.price * 2; // Refund bid + win bid
            } else {
              // Incorrect sentence: Team loses the money (no refund, already deducted)
            }
          }

          return { ...team, score: newScore, balance: newBalance };
        }
        return team;
      });
      saveTeams(updatedTeams);
    }
  };

  // --- Navigation ---
  const updateSentenceIndex = (newIndex: number) => {
    if (newIndex >= 0 && newIndex < sentences.length) {
      setCurrentSentenceIndex(newIndex);
      localStorage.setItem("sa_current_index", String(newIndex));
      // Reset timer for the new sentence
      setTimeLeft(settings.timerDuration);
      setIsTimerActive(false);
    }
  };

  const nextSentence = () => {
    updateSentenceIndex(currentSentenceIndex + 1);
  };

  const prevSentence = () => {
    updateSentenceIndex(currentSentenceIndex - 1);
  };

  const jumpToSentence = (index: number) => {
    updateSentenceIndex(index);
  };

  const isGameOver = gameStarted && currentSentenceIndex >= sentences.length - 1 && revealedSentences.length === Object.keys(purchasedSentences).length && Object.keys(purchasedSentences).length > 0;

  // Celebrate on game over
  useEffect(() => {
    if (isGameOver) {
      sounds.playCheer();
    }
  }, [isGameOver]);

  return (
    <GameStateContext.Provider
      value={{
        teams,
        settings,
        sentences: sentences,
        currentSentenceIndex,
        purchasedSentences,
        revealedSentences,
        gameStarted,
        isGameOver,
        timeLeft,
        isTimerActive,
        soundEnabled,
        addTeam,
        removeTeam,
        updateTeam,
        updateSettings,
        startGame,
        resetGame,
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
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
};

export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (context === undefined) {
    throw new Error("useGameState must be used within a GameStateProvider");
  }
  return context;
};
