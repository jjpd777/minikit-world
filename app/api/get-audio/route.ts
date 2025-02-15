
import { NextRequest, NextResponse } from 'next/server';
import { bucket } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const { gsPath } = await request.json();
    if (!gsPath) {
      return NextResponse.json({ error: 'No gsPath provided' }, { status: 400 });
    }

    // Extract filename from gsPath
    const filename = gsPath.split('/').pop();
    const file = bucket.file(filename);
    
    const [exists] = await file.exists();
    if (!exists) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const [audioBuffer] = await file.download();
    const base64Audio = audioBuffer.toString('base64');

    return NextResponse.json({ 
      success: true, 
      audio: base64Audio,
      contentType: 'audio/mpeg'
    });
  } catch (error) {
    console.error('Error fetching audio:', error);
    return NextResponse.json({ error: 'Failed to fetch audio' }, { status: 500 });
  }
}
