// A lesson's worksheet. The same data renders as the digital task on the lesson page
// and as the printable sheet at /earth-sciences/<unit>/<lesson>/worksheet.

/** Multiple choice. `answer` is the index of the correct option. */
export interface ChoiceItem {
  kind: "choice";
  id: string;
  prompt: string;
  options: string[];
  answer: number;
  /** Shown after checking, and in the answer key. */
  explanation?: string;
}

/** Open answer. `answer` is a model answer for checking and for the answer key. */
export interface TextItem {
  kind: "text";
  id: string;
  prompt: string;
  /** Writing lines on the printed sheet. */
  lines?: number;
  answer: string;
}

/** Comparison table: one row per criterion, one column per thing being compared. */
export interface TableItem {
  kind: "table";
  id: string;
  prompt: string;
  /** Header of the first column, e.g. "תבחין". */
  rowHeader: string;
  columns: string[];
  rows: { label: string; answers: string[] }[];
}

/** Sort cards into categories. `answer` on each card is the index of its category. */
export interface SortItem {
  kind: "sort";
  id: string;
  prompt: string;
  categories: string[];
  cards: { text: string; answer: number }[];
}

export type WorksheetItem = ChoiceItem | TextItem | TableItem | SortItem;

export interface WorksheetSection {
  title: string;
  /** A short reading passage shown before the questions. Paragraphs split by blank lines. */
  text?: string;
  image?: { src: string; alt: string; caption?: string };
  items: WorksheetItem[];
}

export interface Worksheet {
  title: string;
  /** One line telling students how to work (pairs, time, etc.). */
  instructions?: string;
  sections: WorksheetSection[];
}

/** Answers are stored as strings, keyed per item (and per cell / card where needed). */
export type WorksheetAnswers = Record<string, string>;

/** Question numbers run across sections: 1, 2, 3… */
export function questionNumbers(worksheet: Worksheet): Map<string, number> {
  const ids = worksheet.sections.flatMap((s) => s.items.map((i) => i.id));
  return new Map(ids.map((id, i) => [id, i + 1]));
}

export const tableKey = (itemId: string, row: number, col: number) => `${itemId}:${row}:${col}`;
export const sortKey = (itemId: string, card: number) => `${itemId}:${card}`;
