import {
  CrosswordGrid,
  CrosswordWord,
  CrosswordCell,
  Direction,
  RawVocabularyItem,
  Team,
  PlacedTile
} from "./types";

interface CandidatePlacement {
  word: string;
  clue: string;
  hebrewHint: string;
  row: number;
  col: number;
  direction: Direction;
  intersections: number;
}

const DEFAULT_ROWS = 8;
const DEFAULT_COLS = 10;

/**
 * Sanitizes words to uppercase English A-Z only.
 */
export function sanitizeWord(word: string): string {
  return word.toUpperCase().replace(/[^A-Z]/g, "");
}

/**
 * Generates an interlocking crossword puzzle grid for an 8x10 board.
 */
export function generateCrosswordGrid(
  rawWords: RawVocabularyItem[],
  maxRows: number = DEFAULT_ROWS,
  maxCols: number = DEFAULT_COLS
): CrosswordGrid {
  // Filter and sanitize words that fit in bounds
  const validWords = rawWords
    .map(w => ({
      word: sanitizeWord(w.word),
      clue: w.clue,
      hebrewHint: w.hebrewHint
    }))
    .filter(w => w.word.length >= 3 && w.word.length <= Math.max(maxRows, maxCols))
    .sort((a, b) => b.word.length - a.word.length);

  if (validWords.length === 0) {
    return createEmptyGrid(maxRows, maxCols);
  }

  let bestPlaced: CandidatePlacement[] = [];
  let bestScore = -1;

  // Run multiple random iterations to find the most interconnected, aesthetically packed layout
  const attempts = 30;

  for (let attempt = 0; attempt < attempts; attempt++) {
    // Shuffle slightly while keeping longer words near front
    const shuffled = [...validWords];
    if (attempt > 0) {
      // Perturb order slightly
      for (let i = 1; i < shuffled.length; i++) {
        if (Math.random() < 0.4) {
          const j = Math.max(0, i - 1);
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
      }
    }

    const gridMatrix: (string | null)[][] = Array.from({ length: maxRows }, () =>
      Array(maxCols).fill(null)
    );
    const placed: CandidatePlacement[] = [];

    // Place the first word near the center horizontally
    const first = shuffled[0];
    if (first.word.length > maxCols) continue;

    const startRow = Math.floor((maxRows - 1) / 2);
    const startCol = Math.max(0, Math.floor((maxCols - first.word.length) / 2));

    placeWordOnMatrix(gridMatrix, first.word, startRow, startCol, "across");
    placed.push({
      ...first,
      row: startRow,
      col: startCol,
      direction: "across",
      intersections: 0
    });

    // Try placing subsequent words
    for (let w = 1; w < shuffled.length; w++) {
      const target = shuffled[w];
      const candidates: CandidatePlacement[] = [];

      // Check intersections with all placed words
      for (const p of placed) {
        const nextDir: Direction = p.direction === "across" ? "down" : "across";

        for (let i = 0; i < p.word.length; i++) {
          const letter = p.word[i];
          const intersectRow = p.direction === "across" ? p.row : p.row + i;
          const intersectCol = p.direction === "across" ? p.col + i : p.col;

          // Find matching letters in target
          for (let j = 0; j < target.word.length; j++) {
            if (target.word[j] === letter) {
              const testRow = nextDir === "across" ? intersectRow : intersectRow - j;
              const testCol = nextDir === "across" ? intersectCol - j : intersectCol;

              if (canPlaceWord(gridMatrix, target.word, testRow, testCol, nextDir, maxRows, maxCols)) {
                const countIntersects = countIntersections(gridMatrix, target.word, testRow, testCol, nextDir);
                candidates.push({
                  ...target,
                  row: testRow,
                  col: testCol,
                  direction: nextDir,
                  intersections: countIntersects
                });
              }
            }
          }
        }
      }

      if (candidates.length > 0) {
        // Sort candidates by most intersections and central positioning
        candidates.sort((a, b) => {
          if (b.intersections !== a.intersections) {
            return b.intersections - a.intersections;
          }
          const distA = Math.abs(a.row - maxRows / 2) + Math.abs(a.col - maxCols / 2);
          const distB = Math.abs(b.row - maxRows / 2) + Math.abs(b.col - maxCols / 2);
          return distA - distB;
        });

        const chosen = candidates[0];
        placeWordOnMatrix(gridMatrix, chosen.word, chosen.row, chosen.col, chosen.direction);
        placed.push(chosen);
      }
    }

    // Evaluate layout score
    const totalIntersects = placed.reduce((acc, p) => acc + p.intersections, 0);
    const score = placed.length * 100 + totalIntersects * 20;

    if (score > bestScore && placed.length >= Math.min(4, validWords.length)) {
      bestScore = score;
      bestPlaced = placed;
    }
  }

  // Fallback if failed to place enough words: use bestPlaced or first 3
  if (bestPlaced.length === 0 && validWords.length > 0) {
    const first = validWords[0];
    bestPlaced = [{
      ...first,
      row: Math.floor(maxRows / 2),
      col: 0,
      direction: "across",
      intersections: 0
    }];
  }

  // Format into final CrosswordGrid structure
  return buildFinalGrid(bestPlaced, maxRows, maxCols);
}

function canPlaceWord(
  grid: (string | null)[][],
  word: string,
  row: number,
  col: number,
  dir: Direction,
  maxRows: number,
  maxCols: number
): boolean {
  // Boundary check
  if (row < 0 || col < 0) return false;
  if (dir === "across" && (col + word.length > maxCols || row >= maxRows)) return false;
  if (dir === "down" && (row + word.length > maxRows || col >= maxCols)) return false;

  // Check cell before start
  if (dir === "across" && col > 0 && grid[row][col - 1] !== null) return false;
  if (dir === "down" && row > 0 && grid[row - 1][col] !== null) return false;

  // Check cell after end
  if (dir === "across" && col + word.length < maxCols && grid[row][col + word.length] !== null) return false;
  if (dir === "down" && row + word.length < maxRows && grid[row + word.length][col] !== null) return false;

  let hasIntersection = false;

  for (let i = 0; i < word.length; i++) {
    const r = dir === "across" ? row : row + i;
    const c = dir === "across" ? col + i : col;
    const current = grid[r][c];

    if (current !== null) {
      if (current !== word[i]) {
        return false; // Collision with different letter
      }
      hasIntersection = true;
    } else {
      // If cell is empty, check parallel neighbors so we don't accidentally merge with an adjacent word
      if (dir === "across") {
        if (r > 0 && grid[r - 1][c] !== null) return false;
        if (r + 1 < maxRows && grid[r + 1][c] !== null) return false;
      } else {
        if (c > 0 && grid[r][c - 1] !== null) return false;
        if (c + 1 < maxCols && grid[r][c + 1] !== null) return false;
      }
    }
  }

  return hasIntersection;
}

function countIntersections(
  grid: (string | null)[][],
  word: string,
  row: number,
  col: number,
  dir: Direction
): number {
  let count = 0;
  for (let i = 0; i < word.length; i++) {
    const r = dir === "across" ? row : row + i;
    const c = dir === "across" ? col + i : col;
    if (grid[r][c] === word[i]) {
      count++;
    }
  }
  return count;
}

function placeWordOnMatrix(
  grid: (string | null)[][],
  word: string,
  row: number,
  col: number,
  dir: Direction
): void {
  for (let i = 0; i < word.length; i++) {
    const r = dir === "across" ? row : row + i;
    const c = dir === "across" ? col + i : col;
    grid[r][c] = word[i];
  }
}

function createEmptyGrid(rows: number, cols: number): CrosswordGrid {
  const cells: CrosswordCell[][] = Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => ({
      row: r,
      col: c,
      letter: "",
      isActive: false,
      isRevealed: false
    }))
  );
  return { rows, cols, cells, words: [] };
}

function buildFinalGrid(
  placed: CandidatePlacement[],
  rows: number,
  cols: number
): CrosswordGrid {
  // Sort placed words in reading order (top to bottom, left to right) for numbering
  placed.sort((a, b) => {
    if (a.row !== b.row) return a.row - b.row;
    return a.col - b.col;
  });

  const cells: CrosswordCell[][] = Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => ({
      row: r,
      col: c,
      letter: "",
      isActive: false,
      isRevealed: false
    }))
  );

  // Assign numbers to starting cells
  const words: CrosswordWord[] = [];
  let clueNumber = 1;
  const cellNumberMap: Map<string, number> = new Map();

  for (const p of placed) {
    const key = `${p.row},${p.col}`;
    let num = cellNumberMap.get(key);
    if (!num) {
      num = clueNumber++;
      cellNumberMap.set(key, num);
    }

    const wordId = `${p.direction}-${num}`;
    words.push({
      id: wordId,
      word: p.word,
      clue: p.clue,
      hebrewHint: p.hebrewHint,
      row: p.row,
      col: p.col,
      direction: p.direction,
      number: num,
      solved: false
    });

    // Populate cells
    for (let i = 0; i < p.word.length; i++) {
      const r = p.direction === "across" ? p.row : p.row + i;
      const c = p.direction === "across" ? p.col + i : p.col;

      const cell = cells[r][c];
      cell.isActive = true;
      cell.letter = p.word[i];

      if (i === 0) {
        cell.number = num;
      }

      if (p.direction === "across") {
        cell.acrossWordId = wordId;
      } else {
        cell.downWordId = wordId;
      }
    }
  }

  return { rows, cols, cells, words };
}

/**
 * Extracts all letters remaining in unrevealed cells.
 */
export function getRemainingLetters(grid: CrosswordGrid): string[] {
  const letters: string[] = [];
  for (let r = 0; r < grid.rows; r++) {
    for (let c = 0; c < grid.cols; c++) {
      const cell = grid.cells[r][c];
      if (cell.isActive && !cell.isRevealed) {
        letters.push(cell.letter);
      }
    }
  }
  return letters;
}

/**
 * Generates a 5-letter rack for a team.
 * Guarantees at least 2 playable letters from the current unrevealed board cells,
 * filled out with other letters from the puzzle vocabulary.
 */
export function dealTeamRack(grid: CrosswordGrid, currentRack: string[] = []): string[] {
  const neededLetters = getRemainingLetters(grid);
  const commonVowels = ["A", "E", "I", "O", "U"];
  const commonConsonants = ["R", "S", "T", "L", "N"];

  const rack = [...currentRack];
  const targetCount = 5;

  while (rack.length < targetCount) {
    if (neededLetters.length > 0 && Math.random() < 0.75) {
      // Pick a needed letter from the board
      const idx = Math.floor(Math.random() * neededLetters.length);
      rack.push(neededLetters.splice(idx, 1)[0]);
    } else {
      // Pick a random vowel or consonant
      const pool = Math.random() < 0.4 ? commonVowels : commonConsonants;
      rack.push(pool[Math.floor(Math.random() * pool.length)]);
    }
  }

  // Shuffle rack
  return rack.sort(() => Math.random() - 0.5);
}

/**
 * Checks if a word is completely solved on the grid.
 */
export function isWordSolved(grid: CrosswordGrid, word: CrosswordWord): boolean {
  for (let i = 0; i < word.word.length; i++) {
    const r = word.direction === "across" ? word.row : word.row + i;
    const c = word.direction === "across" ? word.col + i : word.col;
    if (!grid.cells[r][c].isRevealed) {
      return false;
    }
  }
  return true;
}
