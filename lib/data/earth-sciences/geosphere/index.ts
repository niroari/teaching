// Unit 3, geosphere: one file per 40-minute lesson, in teaching order (12 lessons, 12 hours).
import type { LessonModule } from "@/lib/data/earth-sciences/types";
import * as internalExternalForces from "./internal-external-forces";
import * as earthStructure from "./earth-structure";
import * as continentalDrift from "./continental-drift";
import * as plateTectonics from "./plate-tectonics";
import * as foldingFaulting from "./folding-faulting";
import * as earthquakes from "./earthquakes";
import * as volcanoesTsunami from "./volcanoes-tsunami";
import * as rocks from "./rocks";
import * as rockCycleTime from "./rock-cycle-time";
import * as weathering from "./weathering";
import * as erosionDeposition from "./erosion-deposition";
import * as humanImpact from "./human-impact";

export const GEOSPHERE_MODULES: LessonModule[] = [
  internalExternalForces,
  earthStructure,
  continentalDrift,
  plateTectonics,
  foldingFaulting,
  earthquakes,
  volcanoesTsunami,
  rocks,
  rockCycleTime,
  weathering,
  erosionDeposition,
  humanImpact,
];

export const GEOSPHERE_LESSONS = GEOSPHERE_MODULES.map((m) => m.lesson);
