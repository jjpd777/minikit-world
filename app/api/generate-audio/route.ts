import { NextRequest, NextResponse } from 'next/server';

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
      console.error('ElevenLabs API Error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      return NextResponse.json(
        { success: false, error: `Failed to generate audio: ${response.status} - ${errorText}` },
        { status: response.status }
      );
    }

    const audioBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(audioBuffer).toString('base64');
    
    // Upload to Firebase Storage
    const timestamp = Date.now();
    const fileName = `worldApp/DEMO/${timestamp}.mp3`;
    const file = bucket.file(fileName);
    
    await file.save(Buffer.from(audioBuffer), {
      contentType: 'audio/mpeg',
    });

    const gsPath = `gs://${bucket.name}/${fileName}`;

    return NextResponse.json({
      success: true,
      audio: base64Audio,
      gsPath
    });
  } catch (error) {
    console.error('Error generating audio:', error);
    return NextResponse.json(
      { error: 'Failed to generate audio' },
      { status: 500 }
    );
  }
}