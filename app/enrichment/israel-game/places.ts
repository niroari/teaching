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
  }
];
