"use client";

import { useCallback } from "react";
import { useSearchParams } from "next/navigation";

/** Query-string changes: a string sets the key, null removes it. */
export type StepChanges = Record<string, string | null>;

/** Marker kept on the history entry that opened a layer, so closing it can step back instead. */
const LAYER_KEY = "historyLayer";

/**
 * Keeps a page's view (slide, tab, open panels…) in the query string, one browser
 * history entry per step, so the browser's Back button undoes one step at a time.
 *
 * - `go(changes)` adds a step.
 * - `open(layer, changes)` adds a step and remembers that it opened `layer`.
 * - `close(layer, changes)` goes back when the current step is the one that opened
 *   `layer` (so no dead entry is left behind), and otherwise adds a step that closes it,
 *   e.g. when the page was opened straight from a link with the layer already open.
 */
export function useHistorySteps() {
  const params = useSearchParams();

  const push = useCallback((changes: StepChanges, layer?: string) => {
    const next = new URLSearchParams(window.location.search);
    for (const [key, value] of Object.entries(changes)) {
      if (value === null) next.delete(key);
      else next.set(key, value);
    }
    const query = next.toString();
    const url = `${window.location.pathname}${query ? `?${query}` : ""}`;
    // A repeated key press before the page re-renders would otherwise add the same step twice.
    if (url === `${window.location.pathname}${window.location.search}`) return;
    window.history.pushState(layer ? { [LAYER_KEY]: layer } : null, "", url);
  }, []);

  const go = useCallback((changes: StepChanges) => push(changes), [push]);
  const open = useCallback((layer: string, changes: StepChanges) => push(changes, layer), [push]);
  const close = useCallback(
    (layer: string, changes: StepChanges) => {
      if (window.history.state?.[LAYER_KEY] === layer) window.history.back();
      else push(changes);
    },
    [push],
  );

  return { params, go, open, close };
}
