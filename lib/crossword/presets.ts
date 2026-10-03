import { RawVocabularyItem } from "./types";

export interface PresetPack {
  id: string;
  name: string;
  hebrewName: string;
  icon: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  words: RawVocabularyItem[];
}

export const PRESET_PACKS: PresetPack[] = [
  {
    id: "animals",
    name: "Animal Kingdom",
    hebrewName: "עולם החיות",
    icon: "🦁",
    difficulty: "Easy",
    description: "חיות בר וחיות בית נפוצות (חתול, נמר, פיל, דולפין ועוד)",
    words: [
      { word: "TIGER", clue: "A large orange wild cat with black stripes", hebrewHint: "נמר / טיגריס" },
      { word: "MONKEY", clue: "An agile animal that loves climbing trees and bananas", hebrewHint: "קוף" },
      { word: "EAGLE", clue: "A majestic bird of prey with sharp eyesight", hebrewHint: "נשר / עיט" },
      { word: "DOLPHIN", clue: "A smart marine mammal known for jumping in waves", hebrewHint: "דולפין" },
      { word: "RABBIT", clue: "A small furry animal with long ears that hops", hebrewHint: "ארנב" },
      { word: "GIRAFFE", clue: "The tallest mammal on Earth with a very long neck", hebrewHint: "ג'ירפה" },
      { word: "PENGUIN", clue: "A flightless bird that swims gracefully in icy waters", hebrewHint: "פינגווין" },
      { word: "LION", clue: "The king of the jungle with a grand mane", hebrewHint: "אריה" },
      { word: "HORSE", clue: "A strong four-legged animal people ride", hebrewHint: "סוס" }
    ]
  },
  {
    id: "school-tech",
    name: "School & Technology",
    hebrewName: "בית ספר וטכנולוגיה",
    icon: "💻",
    difficulty: "Easy",
    description: "חפצי כיתה, למידה ומחשבים (מחשב, מחברת, מורה, מסך ועוד)",
    words: [
      { word: "LAPTOP", clue: "A portable personal computer you can carry anywhere", hebrewHint: "מחשב נייד" },
      { word: "PENCIL", clue: "A tool used for writing and drawing with graphite", hebrewHint: "עיפרון" },
      { word: "TEACHER", clue: "A person who helps students learn new things", hebrewHint: "מורה" },
      { word: "SCREEN", clue: "The flat glass surface that displays images and text", hebrewHint: "מסך" },
      { word: "LESSON", clue: "A period of learning or instruction in school", hebrewHint: "שיעור" },
      { word: "LIBRARY", clue: "A quiet place filled with thousands of books", hebrewHint: "ספרייה" },
      { word: "DESK", clue: "A piece of furniture where students sit and work", hebrewHint: "שולחן כתיבה" },
      { word: "PAPER", clue: "Thin sheets made from wood pulp used for writing", hebrewHint: "נייר" }
    ]
  },
  {
    id: "food",
    name: "Food & Flavors",
    hebrewName: "אוכל ומטעמים",
    icon: "🍕",
    difficulty: "Medium",
    description: "מאכלים, קינוחים וטעמים מוכרים (פיצה, תפוח, לחם, סלט ועוד)",
    words: [
      { word: "PIZZA", clue: "A baked Italian dough topped with cheese and tomato sauce", hebrewHint: "פיצה" },
      { word: "APPLE", clue: "A round crisp fruit that can be red, green, or yellow", hebrewHint: "תפוח" },
      { word: "CHEESE", clue: "A dairy food made from pressed milk curds", hebrewHint: "גבינה" },
      { word: "BANANA", clue: "A curved yellow fruit loved for its sweet taste", hebrewHint: "בננה" },
      { word: "BREAD", clue: "A staple baked food made from flour, water, and yeast", hebrewHint: "לחם" },
      { word: "CARROT", clue: "A crunchy orange root vegetable rich in vitamins", hebrewHint: "גזר" },
      { word: "SOUP", clue: "A warm liquid meal cooked with vegetables or meat", hebrewHint: "מרק" },
      { word: "HONEY", clue: "Sweet golden syrup produced by hardworking bees", hebrewHint: "דבש" }
    ]
  },
  {
    id: "feelings",
    name: "Feelings & Character",
    hebrewName: "רגשות ותכונות אופי",
    icon: "✨",
    difficulty: "Medium",
    description: "תיאור רגשות, מצבי רוח ותכונות חיוביות",
    words: [
      { word: "HAPPY", clue: "Feeling great joy, satisfaction, and pleasure", hebrewHint: "שמח / מאושר" },
      { word: "BRAVE", clue: "Ready to face danger or pain without showing fear", hebrewHint: "אמיץ" },
      { word: "CURIOUS", clue: "Eager to know, discover, or learn something new", hebrewHint: "סקרן" },
      { word: "PROUD", clue: "Feeling deep satisfaction in one's achievements", hebrewHint: "גאה" },
      { word: "CALM", clue: "Not showing or feeling nervousness, anger, or excitement", hebrewHint: "רגוע / שליו" },
      { word: "HONEST", clue: "Free of deceit and always telling the truth", hebrewHint: "ישר / כן" },
      { word: "TIRED", clue: "In need of sleep or physical rest", hebrewHint: "עייף" },
      { word: "CLEVER", clue: "Quick to understand, learn, and devise good ideas", hebrewHint: "חכם / פיקח" }
    ]
  },
  {
    id: "travel",
    name: "Travel & Places",
    hebrewName: "טיולים ומקומות",
    icon: "✈️",
    difficulty: "Hard",
    description: "נסיעות, שדות תעופה, נופים ותרבויות בעולם",
    words: [
      { word: "AIRPORT", clue: "A place where airplanes land and take off for travel", hebrewHint: "נמל תעופה" },
      { word: "ISLAND", clue: "A piece of land completely surrounded by water", hebrewHint: "אי" },
      { word: "CASTLE", clue: "A large fortified building where royalty lived in history", hebrewHint: "טירה / מבצר" },
      { word: "BRIDGE", clue: "A structure built over a river or valley for crossing", hebrewHint: "גשר" },
      { word: "STATION", clue: "A regular stopping place along a train or bus route", hebrewHint: "תחנה" },
      { word: "DESERT", clue: "A dry, barren area of land covered in sand dunes", hebrewHint: "מדבר" },
      { word: "HOTEL", clue: "An establishment providing paid lodging for travelers", hebrewHint: "בית מלון" },
      { word: "FOREST", clue: "A large area dominated by high trees and wildlife", hebrewHint: "יער" }
    ]
  }
];
