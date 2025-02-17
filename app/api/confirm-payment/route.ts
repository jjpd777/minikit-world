
import { MiniAppPaymentSuccessPayload } from "@worldcoin/minikit-js";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

interface IRequestPayload {
  payload: MiniAppPaymentSuccessPayload;
}

export async function POST(req: NextRequest) {
  const { payload } = (await req.json()) as IRequestPayload;

  const cookieStore = cookies();
  const reference = cookieStore.get("payment-nonce")?.value;

  console.log(reference);

  if (!reference) {
    return NextResponse.json({ success: false, error: "No reference found" });
  }

  console.log(payload);
  
  if (payload.reference === reference) {
    try {
      const response = await fetch(
        `https://developer.worldcoin.org/api/v2/minikit/transaction/${payload.transaction_id}?app_id=${process.env.APP_ID}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.DEV_PORTAL_API_KEY}`,
          },
        }
      );
      const transaction = await response.json();
      
      if (transaction.reference == reference && transaction.status != "failed") {
        return NextResponse.json({ success: true });
      } else {
        return NextResponse.json({ success: false, error: "Transaction verification failed" });
      }
    } catch (error) {
      return NextResponse.json({ success: false, error: "Failed to verify transaction" });
    }
  }

  return NextResponse.json({ success: false, error: "Reference mismatch" });
}
