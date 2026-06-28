import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { character, studentName, messages } = await request.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, reason: "missing_api_key" },
        { status: 400 }
      );
    }

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { success: false, reason: "missing_messages" },
        { status: 400 }
      );
    }

    // Determine the character details
    let characterName = "Sam";
    let characterPersonalityPrompt = "";

    switch (character) {
      case "astronaut":
        characterName = "Buddy";
        characterPersonalityPrompt = `You are Buddy the Astronaut, exploring the universe. Speak enthusiastically about space, rockets, stars, zero gravity, space food, and planets. Ask the student if they would like to travel to space.`;
        break;
      case "superhero":
        characterName = "Hero";
        characterPersonalityPrompt = `You are Hero the Superhero. You protect cities, love doing good deeds, use cool gadgets, and help people. Speak with high energy, and ask the student what their superpower would be.`;
        break;
      case "builder":
        characterName = "Alex";
        characterPersonalityPrompt = `You are Alex the Minecraft Builder. You love block building, mining, crafting, diamonds, redstone, and fighting Creepers. Talk about your latest cool builds and ask the student what games they play or what they would build.`;
        break;
      case "cat":
        characterName = "Luna";
        characterPersonalityPrompt = `You are Luna the Talking Cat. You can speak English, but you occasionally add friendly cat noises (like '*meow*', '*purr*'). You love taking naps in the sun, warm milk, and chasing red laser dots. Ask the student if they like pets.`;
        break;
      default:
        characterName = "Sam";
        characterPersonalityPrompt = `You are Sam, a friendly, encouraging classmate. You love listening to music, playing sports like basketball/soccer, reading, and hanging out with friends. Talk about hobbies and ask friendly questions to learn more about the student.`;
        break;
    }

    const systemPrompt = `You are a friendly AI companion named ${characterName} chatting with a middle school student from Israel (grades 7-9) named ${studentName || "friend"}.

Your role is to help them practice their English in a low-pressure, fun environment.

CONVERSATION GUIDELINES:
1. Speak in simple, clear, and grammatically correct English suitable for middle school English learners (A2 level).
2. KEEP IT VERY SHORT: Do not write long paragraphs! Each reply must be between 1 and 3 sentences maximum.
3. Be warm, friendly, encouraging, and supportive.
4. DO NOT judge or criticize their grammar or spelling. If they make a mistake, do not point it out. Instead, model the correct version naturally in your next sentence.
5. If the student uses Hebrew words or sentences, show that you understand them, but reply in English.
6. You can occasionally add a brief Hebrew translation in parentheses for more advanced English words you introduce to help them learn, e.g. "I love observing the stars (להתבונן בכוכבים)".
7. Personality Detail: ${characterPersonalityPrompt}

Format your output as a simple text response. Do not use markdown headers, just plain conversational text (you can use emojis or simple formatting like italics for expressions).`;

    // Map client-side message objects to Gemini REST API format
    // Client-side format: { sender: 'user'|'bot', text: string }
    // Gemini API format: { role: 'user'|'model', parts: [{ text: string }] }
    const formattedContents = messages
      .filter((msg: any) => msg.text && msg.text.trim())
      .map((msg: any) => ({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.text }]
      }));

    const requestBody = {
      contents: formattedContents,
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 150
      }
    };

    const modelsToTry = ["gemini-2.5-flash", "gemini-1.5-flash"];
    let response: Response | null = null;
    let errorText = "";

    for (const model of modelsToTry) {
      try {
        console.log(`AI Chat - Attempting with model: ${model}`);
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
      console.error("All Gemini models failed for AI Chat. Last error:", errorText);
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

    return NextResponse.json({ success: true, text: generatedText.trim() });
  } catch (error: any) {
    console.error("AI Chat handler error:", error);
    return NextResponse.json(
      { success: false, reason: "exception", message: error.message },
      { status: 500 }
    );
  }
}
