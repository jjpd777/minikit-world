
import { NextRequest, NextResponse } from "next/server";
import { trackEvent } from '@/lib/mixpanel';

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY environment variable");
}

const languageMap: { [key: string]: string } = {
  en: "English",
  es: "Spanish",
  pt: "Portuguese",
  fr: "French",
  de: "German",
  he: "Hebrew",
};

const religionPrompts: { [key: string]: string } = {
  christian: 'Write a short Christian prayer (approximately 100 words) that begins with "Dear Lord" and reflects the given intentions. The prayer should incorporate relevant Bible verses naturally. The verse should be seamlessly connected to the prayer\'s theme. The prayer should be warm and uplifting, respecting Christian traditions.',
  jewish: 'Write a short Jewish prayer (approximately 100 words) that begins with "Baruch atah Adonai" and reflects the given intentions. The prayer should incorporate relevant Torah verses naturally. The verse should be seamlessly connected to the prayer\'s theme. The prayer should be warm and uplifting, respecting Jewish traditions.',
  buddhist: 'Write a short Buddhist prayer (approximately 100 words) that begins with "Namo tassa bhagavato arahato samma sambuddhassa" and reflects the given intentions. The prayer should incorporate relevant Buddhist teachings naturally. The teaching should be seamlessly connected to the prayer\'s theme. The prayer should be warm and uplifting, respecting Buddhist traditions.',
  hindu: 'Write a short Hindu prayer (approximately 100 words) that begins with "Om" and reflects the given intentions. The prayer should incorporate relevant Sanskrit verses or teachings from Hindu scriptures naturally. The teaching should be seamlessly connected to the prayer\'s theme. The prayer should be warm and uplifting, respecting Hindu traditions.',
  islamic: 'Write a short Islamic prayer (dua) (approximately 100 words) that begins with "Bismillah ir-Rahman ir-Rahim" and reflects the given intentions. The prayer should incorporate relevant Quranic verses or hadith naturally. The teaching should be seamlessly connected to the prayer\'s theme. The prayer should be warm and uplifting, respecting Islamic traditions.',
  sikh: 'Write a short Sikh prayer (approximately 100 words) that begins with "Waheguru Ji Ka Khalsa, Waheguru Ji Ki Fateh" and reflects the given intentions. The prayer should incorporate relevant teachings from the Guru Granth Sahib naturally. The teaching should be seamlessly connected to the prayer\'s theme. The prayer should be warm and uplifting, respecting Sikh traditions.',
  orthodox: 'Write a short Orthodox Christian prayer (approximately 100 words) that begins with "In the name of the Father, and of the Son, and of the Holy Spirit" and reflects the given intentions. The prayer should incorporate relevant Biblical or Patristic teachings naturally. The teaching should be seamlessly connected to the prayer\'s theme. The prayer should be warm and uplifting, respecting Orthodox traditions.',
  atheist: 'Write a short secular meditation (approximately 100 words) that reflects on the given intentions. The meditation should be contemplative and philosophical in nature, drawing from humanistic values and scientific understanding. It should be respectful, warm, and uplifting while maintaining a secular perspective.',
};

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const req = await request.json();
    const { language, intentions, religion } = req;

    if (!intentions) {
      return NextResponse.json(
        { error: "Prayer intentions are required" },
        { status: 400 },
      );
    }

    const prompt = `Generate a prayer addressing the following intentions: ${intentions}. ${
      language === 'hi' ? 'The prayer MUST be written in Hindi (Devanagari script).' :
      language === 'ar' ? 'The prayer MUST be written in Arabic script.' :
      language === 'id' ? 'The prayer MUST be written in Indonesian (Bahasa Indonesia).' :
      language === 'tr' ? 'The prayer MUST be written in Turkish.' :
      `The prayer should be in ${languageMap[language] || "English"}.`
    }`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4-mini",
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

    if (!response.ok) {
      const error = await response.json();
      console.error("OpenAI API error:", error);
      trackEvent('Prayer Generation Error', {
        error: error,
        intentions,
        language,
        religion,
        status: response.status
      });
      return NextResponse.json(
        { error: "Failed to generate prayer" },
        { status: response.status },
      );
    }

    const data = await response.json();
    const prayer = data.choices?.[0]?.message?.content;

    if (!prayer) {
      trackEvent('Prayer Generation Error', {
        error: 'No prayer content in response',
        intentions,
        language,
        religion
      });
      return NextResponse.json(
        { error: "No prayer was generated" },
        { status: 500 },
      );
    }

    // Track successful generation
    trackEvent('Prayer Generation Success', {
      language,
      religion,
      response_time: Date.now() - startTime,
      prayer_length: prayer.length
    });

    return NextResponse.json({ prayer });
  } catch (error) {
    console.error("Error generating prayer:", error);
    trackEvent('Prayer Generation Error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json(
      { error: "Failed to generate prayer" },
      { status: 500 },
    );
  }
}
