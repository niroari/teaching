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
}

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
    intro:
      "לפני שמחפשים בית חדש, צריך להבין מה מאפשר חיים בבית הנוכחי. בשלב הזה תשוו את כדור הארץ ליעד שלכם.",
    terms: ["מדעי כדור הארץ", "מערכת כדור הארץ", "ספירה", "גאוספרה", "הידרוספרה", "אטמוספרה", "ביוספרה", "יחסי גומלין מערכתיים"],
    sections: [
      {
        questions: [
          {
            id: "s1q1",
            kind: "text",
            prompt:
              "הסבירו במילים שלכם מהי \"מערכת כדור הארץ\". מדוע הסוכנות צריכה חוקרים מתחום מדעי כדור הארץ, ולא רק מהנדסי חלליות?",
          },
          {
            id: "s1q2",
            kind: "table",
            prompt: "מלאו את הטבלה על יסוד כרטיס הנתונים:",
            rows: ["גאוספרה", "הידרוספרה", "אטמוספרה", "ביוספרה"],
            cols: ["מה היא נותנת לחיים בכדור הארץ", "מה יש (או אין) ביעד שלנו", "מה המתיישבים יצטרכו להביא או לבנות"],
          },
          {
            id: "s1q3",
            kind: "text",
            prompt:
              "תארו שרשרת אחת של יחסי גומלין בכדור הארץ, שעוברת לפחות ב-3 ספירות. למשל: התפרצות הר געש ← אפר באוויר ← ...",
          },
          {
            id: "s1q4",
            kind: "text",
            prompt:
              "דמיינו את היעד שלכם. המתיישבים יהיו הביוספרה הראשונה שם. תארו שרשרת יחסי גומלין אחת שעלולה לקרות בין היישוב לספירות האחרות ביעד.",
          },
          {
            id: "s1q5",
            kind: "text",
            prompt: "שאלת חשיבה: איזו ספירה חסרה ביעד שלכם יותר מכל? נמקו מדוע זו הבעיה הגדולה ביותר למתיישבים.",
          },
        ],
      },
    ],
  },
  {
    id: "s2",
    short: "שלב 2",
    title: "הדרך ליעד",
    intro: "הסוכנות רוצה לדעת כמה רחוק היעד, כמה זמן ייקח המסע, ומה ירגישו המתיישבים כשינחתו.",
    terms: ["כוכב", "כוכב לכת", "כוכב לכת סלעי", "כוכב לכת גזי", "מערכת השמש", "גלקסיית שביל החלב", "שנת אור", "כוח הכבידה", "מסה"],
    sections: [
      {
        title: "א. איפה זה בכלל?",
        questions: [
          {
            id: "s2q1",
            kind: "text",
            prompt:
              "מה ההבדל בין כוכב לכוכב לכת? כתבו מי הכוכב שמאיר את היעד שלכם. אם בחרתם ירח (אירופה או טיטאן), הסבירו גם במה ירח שונה מכוכב לכת.",
          },
          {
            id: "s2q2",
            kind: "text",
            prompt: "האם היעד שלכם נמצא במערכת השמש? האם הוא נמצא בגלקסיית שביל החלב? הסבירו.",
          },
          {
            id: "s2q2d",
            kind: "drawing",
            prompt: "שרטטו תרשים פשוט של מיקום היעד ביחס לשמש ולכדור הארץ.",
          },
          {
            id: "s2q3",
            kind: "text",
            prompt:
              "האם היעד שלכם סלעי, או שהוא מקיף כוכב לכת גזי? הסבירו מדוע אי אפשר להקים יישוב על צדק או על שבתאי עצמם.",
          },
        ],
      },
      {
        title: "ב. כמה זמן לוקח להגיע?",
        questions: [
          {
            id: "s2q4",
            kind: "text",
            prompt: "הגדירו \"שנת אור\". האם זו יחידת זמן או יחידת מרחק? נמקו.",
          },
          {
            id: "s2q5",
            kind: "check",
            check: "radio",
            prompt:
              "שיחה עם הבית: מתיישב שולח מהיעד הודעת רדיו \"הגענו!\". הודעות רדיו נעות במהירות האור. כמה זמן יחכה עד שיקבל תשובה מכדור הארץ? איך זה ישפיע על שיחה עם המשפחה, או על קריאה לעזרה במקרה חירום?",
            valueLabel: "זמן ההמתנה לתשובה",
            hint: "התשובה צריכה לכלול את הדרך הלוך ושוב.",
          },
          {
            id: "s2q6",
            kind: "check",
            check: "travel",
            prompt:
              "חישוב זמן המסע: החללית של הסוכנות טסה במהירות של 60,000 ק\"מ בשעה. חשבו כמה זמן ייקח המסע ליעד שלכם, והציגו את דרך החישוב.",
            sub: [
              "זמן (בשעות) = מרחק (בק\"מ) ÷ מהירות (ק\"מ בשעה). אחר כך המירו לימים או לשנים.",
              "במערכת השמש: השתמשו במרחק הקצר ביותר מהכרטיס.",
              "מחוץ למערכת השמש: שנת אור אחת היא כ-9,500,000,000,000 ק\"מ (9.5 טריליון).",
              "האם בן אדם יכול להגיע ליעד במהלך חייו? מה המשמעות למשימה?",
            ],
            valueLabel: "זמן המסע",
          },
        ],
      },
      {
        title: "ג. מה נרגיש כשננחת?",
        questions: [
          {
            id: "s2q7",
            kind: "text",
            prompt: "הסבירו מהו כוח הכבידה, ובאילו שני גורמים הוא תלוי. מה מחזיק את היעד שלכם במסלול שלו?",
          },
          {
            id: "s2q8",
            kind: "check",
            check: "weight",
            prompt:
              "אדם שמשקלו בכדור הארץ 50 ק\"ג עומד על משקל ביעד שלכם. מה יראה המשקל? (רמז: כפלו במספר מעמודת הכבידה.) כתבו דבר טוב אחד ובעיה אחת של כבידה שונה משל כדור הארץ לגוף האדם.",
            valueLabel: "מה יראה המשקל",
          },
          {
            id: "s2q9",
            kind: "text",
            challenge: true,
            prompt:
              "אתגר: למאדים ולאירופה יש כבידה נמוכה וגם אטמוספרה דלילה מאוד. הציעו הסבר לקשר בין שני הדברים.",
          },
        ],
      },
    ],
  },
  {
    id: "s3",
    short: "שלב 3",
    title: "לחיות על היעד",
    intro: "המתיישבים יצטרכו לבנות לוח שנה חדש ושעון חדש. בשלב הזה תבדקו איך תנועות היעד משפיעות על החיים שם.",
    terms: ["סיבוב עצמי", "הקפה", "נטיית ציר הסיבוב", "יום ולילה", "עונות השנה", "מופעי הירח", "ליקוי מאורות", "גאות ושפל"],
    sections: [
      {
        title: "א. יום ולילה",
        questions: [
          {
            id: "s3q1",
            kind: "text",
            prompt:
              "איזו תנועה יוצרת יום ולילה? כמה זמן נמשך יום אחד ביעד שלכם, ומה זה אומר על שעות השינה והעבודה של המתיישבים?",
          },
          {
            id: "s3q2",
            kind: "text",
            prompt:
              "בחלק מהיעדים צד אחד תמיד פונה לכוכב (או לכוכב הלכת) שהוא מקיף. אם זה המצב ביעד שלכם, היכן הייתם מקימים את היישוב, ולמה? אם לא, הסבירו האם צריך אזורי זמן ביעד.",
          },
        ],
      },
      {
        title: "ב. שנה ועונות",
        questions: [
          {
            id: "s3q3",
            kind: "check",
            check: "age",
            prompt:
              "איזו תנועה קובעת את אורך השנה? חשבו בני כמה הייתם בשנים של היעד: הגיל שלכם × 365 ÷ אורך שנה ביעד (בימים).",
            hint: "למשל, בת 13 בכדור הארץ היא בת 13 × 365 ÷ 225, כלומר בערך 21, בשנים של נוגה.",
            valueLabel: "הגיל שלכם בשנים של היעד",
          },
          {
            id: "s3q4",
            kind: "text",
            prompt:
              "האם יש עונות ביעד שלכם? נמקו בעזרת נטיית ציר הסיבוב ואורך השנה. כמה זמן היה נמשך קיץ אחד שם?",
          },
          {
            id: "s3q5",
            kind: "text",
            prompt:
              "תקנו את חבר הצוות: אחד המהנדסים כתב בדו\"ח: \"בקיץ חם כי הכוכב קרוב לשמש, ובחורף קר כי הוא רחוק ממנה\". הסבירו מה הטעות, ומה באמת יוצר עונות.",
          },
          {
            id: "s3q5d",
            kind: "drawing",
            prompt: "שרטטו את כדור הארץ בשתי נקודות על מסלולו סביב השמש, עם נטיית הציר, וסמנו היכן קיץ בחצי הכדור הצפוני.",
          },
        ],
      },
      {
        title: "ג. השמיים מעל היישוב",
        questions: [
          {
            id: "s3q6",
            kind: "text",
            prompt:
              "תארו מה המתיישבים יראו בשמיים: האם יש ירחים? האם צדק או שבתאי נראים? האם הכוכב שלהם נראה גדול או קטן מהשמש שלנו?",
          },
          {
            id: "s3q7",
            kind: "text",
            prompt:
              "הסבירו מדוע מופעי הירח משתנים. האם גוף בשמיים של היעד שלכם יראה מופעים? (רמז: הירח לא מפיק אור משלו.)",
          },
          {
            id: "s3q8",
            kind: "text",
            prompt: "תארו איך נוצר ליקוי חמה בכדור הארץ. האם ליקוי כזה יכול לקרות ביעד שלכם? הסבירו.",
          },
          {
            id: "s3q9",
            kind: "text",
            challenge: true,
            prompt:
              "אתגר: הכבידה של הירח יוצרת גאות ושפל באוקיינוסים שלנו. צדק ושבתאי מושכים את הירחים שלהם בכוח חזק הרבה יותר. מה זה יכול לעשות לקרח ולמים שבאירופה ובטיטאן?",
          },
        ],
      },
    ],
  },
  {
    id: "s4",
    short: "שלב 4",
    title: "האחריות שלנו",
    intro:
      "פרויקט של שליחת מתיישבים משפיע גם על כדור הארץ, גם על החלל וגם על היעד. בשלב הזה תבחנו את המחיר של המשימה.",
    terms: ["חקר החלל", "לוויין", "גשושית", "טלסקופ", "פסולת חלל", "אחריות סביבתית גלובלית"],
    sections: [
      {
        questions: [
          {
            id: "s4q1",
            kind: "text",
            prompt:
              "איך אנחנו יודעים? מצאו ברשת משימת חלל אחת אמיתית שחקרה את היעד שלכם. כתבו את שמה, מתי יצאה, מה היה הכלי (טלסקופ, לוויין, גשושית או רכב נחיתה) ומה היא גילתה.",
          },
          {
            id: "s4q2",
            kind: "text",
            prompt:
              "פסולת חלל: הגדירו פסולת חלל. הפרויקט ישגר מאות טילים ולווייני תקשורת. הסבירו איזו סכנה זה יוצר סביב כדור הארץ, והציעו שני כללים שיקטינו את הסכנה.",
          },
          {
            id: "s4q3",
            kind: "text",
            prompt:
              "לשמור על היעד: אולי יש ביעד שלכם חיים זעירים, למשל חיידקים באוקיינוס. מה עלול לקרות להם כשיגיעו המתיישבים? הסבירו מה המשמעות של \"אחריות סביבתית גלובלית\" כשיוצאים מכדור הארץ.",
          },
          {
            id: "s4q4",
            kind: "long",
            prompt:
              "הדילמה: הפרויקט יעלה הרבה כסף. ארגון סביבתי טוען שעדיף להשקיע את הכסף בפתרון בעיות בכדור הארץ, כמו שינוי אקלים ועוני. כתבו פסקה של 6–8 שורות שכוללת:",
            sub: [
              "טיעון אחד בעד המשך חקר החלל. רמז: אילו טכנולוגיות שאנחנו משתמשים בהן היום (GPS, תחזית מזג אוויר) נולדו מחקר החלל?",
              "טיעון אחד נגד.",
              "העמדה של הצוות שלכם, עם נימוק.",
            ],
          },
          {
            id: "s4q5",
            kind: "text",
            prompt: "שאלת חשיבה: האם בית חדש בחלל הוא פתרון לבעיות הסביבה של כדור הארץ, או דרך לברוח מהן? נמקו.",
          },
        ],
      },
    ],
  },
  {
    id: "s5",
    short: "שלב 5",
    title: "ההמלצה לסוכנות",
    intro: "זה הרגע להחליט. על סמך כל מה שמצאתם, תנו ציון ליעד וכתבו המלצה.",
    terms: [],
    sections: [
      {
        questions: [
          {
            id: "s5q1",
            kind: "score",
            prompt:
              "תנו לכל תנאי ציון מ-1 (גרוע מאוד) עד 5 (כמו בכדור הארץ), ונמקו במשפט אחד עם מונח מהעבודה.",
            rows: [
              "מרחק וזמן מסע",
              "כבידה",
              "אטמוספרה ואוויר לנשימה",
              "מים",
              "טמפרטורה",
              "יום, לילה ועונות",
              "סכנות (קרינה, סופות ועוד)",
            ],
          },
          {
            id: "s5q2",
            kind: "long",
            prompt: "כתבו מכתב לסוכנות החלל, של 10–15 שורות. המכתב יכלול:",
            sub: [
              "המלצה ברורה: כן ליישוב, לא, או כן בתנאים.",
              "שני היתרונות הגדולים ושני הקשיים הגדולים של היעד.",
              "שלושה דברים שהמתיישבים חייבים לקחת איתם, ולמה.",
              "כלל אחד של אחריות סביבתית שכל מתיישב יתחייב אליו.",
              "שם ליישוב, והסבר קצר לשם.",
            ],
            hint: "השתמשו במכתב בלפחות 6 מונחים משלבים שונים.",
          },
        ],
      },
    ],
  },
];

export const TERM_GROUPS: { title: string; terms: string[] }[] = [
  {
    title: "שיעור פתיחה ו-4 הספירות",
    terms: ["מדעי כדור הארץ", "מערכת כדור הארץ", "ספירה (גאוספרה, הידרוספרה, אטמוספרה, ביוספרה)", "יחסי גומלין מערכתיים"],
  },
  {
    title: "היקום ומערכת השמש",
    terms: ["שנת אור", "כוכב", "כוכב לכת (סלעי וגזי)", "כוח הכבידה", "גלקסיית שביל החלב"],
  },
  {
    title: "תנועות כדור הארץ והירח",
    terms: ["סיבוב עצמי", "הקפה", "נטיית ציר הסיבוב", "עונות השנה", "מופעי הירח", "ליקוי מאורות", "גאות ושפל"],
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
    excellent: "ההסברים נכונים, כולל תיקון הטעות על העונות",
    good: "רוב ההסברים נכונים, עם טעויות קטנות",
    improve: "טעויות מדעיות מרכזיות",
  },
  {
    id: "calc",
    title: "חישובים",
    max: 10,
    excellent: "זמן מסע, משקל וגיל מחושבים נכון, עם דרך חישוב",
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
  "השנה היא 2080. סוכנות החלל הבין-לאומית פותחת את \"פרויקט תקווה\", התוכנית הראשונה להקמת יישוב קבע של בני אדם מחוץ לכדור הארץ.",
  "לפני שמשקיעים מיליארדים ושולחים אנשים למסע, הסוכנות צריכה תשובה אחת: לאן כדאי לשלוח אותם? לשם כך היא מגייסת צוותי חוקרים צעירים. אתם אחד מהצוותים האלה.",
  "כל צוות מקבל יעד אחד מתוך שישה, חוקר אותו לעומק ומגיש לסוכנות דו\"ח חקר. בסוף הדו\"ח תמליצו: האם להקים יישוב ביעד שלכם, ובאילו תנאים.",
  "כדי לכתוב דו\"ח משכנע תצטרכו להשתמש בכל מה שלמדנו ביחידת האסטרונומיה. כל מונח שלמדנו הוא כלי עבודה של חוקר אמיתי.",
];

export const GUIDELINES = [
  "עובדים בזוגות. שניכם עובדים על אותה עבודה, כל אחד מהמחשב שלו, והכל נשמר אוטומטית.",
  "ענו על כל השאלות בכל שלב, במשפטים מלאים. שאלות \"אתגר\" הן רשות ומזכות בבונוס.",
  "בכל שלב מופיעים מונחי חובה. השתמשו בהם בתשובות.",
  "בכרטיס הנתונים חסרים שני פרטים. מצאו אותם ברשת, בדקו אותם בכפתור \"בדיקה\", וכתבו את המקור.",
  "בסוף העבודה ציינו לפחות 2 מקורות (שם האתר וכתובת הקישור). מומלץ: אתר נאס\"א, הסוכנות האירופית לחלל, דובר האקדמיה או הידען.",
  "שני בני הזוג אחראים על כל העבודה. במסך ההגשה תכתבו מי הוביל את כל שלב.",
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
