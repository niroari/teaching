// Every piece of content a student could open, with a stable id.
// The teacher chooses which ids are visible (Firestore: settings/visibility);
// everything else is hidden from students and logged-out visitors.
//
// Adding a new page? Register it here, or students will not be able to open it.
// Earth Sciences lessons are registered automatically from EARTH_SCIENCES_UNITS.

import { EARTH_SCIENCES_UNITS } from "@/lib/data/earth-sciences-lessons";

export type Subject = "shelach" | "english" | "enrichment" | "earth" | "other";
export type ContentKind = "lesson" | "presentation" | "game" | "tool" | "assignment";

export interface ContentItem {
  id: string;
  title: string;
  subject: Subject;
  kind: ContentKind;
  /** Route prefix that this item controls (sub-routes inherit it). Absent for sections that live inside a hub page. */
  path?: string;
  /** Sub-group inside a subject (e.g. an Earth Sciences unit). */
  group?: string;
}

export const SUBJECTS: Record<Subject, { title: string; hubPath?: string }> = {
  earth: { title: "מדעי כדור הארץ", hubPath: "/earth-sciences" },
  english: { title: "אנגלית", hubPath: "/english" },
  shelach: { title: "של״ח", hubPath: "/shelach" },
  enrichment: { title: "העשרה", hubPath: "/enrichment" },
  other: { title: "עמודים נוספים (ללא כרטיס בדף הבית)" },
};

export const KIND_LABELS: Record<ContentKind, string> = {
  lesson: "שיעור",
  presentation: "מצגת",
  game: "משחק",
  tool: "כלי",
  assignment: "משימה",
};

const earthLessons: ContentItem[] = EARTH_SCIENCES_UNITS.flatMap((unit) =>
  unit.lessons.map((lesson) => ({
    id: earthLessonId(unit.slug, lesson.id),
    title: lesson.title,
    subject: "earth" as const,
    kind: "lesson" as const,
    path: `/earth-sciences/${unit.slug}/${lesson.id}`,
    group: `יחידה ${unit.id}: ${unit.title}`,
  }))
);

export function earthLessonId(unitSlug: string, lessonId: string) {
  return `earth.${unitSlug}.${lessonId}`;
}

export const CONTENT_ITEMS: ContentItem[] = [
  // ── Earth Sciences ──
  { id: "earth.mission", title: "עבודת חקר: משימת בית חדש 🚀", subject: "earth", kind: "assignment", path: "/earth-sciences/mission", group: "משימות ומשאבים" },
  { id: "earth.resources", title: "משאבים ועזרים (סימולטורים וקישורים)", subject: "earth", kind: "tool", group: "משימות ומשאבים" },
  ...earthLessons,

  // ── English ──
  { id: "english.crossword-clash", title: "Crossword Clash", subject: "english", kind: "game", path: "/english/crossword-clash" },
  { id: "english.sentence-auction", title: "The Sentence Auction", subject: "english", kind: "game", path: "/english-auction" },
  { id: "english.chat-masters", title: "Chat Masters", subject: "english", kind: "assignment", path: "/english/chat-masters" },
  { id: "english.adjectives", title: "שמות תואר (Adjectives)", subject: "english", kind: "presentation", path: "/english/adjectives" },
  { id: "english.simone-biles", title: "Simone Biles: Present Tenses", subject: "english", kind: "presentation", path: "/english/simone-biles" },
  { id: "english.past-simple", title: "עבר פשוט (Past Simple)", subject: "english", kind: "presentation", path: "/english/past-simple" },

  // ── Shelach ──
  { id: "shelach.nofadam", title: "נופאדם", subject: "shelach", kind: "lesson", path: "/shelach/nofadam" },
  { id: "shelach.mifhaz", title: "המהפך הציוני במישור החוף", subject: "shelach", kind: "lesson", path: "/shelach/mifhaz" },
  { id: "shelach.har", title: "ההר כערש האומה", subject: "shelach", kind: "lesson", path: "/shelach/har" },
  { id: "shelach.teva", title: "מפגש טבע בארץ ישראל", subject: "shelach", kind: "lesson", path: "/shelach/teva" },
  { id: "shelach.tarbuyot", title: "מפגש תרבויות בארץ ישראל", subject: "shelach", kind: "lesson", path: "/shelach/tarbuyot" },
  { id: "shelach.gicha", title: "גיחה מחנאית", subject: "shelach", kind: "tool", path: "/shelach/gicha" },

  // ── Enrichment ──
  { id: "enrichment.israeli-politics", title: "עושים סדר בפוליטיקה הישראלית", subject: "enrichment", kind: "presentation", path: "/enrichment/israeli-politics" },
  { id: "enrichment.israel-game", title: "חידון מפת ישראל", subject: "enrichment", kind: "game", path: "/enrichment/israel-game" },
  { id: "enrichment.evolution", title: "אבולוציה", subject: "enrichment", kind: "lesson", path: "/enrichment/evolution" },
  { id: "enrichment.human-history", title: "קיצור תולדות האנושות", subject: "enrichment", kind: "lesson", path: "/enrichment/human-history" },
  { id: "enrichment.google-earth", title: "סיורי Google Earth", subject: "enrichment", kind: "tool", path: "/enrichment/google-earth" },
  { id: "enrichment.snakes", title: "נחשים בישראל", subject: "enrichment", kind: "presentation", path: "/snakes" },

  // ── Pages with no card on the home page ──
  { id: "other.values-auction", title: "מכירה פומבית של ערכים", subject: "other", kind: "game", path: "/values-auction" },
];

export const CONTENT_BY_ID = new Map(CONTENT_ITEMS.map((i) => [i.id, i]));

/** Pages anyone can open, whatever is visible. /admin has its own teacher check. */
const ALWAYS_OPEN_PREFIXES = ["/login", "/admin", "/credits", "/parents"];

export function isAlwaysOpenPath(pathname: string) {
  return pathname === "/" || ALWAYS_OPEN_PREFIXES.some((p) => matchesPrefix(pathname, p));
}

export function hubSubjectForPath(pathname: string): Subject | null {
  const clean = normalize(pathname);
  for (const [subject, info] of Object.entries(SUBJECTS) as [Subject, { hubPath?: string }][]) {
    if (info.hubPath && info.hubPath === clean) return subject;
  }
  return null;
}

/** The registered item whose path is the longest prefix of the URL. */
export function findItemForPath(pathname: string): ContentItem | null {
  const clean = normalize(pathname);
  let best: ContentItem | null = null;
  for (const item of CONTENT_ITEMS) {
    if (!item.path || !matchesPrefix(clean, item.path)) continue;
    if (!best || item.path.length > (best.path?.length ?? 0)) best = item;
  }
  return best;
}

function matchesPrefix(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(prefix + "/");
}

function normalize(pathname: string) {
  let p = pathname;
  try {
    p = decodeURIComponent(pathname);
  } catch {
    // keep the raw path
  }
  return p.length > 1 ? p.replace(/\/+$/, "") : p;
}
