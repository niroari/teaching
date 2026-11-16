// Unit 4, natural resources: one file per 40-minute lesson, in teaching order (8 lessons, 8 hours).
import type { LessonModule } from "@/lib/data/earth-sciences/types";
import * as resourceTypes from "./resource-types";
import * as waterScarcity from "./water-scarcity";
import * as waterSolutions from "./water-solutions";
import * as fossilEnergy from "./fossil-energy";
import * as renewableEnergy from "./renewable-energy";
import * as mineralsMining from "./minerals-mining";
import * as environmentalJustice from "./environmental-justice";
import * as sustainabilityFootprint from "./sustainability-footprint";

export const RESOURCES_MODULES: LessonModule[] = [
  resourceTypes,
  waterScarcity,
  waterSolutions,
  fossilEnergy,
  renewableEnergy,
  mineralsMining,
  environmentalJustice,
  sustainabilityFootprint,
];

export const RESOURCES_LESSONS = RESOURCES_MODULES.map((m) => m.lesson);
