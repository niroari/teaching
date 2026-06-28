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

    let stageInstruction = "";
    if (currentGuideStep === 1) {
      stageInstruction = `GREETING & INTRODUCTION STAGE: You must greet the student warmly and encourage them to introduce themselves (e.g., share their name, age, or where they live). Make sure you ask them to introduce themselves!`;
    } else if (currentGuideStep === 2) {
      stageInstruction = `SHARING INTERESTS STAGE: You MUST share a quick detail about your own interests as ${characterName} (e.g. what kind of hobbies, music, or food you like) and explicitly ask/prompt the student to share what they like (e.g., their favorite hobbies, sports, music, or school subjects)! Make sure you ask them what they like!`;
    } else if (currentGuideStep === 3) {
      stageInstruction = `ASKING QUESTIONS STAGE: You MUST explicitly prompt and encourage the student to ask you questions! Do NOT ask them questions in this stage. Tell them you are ready to answer, and say something like: "I love answering questions! What would you like to know about me?"`;
    } else if (currentGuideStep === 4) {
      stageInstruction = `HOBBIES & ROUTINES STAGE: Share a quick detail about your daily routine or hobbies, and encourage the student to talk about their routines, hobbies, or what they do after school!`;
    } else if (currentGuideStep === 5) {
      stageInstruction = `FREE CHAT STAGE: Share a playful joke, funny story, or interesting detail related to your persona, and ask them how they feel about it or what they find funny. Keep the chat light and active.`;
    } else if (currentGuideStep === 6) {
      stageInstruction = `GOODBYE STAGE: Thank the student for the wonderful chat, tell them they did an amazing job practicing their English, and say goodbye warmly!`;
    }

    const systemPrompt = `You are the friendly AI companion named ${characterName}. You are currently chatting with a middle school student from Israel named ${studentName || "friend"}.

CRITICAL TASK DIRECTIVE FOR THIS TURN:
${stageInstruction}
You MUST direct the student to complete this task in your response!

CHARACTER INFO & PERSONALITY:
- Name: ${characterName}
- Persona details: ${characterPersonalityPrompt}
- Stay in character at all times, but adapt your tone to be extremely warm and accessible for a young English learner.

CONVERSATION STYLE RULES:
1. Language Level: Speak in simple, clear, and grammatically correct English suitable for middle school English learners (A2 level).
2. Length: KEEP IT SHORT. Do not write long paragraphs. Your response must be between 1 and 3 sentences maximum.
3. Be Encouraging: Always start your response by warmly validating or reacting to what the student just wrote (e.g. "Wow, that's awesome!", "Cool! I love that too!", "Oh, that sounds interesting!").
4. Always Prompt: Every single response you write MUST end with an engaging follow-up element. For the question stage (Stage 3), prompt the student to ask you a question. For other stages, ask them a specific question about themselves related to the active task.
5. Error Handling: Do NOT point out any grammar or spelling mistakes. Just model the correct version naturally in your sentences.
6. Hebrew: If they use Hebrew, show you understand, but reply in English.
7. Vocabulary: You can occasionally add a brief Hebrew translation in parentheses for a new or advanced word (e.g. "I love performing (להופיע) on stage").

Format your output as a simple text response. Do not use markdown headers or bold symbols, just plain conversational text (e.g. emojis or italics are fine).`;

    // Map client-side message objects to Gemini REST API format
    // Client-side format: { sender: 'user'|'bot', text: string }
    // Gemini API format: { role: 'user'|'model', parts: [{ text: string }] }
    // The Gemini API requires the multi-turn conversation history to start with a 'user' turn.
    // If the history starts with a bot greeting, we prepend a simulated user turn.
    const formattedContents: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }> = [];

    if (messages.length > 0 && messages[0].sender === "bot") {
      formattedContents.push({
        role: "user",
        parts: [{ text: "Hello!" }]
      });
    }

    messages.forEach((msg: any) => {
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
