
import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const eventData = {
      walletAddress: data.walletAddress || '',
      unix_timestamp: Date.now(),
      timestamp: new Date().toISOString(),
      input_text: data.input_text || '',
      religion: data.religion || '',
      language: data.language || '',
      source: data.source || 'prayer'
    };

    const collection = data.source === 'whatsapp' ? 'prayer_events_whatsapp' : 'prayer_events';
    await db.collection(collection).add(eventData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking prayer event:', error);
    return NextResponse.json(
      { error: 'Failed to track prayer event' },
      { status: 500 }
    );
  }
}
