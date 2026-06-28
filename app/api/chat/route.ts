import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { character, studentName, messages, currentGuideStep, customCharacterName } = await request.json();

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
      case "custom":
        characterName = customCharacterName || "your companion";
        characterPersonalityPrompt = `You are the famous/known figure ${characterName} (celebrity, historical figure, fictional character, animal, or object). You must adopt their personality, knowledge, and typical mannerisms. IMPORTANT: Even if this person is naturally quiet, reserved, or cool in real life, you MUST override that trait and remain highly talkative, engaging, friendly, and supportive, ensuring you always ask follow-up questions or direct the student to complete their active stage tasks.`;
        break;
      default:
        characterName = "Sam";
        characterPersonalityPrompt = `You are Sam, a friendly, encouraging classmate. You love listening to music, playing sports like basketball/soccer, reading, and hanging out with friends. Talk about school or hobbies, and ask friendly questions to learn more about the student's day or favorite activities!`;
        break;
    }

    let stageGuidance = "";
    if (currentGuideStep === 1) {
      stageGuidance = "The student is introducing themselves. Greet them warmly, introduce yourself, and ask them for their age or where they live.";
    } else if (currentGuideStep === 2) {
      stageGuidance = "The student should share likes and dislikes. Share a quick detail about what you like (e.g. favorite food/music/sport as your character) and ask what they like.";
    } else if (currentGuideStep === 3) {
      stageGuidance = "The student should ask you questions. Encourage them to ask you questions about your life, work, or hobbies (e.g., 'What would you like to know about me?').";
    } else if (currentGuideStep === 4) {
      stageGuidance = "The student should share hobbies or routines. Share a quick detail about your routine and ask them about their hobbies or what they do after school.";
    } else if (currentGuideStep === 5) {
      stageGuidance = "Keep the conversation active and fun. Share a joke, a cool story, or react to their hobbies.";
    } else if (currentGuideStep === 6) {
      stageGuidance = "The student is wrapping up. Thank them, tell them they did a great job, and say goodbye.";
    }

    const systemPrompt = `You are the friendly AI companion named ${characterName}. You are currently chatting with a middle school student from Israel named ${studentName || "friend"}.

Your primary goal is to have a warm, natural, and engaging English conversation to help the student practice.

CONVERSATION GUIDELINES:
1. Language Level: Speak in simple, clear, and grammatically correct English suitable for middle school English learners (A2 level).
2. KEEP IT CONVERSATIONAL & SHORT: Keep your replies relatively short (around 2 to 4 sentences maximum) so it is easy for a child to read.
3. BE RESPONSIVE & NATURAL: First and foremost, answer any questions the student asks you, and react warmly to what they say (e.g. "Wow, that's awesome!", "Cool! I love that too!").
4. TALKATIVE OVERRIDE: Even if your character is naturally quiet or reserved in real life (like a rock star or athlete), you MUST be talkative, warm, and friendly to keep the chat going.
5. KEEP THE CHAT FLOWING: Always end your turn by asking the student a simple, friendly question, OR (if they are on the question-asking stage) prompting them to ask you a question.
6. STAGE GUIDANCE: ${stageGuidance} (Use this guidance as a suggestion or theme for your reply, but always make it blend naturally with the conversation).
7. ERROR HANDLING: Never point out grammar or spelling mistakes. If the student makes a mistake, model the correct version naturally.
8. HEBREW: If the student uses Hebrew, show you understand, but reply in English.
9. Vocabulary: You can occasionally add a brief Hebrew translation in parentheses for a new or advanced word (e.g. "I love performing (להופיע) on stage").

CHARACTER PERSONALITY:
- Name: ${characterName}
- Persona: ${characterPersonalityPrompt}
- Stay in character, use emojis occasionally, and maintain an encouraging attitude.

Format your output as a simple text response. Do not use markdown headers or bold symbols, just plain conversational text (e.g. emojis or italics are fine).`;

    // Map client-side message objects to Gemini REST API format
    // Client-side format: { sender: 'user'|'bot', text: string }
    // Gemini API format: { role: 'user'|'model', parts: [{ text: string }] }
    // Note: The Gemini API requires the multi-turn conversation history to start with a 'user' turn.
    // To achieve this cleanly and naturally, we skip the initial static bot greeting (the first message if from bot)
    // so that the conversation history sent to the API begins with the student's first message.
    const formattedContents: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }> = [];

    const historyMessages = (messages.length > 0 && messages[0].sender === "bot")
      ? messages.slice(1)
      : messages;

    historyMessages.forEach((msg: any) => {
      if (msg.text && msg.text.trim()) {
        formattedContents.push({
          role: msg.sender === "user" ? "user" : "model",
          parts: [{ text: msg.text }]
        });
      }
    });

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

    const modelsToTry = ["gemini-2.5-flash", "gemini-2.5-pro", "gemini-flash-latest", "gemini-pro-latest", "gemini-2.5-flash-lite"];
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
          const detail = await res.text();
          errorText += ` [${model} status ${res.status}: ${detail}]`;
          console.warn(`Model ${model} failed with status ${res.status}:`, detail);
        }
      } catch (err: any) {
        const detail = err.message || String(err);
        errorText += ` [${model} error: ${detail}]`;
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
    const parts = data.candidates?.[0]?.content?.parts;
    const generatedText = parts 
      ? parts.map((p: any) => p.text || "").join("").trim()
      : "";

    if (!generatedText) {
      console.warn("Gemini API returned an empty text candidate. Response:", JSON.stringify(data));
      return NextResponse.json(
        { success: false, reason: "empty_response" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, text: generatedText });
  } catch (error: any) {
    console.error("AI Chat handler error:", error);
    return NextResponse.json(
      { success: false, reason: "exception", message: error.message },
      { status: 500 }
    );
  }
}
