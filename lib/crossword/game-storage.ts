import { GameState } from "./types";

const GAME_STORAGE_KEY = "teaching-site-crossword-clash-game";

export function saveActiveGame(game: GameState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(GAME_STORAGE_KEY, JSON.stringify(game));
  } catch (e) {
    console.error("Failed to save active crossword game:", e);
  }
}

export function loadActiveGame(): GameState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(GAME_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as GameState;
    }
  } catch (e) {
    console.error("Failed to load active crossword game:", e);
  }
  return null;
}

export function clearActiveGame(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(GAME_STORAGE_KEY);
  } catch (e) {
    console.error("Failed to clear active crossword game:", e);
  }
}
