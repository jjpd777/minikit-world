
import { NextResponse } from "next/server";
import { bucket } from "@/lib/firebase-admin";

export async function GET() {
  try {
    const destinationPath = 'worldApp/NewAudio/audio_sample.mp3';
    const sourcePath = 'public/audio_sample.mp3';
    
    await bucket.upload(sourcePath, {
      destination: destinationPath,
    });

    const gsPath = `gs://${bucket.name}/${destinationPath}`;
    
    return NextResponse.json({ success: true, gsPath });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
