
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
    
    console.log("Verification attempt with:", {
      app_id,
      action,
      signal,
      payload_summary: {
        merkle_root: payload.merkle_root,
        nullifier_hash: payload.nullifier_hash,
        verification_level: payload.verification_level
      }
    });
    
    const verifyRes = await verifyCloudProof(payload, app_id, action, signal);
    console.log("VerifyRes from WorldCoin:", verifyRes);

    if (verifyRes.success) {
      console.log("Verification successful!");
      return NextResponse.json({ verifyRes });
    } else {
      console.log("Verification failed:", verifyRes);
      return NextResponse.json({ verifyRes });
    }
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ 
      error: error.message || "Internal server error",
      status: 500 
    });
  }
}
