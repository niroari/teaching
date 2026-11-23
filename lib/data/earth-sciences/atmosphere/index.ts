// Unit 2, weather and climate: one file per 40-minute lesson, in teaching order (11 lessons, 11 hours).
import type { LessonModule } from "@/lib/data/earth-sciences/types";
import * as atmosphereStructure from "./atmosphere-structure";
import * as radiationBalance from "./radiation-balance";
import * as weatherClimateTemperature from "./weather-climate-temperature";
import * as pressureWinds from "./pressure-winds";
import * as humidityClouds from "./humidity-clouds";
import * as precipitationStorms from "./precipitation-storms";
import * as synopticClimograph from "./synoptic-climograph";
import * as climateZones from "./climate-zones";
import * as humanImpactAtmosphere from "./human-impact-atmosphere";
import * as atmosphereReview from "./atmosphere-review";
import * as atmosphereSkills from "./atmosphere-skills";

export const ATMOSPHERE_MODULES: LessonModule[] = [
  atmosphereStructure,
  radiationBalance,
  weatherClimateTemperature,
  pressureWinds,
  humidityClouds,
  precipitationStorms,
  synopticClimograph,
  climateZones,
  humanImpactAtmosphere,
  atmosphereReview,
  atmosphereSkills,
];

export const ATMOSPHERE_LESSONS = ATMOSPHERE_MODULES.map((m) => m.lesson);
