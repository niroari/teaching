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
    title: "The Negev Desert Tree",
    difficulty: "Easy",
    paragraphs: [
      "Clara is an archaeologist who travels to the Negev desert in Israel. In 2024, she found a very old drawing on a rock. The drawing showed a tree with golden leaves.",
      "The drawing had a secret code written on it. Clara spent three weeks trying to understand the code. Finally, she discovered that the code was a map pointing to a hidden water source under an ancient acacia tree.",
      "When she reached the tree, she did not find gold, but she did find a rare plant that only grows under the ground near water. This plant can be used to make new medicines. Clara was very happy with her discovery."
    ],
    questions: [
      {
        id: 1,
        paragraphIndex: 0,
        linesHint: "lines 1-3",
        type: "mcq",
        question: "Where did Clara find the old drawing?",
        options: [
          "In a big forest",
          "In the Negev desert",
          "In a museum",
          "In her office"
        ],
        answerIndex: 1,
        explanation: "נכון מאוד! בפסקה 1 מפורט שקלארה מצאה את הציור העתיק במדבר הנגב (Negev desert)."
      },
      {
        id: 2,
        paragraphIndex: 1,
        linesHint: "lines 4-7",
        type: "copy",
        question: "Copy the sentence that tells us how long Clara tried to understand the secret code.",
        targetSentence: "Clara spent three weeks trying to understand the code.",
        explanation: "המשפט הנכון להעתקה הוא: 'Clara spent three weeks trying to understand the code.' (קלארה בילתה שלושה שבועות בניסיון להבין את הקוד)."
      },
      {
        id: 3,
        paragraphIndex: 2,
        linesHint: "lines 8-11",
        type: "open",
        question: "According to paragraph 3, what can the rare plant be used for?",
        suggestedAnswer: "It can be used to make new medicines.",
        keywords: ["medicines", "medicine", "cure", "make medicines"],
        explanation: "התשובה המוצעת היא שהצמח משמש להכנת תרופות חדשות (make new medicines)."
      }
    ],
    globalQuestion: {
      question: "What is the main idea of this story?",
      options: [
        "Clara's exciting discovery in the Negev",
        "How acacia trees grow in dry places",
        "The history of ancient maps",
        "Clara's favorite desert foods"
      ],
      answerIndex: 0,
      explanation: "כל הכבוד! הסיפור כולו עוסק במסע של קלארה ובגילוי המרתק שלה במדבר הנגב."
    },
    vocabularyHints: [
      { word: "archaeologist", translation: "ארכאולוג" },
      { word: "desert", translation: "מדבר" },
      { word: "ancient", translation: "עתיק" },
      { word: "source", translation: "מקור" },
      { word: "rare", translation: "נדיר" },
      { word: "medicine", translation: "תרופה" }
    ]
  },
  Medium: {
    title: "The Voice of the Whales",
    difficulty: "Medium",
    paragraphs: [
      "Whales are some of the largest creatures on Earth, but they are also famous for their incredible songs. In the deep ocean, blue whales and humpback whales sing complex melodies that can travel for hundreds of kilometers. Scientists believe that whales sing to communicate, find partners, and navigate through the dark waters.",
      "Interestingly, each group of humpback whales has its own unique song. Over time, these songs change. If a humpback whale from a different region joins the group, the others might learn its song. This shows that whales have a form of cultural learning, similar to how humans share music and languages.",
      "Today, ocean noise from large ships and military sonar makes it difficult for whales to hear each other. This noise pollution disrupts their communication and forces them to change their singing patterns. Environmental groups are now working to create quieter sea zones to protect these intelligent animals."
    ],
    questions: [
      {
        id: 1,
        paragraphIndex: 0,
        linesHint: "lines 1-4",
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
        paragraphIndex: 1,
        linesHint: "lines 5-8",
        type: "open",
        question: "What shows that whales have cultural learning?",
        suggestedAnswer: "They learn songs from humpback whales that come from other regions.",
        keywords: ["learn its song", "learn songs", "other regions", "different region", "joins the group"],
        explanation: "התשובה המוצעת היא שהם לומדים שירים חדשים מלווייתנים המגיעים מאזורים אחרים ומצטרפים אליהם."
      },
      {
        id: 3,
        paragraphIndex: 2,
        linesHint: "lines 9-12",
        type: "copy",
        question: "Copy the sentence that mentions what environmental groups are doing to protect whales.",
        targetSentence: "Environmental groups are now working to create quieter sea zones to protect these intelligent animals.",
        explanation: "המשפט הנכון להעתקה הוא: 'Environmental groups are now working to create quieter sea zones to protect these intelligent animals.' (ארגוני סביבה פועלים כעת ליצירת אזורים ימיים שקטים יותר כדי להגן על חיות אינטליגנטיות אלו)."
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
      explanation: "כל הכבוד! המאמר מתמקד באסטרטגיית התקשורת של הלווייתנים (השירה שלהם) ובאיומים שרעש אנושי מציב בפניהם."
    },
    vocabularyHints: [
      { word: "creatures", translation: "יצורים" },
      { word: "navigate", translation: "לנווט" },
      { word: "unique", translation: "ייחודי" },
      { word: "cultural", translation: "תרבותי" },
      { word: "pollution", translation: "זיהום" },
      { word: "disrupts", translation: "משבש" }
    ]
  },
  Hard: {
    title: "The Rise of Artificial Intelligence",
    difficulty: "Hard",
    paragraphs: [
      "Artificial Intelligence (AI) has transitioned from science fiction to an omnipresent force in modern society. Powered by massive neural networks and sophisticated machine learning algorithms, AI models now perform complex tasks like translating languages, diagnosing medical conditions, and writing software. Proponents argue that AI will unlock unprecedented human productivity and accelerate scientific discovery in areas like genomics and climate modeling.",
      "However, this rapid integration is not without challenges. Critics frequently highlight ethical dilemmas, including algorithmic bias, the spread of deepfakes, and massive labor displacement. There is a growing concern that without strict regulatory frameworks, AI could be weaponized or perpetuate societal inequalities. Finding a balance between innovation and safety has become a top priority for governments worldwide.",
      "Ultimately, the future of AI will depend on international cooperation. Ensuring that AI remains aligned with human values requires developers, researchers, and policymakers to collaborate on safety standards. If managed properly, AI could serve as a powerful tool to solve some of the world's most complex challenges; if ignored, the societal risks could be profound."
    ],
    questions: [
      {
        id: 1,
        paragraphIndex: 0,
        linesHint: "lines 1-5",
        type: "mcq",
        question: "What is one benefit of AI mentioned by its proponents in paragraph 1?",
        options: [
          "It will replace all human relationships",
          "It will unlock unprecedented human productivity",
          "It will eliminate climate change instantly",
          "It will design new neural networks automatically"
        ],
        answerIndex: 1,
        explanation: "נכון מאוד! בפסקה 1 מפורט שתומכי ה-AI טוענים שהיא תשחרר פרודוקטיביות אנושית חסרת תקדים (unlock unprecedented human productivity)."
      },
      {
        id: 2,
        paragraphIndex: 1,
        linesHint: "lines 6-9",
        type: "copy",
        question: "Copy the sentence that lists the ethical concerns critics have about AI.",
        targetSentence: "Critics frequently highlight ethical dilemmas, including algorithmic bias, the spread of deepfakes, and massive labor displacement.",
        explanation: "המשפט הנכון להעתקה הוא: 'Critics frequently highlight ethical dilemmas, including algorithmic bias, the spread of deepfakes, and massive labor displacement.' (מבקרים מדגישים לעתים קרובות דילמות מוסריות, כולל הטיה אלגוריתמית, הפצת דיפפייק, ודחיקה מסיבית של כוח עבודה)."
      },
      {
        id: 3,
        paragraphIndex: 2,
        linesHint: "lines 10-13",
        type: "open",
        question: "According to paragraph 3, what must developers and policymakers do to ensure AI remains aligned with human values?",
        suggestedAnswer: "They must collaborate on safety standards and work together internationally.",
        keywords: ["collaborate", "cooperate", "safety standards", "cooperation", "policymakers"],
        explanation: "מצוין! בפסקה 3 נאמר ששמירה על ה-AI מתואמת עם ערכי האדם דורשת שיתוף פעולה בינלאומי בסטנדרטים של בטיחות (international cooperation/collaboration on safety standards)."
      }
    ],
    globalQuestion: {
      question: "Which of the following best captures the author's overall perspective on AI?",
      options: [
        "AI is a dangerous technology that should be banned immediately",
        "AI has great potential to solve global problems but presents significant risks that require regulatory safety standards",
        "AI is already smarter than humans in every possible task",
        "The economic benefits of AI far outweigh any potential ethical concerns"
      ],
      answerIndex: 1,
      explanation: "כל הכבוד! המאמר מציג נקודת מבט מאוזנת המכירה הן בפוטנציאל הגדול של ה-AI והן בסיכונים החברתיים והצורך ברגולציה ושיתוף פעולה."
    },
    vocabularyHints: [
      { word: "omnipresent", translation: "נוכח בכל מקום" },
      { word: "proponents", translation: "תומכים" },
      { word: "unprecedented", translation: "חסר תקדים" },
      { word: "ethical", translation: "מוסרי" },
      { word: "displacement", translation: "דחיקה / החלפה" },
      { word: "regulatory", translation: "רגולטורי" },
      { word: "profound", translation: "עמוק / משמעותי" }
    ]
  }
};
