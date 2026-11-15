// Class strings shared by the Mission: New Home page and its components,
// following the Comfort Reading Mode pattern used across the site.
export interface MissionTheme {
  isLight: boolean;
  bg: string;
  border: string;
  title: string;
  muted: string;
  card: string;
  input: string;
  soft: string;
  accentText: string;
  accentButton: string;
  ghostButton: string;
}

export function missionTheme(isLight: boolean): MissionTheme {
  return {
    isLight,
    bg: isLight ? "bg-[#f4f6fa] text-zinc-800" : "bg-[#080c18] text-[#e8edf8]",
    border: isLight ? "border-zinc-200" : "border-border-custom",
    title: isLight ? "text-zinc-900" : "text-white",
    muted: isLight ? "text-zinc-600" : "text-text-muted",
    card: isLight ? "light-card" : "glass-card",
    input: isLight
      ? "bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-400 focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
      : "bg-[#0d1222]/80 border-border-custom text-white placeholder:text-zinc-500 focus:border-teal-400/60 focus:ring-1 focus:ring-teal-400/30",
    soft: isLight ? "bg-zinc-50 border-zinc-200" : "bg-white/[0.03] border-white/10",
    accentText: isLight ? "text-teal-700" : "text-teal-300",
    accentButton:
      "bg-teal-500 hover:bg-teal-400 text-zinc-950 font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
    ghostButton: isLight
      ? "border border-zinc-300 hover:bg-zinc-100 text-zinc-700 transition-colors"
      : "border border-white/15 hover:bg-white/10 text-zinc-200 transition-colors",
  };
}
