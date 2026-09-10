import { UnseenData } from "../unseen-data";

export const MEDIUM_UNSEENS: UnseenData[] = [
  // Medium 1 (Original)
  {
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

  // Medium 2
  {
    title: "The Mystery of the Roman Coin",
    difficulty: "Medium",
    paragraphs: [
      "Twelve-year-old Noam loved history and archaeology. During the Passover vacation, his family went on a hiking trip along the ancient paths of Caesarea National Park. The sun was warm, and a gentle breeze blew from the Mediterranean Sea. While walking near an ancient stone wall, Noam noticed a strange metallic shine beneath a pile of sand and dry leaves. He knelt down and carefully brushed away the dust with his fingers.",
      "In the palm of his hand lay an ancient bronze coin covered in green patina. On one side, Noam could clearly see the profile of a Roman emperor wearing a laurel wreath. On the other side was an image of an ancient sailing ship. Excited by the discovery, Noam showed the artifact to the park rangers. The head archaeologist was called immediately to examine the rare find.",
      "The archaeologist explained that the coin was nearly two thousand years old and had probably belonged to a Roman merchant sailing to Rome. Instead of keeping the coin, Noam decided to donate it to the national antiquities authority. A month later, the museum sent Noam an official certificate of appreciation and invited his entire class for a free guided tour. Noam was proud that his curiosity helped preserve a piece of ancient history."
    ],
    questions: [
      {
        id: 1,
        paragraphIndex: 0,
        linesHint: "lines 1-4",
        type: "mcq",
        question: "Where was Noam hiking with his family?",
        options: [
          "In the Judean Hills",
          "In Caesarea National Park",
          "Along the Jordan River",
          "In the Golan Heights"
        ],
        answerIndex: 1,
        explanation: "נכון מאוד! בפסקה 1 כתוב שהם טיילו בגן הלאומי קיסריה (Caesarea National Park)."
      },
      {
        id: 2,
        paragraphIndex: 0,
        linesHint: "lines 4-7",
        type: "copy",
        question: "Copy the sentence that tells what caught Noam's attention near the stone wall.",
        targetSentence: "While walking near an ancient stone wall, Noam noticed a strange metallic shine beneath a pile of sand and dry leaves.",
        explanation: "המשפט הנכון הוא: 'While walking near an ancient stone wall, Noam noticed a strange metallic shine beneath a pile of sand and dry leaves.' (תוך כדי הליכה ליד חומת אבן עתיקה, נועם הבחין בנצנוץ מתכתי מוזר מתחת לערימת חול ועלים יבשים)."
      },
      {
        id: 3,
        paragraphIndex: 1,
        linesHint: "lines 7-10",
        type: "copy",
        question: "Copy the sentence describing what was depicted on one side of the coin.",
        targetSentence: "On one side, Noam could clearly see the profile of a Roman emperor wearing a laurel wreath.",
        explanation: "המשפט הנכון הוא: 'On one side, Noam could clearly see the profile of a Roman emperor wearing a laurel wreath.' (בצד אחד, נועם יכול היה לראות בבירור את הפרופיל של קיסר רומי העוטה זר דפנה)."
      },
      {
        id: 4,
        paragraphIndex: 1,
        linesHint: "lines 9-12",
        type: "open",
        question: "What image was on the other side of the coin?",
        suggestedAnswer: "There was an image of an ancient sailing ship.",
        keywords: ["sailing ship", "ship", "ancient ship"],
        explanation: "התשובה המוצעת היא ציור של ספינת מפרש עתיקה (an ancient sailing ship)."
      },
      {
        id: 5,
        paragraphIndex: 2,
        linesHint: "lines 13-15",
        type: "mcq",
        question: "How old was the coin according to the archaeologist?",
        options: [
          "About five hundred years old",
          "Nearly two thousand years old",
          "About three hundred years old",
          "Ten thousand years old"
        ],
        answerIndex: 1,
        explanation: "נכון! הארכיאולוג הסביר שהמטבע בן כמעט אלפיים שנה (nearly two thousand years old)."
      },
      {
        id: 6,
        paragraphIndex: 2,
        linesHint: "lines 14-16",
        type: "open",
        question: "What did Noam decide to do with the coin instead of keeping it?",
        suggestedAnswer: "He decided to donate it to the national antiquities authority.",
        keywords: ["donate", "antiquities", "museum", "authority"],
        explanation: "התשובה היא שהוא החליט לתרום אותו לרשות העתיקות הלאומית (donate it)."
      },
      {
        id: 7,
        paragraphIndex: 2,
        linesHint: "lines 16-19",
        type: "mcq",
        question: "What did the museum send to Noam a month later?",
        options: [
          "A sum of money",
          "An official certificate of appreciation",
          "A replica Roman sword",
          "A new metal detector"
        ],
        answerIndex: 1,
        explanation: "נכון מאוד! המוזיאון שלח לו תעודת הוקרה רשמית (an official certificate of appreciation)."
      }
    ],
    globalQuestion: {
      question: "What is the central theme of this story?",
      options: [
        "A boy's discovery of a historical artifact and his responsible choice",
        "How to sail ancient Roman ships across the sea",
        "The best hiking trails in the north of Israel",
        "How archaeologists clean modern coins"
      ],
      answerIndex: 0,
      explanation: "מצוין! הסיפור מתמקד במציאת המטבע העתיק על ידי נועם ובבחירתו האחראית לתרום אותו."
    },
    vocabularyHints: [
      { word: "archaeology", translation: "ארכיאולוגיה" },
      { word: "bronze", translation: "ברונזה / ארד" },
      { word: "emperor", translation: "קיסר" },
      { word: "merchant", translation: "סוחר" },
      { word: "donate", translation: "לתרום" },
      { word: "appreciation", translation: "הערכה / הוקרה" }
    ]
  },

  // Medium 3
  {
    title: "The Great Honeybee Rescue",
    difficulty: "Medium",
    paragraphs: [
      "In a quiet neighborhood in northern Israel, farmer Eli noticed something troubling in his citrus orchard. The orange and lemon trees were full of white blossoms, but there was almost complete silence in the grove. Usually, thousands of worker bees buzzed from flower to flower, collecting sweet nectar and carrying golden pollen. Without bees, the trees could not produce fruit, and Eli knew his harvest was in serious danger.",
      "Eli decided to contact Dr. Ronit, an entomologist from the agricultural research center. When Dr. Ronit visited the farm, she discovered that neighboring gardens had recently used strong chemical pesticides. These harmful chemicals had weakened the local bee colonies and caused them to abandon their hives. Together, Eli and Dr. Ronit designed a rescue plan to bring healthy bees back to the orchard without using dangerous sprays.",
      "Over the next three weeks, Eli planted rows of wildflowers like lavender and rosemary along the orchard borders. Dr. Ronit installed two modern wooden beehives equipped with temperature sensors to monitor the queen bee. Within a month, the worker bees returned in large numbers. The citrus trees flourished, producing sweet oranges, and Eli even harvested pure honey that he shared with his supportive neighbors."
    ],
    questions: [
      {
        id: 1,
        paragraphIndex: 0,
        linesHint: "lines 1-4",
        type: "mcq",
        question: "What troubling sign did Eli notice in his citrus orchard?",
        options: [
          "The trees were dying from lack of water",
          "There was almost complete silence because bees were missing",
          "A fire had damaged the lemon trees",
          "Birds were eating all the fruit"
        ],
        answerIndex: 1,
        explanation: "נכון מאוד! בפסקה 1 מוסבר שהיה שקט מוחלט כי הדבורים נעלמו מהפרדס."
      },
      {
        id: 2,
        paragraphIndex: 0,
        linesHint: "lines 2-5",
        type: "copy",
        question: "Copy the sentence describing what the bees usually do among the flowers.",
        targetSentence: "Usually, thousands of worker bees buzzed from flower to flower, collecting sweet nectar and carrying golden pollen.",
        explanation: "המשפט הנכון הוא: 'Usually, thousands of worker bees buzzed from flower to flower, collecting sweet nectar and carrying golden pollen.' (בדרך כלל, אלפי דבורים פועלות זמזמו מפרח לפרח, אספו צוף מתוק ונשאו אבקה זהובה)."
      },
      {
        id: 3,
        paragraphIndex: 1,
        linesHint: "lines 6-8",
        type: "open",
        question: "Who did Eli contact for professional help?",
        suggestedAnswer: "He contacted Dr. Ronit, an entomologist.",
        keywords: ["Dr. Ronit", "entomologist", "Ronit"],
        explanation: "התשובה המוצעת היא ד\"ר רונית, חוקרת חרקים (Dr. Ronit, an entomologist)."
      },
      {
        id: 4,
        paragraphIndex: 1,
        linesHint: "lines 7-10",
        type: "copy",
        question: "Copy the sentence that explains what the chemical pesticides did to the bee colonies.",
        targetSentence: "These harmful chemicals had weakened the local bee colonies and caused them to abandon their hives.",
        explanation: "המשפט הנכון הוא: 'These harmful chemicals had weakened the local bee colonies and caused them to abandon their hives.' (הכימיקלים המזיקים האלה החלישו את מושבות הדבורים המקומיות וגרמו להן לנטוש את כוורותיהן)."
      },
      {
        id: 5,
        paragraphIndex: 2,
        linesHint: "lines 11-13",
        type: "open",
        question: "What types of wildflowers did Eli plant along the orchard borders?",
        suggestedAnswer: "He planted lavender and rosemary.",
        keywords: ["lavender", "rosemary"],
        explanation: "נכון מאוד! הוא שתל לבנדר ורוזמרין (lavender and rosemary)."
      },
      {
        id: 6,
        paragraphIndex: 2,
        linesHint: "lines 12-14",
        type: "mcq",
        question: "What were the new beehives equipped with to monitor the queen bee?",
        options: [
          "Small video cameras",
          "Temperature sensors",
          "Microscopic radios",
          "Automatic food dispensers"
        ],
        answerIndex: 1,
        explanation: "נכון! הכוורות צוידו בחיישני טמפרטורה (temperature sensors)."
      },
      {
        id: 7,
        paragraphIndex: 2,
        linesHint: "lines 14-17",
        type: "mcq",
        question: "What extra product did Eli harvest and share with his neighbors?",
        options: [
          "Fresh lemonade",
          "Pure honey",
          "Lavender tea",
          "Citrus jam"
        ],
        answerIndex: 1,
        explanation: "נכון מאוד! בפסקה 3 כתוב שהוא רדה דבש טהור וחלק אותו עם שכניו (pure honey)."
      }
    ],
    globalQuestion: {
      question: "What is the primary message of this article?",
      options: [
        "How protecting bees through eco-friendly practices helps crops thrive",
        "Why chemical pesticides are necessary in modern farming",
        "The difference between lemon trees and orange trees",
        "How to build wooden fences around gardens"
      ],
      answerIndex: 0,
      explanation: "כל הכבוד! הטקסט מציג כיצד שמירה על הדבורים בשיטות ידידותיות לסביבה סייעה להצלת היבול."
    },
    vocabularyHints: [
      { word: "orchard", translation: "פרדס / מטע" },
      { word: "nectar", translation: "צוף" },
      { word: "pesticides", translation: "חומרי הדברה" },
      { word: "entomologist", translation: "אנטומולוג (חוקר חרקים)" },
      { word: "flourished", translation: "שגשגו / פרחו" }
    ]
  },

  // Medium 4
  {
    title: "The Young Mountain Rescue Dog",
    difficulty: "Medium",
    paragraphs: [
      "High in the Swiss Alps, winter brings heavy snowstorms and freezing temperatures. On Mount Rosa, a specialized rescue team trains rescue dogs to locate skiers who get trapped under avalanches. Among the new recruits was Bruno, a two-year-old Saint Bernard with thick fur and exceptional hearing. Bruno's handler, Marc, spent months teaching him how to recognize human scent buried deep beneath layers of packed snow.",
      "One stormy Tuesday afternoon, the alarm sounded at the alpine rescue station. Two snowboarders had ventured off the marked ski trails and had been caught by a sudden snow slide. The helicopter could not fly due to dense fog, so Marc and Bruno set out on skis through the blizzard. When they reached the designated coordinates, Bruno immediately began sniffing the frozen ground, running back and forth against the howling wind.",
      "Suddenly, Bruno stopped near a large snowdrift and began barking loudly while digging furiously with his paws. Marc quickly used his collapsible metal probe and detected movement two meters underground. Within minutes, the rescue team cleared the snow and pulled the two cold but uninjured snowboarders to safety. That evening at the cabin, Bruno received an extra portion of beef stew and was celebrated as a true alpine hero."
    ],
    questions: [
      {
        id: 1,
        paragraphIndex: 0,
        linesHint: "lines 1-3",
        type: "mcq",
        question: "What is the specialized rescue team on Mount Rosa trained to do?",
        options: [
          "Build ski hotels",
          "Locate skiers trapped under avalanches",
          "Clear roads from heavy rocks",
          "Photograph mountain animals in winter"
        ],
        answerIndex: 1,
        explanation: "נכון מאוד! בפסקה 1 מוסבר שהצוות מאמן כלבים לאתר גולשים שנלכדו תחת מפולות שלגים (avalanches)."
      },
      {
        id: 2,
        paragraphIndex: 0,
        linesHint: "lines 3-5",
        type: "copy",
        question: "Copy the sentence that introduces Bruno and describes his physical traits.",
        targetSentence: "Among the new recruits was Bruno, a two-year-old Saint Bernard with thick fur and exceptional hearing.",
        explanation: "המשפט הנכון הוא: 'Among the new recruits was Bruno, a two-year-old Saint Bernard with thick fur and exceptional hearing.' (בין המגויסים החדשים היה ברונו, סן ברנרד בן שנתיים בעל פרווה עבה ושמיעה יוצאת דופן)."
      },
      {
        id: 3,
        paragraphIndex: 0,
        linesHint: "lines 4-7",
        type: "open",
        question: "What did Marc spend months teaching Bruno?",
        suggestedAnswer: "He taught him how to recognize human scent buried deep under packed snow.",
        keywords: ["scent", "human scent", "snow", "buried"],
        explanation: "נכון! הוא לימד אותו לזהות ריח אנושי הקבור עמוק מתחת לשלג."
      },
      {
        id: 4,
        paragraphIndex: 1,
        linesHint: "lines 8-11",
        type: "mcq",
        question: "Why was the rescue helicopter unable to fly?",
        options: [
          "It was out of fuel",
          "Due to dense fog",
          "The engine was broken",
          "The pilot was not available"
        ],
        answerIndex: 1,
        explanation: "נכון! המסוק לא יכול היה להמריא בשל ערפל כבד (dense fog)."
      },
      {
        id: 5,
        paragraphIndex: 2,
        linesHint: "lines 13-15",
        type: "copy",
        question: "Copy the sentence that shows Bruno found the location of the trapped snowboarders.",
        targetSentence: "Suddenly, Bruno stopped near a large snowdrift and began barking loudly while digging furiously with his paws.",
        explanation: "המשפט הנכון הוא: 'Suddenly, Bruno stopped near a large snowdrift and began barking loudly while digging furiously with his paws.' (לפתע, ברונו עצר ליד תלולית שלג גדולה והחל לנבוח בקול רם תוך כדי חפירה בזעם בכפותיו)."
      },
      {
        id: 6,
        paragraphIndex: 2,
        linesHint: "lines 14-17",
        type: "open",
        question: "How deep underground were the two snowboarders detected?",
        suggestedAnswer: "They were detected two meters underground.",
        keywords: ["two meters", "2 meters", "two meters underground"],
        explanation: "נכון מאוד! הם אותרו בעומק של שני מטרים מתחת לפני השלג (two meters underground)."
      },
      {
        id: 7,
        paragraphIndex: 2,
        linesHint: "lines 16-19",
        type: "mcq",
        question: "How was Bruno rewarded back at the cabin?",
        options: [
          "He was given a shiny new medal",
          "He received an extra portion of beef stew",
          "He was allowed to sleep on Marc's bed",
          "He received a warm wool sweater"
        ],
        answerIndex: 1,
        explanation: "נכון מאוד! ברונו קיבל מנה נוספת של תבשיל בקר (an extra portion of beef stew)."
      }
    ],
    globalQuestion: {
      question: "What is this story mostly about?",
      options: [
        "A brave rescue dog who successfully saves trapped snowboarders in a blizzard",
        "How to safely ride snowboards on steep mountain slopes",
        "The history of Saint Bernard dogs in ancient Europe",
        "The reasons why winter weather is becoming colder in the Alps"
      ],
      answerIndex: 0,
      explanation: "כל הכבוד! הסיפור מתאר את גבורתו של כלב החילוץ ברונו שהציל שני גולשים בסופת שלגים."
    },
    vocabularyHints: [
      { word: "avalanches", translation: "מפולות שלגים" },
      { word: "handler", translation: "מאלף / מפעיל כלב" },
      { word: "scent", translation: "ריח / עקבות ריח" },
      { word: "blizzard", translation: "סופת שלגים" },
      { word: "probe", translation: "גשושית / מוט חיפוש" }
    ]
  },

  // Medium 5
  {
    title: "The Solar Car Challenge",
    difficulty: "Medium",
    paragraphs: [
      "At Green Valley High School, a group of five ambitious students decided to enter the National Solar Car Competition. Their mission was to design and build a fully functional vehicle powered entirely by sunlight. Led by captain Tamar, the students spent four months in the school workshop after classes. They welded a lightweight aluminum frame and installed forty high-efficiency solar cells across the curved roof of the car.",
      "On the day of the race in the desert, temperatures exceeded thirty-five degrees Celsius. Twelve teams from different schools gathered at the starting line, each displaying innovative engineering designs. Tamar's car, named 'Sunfire', started in fourth position. The challenge was not just about speed, but also energy conservation. Tamar's teammate, Roy, sat inside the narrow cockpit, carefully managing the battery power while monitoring solar input on a digital dashboard.",
      "As the race approached the final twenty kilometers, several competing vehicles suffered from overheating batteries and were forced to pull over. However, Sunfire's smart cooling system kept its electric motor running smoothly. In the final stretch, Sunfire overtook the leading car and crossed the finish line in first place. The students won a prestigious trophy and a scholarship to study renewable energy engineering at the university."
    ],
    questions: [
      {
        id: 1,
        paragraphIndex: 0,
        linesHint: "lines 1-3",
        type: "copy",
        question: "Copy the sentence that states the students' goal in building the vehicle.",
        targetSentence: "Their mission was to design and build a fully functional vehicle powered entirely by sunlight.",
        explanation: "המשפט הנכון הוא: 'Their mission was to design and build a fully functional vehicle powered entirely by sunlight.' (משימתם הייתה לתכנן ולבנות רכב מתפקד לחלוטין המונע כולו באור שמש)."
      },
      {
        id: 2,
        paragraphIndex: 0,
        linesHint: "lines 3-6",
        type: "open",
        question: "How many solar cells did the students install on the car's roof?",
        suggestedAnswer: "They installed forty solar cells.",
        keywords: ["forty", "40", "forty solar cells"],
        explanation: "נכון מאוד! הם התקינו ארבעים תאים סולאריים על גג המכונית (forty high-efficiency solar cells)."
      },
      {
        id: 3,
        paragraphIndex: 1,
        linesHint: "lines 7-10",
        type: "copy",
        question: "Copy the sentence that tells the name and starting position of Tamar's car.",
        targetSentence: "Tamar's car, named 'Sunfire', started in fourth position.",
        explanation: "המשפט הנכון הוא: 'Tamar's car, named 'Sunfire', started in fourth position.' (המכונית של תמר, שנקראה 'סנפייר', פתחה במקום הרביעי)."
      },
      {
        id: 4,
        paragraphIndex: 1,
        linesHint: "lines 9-13",
        type: "open",
        question: "What was Roy monitoring inside the cockpit?",
        suggestedAnswer: "He was monitoring the battery power and solar input on a digital dashboard.",
        keywords: ["battery", "solar input", "dashboard"],
        explanation: "התשובה היא שהוא עקב אחר עוצמת הסוללה וקליטת האנרגיה הסולארית בלוח המחוונים הדיגיטלי."
      },
      {
        id: 5,
        paragraphIndex: 2,
        linesHint: "lines 14-16",
        type: "mcq",
        question: "Why were several competing vehicles forced to pull over near the end?",
        options: [
          "They ran out of wheels",
          "They suffered from overheating batteries",
          "The drivers were too tired",
          "A sandstorm blocked the road"
        ],
        answerIndex: 1,
        explanation: "נכון מאוד! בפסקה 3 כתוב שהסוללות של מספר רכבים מתחרים התחממו יתר על המידה (overheating batteries)."
      },
      {
        id: 6,
        paragraphIndex: 2,
        linesHint: "lines 15-18",
        type: "mcq",
        question: "What kept Sunfire's motor running smoothly despite the desert heat?",
        options: [
          "Extra ice bags",
          "A smart cooling system",
          "A larger gas tank",
          "Driving very slowly"
        ],
        answerIndex: 1,
        explanation: "נכון! מערכת קירור חכמה שמרה על המנוע החשמלי (smart cooling system)."
      },
      {
        id: 7,
        paragraphIndex: 2,
        linesHint: "lines 17-20",
        type: "open",
        question: "What scholarship did the students win along with the trophy?",
        suggestedAnswer: "A scholarship to study renewable energy engineering at the university.",
        keywords: ["renewable energy", "engineering", "scholarship"],
        explanation: "נכון! הם זכו במלגה ללימודי הנדסת אנרגיה מתחדשת באוניברסיטה."
      }
    ],
    globalQuestion: {
      question: "What is the main topic of this passage?",
      options: [
        "A team of high school students who successfully built and won a solar car race",
        "The history of gasoline cars in the twentieth century",
        "Why students should avoid driving in the desert",
        "How to purchase solar panels for home roofs"
      ],
      answerIndex: 0,
      explanation: "כל הכבוד! המאמר מתאר קבוצת תלמידים שתכננה, בנתה וזכתה במרוץ מכוניות סולאריות."
    },
    vocabularyHints: [
      { word: "ambitious", translation: "שאפתנים" },
      { word: "conservation", translation: "שימור (אנרגיה)" },
      { word: "cockpit", translation: "תא נהג / תא טייס" },
      { word: "overheating", translation: "התחממות יתר" },
      { word: "renewable energy", translation: "אנרגיה מתחדשת" }
    ]
  }
];
