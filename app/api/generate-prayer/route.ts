
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { language, intentions } = await request.json();
    
    if (!intentions) {
      return NextResponse.json(
        { error: 'Prayer intentions are required' },
        { status: 400 }
      );
    }

    const languageMap: { [key: string]: string } = {
      en: 'English',
      es: 'Spanish',
      pt: 'Portuguese',
      fr: 'French',
      de: 'German',
      he: 'Hebrew',
    };

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a compassionate spiritual guide specializing in crafting meaningful prayers."
        },
        {
          role: "user",
          content: `Generate a heartfelt prayer in ${languageMap[language]} addressing the following intentions: ${intentions}. The prayer should be respectful, compassionate, and around 100-150 words.`
        }
      ],
      temperature: 0.7,
    });

    const prayer = completion.choices[0].message.content;
    
    if (!prayer) {
      throw new Error('No prayer was generated');
    }

    return NextResponse.json({ prayer });
  } catch (error) {
    console.error('Error generating prayer:', error);
    return NextResponse.json(
      { error: 'Failed to generate prayer' },
      { status: 500 }
    );
  }
}
