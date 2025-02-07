"use client";
import { MiniKit } from "@worldcoin/minikit-js";
import { useState } from "react";
import { useSession } from "next-auth/react";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Default Hardhat first address

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

      const payload = {
        to: CONTRACT_ADDRESS,
        data: {
          method: "claimReward",
          args: [
            proof.signal,
            proof.root,
            proof.nullifier_hash,
            proof.proof
          ]
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

  return (
    <div className="flex flex-col items-center gap-4 mt-4">
      <button
        onClick={handleClaim}
        disabled={claiming}
        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
      >
        {claiming ? "Claiming..." : "Claim Reward"}
      </button>
    </div>
  );
};