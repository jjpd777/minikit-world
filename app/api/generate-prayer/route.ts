import { NextRequest, NextResponse } from "next/server";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY environment variable");
}

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();
    const { language, intentions, religion } = req;

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

    const religionPrompts = {
      christian: 'Write a short Christian prayer (approximately 90 words) that is deeply personal, addressing the user’s specific instructions, not being overly generic or robotic. The prayer should incorporate one relevant Bible verse. Ensure the prayer has a smooth, natural rhythm, avoiding abrupt transitions. The phrasing should feel gentle, and uplifting. The first sentence must explicitly mention the topic given in the instructions in an emotionally impactful way to immediately establish personalized relevance. The verse should strengthen the message rather than become the focus. ',
      jewish: 'Write a short Jewish prayer (approximately 90 words) that is deeply personal, addressing the user’s specific instructions, not being overly generic or robotic. The prayer should incorporate one relevant Torah verse. Ensure the prayer has a smooth, natural rhythm, avoiding abrupt transitions. The phrasing should feel gentle, and uplifting. The first sentence must explicitly mention the topic given in the instructions in an emotionally impactful way to immediately establish personalized relevance. The verse should strengthen the message rather than become the focus. ',
      islamic: 'Write a short Muslim prayer (approximately 90 words) that is deeply personal, addressing the user’s specific instructions, not being overly generic or robotic. The prayer should incorporate one relevant and inspiring Quran/Hadith verse. Ensure the prayer has a smooth, natural rhythm, avoiding abrupt transitions. The phrasing should feel gentle, and uplifting. The first sentence must explicitly mention the topic given in the instructions in an emotionally impactful way to immediately establish personalized relevance. The verse should strengthen the message rather than become the focus. ',
      buddhist: 'Write a short Buddhist meditation or prayer (approximately 100 words) that begins with an emotionally impactful opening line reflecting the given intentions. The prayer should incorporate relevant Sutra or quote from the Budha himself. The teaching should be seamlessly connected to the prayer\'s theme. The prayer should be warm and uplifting, respecting Buddhist traditions.'
    };

    const prompt = `Generate a prayer in ${languageMap[language] || "English"} addressing the following intentions: ${intentions}.`;

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
            content: religionPrompts[religion] || religionPrompts.christian,
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