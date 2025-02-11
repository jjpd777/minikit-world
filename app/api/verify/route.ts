
import {
  verifyCloudProof,
  IVerifyResponse,
} from "@worldcoin/minikit-js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { payload, action, signal } = await req.json();
    const app_id = process.env.NEXT_PUBLIC_APP_ID as `app_${string}`;
    
    if (!app_id) {
      console.error("APP_ID not configured");
      return NextResponse.json({ error: "APP_ID not configured" }, { status: 500 });
    }

    console.log("Verification payload:", { payload, action, signal, app_id });

    const verifyRes = await verifyCloudProof(payload, app_id, action, signal);
    console.log("Verification response:", verifyRes);

    if (verifyRes.success) {
      return NextResponse.json({ verifyRes, status: 200 });
    } else {
      console.error("Verification failed:", verifyRes.error);
      return NextResponse.json({ 
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
