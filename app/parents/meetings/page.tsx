"use client";

import { useEffect, useMemo, useState } from "react";
import { signInAnonymously } from "firebase/auth";
import { collection, deleteDoc, doc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";
import { CalendarCheck, Check, Link2, Printer, X } from "lucide-react";
import PageShell from "@/components/site/PageShell";
import PageHeader from "@/components/site/PageHeader";
import { Badge, Segmented, Spinner, btn } from "@/components/site/ui";
import { auth, dbFirestore, sanitizeForFirestore } from "@/lib/firebase";
import { useAuth } from "@/lib/context/AuthContext";
import { isTeacherUser } from "@/lib/auth/teacher";
import {
  MEETING_DAYS,
  MEETING_END,
  MEETING_START,
  PARENT_MEETINGS_COLLECTION,
  SLOT_MINUTES,
  dayLabel,
  slotsForDay,
  type MeetingBooking,
  type MeetingSlot,
} from "@/lib/data/parent-meetings";

const NAME_MIN = 2;
const NAME_MAX = 60;

export default function ParentMeetingsPage() {
  const { user, loading: authLoading } = useAuth();
  const isTeacher = isTeacherUser(user);
  const [bookings, setBookings] = useState<Record<string, MeetingBooking> | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [day, setDay] = useState(MEETING_DAYS[0].date);
  const [openSlot, setOpenSlot] = useState<string | null>(null);
  const [message, setMessage] = useState<{ tone: "success" | "danger"; text: string } | null>(null);
  const [copied, setCopied] = useState(false);

  // Parents arrive logged out: an anonymous session lets them book and later cancel from this device.
  useEffect(() => {
    if (!authLoading && !user) {
      signInAnonymously(auth).catch((err) => console.error("Anonymous sign-in failed:", err));
    }
  }, [authLoading, user]);

  useEffect(() => {
    return onSnapshot(
      collection(dbFirestore, PARENT_MEETINGS_COLLECTION),
      (snap) => {
        const next: Record<string, MeetingBooking> = {};
        snap.forEach((d) => {
          next[d.id] = d.data() as MeetingBooking;
        });
        setBookings(next);
        setLoadError(false);
      },
      (err) => {
        console.error("Loading parent meetings failed:", err);
        setLoadError(true);
      }
    );
  }, []);

  const myBooking = useMemo(() => {
    if (!user || !bookings) return null;
    const entry = Object.entries(bookings).find(([, b]) => b.ownerUid === user.uid);
    return entry ? { id: entry[0], ...entry[1] } : null;
  }, [bookings, user]);

  const total = MEETING_DAYS.length * slotsForDay(MEETING_DAYS[0].date).length;
  const bookedCount = bookings ? Object.keys(bookings).length : 0;

  async function book(slot: MeetingSlot, studentName: string, parentName: string) {
    if (!user) return false;
    try {
      await setDoc(
        doc(dbFirestore, PARENT_MEETINGS_COLLECTION, slot.id),
        sanitizeForFirestore({
          day: slot.date,
          time: slot.time,
          studentName,
          parentName,
          ownerUid: user.uid,
          createdAt: serverTimestamp(),
        })
      );
      setOpenSlot(null);
      setMessage({ tone: "success", text: `נקבעה פגישה ב${dayLabel(slot.date)} בשעה ${slot.time}. נתראה!` });
      return true;
    } catch (err) {
      console.error("Booking failed:", err);
      setOpenSlot(null);
      setMessage({ tone: "danger", text: "השעה הזאת כבר נתפסה (או שהשמירה נכשלה). בחרו שעה אחרת." });
      return false;
    }
  }

  async function cancel(id: string, label: string, asTeacher: boolean) {
    const question = asTeacher ? `לפנות את השעה ${label}?` : `לבטל את הפגישה ב${label}?`;
    if (!window.confirm(question)) return;
    try {
      await deleteDoc(doc(dbFirestore, PARENT_MEETINGS_COLLECTION, id));
      setMessage({ tone: "success", text: asTeacher ? "השעה פונתה." : "הפגישה בוטלה. אפשר לבחור שעה אחרת." });
    } catch (err) {
      console.error("Cancel failed:", err);
      setMessage({ tone: "danger", text: "הביטול נכשל. נסו שוב." });
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.origin + "/parents/meetings");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("העתיקו את הקישור:", window.location.origin + "/parents/meetings");
    }
  }

  const ready = bookings !== null && !authLoading && !!user;

  return (
    <PageShell width="wide" crumbs={[{ label: "ימי הורים" }]}>
      <div className="print:hidden">
        <PageHeader
          eyebrow="ימי הורים"
          title="שיבוץ לפגישת הורים"
          description={`${MEETING_DAYS.map((d) => d.label).join(" ו")}, בין ${MEETING_START} ל־${MEETING_END}. כל פגישה ${SLOT_MINUTES} דקות. בחרו שעה פנויה ושבצו את עצמכם. כל הקודם זוכה.`}
          actions={
            isTeacher ? (
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={copyLink} className={btn.secondary}>
                  {copied ? <Check className="h-4 w-4" strokeWidth={1.75} aria-hidden /> : <Link2 className="h-4 w-4" strokeWidth={1.75} aria-hidden />}
                  <span>{copied ? "הקישור הועתק" : "העתקת קישור להורים"}</span>
                </button>
                <button type="button" onClick={() => window.print()} className={btn.primary}>
                  <Printer className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                  <span>הדפסת הטבלה</span>
                </button>
              </div>
            ) : undefined
          }
        />

        {isTeacher && bookings && (
          <p className="mt-4 text-sm text-fg-muted">
            שובצו {bookedCount} מתוך {total} פגישות.
          </p>
        )}

        {myBooking && (
          <div className="mt-6 flex flex-wrap items-center gap-3 rounded-lg border border-line bg-accent-soft p-4">
            <CalendarCheck className="h-5 w-5 shrink-0 text-accent" strokeWidth={1.75} aria-hidden />
            <p className="flex-1 text-sm text-fg">
              שובצתם ל<strong>{dayLabel(myBooking.day)}</strong> בשעה <strong>{myBooking.time}</strong> (
              {myBooking.studentName}). כדי לבחור שעה אחרת, בטלו קודם את הפגישה הזאת.
            </p>
            <button
              type="button"
              onClick={() => cancel(myBooking.id, `${dayLabel(myBooking.day)} בשעה ${myBooking.time}`, false)}
              className={btn.secondary}
            >
              ביטול הפגישה
            </button>
          </div>
        )}

        {message && (
          <div
            role="status"
            className={`mt-4 flex items-start gap-2 rounded-lg border border-line p-3 text-sm ${
              message.tone === "success" ? "bg-success-soft text-success" : "bg-danger-soft text-danger"
            }`}
          >
            <span className="flex-1">{message.text}</span>
            <button type="button" onClick={() => setMessage(null)} className="cursor-pointer" aria-label="סגירה">
              <X className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </div>
        )}

        {loadError ? (
          <p className="mt-8 rounded-lg border border-line bg-card p-6 text-center text-sm text-fg-muted">
            לא הצלחנו לטעון את לוח השעות. רעננו את הדף ונסו שוב.
          </p>
        ) : !ready ? (
          <div className="mt-10 flex justify-center">
            <Spinner />
          </div>
        ) : (
          <>
            <div className="mt-8 lg:hidden">
              <Segmented
                label="בחירת יום"
                value={day}
                onChange={setDay}
                options={MEETING_DAYS.map((d) => ({ value: d.date, label: d.label }))}
              />
            </div>
            <div className="mt-4 grid gap-6 lg:mt-8 lg:grid-cols-2">
              {MEETING_DAYS.map((d) => (
                <section key={d.date} className={d.date === day ? "" : "hidden lg:block"} aria-label={d.label}>
                  <h2 className="mb-3 text-lg font-semibold text-fg">{d.label}</h2>
                  <ul className="divide-y divide-line overflow-hidden rounded-lg border border-line bg-card">
                    {slotsForDay(d.date).map((slot) => (
                      <SlotRow
                        key={slot.id}
                        slot={slot}
                        booking={bookings[slot.id]}
                        mine={myBooking?.id === slot.id}
                        canBook={!myBooking || isTeacher}
                        isTeacher={isTeacher}
                        open={openSlot === slot.id}
                        onOpen={() => {
                          setMessage(null);
                          setOpenSlot(slot.id);
                        }}
                        onClose={() => setOpenSlot(null)}
                        onBook={(s, p) => book(slot, s, p)}
                        onCancel={(asTeacher) => cancel(slot.id, `${d.label} בשעה ${slot.time}`, asTeacher)}
                      />
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </>
        )}
      </div>

      {bookings && <PrintTable bookings={bookings} showParents={isTeacher} />}
    </PageShell>
  );
}

function SlotRow({
  slot,
  booking,
  mine,
  canBook,
  isTeacher,
  open,
  onOpen,
  onClose,
  onBook,
  onCancel,
}: {
  slot: MeetingSlot;
  booking?: MeetingBooking;
  mine: boolean;
  canBook: boolean;
  isTeacher: boolean;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onBook: (studentName: string, parentName: string) => Promise<boolean>;
  onCancel: (asTeacher: boolean) => void;
}) {
  const time = <span className="w-28 shrink-0 whitespace-nowrap text-right font-medium tabular-nums text-fg" dir="ltr">{slot.range}</span>;

  if (booking) {
    return (
      <li className={`flex min-h-14 items-center gap-3 px-4 py-2.5 ${mine ? "bg-accent-soft" : ""}`}>
        {time}
        <span className="min-w-0 flex-1 truncate text-sm text-fg">
          {booking.studentName}
          {isTeacher && <span className="text-fg-muted"> · {booking.parentName}</span>}
        </span>
        {mine ? (
          <Badge tone="accent">הפגישה שלכם</Badge>
        ) : (
          <Badge>תפוס</Badge>
        )}
        {isTeacher && !mine && (
          <button type="button" onClick={() => onCancel(true)} className={`${btn.ghost} min-h-8 px-2`}>
            פינוי
          </button>
        )}
      </li>
    );
  }

  if (open) {
    return (
      <li className="px-4 py-3">
        <BookingForm time={time} onBook={onBook} onClose={onClose} />
      </li>
    );
  }

  return (
    <li className="flex min-h-14 items-center gap-3 px-4 py-2.5">
      {time}
      <span className="flex-1 text-sm text-fg-subtle">פנוי</span>
      <button type="button" onClick={onOpen} disabled={!canBook} className={`${btn.secondary} min-h-9 px-3`}>
        שבצו אותי
      </button>
    </li>
  );
}

function BookingForm({
  time,
  onBook,
  onClose,
}: {
  time: React.ReactNode;
  onBook: (studentName: string, parentName: string) => Promise<boolean>;
  onClose: () => void;
}) {
  const [student, setStudent] = useState("");
  const [parent, setParent] = useState("");
  const [saving, setSaving] = useState(false);
  const s = student.trim();
  const p = parent.trim();
  const valid = s.length >= NAME_MIN && s.length <= NAME_MAX && p.length >= NAME_MIN && p.length <= NAME_MAX;

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (!valid || saving) return;
        setSaving(true);
        const ok = await onBook(s, p);
        if (!ok) setSaving(false);
      }}
      className="space-y-3"
    >
      <div className="flex items-center gap-3">
        {time}
        <span className="text-sm font-medium text-accent">שיבוץ לשעה הזאת</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block text-fg-muted">שם התלמיד/ה</span>
          <input
            autoFocus
            value={student}
            maxLength={NAME_MAX}
            onChange={(e) => setStudent(e.target.value)}
            className="h-10 w-full rounded-md border border-line-strong bg-canvas px-3 text-fg"
            required
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-fg-muted">שם ההורה</span>
          <input
            value={parent}
            maxLength={NAME_MAX}
            onChange={(e) => setParent(e.target.value)}
            className="h-10 w-full rounded-md border border-line-strong bg-canvas px-3 text-fg"
            required
          />
        </label>
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={!valid || saving} className={btn.primary}>
          {saving ? "שומר…" : "אישור השיבוץ"}
        </button>
        <button type="button" onClick={onClose} className={btn.ghost}>
          ביטול
        </button>
      </div>
    </form>
  );
}

/** Print only: one clean table per day, empty rows left blank for walk-ins. */
function PrintTable({ bookings, showParents }: { bookings: Record<string, MeetingBooking>; showParents: boolean }) {
  return (
    <div className="hidden print:block">
      {MEETING_DAYS.map((d, i) => (
        <section key={d.date} className={i > 0 ? "break-before-page" : ""}>
          <h1 className="mb-1 text-xl font-bold">ימי הורים · {d.label}</h1>
          <p className="mb-4 text-sm text-fg-muted">
            {MEETING_START}–{MEETING_END} · פגישות של {SLOT_MINUTES} דקות
          </p>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="w-28 border border-line px-2 py-1.5 text-right">שעה</th>
                <th className="border border-line px-2 py-1.5 text-right">שם התלמיד/ה</th>
                <th className="border border-line px-2 py-1.5 text-right">שם ההורה</th>
                <th className="w-[35%] border border-line px-2 py-1.5 text-right">הערות</th>
              </tr>
            </thead>
            <tbody>
              {slotsForDay(d.date).map((slot) => {
                const b = bookings[slot.id];
                return (
                  <tr key={slot.id} className="break-inside-avoid">
                    <td className="border border-line px-2 py-1.5 tabular-nums" dir="ltr">
                      {slot.range}
                    </td>
                    <td className="border border-line px-2 py-1.5">{b?.studentName ?? ""}</td>
                    <td className="border border-line px-2 py-1.5">{showParents ? b?.parentName ?? "" : ""}</td>
                    <td className="border border-line px-2 py-1.5" />
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      ))}
    </div>
  );
}
