"use client";
import { MiniKit } from "@worldcoin/minikit-js";
import { useState } from "react";

const DEUS_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "requester",
        "type": "address"
      }
    ],
    "name": "sendTokens",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export const ClaimTokens = () => {
  const [claiming, setClaiming] = useState(false);

  const handleClaim = async () => {
    if (!MiniKit.isInstalled()) {
      alert("Please install World App to claim tokens");
      return;
    }

    try {
      setClaiming(true);

      const userAddress = await MiniKit.commandsAsync.getAddress();

      const transaction = {
        address: "0xF10106a1C3dB402955e9E172E01685E2a19820e6",
        abi: DEUS_ABI,
        functionName: 'sendTokens',
        args: [userAddress]
      };

      const result = await MiniKit.commandsAsync.sendTransaction(transaction);

      if (result?.finalPayload?.status === "success") {
        alert("Tokens claimed successfully!");
      } else {
        throw new Error("Transaction failed");
      }
    } catch (error: any) {
      console.error("Claim error:", error);
      alert("Failed to claim tokens: " + error.message);
    } finally {
      setClaiming(false);
    }
  };

  return (
    <button
      onClick={handleClaim}
      disabled={claiming}
      className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
    >
      {claiming ? "Claiming..." : "Claim Tokens"}
    </button>
  );
};