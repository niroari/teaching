export interface Sentence {
  id: number;
  text: string;
  category: 'correct' | 'incorrect' | 'tricky';
  isCorrect: boolean;
  explanation: string;
  correction?: string;
}

export const builtInSentences: Sentence[] = [
  // CATEGORY 1: Correct Sentences (isCorrect: true)
  {
    id: 1,
    text: "I am planning to sleep until noon every day this summer.",
    category: "correct",
    isCorrect: true,
    explanation: "This sentence is perfectly correct. It uses the present continuous ('am planning') to express a future plan and has correct time expressions."
  },
  {
    id: 2,
    text: "My English teacher is the most handsome person in the school.",
    category: "correct",
    isCorrect: true,
    explanation: "Perfect grammar. Uses the superlative 'the most handsome' correctly. A fun way to get a laugh from the class!"
  },
  {
    id: 3,
    text: "We don't have any homework during the summer vacation.",
    category: "correct",
    isCorrect: true,
    explanation: "Correct use of the negative auxiliary 'don't have' and the determiner 'any' for uncountable nouns ('homework')."
  },
  {
    id: 4,
    text: "There are seven days in a week and twelve months in a year.",
    category: "correct",
    isCorrect: true,
    explanation: "Grammatically correct fact. 'There are' is correctly used with plural subjects ('seven days', 'twelve months')."
  },
  {
    id: 5,
    text: "Last year, we studied English twice a week.",
    category: "correct",
    isCorrect: true,
    explanation: "Correct past simple form ('studied') triggered by the past time expression 'Last year'."
  },
  {
    id: 6,
    text: "I love eating pizza with extra olives for dinner.",
    category: "correct",
    isCorrect: true,
    explanation: "Correct structure. The verb 'love' is followed by a gerund ('eating'), which is standard in English."
  },
  {
    id: 7,
    text: "The sun shines brightly during the hot July days.",
    category: "correct",
    isCorrect: true,
    explanation: "Correct. 'The sun' (singular) takes 'shines' (present simple third person), and the adverb 'brightly' describes how it shines."
  },
  {
    id: 8,
    text: "My family is going to travel to Eilat next month.",
    category: "correct",
    isCorrect: true,
    explanation: "Correct. Uses 'be going to' for future plans. 'My family' can take a singular verb ('is') as a collective unit."
  },
  {
    id: 9,
    text: "I want to buy a new swimsuit for our pool party.",
    category: "correct",
    isCorrect: true,
    explanation: "Correct. The verb 'want' is followed by the infinitive 'to buy'."
  },
  {
    id: 10,
    text: "We had a wonderful time at the water park yesterday.",
    category: "correct",
    isCorrect: true,
    explanation: "Correct. Uses the irregular past tense 'had' of 'have' with a past time marker 'yesterday'."
  },
  {
    id: 11,
    text: "He can swim faster than his older brother.",
    category: "correct",
    isCorrect: true,
    explanation: "Correct. Modal 'can' is followed by base verb 'swim', and 'faster than' is the correct comparative form."
  },
  {
    id: 12,
    text: "My parents bought me a new bicycle for my birthday.",
    category: "correct",
    isCorrect: true,
    explanation: "Correct use of the past tense 'bought' (irregular of 'buy') and direct/indirect object placement."
  },
  {
    id: 13,
    text: "She loves reading books under the air conditioner.",
    category: "correct",
    isCorrect: true,
    explanation: "Correct. Present simple 'loves' (third person singular) followed by the gerund 'reading'."
  },
  {
    id: 14,
    text: "We will eat a lot of ice cream in July and August.",
    category: "correct",
    isCorrect: true,
    explanation: "Correct future simple structure using modal 'will' + base verb 'eat'."
  },
  {
    id: 15,
    text: "Our classroom is very clean when there are no students.",
    category: "correct",
    isCorrect: true,
    explanation: "Correct. 'Classroom' is singular ('is'), and 'students' is plural ('there are'). Cute joke for classroom settings."
  },

  // CATEGORY 2: Grammatical Errors (isCorrect: false)
  {
    id: 16,
    text: "She go to the beach every day.",
    category: "incorrect",
    isCorrect: false,
    explanation: "Subject-Verb Agreement error. For third-person singular (He/She/It) in the present simple, we must add 's/es' to the verb.",
    correction: "She goes to the beach every day."
  },
  {
    id: 17,
    text: "I have a blue big car.",
    category: "incorrect",
    isCorrect: false,
    explanation: "Incorrect adjective order. In English, size adjectives (big) come before color adjectives (blue).",
    correction: "I have a big blue car."
  },
  {
    id: 18,
    text: "We was very happy to see the movie.",
    category: "incorrect",
    isCorrect: false,
    explanation: "Subject-Verb Agreement error in the past simple. 'We' is plural and must take 'were', not 'was'.",
    correction: "We were very happy to see the movie."
  },
  {
    id: 19,
    text: "He don't like to play football on Saturdays.",
    category: "incorrect",
    isCorrect: false,
    explanation: "Subject-Verb Agreement error. The negative helper for third-person singular (He/She/It) in the present simple is 'doesn't', not 'don't'.",
    correction: "He doesn't like to play football on Saturdays."
  },
  {
    id: 20,
    text: "I have two childs and one dog.",
    category: "incorrect",
    isCorrect: false,
    explanation: "Irregular plural noun error. The plural of 'child' is 'children'. 'Childs' is not a word.",
    correction: "I have two children and one dog."
  },
  {
    id: 21,
    text: "Look! The cat is dance on the table.",
    category: "incorrect",
    isCorrect: false,
    explanation: "Present Progressive form error. The verb following the helper 'be' (is) must be in the gerund/continuous (-ing) form.",
    correction: "Look! The cat is dancing on the table."
  },
  {
    id: 22,
    text: "They went to the beach tomorrow.",
    category: "incorrect",
    isCorrect: false,
    explanation: "Tense conflict. The past tense verb 'went' cannot be used with the future time marker 'tomorrow'.",
    correction: "They are going to the beach tomorrow. / They will go to the beach tomorrow. / They went to the beach yesterday."
  },
  {
    id: 23,
    text: "I am not agreeing with your opinion.",
    category: "incorrect",
    isCorrect: false,
    explanation: "Stative verb error. The verb 'agree' describes a state of mind, not an action, so it is rarely used in the continuous/progressive tense.",
    correction: "I don't agree with your opinion."
  },
  {
    id: 24,
    text: "He study English for three hours yesterday.",
    category: "incorrect",
    isCorrect: false,
    explanation: "Past tense error. For the past action 'yesterday', we must use the past simple form of study ('studied').",
    correction: "He studied English for three hours yesterday."
  },
  {
    id: 25,
    text: "There is many people at the amusement park.",
    category: "incorrect",
    isCorrect: false,
    explanation: "Subject-Verb Agreement error with 'There is/are'. The word 'people' is plural, so it must take 'There are', not 'There is'.",
    correction: "There are many people at the amusement park."
  },
  {
    id: 26,
    text: "I can to speak English very well.",
    category: "incorrect",
    isCorrect: false,
    explanation: "Modal verb error. Modal verbs like 'can', 'should', and 'must' are followed directly by the base form of the verb without 'to'.",
    correction: "I can speak English very well."
  },
  {
    id: 27,
    text: "She is more tall than her sister.",
    category: "incorrect",
    isCorrect: false,
    explanation: "Comparative adjective error. Short one-syllable adjectives form their comparative by adding '-er' to the end, not by adding 'more'.",
    correction: "She is taller than her sister."
  },
  {
    id: 28,
    text: "We didn't went to school last Friday.",
    category: "incorrect",
    isCorrect: false,
    explanation: "Double past marking error. In negative past simple sentences, the helper 'didn't' already marks the past tense. The main verb must be in its base form.",
    correction: "We didn't go to school last Friday."
  },
  {
    id: 29,
    text: "He doesn't knows the answer to the question.",
    category: "incorrect",
    isCorrect: false,
    explanation: "Double singular/third-person marking error. The auxiliary 'doesn't' already carries the 's' for the third-person singular. The main verb should be in the base form.",
    correction: "He doesn't know the answer to the question."
  },
  {
    id: 30,
    text: "I have a lot of homeworks to do tonight.",
    category: "incorrect",
    isCorrect: false,
    explanation: "Non-count noun error. 'Homework' is uncountable in English and cannot be pluralized with an 's'.",
    correction: "I have a lot of homework to do tonight."
  },

  // CATEGORY 3: Tricky / Funny (Mixed)
  {
    id: 31,
    text: "The students wants to go home now.",
    category: "tricky",
    isCorrect: false,
    explanation: "Tricky Subject-Verb Agreement. Plural nouns (students) take the verb without 's' (want). Many students get confused and think plural nouns take plural-looking verbs with 's'.",
    correction: "The students want to go home now."
  },
  {
    id: 32,
    text: "English is more easier than Math.",
    category: "tricky",
    isCorrect: false,
    explanation: "Double comparative error. 'Easier' is already comparative. Adding 'more' is redundant and grammatically incorrect.",
    correction: "English is easier than Math."
  },
  {
    id: 33,
    text: "I am seeing you right now.",
    category: "tricky",
    isCorrect: false,
    explanation: "Stative verb error. 'See' in the sense of physical perception is a stative verb and is not used in the continuous form. We use the simple present or 'can see'.",
    correction: "I see you right now. / I can see you right now."
  },
  {
    id: 34,
    text: "You are my best friends.",
    category: "tricky",
    isCorrect: true,
    explanation: "Correct! This is a great trick because 'you' can be plural (addressing a group). If a teacher says it to a group of students, it is 100% correct. If said to one person, it would be incorrect, which sparks excellent classroom debates!"
  },
  {
    id: 35,
    text: "The police is chasing the bank robber.",
    category: "tricky",
    isCorrect: false,
    explanation: "Collective plural error. In English, 'police' is a collective plural noun and always takes a plural verb ('are', 'have', etc.).",
    correction: "The police are chasing the bank robber."
  },
  {
    id: 36,
    text: "He cutted the cake into ten pieces.",
    category: "tricky",
    isCorrect: false,
    explanation: "Irregular past tense verb error. The verb 'cut' is irregular and remains 'cut' in all three forms (cut - cut - cut). 'Cutted' is incorrect.",
    correction: "He cut the cake into ten pieces."
  },
  {
    id: 37,
    text: "If it rains tomorrow, we will stay home.",
    category: "tricky",
    isCorrect: true,
    explanation: "Correct First Conditional structure. The condition clause ('If it rains') is in the simple present, and the result clause ('we will stay') is in the future. Hebrew speakers often mistakenly say 'If it will rain...'"
  },
  {
    id: 38,
    text: "She has been living here since five years.",
    category: "tricky",
    isCorrect: false,
    explanation: "Preposition error with Present Perfect Continuous. We use 'for' with a duration of time (five years) and 'since' with a specific starting point in time (e.g., 2021).",
    correction: "She has been living here for five years."
  },
  {
    id: 39,
    text: "I look forward to meeting you this summer.",
    category: "tricky",
    isCorrect: true,
    explanation: "Correct! The phrase 'look forward to' acts as a phrasal preposition, where 'to' is a preposition and must be followed by a noun or gerund (-ing form). Very tricky because students expect an infinitive ('to meet')."
  },
  {
    id: 40,
    text: "The news is very exciting today.",
    category: "tricky",
    isCorrect: true,
    explanation: "Correct. Although 'news' ends in 's', it is an uncountable singular noun and takes a singular verb ('is')."
  },
  {
    id: 41,
    text: "None of the students has finished the exam yet.",
    category: "tricky",
    isCorrect: true,
    explanation: "Correct. 'None' historically stands for 'not one' and takes a singular verb ('has'). (Note: plural 'have' is also common in casual speech, but singular is strictly correct)."
  },
  {
    id: 42,
    text: "Everyone in the class are happy.",
    category: "tricky",
    isCorrect: false,
    explanation: "Singular pronoun error. 'Everyone', 'someone', 'nobody' are singular pronouns and must take a singular verb ('is', 'has', 'does').",
    correction: "Everyone in the class is happy."
  },
  {
    id: 43,
    text: "I forgot my phone at home.",
    category: "tricky",
    isCorrect: false,
    explanation: "Verb choice error (L1 transfer). In English, we do not 'forget' things at a location; we 'leave' them. We only 'forget' information, thoughts, or actions.",
    correction: "I left my phone at home. / I forgot my phone."
  }
];
