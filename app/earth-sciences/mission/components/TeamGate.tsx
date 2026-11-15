"use client";

import React, { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { Loader2, LogIn, Plus, Rocket, Users } from "lucide-react";
import { dbFirestore, sanitizeForFirestore } from "@/lib/firebase";
import { DESTINATIONS, getDestination, type DestinationId, type MissionTeam } from "@/lib/data/mission-new-home";
import type { MissionTheme } from "./theme";

export const TEAMS = "mission_teams";

// No 0/O, 1/I/L, so codes are easy to read off a projector.
const CODE_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const newCode = () => Array.from({ length: 6 }, () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]).join("");

interface Props {
  user: User;
  theme: MissionTheme;
  onOpen: (teamId: string) => void;
}

export default function TeamGate({ user, theme: t, onOpen }: Props) {
  const [name, setName] = useState(user.displayName ?? "");
  const [studentClass, setStudentClass] = useState("");
  const [destinationId, setDestinationId] = useState<DestinationId | "">("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState<"create" | "join" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [myTeams, setMyTeams] = useState<MissionTeam[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    getDocs(query(collection(dbFirestore, TEAMS), where("memberIds", "array-contains", user.uid)))
      .then((snap) => {
        if (!cancelled) setMyTeams(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<MissionTeam, "id">) })));
      })
      .catch((err) => {
        console.warn("Could not load teams:", err);
        if (!cancelled) setMyTeams([]);
      });
    return () => {
      cancelled = true;
    };
  }, [user.uid]);

  const identityOk = () => {
    if (!name.trim() || !studentClass.trim()) {
      setError("כתבו שם מלא וכיתה.");
      return false;
    }
    return true;
  };

  const me = () => ({ uid: user.uid, name: name.trim(), studentClass: studentClass.trim() });

  const create = async () => {
    setError(null);
    if (!identityOk()) return;
    if (!destinationId) {
      setError("בחרו יעד.");
      return;
    }
    setBusy("create");
    try {
      // Saving to an existing code is refused by the rules, so retry with a new one.
      for (let attempt = 0; attempt < 4; attempt++) {
        const id = newCode();
        try {
          await setDoc(
            doc(dbFirestore, TEAMS, id),
            sanitizeForFirestore({
              destinationId,
              memberIds: [user.uid],
              members: [me()],
              answers: {},
              drawings: {},
              checks: {},
              termsChecked: [],
              stageOwners: {},
              status: "draft",
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            }),
          );
          onOpen(id);
          return;
        } catch (err) {
          if (attempt === 3) throw err;
        }
      }
    } catch (err) {
      console.error("Create team failed:", err);
      setError("לא הצלחנו לפתוח צוות. בדקו את החיבור לאינטרנט ונסו שוב.");
    } finally {
      setBusy(null);
    }
  };

  const join = async () => {
    setError(null);
    const id = code.trim().toUpperCase();
    if (id.length !== 6) {
      setError("קוד צוות הוא 6 תווים.");
      return;
    }
    if (!identityOk()) return;
    setBusy("join");
    try {
      const ref = doc(dbFirestore, TEAMS, id);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        setError("לא מצאנו צוות עם הקוד הזה.");
        return;
      }
      const team = snap.data() as MissionTeam;
      if (team.memberIds.includes(user.uid)) {
        onOpen(id);
        return;
      }
      if (team.status !== "draft") {
        setError("הצוות הזה כבר הגיש את העבודה.");
        return;
      }
      if (team.memberIds.length >= 2) {
        setError("בצוות הזה כבר יש שני תלמידים.");
        return;
      }
      await updateDoc(ref, {
        memberIds: arrayUnion(user.uid),
        members: arrayUnion(me()),
        updatedAt: serverTimestamp(),
      });
      onOpen(id);
    } catch (err) {
      console.error("Join team failed:", err);
      setError("לא הצלחנו להצטרף. בדקו את הקוד ונסו שוב.");
    } finally {
      setBusy(null);
    }
  };

  const field = `w-full rounded-xl border px-3 py-2.5 text-sm outline-none ${t.input}`;

  return (
    <div className="space-y-6">
      {myTeams && myTeams.length > 0 && (
        <section className={`rounded-2xl border p-5 space-y-3 ${t.card} ${t.border}`}>
          <h3 className={`text-lg font-black ${t.title}`}>העבודות שלי</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {myTeams.map((team) => {
              const d = getDestination(team.destinationId);
              return (
                <button
                  key={team.id}
                  type="button"
                  onClick={() => onOpen(team.id)}
                  className={`text-right rounded-xl border p-4 cursor-pointer hover:border-teal-400 transition-colors ${t.soft}`}
                >
                  <div className={`font-bold ${t.title}`}>
                    {d?.emoji} {d?.name}
                  </div>
                  <div className={`text-xs mt-1 ${t.muted}`}>{team.members.map((m) => m.name).join(" ו")}</div>
                  <div className={`text-xs mt-1 ${t.accentText}`}>
                    קוד {team.id} ·{" "}
                    {team.status === "draft" ? "בעבודה" : team.status === "submitted" ? "הוגשה" : "נבדקה"}
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      <section className={`rounded-2xl border p-5 space-y-3 ${t.card} ${t.border}`}>
        <h3 className={`text-lg font-black ${t.title}`}>מי אתם?</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <input className={field} placeholder="שם מלא" value={name} onChange={(e) => setName(e.target.value)} />
          <input className={field} placeholder="כיתה (לדוגמה: ח׳2)" value={studentClass} onChange={(e) => setStudentClass(e.target.value)} />
        </div>
      </section>

      <div className="grid lg:grid-cols-2 gap-6">
        <section className={`rounded-2xl border p-5 space-y-3 ${t.card} ${t.border}`}>
          <h3 className={`text-lg font-black flex items-center gap-2 ${t.title}`}>
            <Plus className="w-5 h-5" /> פתיחת צוות חדש
          </h3>
          <p className={`text-sm ${t.muted}`}>בחרו יעד. תקבלו קוד צוות שתמסרו לשותף.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {DESTINATIONS.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setDestinationId(d.id)}
                className={`rounded-xl border p-3 text-sm font-bold cursor-pointer transition-colors ${
                  destinationId === d.id ? "border-teal-400 bg-teal-500/15 " + t.accentText : `${t.soft} ${t.title}`
                }`}
              >
                <div className="text-xl">{d.emoji}</div>
                {d.name}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={create}
            disabled={busy !== null}
            className={`w-full rounded-xl py-2.5 text-sm flex items-center justify-center gap-2 cursor-pointer ${t.accentButton}`}
          >
            {busy === "create" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Rocket className="w-4 h-4" />}
            פתיחת צוות
          </button>
        </section>

        <section className={`rounded-2xl border p-5 space-y-3 ${t.card} ${t.border}`}>
          <h3 className={`text-lg font-black flex items-center gap-2 ${t.title}`}>
            <Users className="w-5 h-5" /> הצטרפות לצוות
          </h3>
          <p className={`text-sm ${t.muted}`}>השותף כבר פתח צוות? הקלידו את הקוד שקיבל.</p>
          <input
            dir="ltr"
            className={`${field} text-center tracking-[0.4em] font-mono text-lg uppercase`}
            placeholder="ABC123"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
          />
          <button
            type="button"
            onClick={join}
            disabled={busy !== null}
            className={`w-full rounded-xl py-2.5 text-sm flex items-center justify-center gap-2 cursor-pointer ${t.accentButton}`}
          >
            {busy === "join" ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
            הצטרפות
          </button>
        </section>
      </div>

      {error && <p className="text-sm font-semibold text-rose-500 text-center">{error}</p>}
    </div>
  );
}
