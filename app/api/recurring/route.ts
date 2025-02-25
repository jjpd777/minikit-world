
import { NextResponse } from 'next/server';
import { db } from '../../../lib/firebase-admin';

export async function GET(request: Request) {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const snapshot = await db.collection('prayer_events').get();
    
    // Create a map to store address counts
    const addressCounts = new Map<string, number>();
    
    // Count occurrences of each address
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.walletAddress) {
        const count = addressCounts.get(data.walletAddress) || 0;
        addressCounts.set(data.walletAddress, count + 1);
      }
    });
    
    // Convert to array and sort by count
    const sortedAddresses = Array.from(addressCounts.entries())
      .map(([address, count]) => ({ address, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 100); // Get top 100
    
    return NextResponse.json({
      topAddresses: sortedAddresses,
      totalUniqueAddresses: addressCounts.size
    });
  } catch (error) {
    console.error('Error fetching recurring users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recurring users' },
      { status: 500 }
    );
  }
}
