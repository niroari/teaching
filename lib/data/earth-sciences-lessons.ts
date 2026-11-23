import type { Worksheet } from "@/lib/data/earth-sciences-worksheet";
import type { TriviaBank } from "@/lib/data/earth-sciences-trivia";
import { ASTRONOMY_LESSONS } from "@/lib/data/earth-sciences/astronomy";
import { ATMOSPHERE_LESSONS } from "@/lib/data/earth-sciences/atmosphere";
import { GEOSPHERE_LESSONS } from "@/lib/data/earth-sciences/geosphere";
import { RESOURCES_LESSONS } from "@/lib/data/earth-sciences/resources";

export interface NotebookConcept {
  term: string;
  definition: string;
}

/** A short YouTube video that opens the lesson. */
export interface OpeningVideo {
  youtubeId: string;
  title: string;
  /** Length in seconds, shown to the teacher. */
  seconds: number;
  /** One line for the class: what to look for while watching. */
  watchFor: string;
}

/** One stage of the 40-minute lesson, as shown in the teacher's lesson plan. */
export interface LessonStage {
  minutes: number;
  title: string;
  /** What the teacher does and asks, step by step. */
  steps: string[];
}

/** The teacher's plan for one 40-minute lesson (hook, independent work, summary). */
export interface LessonPlan {
  goals: string[];
  stages: [LessonStage, LessonStage, LessonStage];
  /** Pages in the textbook "כדור הארץ – סביבה, אדם" (מט"ח). */
  textbookPages?: string;
  /** What to prepare before class (printouts, objects for a demonstration…). */
  preparation?: string[];
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  /** Not ready for class yet: the lesson page shows "in development". */
  draft?: boolean;
  topics: string[];
  misconceptions: string[];
  hook: string;
  hookVideoId?: string; // YouTube Video ID
  hookImageUrl?: string; // Image URL
  /** Two or more photos side by side on the hook slide (local files under /images, credited). */
  hookImages?: { src: string; caption: string }[];
  hookTitle?: string; // Optional custom Hook slide title
  /** The lesson opens with these (2–3 minutes in total, ideally one striking video). Shown as the first slide. */
  openingVideos?: OpeningVideo[];
  plan?: LessonPlan;
  worksheet?: Worksheet;
  task: {
    description: string;
    instructions: string[];
  };
  summary: string[];
  notebookSummary: NotebookConcept[];
  embedUrl?: string;
  widgetId?: "astronomy" | "climograph" | "tectonics" | "footprint" | "trivia-jeopardy" | "atmosphere";
  /** Which tab of the widget opens first (for widgets with tabs, like "atmosphere"). */
  widgetTab?: number;
  /** Question bank for the "trivia-jeopardy" widget. */
  trivia?: TriviaBank;
}

export interface Unit {
  id: number;
  slug: string;
  title: string;
  hours: number;
  description: string;
  lessons: Lesson[];
}

export const EARTH_SCIENCES_UNITS: Unit[] = [
  {
    id: 1,
    slug: "astronomy",
    title: "אסטרונומיה - מסע בחלל ובזמן",
    hours: 9,
    description: "כדור הארץ כמערכת של ארבע ספירות, היקום ומערכת השמש, תנועות כדור הארץ והירח (יום ולילה, עונות, מופעים, ליקויים וגאות ושפל), וחקר החלל ופסולת החלל.",
    lessons: ASTRONOMY_LESSONS
  },
  {
    id: 2,
    slug: "atmosphere",
    title: "מזג אוויר ואקלים – תהליכים באטמוספרה",
    hours: 11,
    description: "האטמוספרה והשמש כמקור אנרגיה, לחץ אוויר ורוחות, עננים ומשקעים, קריאת מפות מזג אוויר וקלימוגרפים, ארבעה אזורי אקלים והשפעת האדם על האטמוספרה.",
    lessons: ATMOSPHERE_LESSONS
  },
  {
    id: 3,
    slug: "geosphere",
    title: "גאוספרה – מסע בנופי העולם",
    hours: 12,
    description: "חקר פנים כדור הארץ, תיאוריית טקטוניקת הלוחות, רעידות אדמה, הרי געש, מחזור הסלעים ותהליכי בליה חיצוניים המעצבים את הנוף.",
    lessons: GEOSPHERE_LESSONS
  },
  {
    id: 4,
    slug: "natural-resources",
    title: "משאבי הטבע של כדור הארץ, ניצולם ושימורם",
    hours: 8,
    description: "מיון משאבי הטבע, בעיית המחסור במים ופתרונות טכנולוגיים, משאבי אנרגיה מתכלים ומתחדשים, וסוגיות קיימות וצדק סביבתי.",
    lessons: RESOURCES_LESSONS
  }
];
