/** A Jeopardy-style board: four categories (columns), five questions in each (100–500 points). */
export interface TriviaBank {
  categories: string[];
  /** questions[column][row], easiest first. */
  questions: { q: string; a: string }[][];
}
