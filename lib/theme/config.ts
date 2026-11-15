// One place that decides the site's theme defaults. Imported by the hook and by the
// no-flash script in app/layout.tsx, so the two can never disagree.
export type ThemeMode = "light" | "dark";

export const THEME_STORAGE_KEY = "teaching-site-comfort-mode";

/** What a first-time visitor sees. Flips to "light" at Release 1, once the front door is migrated. */
export const DEFAULT_THEME: ThemeMode = "dark";

export function resolveTheme(stored: string | null | undefined): ThemeMode {
  return stored === "light" || stored === "dark" ? stored : DEFAULT_THEME;
}

/** Runs before first paint so the page never flashes the wrong theme. */
export const THEME_INIT_SCRIPT = `(function(){try{var s=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY
)});var t=(s==="light"||s==="dark")?s:${JSON.stringify(
  DEFAULT_THEME
)};var d=document.documentElement;d.dataset.theme=t;d.classList.toggle("dark",t==="dark");}catch(e){}})();`;
