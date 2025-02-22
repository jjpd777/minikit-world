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
      christian: 'Write a short Christian prayer (approximately 100 words) that begins with an emotionally impactful opening line reflecting the given intentions. The prayer should incorporate a relevant Bible verse within the prayer in a natural way, like quoting a verse in an essay. The verse should be seamlessly connected to the prayer\'s theme and introduced naturally. The prayer should be warm and uplifting.',
      orthodox: 'Write a short Orthodox Christian prayer (approximately 100 words) that begins with "Lord Jesus Christ, have mercy on us" and reflects the given intentions. The prayer should incorporate relevant teachings from the Church Fathers or Bible verses naturally. The teaching should be seamlessly connected to the prayer\'s theme. The prayer should be warm and uplifting, respecting Orthodox Christian traditions.',
      jewish: 'Write a short Jewish prayer (approximately 100 words) that begins with an emotionally impactful opening line reflecting the given intentions. The prayer should incorporate a relevant Torah verse or teaching within the prayer in a natural way. The teaching should be seamlessly connected to the prayer\'s theme. The prayer should be warm and uplifting, respecting Jewish traditions.',
      islamic: 'Write a short Islamic prayer (dua) (approximately 100 words) that begins with "Bismillah ir-Rahman ir-Rahim" and reflects the given intentions. The prayer should incorporate relevant Quranic verses or hadith naturally. The teaching should be seamlessly connected to the prayer\'s theme. The prayer should be warm and uplifting, respecting Islamic traditions.',
      sikh: 'Write a short Sikh prayer (approximately 100 words) that begins with "Waheguru Ji Ka Khalsa, Waheguru Ji Ki Fateh" and reflects the given intentions. The prayer should incorporate relevant teachings from the Guru Granth Sahib naturally. The teaching should be seamlessly connected to the prayer\'s theme. The prayer should be warm and uplifting, respecting Sikh traditions.',
      atheist: 'Write a short contemplative reflection (approximately 100 words) that begins with an emotionally impactful opening line reflecting the given intentions. The reflection should incorporate relevant philosophical or scientific wisdom. The teaching should be connected to the theme naturally. The reflection should be warm and uplifting, focusing on human potential and natural wonder.',
      hindu: 'Write a short Hindu prayer (approximately 100 words) that begins with "Om" and reflects the given intentions. The prayer should incorporate relevant verses from the Vedas, Upanishads, or Bhagavad Gita naturally. The teaching should be seamlessly connected to the prayer\'s theme. The prayer should be warm and uplifting, respecting Hindu traditions.',
      buddhist: 'Write a short Buddhist meditation or prayer (approximately 100 words) that begins with an emotionally impactful opening line reflecting the given intentions. The prayer should incorporate relevant Buddhist teachings or sutras naturally. The teaching should be seamlessly connected to the prayer\'s theme. The prayer should be warm and uplifting, respecting Buddhist traditions.'
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