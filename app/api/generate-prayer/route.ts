
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { language, intentions } = await request.json();

    const languageMap: { [key: string]: string } = {
      en: 'English',
      es: 'Spanish',
      pt: 'Portuguese',
      fr: 'French',
      de: 'German',
      he: 'Hebrew',
    };

    const prompt = `Generate a heartfelt prayer in ${languageMap[language]} addressing the following intentions: ${intentions}. The prayer should be respectful, compassionate, and around 100-150 words.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a compassionate spiritual guide specializing in crafting meaningful prayers."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
    });

    const prayer = completion.choices[0].message.content;

    return NextResponse.json({ prayer });
  } catch (error) {
    console.error('Error generating prayer:', error);
    return NextResponse.json(
      { error: 'Failed to generate prayer' },
      { status: 500 }
    );
  }
}
