"use client";

import React, { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { doc, onSnapshot } from "firebase/firestore";
import { ArrowRight, Loader2, LogIn, Moon, Rocket, Sun, UserPlus } from "lucide-react";
import NavbarUser from "@/components/NavbarUser";
import { useAuth } from "@/lib/context/AuthContext";
import { dbFirestore } from "@/lib/firebase";
import type { MissionTeam } from "@/lib/data/mission-new-home";
import TeamGate, { TEAMS } from "./components/TeamGate";
import Workspace from "./components/Workspace";
import { missionTheme } from "./components/theme";

const TEAM_STORAGE_KEY = "mission-new-home-team";

const readStorage = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};
const writeStorage = (key: string, value: string | null) => {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    // Storage can be blocked (private mode); the page still works without it.
  }
};

// localStorage as an external store: the server render sees null, the browser
// sees the stored value, and writes from this tab notify the page.
const STORAGE_EVENT = "mission-storage";
const subscribeStorage = (cb: () => void) => {
  window.addEventListener("storage", cb);
  window.addEventListener(STORAGE_EVENT, cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener(STORAGE_EVENT, cb);
  };
};
function useStoredValue(key: string): [string | null, (v: string | null) => void] {
  const value = useSyncExternalStore(
    subscribeStorage,
    () => readStorage(key),
    () => null,
  );
  const set = (v: string | null) => {
    writeStorage(key, v);
    window.dispatchEvent(new Event(STORAGE_EVENT));
  };
  return [value, set];
}

export default function MissionNewHomePage() {
  const { user, loading, signInWithGoogle } = useAuth();
  const [storedMode, setStoredMode] = useStoredValue("teaching-site-comfort-mode");
  const [teamId, setStoredTeamId] = useStoredValue(TEAM_STORAGE_KEY);
  const [team, setTeam] = useState<MissionTeam | null>(null);
  const [teamError, setTeamError] = useState<string | null>(null);
  const comfortMode = storedMode === "light" ? "light" : "dark";

  const toggleComfortMode = () => setStoredMode(comfortMode === "dark" ? "light" : "dark");

  const openTeam = (id: string | null) => {
    setTeam(null);
    setTeamError(null);
    setStoredTeamId(id);
  };

  // Live team document: both partners see each other's edits.
  useEffect(() => {
    if (!user || !teamId) return;
    const unsub = onSnapshot(
      doc(dbFirestore, TEAMS, teamId),
      (snap) => {
        const data = snap.data() as Omit<MissionTeam, "id"> | undefined;
        if (!data || !data.memberIds?.includes(user.uid)) {
          // Not (or no longer) on this team: forget it and show the team list.
          writeStorage(TEAM_STORAGE_KEY, null);
          window.dispatchEvent(new Event(STORAGE_EVENT));
          return;
        }
        setTeam({ id: snap.id, ...data });
      },
      (err) => {
        console.error("Team listener failed:", err);
        setTeamError("לא הצלחנו לטעון את העבודה.");
      },
    );
    return unsub;
  }, [user, teamId]);

  const t = missionTheme(comfortMode === "light");

  return (
    <div className={`relative min-h-screen transition-colors duration-200 ${t.bg}`} dir="rtl">
      <header className={`sticky top-0 z-20 border-b backdrop-blur ${t.border} ${t.isLight ? "bg-white/80" : "bg-[#080c18]/80"}`}>
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <Link href="/earth-sciences" className={`text-xs font-semibold flex items-center gap-1.5 hover:text-teal-500 ${t.muted}`}>
            <ArrowRight className="w-4 h-4" /> מדעי כדור הארץ
          </Link>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleComfortMode}
              className={`p-2 rounded-xl cursor-pointer ${t.ghostButton}`}
              title={t.isLight ? "מצב כהה" : "מצב קריאה נוח (בהיר)"}
              aria-label="החלפת מצב תצוגה"
            >
              {t.isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            <NavbarUser />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div className="space-y-1">
          <p className={`text-xs font-bold tracking-wide ${t.accentText}`}>יחידה 1 · אסטרונומיה · עבודת חקר בזוגות</p>
          <h1 className={`text-3xl sm:text-4xl font-black flex items-center gap-3 ${t.title}`}>
            <Rocket className="w-8 h-8 text-teal-500" /> משימת בית חדש
          </h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
          </div>
        ) : !user ? (
          <section className={`rounded-2xl border p-8 text-center space-y-4 ${t.card} ${t.border}`}>
            <p className="text-[15px] leading-relaxed">
              כדי לעבוד על המשימה ולשמור את ההתקדמות, התחברו או צרו משתמש חדש.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/login?redirect=/earth-sciences/mission"
                className={`inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm cursor-pointer ${t.accentButton}`}
              >
                <UserPlus className="w-4 h-4" /> התחברות / הרשמה עם אימייל וסיסמה
              </Link>
              <button
                type="button"
                onClick={() => signInWithGoogle()}
                className={`inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm cursor-pointer ${t.ghostButton}`}
              >
                <LogIn className="w-4 h-4" /> התחברות עם Google
              </button>
            </div>
          </section>
        ) : teamId && team ? (
          <Workspace key={team.id} team={team} theme={t} onLeave={() => openTeam(null)} />
        ) : teamId && !teamError ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
          </div>
        ) : (
          <>
            {teamError && <p className="text-sm text-rose-500 text-center">{teamError}</p>}
            <TeamGate user={user} theme={t} onOpen={openTeam} />
          </>
        )}
      </main>
    </div>
  );
}
