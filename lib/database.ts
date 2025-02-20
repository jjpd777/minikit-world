
import Client from '@replit/database';

const db = new Client();

export async function setValue(key: string, value: any) {
  try {
    await db.set(key, value);
    return true;
  } catch (error) {
    console.error('Error setting value:', error);
    return false;
  }
}

export async function getValue(key: string) {
  try {
    return await db.get(key);
  } catch (error) {
    console.error('Error getting value:', error);
    return null;
  }
}
