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
    bg: "bg-canvas text-fg",
    border: "border-line",
    title: "text-fg",
    muted: "text-fg-muted",
    card: "bg-card border-line",
    input: "bg-card border-line text-fg placeholder:text-fg-muted focus:border-teal-600 focus:ring-1 focus:ring-teal-600 dark:focus:border-teal-400/60 dark:focus:ring-teal-400/30",
    soft: "bg-subtle border-line dark:bg-white/[0.03]",
    accentText: "text-teal-700 dark:text-teal-300",
    accentButton:
      "bg-teal-500 hover:bg-teal-400 text-zinc-950 font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
    ghostButton: "border border-line hover:bg-subtle text-fg transition-colors",
  };
}
