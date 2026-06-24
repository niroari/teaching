import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { difficulty, topic } = await request.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, reason: "missing_api_key" },
        { status: 400 }
      );
    }

    const resolvedTopic = topic && topic.trim() ? topic.trim() : "an interesting educational or historical topic";

    let difficultyDirections = "";
    if (difficulty === "Easy") {
      difficultyDirections = 
        "Write an extremely simple A1/Beginner level text. Use ONLY direct factual sentences, very simple present tense (e.g. 'Tom has a dog', 'The dog is white'), and high-frequency everyday vocabulary (animals, colors, basic family, basic verbs). Do NOT use any compound sentences, passive voice, or advanced vocabulary. Questions must be extremely direct and literal using very simple English, and the copy question target sentence must be very short and simple.";
    } else if (difficulty === "Medium") {
      difficultyDirections = 
        "Write an A2/B1 level text. Use simple past tense, basic vocabulary, and simple descriptions suitable for non-fluent English learners. Avoid academic, advanced, or abstract terms. Questions should be standard comprehension questions using basic sentence structures.";
    } else {
      difficultyDirections = 
        "Write a text equivalent to a 5th-6th grade native English speaker level (approx. Lexile 800L-1000L) on an interesting educational, historical, or scientific topic. Use compound/complex sentences, abstract themes, and moderate-to-advanced vocabulary. Questions should test deep comprehension, basic inference, advanced vocabulary context, or the author's perspective. The copy question should target a more complex sentence.";
    }

    const systemPrompt = `You are an expert English teacher. Generate a reading comprehension activity (unseen) in English.
The difficulty level must be: ${difficulty}.
The text should be appropriate for this level: ${difficultyDirections}
The topic should be: ${resolvedTopic}.

You must return a raw JSON object matching the following TypeScript schema exactly:
{
  "title": "Title of the story",
  "difficulty": "Easy" | "Medium" | "Hard",
  "paragraphs": [
    "Paragraph 1 text (approx 80-100 words)",
    "Paragraph 2 text (approx 80-100 words)",
    "Paragraph 3 text (approx 80-100 words)"
  ],
  "questions": [
    {
      "id": 1,
      "paragraphIndex": 0,
      "linesHint": "lines 1-3",
      "type": "mcq",
      "question": "First question about paragraph 1 in English?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answerIndex": 0,
      "explanation": "Detailed explanation in Hebrew."
    },
    {
      "id": 2,
      "paragraphIndex": 0,
      "linesHint": "lines 3-6",
      "type": "open",
      "question": "Second question about paragraph 1 in English?",
      "suggestedAnswer": "Suggested correct model answer in English.",
      "keywords": ["word1", "word2"],
      "explanation": "Detailed explanation in Hebrew."
    },
    {
      "id": 3,
      "paragraphIndex": 1,
      "linesHint": "lines 7-10",
      "type": "mcq",
      "question": "First question about paragraph 2 in English?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answerIndex": 1,
      "explanation": "Detailed explanation in Hebrew."
    },
    {
      "id": 4,
      "paragraphIndex": 1,
      "linesHint": "lines 9-12",
      "type": "copy",
      "question": "Instruction in English to copy a specific sentence from paragraph 2.",
      "targetSentence": "The exact sentence copied verbatim from paragraph 2",
      "explanation": "Detailed explanation in Hebrew."
    },
    {
      "id": 5,
      "paragraphIndex": 2,
      "linesHint": "lines 13-15",
      "type": "mcq",
      "question": "First question about paragraph 3 in English?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answerIndex": 2,
      "explanation": "Detailed explanation in Hebrew."
    },
    {
      "id": 6,
      "paragraphIndex": 2,
      "linesHint": "lines 15-18",
      "type": "open",
      "question": "Second question about paragraph 3 in English?",
      "suggestedAnswer": "Suggested correct model answer in English.",
      "keywords": ["word3", "word4"],
      "explanation": "Detailed explanation in Hebrew."
    },
    {
      "id": 7,
      "paragraphIndex": 2,
      "linesHint": "lines 13-18",
      "type": "copy",
      "question": "Instruction in English to copy a specific sentence from paragraph 3.",
      "targetSentence": "The exact sentence copied verbatim from paragraph 3",
      "explanation": "Detailed explanation in Hebrew."
    }
  ],
  "globalQuestion": {
    "question": "A summary or main idea question about the entire text in English?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answerIndex": 0,
    "explanation": "Detailed explanation in Hebrew explaining why this is the main idea of the story."
  },
  "vocabularyHints": [
    { "word": "word1", "translation": "Hebrew translation" },
    { "word": "word2", "translation": "Hebrew translation" },
    { "word": "word3", "translation": "Hebrew translation" },
    { "word": "word4", "translation": "Hebrew translation" },
    { "word": "word5", "translation": "Hebrew translation" }
  ]
}

CRITICAL RULES:
1. All explanations and vocabulary translations must be in correct Hebrew, natural-sounding, and easy for students to read.
2. The questions array MUST have exactly 7 items, distributed across paragraphIndex 0, 1, and 2 (e.g. 2 questions for paragraph 1, 2 for paragraph 2, 3 for paragraph 3).
3. Keep the line range hints accurate in relation to the generated paragraph structures.
4. Ensure a diverse mix of question types (strictly including multiple choice 'mcq', sentence copying 'copy', and open text answer 'open').
5. For any 'copy' type question, the 'targetSentence' MUST exist exactly verbatim in the corresponding paragraph.
6. Do not include markdown code block syntax (like \`\`\`json) in the response. Return only the JSON object.
7. The total reading text must be longer, approximately 25-30 lines of text (about 80-100 words per paragraph, totaling around 250-300 words).`;

    const requestBody = {
      contents: [
        {
          parts: [{ text: systemPrompt }]
        }
      ],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.7
      }
    };

    const modelsToTry = ["gemini-2.5-flash", "gemini-1.5-flash"];
    let response: Response | null = null;
    let errorText = "";

    for (const model of modelsToTry) {
      try {
        console.log(`Attempting generation with model: ${model}`);
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
          }
        );

        if (res.ok) {
          response = res;
          break;
        } else {
          errorText = await res.text();
          console.warn(`Model ${model} failed with status ${res.status}:`, errorText);
        }
      } catch (err: any) {
        errorText = err.message || String(err);
        console.warn(`Model ${model} request threw error:`, err);
      }
    }

    if (!response || !response.ok) {
      console.error("All Gemini API models failed. Last error:", errorText);
      return NextResponse.json(
        { success: false, reason: "api_error", message: errorText },
        { status: 502 }
      );
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!generatedText) {
      return NextResponse.json(
        { success: false, reason: "empty_response" },
        { status: 500 }
      );
    }

    const parsedData = JSON.parse(generatedText.trim());

    return NextResponse.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error("Unseen generation handler error:", error);
    return NextResponse.json(
      { success: false, reason: "exception", message: error.message },
      { status: 500 }
    );
  }
}
