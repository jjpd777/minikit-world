
import { NextResponse } from 'next/server';
import { db } from '../../../lib/firebase-admin';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const selectedAddress = searchParams.get('address');
    
    if (selectedAddress) {
      const eventsSnapshot = await db.collection('prayer_events')
        .where('walletAddress', '==', selectedAddress)
        .get();
      
      const events = eventsSnapshot.docs
        .map(doc => doc.data())
        .sort((a, b) => a.unix_timestamp - b.unix_timestamp)
        .map(data => ({
          timestamp: data.timestamp,
          religion: data.religion,
          language: data.language
        }));
      return NextResponse.json({ events });
    }
    
    const snapshot = await db.collection('prayer_events').get();
    const addressCounts = new Map<string, number>();
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.walletAddress) {
        const count = addressCounts.get(data.walletAddress) || 0;
        addressCounts.set(data.walletAddress, count + 1);
      }
    });
    
    const sortedAddresses = Array.from(addressCounts.entries())
      .map(([address, count]) => ({ address, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 100);
    
    return NextResponse.json({
      topAddresses: sortedAddresses,
      totalUniqueAddresses: addressCounts.size
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
