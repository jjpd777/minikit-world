import { NextRequest, NextResponse } from "next/server";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY environment variable");
}

export async function POST(request: NextRequest) {
  try {
    const { language, intentions } = await request.json();

    if (!intentions) {
      return NextResponse.json(
        { error: "Prayer intentions are required" },
        { status: 400 },
      );
    }

    const languageMap: { [key: string]: string } = {
      en: "English",
      es: "Spanish",
      pt: "Portuguese",
      fr: "French",
      de: "German",
      he: "Hebrew",
    };

    const prompt = `Generate a prayer in ${languageMap[language]} addressing the following intentions: ${intentions}.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              'Write a short Christian prayer (approximately 100 words) that begins with an emotionally impactful opening line reflecting the given instructions. The prayer should incorporate a relevant Bible verse within the prayer in a natural way, much like quoting a verse in an essay to support a point. The verse should be seamlessly connected to the prayer’s theme, reinforcing its message rather than feeling separate, and should be introduced the way a human would by saying something like "as you said in . . ." or "you told us . . .". The prayer should be warm, human, and uplifting—never robotic.',
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.9,
      }),
    });

    const data = await response.json();
    const prayer = data.choices?.[0]?.message?.content;

    if (!prayer) {
      throw new Error("No prayer was generated");
    }

    return NextResponse.json({ prayer });
  } catch (error) {
    console.error("Error generating prayer:", error);
    return NextResponse.json(
      { error: "Failed to generate prayer" },
      { status: 500 },
    );
  }
}
