// One place that decides the site's theme defaults. Imported by the hook and by the
// no-flash script in app/layout.tsx, so the two can never disagree.
export type ThemeMode = "light" | "dark";

export const THEME_STORAGE_KEY = "teaching-site-comfort-mode";

/** What a first-time visitor sees. Their own choice is remembered after that. */
export const DEFAULT_THEME: ThemeMode = "light";

export function resolveTheme(stored: string | null | undefined): ThemeMode {
  return stored === "light" || stored === "dark" ? stored : DEFAULT_THEME;
}

/**
 * Runs before first paint so the page never flashes the wrong theme.
 * It also (1) stores the default for first-time visitors, so pages that read the key directly agree with it,
 * and (2) announces direct localStorage writes of the theme key, so <html data-theme> follows every toggle on the site.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var K=${JSON.stringify(THEME_STORAGE_KEY)};var s=localStorage.getItem(K);var t=(s==="light"||s==="dark")?s:${JSON.stringify(
  DEFAULT_THEME
)};if(s!==t)localStorage.setItem(K,t);var d=document.documentElement;d.dataset.theme=t;d.classList.toggle("dark",t==="dark");var si=Storage.prototype.setItem;Storage.prototype.setItem=function(k){si.apply(this,arguments);if(k===K){try{window.dispatchEvent(new Event("teaching-site-storage"))}catch(e){}}};}catch(e){}})();`;
