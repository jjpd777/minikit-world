
import { NextRequest, NextResponse } from 'next/server';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

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

    const prompt = `Generate a heartfelt prayer in ${languageMap[language]} addressing the following intentions: ${intentions}. The prayer should be respectful and compassionate.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant that writes Christian prayers. Make it 200 words MAX." },
          { role: "user", content: prompt }
        ],
        temperature: 0.9
      })
    });

    const data = await response.json();
    const prayer = data.choices?.[0]?.message?.content;

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
