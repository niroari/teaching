import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { word } = await request.json();

    if (!word || typeof word !== "string" || !word.trim()) {
      return NextResponse.json(
        { success: false, reason: "missing_word" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, reason: "missing_api_key" },
        { status: 400 }
      );
    }

    const cleanWord = word.trim().toLowerCase();

    const systemPrompt = `You are an expert English-Hebrew translator and English teacher. Translate the given English word into Hebrew.
You must return a raw JSON object matching the following TypeScript schema exactly:
{
  "english": "the english word in lowercase",
  "hebrew": "the translated Hebrew definition/translation (natural, accurate, comma-separated if multiple meanings)",
  "partOfSpeech": "noun" | "verb" | "adjective" | "adverb",
  "example": "A short, simple example sentence in English showing the word in context."
}

Word to translate: "${cleanWord}"

CRITICAL RULES:
1. Return ONLY the raw JSON object. Do not include markdown code block syntax (like \`\`\`json) in the response.
2. The Hebrew translation must be in correct Hebrew, natural-sounding, and easy for students to read.
3. The partOfSpeech MUST be strictly one of: "noun", "verb", "adjective", "adverb".
4. The example sentence must use simple vocabulary suitable for English learners.`;

    const requestBody = {
      contents: [
        {
          parts: [{ text: systemPrompt }]
        }
      ],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.3
      }
    };

    const modelsToTry = ["gemini-2.5-flash", "gemini-2.5-pro", "gemini-flash-latest", "gemini-pro-latest", "gemini-2.5-flash-lite"];
    let response: Response | null = null;
    let errorText = "";

    for (const model of modelsToTry) {
      try {
        console.log(`Attempting word translation with model: ${model}`);
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
    const parts = data.candidates?.[0]?.content?.parts;
    const generatedText = parts 
      ? parts.map((p: any) => p.text || "").join("").trim()
      : "";

    if (!generatedText) {
      console.warn("Gemini API returned an empty text candidate for translation. Response:", JSON.stringify(data));
      return NextResponse.json(
        { success: false, reason: "empty_response" },
        { status: 500 }
      );
    }

    const parsedData = JSON.parse(generatedText.trim());

    return NextResponse.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error("Word translation handler error:", error);
    return NextResponse.json(
      { success: false, reason: "exception", message: error.message },
      { status: 500 }
    );
  }
}
