"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { arrayRemove, arrayUnion, doc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";
import { dbFirestore } from "@/lib/firebase";
import { useAuth } from "@/lib/context/AuthContext";
import { isTeacherUser } from "@/lib/auth/teacher";
import { useStoredValue } from "@/lib/hooks/useStoredValue";
import {
  CONTENT_ITEMS,
  Subject,
  findItemForPath,
  hubSubjectForPath,
  isAlwaysOpenPath,
} from "@/lib/content-registry";

const PREVIEW_KEY = "teaching-site-student-preview";
const visibilityDoc = () => doc(dbFirestore, "settings", "visibility");

interface VisibilityContextType {
  /** True until both the signed-in user and the visibility list are known. */
  loading: boolean;
  /** The signed-in account is a teacher (regardless of preview mode). */
  isTeacher: boolean;
  /** Teacher is browsing as a student would. */
  previewAsStudent: boolean;
  setPreviewAsStudent: (on: boolean) => void;
  /** Teacher sees everything (teacher and not previewing). */
  bypass: boolean;
  visibleIds: Set<string>;
  canSee: (id: string) => boolean;
  canSeeSubject: (subject: Subject) => boolean;
  canSeePath: (pathname: string) => boolean;
  setVisible: (ids: string[], on: boolean) => Promise<void>;
  /** A teacher change has not reached the server yet. */
  saving: boolean;
  error: string | null;
}

const VisibilityContext = createContext<VisibilityContextType | undefined>(undefined);

export function VisibilityProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const isTeacher = isTeacherUser(user);

  const [visibleIds, setVisibleIds] = useState<Set<string>>(new Set());
  const [docLoaded, setDocLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewStored, setPreviewStored] = useStoredValue(PREVIEW_KEY, "session");
  const previewAsStudent = previewStored === "1";
  const setPreviewAsStudent = useCallback((on: boolean) => setPreviewStored(on ? "1" : null), [setPreviewStored]);

  // Live subscription: when the teacher flips a switch, open student screens update immediately.
  useEffect(() => {
    const unsub = onSnapshot(
      visibilityDoc(),
      { includeMetadataChanges: true },
      (snap) => {
        const data = snap.data();
        const list: unknown = data?.visible;
        setVisibleIds(new Set(Array.isArray(list) ? list.filter((x): x is string => typeof x === "string") : []));
        setSaving(snap.metadata.hasPendingWrites);
        setDocLoaded(true);
        setError(null);
      },
      (err) => {
        console.error("Could not load content visibility:", err);
        // Fail closed: students see nothing rather than everything.
        setVisibleIds(new Set());
        setDocLoaded(true);
        setError(err.code === "permission-denied" ? "permission-denied" : err.message);
      }
    );
    return () => unsub();
  }, []);

  const bypass = isTeacher && !previewAsStudent;

  const canSee = useCallback((id: string) => bypass || visibleIds.has(id), [bypass, visibleIds]);

  const canSeeSubject = useCallback(
    (subject: Subject) => bypass || CONTENT_ITEMS.some((i) => i.subject === subject && visibleIds.has(i.id)),
    [bypass, visibleIds]
  );

  const canSeePath = useCallback(
    (pathname: string) => {
      if (bypass || isAlwaysOpenPath(pathname)) return true;
      const hub = hubSubjectForPath(pathname);
      if (hub) return canSeeSubject(hub);
      const item = findItemForPath(pathname);
      return item ? visibleIds.has(item.id) : false;
    },
    [bypass, canSeeSubject, visibleIds]
  );

  const setVisible = useCallback(
    async (ids: string[], on: boolean) => {
      if (!isTeacher || ids.length === 0) return;
      try {
        await setDoc(
          visibilityDoc(),
          {
            visible: on ? arrayUnion(...ids) : arrayRemove(...ids),
            updatedAt: serverTimestamp(),
            updatedBy: user?.email ?? null,
          },
          { merge: true }
        );
        setError(null);
      } catch (err) {
        console.error("Could not save content visibility:", err);
        setError(err instanceof Error ? err.message : String(err));
        throw err;
      }
    },
    [isTeacher, user]
  );

  const value = useMemo<VisibilityContextType>(
    () => ({
      loading: authLoading || !docLoaded,
      isTeacher,
      previewAsStudent,
      setPreviewAsStudent,
      bypass,
      visibleIds,
      canSee,
      canSeeSubject,
      canSeePath,
      setVisible,
      saving,
      error,
    }),
    [authLoading, docLoaded, isTeacher, previewAsStudent, setPreviewAsStudent, bypass, visibleIds, canSee, canSeeSubject, canSeePath, setVisible, saving, error]
  );

  return <VisibilityContext.Provider value={value}>{children}</VisibilityContext.Provider>;
}

export function useVisibility() {
  const ctx = useContext(VisibilityContext);
  if (!ctx) throw new Error("useVisibility must be used inside VisibilityProvider");
  return ctx;
}
