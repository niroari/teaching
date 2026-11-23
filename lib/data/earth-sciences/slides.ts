import type { TopicSlideContent } from "@/lib/data/earth-sciences-topics-content";
import { ATMOSPHERE_MODULES } from "@/lib/data/earth-sciences/atmosphere";
import { GEOSPHERE_MODULES } from "@/lib/data/earth-sciences/geosphere";
import { RESOURCES_MODULES } from "@/lib/data/earth-sciences/resources";

/** Topic slides of the unit 2–4 lessons, keyed by lesson id. */
export const EARTH_LESSON_SLIDES: Record<string, TopicSlideContent[]> = Object.fromEntries(
  [...ATMOSPHERE_MODULES, ...GEOSPHERE_MODULES, ...RESOURCES_MODULES].map((m) => [m.lesson.id, m.slides])
);
