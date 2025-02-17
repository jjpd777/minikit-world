
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch(
      'https://api.elevenlabs.io/v1/voices',
      {
        headers: {
          'Accept': 'application/json',
          'xi-api-key': process.env.ELEVEN_LABS_KEY || '',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch voices');
    }

    const voices = await response.json();
    return NextResponse.json(voices);
  } catch (error) {
    console.error('Error fetching voices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch voices' },
      { status: 500 }
    );
  }
}
