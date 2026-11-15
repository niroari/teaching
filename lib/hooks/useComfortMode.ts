"use client";

import { useCallback } from "react";
import { useStoredValue } from "@/lib/hooks/useStoredValue";

/** Comfort Reading Mode (dark / light), shared with every page through localStorage. */
export function useComfortMode() {
  const [stored, setStored] = useStoredValue("teaching-site-comfort-mode");
  const mode: "dark" | "light" = stored === "light" ? "light" : "dark";
  const toggle = useCallback(() => setStored(mode === "dark" ? "light" : "dark"), [mode, setStored]);
  return { mode, isLight: mode === "light", toggle };
}
