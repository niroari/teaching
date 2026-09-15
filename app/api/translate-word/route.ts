import { NextResponse } from "next/server";

interface TranslationResult {
  english: string;
  hebrew: string;
  partOfSpeech: "noun" | "verb" | "adjective" | "adverb";
  example: string;
}

// In-memory server-side cache for high performance and zero-quota lookups
const serverTranslationCache = new Map<string, TranslationResult>();

async function translateWithFreeFallback(word: string): Promise<string | null> {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=iw&dt=t&q=${encodeURIComponent(word)}`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
      }
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && Array.isArray(data[0])) {
        const fullTranslation = data[0]
          .map((item: any) => (Array.isArray(item) && item[0] ? item[0] : ""))
          .join("")
          .trim();
        if (fullTranslation) {
          return fullTranslation;
        }
      }
    }
  } catch (err) {
    console.warn("Free translation fallback error:", err);
  }
  return null;
}

export async function POST(request: Request) {
  try {
    const { word } = await request.json();

    if (!word || typeof word !== "string" || !word.trim()) {
      return NextResponse.json(
        { success: false, reason: "missing_word" },
        { status: 400 }
      );
    }

    const cleanWord = word.trim().toLowerCase();

    // 1. Check in-memory server cache first
    if (serverTranslationCache.has(cleanWord)) {
      return NextResponse.json({
        success: true,
        data: serverTranslationCache.get(cleanWord),
        cached: true
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // 2. If Gemini API key is missing, immediately try free fallback
    if (!apiKey) {
      const fallbackHebrew = await translateWithFreeFallback(cleanWord);
      if (fallbackHebrew) {
        const fallbackResult: TranslationResult = {
          english: cleanWord,
          hebrew: fallbackHebrew,
          partOfSpeech: "noun",
          example: `The word "${cleanWord}" is used in the text.`
        };
        serverTranslationCache.set(cleanWord, fallbackResult);
        return NextResponse.json({ success: true, data: fallbackResult });
      }

      return NextResponse.json(
        { success: false, reason: "missing_api_key" },
        { status: 400 }
      );
    }

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

    const modelsToTry = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash", "gemini-2.5-flash-lite"];
    let response: Response | null = null;
    let errorText = "";

    for (const model of modelsToTry) {
      try {
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
          // If rate limit / quota is exhausted (429), stop looping through other models under the same project
          if (res.status === 429) {
            break;
          }
        }
      } catch (err: any) {
        errorText = err.message || String(err);
        console.warn(`Model ${model} request threw error:`, err);
      }
    }

    // 3. If Gemini failed or was rate-limited, fall back to free translator
    if (!response || !response.ok) {
      console.warn("Gemini API call failed, attempting free fallback. Last error:", errorText);
      const fallbackHebrew = await translateWithFreeFallback(cleanWord);
      if (fallbackHebrew) {
        const fallbackResult: TranslationResult = {
          english: cleanWord,
          hebrew: fallbackHebrew,
          partOfSpeech: "noun",
          example: `The word "${cleanWord}" is used in the text.`
        };
        serverTranslationCache.set(cleanWord, fallbackResult);
        return NextResponse.json({ success: true, data: fallbackResult, fallback: true });
      }

      console.error("Both Gemini and fallback translation failed. Error:", errorText);
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
      // Try fallback if Gemini returned empty text
      const fallbackHebrew = await translateWithFreeFallback(cleanWord);
      if (fallbackHebrew) {
        const fallbackResult: TranslationResult = {
          english: cleanWord,
          hebrew: fallbackHebrew,
          partOfSpeech: "noun",
          example: `The word "${cleanWord}" is used in the text.`
        };
        serverTranslationCache.set(cleanWord, fallbackResult);
        return NextResponse.json({ success: true, data: fallbackResult, fallback: true });
      }

      return NextResponse.json(
        { success: false, reason: "empty_response" },
        { status: 500 }
      );
    }

    const parsedData = JSON.parse(generatedText.trim()) as TranslationResult;

    // Save to in-memory cache
    serverTranslationCache.set(cleanWord, parsedData);

    return NextResponse.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error("Word translation handler error:", error);

    return NextResponse.json(
      { success: false, reason: "exception", message: error.message },
      { status: 500 }
    );
  }
}
