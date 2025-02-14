
import { NextRequest, NextResponse } from 'next/server';
import { bucket } from '@/lib/firebase';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('audio') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `worldApp/audioGen/user-${Date.now()}.mp3`;
    
    const bucketFile = bucket.file(filename);
    await bucketFile.save(buffer, {
      metadata: {
        contentType: 'audio/mpeg',
      },
    });

    const [url] = await bucketFile.getSignedUrl({
      action: 'read',
      expires: '03-01-2500',
    });

    return NextResponse.json({ url });
  } catch (error) {
    console.error('Error uploading to Firebase:', error);
    return NextResponse.json(
      { error: 'Failed to upload audio' },
      { status: 500 }
    );
  }
}
