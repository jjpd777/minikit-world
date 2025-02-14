import { NextRequest, NextResponse } from "next/server";
import { bucket } from "@/lib/firebase-admin";

export async function POST(request: NextRequest) {
  try {
    const { text, walletAddress } = await request.json();

    if (!text || !walletAddress) {
      return NextResponse.json(
        { error: "Text and wallet address are required" },
        { status: 400 },
      );
    }

    const response = await fetch(
      "https://api.elevenlabs.io/v1/text-to-speech/l1zE9xgNpUTaQCZzpNJa",
      {
        method: "POST",
        headers: {
          Accept: "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": process.env.ELEVEN_LABS_KEY || "",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.3,
            similarity_boost: 0.85,
            style: 0.2,
          },
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("ElevenLabs API error:", errorText);
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const audioBuffer = await response.arrayBuffer();
    const timestamp = Date.now();
    const filename = `worldApp/audioGen/${walletAddress}${timestamp}.mp3`;
    const file = bucket.file(filename);

    await file.save(Buffer.from(audioBuffer), {
      metadata: {
        contentType: 'audio/mpeg',
        custom: {
          walletAddress,
          timestamp: Date.now().toString()
        }
      }
    });
    
    const [url] = await file.getSignedUrl({
      action: "read",
      expires: Date.now() + 24 * 60 * 60 * 1000, // URL expires in 24 hours
    });

    return NextResponse.json({
      success: true,
      url,
      storagePath: filename
    });
  } catch (error) {
    console.error("Text-to-speech error:", error);
    return NextResponse.json(
      { error: "Failed to generate speech", details: error.message },
      { status: 500 },
    );
  }
}