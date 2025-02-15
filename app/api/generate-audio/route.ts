
import { NextRequest, NextResponse } from 'next/server';
import { bucket } from "@/lib/firebase-admin";

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
      const errorText = await response.text();
      console.error('Error details:', errorText);
      throw new Error(`Failed to generate audio: ${response.status} - ${errorText}`);
    }

    const audioBuffer = await response.arrayBuffer();
    const timestamp = Date.now();
    const fileName = `worldApp/userGenerations/0x88-${timestamp}.mp3`;

    // Upload to Firebase Storage
    const file = bucket.file(fileName);
    await file.save(Buffer.from(audioBuffer), {
      contentType: 'audio/mpeg',
    });

    const gsPath = `gs://${bucket.name}/${fileName}`;

    return NextResponse.json({
      success: true,
      gsPath,
      audio: Buffer.from(audioBuffer).toString('base64'),
    });
  } catch (error) {
    console.error('Error generating audio:', error);
    return NextResponse.json(
      { error: 'Failed to generate audio' },
      { status: 500 }
    );
  }
}
