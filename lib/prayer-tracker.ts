
import { Client } from '@replit/database';

const db = new Client();

interface PrayerTrack {
  walletAddress: string;
  unix_timestamp: number;
  timestamp: string;
  input_text: string;
  religion: string;
  language: string;
}

export async function trackPrayer(data: PrayerTrack) {
  try {
    const prayers = await db.get('prayers') || [];
    prayers.push(data);
    await db.set('prayers', prayers);
    return true;
  } catch (error) {
    console.error('Error tracking prayer:', error);
    return false;
  }
}

export async function getPrayers() {
  try {
    return await db.get('prayers') || [];
  } catch (error) {
    console.error('Error getting prayers:', error);
    return [];
  }
}
