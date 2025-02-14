import { NextRequest, NextResponse } from "next/server";

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
    const base64Audio = Buffer.from(audioBuffer).toString("base64");
    console.log("Audio Base64:", base64Audio);
    const resp = await response.json();
    console.log(resp.body);

    return NextResponse.json({
      success: true,
      url: `data:audio/mpeg;base64,${base64Audio}`,
    });
  } catch (error) {
    console.error("Text-to-speech error:", error);
    return NextResponse.json(
      { error: "Failed to generate speech", details: error.message },
      { status: 500 },
    );
  }
}
