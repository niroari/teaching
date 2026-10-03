export interface GichaRoleDefinition {
  id: number;
  domain: string;
  role: string;
  description: string;
}

export const GICHA_DOMAINS = [
  "הכל",
  "הנהגה כיתתית",
  "מחנה",
  "כלכלה",
  "תרבות",
  "פרסום ותיעוד",
  "ביטחון, בטיחות ואיכות הסביבה",
  "תיק גיחה וציוד",
  "חברתי / מנהיגות צעירה",
  "סיכום ועיבוד"
] as const;

export const DOMAIN_COLORS: Record<string, { bgDark: string; borderDark: string; textDark: string; bgLight: string; borderLight: string; textLight: string; badge: string }> = {
  "הנהגה כיתתית": {
    bgDark: "bg-amber-950/30",
    borderDark: "border-amber-700/40",
    textDark: "text-amber-300",
    bgLight: "bg-amber-50",
    borderLight: "border-amber-200",
    textLight: "text-amber-800",
    badge: "bg-amber-500/10 text-amber-400 border-amber-500/30"
  },
  "מחנה": {
    bgDark: "bg-orange-950/30",
    borderDark: "border-orange-700/40",
    textDark: "text-orange-300",
    bgLight: "bg-orange-50",
    borderLight: "border-orange-200",
    textLight: "text-orange-800",
    badge: "bg-orange-500/10 text-orange-400 border-orange-500/30"
  },
  "כלכלה": {
    bgDark: "bg-emerald-950/30",
    borderDark: "border-emerald-700/40",
    textDark: "text-emerald-300",
    bgLight: "bg-emerald-50",
    borderLight: "border-emerald-200",
    textLight: "text-emerald-800",
    badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
  },
  "תרבות": {
    bgDark: "bg-purple-950/30",
    borderDark: "border-purple-700/40",
    textDark: "text-purple-300",
    bgLight: "bg-purple-50",
    borderLight: "border-purple-200",
    textLight: "text-purple-800",
    badge: "bg-purple-500/10 text-purple-400 border-purple-500/30"
  },
  "פרסום ותיעוד": {
    bgDark: "bg-sky-950/30",
    borderDark: "border-sky-700/40",
    textDark: "text-sky-300",
    bgLight: "bg-sky-50",
    borderLight: "border-sky-200",
    textLight: "text-sky-800",
    badge: "bg-sky-500/10 text-sky-400 border-sky-500/30"
  },
  "ביטחון, בטיחות ואיכות הסביבה": {
    bgDark: "bg-rose-950/30",
    borderDark: "border-rose-700/40",
    textDark: "text-rose-300",
    bgLight: "bg-rose-50",
    borderLight: "border-rose-200",
    textLight: "text-rose-800",
    badge: "bg-rose-500/10 text-rose-400 border-rose-500/30"
  },
  "תיק גיחה וציוד": {
    bgDark: "bg-blue-950/30",
    borderDark: "border-blue-700/40",
    textDark: "text-blue-300",
    bgLight: "bg-blue-50",
    borderLight: "border-blue-200",
    textLight: "text-blue-800",
    badge: "bg-blue-500/10 text-blue-400 border-blue-500/30"
  },
  "חברתי / מנהיגות צעירה": {
    bgDark: "bg-teal-950/30",
    borderDark: "border-teal-700/40",
    textDark: "text-teal-300",
    bgLight: "bg-teal-50",
    borderLight: "border-teal-200",
    textLight: "text-teal-800",
    badge: "bg-teal-500/10 text-teal-400 border-teal-500/30"
  },
  "סיכום ועיבוד": {
    bgDark: "bg-indigo-950/30",
    borderDark: "border-indigo-700/40",
    textDark: "text-indigo-300",
    bgLight: "bg-indigo-50",
    borderLight: "border-indigo-200",
    textLight: "text-indigo-800",
    badge: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30"
  }
};

export const DEFAULT_CLASSES = [
  { id: "h1", name: "כיתה ח׳1" },
  { id: "h2", name: "כיתה ח׳2" },
  { id: "h3", name: "כיתה ח׳3" },
  { id: "h4", name: "כיתה ח׳4" },
  { id: "h5", name: "כיתה ח׳5" },
  { id: "h6", name: "כיתה ח׳6" }
];

export const DEFAULT_YEARS = [
  { id: "5786", name: "תשפ״ו (2025-2026)" },
  { id: "5787", name: "תשפ״ז (2026-2027)" },
  { id: "5788", name: "תשפ״ח (2027-2028)" },
  { id: "5789", name: "תשפ״ט (2028-2029)" },
  { id: "5790", name: "תש״ץ (2029-2030)" }
];

export const GICHA_ROLES: GichaRoleDefinition[] = [
  {
    id: 1,
    domain: "הנהגה כיתתית",
    role: "רכז גיחה כיתתי",
    description: "ניהול והובלת הכיתה בכל שלבי ההכנה והביצוע של הגיחה, תיאום בין רכזי התחומים השונים והובלת הכיתה להצלחה."
  },
  {
    id: 2,
    domain: "הנהגה כיתתית",
    role: "סגן רכז גיחה כיתתי",
    description: "סיוע לרכז הסדנה בניהול הכיתה, מילוי מקומו בעת הצורך ועזרה בתיאום משימות הצוותים."
  },
  {
    id: 3,
    domain: "מחנה",
    role: "רכז תחום מחנה",
    description: "אחריות על הבנייה המחנאית, הקמת האוהלים, המחסה, תכנון מתקני המחנה ושימוש נכון בחבלים וכפיתות."
  },
  {
    id: 4,
    domain: "מחנה",
    role: "בעל תפקיד בצוות מחנה - אחראי בנייה וכפיתות",
    description: "תרגול וביצוע כפיתות, חיבורי חבלים והקמת מתקנים מחנאיים בשטח."
  },
  {
    id: 5,
    domain: "מחנה",
    role: "בעל תפקיד בצוות מחנה - אחראי אוהלים ומחסה",
    description: "תכנון והקמת אוהלים ואזורי לינה ומחסה מוגנים בשדה."
  },
  {
    id: 6,
    domain: "מחנה",
    role: "בעל תפקיד בצוות מחנה - חבר צוות מחנה",
    description: "השתתפות בביצוע עבודות ההקמה והארגון של שטח המחנה."
  },
  {
    id: 7,
    domain: "מחנה",
    role: "בעל תפקיד בצוות מחנה - חבר צוות מחנה",
    description: "סיוע בהקמת המתקנים והתארגנות המחנה."
  },
  {
    id: 8,
    domain: "מחנה",
    role: "בעל תפקיד בצוות מחנה - חבר צוות מחנה",
    description: "עזרה בבנייה ובארגון תרבות חיי השדה במתחם."
  },
  {
    id: 9,
    domain: "מחנה",
    role: "בעל תפקיד בצוות מחנה - מסייע הקמה",
    description: "סיוע כללי בהקמת מתחם המחנה והתארגנות השדה."
  },
  {
    id: 10,
    domain: "מחנה",
    role: "בעל תפקיד בצוות מחנה - אחראי ציוד מחנאי",
    description: "איסוף, ספירה ושמירה על החבלים, הסנאדות והציוד המחנאי."
  },
  {
    id: 11,
    domain: "מחנה",
    role: "בעל תפקיד בצוות מחנה - אחראי פירוק ואריזה",
    description: "אחריות על פירוק נכון ובטיחותי של המתקנים ואריזת הציוד בסיום הגיחה."
  },
  {
    id: 12,
    domain: "כלכלה",
    role: "רכז תחום כלכלה",
    description: "ניהול תחום המזון, תכנון התפריט הכיתתי, חלוקת מצרכים ואחריות על בישול וסדר הארוחות."
  },
  {
    id: 13,
    domain: "כלכלה",
    role: "בעל תפקיד בצוות כלכלה - אחראי בישול והכנת מזון",
    description: "תפעול הבישול העצמאי בשטח, הכנת הארוחות ושמירה על תזונה נאותה."
  },
  {
    id: 14,
    domain: "כלכלה",
    role: "בעל תפקיד בצוות כלכלה - אחראי ציוד בישול וחלוקה",
    description: "ארגון כלי הבישול, חלוקה שוויונית של המזון ודאגה לניקיון כלי האוכל."
  },
  {
    id: 15,
    domain: "כלכלה",
    role: "בעל תפקיד בצוות כלכלה - חבר צוות כלכלה",
    description: "סיוע בהכנת המזון, עריכת הארוחות וניקוי האזור בתום הארוחה."
  },
  {
    id: 16,
    domain: "כלכלה",
    role: "בעל תפקיד בצוות כלכלה - חבר צוות כלכלה",
    description: "סיוע שוטף למשימות הבישול והכלכלה הכיתתיות."
  },
  {
    id: 17,
    domain: "כלכלה",
    role: "בעל תפקיד בצוות כלכלה - חבר צוות כלכלה",
    description: "עזרה בהתארגנות המטבח והמזון בשדה."
  },
  {
    id: 18,
    domain: "כלכלה",
    role: "בעל תפקיד בצוות כלכלה - מסייע מטבח",
    description: "עזרה בהכנות לארוחות, חלוקת מים וארגון תחנת המזון."
  },
  {
    id: 19,
    domain: "כלכלה",
    role: "בעל תפקיד בצוות כלכלה - אחראי ניקיון מטבח",
    description: "אחריות על שטיפת הכלים, שפה והיגיינה באזור הבישול."
  },
  {
    id: 20,
    domain: "כלכלה",
    role: "בעל תפקיד בצוות כלכלה - אחראי מים ושתייה",
    description: "דאגה לאספקת מים סדירה ורענון התלמידים במהלך כל משימות הגיחה."
  },
  {
    id: 21,
    domain: "תרבות",
    role: "רכז תחום תרבות",
    description: "תכנון וניהול מורל הכיתה, הכנת טקסים, ערב תרבות ופעילויות חברתיות בגיחה."
  },
  {
    id: 22,
    domain: "תרבות",
    role: "בעל תפקיד בצוות תרבות - אחראי ערב תרבות וטקסים",
    description: "ארגון התכנים, ההפעלה והטקסים הערכיים במהלך ימי הגיחה."
  },
  {
    id: 23,
    domain: "תרבות",
    role: "בעל תפקיד בצוות תרבות - אחראי מורל והפעלה חברתית",
    description: "הובלת שירי מורל, משחקים קבוצתיים וגיבוש חברתי במהלך השהייה בשדה."
  },
  {
    id: 24,
    domain: "תרבות",
    role: "בעל תפקיד בצוות תרבות - חבר צוות תרבות",
    description: "סיוע בהכנת פעילויות התרבות והטקסים הכיתתיים."
  },
  {
    id: 25,
    domain: "תרבות",
    role: "בעל תפקיד בצוות תרבות - חבר צוות תרבות",
    description: "השתתפות בהפעלת התוכניות החברתיות של הכיתה."
  },
  {
    id: 26,
    domain: "תרבות",
    role: "בעל תפקיד בצוות תרבות - מסייע פעילויות",
    description: "עזרה בארגון עקרונות התחרות והפעלות התרבות בשטח."
  },
  {
    id: 27,
    domain: "תרבות",
    role: "בעל תפקיד בצוות תרבות - אחראי ציוד תרבות",
    description: "ריכוז האביזרים, השירונים והציוד הנדרש להפעלות ולטקסים."
  },
  {
    id: 28,
    domain: "פרסום ותיעוד",
    role: "רכז תחום פרסום ותיעוד",
    description: "ניהול עיצוב וקישוט המחנה, תיעוד הפעילות בתמונות/סרטונים והכנת שלטים ולוחות זמנים."
  },
  {
    id: 29,
    domain: "פרסום ותיעוד",
    role: "בעל תפקיד בצוות פרסום ותיעוד - אחראי קישוט ועיצוב המחנה",
    description: "עיצוב השטח הכיתתי בהתאם לנושא הגיחה, הכנת שלטי הכוונה ולוח לו\"ז."
  },
  {
    id: 30,
    domain: "פרסום ותיעוד",
    role: "בעל תפקיד בצוות פרסום ותיעוד - אחראי צילום ותיעוד",
    description: "צילום הפעילויות, תיעוד תהליך ההכנות והגיחה לטובת הסיכום והאירוע השכבתי."
  },
  {
    id: 31,
    domain: "פרסום ותיעוד",
    role: "בעל תפקיד בצוות פרסום ותיעוד - חבר צוות פרסום ותיעוד",
    description: "סיוע בהכנת חומרי הפרסום, העיצוב והתיעוד הכיתתי."
  },
  {
    id: 32,
    domain: "פרסום ותיעוד",
    role: "בעל תפקיד בצוות פרסום ותיעוד - חבר צוות פרסום ותיעוד",
    description: "סיוע בקישוט המחנה וארגון לוחות המידע."
  },
  {
    id: 33,
    domain: "פרסום ותיעוד",
    role: "בעל תפקיד בצוות פרסום ותיעוד - מסייע עיצוב",
    description: "תליית שלטים, צביעה ועיצוב אלמנטים חזותיים במחנה."
  },
  {
    id: 34,
    domain: "פרסום ותיעוד",
    role: "בעל תפקיד בצוות פרסום ותיעוד - אחראי משוב וסיכום",
    description: "איסוף דפי המשוב והתובנות מהתלמידים בסיום הגיחה לקראת שיעור הסיכום."
  },
  {
    id: 35,
    domain: "ביטחון, בטיחות ואיכות הסביבה",
    role: "אחראי ביטחון ובטיחות כיתתי",
    description: "וידוא שמירה על כללי הבטיחות וההתנהגות בשדה, שמירה על ציוד עזרה ראשונה והנחיית התלמידים למניעת מפגעים."
  },
  {
    id: 36,
    domain: "ביטחון, בטיחות ואיכות הסביבה",
    role: "נאמן איכות הסביבה ושמירת הטבע",
    description: "אחריות על ניקיון המחנה, הפרדת אשפה, שמירה על הטבע והשארת שטח נקי בתום הגיחה."
  },
  {
    id: 37,
    domain: "תיק גיחה וציוד",
    role: "אחראי תיק גיחה וציוד כיתתי",
    description: "ריכוז דפי המשימה של הצוותים, הכנת תיק הגיחה הכיתתי ווידוא הגעת כל הציוד הנדרש."
  },
  {
    id: 38,
    domain: "חברתי / מנהיגות צעירה",
    role: "נציג תלמידים / פרח מש״צים",
    description: "סיוע לצוות המש״צים, גישור בין הכיתה להנהגת השכבה וסיוע שוטף במשימות החברתיות והארגוניות."
  },
  {
    id: 39,
    domain: "סיכום ועיבוד",
    role: "נציג כיתתי למפגש/אירוע סיכום שכבתי",
    description: "ייצוג הכיתה באירוע השכבתי החווייתי והצגת תוצרי הגיחה של הכיתה."
  }
];
