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

    // Call the ElevenLabs API
    console.log("Making API request to ElevenLabs with text:", text);
    const response = await fetch(
      "https://0cb3df08-f19f-4e55-add7-4513e781f46c-00-2lvwkm65uqcmj.spock.replit.dev/api/text-to-speech",
      {
        method: "POST",
        headers: {
          Accept: "audio/mpeg",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          walletAddress: "0x7777",
        }),
      },
    );

    console.log("API Response Status:", response);
    console.log(
      "API Response Headers:",
      Object.fromEntries(response.headers.entries()),
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const audioBuffer = await response.arrayBuffer();
    const filename = `audio-${Date.now()}.mp3`;
    const file = bucket.file(filename);
    
    try {
      await file.save(Buffer.from(audioBuffer));
      const [url] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + 15 * 60 * 1000 // URL expires in 15 minutes
      });
      
      return NextResponse.json({
        success: true,
        url
      });
    } catch (error) {
      console.error('Firebase upload error:', error);
      return NextResponse.json(
        { error: "Failed to upload audio", details: error.message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Text-to-speech error:", error);
    return NextResponse.json(
      { error: "Failed to generate speech", details: error.message },
      { status: 500 },
    );
  }
}
