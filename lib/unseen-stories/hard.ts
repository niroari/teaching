import { UnseenData } from "../unseen-data";

export const HARD_UNSEENS: UnseenData[] = [
  // Hard 1 (Original)
  {
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
  },

  // Hard 2
  {
    title: "The Secrets of the Deep Coral Reefs",
    difficulty: "Hard",
    paragraphs: [
      "Coral reefs are often called the underwater rainforests of our planet because they support more than twenty-five percent of all marine species, despite occupying less than one percent of the ocean floor. These fragile marine ecosystems are formed by tiny organisms called coral polyps, which extract calcium carbonate from seawater to construct intricate limestone skeletons over thousands of years. From microscopic sea anemones to majestic sea turtles, countless marine creatures rely on these colorful structures for food, shelter, and breeding grounds.",
      "In recent decades, rising seawater temperatures caused by global climate change have triggered widespread coral bleaching events worldwide. When water temperatures remain excessively high for extended periods, corals expel the microscopic algae living within their tissues, which provide them with essential nutrients and vibrant pigmentation. Without these vital algae, corals turn completely white, become vulnerable to lethal diseases, and eventually starve to death. Biologists warn that the destruction of coral reefs could devastate coastal fishing industries and eliminate natural storm barriers that protect shores from catastrophic erosion.",
      "To combat this global environmental catastrophe, marine scientists are deploying cutting-edge biological technologies. In specialized marine laboratories, researchers are successfully breeding 'super corals'—strains genetically adapted to withstand higher thermal thresholds and increased ocean acidification. Simultaneously, autonomous underwater drones are planting these resilient coral fragments onto damaged natural reefs in the Caribbean and Australia. Although these scientific breakthroughs offer genuine hope, experts stress that long-term preservation ultimately depends on aggressive worldwide reductions in carbon emissions."
    ],
    questions: [
      {
        id: 1,
        paragraphIndex: 0,
        linesHint: "lines 1-4",
        type: "copy",
        question: "Copy the sentence that explains why coral reefs are called the underwater rainforests of our planet.",
        targetSentence: "Coral reefs are often called the underwater rainforests of our planet because they support more than twenty-five percent of all marine species, despite occupying less than one percent of the ocean floor.",
        explanation: "המשפט הנכון הוא: 'Coral reefs are often called the underwater rainforests of our planet because they support more than twenty-five percent of all marine species, despite occupying less than one percent of the ocean floor.' (שוניות אלמוגים מכונות לעתים קרובות יערות הגשם התת-ימיים כי הן תומכות ביותר מ-25% מכלל המינים הימיים)."
      },
      {
        id: 2,
        paragraphIndex: 0,
        linesHint: "lines 2-5",
        type: "open",
        question: "What mineral do coral polyps extract from seawater to build their skeletons?",
        suggestedAnswer: "They extract calcium carbonate.",
        keywords: ["calcium carbonate", "carbonate", "calcium"],
        explanation: "נכון מאוד! הפוליפים מפיקים סידן פחמתי (calcium carbonate) ממי הים."
      },
      {
        id: 3,
        paragraphIndex: 1,
        linesHint: "lines 6-9",
        type: "mcq",
        question: "According to paragraph 2, what causes corals to expel their microscopic algae?",
        options: [
          "Attacks by predatory sharks",
          "Rising seawater temperatures caused by climate change",
          "Excessive salt in deep waters",
          "A lack of ocean waves"
        ],
        answerIndex: 1,
        explanation: "נכון מאוד! בפסקה 2 מוסבר שטמפרטורות מים גבוהות הנגרמות עקב שינויי אקלים מובילות לתופעה זו."
      },
      {
        id: 4,
        paragraphIndex: 1,
        linesHint: "lines 8-11",
        type: "copy",
        question: "Copy the sentence describing what happens to corals when they lose their algae.",
        targetSentence: "Without these vital algae, corals turn completely white, become vulnerable to lethal diseases, and eventually starve to death.",
        explanation: "המשפט הנכון הוא: 'Without these vital algae, corals turn completely white, become vulnerable to lethal diseases, and eventually starve to death.' (ללא האצות החיוניות האלה, האלמוגים מלבינים לחלוטין, הופכים פגיעים למחלות קטלניות ובסופו של דבר גוועים ברעב)."
      },
      {
        id: 5,
        paragraphIndex: 1,
        linesHint: "lines 10-14",
        type: "open",
        question: "Name one severe consequence of reef destruction mentioned at the end of paragraph 2.",
        suggestedAnswer: "It could devastate coastal fishing industries or eliminate natural storm barriers.",
        keywords: ["fishing industries", "fishing", "storm barriers", "erosion", "shores"],
        explanation: "התשובה המוצעת היא פגיעה קשה בענף הדיג החופי או אובדן מחסומי סערה טבעיים המגנים על החופים."
      },
      {
        id: 6,
        paragraphIndex: 2,
        linesHint: "lines 15-18",
        type: "mcq",
        question: "What are 'super corals' developed in laboratories?",
        options: [
          "Corals that produce electric light",
          "Strains adapted to withstand higher temperatures and acidification",
          "Artificial plastic corals designed for aquariums",
          "Corals that can live outside of water"
        ],
        answerIndex: 1,
        explanation: "נכון! 'סופר אלמוגים' הם זנים המותאמים לעמוד בטמפרטורות גבוהות יותר ובחומציות אוקיינוס מוגברת."
      },
      {
        id: 7,
        paragraphIndex: 2,
        linesHint: "lines 18-22",
        type: "open",
        question: "What do experts emphasize is ultimately required for the long-term survival of coral reefs?",
        suggestedAnswer: "Aggressive worldwide reductions in carbon emissions.",
        keywords: ["carbon emissions", "reductions", "carbon", "emissions"],
        explanation: "נכון מאוד! בפסקה 3 מודגש שהשימור לטווח ארוך תלוי בהפחתה עולמית אגרסיבית של פליטות פחמן."
      }
    ],
    globalQuestion: {
      question: "What is the primary theme of this passage?",
      options: [
        "The critical ecological importance of coral reefs, their existential threats, and restoration efforts",
        "The history of recreational scuba diving in the Caribbean",
        "How microscopic sea turtles hunt for food in deep trenches",
        "A comparison of freshwater lakes and tropical oceans"
      ],
      answerIndex: 0,
      explanation: "כל הכבוד! הטקסט מפרט על חשיבות השוניות, האיומים החמורים עליהן והטכנולוגיות המפותחות לשיקומן."
    },
    vocabularyHints: [
      { word: "ecosystems", translation: "מערכות אקולוגיות" },
      { word: "intricate", translation: "מורכב / סבוך" },
      { word: "bleaching", translation: "הלבנה (של אלמוגים)" },
      { word: "pigmentation", translation: "פיגמנטציה / צבעוניות" },
      { word: "resilient", translation: "עמיד / בעל כושר התאוששות" }
    ]
  },

  // Hard 3
  {
    title: "The Rediscovery of the Rosetta Stone",
    difficulty: "Hard",
    paragraphs: [
      "For more than a thousand years, the mysterious hieroglyphic inscriptions covering the monumental tombs and temples of ancient Egypt remained completely unreadable to historians. The ancient writing system had vanished around the fourth century CE, taking centuries of pharaonic history, religious literature, and scientific knowledge with it into silence. Scholars across Europe attempted to decipher the elaborate animal and geometric symbols, but without a bilingual reference key, their translations were little more than speculative guesswork and romantic mythology.",
      "Everything changed in July 1799 during Napoleon Bonaparte's military expedition to Egypt. While rebuilding an old Ottoman fortification near the port town of Rashid—known to Europeans as Rosetta—French soldiers unearthed a massive slab of black granodiorite covered with dense carved text. The artifact, later known as the Rosetta Stone, featured an official decree issued in 196 BCE by King Ptolemy V. Crucially, the decree was inscribed in three distinct scripts: ancient Egyptian hieroglyphs for sacred texts, Demotic script for everyday administrative affairs, and ancient Greek, which scholars could easily read and comprehend.",
      "The presence of identical content in three different scripts provided the linguistic bridge scholars desperately needed. In 1822, brilliant French linguist Jean-François Champollion made the crucial breakthrough by realizing that hieroglyphic signs were not purely symbolic pictures, but rather phonetic symbols representing spoken sounds and syllables. By comparing the Greek name 'Ptolemy' with the royal cartouche on the stone, Champollion cracked the ancient code. His monumental achievement unlocked thousands of years of recorded Egyptian civilization, revolutionizing the modern field of Egyptology forever."
    ],
    questions: [
      {
        id: 1,
        paragraphIndex: 0,
        linesHint: "lines 1-4",
        type: "copy",
        question: "Copy the sentence that states when the ancient Egyptian writing system disappeared.",
        targetSentence: "The ancient writing system had vanished around the fourth century CE, taking centuries of pharaonic history, religious literature, and scientific knowledge with it into silence.",
        explanation: "המשפט הנכון הוא: 'The ancient writing system had vanished around the fourth century CE, taking centuries of pharaonic history, religious literature, and scientific knowledge with it into silence.' (שיטת הכתב העתיקה נעלמה בסביבות המאה הרביעית לספירה)."
      },
      {
        id: 2,
        paragraphIndex: 0,
        linesHint: "lines 3-6",
        type: "open",
        question: "Why were early European attempts to translate hieroglyphs unsuccessful?",
        suggestedAnswer: "Because they lacked a bilingual reference key and relied on speculative guesswork.",
        keywords: ["reference key", "bilingual", "guesswork", "key"],
        explanation: "התשובה היא שלא היה בידם מפתח השוואתי דו-לשוני והם הסתמכו על ניחושים ספקולטיביים."
      },
      {
        id: 3,
        paragraphIndex: 1,
        linesHint: "lines 7-10",
        type: "mcq",
        question: "When and where was the Rosetta Stone unearthed?",
        options: [
          "In 1922 in King Tutankhamun's tomb",
          "In July 1799 near the port town of Rashid (Rosetta)",
          "In 1805 in the city of Alexandria",
          "In 1822 in the Louvre Museum in Paris"
        ],
        answerIndex: 1,
        explanation: "נכון מאוד! בפסקה 2 כתוב שהאבן נחשפה ביולי 1799 ליד העיירה ראשיד/רוזטה."
      },
      {
        id: 4,
        paragraphIndex: 1,
        linesHint: "lines 10-14",
        type: "open",
        question: "Which of the three scripts on the Rosetta Stone could scholars already read fluently?",
        suggestedAnswer: "Ancient Greek.",
        keywords: ["Greek", "ancient Greek"],
        explanation: "נכון מאוד! החוקרים ידעו לקרוא ולהבין יוונית עתיקה (ancient Greek)."
      },
      {
        id: 5,
        paragraphIndex: 2,
        linesHint: "lines 15-18",
        type: "mcq",
        question: "What fundamental insight did Jean-François Champollion have in 1822?",
        options: [
          "That hieroglyphs were only used as mathematical numbers",
          "That hieroglyphs functioned as phonetic symbols representing sounds and syllables",
          "That the text was a magical recipe for embalming mummies",
          "That ancient Egyptians copied Greek letters"
        ],
        answerIndex: 1,
        explanation: "נכון! שמפוליון הבין שכתב החרטומים אינו ציורים סמליים בלבד, אלא סימנים פונטיים המייצגים צלילים והברות."
      },
      {
        id: 6,
        paragraphIndex: 2,
        linesHint: "lines 17-20",
        type: "copy",
        question: "Copy the sentence describing how Champollion cracked the ancient code using a Greek royal name.",
        targetSentence: "By comparing the Greek name 'Ptolemy' with the royal cartouche on the stone, Champollion cracked the ancient code.",
        explanation: "המשפט הנכון הוא: 'By comparing the Greek name 'Ptolemy' with the royal cartouche on the stone, Champollion cracked the ancient code.' (באמצעות השוואת השם היווני 'תלמי' עם הכרטוש המלכותי שעל האבן, פיצח שמפוליון את הצופן העתיק)."
      },
      {
        id: 7,
        paragraphIndex: 2,
        linesHint: "lines 19-22",
        type: "open",
        question: "What major academic field was revolutionized by the decipherment of the stone?",
        suggestedAnswer: "The modern field of Egyptology.",
        keywords: ["Egyptology", "modern Egyptology"],
        explanation: "נכון מאוד! ההישג חולל מהפכה בתחום האגיפטולוגיה המודרנית (Egyptology)."
      }
    ],
    globalQuestion: {
      question: "What is the overarching subject of this historical article?",
      options: [
        "How the discovery and linguistic analysis of the Rosetta Stone unlocked ancient Egyptian history",
        "The military campaigns and victories of Napoleon Bonaparte in the Middle East",
        "The religious ceremonies of King Ptolemy V in ancient Alexandria",
        "How modern stone carvers replicate ancient museum artifacts"
      ],
      answerIndex: 0,
      explanation: "כל הכבוד! המאמר עוסק בגילוי אבן רוזטה ופיצוחה הלשוני שפתח צוהר להיסטוריה של מצרים העתיקה."
    },
    vocabularyHints: [
      { word: "inscriptions", translation: "כתובות חקוקות" },
      { word: "decipher", translation: "לפענח" },
      { word: "decree", translation: "צו / פקודה מלכותית" },
      { word: "phonetic", translation: "פונטי (של צלילי דיבור)" },
      { word: "cartouche", translation: "כרטוש (טבעת עם שם מלך)" }
    ]
  },

  // Hard 4
  {
    title: "The Revolution of Bionic Prosthetics",
    difficulty: "Hard",
    paragraphs: [
      "Throughout human history, artificial limbs were essentially passive mechanical tools, ranging from ancient wooden pegs to heavy metal hooks that offered minimal functional mobility. While these rudimentary devices helped individuals maintain balance or perform basic physical tasks, they lacked any connection to the human nervous system and could not convey sensory feedback. Consequently, amputees frequently felt disconnected from their artificial limbs, struggling with awkward coordination and severe physical exhaustion during routine daily activities.",
      "In recent years, remarkable convergences between neural engineering, microelectronics, and artificial intelligence have dramatically transformed the landscape of prosthetic medicine. Modern bionic limbs utilize sophisticated myoelectric sensors implanted directly into residual muscle fibers to detect minute electrical impulses sent by the user's brain. Powerful microprocessors then decode these neural signals in real time, translating human thoughts into fluid, natural finger movements within milliseconds. Users can now grasp delicate objects like raw eggs or type smoothly on computer keyboards with astonishing dexterity.",
      "The most revolutionary breakthrough in modern bionic research is targeted sensory reinnervation, which restores the fundamental sensation of physical touch. By embedding microscopic pressure sensors into synthetic fingertips and routing feedback signals back to remaining sensory nerves, scientists allow amputees to perceive surface textures, temperature variations, and pressure levels with their eyes closed. As neuro-prosthetic technology continues to advance rapidly, the distinction between biological human anatomy and artificial robotic augmentation is becoming increasingly indistinguishable, promising unprecedented quality of life for millions worldwide."
    ],
    questions: [
      {
        id: 1,
        paragraphIndex: 0,
        linesHint: "lines 1-4",
        type: "copy",
        question: "Copy the sentence describing how artificial limbs were historically constructed.",
        targetSentence: "Throughout human history, artificial limbs were essentially passive mechanical tools, ranging from ancient wooden pegs to heavy metal hooks that offered minimal functional mobility.",
        explanation: "המשפט הנכון הוא: 'Throughout human history, artificial limbs were essentially passive mechanical tools, ranging from ancient wooden pegs to heavy metal hooks that offered minimal functional mobility.' (לאורך ההיסטוריה, איברים מלאכותיים היו כלים מכניים פסיביים מיתדות עץ ועד ווי מתכת)."
      },
      {
        id: 2,
        paragraphIndex: 0,
        linesHint: "lines 3-6",
        type: "open",
        question: "What critical connection did early prosthetic devices completely lack?",
        suggestedAnswer: "They lacked any connection to the human nervous system.",
        keywords: ["nervous system", "connection", "sensory feedback"],
        explanation: "נכון מאוד! הם חסרו כל חיבור למערכת העצבים האנושית (human nervous system)."
      },
      {
        id: 3,
        paragraphIndex: 1,
        linesHint: "lines 8-11",
        type: "mcq",
        question: "What do modern myoelectric sensors detect?",
        options: [
          "External sound vibrations",
          "Minute electrical impulses sent by the user's brain to muscles",
          "Changes in room temperature",
          "Sunlight reflection on the prosthetic surface"
        ],
        answerIndex: 1,
        explanation: "נכון! החיישנים מזהים אותות חשמליים זעירים הנשלחים ממוח המשתמש לשרירים הנותרים."
      },
      {
        id: 4,
        paragraphIndex: 1,
        linesHint: "lines 10-14",
        type: "open",
        question: "Name one delicate action users can now perform with modern bionic hands.",
        suggestedAnswer: "Grasp delicate objects like raw eggs or type on keyboards.",
        keywords: ["raw eggs", "eggs", "type", "keyboard", "keyboards"],
        explanation: "התשובה המוצעת היא אחיזת חפצים עדינים כמו ביצים לא מבושלות או הקלדה חלקה על מקלדת."
      },
      {
        id: 5,
        paragraphIndex: 2,
        linesHint: "lines 15-18",
        type: "copy",
        question: "Copy the sentence that identifies the most revolutionary breakthrough in modern bionic research.",
        targetSentence: "The most revolutionary breakthrough in modern bionic research is targeted sensory reinnervation, which restores the fundamental sensation of physical touch.",
        explanation: "המשפט הנכון הוא: 'The most revolutionary breakthrough in modern bionic research is targeted sensory reinnervation, which restores the fundamental sensation of physical touch.' (פריצת הדרך המהפכנית ביותר במחקר ביוני מודרני היא חידוש תחושתי ממוקד, המשחזר את תחושת המגע הפיזי הבסיסית)."
      },
      {
        id: 6,
        paragraphIndex: 2,
        linesHint: "lines 17-20",
        type: "mcq",
        question: "What can amputees perceive even with their eyes closed thanks to sensory feedback?",
        options: [
          "Colors of nearby walls",
          "Surface textures, temperature variations, and pressure levels",
          "Radio signals emitted by cellphones",
          "The chemical composition of metal objects"
        ],
        answerIndex: 1,
        explanation: "נכון מאוד! הם יכולים לחוש במרקמי משטח, שינויי טמפרטורה ועוצמות לחץ בעיניים עצומות."
      },
      {
        id: 7,
        paragraphIndex: 2,
        linesHint: "lines 19-23",
        type: "open",
        question: "According to the final sentence, what two domains are becoming increasingly indistinguishable?",
        suggestedAnswer: "Biological human anatomy and artificial robotic augmentation.",
        keywords: ["anatomy", "biological", "robotic", "augmentation"],
        explanation: "נכון! הגבול בין אנטומיה אנושית ביולוגית לבין שדרוג רובוטי מלאכותי הופך למטושטש וכמעט בלתי ניתן להבדלה."
      }
    ],
    globalQuestion: {
      question: "What is the central focus of this scientific text?",
      options: [
        "The evolution of bionic prosthetics from passive tools to brain-controlled, sensory-restoring limbs",
        "The historical use of wooden crutches in ancient civil wars",
        "How microprocessors are manufactured in industrial chip factories",
        "The reasons why athletes choose not to use robotic assistance"
      ],
      answerIndex: 0,
      explanation: "כל הכבוד! המאמר מציג את המהפכה המדעית באיברים הביוניים – מכלים פסיביים לאיברים מתקדמים הנשלטים על ידי המוח ובעלי חוש מגע."
    },
    vocabularyHints: [
      { word: "prosthetic", translation: "תותב / איבר מלאכותי" },
      { word: "rudimentary", translation: "בסיסי ביותר / פרימיטיבי" },
      { word: "dexterity", translation: "מיומנות ידנית / זריזות כפיים" },
      { word: "reinnervation", translation: "חידוש עצבי" },
      { word: "augmentation", translation: "שדרוג / תגבור" }
    ]
  },

  // Hard 5
  {
    title: "Autonomous Exploration of Mars",
    difficulty: "Hard",
    paragraphs: [
      "Exploring the harsh, frozen surface of Mars represents one of humanity's most ambitious scientific endeavors. Located tens of millions of kilometers away from Earth, the Red Planet possesses an atmosphere composed primarily of carbon dioxide with less than one percent of Earth's atmospheric pressure. The extreme distance creates a communication delay of up to twenty minutes each way for radio transmissions. Because instantaneous remote control from NASA mission headquarters is physically impossible, Martian robotic explorers must rely heavily on advanced artificial intelligence and autonomous navigation systems to survive.",
      "NASA's Perseverance rover exemplifies this new generation of autonomous planetary explorers. Equipped with nineteen high-resolution cameras, an intricate robotic arm, and sophisticated laser spectrometers, the rover traverses treacherous rocky terrain without direct human guidance. Perseverance's onboard supercomputers continuously analyze surrounding topography, identify hazardous obstacles, and calculate optimal driving paths independently. Furthermore, the rover carried Ingenuity, a tiny robotic helicopter that achieved the historic milestone of powered, controlled flight in the extremely thin atmosphere of another planet.",
      "The primary scientific objective of the Mars mission is astrobiology: searching for definitive biosignatures that might prove microscopic microbial life once existed in ancient Martian lakes. Perseverance has been systematically drilling rock cores in Jezero Crater, an ancient river delta that held liquid water billions of years ago. These hermetically sealed geological samples are placed inside titanium tubes and deposited on the planet's surface. Future international missions are currently being engineered to retrieve these precious Martian samples and return them safely to Earth for exhaustive laboratory analysis."
    ],
    questions: [
      {
        id: 1,
        paragraphIndex: 0,
        linesHint: "lines 1-5",
        type: "open",
        question: "How long can the one-way communication delay between Earth and Mars be?",
        suggestedAnswer: "It can be up to twenty minutes each way.",
        keywords: ["twenty minutes", "20 minutes", "minutes"],
        explanation: "נכון מאוד! עיכוב התקשורת החד-כיווני יכול להגיע לעד עשרים דקות (twenty minutes)."
      },
      {
        id: 2,
        paragraphIndex: 0,
        linesHint: "lines 4-7",
        type: "copy",
        question: "Copy the sentence that explains why Martian robotic explorers must rely on artificial intelligence.",
        targetSentence: "Because instantaneous remote control from NASA mission headquarters is physically impossible, Martian robotic explorers must rely heavily on advanced artificial intelligence and autonomous navigation systems to survive.",
        explanation: "המשפט הנכון הוא: 'Because instantaneous remote control from NASA mission headquarters is physically impossible, Martian robotic explorers must rely heavily on advanced artificial intelligence and autonomous navigation systems to survive.' (מכיוון ששליטה מיידית מרחוק ממפקדת נאס\"א אינה אפשרית פיזית, רובוטי החקר חייבים להסתמך רבות על בינה מלאכותית ומערכות ניווט אוטונומיות)."
      },
      {
        id: 3,
        paragraphIndex: 1,
        linesHint: "lines 8-11",
        type: "mcq",
        question: "How many high-resolution cameras is the Perseverance rover equipped with?",
        options: [
          "Five cameras",
          "Twelve cameras",
          "Nineteen cameras",
          "Fifty cameras"
        ],
        answerIndex: 2,
        explanation: "נכון מאוד! בפסקה 2 מצוין שהרובר מצויד ב-19 מצלמות ברזולוציה גבוהה (nineteen high-resolution cameras)."
      },
      {
        id: 4,
        paragraphIndex: 1,
        linesHint: "lines 11-14",
        type: "open",
        question: "What historic aviation milestone did the Ingenuity helicopter achieve?",
        suggestedAnswer: "Powered, controlled flight in the extremely thin atmosphere of another planet.",
        keywords: ["flight", "controlled flight", "powered flight", "atmosphere"],
        explanation: "התשובה היא טיסה ממונעת ומבוקרת באטמוספירה הדלילה של כוכב לכת אחר."
      },
      {
        id: 5,
        paragraphIndex: 2,
        linesHint: "lines 15-18",
        type: "mcq",
        question: "What is the primary scientific objective of the Perseverance mission?",
        options: [
          "Building permanent human colonies on Mars",
          "Mining gold and diamond deposits in craters",
          "Astrobiology: searching for biosignatures of ancient microbial life",
          "Testing space weapons in extreme vacuum conditions"
        ],
        answerIndex: 2,
        explanation: "נכון! המטרה הראשית היא אסטרוביולוגיה – חיפוש סמנים ביולוגיים לקיום חיים חיידקיים בעבר."
      },
      {
        id: 6,
        paragraphIndex: 2,
        linesHint: "lines 16-19",
        type: "copy",
        question: "Copy the sentence that describes where Perseverance has been drilling rock cores.",
        targetSentence: "Perseverance has been systematically drilling rock cores in Jezero Crater, an ancient river delta that held liquid water billions of years ago.",
        explanation: "המשפט הנכון הוא: 'Perseverance has been systematically drilling rock cores in Jezero Crater, an ancient river delta that held liquid water billions of years ago.' (פרסווירנס קודח באופן שיטתי ליבות סלע במכתש ג'זרו, דלתת נהר עתיקה שהכילה מים נוזליים לפני מיליארדי שנים)."
      },
      {
        id: 7,
        paragraphIndex: 2,
        linesHint: "lines 18-22",
        type: "open",
        question: "What are future international missions being engineered to do with the rock samples?",
        suggestedAnswer: "To retrieve the samples and return them safely to Earth for laboratory analysis.",
        keywords: ["retrieve", "return", "Earth", "laboratory"],
        explanation: "נכון מאוד! המשימות העתידיות מתוכננות לאסוף את דגימות הסלע ולהחזירן לכדור הארץ לניתוח מעבדתי מקיף."
      }
    ],
    globalQuestion: {
      question: "What is the main subject of this scientific passage?",
      options: [
        "The cutting-edge autonomous technology and astrobiological goals of the Mars Perseverance mission",
        "The commercial tourism plans to land civilians on Mars by 2030",
        "How radio signals travel through empty interstellar space",
        "A comparison of gravity on the Moon versus gravity on Mars"
      ],
      answerIndex: 0,
      explanation: "מצוין! המאמר מפרט על הטכנולוגיה האוטונומית החדשנית ועל מטרות החקר האסטרוביולוגיות של הרובר פרסווירנס במאדים."
    },
    vocabularyHints: [
      { word: "atmospheric pressure", translation: "לחץ אטמוספרי" },
      { word: "spectrometers", translation: "ספקטרומטרים (מכשירי ניתוח אור)" },
      { word: "astrobiology", translation: "אסטרוביולוגיה (חקר חיים בחלל)" },
      { word: "biosignatures", translation: "סמנים ביולוגיים (עקבות חיים)" },
      { word: "hermetically", translation: "באופן הרמטי (אטום לחלוטין)" }
    ]
  }
];
