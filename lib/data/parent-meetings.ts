/**
 * Parent-teacher meetings: the days and hours parents can book (/parents/meetings).
 * Change the dates or hours here; the page and the printout follow.
 */

export const PARENT_MEETINGS_COLLECTION = "parent_meetings";

export interface MeetingDay {
  /** ISO date, part of every slot id. */
  date: string;
  /** Short label shown on the page and on the printout. */
  label: string;
}

export const MEETING_DAYS: MeetingDay[] = [
  { date: "2026-11-29", label: "יום א׳, 29.11" },
  { date: "2026-11-30", label: "יום ב׳, 30.11" },
];

export const MEETING_START = "14:00";
export const MEETING_END = "19:00";
export const SLOT_MINUTES = 15;

export interface MeetingSlot {
  id: string;
  date: string;
  /** "14:15" */
  time: string;
  /** "14:15–14:30" */
  range: string;
}

/** A booked slot as stored in Firestore (document id = slot id). */
export interface MeetingBooking {
  day: string;
  time: string;
  studentName: string;
  parentName: string;
  ownerUid: string;
}

function toMinutes(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function toHHMM(minutes: number) {
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}

export function slotId(date: string, time: string) {
  return `${date}_${time.replace(":", "")}`;
}

export function slotsForDay(date: string): MeetingSlot[] {
  const slots: MeetingSlot[] = [];
  for (let t = toMinutes(MEETING_START); t + SLOT_MINUTES <= toMinutes(MEETING_END); t += SLOT_MINUTES) {
    const time = toHHMM(t);
    slots.push({ id: slotId(date, time), date, time, range: `${time}–${toHHMM(t + SLOT_MINUTES)}` });
  }
  return slots;
}

export function dayLabel(date: string) {
  return MEETING_DAYS.find((d) => d.date === date)?.label ?? date;
}
