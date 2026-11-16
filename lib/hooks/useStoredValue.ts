"use client";

import { useCallback, useSyncExternalStore } from "react";

const EVENT = "teaching-site-storage";

type Area = "local" | "session";

function area(kind: Area): Storage | null {
  try {
    return kind === "local" ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
}

function subscribe(cb: () => void) {
  window.addEventListener("storage", cb);
  window.addEventListener(EVENT, cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener(EVENT, cb);
  };
}

type Update = string | null | ((prev: string | null) => string | null);

/**
 * A string kept in localStorage / sessionStorage, shared live across components. Null on the server.
 * The setter also takes an updater, which reads the latest stored value (safe for quick successive writes).
 */
export function useStoredValue(key: string, kind: Area = "local"): [string | null, (v: Update) => void] {
  const value = useSyncExternalStore(
    subscribe,
    () => {
      try {
        return area(kind)?.getItem(key) ?? null;
      } catch {
        return null;
      }
    },
    () => null
  );

  const set = useCallback(
    (update: Update) => {
      try {
        const s = area(kind);
        const v = typeof update === "function" ? update(s?.getItem(key) ?? null) : update;
        if (v === null) s?.removeItem(key);
        else s?.setItem(key, v);
      } catch {
        // storage unavailable
      }
      window.dispatchEvent(new Event(EVENT));
    },
    [key, kind]
  );

  return [value, set];
}
