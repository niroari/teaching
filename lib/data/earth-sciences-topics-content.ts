import { EARTH_LESSON_SLIDES } from "@/lib/data/earth-sciences/slides";

export interface TopicSlideContent {
  title: string;
  subtitle: string;
  bullets: string[];
  imageUrl?: string;
  videoDetailId?: string;
  layout?: "full-width";
  /** Show this slide after the task slide (stage 3, the class summary) instead of before it. */
  afterTask?: boolean;
}

export const TOPICS_CONTENT: Record<string, TopicSlideContent[]> = {
  // Every unit keeps its slides next to each lesson (lib/data/earth-sciences/).
  ...EARTH_LESSON_SLIDES,
};
