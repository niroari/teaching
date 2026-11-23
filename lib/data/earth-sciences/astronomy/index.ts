// Unit 1, astronomy: one file per 40-minute lesson, in teaching order (9 lessons, 9 hours: 8 content + a trivia review).
import type { LessonModule } from "@/lib/data/earth-sciences/types";
import * as introSpheres from "./intro-spheres";
import * as universeScale from "./universe-scale";
import * as solarSystem from "./solar-system";
import * as earthRotation from "./earth-rotation";
import * as seasons from "./seasons";
import * as moonPhases from "./moon-phases";
import * as eclipsesTides from "./eclipses-tides";
import * as spaceExploration from "./space-exploration";
import * as triviaReview from "./trivia-review";

export const ASTRONOMY_MODULES: LessonModule[] = [
  introSpheres,
  universeScale,
  solarSystem,
  earthRotation,
  seasons,
  moonPhases,
  eclipsesTides,
  spaceExploration,
  triviaReview,
];

export const ASTRONOMY_LESSONS = ASTRONOMY_MODULES.map((m) => m.lesson);
