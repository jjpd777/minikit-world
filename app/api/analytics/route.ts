
import { NextResponse } from 'next/server';
import { db } from '../../../lib/firebase-admin';

export async function GET() {
  try {
    const snapshot = await db.collection('prayer_events_whatsapp').get();
    const addresses = new Map<string, number>();

    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.walletAddress) {
        addresses.set(
          data.walletAddress,
          (addresses.get(data.walletAddress) || 0) + 1
        );
      }
    });

    return NextResponse.json({
      totalUniqueAddresses: addresses.size,
      addressCounts: Object.fromEntries(addresses)
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
