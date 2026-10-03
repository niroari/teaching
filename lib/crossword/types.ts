export type Direction = "across" | "down";

export interface CrosswordWord {
  id: string;
  word: string;
  clue: string;
  hebrewHint: string;
  row: number;
  col: number;
  direction: Direction;
  number: number;
  solved: boolean;
}

export interface CrosswordCell {
  row: number;
  col: number;
  letter: string; // The correct target letter (uppercase)
  isActive: boolean; // True if this cell is part of at least one word
  number?: number; // Clue number displayed in cell
  acrossWordId?: string;
  downWordId?: string;
  isRevealed: boolean;
  revealedByTeamId?: string;
  tempLetter?: string; // Currently placed by team during active turn/round
  tempTeamId?: string;
}

export interface CrosswordGrid {
  rows: number;
  cols: number;
  cells: CrosswordCell[][];
  words: CrosswordWord[];
}

export interface PlacedTile {
  row: number;
  col: number;
  letter: string;
  rackIndex: number;
}

export interface Team {
  id: string;
  name: string;
  color: string; // matches keys in lib/colors.ts (e.g. "sky", "emerald", "amber", "rose", "violet", "pink")
  score: number;
  rack: string[]; // 5 letters
  pendingPlacements: PlacedTile[];
  wordsCompleted: number;
  stats: {
    correctLetters: number;
    wrongLetters: number;
  };
}

export type GameMode = "simultaneous" | "turn-by-turn";

export interface GameSettings {
  roundTimerSeconds: number; // 0 = untimed, 60, 90, 120
  pointsPerCorrect: number; // default: 10
  penaltyPerWrong: number; // default: -5
  wordCompletionBonus: number; // default: 30
  allLettersBonus: number; // default: 20
  showHebrewHints: boolean;
}

export interface GameState {
  id: string;
  title: string;
  topic: string;
  mode: GameMode;
  grid: CrosswordGrid;
  teams: Team[];
  currentTeamIndex: number; // for turn-by-turn
  roundNumber: number;
  isTimerRunning: boolean;
  timeLeft: number;
  isGameOver: boolean;
  settings: GameSettings;
}

export interface RawVocabularyItem {
  word: string;
  clue: string;
  hebrewHint: string;
}
