import { NextResponse } from "next/server";
import { checkAnswer, parseNumber } from "@/lib/mission/answer-key";
import { DESTINATIONS, type CheckId, type DestinationId } from "@/lib/data/mission-new-home";

const CHECK_IDS: CheckId[] = ["blank1", "blank2", "travel", "radio", "weight", "age"];

// Checks one numeric answer of "Mission: New Home" against the answer key,
// so the expected values never reach the student's browser.
export async function POST(request: Request) {
  let body: { destinationId?: string; checkId?: string; value?: string; age?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, reason: "bad_json" }, { status: 400 });
  }

  const destination = DESTINATIONS.find((d) => d.id === body.destinationId);
  const checkId = CHECK_IDS.find((c) => c === body.checkId);
  if (!destination || !checkId) {
    return NextResponse.json({ ok: false, reason: "unknown_question" }, { status: 400 });
  }

  const value = parseNumber(String(body.value ?? ""));
  if (value === null) {
    return NextResponse.json({ ok: true, correct: false, hint: "כתבו מספר (אפשר עם נקודה עשרונית)." });
  }

  let earthAge: number | undefined;
  if (checkId === "age") {
    const age = parseNumber(String(body.age ?? ""));
    if (age === null || age < 8 || age > 20) {
      return NextResponse.json({ ok: true, correct: false, hint: "כתבו קודם את הגיל שלכם בשנים של כדור הארץ." });
    }
    earthAge = age;
  }

  const result = checkAnswer(destination.id as DestinationId, checkId, value, earthAge);
  if (result.correct) {
    return NextResponse.json({ ok: true, correct: true, hint: "נכון! כל הכבוד." });
  }

  const hint =
    result.direction === "high"
      ? "התוצאה גבוהה מדי. בדקו את היחידות ואת דרך החישוב."
      : "התוצאה נמוכה מדי. בדקו את היחידות ואת דרך החישוב.";
  return NextResponse.json({ ok: true, correct: false, hint });
}
