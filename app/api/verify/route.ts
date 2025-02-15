
import { verifyCloudProof } from "@worldcoin/minikit-js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { proof, action, signal, app_id } = await req.json();
    
    if (!app_id) {
      console.error("APP_ID not configured");
      return NextResponse.json({ error: "APP_ID not configured" }, { status: 500 });
    }

    const verifyRes = await verifyCloudProof(proof, app_id, action, signal);

    if (verifyRes.success) {
      return NextResponse.json({ verifyRes, status: 200 });
    } else {
      return NextResponse.json({ 
        error: verifyRes.error || "Verification failed",
        status: 400,
        verifyRes 
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
