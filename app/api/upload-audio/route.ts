
import { NextRequest, NextResponse } from 'next/server';
import { bucket } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const filename = url.searchParams.get('file');

    if (filename) {
      const file = bucket.file(filename);
      const [exists] = await file.exists();
      
      if (!exists) {
        return NextResponse.json({ error: 'File not found' }, { status: 404 });
      }

      const [buffer] = await file.download();
      return new NextResponse(buffer, {
        headers: { 'Content-Type': 'audio/mpeg' }
      });
    }

    const [files] = await bucket.getFiles({
      prefix: 'worldApp/NewAudio/'
    });

    const fileNames = files.map(file => file.name);
    return NextResponse.json({ success: true, files: fileNames });
  } catch (error) {
    console.error('Error listing files:', error);
    return NextResponse.json({ error: 'Failed to list files' }, { status: 500 });
  }
}

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
