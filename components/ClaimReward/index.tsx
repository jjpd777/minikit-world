
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

      // Prepare the transaction data for the claimReward function
      const payload = {
        to: CONTRACT_ADDRESS,
        data: {
          method: "claimReward",
          args: [
            proof.merkle_root,
            proof.nullifier_hash,
            proof.proof
          ],
          abi: CONTRACT_ABI
        }
      };

      const result = await MiniKit.commandsAsync.sendTransaction(payload);
      
      if (result?.finalPayload?.status === "success") {
        alert("Reward claimed successfully!");
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
