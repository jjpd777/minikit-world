
import { NextRequest, NextResponse } from "next/server";
import { bucket } from "@/lib/firebase-admin";

export async function GET() {
  try {
    const destinationPath = 'worldApp/NewAudio/audio_sample_88.mp3';
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

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    if (!file) {
      throw new Error('No file provided');
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const destinationPath = 'worldApp/NewAudio/' + file.name;
    
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
