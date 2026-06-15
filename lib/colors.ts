export interface ColorTheme {
  bg: string;
  border: string;
  text: string;
  hoverBorder: string;
  glow: string;
  badge: string;
  solidBg: string;
}

export const colorMap: Record<string, ColorTheme> = {
  sky: {
    bg: "bg-sky-950/30",
    border: "border-sky-500/30",
    text: "text-sky-400",
    hoverBorder: "hover:border-sky-400/60",
    glow: "glow-cyan",
    badge: "bg-sky-500/20 text-sky-300 border-sky-500/40",
    solidBg: "bg-sky-500",
  },
  emerald: {
    bg: "bg-emerald-950/30",
    border: "border-emerald-500/30",
    text: "text-emerald-400",
    hoverBorder: "hover:border-emerald-400/60",
    glow: "glow-emerald",
    badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    solidBg: "bg-emerald-500",
  },
  amber: {
    bg: "bg-amber-950/30",
    border: "border-amber-500/30",
    text: "text-amber-400",
    hoverBorder: "hover:border-amber-400/60",
    glow: "glow-amber",
    badge: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    solidBg: "bg-amber-500",
  },
  rose: {
    bg: "bg-rose-950/30",
    border: "border-rose-500/30",
    text: "text-rose-400",
    hoverBorder: "hover:border-rose-400/60",
    glow: "glow-rose",
    badge: "bg-rose-500/20 text-rose-300 border-rose-500/40",
    solidBg: "bg-rose-500",
  },
  violet: {
    bg: "bg-violet-950/30",
    border: "border-violet-500/30",
    text: "text-violet-400",
    hoverBorder: "hover:border-violet-400/60",
    glow: "text-violet-400 drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]",
    badge: "bg-violet-500/20 text-violet-300 border-violet-500/40",
    solidBg: "bg-violet-500",
  },
  pink: {
    bg: "bg-pink-950/30",
    border: "border-pink-500/30",
    text: "text-pink-400",
    hoverBorder: "hover:border-pink-400/60",
    glow: "text-pink-400 drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]",
    badge: "bg-pink-500/20 text-pink-300 border-pink-500/40",
    solidBg: "bg-pink-500",
  },
  orange: {
    bg: "bg-orange-950/30",
    border: "border-orange-500/30",
    text: "text-orange-400",
    hoverBorder: "hover:border-orange-400/60",
    glow: "text-orange-400 drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]",
    badge: "bg-orange-500/20 text-orange-300 border-orange-500/40",
    solidBg: "bg-orange-500",
  },
  indigo: {
    bg: "bg-indigo-950/30",
    border: "border-indigo-500/30",
    text: "text-indigo-400",
    hoverBorder: "hover:border-indigo-400/60",
    glow: "text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]",
    badge: "bg-indigo-500/20 text-indigo-300 border-indigo-500/40",
    solidBg: "bg-indigo-500",
  },
};

export const colorsList = Object.keys(colorMap);
