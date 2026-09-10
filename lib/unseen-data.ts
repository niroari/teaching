import { EASY_UNSEENS } from "./unseen-stories/easy";
import { MEDIUM_UNSEENS } from "./unseen-stories/medium";
import { HARD_UNSEENS } from "./unseen-stories/hard";

export interface UnseenQuestion {
  id: number;
  paragraphIndex: number;
  linesHint: string;
  type: "mcq" | "open" | "copy";
  question: string;
  options?: string[]; // Only for 'mcq'
  answerIndex?: number; // Only for 'mcq'
  suggestedAnswer?: string; // Only for 'open'
  keywords?: string[]; // Only for 'open'
  targetSentence?: string; // Only for 'copy'
  explanation: string; // Explanation in Hebrew
}

export interface UnseenData {
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  paragraphs: string[];
  questions: UnseenQuestion[];
  globalQuestion: {
    question: string;
    options: string[];
    answerIndex: number;
    explanation: string; // Explanation in Hebrew
  };
  vocabularyHints: { word: string; translation: string }[];
}

export const PRE_GENERATED_UNSEEN_LISTS: Record<"Easy" | "Medium" | "Hard", UnseenData[]> = {
  Easy: EASY_UNSEENS,
  Medium: MEDIUM_UNSEENS,
  Hard: HARD_UNSEENS
};

// Backwards compatibility map (returns the first story of each level)
export const PRE_GENERATED_UNSEENS: Record<"Easy" | "Medium" | "Hard", UnseenData> = {
  Easy: EASY_UNSEENS[0],
  Medium: MEDIUM_UNSEENS[0],
  Hard: HARD_UNSEENS[0]
};

/**
 * Returns a randomly selected unseen story for the specified difficulty.
 * If excludeTitle is provided, attempts to pick a different story than the previous one.
 */
export function getRandomUnseen(
  difficulty: "Easy" | "Medium" | "Hard",
  excludeTitle?: string
): UnseenData {
  const list = PRE_GENERATED_UNSEEN_LISTS[difficulty];
  if (!list || list.length === 0) {
    return PRE_GENERATED_UNSEENS[difficulty];
  }
  if (list.length === 1) {
    return list[0];
  }
  const filtered = excludeTitle ? list.filter((s) => s.title !== excludeTitle) : list;
  const pool = filtered.length > 0 ? filtered : list;
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}
