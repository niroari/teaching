export interface Place {
  id: string;
  name: string;
  englishName: string;
  category: 'cities' | 'nature' | 'heritage' | 'regions';
  region: 'north' | 'center' | 'south' | 'jerusalem' | 'east';
  difficulty: 'easy' | 'medium' | 'hard';
  hint: string;
  coordinates: { x: number; y: number }; // Percentage from left (x) and top (y) of a bounding container
}

export const PLACES: Place[] = [
  {
    id: "jerusalem",
    name: "ירושלים",
    englishName: "Jerusalem",
    category: "cities",
    region: "jerusalem",
    difficulty: "easy",
    hint: "עיר הבירה של ישראל, שוכנת בהרי יהודה.",
    coordinates: { x: 45, y: 48 }
  },
  {
    id: "tel-aviv",
    name: "תל אביב - יפו",
    englishName: "Tel Aviv-Yafo",
    category: "cities",
    region: "center",
    difficulty: "easy",
    hint: "העיר העברית הראשונה, שוכנת לחוף הים התיכון.",
    coordinates: { x: 30, y: 40 }
  },
  {
    id: "haifa",
    name: "חיפה",
    englishName: "Haifa",
    category: "cities",
    region: "north",
    difficulty: "easy",
    hint: "עיר נמל גדולה בצפון, בנויה על הר הכרמל.",
    coordinates: { x: 32, y: 19 }
  },
  {
    id: "beer-sheva",
    name: "באר שבע",
    englishName: "Beer Sheva",
    category: "cities",
    region: "south",
    difficulty: "easy",
    hint: "בירת הנגב, עירם של אבות האומה.",
    coordinates: { x: 38, y: 62 }
  },
  {
    id: "eilat",
    name: "אילת",
    englishName: "Eilat",
    category: "cities",
    region: "south",
    difficulty: "easy",
    hint: "העיר הדרומית ביותר בישראל, לחוף הים האדום.",
    coordinates: { x: 45, y: 95 }
  },
  {
    id: "kinneret",
    name: "הכנרת",
    englishName: "Sea of Galilee",
    category: "nature",
    region: "north",
    difficulty: "easy",
    hint: "אגם המים המתוקים הלאומי שלנו בגליל התחתון.",
    coordinates: { x: 47, y: 15 }
  },
  {
    id: "dead-sea",
    name: "ים המלח",
    englishName: "Dead Sea",
    category: "nature",
    region: "east",
    difficulty: "easy",
    hint: "המקום הנמוך ביותר בעולם, מים מלוחים במיוחד.",
    coordinates: { x: 50, y: 55 }
  },
  {
    id: "hermon",
    name: "הר החרמון",
    englishName: "Mount Hermon",
    category: "nature",
    region: "north",
    difficulty: "easy",
    hint: "ההר הגבוה ביותר במדינה, 'העיניים של המדינה'.",
    coordinates: { x: 52, y: 2 }
  },
  {
    id: "ramon-crater",
    name: "מכתש רמון",
    englishName: "Ramon Crater",
    category: "nature",
    region: "south",
    difficulty: "medium",
    hint: "מכתש אירוזי ענקי ויפהפה בלב הר הנגב.",
    coordinates: { x: 40, y: 75 }
  },
  {
    id: "masada",
    name: "מצדה",
    englishName: "Masada",
    category: "heritage",
    region: "south",
    difficulty: "medium",
    hint: "מבצר עתיק על צוק מבודד במדבר יהודה, משקיף לים המלח.",
    coordinates: { x: 49, y: 58 }
  },
  {
    id: "rosh-hanikra",
    name: "ראש הנקרה",
    englishName: "Rosh HaNikra",
    category: "nature",
    region: "north",
    difficulty: "medium",
    hint: "נקרות ימיות מרהיבות בגבול הצפון-מערבי עם לבנון.",
    coordinates: { x: 33, y: 8 }
  },
  {
    id: "akko",
    name: "עכו",
    englishName: "Acre",
    category: "cities",
    region: "north",
    difficulty: "medium",
    hint: "עיר נמל עתיקה מוקפת חומות בצפון מפרץ חיפה.",
    coordinates: { x: 33, y: 15 }
  },
  {
    id: "nazareth",
    name: "נצרת",
    englishName: "Nazareth",
    category: "cities",
    region: "north",
    difficulty: "medium",
    hint: "העיר הערבית הגדולה בישראל, שוכנת בגליל התחתון.",
    coordinates: { x: 40, y: 18 }
  },
  {
    id: "tzfat",
    name: "צפת",
    englishName: "Safed",
    category: "cities",
    region: "north",
    difficulty: "medium",
    hint: "עיר המקובלים, הגבוהה ביותר בגליל העליון.",
    coordinates: { x: 43, y: 12 }
  },
  {
    id: "tiberias",
    name: "טבריה",
    englishName: "Tiberias",
    category: "cities",
    region: "north",
    difficulty: "medium",
    hint: "עיר עתיקה בגליל התחתון השוכנת ישירות לחוף הכנרת.",
    coordinates: { x: 45, y: 15 }
  },
  {
    id: "jordan-river",
    name: "נחל הירדן",
    englishName: "Jordan River",
    category: "nature",
    region: "east",
    difficulty: "easy",
    hint: "נהר הזורם מהחרמון, דרך הכנרת ועד לים המלח.",
    coordinates: { x: 48, y: 22 }
  },
  {
    id: "mount-tabor",
    name: "הר תבור",
    englishName: "Mount Tabor",
    category: "nature",
    region: "north",
    difficulty: "medium",
    hint: "הר עגול ובולט בעמק יזרעאל בגליל התחתון.",
    coordinates: { x: 42, y: 17 }
  },
  {
    id: "mount-meron",
    name: "הר מירון",
    englishName: "Mount Meron",
    category: "nature",
    region: "north",
    difficulty: "medium",
    hint: "הפסגה הגבוהה ביותר בגליל העליון, מקום קברו של רשב\"י.",
    coordinates: { x: 41, y: 11 }
  },
  {
    id: "golan-heights",
    name: "רמת הגולן",
    englishName: "Golan Heights",
    category: "regions",
    region: "north",
    difficulty: "easy",
    hint: "רמה בזלתית בצפון-מזרח המדינה, עשירה בנחלים והרי געש כבויים.",
    coordinates: { x: 51, y: 10 }
  },
  {
    id: "ein-gedi",
    name: "עין גדי",
    englishName: "Ein Gedi",
    category: "nature",
    region: "south",
    difficulty: "medium",
    hint: "נווה מדבר ירוק עם נחלים ומפלים ליד ים המלח.",
    coordinates: { x: 49, y: 56 }
  },
  {
    id: "caesarea",
    name: "קיסריה",
    englishName: "Caesarea",
    category: "heritage",
    region: "center",
    difficulty: "medium",
    hint: "עיר נמל רומית עתיקה עם תיאטרון ושרידי אקוודוקט על החוף.",
    coordinates: { x: 33, y: 26 }
  },
  {
    id: "beit-shean",
    name: "בית שאן",
    englishName: "Beit She'an",
    category: "cities",
    region: "east",
    difficulty: "medium",
    hint: "עיר עתיקה בעמק הירדן, בעלת פארק לאומי ארכיאולוגי ענק (סקיטופוליס).",
    coordinates: { x: 48, y: 25 }
  },
  {
    id: "ashdod",
    name: "אשדוד",
    englishName: "Ashdod",
    category: "cities",
    region: "center",
    difficulty: "easy",
    hint: "עיר נמל גדולה ותעשייתית בדרום מישור החוף.",
    coordinates: { x: 28, y: 46 }
  },
  {
    id: "ashkelon",
    name: "אשקלון",
    englishName: "Ashkelon",
    category: "cities",
    region: "center",
    difficulty: "medium",
    hint: "עיר חוף דרומית עתיקה, אחת מחמש ערי פלשתים.",
    coordinates: { x: 25, y: 49 }
  },
  {
    id: "netanya",
    name: "נתניה",
    englishName: "Netanya",
    category: "cities",
    region: "center",
    difficulty: "easy",
    hint: "בירת השרון, מפורסמת ברצועת חוף ארוכה ומצוקים.",
    coordinates: { x: 32, y: 32 }
  },
  {
    id: "karmiel",
    name: "כרמיאל",
    englishName: "Karmiel",
    category: "cities",
    region: "north",
    difficulty: "medium",
    hint: "עיר תעשייתית בגליל, בלב בקעת בית כרם.",
    coordinates: { x: 39, y: 13 }
  },
  {
    id: "katzrin",
    name: "קצרין",
    englishName: "Katzrin",
    category: "cities",
    region: "north",
    difficulty: "medium",
    hint: "בירת הגולן, יישוב עירוני מרכזי ברמת הגולן.",
    coordinates: { x: 50, y: 9 }
  },
  {
    id: "arad",
    name: "ערד",
    englishName: "Arad",
    category: "cities",
    region: "south",
    difficulty: "medium",
    hint: "עיר מתוכננת על גבול מדבר יהודה והנגב המזרחי, נקייה מזיהום אוויר.",
    coordinates: { x: 46, y: 60 }
  },
  {
    id: "dimona",
    name: "דימונה",
    englishName: "Dimona",
    category: "cities",
    region: "south",
    difficulty: "medium",
    hint: "עיר בנגב המרכזי, קרובה לקריה למחקר גרעיני.",
    coordinates: { x: 42, y: 64 }
  },
  {
    id: "mitze-ramon",
    name: "מצפה רמון",
    englishName: "Mitzpe Ramon",
    category: "cities",
    region: "south",
    difficulty: "medium",
    hint: "יישוב מדברי קטן השוכן על שפת מכתש רמון.",
    coordinates: { x: 40, y: 74 }
  },
  {
    id: "nachal-keziv",
    name: "נחל כזיב",
    englishName: "Kziv Stream",
    category: "nature",
    region: "north",
    difficulty: "hard",
    hint: "נחל איתן ויפהפה בגליל המערבי, מעליו מתנשא מבצר המונפור.",
    coordinates: { x: 36, y: 8 }
  },
  {
    id: "jericho",
    name: "יריחו",
    englishName: "Jericho",
    category: "cities",
    region: "east",
    difficulty: "medium",
    hint: "עיר עתיקה בבקעת הירדן, נחשבת לעיר העתיקה ביותר בעולם המיושבת ברצף.",
    coordinates: { x: 50, y: 46 }
  },
  {
    id: "sderot",
    name: "שדרות",
    englishName: "Sderot",
    category: "cities",
    region: "south",
    difficulty: "medium",
    hint: "עיר במערב הנגב הצפוני, סמוכה לרצועת עזה.",
    coordinates: { x: 27, y: 52 }
  },
  {
    id: "kiryat-shmona",
    name: "קרית שמונה",
    englishName: "Kiryat Shmona",
    category: "cities",
    region: "north",
    difficulty: "medium",
    hint: "העיר הצפונית ביותר בישראל, באזור אצבע הגליל.",
    coordinates: { x: 48, y: 6 }
  },
  {
    id: "metula",
    name: "מטולה",
    englishName: "Metula",
    category: "cities",
    region: "north",
    difficulty: "medium",
    hint: "המושבה הצפונית ביותר בישראל, מוקפת בגבול עם לבנון משלושה צדדים.",
    coordinates: { x: 49, y: 4 }
  },
  {
    id: "carmel-mountain",
    name: "הר הכרמל",
    englishName: "Mount Carmel",
    category: "nature",
    region: "north",
    difficulty: "easy",
    hint: "רכס הרים בצפון-מערב הארץ, 'ההר הירוק תמיד'.",
    coordinates: { x: 34, y: 21 }
  },
  {
    id: "gilboa-mountain",
    name: "הר גלבוע",
    englishName: "Mount Gilboa",
    category: "nature",
    region: "north",
    difficulty: "medium",
    hint: "רכס הרים מעל עמק יזרעאל ועמק בית שאן, מפורסם בפרחי האירוס.",
    coordinates: { x: 45, y: 24 }
  },
  {
    id: "jordan-valley",
    name: "בקעת הירדן",
    englishName: "Jordan Valley",
    category: "regions",
    region: "east",
    difficulty: "easy",
    hint: "בקעה ארוכה וחמה במזרח הארץ, לאורך נהר הירדן.",
    coordinates: { x: 49, y: 32 }
  },
  {
    id: "negev",
    name: "הנגב",
    englishName: "The Negev",
    category: "regions",
    region: "south",
    difficulty: "easy",
    hint: "אזור המדבר הדרומי והענק המהווה למעלה משטח המדינה.",
    coordinates: { x: 36, y: 70 }
  },
  {
    id: "arava",
    name: "הערבה",
    englishName: "Arava",
    category: "regions",
    region: "south",
    difficulty: "medium",
    hint: "עמק מדברי צר וארוך בדרום-מזרח ישראל, מים המלח ועד אילת.",
    coordinates: { x: 47, y: 78 }
  },
  {
    id: "rosh-haayin",
    name: "ראש העין",
    englishName: "Rosh Haayin",
    category: "cities",
    region: "center",
    difficulty: "medium",
    hint: "עיר במחוז המרכז, סמוכה למקורות הירקון ומבצר אנטיפטריס.",
    coordinates: { x: 36, y: 38 }
  },
  {
    id: "yavne",
    name: "יבנה",
    englishName: "Yavne",
    category: "cities",
    region: "center",
    difficulty: "medium",
    hint: "עיר בשפלה הדרומית, מקום מושבו של רבן יוחנן בן זכאי והסנהדרין לאחר החורבן.",
    coordinates: { x: 30, y: 44 }
  },
  {
    id: "judean-desert",
    name: "מדבר יהודה",
    englishName: "Judean Desert",
    category: "regions",
    region: "south",
    difficulty: "easy",
    hint: "מדבר קטן ממזרח להרי יהודה המשפיל אל ים המלח.",
    coordinates: { x: 46, y: 55 }
  },
  {
    id: "degania",
    name: "קיבוץ דגניה",
    englishName: "Kibbutz Degania",
    category: "heritage",
    region: "north",
    difficulty: "hard",
    hint: "אם הקבוצות והקיבוצים - הקיבוץ הראשון שהוקם בארץ (1910).",
    coordinates: { x: 47, y: 17 }
  },
  {
    id: "zikhron-yaakov",
    name: "זכרון יעקב",
    englishName: "Zikhron Ya'akov",
    category: "cities",
    region: "north",
    difficulty: "medium",
    hint: "מושבה ותיקה על רכס הכרמל שהוקמה על ידי חובבי ציון בתמיכת הברון רוטשילד.",
    coordinates: { x: 33, y: 24 }
  },
  {
    id: "hula-valley",
    name: "עמק החולה",
    englishName: "Hula Valley",
    category: "regions",
    region: "north",
    difficulty: "medium",
    hint: "עמק פורה בצפון הארץ, מפורסם בציפורים הנודדות ובאגם שיובש והוצף מחדש.",
    coordinates: { x: 48, y: 7 }
  },
  {
    id: "timna-park",
    name: "פארק תמנע",
    englishName: "Timna Park",
    category: "nature",
    region: "south",
    difficulty: "medium",
    hint: "אתר טבע ומורשת בערבה הדרומית, מפורסם בעמודי שלמה ומכרות הנחושת העתיקים.",
    coordinates: { x: 45, y: 90 }
  },
  {
    id: "nachal-david",
    name: "נחל דוד",
    englishName: "David Stream",
    category: "nature",
    region: "south",
    difficulty: "medium",
    hint: "נחל בשמורת עין גדי, נקרא על שם דוד המלך שהסתתר מפני שאול במצודות עין גדי.",
    coordinates: { x: 49, y: 56 }
  },
  {
    id: "nachal-darga",
    name: "נחל דרגה (דרג'ה)",
    englishName: "Darga Stream",
    category: "nature",
    region: "south",
    difficulty: "hard",
    hint: "אחד הנחלים המאתגרים והעמוקים ביותר במדבר יהודה, נשפך לים המלח.",
    coordinates: { x: 49, y: 53 }
  },
  {
    id: "galilee",
    name: "הגליל",
    englishName: "The Galilee",
    category: "regions",
    region: "north",
    difficulty: "easy",
    hint: "אזור הררי רחב ידיים בצפון הארץ, מחולק לעליון ותחתון.",
    coordinates: { x: 41, y: 13 }
  },
  {
    id: "rishon-lezion",
    name: "ראשון לציון",
    englishName: "Rishon LeZion",
    category: "cities",
    region: "center",
    difficulty: "easy",
    hint: "העיר הרביעית בגודלה בארץ, נוסדה כמושבה של העלייה הראשונה.",
    coordinates: { x: 31, y: 42 }
  },
  {
    id: "petah-tikva",
    name: "פתח תקווה",
    englishName: "Petah Tikva",
    category: "cities",
    region: "center",
    difficulty: "easy",
    hint: "אם המושבות, הוקמה ב-1878 במישור החוף.",
    coordinates: { x: 33, y: 39 }
  },
  {
    id: "rehovot",
    name: "רחובות",
    englishName: "Rehovot",
    category: "cities",
    region: "center",
    difficulty: "easy",
    hint: "עיר המדע וההדרים בשפלה, בה שוכנים מכון ויצמן והפקולטה לחקלאות.",
    coordinates: { x: 31, y: 44 }
  },
  {
    id: "hadera",
    name: "חדרה",
    englishName: "Hadera",
    category: "cities",
    region: "center",
    difficulty: "medium",
    hint: "עיר במישור החוף הצפוני, בה שוכנים תחנת הכוח אורות רבין ונחל חדרה.",
    coordinates: { x: 32, y: 28 }
  },
  {
    id: "herzliya",
    name: "הרצליה",
    englishName: "Herzliya",
    category: "cities",
    region: "center",
    difficulty: "easy",
    hint: "עיר חוף בשרון הדרומי, נקראת על שם חוזה המדינה בנימין זאב הרצל.",
    coordinates: { x: 30, y: 38 }
  },
  {
    id: "kfar-saba",
    name: "כפר סבא",
    englishName: "Kfar Saba",
    category: "cities",
    region: "center",
    difficulty: "medium",
    hint: "עיר מרכזית בשרון הדרומי, בעלת עבר חקלאי מפואר.",
    coordinates: { x: 34, y: 37 }
  },
  {
    id: "raanana",
    name: "רעננה",
    englishName: "Raanana",
    category: "cities",
    region: "center",
    difficulty: "easy",
    hint: "עיר מטופחת בלב השרון, נוסדה על ידי אמריקאים ב-1922.",
    coordinates: { x: 32, y: 37 }
  },
  {
    id: "ramat-gan",
    name: "רמת גן",
    englishName: "Ramat Gan",
    category: "cities",
    region: "center",
    difficulty: "easy",
    hint: "עיר בגוש דן הגובלת בתל אביב, בה שוכנים הספארי והבורסה ליהלומים.",
    coordinates: { x: 31, y: 40 }
  },
  {
    id: "shilo",
    name: "שילה העתיקה",
    englishName: "Ancient Shiloh",
    category: "heritage",
    region: "center",
    difficulty: "hard",
    hint: "הבירה הראשונה של בני ישראל לפני ירושלים, בה שכן המשכן 369 שנה.",
    coordinates: { x: 44, y: 36 }
  },
  {
    id: "kiryat-gat",
    name: "קרית גת",
    englishName: "Kiryat Gat",
    category: "cities",
    region: "south",
    difficulty: "medium",
    hint: "עיר בדרום השפלה, קרובה לתל לכיש ומפעל אינטל הגדול.",
    coordinates: { x: 31, y: 51 }
  },
  {
    id: "netivot",
    name: "נתיבות",
    englishName: "Netivot",
    category: "cities",
    region: "south",
    difficulty: "medium",
    hint: "עיר בנגב הצפוני-מערבי, מפורסמת בקברו של הבאבא סאלי.",
    coordinates: { x: 27, y: 55 }
  },
  {
    id: "yeruham",
    name: "ירוחם",
    englishName: "Yeruham",
    category: "cities",
    region: "south",
    difficulty: "hard",
    hint: "עיירה בנגב המרכזי, שוכנת סמוך למכתש ירוחם (הכורכר).",
    coordinates: { x: 40, y: 68 }
  },
  {
    id: "nof-hagalil",
    name: "נוף הגליל",
    englishName: "Nof HaGalil",
    category: "cities",
    region: "north",
    difficulty: "hard",
    hint: "עיר בגליל התחתון הגובלת בנצרת, נקראה בעבר נצרת עילית.",
    coordinates: { x: 41, y: 18 }
  },
  {
    id: "arbel-mountain",
    name: "הר ארבל",
    englishName: "Mount Artbel",
    category: "nature",
    region: "north",
    difficulty: "hard",
    hint: "הר עם מצוק תלול המשקיף ישירות על הכנרת והגולן.",
    coordinates: { x: 46, y: 14 }
  },
  {
    id: "gilboa",
    name: "הגלבוע",
    englishName: "The Gilboa",
    category: "regions",
    region: "north",
    difficulty: "medium",
    hint: "אזור הררי בצפון-מזרח הארץ, מקום נפילתם של שאול ובניו בקרב.",
    coordinates: { x: 45, y: 24 }
  },
  {
    id: "sorek-stream",
    name: "נחל שורק",
    englishName: "Sorek Stream",
    category: "nature",
    region: "center",
    difficulty: "hard",
    hint: "אחד הנחלים הגדולים בהרי יהודה ושפלת יהודה, עובר ליד בית שמש.",
    coordinates: { x: 33, y: 45 }
  },
  {
    id: "beit-shemesh",
    name: "בית שמש",
    englishName: "Beit Shemesh",
    category: "cities",
    region: "center",
    difficulty: "medium",
    hint: "עיר מתפתחת בשפלת יהודה, קרובה למערת הנטיפים ולתל בית שמש העתיק.",
    coordinates: { x: 35, y: 46 }
  },
  {
    id: "sharon",
    name: "השרון",
    englishName: "The Sharon",
    category: "regions",
    region: "center",
    difficulty: "easy",
    hint: "חבל ארץ במישור החוף המרכזי, בין נחל תנינים בצפון לנחל הירקון בדרום.",
    coordinates: { x: 31, y: 34 }
  },
  {
    id: "shefela",
    name: "השפלה",
    englishName: "The Shefela",
    category: "regions",
    region: "center",
    difficulty: "medium",
    hint: "אזור גבעות מעבר בין מישור החוף להרי יהודה.",
    coordinates: { x: 32, y: 47 }
  },
  {
    id: "mishmar-hacarmel",
    name: "מחצבות קדומים (כרמל)",
    englishName: "Kedumim Quarry",
    category: "heritage",
    region: "north",
    difficulty: "hard",
    hint: "שרידי מחצבות עתיקות ויערות בלב הר הכרמל, ליד בית אורן.",
    coordinates: { x: 34, y: 20 }
  },
  {
    id: "netanya",
    name: "נתניה",
    englishName: "Netanya",
    category: "cities",
    region: "center",
    difficulty: "easy",
    hint: "עיר היהלומים והחוף בלב השרון, מפורסמת בטיילת ובמצוקי הכורכר.",
    coordinates: { x: 31, y: 32 }
  },
  {
    id: "herzliya",
    name: "הרצליה",
    englishName: "Herzliya",
    category: "cities",
    region: "center",
    difficulty: "easy",
    hint: "עיר חוף בשרון הקרויה על שם חוזה המדינה, בעלת מרינה גדולה.",
    coordinates: { x: 30, y: 37 }
  },
  {
    id: "ramat-gan",
    name: "רמת גן",
    englishName: "Ramat Gan",
    category: "cities",
    region: "center",
    difficulty: "easy",
    hint: "עיר הגנים בגוש דן, שוכנים בה בורסת היהלומים והספארי הלאומי.",
    coordinates: { x: 32, y: 39 }
  },
  {
    id: "petah-tikva",
    name: "פתח תקווה",
    englishName: "Petah Tikva",
    category: "cities",
    region: "center",
    difficulty: "easy",
    hint: "'אם המושבות', הוקמה ב-1878 סמוך למקורות נחל הירקון.",
    coordinates: { x: 33, y: 38 }
  },
  {
    id: "holon",
    name: "חולון",
    englishName: "Holon",
    category: "cities",
    region: "center",
    difficulty: "easy",
    hint: "עיר הילדים והעיצוב, מדרום לתל אביב, בה נמצא מוזיאון הילדים.",
    coordinates: { x: 31, y: 41 }
  },
  {
    id: "rishon-lezion",
    name: "ראשון לציון",
    englishName: "Rishon LeZion",
    category: "cities",
    region: "center",
    difficulty: "easy",
    hint: "עיר היין, המושבה שבה הונף לראשונה דגל ישראל ונפתח בית הספר העברי הראשון.",
    coordinates: { x: 31, y: 43 }
  },
  {
    id: "rehovot",
    name: "רחובות",
    englishName: "Rehovot",
    category: "cities",
    region: "center",
    difficulty: "easy",
    hint: "עיר המדע וההדרים בשפלה, מקום מושבו של מכון ויצמן למדע.",
    coordinates: { x: 32, y: 45 }
  },
  {
    id: "nahariya",
    name: "נהריה",
    englishName: "Nahariya",
    category: "cities",
    region: "north",
    difficulty: "easy",
    hint: "עיר החוף הצפונית בישראל, שגעתון חוצה את שדרתה הראשית.",
    coordinates: { x: 33, y: 9 }
  },
  {
    id: "afula",
    name: "עפולה",
    englishName: "Afula",
    category: "cities",
    region: "north",
    difficulty: "easy",
    hint: "בירת עמק יזרעאל, צומת מרכזי המחבר בין הגליל למרכז הארץ.",
    coordinates: { x: 41, y: 22 }
  },
  {
    id: "karmiel",
    name: "כרמיאל",
    englishName: "Karmiel",
    category: "cities",
    region: "north",
    difficulty: "easy",
    hint: "עיר בבקעת בית הכרם בצפון, מפורסמת בפסטיבל המחולות השנתי.",
    coordinates: { x: 39, y: 14 }
  },
  {
    id: "kiryat-shmona",
    name: "קריית שמונה",
    englishName: "Kiryat Shmona",
    category: "cities",
    region: "north",
    difficulty: "easy",
    hint: "העיר הצפונית ביותר בארץ, בעמק החולה למרגלות רכס רמים.",
    coordinates: { x: 47, y: 5 }
  },
  {
    id: "katzrin",
    name: "קצרין",
    englishName: "Katzrin",
    category: "cities",
    region: "north",
    difficulty: "medium",
    hint: "בירת רמת הגולן, שוכנת במרכז הרמה סמוך לכפר התלמודי העתיק.",
    coordinates: { x: 50, y: 12 }
  },
  {
    id: "dimona",
    name: "דימונה",
    englishName: "Dimona",
    category: "cities",
    region: "south",
    difficulty: "easy",
    hint: "עיר בנגב המזרחי, שער לים המלח ולמכתשים.",
    coordinates: { x: 45, y: 65 }
  },
  {
    id: "sderot",
    name: "שדרות",
    englishName: "Sderot",
    category: "cities",
    region: "south",
    difficulty: "easy",
    hint: "עיר בעוטף עזה ובצפון-מערב הנגב, סמל לעמידה וחוסן ישראלי.",
    coordinates: { x: 26, y: 54 }
  },
  {
    id: "netivot",
    name: "נתיבות",
    englishName: "Netivot",
    category: "cities",
    region: "south",
    difficulty: "medium",
    hint: "עיר במערב הנגב, מוקד עלייה לרגל לציון הבאבא סאלי.",
    coordinates: { x: 27, y: 57 }
  },
  {
    id: "ofakim",
    name: "אופקים",
    englishName: "Ofakim",
    category: "cities",
    region: "south",
    difficulty: "medium",
    hint: "עיר במערב הנגב הצפוני, ממערב לבאר שבע ליד נחל הבשור.",
    coordinates: { x: 31, y: 60 }
  },
  {
    id: "kiryat-gat",
    name: "קריית גת",
    englishName: "Kiryat Gat",
    category: "cities",
    region: "south",
    difficulty: "easy",
    hint: "בירת חבל לכיש, שוכנת במישור השפלה הדרומית מול הרי חברון.",
    coordinates: { x: 31, y: 50 }
  },
  {
    id: "lod",
    name: "לוד",
    englishName: "Lod",
    category: "cities",
    region: "center",
    difficulty: "easy",
    hint: "עיר עתיקה במישור השפלה, צומת רכבות מרכזי הסמוך לנתב\"ג.",
    coordinates: { x: 34, y: 42 }
  },
  {
    id: "ramla",
    name: "רמלה",
    englishName: "Ramla",
    category: "cities",
    region: "center",
    difficulty: "easy",
    hint: "בירת מחוז המרכז, עיר עתיקה שבה בריכת הקשתות המפורסמת והמגדל הלבן.",
    coordinates: { x: 33, y: 43 }
  },
  {
    id: "modiin",
    name: "מודיעין",
    englishName: "Modi'in",
    category: "cities",
    region: "center",
    difficulty: "easy",
    hint: "עיר המכבים המתוכננת, במיקום מרכזי בין ירושלים לתל אביב.",
    coordinates: { x: 37, y: 43 }
  },
  {
    id: "zikhron-yaakov",
    name: "זכרון יעקב",
    englishName: "Zikhron Ya'akov",
    category: "cities",
    region: "north",
    difficulty: "medium",
    hint: "מושבה היסטורית על חוטם הכרמל, מפורסמת ביקבי כרמל ובחצר הברון.",
    coordinates: { x: 33, y: 24 }
  },
  {
    id: "rosh-pinna",
    name: "ראש פינה",
    englishName: "Rosh Pinna",
    category: "cities",
    region: "north",
    difficulty: "medium",
    hint: "מראשונות מושבות העלייה הראשונה, במורדות הר כנען בגליל העליון.",
    coordinates: { x: 45, y: 11 }
  },
  {
    id: "metula",
    name: "מטולה",
    englishName: "Metula",
    category: "cities",
    region: "north",
    difficulty: "medium",
    hint: "המושבה הצפונית ביותר בישראל, מוקפת משלושת עבריה בגבול לבנון.",
    coordinates: { x: 47, y: 4 }
  },
  {
    id: "yeruham",
    name: "ירוחם",
    englishName: "Yeruham",
    category: "cities",
    region: "south",
    difficulty: "medium",
    hint: "עיירה בהר הנגב הצפוני, שוכנת בסמוך לאגם ירוחם ולמכתש הגדול.",
    coordinates: { x: 42, y: 68 }
  },
  {
    id: "arad",
    name: "ערד",
    englishName: "Arad",
    category: "cities",
    region: "south",
    difficulty: "medium",
    hint: "עיר במזרח הנגב על גבול מדבר יהודה, צופה ממעל על ים המלח.",
    coordinates: { x: 47, y: 61 }
  },
  {
    id: "maalot-tarshiha",
    name: "מעלות תרשיחא",
    englishName: "Ma'alot-Tarshiha",
    category: "cities",
    region: "north",
    difficulty: "medium",
    hint: "עיר בגליל המערבי, שוכנת סמוך לאגם מונפורט ולמבצר מונפור.",
    coordinates: { x: 37, y: 10 }
  },
  {
    id: "ariel",
    name: "אריאל",
    englishName: "Ariel",
    category: "cities",
    region: "center",
    difficulty: "medium",
    hint: "העיר המרכזית בשומרון, ביתה של אוניברסיטת אריאל.",
    coordinates: { x: 41, y: 37 }
  },
  {
    id: "sde-boker",
    name: "שדה בוקר",
    englishName: "Sde Boker",
    category: "cities",
    region: "south",
    difficulty: "hard",
    hint: "קיבוץ בהר הנגב שבו שכן צריפו של דוד בן-גוריון, מעל מצוק נחל צין.",
    coordinates: { x: 39, y: 71 }
  },
  {
    id: "paran",
    name: "פארן",
    englishName: "Paran",
    category: "cities",
    region: "south",
    difficulty: "hard",
    hint: "מושב חקלאי שיתופי בלב הערבה התיכונה, שוכן ליד נחל פארן הרחב.",
    coordinates: { x: 44, y: 84 }
  },
  {
    id: "ein-yahav",
    name: "עין יהב",
    englishName: "Ein Yahav",
    category: "cities",
    region: "south",
    difficulty: "hard",
    hint: "הוותיק שביישובי הערבה התיכונה, מוביל עולמי בחקלאות מדברית ופלפלים.",
    coordinates: { x: 46, y: 75 }
  },
  {
    id: "hatzeva",
    name: "חצבה",
    englishName: "Hatzeva",
    category: "cities",
    region: "south",
    difficulty: "hard",
    hint: "מושב בערבה הצפונית סמוך לתחנת הניסיונות 'יאיר' ועץ השיזף העתיק בארץ.",
    coordinates: { x: 47, y: 71 }
  },
  {
    id: "neot-semadar",
    name: "נאות סמדר",
    englishName: "Neot Semadar",
    category: "cities",
    region: "south",
    difficulty: "hard",
    hint: "קיבוץ שיתופי אקולוגי בערבה הדרומית, בולט במגדל הצינון האמנותי.",
    coordinates: { x: 42, y: 88 }
  },
  {
    id: "degania-alef",
    name: "דגניה א'",
    englishName: "Degania Alef",
    category: "cities",
    region: "north",
    difficulty: "hard",
    hint: "'אם הקבוצות והקיבוצים', נוסדה בשנת 1910 במוצא הירדן מהכנרת.",
    coordinates: { x: 47, y: 17 }
  },
  {
    id: "kfar-blum",
    name: "כפר בלום",
    englishName: "Kfar Blum",
    category: "cities",
    region: "north",
    difficulty: "hard",
    hint: "קיבוץ בעמק החולה לחוף נהר הירדן, מפורסם בשיט קיאקים ומוזיקה קלאסית.",
    coordinates: { x: 47, y: 7 }
  },
  {
    id: "yarkon-river",
    name: "נחל הירקון",
    englishName: "Yarkon River",
    category: "nature",
    region: "center",
    difficulty: "easy",
    hint: "הנחל הגדול במרכז ישראל, זורם ממקורות אפק בראש העין ועד לשפך בתל אביב.",
    coordinates: { x: 32, y: 39 }
  },
  {
    id: "agamon-hula",
    name: "אגמון החולה",
    englishName: "Agamon Hula",
    category: "nature",
    region: "north",
    difficulty: "easy",
    hint: "אגם מלאכותי בעמק החולה, תחנת חניה קריטית למאות אלפי ציפורים ועגורים נודדים.",
    coordinates: { x: 46, y: 8 }
  },
  {
    id: "ein-bokek",
    name: "עין בוקק",
    englishName: "Ein Bokek",
    category: "nature",
    region: "south",
    difficulty: "easy",
    hint: "אזור המלונות והמעיינות לחוף האגן הדרומי של ים המלח.",
    coordinates: { x: 49, y: 60 }
  },
  {
    id: "eilat-gulf",
    name: "מפרץ אילת",
    englishName: "Gulf of Eilat",
    category: "nature",
    region: "south",
    difficulty: "easy",
    hint: "הזרוע הצפונית של הים האדום, עשירה בשוניות אלמוגים ודגים טרופיים ייחודיים.",
    coordinates: { x: 45, y: 96 }
  },
  {
    id: "alexander-stream",
    name: "נחל אלכסנדר",
    englishName: "Alexander Stream",
    category: "nature",
    region: "center",
    difficulty: "medium",
    hint: "נחל שרוני הנשפך לים התיכון, מפורסם ב'גשר הצבים' ובאוכלוסיית הצבים הרכים.",
    coordinates: { x: 32, y: 31 }
  },
  {
    id: "makhtesh-gadol",
    name: "המכתש הגדול",
    englishName: "The Large Crater",
    category: "nature",
    region: "south",
    difficulty: "medium",
    hint: "מכתש אירוזי עמוק ברכס חתירה בנגב הצפוני, ידוע בחולות הצבעוניים שלו.",
    coordinates: { x: 43, y: 68 }
  },
  {
    id: "makhtesh-katan",
    name: "המכתש הקטן",
    englishName: "The Small Crater",
    category: "nature",
    region: "south",
    difficulty: "medium",
    hint: "מכתש עגול ומושלם גיאולוגית ברכס חצרה, הצופה אל הערבה הצפונית.",
    coordinates: { x: 47, y: 67 }
  },
  {
    id: "sahne",
    name: "הסחנה (גן השלושה)",
    englishName: "Gan HaShlosha (Sahne)",
    category: "nature",
    region: "north",
    difficulty: "medium",
    hint: "פארק מעיינות ובריכות מים חמימים כל ימות השנה, בעמק המעיינות למרגלות הגלבוע.",
    coordinates: { x: 46, y: 24 }
  },
  {
    id: "kziv-stream",
    name: "נחל כזיב",
    englishName: "Kziv Stream",
    category: "nature",
    region: "north",
    difficulty: "medium",
    hint: "הנחל הגדול והשופע בגליל המערבי, זורם למרגלות מבצר מונפור ועין טמיר.",
    coordinates: { x: 36, y: 9 }
  },
  {
    id: "snir-stream",
    name: "נחל שניר (חצבני)",
    englishName: "Snir Stream (Hatzbani)",
    category: "nature",
    region: "north",
    difficulty: "medium",
    hint: "הארוך ביובלי הירדן, מימיו זורמים מלבנון לאורך עמק החולה.",
    coordinates: { x: 48, y: 4 }
  },
  {
    id: "dan-stream",
    name: "נחל דן",
    englishName: "Dan Stream",
    category: "nature",
    region: "north",
    difficulty: "medium",
    hint: "השופע ביובלי הירדן, מימיו הקרים נובעים ממעיין הדן למרגלות החרמון.",
    coordinates: { x: 49, y: 4 }
  },
  {
    id: "banias-stream",
    name: "נחל חרמון (בניאס)",
    englishName: "Banias Stream",
    category: "nature",
    region: "north",
    difficulty: "medium",
    hint: "יובל שוצף של הירדן, מפורסם במפל הגדול ובשביל התלוי במדרון הגולן.",
    coordinates: { x: 50, y: 5 }
  },
  {
    id: "avshalom-cave",
    name: "מערת הנטיפים (שורק)",
    englishName: "Avshalom Stalactite Cave",
    category: "nature",
    region: "center",
    difficulty: "medium",
    hint: "מערת נטיפים מרהיבה בצפיפותה במורדות הרי יהודה סמוך לבית שמש.",
    coordinates: { x: 35, y: 46 }
  },
  {
    id: "ein-avdat",
    name: "עין עבדת",
    englishName: "Ein Avdat",
    category: "nature",
    region: "south",
    difficulty: "hard",
    hint: "קניון עמוק בנחל צין, עם מעיין שופע ומפל גבוה בלב המדבר.",
    coordinates: { x: 39, y: 72 }
  },
  {
    id: "red-canyon",
    name: "הקניון האדום",
    englishName: "Red Canyon",
    category: "nature",
    region: "south",
    difficulty: "hard",
    hint: "נקיק צר ומרשים מאבן חול נובית אדומה בנחל שני בהרי אילת.",
    coordinates: { x: 43, y: 91 }
  },
  {
    id: "solomon-pillars",
    name: "עמודי שלמה (בקעת תמנע)",
    englishName: "Solomon's Pillars (Timna)",
    category: "nature",
    region: "south",
    difficulty: "hard",
    hint: "עמודי אבן חול מונומנטליים שנוצרו בסחף טבעי בבקעת תמנע בערבה.",
    coordinates: { x: 44, y: 91 }
  },
  {
    id: "darga-stream",
    name: "נחל דרגה (דרג'ה)",
    englishName: "Darga Stream",
    category: "nature",
    region: "east",
    difficulty: "hard",
    hint: "קניון מדברי עמוק ומאתגר היורד ממדבר יהודה לים המלח, עשיר בגבים עמוקים.",
    coordinates: { x: 49, y: 53 }
  },
  {
    id: "mount-bental",
    name: "הר בנטל",
    englishName: "Mount Bental",
    category: "nature",
    region: "north",
    difficulty: "hard",
    hint: "הר געש כבוי בצפון הגולן, משקיף על עמק קוניטרה וגבול סוריה.",
    coordinates: { x: 52, y: 8 }
  },
  {
    id: "birket-ram",
    name: "ברכת רם",
    englishName: "Birket Ram",
    category: "nature",
    region: "north",
    difficulty: "hard",
    hint: "אגם טבעי בתוך לוע געשי (מאאר) בצפון הגולן למרגלות החרמון.",
    coordinates: { x: 52, y: 5 }
  },
  {
    id: "mount-sodom",
    name: "הר סדום",
    englishName: "Mount Sodom",
    category: "nature",
    region: "south",
    difficulty: "hard",
    hint: "רכס ייחודי הבנוי ברובו ממלח בישול, מתרומם מעל חופי ים המלח הדרומי.",
    coordinates: { x: 49, y: 63 }
  },
  {
    id: "tel-dan",
    name: "תל דן",
    englishName: "Tel Dan",
    category: "heritage",
    region: "north",
    difficulty: "medium",
    hint: "עיר מקראית קדומה בצפון הארץ, שבה נתגלתה כתובת 'בית דוד' המפורסמת.",
    coordinates: { x: 49, y: 4 }
  },
  {
    id: "tel-megiddo",
    name: "תל מגידו",
    englishName: "Tel Megiddo",
    category: "heritage",
    region: "north",
    difficulty: "medium",
    hint: "עיר מבוצרת אסטרטגית בעמק יזרעאל, אתר מורשת עולמי הידוע גם כ'ארמגדון'.",
    coordinates: { x: 38, y: 22 }
  },
  {
    id: "tel-hazor",
    name: "תל חצור",
    englishName: "Tel Hazor",
    category: "heritage",
    region: "north",
    difficulty: "medium",
    hint: "הגדולה והחשובה בערי כנען בצפון הארץ, 'ראש כל הממלכות האלה'.",
    coordinates: { x: 46, y: 10 }
  },
  {
    id: "ammunition-hill",
    name: "גבעת התחמושת",
    englishName: "Ammunition Hill",
    category: "heritage",
    region: "jerusalem",
    difficulty: "medium",
    hint: "מוצב ירדני מבוצר שהיה למוקד קרב מכריע לשחרור ירושלים בתשכ\"ז.",
    coordinates: { x: 45, y: 48 }
  },
  {
    id: "tower-of-david",
    name: "מגדל דוד",
    englishName: "Tower of David",
    category: "heritage",
    region: "jerusalem",
    difficulty: "easy",
    hint: "המצודה ההיסטורית של ירושלים ליד שער יפו, סמל היסטורי מרכזי של העיר.",
    coordinates: { x: 45, y: 48 }
  },
  {
    id: "qumran",
    name: "קומראן",
    englishName: "Qumran",
    category: "heritage",
    region: "east",
    difficulty: "medium",
    hint: "אתר ארכיאולוגי במדבר יהודה לחוף ים המלח, בו התגלו מגילות קומראן הגנוזות.",
    coordinates: { x: 50, y: 51 }
  },
  {
    id: "nimrod-fortress",
    name: "מבצר נמרוד",
    englishName: "Nimrod Fortress",
    category: "heritage",
    region: "north",
    difficulty: "hard",
    hint: "המבצר הימי-ביניימי הגדול בארץ, חולש על עמק החולה משיפולי החרמון.",
    coordinates: { x: 51, y: 4 }
  },
  {
    id: "montfort",
    name: "מבצר מונפור",
    englishName: "Montfort Castle",
    category: "heritage",
    region: "north",
    difficulty: "hard",
    hint: "מבצר צלבני טבטוני מבודד הנישא על מצוק מעל נחל כזיב בגליל המערבי.",
    coordinates: { x: 36, y: 9 }
  },
  {
    id: "belvoir",
    name: "כוכב הירדן (בלוואר)",
    englishName: "Belvoir Castle",
    category: "heritage",
    region: "east",
    difficulty: "hard",
    hint: "מבצר הוספיטלרי מושלם הניצב על רמה בזלתית וצופה מגבוה על בקעת הירדן.",
    coordinates: { x: 48, y: 21 }
  },
  {
    id: "gamla",
    name: "גמלא",
    englishName: "Gamla",
    category: "heritage",
    region: "north",
    difficulty: "hard",
    hint: "עיר עתיקה על שלוחה דמוית דבשת גמל בגולן, מכונה 'מצדה של הצפון'.",
    coordinates: { x: 51, y: 14 }
  },
  {
    id: "herodion",
    name: "הרודיון",
    englishName: "Herodion",
    category: "heritage",
    region: "jerusalem",
    difficulty: "hard",
    hint: "מבצר וארמון דמוי הר געש שבנה המלך הורדוס בספר מדבר יהודה, מקום קברו.",
    coordinates: { x: 46, y: 50 }
  },
  {
    id: "avdat",
    name: "עבדת",
    englishName: "Avdat",
    category: "heritage",
    region: "south",
    difficulty: "hard",
    hint: "עיר נבטית וביזנטית מרכזית על דרך הבשמים, נישאת על שלוחה בהר הנגב.",
    coordinates: { x: 40, y: 73 }
  },
  {
    id: "shivta",
    name: "שבטה",
    englishName: "Shivta",
    category: "heritage",
    region: "south",
    difficulty: "hard",
    hint: "עיר ביזנטית שמורה להפליא בנגב המערבי, עם כנסיות ומערכות איסוף מים קדומות.",
    coordinates: { x: 33, y: 69 }
  },
  {
    id: "mamshit",
    name: "ממשית",
    englishName: "Mamshit",
    category: "heritage",
    region: "south",
    difficulty: "hard",
    hint: "עיר נבטית בנגב הצפוני סמוך לדימונה, המצטיינת באדריכלות אבן מרשימה וסכרים.",
    coordinates: { x: 46, y: 65 }
  },
  {
    id: "tel-hai",
    name: "חצר תל חי",
    englishName: "Tel Hai",
    category: "heritage",
    region: "north",
    difficulty: "medium",
    hint: "חצר היסטורית באצבע הגליל, אתר קרב תל חי ופסל האריה השואג לזכר טרומפלדור.",
    coordinates: { x: 47, y: 5 }
  },
  {
    id: "shaar-hagai",
    name: "שער הגיא (באב אל-ואד)",
    englishName: "Sha'ar HaGai",
    category: "heritage",
    region: "jerusalem",
    difficulty: "medium",
    hint: "הערוץ הצר בדרך לירושלים, בו פרצו שיירות המשוריינים את המצור במלחמת העצמאות.",
    coordinates: { x: 40, y: 47 }
  },
  {
    id: "tel-lachish",
    name: "תל לכיש",
    englishName: "Tel Lachish",
    category: "heritage",
    region: "south",
    difficulty: "hard",
    hint: "השנייה בחשיבותה בערי ממלכת יהודה, אתר כיבוש אשורי מפורסם בשפלת יהודה.",
    coordinates: { x: 34, y: 51 }
  },
  {
    id: "apollonia",
    name: "אפולוניה (תל ארשף)",
    englishName: "Apollonia",
    category: "heritage",
    region: "center",
    difficulty: "medium",
    hint: "עיר נמל עתיקה ומבצר צלבני הנישאים על מצוק כורכר לחוף הים בהרצליה.",
    coordinates: { x: 30, y: 36 }
  },
  {
    id: "hula-valley",
    name: "עמק החולה",
    englishName: "Hula Valley",
    category: "regions",
    region: "north",
    difficulty: "easy",
    hint: "עמק פורה ועשיר במים בצפון השבר הסורי-אפריקאי, בין הרי נפתלי לגולן.",
    coordinates: { x: 47, y: 7 }
  },
  {
    id: "the-negev",
    name: "הנגב",
    englishName: "The Negev",
    category: "regions",
    region: "south",
    difficulty: "easy",
    hint: "חבל הארץ המדברי הגדול המהווה כמחצית משטח מדינת ישראל.",
    coordinates: { x: 38, y: 70 }
  },
  {
    id: "judean-desert",
    name: "מדבר יהודה",
    englishName: "Judean Desert",
    category: "regions",
    region: "east",
    difficulty: "easy",
    hint: "מדבר צל גשם תלול היורד מהרי יהודה אל חופי ים המלח, רווי קניונים ונאות מדבר.",
    coordinates: { x: 48, y: 53 }
  },
  {
    id: "jerusalem-mountains",
    name: "הרי ירושלים",
    englishName: "Jerusalem Mountains",
    category: "regions",
    region: "jerusalem",
    difficulty: "easy",
    hint: "רכס ההרים הגבוה במרכז הארץ שבו שוכנת בירת הנצח של ישראל.",
    coordinates: { x: 44, y: 48 }
  },
  {
    id: "coastal-plain",
    name: "מישור החוף",
    englishName: "Coastal Plain",
    category: "regions",
    region: "center",
    difficulty: "easy",
    hint: "רצועת שפלת החוף המערבית של ישראל לאורך חוף הים התיכון.",
    coordinates: { x: 30, y: 38 }
  },
  {
    id: "jordan-valley-region",
    name: "בקעת הירדן",
    englishName: "Jordan Valley",
    category: "regions",
    region: "east",
    difficulty: "medium",
    hint: "הבקע המזרחי לאורך נהר הירדן, מהכנרת בצפון ועד לצפון ים המלח.",
    coordinates: { x: 49, y: 35 }
  },
  {
    id: "beit-shean-valley",
    name: "עמק בית שאן",
    englishName: "Beit She'an Valley",
    category: "regions",
    region: "east",
    difficulty: "medium",
    hint: "עמק חם ושופע מעיינות טבעיים בחיבור בין בקעת הירדן לעמק יזרעאל.",
    coordinates: { x: 48, y: 25 }
  },
  {
    id: "hefer-valley",
    name: "עמק חפר",
    englishName: "Hefer Valley",
    category: "regions",
    region: "center",
    difficulty: "medium",
    hint: "עמק חקלאי וירוק בלב השרון הצפוני, סביב אגן נחל אלכסנדר.",
    coordinates: { x: 32, y: 30 }
  },
  {
    id: "eilat-mountains",
    name: "הרי אילת",
    englishName: "Eilat Mountains",
    category: "regions",
    region: "south",
    difficulty: "medium",
    hint: "רכס הרי מדבר מרהיבים מאבן חול וגרניט צבעוניים בקצה הדרומי של ישראל.",
    coordinates: { x: 44, y: 93 }
  },
  {
    id: "naftali-mountains",
    name: "הרי נפתלי",
    englishName: "Naftali Mountains",
    category: "regions",
    region: "north",
    difficulty: "hard",
    hint: "רכס הרים תלול וגבוה המתרומם מערבית לעמק החולה לאורך גבול לבנון.",
    coordinates: { x: 46, y: 6 }
  }
];
