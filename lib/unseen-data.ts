export interface UnseenQuestion {
  id: number;
  paragraphIndex: number;
  linesHint: string;
  type: "mcq" | "open" | "copy";
  question: string;
  options?: string[]; // Only for 'mcq'
  answerIndex?: number; // Only for 'mcq'
  suggestedAnswer?: string; // Only for 'open'
  keywords?: string[]; // Only for 'open'
  targetSentence?: string; // Only for 'copy'
  explanation: string; // Explanation in Hebrew
}

export interface UnseenData {
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  paragraphs: string[];
  questions: UnseenQuestion[];
  globalQuestion: {
    question: string;
    options: string[];
    answerIndex: number;
    explanation: string; // Explanation in Hebrew
  };
  vocabularyHints: { word: string; translation: string }[];
}

export const PRE_GENERATED_UNSEENS: Record<"Easy" | "Medium" | "Hard", UnseenData> = {
  Easy: {
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
        options: [
          "Red",
          "White",
          "Black",
          "Brown"
        ],
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
        options: [
          "A green frog",
          "A yellow cat",
          "A red bird",
          "A white rabbit"
        ],
        answerIndex: 1,
        explanation: "נכון! בפסקה 1 רשום שמקס רואה חתול צהוב (yellow cat)."
      },
      {
        id: 4,
        paragraphIndex: 1,
        linesHint: "lines 8-9",
        type: "mcq",
        question: "Where does Tom put the dog food?",
        options: [
          "In a blue bowl",
          "In a yellow bag",
          "In a red bowl",
          "On the brown floor"
        ],
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
  Medium: {
    title: "The Negev Desert Tree",
    difficulty: "Medium",
    paragraphs: [
      "Clara is an explorer who likes to find old things. Last year, she traveled to the Negev desert in Israel. The desert was hot and dry, but Clara loved her job. One sunny morning, she climbed a high hill. On a big rock, she saw a very old picture of a tree. She took out her camera and took a photograph of it. Clara knew that this picture was special.",
      "The picture had a secret message written on it in a strange language. Clara spent three weeks trying to understand the message. She read many old books in the library. Finally, she found out the meaning. The message was a map that showed how to find water under a big tree in the middle of the desert. Clara packed her bag and started her journey.",
      "Clara walked to the tree for two days. The desert was quiet and she was very tired. When she arrived, she did not find gold, but she did find a special plant. Clara took some leaves to show to scientists in the city. Later, doctors used this plant to make new medicines for sick children. Clara was very happy with her discovery and wanted to return soon."
    ],
    questions: [
      {
        id: 1,
        paragraphIndex: 0,
        linesHint: "lines 1-5",
        type: "mcq",
        question: "Where did Clara find the picture of the tree?",
        options: [
          "In a school garden",
          "In a green forest",
          "In the Negev desert",
          "In a museum"
        ],
        answerIndex: 2,
        explanation: "נכון מאוד! בפסקה 1 כתוב שקלארה מצאה את התמונה במדבר הנגב (Negev desert)."
      },
      {
        id: 2,
        paragraphIndex: 0,
        linesHint: "lines 1-3",
        type: "open",
        question: "When did Clara travel to the Negev desert?",
        suggestedAnswer: "She traveled there last year.",
        keywords: ["last year", "year"],
        explanation: "נכון מאוד! בפסקה 1 כתוב שהיא נסעה בשנה שעברה (Last year)."
      },
      {
        id: 3,
        paragraphIndex: 0,
        linesHint: "lines 4-5",
        type: "copy",
        question: "Copy the sentence that shows Clara took a photo of the picture on the rock.",
        targetSentence: "She took out her camera and took a photograph of it.",
        explanation: "המשפט הנכון הוא: 'She took out her camera and took a photograph of it.' (היא הוציאה את המצלמה שלה וצילמה את זה)."
      },
      {
        id: 4,
        paragraphIndex: 1,
        linesHint: "lines 6-10",
        type: "open",
        question: "How long did it take Clara to understand the secret message?",
        suggestedAnswer: "It took her three weeks to understand it.",
        keywords: ["three weeks", "3 weeks", "weeks"],
        explanation: "התשובה המוצעת היא שלקח לה שלושה שבועות להבין את המסר (three weeks)."
      },
      {
        id: 5,
        paragraphIndex: 1,
        linesHint: "lines 7-9",
        type: "mcq",
        question: "Where did Clara read old books to understand the message?",
        options: [
          "In a small desert school",
          "In the library",
          "At her friend's house",
          "Near the desert water tree"
        ],
        answerIndex: 1,
        explanation: "נכון! בפסקה 2 מצוין שהיא קראה ספרים ישנים בספרייה (in the library)."
      },
      {
        id: 6,
        paragraphIndex: 2,
        linesHint: "lines 11-15",
        type: "copy",
        question: "Copy the sentence that tells us what Clara found instead of gold.",
        targetSentence: "When she arrived, she did not find gold, but she did find a special plant.",
        explanation: "המשפט הנכון הוא: 'When she arrived, she did not find gold, but she did find a special plant.' (כשהיא הגיעה, היא לא מצאה זהב, אלא מצאה צמח מיוחד)."
      },
      {
        id: 7,
        paragraphIndex: 2,
        linesHint: "lines 12-14",
        type: "mcq",
        question: "Who used the special plant to make new medicines?",
        options: [
          "Local desert explorers",
          "University scientists",
          "Doctors",
          "Clara's family members"
        ],
        answerIndex: 2,
        explanation: "נכון מאוד! בפסקה 3 כתוב שרופאים (doctors) השתמשו בצמח כדי להכין תרופות חדשות."
      }
    ],
    globalQuestion: {
      question: "What is this story about?",
      options: [
        "Clara's discovery in the desert",
        "How to plant trees in Israel",
        "The history of gold",
        "Clara's favorite doctors"
      ],
      answerIndex: 0,
      explanation: "כל הכבוד! הסיפור עוסק במסע של קלארה ובגילוי שלה במדבר."
    },
    vocabularyHints: [
      { word: "explorer", translation: "חוקרת / מגלה" },
      { word: "picture", translation: "תמונה / ציור" },
      { word: "message", translation: "מסר / הודעה" },
      { word: "special", translation: "מיוחד" },
      { word: "doctor", translation: "רופא" },
      { word: "medicine", translation: "תרופה" }
    ]
  },
  Hard: {
    title: "The Voice of the Whales",
    difficulty: "Hard",
    paragraphs: [
      "Whales are some of the largest creatures on Earth, but they are also famous for their incredible songs. In the deep ocean, blue whales and humpback whales sing complex melodies that can travel for hundreds of kilometers. These ocean sounds are not random noises; they are structured melodies with repeating patterns. Scientists believe that whales sing to communicate, find partners, and navigate through the dark waters. These musical compositions can last for hours, and entire pods of whales sometimes sing the exact same song together.",
      "Interestingly, each group of humpback whales has its own unique song. Over time, these songs change as the whales modify different parts of their melodies. If a humpback whale from a different region joins the group, the others might learn its song and combine it with their own. This shows that whales have a form of cultural learning, similar to how humans share music and languages. Researchers have recorded these vocal changes over decades, mapping how new songs spread across entire oceans from one population to another.",
      "Today, ocean noise from large ships makes it difficult for whales to hear each other. This noise pollution disrupts their communication and forces them to change their singing patterns. In some areas, the noise is so loud that whales must sing louder or wait until the ships pass before they can communicate. Environmental groups are now working to create quieter sea zones to protect these intelligent animals. They want governments to establish ship speed limits and build quieter boat engines to restore peace to the underwater world."
    ],
    questions: [
      {
        id: 1,
        paragraphIndex: 0,
        linesHint: "lines 1-6",
        type: "mcq",
        question: "According to paragraph 1, why do whales sing?",
        options: [
          "To scare away sharks",
          "To stay warm",
          "To communicate and find partners",
          "To play with dolphins"
        ],
        answerIndex: 2,
        explanation: "נכון מאוד! בפסקה 1 מוסבר שהלווייתנים שרים כדי לתקשר, למצוא בני זוג ולנווט (communicate, find partners, and navigate)."
      },
      {
        id: 2,
        paragraphIndex: 0,
        linesHint: "lines 2-3",
        type: "open",
        question: "According to paragraph 1, how far can the whale songs travel?",
        suggestedAnswer: "They can travel for hundreds of kilometers.",
        keywords: ["travel", "hundreds", "kilometers", "hundreds of kilometers"],
        explanation: "נכון מאוד! בפסקה 1 נאמר שהשירה שלהם יכולה לנוע לאורך מאות קילומטרים (hundreds of kilometers)."
      },
      {
        id: 3,
        paragraphIndex: 0,
        linesHint: "lines 3-4",
        type: "copy",
        question: "Copy the sentence that states that these songs are not random noises.",
        targetSentence: "These ocean sounds are not random noises; they are structured melodies with repeating patterns.",
        explanation: "המשפט הנכון הוא: 'These ocean sounds are not random noises; they are structured melodies with repeating patterns.' (קולות האוקיינוס האלה אינם רעשים אקראיים; הם מנגינות מובנות בעלות דפוסים חוזרים)."
      },
      {
        id: 4,
        paragraphIndex: 1,
        linesHint: "lines 7-12",
        type: "copy",
        question: "Copy the sentence that lists what happens when a humpback whale from another region joins the group.",
        targetSentence: "If a humpback whale from a different region joins the group, the others might learn its song and combine it with their own.",
        explanation: "המשפט הנכון הוא: 'If a humpback whale from a different region joins the group, the others might learn its song and combine it with their own.' (אם לווייתן מאזור אחר מצטרף לקבוצה, האחרים עשויים ללמוד את שירתו ולשלב אותה בשלהם)."
      },
      {
        id: 5,
        paragraphIndex: 1,
        linesHint: "lines 9-11",
        type: "mcq",
        question: "What does the whales' ability to learn songs from other regions demonstrate?",
        options: [
          "That they have poor memory",
          "That they have a form of cultural learning",
          "That they prefer swimming alone",
          "That they communicate using echo sounds"
        ],
        answerIndex: 1,
        explanation: "נכון! היכולת ללמוד שירים חדשים מלווייתנים מאזורים אחרים מראה על למידה תרבותית (cultural learning)."
      },
      {
        id: 6,
        paragraphIndex: 2,
        linesHint: "lines 13-18",
        type: "open",
        question: "According to paragraph 3, how does noise from large ships affect the whales?",
        suggestedAnswer: "It disrupts their communication and forces them to change their singing patterns.",
        keywords: ["disrupts", "communication", "hear each other", "singing patterns"],
        explanation: "התשובה המוצעת היא שהרעש מפריע לתקשורת שלהם ומאלץ אותם לשנות את דפוסי השירה (disrupts their communication)."
      },
      {
        id: 7,
        paragraphIndex: 2,
        linesHint: "lines 15-18",
        type: "mcq",
        question: "What solution do environmental groups suggest to protect the whales from ship noise?",
        options: [
          "Moving the whales to specialized research aquariums",
          "Building quieter engines and establishing ship speed limits",
          "Cleaning the plastic pollution from the ocean surface",
          "Teaching the whales to sing louder in noisy zones"
        ],
        answerIndex: 1,
        explanation: "נכון מאוד! בפסקה 3 כתוב שהם רוצים שהממשלות יקבעו מגבלות מהירות לאוניות ויבנו מנועים שקטים יותר."
      }
    ],
    globalQuestion: {
      question: "What is the main purpose of this article?",
      options: [
        "To compare humpback whales and blue whales",
        "To explain the challenges of modern shipping",
        "To discuss whale communication and the threat of ocean noise",
        "To describe the history of ocean exploration"
      ],
      answerIndex: 2,
      explanation: "כל הכבוד! המאמר עוסק בתקשורת של לווייתנים ובאופן שבו רעש אנושי מאיים עליה."
    },
    vocabularyHints: [
      { word: "creatures", translation: "יצורים" },
      { word: "navigate", translation: "לנווט" },
      { word: "unique", translation: "ייחודי" },
      { word: "cultural", translation: "תרבותי" },
      { word: "pollution", translation: "זיהום" },
      { word: "disrupts", translation: "משבש" }
    ]
  }
};
