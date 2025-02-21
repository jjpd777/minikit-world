
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { walletAddress, timestamp, unix_timestamp } = data;

    await db.collection('gameplay_tracking').add({
      walletAddress,
      timestamp,
      unix_timestamp,
      created_at: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking gameplay:', error);
    return NextResponse.json(
      { error: 'Failed to track gameplay' },
      { status: 500 }
    );
  }
}
