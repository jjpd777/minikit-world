
import { getValue, setValue } from '@/lib/database';
import { NextResponse } from 'next/server';

export async function GET() {
  const data = await getValue('test-key');
  return NextResponse.json({ data });
}

export async function POST() {
  await setValue('test-key', 'test-value');
  return NextResponse.json({ success: true });
}
