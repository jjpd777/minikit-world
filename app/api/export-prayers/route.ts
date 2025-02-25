
import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../lib/firebase-admin';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { addresses } = await request.json();
    
    if (!Array.isArray(addresses)) {
      return NextResponse.json({ error: 'Addresses must be an array' }, { status: 400 });
    }

    // Get all prayer events
    const snapshot = await db.collection('prayer_events').get();
    const events = snapshot.docs
      .map(doc => doc.data())
      .filter(event => addresses.includes(event.walletAddress))
      .sort((a, b) => a.unix_timestamp - b.unix_timestamp);

    // Create CSV content
    const headers = ['walletAddress', 'timestamp', 'religion', 'language', 'input_text'];
    const csvRows = [headers.join(',')];

    for (const event of events) {
      const row = headers.map(header => {
        const value = event[header]?.toString().replace(/"/g, '""') || '';
        return `"${value}"`;
      });
      csvRows.push(row.join(','));
    }

    const csv = csvRows.join('\n');
    
    // Write to temporary file
    const fileName = `prayer_events_${Date.now()}.csv`;
    const filePath = path.join('/tmp', fileName);
    await writeFile(filePath, csv);
    
    // Read and return file
    const fileBuffer = Buffer.from(csv);
    
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename=${fileName}`
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
