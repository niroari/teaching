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

/** A string kept in localStorage / sessionStorage, shared live across components. Null on the server. */
export function useStoredValue(key: string, kind: Area = "local"): [string | null, (v: string | null) => void] {
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
    (v: string | null) => {
      try {
        const s = area(kind);
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
