import {
  verifyCloudProof,
  IVerifyResponse,
  ISuccessResult,
} from "@worldcoin/minikit-js";
import { NextRequest, NextResponse } from "next/server";

interface IRequestPayload {
  payload: ISuccessResult;
  action: string;
  signal: string | undefined;
}

export async function POST(req: NextRequest) {
  try {
    const { payload, action, signal } = (await req.json()) as IRequestPayload;
    const app_id = process.env.APP_ID as `app_${string}`;

    if (!app_id) {
      return NextResponse.json(
        { error: "APP_ID not configured" },
        { status: 500 },
      );
    }

    const verifyRes = (await verifyCloudProof(
      payload,
      app_id,
      action,
      signal,
    )) as IVerifyResponse;

    if (verifyRes.success) {
      return NextResponse.json({ verifyRes, status: 200 });
    } else {
      return NextResponse.json({ verifyRes, status: 200 });
    }
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({
      error: error.message || "Internal server error",
      status: 500,
    });
  }
}
