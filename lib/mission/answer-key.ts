// Answer key for "Mission: New Home".
// Import this only from the API route (app/api/mission-check) and the teacher
// dashboard. Never import it from the student page, or the answers ship to students.

import type { CheckId, DestinationId } from "@/lib/data/mission-new-home";

type Expected =
  | { kind: "value"; value: number; tol: number } // relative tolerance
  | { kind: "abs"; value: number; tol: number } // absolute tolerance
  | { kind: "range"; min: number; max: number }
  | { kind: "exact"; value: number };

interface DestinationKey {
  checks: Record<Exclude<CheckId, "age">, Expected>;
  yearDays: number;
  display: Record<CheckId, string>;
  notes: {
    dayNight: string;
    seasons: string;
    sky: string;
    eclipses: string;
    mission: string;
    recommendation: string;
  };
}

export const ANSWER_KEY: Record<DestinationId, DestinationKey> = {
  mars: {
    checks: {
      blank1: { kind: "value", value: 0.38, tol: 0.1 },
      blank2: { kind: "value", value: 687, tol: 0.05 },
      travel: { kind: "value", value: 38, tol: 0.15 },
      radio: { kind: "range", min: 5, max: 45 },
      weight: { kind: "value", value: 19, tol: 0.12 },
    },
    yearDays: 687,
    display: {
      blank1: "כבידה 0.38",
      blank2: "687 ימים",
      travel: "55,000,000 ÷ 60,000 ≈ 920 שעות ≈ 38 ימים",
      radio: "6–44 דקות (הלוך ושוב)",
      weight: "כ-19 ק\"ג",
      age: "גיל × 365 ÷ 687 (בן 13 ≈ 7)",
    },
    notes: {
      dayNight: "יום כמעט כמו שלנו; אפשר לשמור על שגרה רגילה. צריך אזורי זמן.",
      seasons: "כן: נטייה של 25°. כל עונה ארוכה פי 2 בערך (כ-6 חודשים).",
      sky: "שני ירחים קטנים (פובוס ודימוס) עם מופעים. השמש נראית קטנה יותר.",
      eclipses: "פובוס חוסם חלק מהשמש, אבל קטן מדי לליקוי מלא.",
      mission: "Perseverance (2020) או Curiosity (2011): רכבי שטח. סימנים לאגמים ונהרות עתיקים.",
      recommendation: "היעד הסביר ביותר כיום.",
    },
  },
  venus: {
    checks: {
      blank1: { kind: "value", value: 243, tol: 0.05 },
      blank2: { kind: "abs", value: 465, tol: 30 },
      travel: { kind: "value", value: 26, tol: 0.15 },
      radio: { kind: "range", min: 4, max: 28 },
      weight: { kind: "value", value: 45, tol: 0.08 },
    },
    yearDays: 225,
    display: {
      blank1: "243 ימי כדור הארץ (יותר מהשנה שלו)",
      blank2: "כ-465°C",
      travel: "38,000,000 ÷ 60,000 ≈ 630 שעות ≈ 26 ימים",
      radio: "4–28 דקות",
      weight: "כ-45 ק\"ג",
      age: "גיל × 365 ÷ 225 (בן 13 ≈ 21)",
    },
    notes: {
      dayNight: "יום ארוך משנה; השמש זורחת במערב. צריך תאורה מלאכותית.",
      seasons: "כמעט אין: 177° שווה נטייה של 3° \"הפוכה\".",
      sky: "העננים מסתירים את השמיים כולם. אין ירחים.",
      eclipses: "אין ירחים, ולכן אין ליקויי חמה.",
      mission: "Magellan (1989): מכ\"ם שמיפה את פני השטח. ונרה 13 (1981): נחתת ששרדה שעות ספורות.",
      recommendation: "בלתי אפשרי על הקרקע. תשובה מקורית: ערים מרחפות גבוה באטמוספרה.",
    },
  },
  europa: {
    checks: {
      blank1: { kind: "value", value: 3122, tol: 0.05 },
      blank2: { kind: "abs", value: -160, tol: 25 },
      travel: { kind: "value", value: 410, tol: 0.15 },
      radio: { kind: "range", min: 60, max: 110 },
      weight: { kind: "value", value: 6.5, tol: 0.15 },
    },
    yearDays: 4333,
    display: {
      blank1: "כ-3,120 ק\"מ",
      blank2: "כמינוס 160°C",
      travel: "590,000,000 ÷ 60,000 ≈ 9,800 שעות ≈ 410 ימים",
      radio: "כ-1 עד 2 שעות (66–108 דקות)",
      weight: "כ-6.5 ק\"ג",
      age: "גיל ÷ 11.9 (בן 13 ≈ 1)",
    },
    notes: {
      dayNight: "יום של 3.5 ימים; אותו צד תמיד מול צדק, וצדק תמיד נראה.",
      seasons: "אין: נטייה של כמעט 0°.",
      sky: "צדק ענק, קבוע במקום אחד, ועובר מופעים כמו הירח שלנו.",
      eclipses: "צדק מסתיר את השמש בכל הקפה.",
      mission: "Galileo (1989): ראיות לאוקיינוס. Europa Clipper (2024) אמורה להגיע ב-2030.",
      recommendation: "הקרינה של צדק היא המכשול העיקרי.",
    },
  },
  titan: {
    checks: {
      blank1: { kind: "value", value: 5150, tol: 0.05 },
      blank2: { kind: "value", value: 29.5, tol: 0.05 },
      travel: { kind: "value", value: 2.3, tol: 0.15 },
      radio: { kind: "range", min: 130, max: 190 },
      weight: { kind: "value", value: 7, tol: 0.15 },
    },
    yearDays: 10759,
    display: {
      blank1: "כ-5,150 ק\"מ (גדול מכוכב חמה)",
      blank2: "29.5 שנות כדור הארץ",
      travel: "1,200,000,000 ÷ 60,000 = 20,000 שעות ≈ 2.3 שנים",
      radio: "כ-2 עד 3 שעות (134–188 דקות)",
      weight: "כ-7 ק\"ג",
      age: "גיל ÷ 29.5 (בן 13 ≈ 0.44)",
    },
    notes: {
      dayNight: "יום של 16 ימים; אותו צד תמיד מול שבתאי.",
      seasons: "כן: נטייה של 27°. כל עונה נמשכת כ-7 שנים.",
      sky: "ערפל כתום סמיך; שבתאי כמעט לא נראה מהקרקע.",
      eclipses: "שבתאי מסתיר את השמש בחלק מהעונות.",
      mission: "Cassini-Huygens (1997): Huygens נחתה ב-2005; אגמי מתאן. Dragonfly (מתוכננת): רחפן.",
      recommendation: "קר מאוד, אבל האטמוספרה מגנה מקרינה ואפשר ללכת בלי חליפת לחץ.",
    },
  },
  proxima: {
    checks: {
      blank1: { kind: "value", value: 4.24, tol: 0.05 },
      blank2: { kind: "value", value: 11.2, tol: 0.05 },
      travel: { kind: "value", value: 77000, tol: 0.15 },
      radio: { kind: "value", value: 8.5, tol: 0.08 },
      weight: { kind: "range", min: 40, max: 70 },
    },
    yearDays: 11.2,
    display: {
      blank1: "כ-4.2 שנות אור (הכוכב הקרוב לשמש)",
      blank2: "כ-11.2 ימים",
      travel: "4.2 × 9.5 טריליון ÷ 60,000 ≈ 77,000 שנה",
      radio: "כ-8.5 שנים",
      weight: "לא ידוע; הערכה של כ-55 ק\"ג מתקבלת עם נימוק",
      age: "גיל × 365 ÷ 11.2 (בן 13 ≈ 420)",
    },
    notes: {
      dayNight: "כנראה אין מחזור יום ולילה; מומלץ לבנות ברצועת הדמדומים.",
      seasons: "לא ידוע. תשובה מצוינת: \"תלוי בנטיית הציר, שעדיין לא נמדדה\".",
      sky: "כוכב אדום, עמום יותר מהשמש אבל נראה גדול יותר.",
      eclipses: "לא ידוע אם יש לו ירחים.",
      mission: "התגלה ב-2016 בטלסקופ של המצפה האירופי הדרומי בצ'ילה; הכוכב \"מתנדנד\" בגלל משיכת כוכב הלכת.",
      recommendation: "אי אפשר להגיע בחיי אדם וחסר מידע. \"לא עכשיו, קודם לחקור\" היא תשובה מצוינת.",
    },
  },
  trappist: {
    checks: {
      blank1: { kind: "value", value: 40.7, tol: 0.06 },
      blank2: { kind: "exact", value: 7 },
      travel: { kind: "value", value: 725000, tol: 0.15 },
      radio: { kind: "value", value: 81, tol: 0.06 },
      weight: { kind: "value", value: 40, tol: 0.12 },
    },
    yearDays: 6.1,
    display: {
      blank1: "כ-40 שנות אור",
      blank2: "7 כוכבי לכת",
      travel: "40 × 9.5 טריליון ÷ 60,000 ≈ 720,000 שנה",
      radio: "כ-80 שנה",
      weight: "כ-40 ק\"ג",
      age: "גיל × 365 ÷ 6.1 (בן 13 ≈ 780)",
    },
    notes: {
      dayNight: "צד מואר קבוע; מומלץ לבנות באזור הדמדומים.",
      seasons: "לא ידוע.",
      sky: "כוכב אדום גדול; כוכבי הלכת השכנים נראים כמו ירחים, עם מופעים.",
      eclipses: "כוכבי לכת שכנים עוברים לפני הכוכב.",
      mission: "התגלה ב-2016–2017: טלסקופ TRAPPIST, הטלסקופ החללי ספיצר, וכיום ג'יימס ווב.",
      recommendation: "אי אפשר להגיע בחיי אדם וחסר מידע. \"לא עכשיו, קודם לחקור\" היא תשובה מצוינת.",
    },
  },
};

// General notes for the teacher, per question id.
export const QUESTION_NOTES: Record<string, string> = {
  s1q1: "כל חלקי כדור הארץ קשורים ומשפיעים זה על זה. בית חדש צריך לתפקד כמערכת, לא רק להיות נגיש לחללית.",
  s1q2: "בכל היעדים הביוספרה חסרה ואין אוויר לנשימה. תשובה טובה: חמצן, מזון, חום/קירור, מים ומגן מקרינה.",
  s1q3: "לדוגמה: הר געש ← אפר חוסם שמש (אטמוספרה) ← גשם חומצי בנחלים (הידרוספרה) ← פגיעה בצמחים (ביוספרה). לפחות 3 ספירות, עם סיבה-תוצאה.",
  s1q4: "כל שרשרת הגיונית מתקבלת (למשל במאדים: חימום ← קרח נמס ← אדי מים באוויר ← קרקע שוקעת).",
  s1q5: "אין תשובה אחת. בדרך כלל אטמוספרה או הידרוספרה; מה שחשוב הוא הנימוק.",
  s2q1: "כוכב מפיק אור משלו; כוכב לכת מקיף כוכב ומחזיר את אורו; ירח מקיף כוכב לכת. ננס אדום הוא כוכב קטן וקר.",
  s2q2: "ארבעה יעדים במערכת השמש; פרוקסימה b ו-TRAPPIST-1e מחוצה לה. כל השישה בשביל החלב.",
  s2q3: "לכוכבי לכת גזיים אין קרקע מוצקת והלחץ בעומק מוחץ.",
  s2q4: "יחידת מרחק: המרחק שאור עובר בשנה, כ-9.5 טריליון ק\"מ. טעות נפוצה.",
  s2q5: "הלוך ושוב. תשובה של כיוון אחד בלבד שווה ציון חלקי. בחירום המתיישבים יפעלו לבד.",
  s2q6: "הדרך חשובה מהתוצאה (÷24 לימים, ÷8,760 לשנים). מסע אמיתי למאדים כ-7 חודשים, כי חלליות נעות בקשת.",
  s2q7: "כוח משיכה שתלוי במסה ובמרחק. הכבידה של השמש (או של צדק/שבתאי/הננס האדום) מחזיקה את היעד במסלולו.",
  s2q8: "יתרון: קל להרים ולקפוץ. בעיה: שרירים ועצמות נחלשים, בעיות במחזור הדם.",
  s2q9: "כבידה חלשה לא מחזיקה את מולקולות הגז, והן בורחות לחלל לאורך מיליוני שנים.",
  s3q3: "השנה נקבעת לפי ההקפה של הכוכב או של כוכב הלכת שהיעד נמצא עליו.",
  s3q5: "העונות נגרמות מנטיית ציר הסיבוב. הוכחות: כשבישראל קיץ באוסטרליה חורף; כדור הארץ קרוב לשמש ביותר בתחילת ינואר.",
  s3q7: "ירח מחזיר אור שמש; בזמן ההקפה רואים חלק גדול או קטן יותר מהצד המואר.",
  s3q8: "הירח עובר בין השמש לכדור הארץ ומטיל צל. השמש גדולה פי 400 ורחוקה פי 400, ולכן נראים באותו גודל.",
  s3q9: "החיכוך מהמתיחה והכיווץ מייצר חום ששומר על האוקיינוס נוזלי. \"הקרח יכול להיסדק\" - ציון חלקי.",
  s4q1: "כל משימה אמיתית עם שם, שנה, כלי וגילוי מתקבלת.",
  s4q2: "לוויינים מתים, חלקי טילים ושברים במהירות עצומה; התנגשות יוצרת עוד שברים. כללים: פירוק/שריפה בסוף הדרך, טילים רב-פעמיים, איסוף פסולת, שיתוף מידע.",
  s4q3: "חיידקים מכדור הארץ עלולים להשמיד חיים מקומיים או לבלבל את המדענים; לכן מעקרים חלליות.",
  s4q4: "אין תשובה אחת. טיעון בעד, טיעון נגד, עמדה מנומקת. דוגמאות: GPS, לווייני מזג אוויר, תקשורת, מעקב אחרי שריפות ושינויי אקלים.",
  s4q5: "תשובה מצוינת: אף יעד לא דומה לכדור הארץ ואפשר לשלוח מעט אנשים, ולכן שמירה על כדור הארץ עדיין הכרחית.",
  s5q1: "הציונים תואמים את הנתונים (5 לטמפרטורה בנוגה או בטיטאן שגוי).",
  s5q2: "כל 5 הרכיבים ולפחות 6 מונחים מסומנים; ההמלצה נובעת מהציונים ומהשלבים הקודמים.",
};

export function expectedAge(destinationId: DestinationId, earthAge: number) {
  return (earthAge * 365) / ANSWER_KEY[destinationId].yearDays;
}

// Parses numbers written as "1,200", "1.2", "-160", "מינוס 160", "כ-38" (= about 38).
// A minus sign right after a letter ("כ-") is a Hebrew prefix hyphen, not a sign.
export function parseNumber(raw: string): number | null {
  const cleaned = raw.replace(/[,‎‏]/g, "").trim();
  const match = cleaned.match(/(?:^|[^A-Za-z֐-׿\d.])(-?\d+(?:\.\d+)?)/);
  if (!match) return null;
  let n = Number(match[1]);
  if (!Number.isFinite(n)) return null;
  if (/מינוס/.test(cleaned) && n > 0) n = -n;
  return n;
}

export interface CheckResult {
  correct: boolean;
  direction?: "high" | "low";
}

function evaluate(expected: Expected, n: number): CheckResult {
  switch (expected.kind) {
    case "value": {
      const diff = Math.abs(n - expected.value) / Math.abs(expected.value);
      return diff <= expected.tol ? { correct: true } : { correct: false, direction: n > expected.value ? "high" : "low" };
    }
    case "abs":
      return Math.abs(n - expected.value) <= expected.tol
        ? { correct: true }
        : { correct: false, direction: n > expected.value ? "high" : "low" };
    case "range":
      return n >= expected.min && n <= expected.max
        ? { correct: true }
        : { correct: false, direction: n > expected.max ? "high" : "low" };
    case "exact":
      return n === expected.value ? { correct: true } : { correct: false, direction: n > expected.value ? "high" : "low" };
  }
}

export function checkAnswer(
  destinationId: DestinationId,
  checkId: CheckId,
  value: number,
  earthAge?: number,
): CheckResult {
  if (checkId === "age") {
    const age = earthAge ?? 0;
    const target = expectedAge(destinationId, age);
    return evaluate({ kind: "value", value: target, tol: 0.1 }, value);
  }
  return evaluate(ANSWER_KEY[destinationId].checks[checkId], value);
}
