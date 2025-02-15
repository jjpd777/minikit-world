
import { NextRequest, NextResponse } from 'next/server';
import { bucket } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    
    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await audioFile.arrayBuffer());
    const fileName = `worldApp/audioGen/${Date.now()}_${audioFile.name}`;
    const file = bucket.file(fileName);
    
    await file.save(buffer, {
      metadata: {
        contentType: audioFile.type,
      },
    });

    const gsPath = `gs://${bucket.name}/${fileName}`;
    
    return NextResponse.json({ success: true, gsPath });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
