"use client";

import { useCallback, useEffect } from "react";
import { useStoredValue } from "@/lib/hooks/useStoredValue";
import { THEME_STORAGE_KEY, resolveTheme } from "@/lib/theme/config";

/**
 * Comfort Reading Mode (light / dark), shared by every page through localStorage.
 * The choice is mirrored onto <html data-theme> so the design tokens in globals.css switch with it.
 */
export function useComfortMode() {
  const [stored, setStored] = useStoredValue(THEME_STORAGE_KEY);
  const mode = resolveTheme(stored);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = mode;
    root.classList.toggle("dark", mode === "dark");
  }, [mode]);

  const toggle = useCallback(() => setStored(mode === "dark" ? "light" : "dark"), [mode, setStored]);
  return { mode, isLight: mode === "light", toggle };
}
