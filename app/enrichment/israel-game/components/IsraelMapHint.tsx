"use client";

import React from "react";
import { MapPin } from "lucide-react";
import { Place } from "../places";

interface IsraelMapHintProps {
  place: Place | null;
  showHint: boolean;
  isProjector?: boolean;
  isLight?: boolean;
}

export function IsraelMapHint({
  place,
  showHint,
  isProjector = false,
  isLight = false,
}: IsraelMapHintProps) {
  // Outline coordinates for Israel silhouette
  const israelPath =
    "M 33 8 L 32 19 L 30 40 L 25 49 L 22 54 L 20 60 L 45 95 L 47 78 L 49 58 L 50 52 L 48 30 L 48 25 L 47 15 L 51 10 L 49 4 Z";

  const getRegionInfo = (region?: Place["region"]) => {
    switch (region) {
      case "north":
        return {
          title: "צפון הארץ",
          description: "הגליל, הגולן, עמק יזרעאל ורצועת החוף הצפונית",
          badgeBg: "bg-sky-500/15 text-sky-400 border-sky-500/30",
          y: 0,
          height: 32,
          x: 0,
          width: 100,
        };
      case "center":
        return {
          title: "מרכז הארץ",
          description: "מישור החוף, גוש דן, השרון והשפלה",
          badgeBg: "bg-amber-500/15 text-amber-400 border-amber-500/30",
          y: 32,
          height: 23,
          x: 0,
          width: 100,
        };
      case "jerusalem":
        return {
          title: "אזור ירושלים",
          description: "הרי ירושלים, יהודה ופרוזדור ירושלים",
          badgeBg: "bg-purple-500/15 text-purple-400 border-purple-500/30",
          y: 40,
          height: 15,
          x: 30,
          width: 70,
        };
      case "east":
        return {
          title: "מזרח ובקעת הירדן",
          description: "בקעת הירדן, עמק המעיינות וצפון ים המלח",
          badgeBg: "bg-teal-500/15 text-teal-400 border-teal-500/30",
          y: 28,
          height: 30,
          x: 42,
          width: 58,
        };
      case "south":
        return {
          title: "דרום הארץ",
          description: "הנגב, צפון הנגב, הערבה ואילת",
          badgeBg: "bg-orange-500/15 text-orange-400 border-orange-500/30",
          y: 55,
          height: 45,
          x: 0,
          width: 100,
        };
      default:
        return {
          title: "ישראל",
          description: "",
          badgeBg: "bg-blue-500/15 text-blue-400 border-blue-500/30",
          y: 0,
          height: 100,
          x: 0,
          width: 100,
        };
    }
  };

  const regionInfo = place ? getRegionInfo(place.region) : null;
  const clipId = `israel-map-clip-${isProjector ? "proj" : "main"}`;

  return (
    <div
      className={`flex flex-col items-center justify-between transition-all duration-300 ${
        isProjector
          ? "w-full max-w-xs bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl"
          : isLight
          ? "w-full bg-white border border-zinc-200 p-5 rounded-3xl shadow-sm"
          : "w-full bg-surface/60 backdrop-blur-md border border-border-custom p-6 rounded-3xl shadow-xl"
      }`}
    >
      {/* Title */}
      <div className="w-full text-right mb-3 flex items-center justify-between border-b pb-2 border-inherit">
        <h3
          className={`text-sm font-bold flex items-center gap-2 ${
            isProjector
              ? "text-white"
              : isLight
              ? "text-zinc-900"
              : "text-white"
          }`}
        >
          <MapPin className="w-4 h-4 text-enrichment" />
          <span>רמז מפה (הארת אזור בארץ)</span>
        </h3>
        {showHint && regionInfo && (
          <span
            className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold animate-pulse ${regionInfo.badgeBg}`}
          >
            {regionInfo.title}
          </span>
        )}
      </div>

      {/* Map SVG container */}
      <div className="relative w-full flex-1 flex items-center justify-center py-2">
        <div
          className={`relative w-[180px] h-[340px] rounded-2xl flex items-center justify-center overflow-hidden transition-colors ${
            isProjector
              ? "bg-black/30 border border-white/10"
              : isLight
              ? "bg-zinc-50 border border-zinc-200"
              : "bg-surface/40 border border-border-custom/30"
          }`}
        >
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full max-h-[320px] transition-all duration-300 select-none"
          >
            <defs>
              {/* Silhouette clipping path so any highlight is strictly inside Israel */}
              <clipPath id={clipId}>
                <path d={israelPath} />
              </clipPath>

              {/* Glowing gradient for region highlight */}
              <linearGradient id="region-glow-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#818cf8" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.85" />
              </linearGradient>

              <filter id="glow-filter" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Base country background */}
            <path
              d={israelPath}
              className={`transition-colors duration-300 ${
                isProjector
                  ? "fill-white/5 stroke-white/20 stroke-[1.2]"
                  : isLight
                  ? "fill-zinc-200/80 stroke-zinc-400 stroke-[1.2]"
                  : "fill-surface/60 stroke-text-muted/30 stroke-[1.2]"
              }`}
            />

            {/* Latitude guidelines (North / Center / South dividers) */}
            <g className="stroke-current transition-opacity duration-300">
              {/* Divider between North and Center (Y ~ 32) */}
              <line
                x1="22"
                y1="32"
                x2="60"
                y2="32"
                strokeDasharray="2 2"
                strokeWidth="0.8"
                className={isLight ? "stroke-zinc-400/50" : "stroke-white/20"}
              />
              {/* Divider between Center and South (Y ~ 55) */}
              <line
                x1="18"
                y1="55"
                x2="60"
                y2="55"
                strokeDasharray="2 2"
                strokeWidth="0.8"
                className={isLight ? "stroke-zinc-400/50" : "stroke-white/20"}
              />
            </g>

            {/* Regional Zone Highlight (Strictly clipped inside Israel's contour) */}
            {showHint && regionInfo && (
              <g clipPath={`url(#${clipId})`}>
                <rect
                  x={regionInfo.x}
                  y={regionInfo.y}
                  width={regionInfo.width}
                  height={regionInfo.height}
                  fill="url(#region-glow-grad)"
                  className="animate-[pulse_2s_ease-in-out_infinite]"
                  filter="url(#glow-filter)"
                  opacity="0.85"
                />
                {/* Visual horizontal boundary indicator for the zone */}
                <line
                  x1="0"
                  y1={regionInfo.y}
                  x2="100"
                  y2={regionInfo.y}
                  stroke="#ffffff"
                  strokeWidth="1.2"
                  strokeDasharray="2 1"
                  opacity="0.9"
                />
                <line
                  x1="0"
                  y1={regionInfo.y + regionInfo.height}
                  x2="100"
                  y2={regionInfo.y + regionInfo.height}
                  stroke="#ffffff"
                  strokeWidth="1.2"
                  strokeDasharray="2 1"
                  opacity="0.9"
                />
              </g>
            )}

            {/* Outer border redraw for clean outline */}
            <path
              d={israelPath}
              fill="none"
              className={
                isProjector
                  ? "stroke-white/30 stroke-[1.5]"
                  : isLight
                  ? "stroke-zinc-500 stroke-[1.5]"
                  : "stroke-border-custom-hover stroke-[1.5]"
              }
            />

            {/* Region labels on the side */}
            <text
              x="62"
              y="20"
              fontSize="4"
              textAnchor="start"
              className={isLight ? "fill-zinc-600 font-semibold" : "fill-white/40 font-medium"}
            >
              צפון
            </text>
            <text
              x="62"
              y="44"
              fontSize="4"
              textAnchor="start"
              className={isLight ? "fill-zinc-600 font-semibold" : "fill-white/40 font-medium"}
            >
              מרכז
            </text>
            <text
              x="62"
              y="74"
              fontSize="4"
              textAnchor="start"
              className={isLight ? "fill-zinc-600 font-semibold" : "fill-white/40 font-medium"}
            >
              דרום
            </text>
          </svg>

          {/* Placeholder hint note when hint is hidden */}
          {!showHint && (
            <div className="absolute inset-0 flex items-center justify-center text-center p-4 select-none pointer-events-none">
              <span
                className={`text-xs leading-relaxed ${
                  isLight ? "text-zinc-500 font-medium" : "text-text-muted/60"
                }`}
              >
                לחצו על <b>הצג רמז</b> כדי להאיר את האזור של המקום על גבי המפה
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Region description text badge */}
      {showHint && regionInfo ? (
        <div
          className={`w-full mt-3 py-2 px-3 rounded-xl border text-center text-xs animate-[fadeIn_0.2s_ease-out] ${
            isProjector
              ? "bg-white/10 border-white/20 text-white"
              : isLight
              ? "bg-zinc-100 border-zinc-200 text-zinc-800"
              : "bg-surface/90 border-border-custom text-white"
          }`}
        >
          <div className="font-bold text-sm text-enrichment mb-0.5">
            {regionInfo.title}
          </div>
          <div className="text-[11px] opacity-80">{regionInfo.description}</div>
        </div>
      ) : (
        <div
          className={`w-full mt-3 py-1.5 px-3 rounded-xl border text-center text-xs opacity-50 ${
            isLight ? "border-zinc-200 text-zinc-500" : "border-border-custom text-text-muted"
          }`}
        >
          שלושת חבלי הארץ: צפון • מרכז • דרום
        </div>
      )}
    </div>
  );
}
