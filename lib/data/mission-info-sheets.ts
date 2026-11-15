// Short info sheets for each stage of "Mission: New Home".
// One line per term, a few diagrams, no destination data (that stays in the data cards).

export type DiagramId = "spheres" | "solarSystem" | "gravity" | "motions" | "phases" | "eclipse" | "tools";

export interface InfoSheet {
  cards: { icon: string; term: string; line: string }[];
  diagrams: { id: DiagramId; caption: string }[];
}

export const INFO_SHEETS: Record<string, InfoSheet> = {
  s1: {
    cards: [
      { icon: "🌍", term: "מערכת כדור הארץ", line: "4 ספירות שפועלות יחד" },
      { icon: "🪨", term: "גאוספרה", line: "סלעים, קרקע והרים" },
      { icon: "💧", term: "הידרוספרה", line: "כל המים: ים, נהרות, קרח" },
      { icon: "🌬️", term: "אטמוספרה", line: "שכבת האוויר סביב כדור הארץ" },
      { icon: "🌱", term: "ביוספרה", line: "כל היצורים החיים" },
      { icon: "🔄", term: "יחסי גומלין", line: "שינוי בספירה אחת משנה ספירה אחרת" },
    ],
    diagrams: [{ id: "spheres", caption: "כל ספירה משפיעה על האחרות" }],
  },
  s2: {
    cards: [
      { icon: "⭐", term: "כוכב", line: "מפיק אור וחום משלו (כמו השמש)" },
      { icon: "🪨", term: "כוכב לכת סלעי", line: "קטן, עם קרקע מוצקה" },
      { icon: "🪐", term: "כוכב לכת גזי", line: "ענק, עשוי גזים, אין עליו קרקע" },
      { icon: "🌙", term: "ירח", line: "מקיף כוכב לכת" },
      { icon: "☀️", term: "מערכת השמש", line: "השמש וכל מה שמקיף אותה" },
      { icon: "📏", term: "שנת אור", line: "מרחק! הדרך שהאור עובר בשנה" },
      { icon: "🧲", term: "כוח הכבידה", line: "משיכה בין גופים. תלוי במסה ובמרחק" },
    ],
    diagrams: [
      { id: "solarSystem", caption: "4 סלעיים קרובים, 4 גזיים רחוקים" },
      { id: "gravity", caption: "יותר מסה ← יותר משיכה. יותר מרחק ← פחות משיכה" },
    ],
  },
  s3: {
    cards: [
      { icon: "🔄", term: "סיבוב עצמי", line: "סביב הציר ← יום ולילה" },
      { icon: "⭕", term: "הקפה", line: "מסביב לשמש ← שנה" },
      { icon: "↗️", term: "נטיית ציר הסיבוב", line: "הציר עקום (בכדור הארץ 23.5°)" },
      { icon: "🍂", term: "עונות השנה", line: "בגלל נטיית הציר, לא בגלל המרחק" },
      { icon: "🌓", term: "מופעי הירח", line: "רואים חלק אחר מהצד המואר" },
      { icon: "🌑", term: "ליקוי חמה", line: "הירח מסתיר את השמש" },
    ],
    diagrams: [
      { id: "motions", caption: "סיבוב עצמי = יום. הקפה = שנה" },
      { id: "phases", caption: "הירח לא מאיר, הוא מחזיר את אור השמש" },
      { id: "eclipse", caption: "ליקוי חמה: שמש, ירח, כדור הארץ בקו ישר" },
    ],
  },
  s4: {
    cards: [
      { icon: "🔭", term: "טלסקופ", line: "מסתכל על החלל מרחוק" },
      { icon: "🛰️", term: "לוויין", line: "מקיף את כדור הארץ" },
      { icon: "🚀", term: "גשושית", line: "נשלחת אל גרם שמיים אחר" },
      { icon: "🗑️", term: "פסולת חלל", line: "לוויינים מתים ושברים במסלול" },
      { icon: "🤝", term: "אחריות סביבתית גלובלית", line: "כולם שומרים יחד על הסביבה" },
    ],
    diagrams: [{ id: "tools", caption: "כל כלי עובד במרחק אחר" }],
  },
  s5: {
    cards: [
      { icon: "1️⃣", term: "ציון 1", line: "גרוע מאוד, אי אפשר לחיות כך" },
      { icon: "3️⃣", term: "ציון 3", line: "אפשרי, עם ציוד מיוחד" },
      { icon: "5️⃣", term: "ציון 5", line: "כמו בכדור הארץ" },
      { icon: "✅", term: "המלצה", line: "כן / לא / כן בתנאים" },
      { icon: "⚖️", term: "יתרון וקושי", line: "אחד מכל סוג, מהנתונים" },
      { icon: "🏷️", term: "שם ליישוב", line: "ולמה בחרתם בו" },
    ],
    diagrams: [],
  },
};
