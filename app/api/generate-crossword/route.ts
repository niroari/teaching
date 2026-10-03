import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { topic, grade, difficulty, customWords } = await request.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, reason: "missing_api_key", error: "Missing GEMINI_API_KEY environment variable" },
        { status: 400 }
      );
    }

    const resolvedTopic = topic && topic.trim() ? topic.trim() : "everyday school and life vocabulary";
    const resolvedGrade = grade && grade.trim() ? grade.trim() : "7th grade (middle school)";
    const resolvedDifficulty = difficulty || "Medium";

    let customPromptSection = "";
    if (customWords && Array.isArray(customWords) && customWords.length > 0) {
      const wordsList = customWords
        .map((w: string) => w.trim().toUpperCase().replace(/[^A-Z]/g, ""))
        .filter((w: string) => w.length >= 3 && w.length <= 9)
        .slice(0, 12);

      customPromptSection = `The teacher provided these specific target words: ${wordsList.join(", ")}.
You MUST use these provided words (select 7-10 of them). For each, generate an engaging English clue and an accurate Hebrew hint.`;
    } else {
      customPromptSection = `Generate 8 to 10 interesting vocabulary words related to the topic: "${resolvedTopic}".
Grade level: ${resolvedGrade}.
Difficulty: ${resolvedDifficulty}.
Each word must be between 3 and 9 letters long so it can fit on an 8x10 crossword grid.
Choose words with common vowels and intersecting letters (A, E, I, O, U, T, R, S, L, N).`;
    }

    const systemPrompt = `You are an expert English teacher designing vocabulary for a classroom crossword game.
${customPromptSection}

Requirements:
1. Return a JSON array of 7 to 10 objects matching this exact structure:
[
  {
    "word": "APPLE",
    "clue": "A round red or green fruit that grows on trees",
    "hebrewHint": "תפוח"
  }
]
2. Words must contain ONLY uppercase English letters (A-Z). No spaces, hyphens, or punctuation.
3. Clues must be in clear, level-appropriate English suitable for ${resolvedGrade}.
4. hebrewHint must be in natural, accurate Hebrew.
5. Return ONLY the JSON array, with no markdown code blocks or extra text.`;

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

    const modelsToTry = [
      "gemini-2.5-flash",
      "gemini-2.0-flash",
      "gemini-1.5-flash",
      "gemini-2.5-flash-lite"
    ];

    let response: Response | null = null;
    let errorText = "";

    for (const model of modelsToTry) {
      try {
        console.log(`Crossword generator attempting generation with model: ${model}`);
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
          console.warn(`Model ${model} failed with status: ${res.status}`, errorText);
        }
      } catch (err) {
        console.warn(`Error attempting model ${model}:`, err);
      }
    }

    if (!response || !response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: "All Gemini models failed to generate content",
          details: errorText
        },
        { status: 502 }
      );
    }

    const data = await response.json();
    const candidate = data.candidates?.[0];
    const text = candidate?.content?.parts?.[0]?.text;

    if (!text) {
      return NextResponse.json(
        { success: false, error: "Empty response from Gemini API" },
        { status: 500 }
      );
    }

    // Clean JSON response if wrapped in markdown
    let cleanedText = text.trim();
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    } else if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    const parsedWords = JSON.parse(cleanedText);

    if (!Array.isArray(parsedWords) || parsedWords.length === 0) {
      return NextResponse.json(
        { success: false, error: "Gemini did not return an array of words" },
        { status: 500 }
      );
    }

    // Sanitize output
    const sanitized = parsedWords
      .map((item: any) => ({
        word: String(item.word || "")
          .toUpperCase()
          .replace(/[^A-Z]/g, "")
          .trim(),
        clue: String(item.clue || "").trim(),
        hebrewHint: String(item.hebrewHint || "").trim()
      }))
      .filter(item => item.word.length >= 3 && item.word.length <= 9 && item.clue.length > 0);

    return NextResponse.json({
      success: true,
      topic: resolvedTopic,
      words: sanitized
    });
  } catch (error: any) {
    console.error("Crossword generation route error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate crossword" },
      { status: 500 }
    );
  }
}
