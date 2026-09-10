import { UnseenData } from "../unseen-data";

export const EASY_UNSEENS: UnseenData[] = [
  // Easy 1 (Original)
  {
    title: "Max the Small Dog",
    difficulty: "Easy",
    paragraphs: [
      "Tom has a small dog. The dog is white. His name is Max. Max has long ears and a short tail. Tom likes Max very much. Max is three years old. Every day, Tom walks with Max. They walk near the big house. Max sees a yellow cat. He does not run after the cat. Max is a good dog. He stands next to Tom. Tom gives Max a small cookie. Max is happy.",
      "Max sleeps in a warm bed near the door. The bed is soft and brown. Every morning, Max runs to Tom's room. Max wakes Tom up because he wants to eat his food. Tom gets up from his bed. He walks to the kitchen. Tom puts dog food in a red bowl. Max eats his food fast. He drinks cold water from a blue bowl. Then, Max waits by the door.",
      "In the afternoon, Tom and Max play in the big garden. Max runs after a red ball. Max is very happy when he plays with Tom. There are many green trees in the garden. Tom throws the ball. Max runs and catches it. He brings the ball back to Tom. Tom says, 'Good dog, Max!' They play for one hour. Then, they go into the house to rest."
    ],
    questions: [
      {
        id: 1,
        paragraphIndex: 0,
        linesHint: "lines 1-5",
        type: "mcq",
        question: "What color is Max the dog?",
        options: ["Red", "White", "Black", "Brown"],
        answerIndex: 1,
        explanation: "נכון מאוד! בפסקה 1 כתוב שהכלב הוא לבן (white)."
      },
      {
        id: 2,
        paragraphIndex: 0,
        linesHint: "lines 3-5",
        type: "open",
        question: "How old is Max?",
        suggestedAnswer: "He is three years old.",
        keywords: ["three", "years", "old"],
        explanation: "נכון מאוד! בפסקה 1 כתוב שמקס בן 3 (three years old)."
      },
      {
        id: 3,
        paragraphIndex: 0,
        linesHint: "lines 4-5",
        type: "mcq",
        question: "What does Max see near the big house?",
        options: ["A green frog", "A yellow cat", "A red bird", "A white rabbit"],
        answerIndex: 1,
        explanation: "נכון! בפסקה 1 רשום שמקס רואה חתול צהוב (yellow cat)."
      },
      {
        id: 4,
        paragraphIndex: 1,
        linesHint: "lines 8-9",
        type: "mcq",
        question: "Where does Tom put the dog food?",
        options: ["In a blue bowl", "In a yellow bag", "In a red bowl", "On the brown floor"],
        answerIndex: 2,
        explanation: "נכון מאוד! בפסקה 2 כתוב שטום שם את האוכל בקערה אדומה (red bowl)."
      },
      {
        id: 5,
        paragraphIndex: 1,
        linesHint: "lines 6-10",
        type: "copy",
        question: "Copy the sentence that tells us where Max sleeps.",
        targetSentence: "Max sleeps in a warm bed near the door.",
        explanation: "המשפט הנכון הוא: 'Max sleeps in a warm bed near the door.' (מקס ישן במיטה חמימה ליד הדלת)."
      },
      {
        id: 6,
        paragraphIndex: 2,
        linesHint: "lines 11-15",
        type: "open",
        question: "What does Max run after in the garden?",
        suggestedAnswer: "He runs after a red ball.",
        keywords: ["ball", "red ball", "runs after"],
        explanation: "התשובה המוצעת היא שהוא רץ אחרי כדור אדום (runs after a red ball)."
      },
      {
        id: 7,
        paragraphIndex: 2,
        linesHint: "lines 13-15",
        type: "copy",
        question: "Copy the sentence that tells us how long Tom and Max play in the garden.",
        targetSentence: "They play for one hour.",
        explanation: "המשפט הנכון הוא: 'They play for one hour.' (הם משחקים במשך שעה אחת)."
      }
    ],
    globalQuestion: {
      question: "What is the main idea of this story?",
      options: [
        "Tom and his dog Max",
        "How to build a garden",
        "Why dogs sleep a lot",
        "Tom's favorite colors"
      ],
      answerIndex: 0,
      explanation: "כל הכבוד! הסיפור עוסק כולו בטום ובכלב שלו, מקס."
    },
    vocabularyHints: [
      { word: "small", translation: "קטן" },
      { word: "tail", translation: "זנב" },
      { word: "near", translation: "ליד" },
      { word: "room", translation: "חדר" },
      { word: "wake up", translation: "להתעורר" },
      { word: "run after", translation: "לרוץ אחרי" }
    ]
  },

  // Easy 2
  {
    title: "Maya's Space Robot",
    difficulty: "Easy",
    paragraphs: [
      "Maya is eight years old. She loves stars and planets. Her father is an engineer. For her birthday, he builds a small blue robot named Sparky. Sparky has two bright yellow eyes and small wheels. Maya puts Sparky on her table. Sparky says, 'Hello Maya, let's explore space!' Maya is very excited.",
      "Every afternoon, Maya and Sparky learn about space together. Sparky shows colorful pictures of Mars and the Moon on the wall. Maya writes new English words in her green notebook. Sparky plays soft space music while Maya draws a big rocket. When Maya's mother enters the room, Sparky turns his lights green and says good evening.",
      "At night, Maya looks at the sky through her bedroom window. Sparky stands on the window sill next to her. They count five bright stars together. Maya dreams of traveling to Mars in a shiny white spaceship. She smiles and goes to bed. Sparky goes to sleep on his charging dock."
    ],
    questions: [
      {
        id: 1,
        paragraphIndex: 0,
        linesHint: "lines 1-4",
        type: "mcq",
        question: "What does Maya love?",
        options: ["Cars and trains", "Stars and planets", "Cats and dogs", "Swimming in the sea"],
        answerIndex: 1,
        explanation: "נכון מאוד! בפסקה 1 כתוב שמיה אוהבת כוכבים וכוכבי לכת (stars and planets)."
      },
      {
        id: 2,
        paragraphIndex: 0,
        linesHint: "lines 3-5",
        type: "copy",
        question: "Copy the sentence that tells what Maya's father builds for her birthday.",
        targetSentence: "For her birthday, he builds a small blue robot named Sparky.",
        explanation: "המשפט הנכון הוא: 'For her birthday, he builds a small blue robot named Sparky.' (ליום הולדתה, הוא בונה רובוט כחול קטן בשם ספארקי)."
      },
      {
        id: 3,
        paragraphIndex: 0,
        linesHint: "lines 4-6",
        type: "open",
        question: "What color are Sparky's eyes?",
        suggestedAnswer: "His eyes are yellow.",
        keywords: ["yellow", "bright yellow"],
        explanation: "התשובה המוצעת היא שעיניו צהובות (yellow eyes)."
      },
      {
        id: 4,
        paragraphIndex: 1,
        linesHint: "lines 7-10",
        type: "mcq",
        question: "What does Sparky show on the wall?",
        options: ["Pictures of animals", "Pictures of Mars and the Moon", "Movies about sports", "A map of the city"],
        answerIndex: 1,
        explanation: "נכון! בפסקה 2 מצוין שספארקי מקרין תמונות של מאדים והירח על הקיר (Mars and the Moon)."
      },
      {
        id: 5,
        paragraphIndex: 1,
        linesHint: "lines 8-10",
        type: "copy",
        question: "Copy the sentence that tells what Maya writes in her notebook.",
        targetSentence: "Maya writes new English words in her green notebook.",
        explanation: "המשפט הנכון הוא: 'Maya writes new English words in her green notebook.' (מיה כותבת מילים חדשות באנגלית במחברת הירוקה שלה)."
      },
      {
        id: 6,
        paragraphIndex: 2,
        linesHint: "lines 12-15",
        type: "open",
        question: "How many bright stars do Maya and Sparky count together?",
        suggestedAnswer: "They count five bright stars.",
        keywords: ["five", "5", "five stars"],
        explanation: "נכון מאוד! בפסקה 3 כתוב שהם סופרים חמישה כוכבים זוהרים יחד (five bright stars)."
      },
      {
        id: 7,
        paragraphIndex: 2,
        linesHint: "lines 13-16",
        type: "mcq",
        question: "Where does Sparky go to sleep at night?",
        options: ["Under Maya's bed", "On the kitchen table", "On his charging dock", "In the garden"],
        answerIndex: 2,
        explanation: "נכון מאוד! בפסקה 3 כתוב שספארקי הולך לישון על תחנת הטעינה שלו (on his charging dock)."
      }
    ],
    globalQuestion: {
      question: "What is this story mostly about?",
      options: [
        "A girl and her space robot Sparky",
        "How to build a real rocket",
        "Traveling to school by bus",
        "The history of airplanes"
      ],
      answerIndex: 0,
      explanation: "מצוין! הסיפור כולו מתאר את החברות והלמידה של מיה והרובוט שלה ספארקי."
    },
    vocabularyHints: [
      { word: "planets", translation: "כוכבי לכת" },
      { word: "engineer", translation: "מהנדס" },
      { word: "wheels", translation: "גלגלים" },
      { word: "rocket", translation: "טיל / רקטה" },
      { word: "charging dock", translation: "עמדת טעינה" }
    ]
  },

  // Easy 3
  {
    title: "The Secret Treehouse",
    difficulty: "Easy",
    paragraphs: [
      "Dan and his sister Roni live near a green forest. In the middle of the forest, there is a very tall oak tree. Last summer, their grandfather helped them build a wooden treehouse high in the tree. The treehouse has a red roof and three small windows. To climb up, the children use a strong rope ladder.",
      "Inside the treehouse, Dan and Roni keep their favorite things. There is a soft rug, two wooden chairs, and a box of adventure books. Every Saturday morning, they climb up to eat fresh apples and read stories. Sometimes, a curious brown squirrel visits the treehouse. Roni gives the squirrel nuts, and it does not run away.",
      "One afternoon, it begins to rain softly. The children sit inside the warm treehouse and listen to the raindrops on the roof. They drink warm chocolate milk from a yellow bottle. Dan looks through his toy telescope and watches the forest birds. The treehouse is their favorite place in the world."
    ],
    questions: [
      {
        id: 1,
        paragraphIndex: 0,
        linesHint: "lines 1-4",
        type: "mcq",
        question: "Who helped Dan and Roni build the treehouse?",
        options: ["Their teacher", "Their grandfather", "Their neighbor", "Their brother"],
        answerIndex: 1,
        explanation: "נכון מאוד! בפסקה 1 כתוב שסבא שלהם עזר להם לבנות את בית העץ (their grandfather)."
      },
      {
        id: 2,
        paragraphIndex: 0,
        linesHint: "lines 3-5",
        type: "open",
        question: "What color is the treehouse roof?",
        suggestedAnswer: "It has a red roof.",
        keywords: ["red", "red roof"],
        explanation: "התשובה המוצעת היא שהגג אדום (red roof)."
      },
      {
        id: 3,
        paragraphIndex: 0,
        linesHint: "lines 4-6",
        type: "copy",
        question: "Copy the sentence that tells how the children climb up to the treehouse.",
        targetSentence: "To climb up, the children use a strong rope ladder.",
        explanation: "המשפט הנכון הוא: 'To climb up, the children use a strong rope ladder.' (כדי לטפס למעלה, הילדים משתמשים בסולם חבלים חזק)."
      },
      {
        id: 4,
        paragraphIndex: 1,
        linesHint: "lines 7-10",
        type: "mcq",
        question: "What animal visits the treehouse?",
        options: ["A green frog", "A brown squirrel", "A black cat", "A white rabbit"],
        answerIndex: 1,
        explanation: "נכון! בפסקה 2 מסופר שסנאי חום וסקרן מבקר בבית העץ (a curious brown squirrel)."
      },
      {
        id: 5,
        paragraphIndex: 1,
        linesHint: "lines 8-11",
        type: "open",
        question: "What does Roni give to the squirrel?",
        suggestedAnswer: "She gives it nuts.",
        keywords: ["nuts", "gives the squirrel nuts"],
        explanation: "נכון מאוד! רוני נותנת לסנאי אגוזים (nuts)."
      },
      {
        id: 6,
        paragraphIndex: 2,
        linesHint: "lines 12-15",
        type: "copy",
        question: "Copy the sentence that shows what the children drink in the treehouse.",
        targetSentence: "They drink warm chocolate milk from a yellow bottle.",
        explanation: "המשפט הנכון הוא: 'They drink warm chocolate milk from a yellow bottle.' (הם שותים שוקו חם מבקבוק צהוב)."
      },
      {
        id: 7,
        paragraphIndex: 2,
        linesHint: "lines 13-16",
        type: "mcq",
        question: "What does Dan use to watch the forest birds?",
        options: ["A camera", "A toy telescope", "A mobile phone", "A mirror"],
        answerIndex: 1,
        explanation: "נכון מאוד! בפסקה 3 כתוב שדן מביט דרך טלסקופ צעצוע (toy telescope)."
      }
    ],
    globalQuestion: {
      question: "What is this passage mostly about?",
      options: [
        "A special wooden treehouse where children play",
        "How to cut down trees in the forest",
        "Different types of birds in winter",
        "Making chocolate milk at home"
      ],
      answerIndex: 0,
      explanation: "כל הכבוד! הסיפור מתאר את בית העץ המיוחד של דן ורוני וחוויותיהם בו."
    },
    vocabularyHints: [
      { word: "forest", translation: "יער" },
      { word: "ladder", translation: "סולם" },
      { word: "squirrel", translation: "סנאי" },
      { word: "curious", translation: "סקרן" },
      { word: "telescope", translation: "טלסקופ" }
    ]
  },

  // Easy 4
  {
    title: "Leo the Little Baker",
    difficulty: "Easy",
    paragraphs: [
      "Leo is nine years old and he loves to cook. Every Friday, he wakes up early to help his grandmother in the kitchen. His grandmother is a baker who makes sweet bread and fruit cakes. Leo wears a white apron and a big chef hat. Today, they are making special chocolate cookies for the family dinner.",
      "In the kitchen, Leo mixes sugar, eggs, and brown flour in a big bowl. Then, his grandmother adds delicious chocolate chips and sweet vanilla. Leo uses his hands to roll the dough into small round balls. He places twelve balls on a baking tray. His grandmother puts the tray into the hot oven. Soon, a wonderful sweet smell fills the whole house.",
      "After twenty minutes, the cookies are ready and golden brown. Leo waits patiently for them to cool down. In the evening, his parents and brothers sit around the table. Leo proudly serves the warm cookies with cold milk. Everyone smiles and says that Leo is the best baker in the city."
    ],
    questions: [
      {
        id: 1,
        paragraphIndex: 0,
        linesHint: "lines 1-3",
        type: "mcq",
        question: "When does Leo wake up early to bake?",
        options: ["Every Monday", "Every Wednesday", "Every Friday", "Every Sunday"],
        answerIndex: 2,
        explanation: "נכון מאוד! בפסקה 1 כתוב שליאו קם מוקדם בכל יום שישי (Every Friday)."
      },
      {
        id: 2,
        paragraphIndex: 0,
        linesHint: "lines 3-5",
        type: "copy",
        question: "Copy the sentence that describes what Leo wears in the kitchen.",
        targetSentence: "Leo wears a white apron and a big chef hat.",
        explanation: "המשפט הנכון הוא: 'Leo wears a white apron and a big chef hat.' (ליאו לובש סינר לבן וכובע שף גדול)."
      },
      {
        id: 3,
        paragraphIndex: 0,
        linesHint: "lines 4-6",
        type: "open",
        question: "What are Leo and his grandmother baking today?",
        suggestedAnswer: "They are making special chocolate cookies.",
        keywords: ["chocolate cookies", "cookies", "chocolate"],
        explanation: "התשובה המוצעת היא עוגיות שוקולד מיוחדות (chocolate cookies)."
      },
      {
        id: 4,
        paragraphIndex: 1,
        linesHint: "lines 8-10",
        type: "copy",
        question: "Copy the sentence that tells how many balls of dough Leo places on the tray.",
        targetSentence: "He places twelve balls on a baking tray.",
        explanation: "המשפט הנכון הוא: 'He places twelve balls on a baking tray.' (הוא מניח שנים-עשר כדורים על תבנית אפייה)."
      },
      {
        id: 5,
        paragraphIndex: 1,
        linesHint: "lines 7-11",
        type: "mcq",
        question: "Who puts the tray into the hot oven?",
        options: ["Leo's brother", "Leo's father", "His grandmother", "Leo alone"],
        answerIndex: 2,
        explanation: "נכון! סבתא שלו מכניסה את התבנית לתנור החם (His grandmother puts the tray into the hot oven)."
      },
      {
        id: 6,
        paragraphIndex: 2,
        linesHint: "lines 12-14",
        type: "open",
        question: "How long does it take for the cookies to bake?",
        suggestedAnswer: "It takes twenty minutes.",
        keywords: ["twenty minutes", "20 minutes", "twenty"],
        explanation: "נכון מאוד! העוגיות מוכנות אחרי 20 דקות (twenty minutes)."
      },
      {
        id: 7,
        paragraphIndex: 2,
        linesHint: "lines 13-16",
        type: "mcq",
        question: "What does Leo serve with the warm cookies?",
        options: ["Hot tea", "Cold milk", "Orange juice", "Apple water"],
        answerIndex: 1,
        explanation: "נכון מאוד! בפסקה 3 כתוב שהוא מגיש את העוגיות עם חלב קר (cold milk)."
      }
    ],
    globalQuestion: {
      question: "What is this story mostly about?",
      options: [
        "A boy baking cookies with his grandmother",
        "How to buy food at the supermarket",
        "A brother who does not like chocolate",
        "Building a kitchen in the city"
      ],
      answerIndex: 0,
      explanation: "כל הכבוד! הסיפור מתאר ילד שאופה עוגיות שוקולד יחד עם סבתו."
    },
    vocabularyHints: [
      { word: "apron", translation: "סינר" },
      { word: "flour", translation: "קמח" },
      { word: "dough", translation: "בצק" },
      { word: "oven", translation: "תנור" },
      { word: "patiently", translation: "בסבלנות" }
    ]
  },

  // Easy 5
  {
    title: "A Day at Dolphin Reef",
    difficulty: "Easy",
    paragraphs: [
      "Gal and his family are on vacation in Eilat, a sunny city in the south of Israel. Today, they are visiting Dolphin Reef by the Red Sea. The sea water is clear and blue. Gal stands on the wooden floating bridge and looks into the water. Suddenly, three friendly dolphins swim near the bridge and leap high into the air.",
      "A kind guide named Dana gives Gal a life jacket. She explains that the dolphins live freely in the sea and can swim anywhere they want. Gal sits quietly on the edge of the dock and dips his feet into the cool water. A dolphin named Nana swims close and touches Gal's hand with her nose. Gal laughs with joy.",
      "In the afternoon, the visitors watch the dolphins play with a big green floating ball. Dana feeds the dolphins fresh fish from a bucket. Gal takes photos with his camera to show his classmates at school. At the end of the day, Gal buys a small dolphin souvenir in the gift shop and waves goodbye to Nana."
    ],
    questions: [
      {
        id: 1,
        paragraphIndex: 0,
        linesHint: "lines 1-3",
        type: "mcq",
        question: "Where are Gal and his family on vacation?",
        options: ["In Haifa", "In Jerusalem", "In Eilat", "In Tel Aviv"],
        answerIndex: 2,
        explanation: "נכון מאוד! בפסקה 1 כתוב שהם בחופשה באילת (in Eilat)."
      },
      {
        id: 2,
        paragraphIndex: 0,
        linesHint: "lines 2-4",
        type: "copy",
        question: "Copy the sentence that describes the sea water.",
        targetSentence: "The sea water is clear and blue.",
        explanation: "המשפט הנכון הוא: 'The sea water is clear and blue.' (מי הים צלולים וכחולים)."
      },
      {
        id: 3,
        paragraphIndex: 0,
        linesHint: "lines 3-5",
        type: "open",
        question: "How many dolphins swim near the bridge at first?",
        suggestedAnswer: "Three dolphins swim near the bridge.",
        keywords: ["three", "3", "three dolphins"],
        explanation: "נכון! בהתחלה שוחים ליד הגשר שלושה דולפינים (three friendly dolphins)."
      },
      {
        id: 4,
        paragraphIndex: 1,
        linesHint: "lines 6-9",
        type: "mcq",
        question: "What does the guide Dana give to Gal?",
        options: ["A swimming mask", "A life jacket", "A fishing rod", "A sun hat"],
        answerIndex: 1,
        explanation: "נכון! המדריכה דנה נותנת לגל חליפת הצלה (a life jacket)."
      },
      {
        id: 5,
        paragraphIndex: 1,
        linesHint: "lines 8-11",
        type: "copy",
        question: "Copy the sentence that tells what the dolphin Nana does.",
        targetSentence: "A dolphin named Nana swims close and touches Gal's hand with her nose.",
        explanation: "המשפט הנכון הוא: 'A dolphin named Nana swims close and touches Gal's hand with her nose.' (דולפינה בשם ננה שוחה קרוב ונוגעת בידו של גל עם אפה)."
      },
      {
        id: 6,
        paragraphIndex: 2,
        linesHint: "lines 12-14",
        type: "open",
        question: "What does Dana feed the dolphins?",
        suggestedAnswer: "She feeds them fresh fish.",
        keywords: ["fish", "fresh fish"],
        explanation: "התשובה המוצעת היא שהיא מאכילה אותם בדגים טריים (fresh fish)."
      },
      {
        id: 7,
        paragraphIndex: 2,
        linesHint: "lines 13-16",
        type: "mcq",
        question: "What does Gal buy before leaving?",
        options: ["A fresh fish", "A green ball", "A small dolphin souvenir", "A camera"],
        answerIndex: 2,
        explanation: "נכון מאוד! בפסקה 3 כתוב שהוא קונה מזכרת דולפין קטנה (a small dolphin souvenir)."
      }
    ],
    globalQuestion: {
      question: "What is the main topic of this text?",
      options: [
        "Gal's fun visit to Dolphin Reef in Eilat",
        "How to catch fish in the Red Sea",
        "Why children need to wear hats in the sun",
        "The best hotels in southern Israel"
      ],
      answerIndex: 0,
      explanation: "כל הכבוד! הטקסט מתאר את הביקור המרגש של גל בריף הדולפינים באילת."
    },
    vocabularyHints: [
      { word: "vacation", translation: "חופשה" },
      { word: "floating bridge", translation: "גשר צף" },
      { word: "life jacket", translation: "אפוד הצלה" },
      { word: "dock", translation: "רציף / מזח" },
      { word: "souvenir", translation: "מזכרת" }
    ]
  }
];
