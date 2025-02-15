
import { NextResponse } from "next/server";
import { bucket } from "@/lib/firebase-admin";

export async function GET() {
  try {
    const [files] = await bucket.getFiles({
      prefix: 'worldApp/NewAudio/'
    });

    const audioFiles = await Promise.all(
      files.map(async (file) => {
        const [url] = await file.getSignedUrl({
          action: 'read',
          expires: Date.now() + 1000 * 60 * 60, // URL expires in 1 hour
        });

        return {
          name: file.name.replace('worldApp/NewAudio/', ''),
          url
        };
      })
    );

    return NextResponse.json({ success: true, files: audioFiles });
  } catch (error) {
    console.error('List audio error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
