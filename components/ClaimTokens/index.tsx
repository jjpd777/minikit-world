
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
      
      // Get user's address
      const userAddress = await MiniKit.commandsAsync.getAddress();
      
      // Prepare transaction
      const transaction = {
        to: "0xF10106a1C3dB402955e9E172E01685E2a19820e6",
        abi: DEUS_ABI,
        functionName: 'sendTokens',
        args: [userAddress]
      };

      // Send transaction through MiniKit
      const result = await MiniKit.commandsAsync.sendTransaction(transaction);

      if (result?.finalPayload?.status === "success") {
        alert("Tokens claimed successfully!");
      } else {
        throw new Error("Transaction failed");
      }
    } catch (error) {
      console.error("Claim failed:", error);
      alert("Failed to claim tokens: " + error.message);
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={handleClaim}
        disabled={claiming}
        className={`px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 ${
          claiming ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {claiming ? "Claiming..." : "Claim Tokens"}
      </button>
    </div>
  );
};
