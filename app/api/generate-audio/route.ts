
import { NextRequest, NextResponse } from 'next/server';
import { storage, bucket } from '@/lib/firebase';

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();
    
    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const response = await fetch(
      'https://api.elevenlabs.io/v1/text-to-speech/l1zE9xgNpUTaQCZzpNJa',
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': process.env.ELEVEN_LABS_KEY || '',
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.3,
            similarity_boost: 0.85,
            style: 0.2,
          }
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to generate audio: ${response.status}`);
    }

    // Get audio buffer and create a unique filename
    const audioBuffer = await response.arrayBuffer();
    const userAddress = request.headers.get('x-user-address') || 'anonymous';
    const filename = `worldApp/audioGen/${userAddress}-${Date.now()}.mp3`;
    
    // Upload to Firebase Storage
    const file = bucket.file(filename);
    await file.save(Buffer.from(audioBuffer), {
      metadata: {
        contentType: 'audio/mpeg',
      },
    });

    // Get the public URL
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: '03-01-2500', // Long expiration
    });

    return NextResponse.json({ url });
  } catch (error) {
    console.error('Error generating audio:', error);
    return NextResponse.json(
      { error: 'Failed to generate audio' },
      { status: 500 }
    );
  }
}
