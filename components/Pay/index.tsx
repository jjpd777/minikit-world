
"use client";
import { MiniKit, tokenToDecimals, Tokens } from "@worldcoin/minikit-js";
import { useState } from "react";
import { useSession } from "next-auth/react";

export const PayBlock = () => {
  const { data: session } = useSession();
  const [amount, setAmount] = useState("0.1");
  const [address, setAddress] = useState("0xaBF8609C0678948b1FA06498cB4508a65bB1a0f2");

  const handlePay = async () => {
    if (!MiniKit.isInstalled()) {
      alert("Please install World App to send payments");
      return;
    }

    try {
      const payload = {
        to: address,
        tokens: [{
          symbol: Tokens.WLD,
          token_amount: tokenToDecimals(Number(amount), Tokens.WLD).toString()
        }],
        description: "Payment via World ID"
      };

      const result = await MiniKit.commandsAsync.pay(payload);
      if (result?.finalPayload?.status === "success") {
        alert("Payment sent successfully!");
        setAddress("");
        setAmount("0.1");
      }
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment failed");
    }
  };

  if (!session) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Enter recipient address"
        className="p-2 border rounded text-black"
      />
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount in WLD"
        className="p-2 border rounded text-black"
        step="0.1"
      />
      <button
        onClick={handlePay}
        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
      >
        Send WLD
      </button>
    </div>
  );
};
