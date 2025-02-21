
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
    };

    // Track in both collections
    await Promise.all([
      db.collection('prayer_events').add(eventData),
      db.collection('prayer_events_whatsapp').add(eventData)
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking prayer event:', error);
    return NextResponse.json(
      { error: 'Failed to track prayer event' },
      { status: 500 }
    );
  }
}
