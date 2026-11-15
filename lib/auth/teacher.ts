import type { User } from "firebase/auth";

// The single list of teacher accounts used by the client.
// Keep it in sync with isAdmin() in firestore.rules, which enforces the same list server-side.
export const TEACHER_EMAILS = ["niroari@gmail.com", "nirozari@gmail.com"];

export function isTeacherUser(user: Pick<User, "email"> | null | undefined): boolean {
  return Boolean(user?.email && TEACHER_EMAILS.includes(user.email));
}
