"use client";

import { Moon, Sun } from "lucide-react";
import { useComfortMode } from "@/lib/hooks/useComfortMode";

/** Comfort Reading Mode switch. Required on every page (see AGENTS.md). */
export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { isLight, toggle } = useComfortMode();
  return (
    <button
      type="button"
      onClick={toggle}
      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-line text-fg-muted transition-colors hover:bg-subtle hover:text-fg cursor-pointer ${className}`}
      title="Comfort Reading Mode (מצב בהיר/כהה)"
      aria-label="החלפת מצב תצוגה בהיר/כהה"
    >
      {isLight ? <Moon className="h-4 w-4" strokeWidth={1.75} /> : <Sun className="h-4 w-4" strokeWidth={1.75} />}
    </button>
  );
}

/** Keeps <html data-theme> in sync on pages that do not render a toggle of their own yet. */
export function ThemeSync() {
  useComfortMode();
  return null;
}
