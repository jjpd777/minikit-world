
import { NextRequest, NextResponse } from "next/server";
import { bucket } from "@/lib/firebase-admin";

export async function GET() {
  try {
    const sourcePath = 'public/audio_sample.mp3';
    const destinationPath = 'worldApp/Winners/audio_sample.mp3';
    
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

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    if (!file) {
      throw new Error('No file provided');
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const destinationPath = `worldApp/NewAudio/${Date.now()}.mp3`;
    
    await bucket.file(destinationPath).save(buffer, {
      contentType: file.type,
    });

    const gsPath = `gs://${bucket.name}/${destinationPath}`;
    
    return NextResponse.json({ success: true, gsPath });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
