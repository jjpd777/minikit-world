
import { NextRequest, NextResponse } from "next/server";
import { verifyCloudProof, IVerifyResponse, ISuccessResult } from "@worldcoin/minikit-js";

interface IRequestPayload {
  payload: ISuccessResult;
  action: string;
  signal: string;
}

export async function POST(req: NextRequest) {
  try {
    const { payload, action, signal } = (await req.json()) as IRequestPayload;
    const app_id = process.env.NEXT_PUBLIC_APP_ID as `app_${string}`;
    
    const verifyRes = await verifyCloudProof(payload, app_id, action, signal);

    if (verifyRes.success) {
      return NextResponse.json({ success: true, status: 200 });
    } else {
      return NextResponse.json({ 
        success: false,
        error: verifyRes.error || "Verification failed",
        status: 400 
      });
    }
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ 
      error: error.message || "Internal server error",
      status: 500 
    });
  }
}
