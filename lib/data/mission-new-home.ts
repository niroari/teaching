// Content for the "Mission: New Home" research assignment (Earth Sciences, Unit 1).
// This file is safe to ship to students: it holds no answers. Expected values
// live in lib/mission/answer-key.ts, which only the API route and the teacher
// dashboard import.

export type DestinationId = "mars" | "venus" | "europa" | "titan" | "proxima" | "trappist";

export type CheckId = "blank1" | "blank2" | "travel" | "radio" | "weight" | "age";

export interface DataBlank {
  id: "blank1" | "blank2";
  label: string;
  unit: string;
}

export interface Destination {
  id: DestinationId;
  name: string;
  emoji: string;
  kind: string;
  orbits: string;
  // `null` marks a value students must look up themselves.
  distance: string | null;
  lightTime: string;
  diameter: string | null;
  gravity: string | null;
  day: string | null;
  year: string | null;
  tilt: string;
  atmosphere: string;
  temperature: string | null;
  water: string;
  special: string;
  blanks: [DataBlank, DataBlank];
  travelUnit: string;
  radioUnit: string;
}

export const DESTINATIONS: Destination[] = [
  {
    id: "mars",
    name: "מאדים",
    emoji: "🔴",
    kind: "כוכב לכת סלעי",
    orbits: "השמש",
    distance: "55–400 מיליון ק\"מ",
    lightTime: "3–22 דקות",
    diameter: "6,780",
    gravity: null,
    day: "24 שעות ו-37 דקות",
    year: null,
    tilt: "25°",
    atmosphere: "דלילה מאוד, בעיקר פחמן דו-חמצני (לחץ של כ-1% מכדור הארץ)",
    temperature: "כמינוס 60°C",
    water: "קרח בקטבים ומתחת לקרקע",
    special: "שני ירחים קטנים, סופות אבק ענקיות",
    blanks: [
      { id: "blank1", label: "כבידה (כדור הארץ = 1)", unit: "" },
      { id: "blank2", label: "אורך שנה", unit: "ימים" },
    ],
    travelUnit: "ימים",
    radioUnit: "דקות",
  },
  {
    id: "venus",
    name: "נוגה",
    emoji: "🟡",
    kind: "כוכב לכת סלעי",
    orbits: "השמש",
    distance: "38–260 מיליון ק\"מ",
    lightTime: "2–14 דקות",
    diameter: "12,100",
    gravity: "0.9",
    day: null,
    year: "225 ימים",
    tilt: "177° (מסתובב \"הפוך\")",
    atmosphere: "עבה מאוד, פחמן דו-חמצני (לחץ פי 90), ענני חומצה גופרתית",
    temperature: null,
    water: "אין",
    special: "אין ירחים, אפקט חממה קיצוני",
    blanks: [
      { id: "blank1", label: "אורך יום", unit: "ימי כדור הארץ" },
      { id: "blank2", label: "טמפרטורה ממוצעת", unit: "°C" },
    ],
    travelUnit: "ימים",
    radioUnit: "דקות",
  },
  {
    id: "europa",
    name: "אירופה",
    emoji: "🧊",
    kind: "ירח של צדק (כוכב לכת גזי)",
    orbits: "צדק",
    distance: "590–970 מיליון ק\"מ",
    lightTime: "33–54 דקות",
    diameter: null,
    gravity: "0.13",
    day: "3.5 ימים (תמיד אותו צד מול צדק)",
    year: "12 שנים (יחד עם צדק)",
    tilt: "כמעט 0°",
    atmosphere: "כמעט אין",
    temperature: null,
    water: "אוקיינוס מלוח מתחת לקרום קרח",
    special: "קרינה חזקה מצדק",
    blanks: [
      { id: "blank1", label: "קוטר", unit: "ק\"מ" },
      { id: "blank2", label: "טמפרטורה ממוצעת", unit: "°C" },
    ],
    travelUnit: "ימים",
    radioUnit: "דקות",
  },
  {
    id: "titan",
    name: "טיטאן",
    emoji: "🟠",
    kind: "ירח של שבתאי (כוכב לכת גזי)",
    orbits: "שבתאי",
    distance: "1.2–1.7 מיליארד ק\"מ",
    lightTime: "67–94 דקות",
    diameter: null,
    gravity: "0.14",
    day: "16 ימים (תמיד אותו צד מול שבתאי)",
    year: null,
    tilt: "27°",
    atmosphere: "עבה, בעיקר חנקן (לחץ פי 1.5)",
    temperature: "כמינוס 180°C",
    water: "אגמים של מתאן נוזלי, ואולי אוקיינוס מים עמוק",
    special: "הגשושית Dragonfly אמורה להגיע אליו",
    blanks: [
      { id: "blank1", label: "קוטר", unit: "ק\"מ" },
      { id: "blank2", label: "אורך שנה (יחד עם שבתאי)", unit: "שנות כדור הארץ" },
    ],
    travelUnit: "שנים",
    radioUnit: "דקות",
  },
  {
    id: "proxima",
    name: "פרוקסימה b",
    emoji: "🔺",
    kind: "כוכב לכת, כנראה סלעי",
    orbits: "הכוכב פרוקסימה קנטאורי (ננס אדום)",
    distance: null,
    lightTime: "אותו מספר, בשנים",
    diameter: "לא ידוע עדיין",
    gravity: "לא ידוע (מסה של כ-1.1 כדורי ארץ)",
    day: "כנראה צד אחד תמיד מואר",
    year: null,
    tilt: "לא ידוע",
    atmosphere: "לא ידוע",
    temperature: "כמינוס 40°C (הערכה)",
    water: "אפשרי: נמצא ב\"אזור החיים\"",
    special: "הכוכב שלו פולט התפרצויות קרינה",
    blanks: [
      { id: "blank1", label: "מרחק מכדור הארץ", unit: "שנות אור" },
      { id: "blank2", label: "אורך שנה", unit: "ימים" },
    ],
    travelUnit: "שנים",
    radioUnit: "שנים",
  },
  {
    id: "trappist",
    name: "TRAPPIST-1e",
    emoji: "🪐",
    kind: "כוכב לכת סלעי",
    orbits: "הכוכב TRAPPIST-1 (ננס אדום)",
    distance: null,
    lightTime: "אותו מספר, בשנים",
    diameter: "11,700",
    gravity: "0.8",
    day: "כנראה צד אחד תמיד מואר",
    year: "6 ימים",
    tilt: "לא ידוע",
    atmosphere: "לא ידוע, נבדק בטלסקופ ג'יימס ווב",
    temperature: "כמינוס 20°C (הערכה)",
    water: "אפשרי: נמצא ב\"אזור החיים\"",
    special: "מספר כוכבי הלכת במערכת שלו: ??",
    blanks: [
      { id: "blank1", label: "מרחק מכדור הארץ", unit: "שנות אור" },
      { id: "blank2", label: "מספר כוכבי הלכת במערכת", unit: "" },
    ],
    travelUnit: "שנים",
    radioUnit: "שנים",
  },
];

export const getDestination = (id: string | undefined | null) =>
  DESTINATIONS.find((d) => d.id === id);

export type QuestionKind = "text" | "long" | "table" | "drawing" | "score" | "check";

export interface Question {
  id: string;
  prompt: string;
  kind: QuestionKind;
  hint?: string;
  sub?: string[];
  rows?: string[];
  cols?: string[];
  check?: CheckId;
  challenge?: boolean;
  // For "check" questions: the label shown next to the numeric answer box.
  valueLabel?: string;
  // Calculation questions: small numbered steps, written for the team's own destination.
  steps?: (d: Destination) => string[];
  // A worked example on a place that is not one of the destinations.
  example?: (d: Destination) => string[];
}

// Destinations outside the solar system, measured in light years.
export const isFar = (d: Destination) => d.id === "proxima" || d.id === "trappist";


export interface Stage {
  id: string;
  short: string;
  title: string;
  intro: string;
  terms: string[];
  sections: { title?: string; questions: Question[] }[];
}

export const STAGES: Stage[] = [
  {
    id: "s1",
    short: "שלב 1",
    title: "מה הופך מקום לבית?",
    intro: "מה מאפשר לנו לחיות בכדור הארץ? בשלב הזה תשוו את כדור הארץ ליעד שלכם.",
    terms: ["מערכת כדור הארץ", "גאוספרה", "הידרוספרה", "אטמוספרה", "ביוספרה", "יחסי גומלין"],
    sections: [
      {
        questions: [
          {
            id: "s1q2",
            kind: "table",
            prompt: "מערכת כדור הארץ בנויה מ-4 ספירות. מלאו את הטבלה בעזרת כרטיס הנתונים:",
            rows: ["גאוספרה (סלעים וקרקע)", "הידרוספרה (מים)", "אטמוספרה (אוויר)", "ביוספרה (יצורים חיים)"],
            cols: ["מה יש בכדור הארץ?", "מה יש (או אין) ביעד שלנו?"],
          },
          {
            id: "s1q3",
            kind: "text",
            prompt: "הספירות משפיעות זו על זו. השלימו שרשרת של יחסי גומלין בכדור הארץ, שעוברת ב-3 ספירות לפחות.",
            hint: "דוגמה להתחלה: יורד גשם (הידרוספרה) ← האדמה נרטבת (גאוספרה) ← ...",
          },
          {
            id: "s1q5",
            kind: "text",
            prompt: "איזו ספירה הכי חסרה ביעד שלכם? נמקו.",
            hint: "פתיח: \"ביעד שלנו הכי חסרה ה___, כי ___\".",
          },
        ],
      },
    ],
  },
  {
    id: "s2",
    short: "שלב 2",
    title: "הדרך ליעד",
    intro: "איפה נמצא היעד, כמה זמן ייקח להגיע אליו, ומה נרגיש כשננחת?",
    terms: ["כוכב", "כוכב לכת סלעי", "כוכב לכת גזי", "מערכת השמש", "שנת אור", "כוח הכבידה"],
    sections: [
      {
        title: "א. איפה זה?",
        questions: [
          {
            id: "s2q1",
            kind: "text",
            prompt: "השלימו את המשפטים על היעד שלכם:",
            sub: [
              "היעד שלנו הוא ___ (כוכב לכת סלעי / ירח של כוכב לכת גזי).",
              "הוא מקיף את ___, והכוכב שמאיר אותו הוא ___.",
              "הוא נמצא / לא נמצא במערכת השמש.",
            ],
            hint: "זכרו: כוכב מפיק אור משלו. כוכב לכת מקיף כוכב.",
          },
          {
            id: "s2q4",
            kind: "text",
            prompt: "\"שנת אור\": האם זו יחידה של זמן או של מרחק? הסבירו במשפט אחד.",
          },
        ],
      },
      {
        title: "ב. כמה זמן לוקח להגיע?",
        questions: [
          {
            id: "s2q5",
            kind: "check",
            check: "radio",
            prompt: "מתיישב שולח הודעת רדיו הביתה. הודעות רדיו נעות במהירות האור. כמה זמן יחכה עד שתגיע תשובה?",
            steps: (d) => [
              isFar(d)
                ? `האור עובר שנת אור אחת בשנה אחת. לכן ההודעה מגיעה מ${d.name} לכדור הארץ אחרי מספר שנים ששווה למרחק שמצאתם בשנות אור.`
                : `מצאו בכרטיס, בעמודה "זמן שהאור עובר", את הזמן של ${d.name}. קחו את המספר הקטן.`,
              "זה הזמן שלוקח להודעה להגיע הביתה. כתבו אותו.",
              "התשובה מכדור הארץ חוזרת באותה דרך, ולוקחת בדיוק אותו זמן.",
              "חברו: זמן ההליכה + זמן החזרה. זו התשובה.",
              "כתבו במשפט אחד: איך זה ישפיע על שיחה עם המשפחה?",
            ],
            example: () => [
              "דוגמה: מהשמש לכדור הארץ האור מגיע בכ-8 דקות.",
              "הלוך: 8 דקות. חזור: 8 דקות.",
              "8 + 8 = 16 דקות.",
            ],
            valueLabel: "זמן ההמתנה לתשובה",
          },
          {
            id: "s2q6",
            kind: "check",
            check: "travel",
            prompt: "החללית שלנו מהירה מאוד. כמה זמן ייקח לה להגיע ליעד? כתבו את השלבים שעשיתם.",
            steps: (d) =>
              isFar(d)
                ? [
                    "כתבו את המרחק שמצאתם ברשת, בשנות אור.",
                    "החללית צריכה כ-18,000 שנים כדי לעבור שנת אור אחת.",
                    "במחשבון: המרחק × 18,000. התוצאה היא מספר השנים של המסע.",
                    "אדם חי בערך 80 שנה. האם הוא יכול להגיע ליעד במהלך חייו?",
                  ]
                : [
                    d.id === "titan"
                      ? "מצאו בכרטיס את המרחק הקטן של טיטאן: 1.2 מיליארד ק\"מ. זה 1,200 מיליון ק\"מ, אז כתבו 1,200."
                      : `מצאו בכרטיס את המרחק של ${d.name}. קחו את המספר הקטן (במיליוני ק"מ).`,
                    "החללית עוברת כ-1.5 מיליון ק\"מ ביום.",
                    "במחשבון: המרחק ÷ 1.5. התוצאה היא מספר הימים של המסע.",
                    ...(d.id === "titan" ? ["כדי להפוך ימים לשנים: מספר הימים ÷ 365."] : []),
                    "אדם חי בערך 80 שנה. האם הוא יכול להגיע ליעד במהלך חייו?",
                  ],
            example: (d) =>
              isFar(d)
                ? ["דוגמה: הכוכב סיריוס רחוק 8.6 שנות אור.", "8.6 × 18,000 = 154,800, כלומר כ-155,000 שנים."]
                : ["דוגמה: הירח רחוק 0.38 מיליון ק\"מ.", "0.38 ÷ 1.5 = 0.25 יום, כלומר כ-6 שעות."],
            valueLabel: "זמן המסע",
          },
        ],
      },
      {
        title: "ג. מה נרגיש כשננחת?",
        questions: [
          {
            id: "s2q8",
            kind: "check",
            check: "weight",
            prompt: "כוח הכבידה תלוי ב-___ וב-___. השלימו, ואז חשבו: אדם שמשקלו 50 ק\"ג עולה על משקל ביעד. מה יראה המשקל?",
            steps: (d) => [
              d.id === "proxima"
                ? "הכבידה בפרוקסימה b לא ידועה. המסה שלו כ-1.1 משל כדור הארץ, אז הניחו שהכבידה היא 1.1."
                : d.gravity
                  ? `מצאו בכרטיס את הכבידה של ${d.name}: ${d.gravity}.`
                  : `השתמשו בכבידה של ${d.name} שמצאתם ברשת.`,
              "במחשבון: 50 × הכבידה. התוצאה היא המשקל ביעד, בק\"ג.",
              "השוו ל-50: האדם ירגיש קל יותר או כבד יותר?",
            ],
            example: () => ["דוגמה: הכבידה בירח היא 0.17.", "50 × 0.17 = 8.5 ק\"ג. על הירח מרגישים קלים מאוד!"],
            valueLabel: "מה יראה המשקל",
          },
          {
            id: "s2q9",
            kind: "text",
            challenge: true,
            prompt: "למאדים ולאירופה יש כבידה נמוכה וגם אטמוספרה דלילה מאוד. מה הקשר בין שני הדברים?",
          },
        ],
      },
    ],
  },
  {
    id: "s3",
    short: "שלב 3",
    title: "לחיות על היעד",
    intro: "כמה זמן נמשך יום? בני כמה תהיו? ומה תראו בשמיים?",
    terms: ["סיבוב עצמי", "הקפה", "נטיית ציר הסיבוב", "עונות השנה", "מופעי הירח", "ליקוי מאורות"],
    sections: [
      {
        title: "א. יום ושנה",
        questions: [
          {
            id: "s3q1",
            kind: "text",
            prompt: "איזו תנועה יוצרת יום ולילה? כמה זמן נמשך יום אחד ביעד שלכם?",
          },
          {
            id: "s3q3",
            kind: "check",
            check: "age",
            prompt: "איזו תנועה קובעת את אורך השנה? ועכשיו: בני כמה הייתם בשנים של היעד?",
            steps: (d) => [
              "כתבו את הגיל שלכם בתיבה למטה.",
              "במחשבון: הגיל × 365. התוצאה היא מספר הימים שחייתם.",
              d.id === "europa"
                ? "אורך השנה באירופה הוא 12 שנים. הפכו לימים: 12 × 365 = 4,380 ימים."
                : d.id === "titan"
                  ? "אורך השנה בטיטאן הוא מספר השנים שמצאתם ברשת. הפכו לימים: מספר השנים × 365."
                  : `מצאו בכרטיס את אורך השנה של ${d.name}, בימים.`,
              `במחשבון: הימים שחייתם ÷ אורך השנה. התוצאה היא הגיל שלכם ב${d.name}.`,
            ],
            example: () => ["דוגמה: בת 13, ושנה בנוגה היא 225 ימים.", "13 × 365 = 4,745 ימים.", "4,745 ÷ 225 = 21. היא בת 21 בשנים של נוגה!"],
            valueLabel: "הגיל שלכם בשנים של היעד",
          },
          {
            id: "s3q5",
            kind: "text",
            prompt: "מהנדס כתב: \"בקיץ חם כי כדור הארץ קרוב לשמש\". זו טעות! מה באמת יוצר את עונות השנה?",
            hint: "פתיח: \"העונות לא נוצרות בגלל ___, אלא בגלל ___\".",
          },
        ],
      },
      {
        title: "ב. השמיים מעל היישוב",
        questions: [
          {
            id: "s3q7",
            kind: "text",
            prompt: "למה הירח נראה לנו פעם מלא ופעם חצי? הסבירו במשפט אחד.",
            hint: "רמז: הירח לא מאיר בעצמו.",
          },
          {
            id: "s3q8",
            kind: "text",
            prompt: "איך נוצר ליקוי חמה? סדרו את השמש, הירח וכדור הארץ לפי הסדר, והסבירו מה קורה.",
          },
          {
            id: "s3q9",
            kind: "text",
            challenge: true,
            prompt: "הירח שלנו יוצר גאות ושפל. צדק ושבתאי מושכים את הירחים שלהם חזק הרבה יותר. מה זה יכול לעשות לקרח ולמים באירופה ובטיטאן?",
          },
        ],
      },
    ],
  },
  {
    id: "s4",
    short: "שלב 4",
    title: "האחריות שלנו",
    intro: "חקר החלל עוזר לנו, אבל יש לו גם מחיר.",
    terms: ["טלסקופ, לוויין או גשושית", "פסולת חלל", "אחריות סביבתית גלובלית"],
    sections: [
      {
        questions: [
          {
            id: "s4q1",
            kind: "table",
            prompt: "מצאו ברשת משימת חלל אמיתית שחקרה את היעד שלכם:",
            rows: ["המשימה"],
            cols: ["שם המשימה", "שנה", "סוג הכלי (טלסקופ / לוויין / גשושית)", "מה גילתה?"],
          },
          {
            id: "s4q2",
            kind: "text",
            prompt: "מהי פסולת חלל? הציעו כלל אחד שיקטין אותה.",
          },
          {
            id: "s4q4",
            kind: "long",
            prompt: "הדילמה: הפרויקט יעלה הרבה כסף. יש שאומרים שעדיף להשקיע אותו בבעיות של כדור הארץ. כתבו 4–6 שורות:",
            sub: [
              "בעד חקר החלל: ... (רמז: GPS ותחזית מזג אוויר הגיעו מלוויינים)",
              "נגד: ...",
              "אנחנו חושבים ש... כי...",
            ],
            hint: "נסו להשתמש במונח \"אחריות סביבתית גלובלית\".",
          },
        ],
      },
    ],
  },
  {
    id: "s5",
    short: "שלב 5",
    title: "ההמלצה לסוכנות",
    intro: "הגיע הזמן להחליט: האם להקים יישוב ביעד שלכם?",
    terms: [],
    sections: [
      {
        questions: [
          {
            id: "s5q1",
            kind: "score",
            prompt: "תנו לכל תנאי ציון מ-1 (גרוע מאוד) עד 5 (כמו בכדור הארץ), וכתבו סיבה קצרה.",
            rows: ["מרחק וזמן מסע", "כבידה", "אוויר לנשימה", "מים", "טמפרטורה"],
          },
          {
            id: "s5q2",
            kind: "long",
            prompt: "כתבו מכתב קצר לסוכנות החלל (6–8 שורות):",
            sub: [
              "ההמלצה שלנו: כן / לא / כן בתנאים.",
              "יתרון אחד וקושי אחד של היעד.",
              "שם ליישוב, ולמה בחרנו בו.",
            ],
            hint: "השתמשו במכתב ב-4 מונחים לפחות מהעבודה.",
          },
        ],
      },
    ],
  },
];

export const TERM_GROUPS: { title: string; terms: string[] }[] = [
  {
    title: "4 הספירות",
    terms: ["מערכת כדור הארץ", "ספירה (גאוספרה, הידרוספרה, אטמוספרה, ביוספרה)", "יחסי גומלין"],
  },
  {
    title: "היקום ומערכת השמש",
    terms: ["כוכב", "כוכב לכת (סלעי וגזי)", "מערכת השמש", "שנת אור", "כוח הכבידה"],
  },
  {
    title: "תנועות כדור הארץ והירח",
    terms: ["סיבוב עצמי", "הקפה", "נטיית ציר הסיבוב", "עונות השנה", "מופעי הירח", "ליקוי מאורות"],
  },
  {
    title: "חקר החלל והשפעת האדם",
    terms: ["טלסקופ, לוויין או גשושית", "פסולת חלל", "אחריות סביבתית גלובלית"],
  },
];

export const ALL_TERMS = TERM_GROUPS.flatMap((g) => g.terms);

export interface RubricCriterion {
  id: string;
  title: string;
  max: number;
  excellent: string;
  good: string;
  improve: string;
}

export const RUBRIC: RubricCriterion[] = [
  {
    id: "terms",
    title: "שימוש במונחים",
    max: 30,
    excellent: "כל המונחים מופיעים, מסומנים ומשמשים נכון בהקשר",
    good: "רוב המונחים מופיעים, חלקם רק מוזכרים",
    improve: "מונחים רבים חסרים או משמשים לא נכון",
  },
  {
    id: "accuracy",
    title: "דיוק מדעי",
    max: 25,
    excellent: "ההסברים נכונים, כולל תיקון הטעות על העונות וליקוי החמה",
    good: "רוב ההסברים נכונים, עם טעויות קטנות",
    improve: "טעויות מדעיות מרכזיות",
  },
  {
    id: "calc",
    title: "חישובים",
    max: 10,
    excellent: "זמן ההמתנה לרדיו, זמן המסע, המשקל והגיל מחושבים נכון, עם דרך חישוב",
    good: "חישוב אחד שגוי או חסרה דרך חישוב",
    improve: "רוב החישובים חסרים או שגויים",
  },
  {
    id: "research",
    title: "חיפוש עצמאי ומקורות",
    max: 10,
    excellent: "שני הנתונים החסרים ומשימת החלל נמצאו, עם 2 מקורות אמינים או יותר",
    good: "חסר נתון אחד או מקור אחד",
    improve: "אין מקורות",
  },
  {
    id: "recommendation",
    title: "המלצה ודילמה ערכית",
    max: 15,
    excellent: "עמדה ברורה, נימוקים מהנתונים, התייחסות לשני הצדדים",
    good: "עמדה ברורה עם נימוק חלקי",
    improve: "אין עמדה או שאין נימוק",
  },
  {
    id: "organization",
    title: "סדר, שפה ושיתוף פעולה",
    max: 10,
    excellent: "עבודה מסודרת, כתובה במשפטים מלאים, חלוקת עבודה מפורטת, הוגשה בזמן",
    good: "חלק מהדרישות חסרות",
    improve: "עבודה לא מסודרת או הוגשה באיחור",
  },
];

export const BONUS_MAX = 5;

export const STORY = [
  "השנה היא 2080. סוכנות החלל מחפשת מקום להקים בו את היישוב הראשון של בני אדם מחוץ לכדור הארץ.",
  "אתם צוות של חוקרים צעירים. תקבלו יעד אחד, תחקרו אותו, ובסוף תמליצו לסוכנות: האם כדאי לגור שם?",
];

export const GUIDELINES = [
  "עובדים בזוגות, כל אחד מהמחשב שלו. הכל נשמר אוטומטית.",
  "ענו במשפטים מלאים, והשתמשו במונחים שמופיעים בכל שלב. שאלות \"אתגר\" הן רשות ונותנות בונוס.",
  "בכרטיס הנתונים חסרים שני פרטים. מצאו אותם ברשת ובדקו בכפתור \"בדיקה\".",
  "בסוף כתבו 2 מקורות לפחות (למשל: אתר נאס\"א, הידען).",
];

export const ALL_QUESTIONS: Question[] = STAGES.flatMap((s) => s.sections.flatMap((sec) => sec.questions));

// Answer keys a question writes to in the team's `answers` map.
// Tables and score tables use one key per cell so Firestore never stores nested arrays.
export const cellKey = (qid: string, r: number, c: number) => `${qid}__r${r}c${c}`;
export const valueKey = (qid: string) => `${qid}__value`;
export const AGE_KEY = "s3q3__age";
export const SOURCES_KEY = "sources";
export const blankKey = (id: "blank1" | "blank2") => `${id}__value`;
export const BLANK_SOURCE_KEY = "blanks__source";

export interface MissionTeam {
  id: string;
  destinationId: DestinationId;
  memberIds: string[];
  members: { uid: string; name: string; studentClass: string }[];
  answers?: Record<string, string>;
  drawings?: Record<string, string>;
  checks?: Record<string, { correct: boolean; attempts: number; value: string }>;
  termsChecked?: string[];
  stageOwners?: Record<string, string>;
  status: "draft" | "submitted" | "graded";
  rubricScores?: Record<string, number>;
  bonus?: number;
  stageFeedback?: Record<string, string>;
  scoreTeacher?: number | null;
  feedbackTeacher?: string | null;
  createdAt?: { seconds: number } | null;
  updatedAt?: { seconds: number } | null;
  submittedAt?: { seconds: number } | null;
}

// Required answer keys for a question, used for progress and the pre-submit check.
export function requiredKeys(q: Question): string[] {
  if (q.challenge) return [];
  switch (q.kind) {
    case "table":
    case "score": {
      const cols = q.kind === "score" ? 2 : q.cols?.length ?? 0;
      const keys: string[] = [];
      (q.rows ?? []).forEach((_, r) => {
        for (let c = 0; c < cols; c++) keys.push(cellKey(q.id, r, c));
      });
      return keys;
    }
    case "check":
      return q.check === "age" ? [q.id, valueKey(q.id), AGE_KEY] : [q.id, valueKey(q.id)];
    case "drawing":
      return [];
    default:
      return [q.id];
  }
}

export const isFilled = (v: string | undefined) => Boolean(v && v.trim().length > 0);
