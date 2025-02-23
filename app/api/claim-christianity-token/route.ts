
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const { walletAddress } = await request.json();

    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 });
    }

    // Record the claim in Firebase
    await db.collection('token_claims').add({
      walletAddress,
      tokenType: 'Christianity',
      timestamp: new Date(),
      emojisCollected: 22
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error claiming token:', error);
    return NextResponse.json(
      { error: 'Failed to claim token' },
      { status: 500 }
    );
  }
}
