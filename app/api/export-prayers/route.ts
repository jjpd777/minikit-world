
import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const { addresses } = await request.json();
    
    if (!Array.isArray(addresses)) {
      return NextResponse.json({ error: 'Addresses must be an array' }, { status: 400 });
    }

    const collections = ['prayer_events', 'prayer_events_whatsapp', 'prayer_events_voicegen'];
    let allEvents = [];

    for (const collection of collections) {
      const snapshot = await db.collection(collection)
        .where('walletAddress', 'in', addresses)
        .get();

      const events = snapshot.docs.map(doc => ({
        ...doc.data(),
        source: collection
      }));
      
      allEvents = allEvents.concat(events);
    }

    // Sort by timestamp
    allEvents.sort((a, b) => a.unix_timestamp - b.unix_timestamp);

    // Convert to CSV
    const headers = ['walletAddress', 'timestamp', 'religion', 'language', 'input_text', 'source'];
    const csvRows = [headers.join(',')];

    for (const event of allEvents) {
      const row = headers.map(header => {
        const value = event[header]?.toString().replace(/"/g, '""') || '';
        return `"${value}"`;
      });
      csvRows.push(row.join(','));
    }

    const csv = csvRows.join('\n');
    
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename=prayer_events.csv'
      }
    });

  } catch (error) {
    console.error('Error exporting prayer data:', error);
    return NextResponse.json(
      { error: 'Failed to export prayer data' },
      { status: 500 }
    );
  }
}
