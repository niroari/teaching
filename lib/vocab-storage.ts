export interface Word {
  id: string;
  english: string;
  hebrew: string;
  partOfSpeech: string;
  example?: string;
  mastered?: boolean;
}

const LEGACY_STORAGE_KEY = "teaching-site-vocab-words";
const GUEST_STORAGE_KEY = "teaching-site-vocab-words_guest";

/**
 * Returns a user-scoped localStorage key.
 * Logged-in users get their own isolated key based on their Firebase UID.
 * Unauthenticated visitors use the guest key.
 */
export function getVocabStorageKey(uid?: string | null): string {
  if (!uid) return GUEST_STORAGE_KEY;
  return `teaching-site-vocab-words_${uid}`;
}

/**
 * Removes the old un-scoped global key to prevent cross-account pollution.
 */
export function cleanupLegacyVocabStorage(): void {
  if (typeof window === "undefined") return;
  try {
    if (localStorage.getItem(LEGACY_STORAGE_KEY) !== null) {
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    }
  } catch (e) {
    console.error("Error cleaning up legacy vocab storage:", e);
  }
}

/**
 * Loads words from the user-scoped localStorage cache.
 */
export function loadScopedLocalWords(uid?: string | null): Word[] {
  if (typeof window === "undefined") return [];
  cleanupLegacyVocabStorage();
  
  const key = getVocabStorageKey(uid);
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      return JSON.parse(raw) as Word[];
    }
  } catch (e) {
    console.error("Error reading scoped vocab words:", e);
  }
  return [];
}

/**
 * Saves words into the user-scoped localStorage cache.
 */
export function saveScopedLocalWords(words: Word[], uid?: string | null): void {
  if (typeof window === "undefined") return;
  cleanupLegacyVocabStorage();

  const key = getVocabStorageKey(uid);
  try {
    localStorage.setItem(key, JSON.stringify(words));
  } catch (e) {
    console.error("Error saving scoped vocab words:", e);
  }
}

/**
 * Gets words created by an unauthenticated guest user that can optionally be merged on login.
 */
export function getGuestWords(): Word[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(GUEST_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as Word[];
    }
  } catch (e) {
    console.error("Error reading guest vocab words:", e);
  }
  return [];
}

/**
 * Clears guest words once they have been merged or discarded.
 */
export function clearGuestWords(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(GUEST_STORAGE_KEY);
  } catch (e) {
    console.error("Error clearing guest vocab words:", e);
  }
}
