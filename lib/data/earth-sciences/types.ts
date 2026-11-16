import type { Lesson } from "@/lib/data/earth-sciences-lessons";
import type { TopicSlideContent } from "@/lib/data/earth-sciences-topics-content";

/**
 * One lesson of units 3–4: the lesson itself and its topic slides, kept in one file.
 * `slides[i]` is the rich slide for `lesson.topics[i]`.
 */
export interface LessonModule {
  lesson: Lesson;
  slides: TopicSlideContent[];
}
