"use client";
import { MiniKit } from "@worldcoin/minikit-js";
import { useState } from "react";
import { useSession } from "next-auth/react";

const CONTRACT_ADDRESS = "0xYourContractAddress"; // Replace with actual address
const CONTRACT_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "signal",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "root",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "nullifierHash",
        "type": "uint256"
      },
      {
        "internalType": "uint256[8]",
        "name": "proof",
        "type": "uint256[8]"
      }
    ],
    "name": "claimReward",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export const ClaimReward = ({ proof }: { proof: any }) => {
  const [claiming, setClaiming] = useState(false);
  const { data: session } = useSession();

  const handleClaim = async () => {
    if (!MiniKit.isInstalled()) {
      alert("Please install World App to claim rewards");
      return;
    }

    try {
      setClaiming(true);

      const message = JSON.stringify({
        action: 'claim_reward',
        address: await MiniKit.commandsAsync.getAddress(),
        timestamp: Date.now()
      });

      const signResult = await MiniKit.commandsAsync.signMessage({
        message
      });

      if (signResult.finalPayload.status === "success") {
        const response = await fetch('/api/claim', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            signature: signResult.finalPayload.signature,
            message,
            address: signResult.finalPayload.address
          })
        });

        if (response.ok) {
          alert("Claim verified successfully!");
        } else {
          alert("Claim verification failed!");
        }
      }
    } catch (error) {
      console.error("Claim failed:", error);
      alert("Failed to claim reward");
    } finally {
      setClaiming(false);
    }
  };

  if (!session) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={handleClaim}
        disabled={claiming}
        className={`px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 ${
          claiming ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {claiming ? "Claiming..." : "Claim Daily Reward"}
      </button>
    </div>
  );
};