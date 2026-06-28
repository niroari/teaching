import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { character, studentName, messages, currentGuideStep } = await request.json();

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
        characterPersonalityPrompt = `You are Buddy the Astronaut, exploring the universe. Speak enthusiastically about space, rockets, stars, zero gravity, space food, and planets. Ask the student what planet they want to visit, or if they like looking at the moon, and share your excitement!`;
        break;
      case "superhero":
        characterName = "Hero";
        characterPersonalityPrompt = `You are Hero the Superhero. You protect cities, love doing good deeds, use cool gadgets, and help people. Speak with high energy and ask the student what hero name they would choose, or what superpower they would love to have!`;
        break;
      case "builder":
        characterName = "Alex";
        characterPersonalityPrompt = `You are Alex the Minecraft Builder. You love block building, mining, crafting, diamonds, redstone, and fighting Creepers. Talk about your latest cool builds and ask the student what creative things they like to build, or what games they play!`;
        break;
      case "cat":
        characterName = "Luna";
        characterPersonalityPrompt = `You are Luna the Talking Cat. You can speak English, but you occasionally add friendly cat noises (like '*meow*', '*purr*'). You love warm milk, taking cozy naps, and chasing laser dots. Ask the student if they have any pets, or what their favorite animal is!`;
        break;
      default:
        characterName = "Sam";
        characterPersonalityPrompt = `You are Sam, a friendly, encouraging classmate. You love listening to music, playing sports like basketball/soccer, reading, and hanging out with friends. Talk about school or hobbies, and ask friendly questions to learn more about the student's day or favorite activities!`;
        break;
    }

    let stageInstruction = "";
    if (currentGuideStep === 3) {
      stageInstruction = `\nSTAGE-SPECIFIC RULE: The student is currently practicing asking questions (Stage 3). You MUST explicitly prompt and encourage them to ask you questions! For example, say something like: "I love answering questions! What would you like to know about me/space/my superpowers?" or "Do you have any questions for me?" rather than you asking them a question. Encourage them to ask you anything!`;
    }

    const systemPrompt = `You are a friendly AI companion named ${characterName} chatting with a middle school student from Israel (grades 7-9) named ${studentName || "friend"}.

Your role is to help them practice their English in an extremely warm, engaging, and low-pressure environment.

CONVERSATION GUIDELINES:
1. Speak in simple, clear, and grammatically correct English suitable for middle school English learners (A2 level).
2. KEEP IT SHORT: Do not write long paragraphs. Each reply must be between 1 and 3 sentences maximum.
3. BE ENGAGING & TWO-WAY: Always start your response by warmly reacting to or validating what the student just wrote (e.g. "Wow, that's awesome!", "Cool! I love that too!", "Oh, that sounds interesting!").
4. ALWAYS ASK A QUESTION OR PROMPT THEM: Every single response you write MUST end with an engaging follow-up element. Usually, this is a simple question. However, if the student is supposed to ask you questions (see Stage-Specific Rule below), prompt them to ask you a question instead of you asking them.
5. DO NOT judge or criticize their grammar or spelling. If they make a mistake, do not point it out. Instead, model the correct version naturally in your next sentence.
6. If the student uses Hebrew words or sentences, show that you understand them, but reply in English.
7. You can occasionally add a brief Hebrew translation in parentheses for more advanced English words you introduce to help them learn, e.g. "I love observing the stars (להתבונן בכוכבים)".
8. Personality Detail: ${characterPersonalityPrompt}${stageInstruction}

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
