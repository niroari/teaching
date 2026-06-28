import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { taskType, prompt, text } = await request.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, reason: "missing_api_key" },
        { status: 400 }
      );
    }

    if (!text || !text.trim()) {
      return NextResponse.json(
        { success: false, reason: "missing_text" },
        { status: 400 }
      );
    }

    const systemPrompt = `You are an expert English teacher. Evaluate the following student's English writing assignment.

Task Details:
- Task Type: ${taskType === "letter" ? "Letter Writing (כתיבת מכתב)" : "Opinion Essay/Paragraph Writing (חיבור דעה/פסקה)"}
- Prompt/Topic: ${prompt}
- Student's Submission:
"${text}"

Your evaluation must follow these guidelines:
1. Grade the writing out of 100. Be encouraging but pedagogically accurate.
2. Check the structural format:
   - For a Letter ("letter"): Check if they included a salutation (e.g. "Dear ...,"), introductory greeting, organized body paragraphs, a closing (e.g. "Sincerely,", "Best wishes,", "Regards,"), and a signature name. Provide details in Hebrew explaining if they met the structure or what was missing.
   - For an Essay/Paragraph ("essay"): Check if they structured it with a clear topic sentence, supporting ideas with logical transitions/connectors, and a concluding sentence. Provide details in Hebrew.
3. List spelling and grammar mistakes. For each mistake, extract the exact original text, provide the correction, and write a clear, brief explanation in HEBREW explaining the mistake.
4. Rewrite the student's text into a beautiful, natural, and correct version in native English. Keep it at a level suitable for a school student to learn from (don't make it overly complex or academic, just grammatically perfect and natural).

You must return a raw JSON object matching the following TypeScript schema exactly:
{
  "score": number,
  "structureFeedback": {
    "passed": boolean,
    "details": "Hebrew feedback explanation regarding the layout, parts, and paragraphs."
  },
  "grammarFeedback": "Hebrew overall summary of spelling and grammar issues.",
  "corrections": [
    {
      "original": "incorrect phrase or word from the user's text",
      "corrected": "the corrected spelling or grammar correction",
      "explanation": "Brief Hebrew explanation of why it is incorrect and what the rule is"
    }
  ],
  "improvedVersion": "The fully polished version of the student's text in correct, natural English."
}

CRITICAL RULES:
1. All general feedbacks, checklists, and error explanations MUST be in correct, natural, friendly Hebrew, while keeping the original/corrected snippets and the improvedVersion in English.
2. If there are no grammar mistakes, the corrections array should be empty [].
3. Do not include markdown code block syntax (like \`\`\`json) in the response. Return only the JSON object.`;

    const requestBody = {
      contents: [
        {
          parts: [{ text: systemPrompt }]
        }
      ],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.2
      }
    };

    const modelsToTry = ["gemini-2.5-flash", "gemini-1.5-flash"];
    let response: Response | null = null;
    let errorText = "";

    for (const model of modelsToTry) {
      try {
        console.log(`Writing evaluation - Attempting with model: ${model}`);
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
        console.warn(`Model ${model} threw error:`, err);
      }
    }

    if (!response || !response.ok) {
      console.error("All Gemini models failed for writing evaluation. Last error:", errorText);
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
      console.warn("Gemini API returned an empty text candidate for writing evaluation. Response:", JSON.stringify(data));
      return NextResponse.json(
        { success: false, reason: "empty_response" },
        { status: 500 }
      );
    }

    const parsedData = JSON.parse(generatedText.trim());
    return NextResponse.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error("Writing evaluation handler error:", error);
    return NextResponse.json(
      { success: false, reason: "exception", message: error.message },
      { status: 500 }
    );
  }
}
