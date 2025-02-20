
import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from 'firebase-admin/database';
import '../../../lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const db = getDatabase();
    const prayerEventsRef = db.ref('prayer_events');
    
    const eventData = {
      walletAddress: data.walletAddress || '',
      unix_timestamp: Date.now(),
      timestamp: new Date().toISOString(),
      input_text: data.input_text || '',
      religion: data.religion || '',
      language: data.language || '',
    };

    await prayerEventsRef.push(eventData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking prayer event:', error);
    return NextResponse.json(
      { error: 'Failed to track prayer event' },
      { status: 500 }
    );
  }
}
