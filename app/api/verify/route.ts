
import { verifyCloudProof, IVerifyResponse } from "@worldcoin/minikit-js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { payload, action, signal } = await req.json();
    const app_id = process.env.APP_ID;

    if (!app_id) {
      throw new Error('APP_ID environment variable is not set');
    }

    console.log('Verify endpoint - Received payload:', payload);
    console.log('Verify endpoint - App ID:', app_id);
    console.log('Verify endpoint - Action:', action);
    
    const verifyRes = await verifyCloudProof(
      payload,
      app_id as `app_${string}`,
      action,
      signal
    ) as IVerifyResponse;
    
    console.log('Verify endpoint - Verification response:', verifyRes);

    if (verifyRes.success) {
      return NextResponse.json({ verifyRes, status: 200 });
    } else {
      return NextResponse.json({ verifyRes, status: 400 });
    }
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json({ 
      error: error.message || 'Verification failed',
      status: 500 
    });
  }
}
