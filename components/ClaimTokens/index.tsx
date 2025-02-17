
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
      console.error("MiniKit not installed");
      alert("Please install World App to claim tokens");
      return;
    }

    try {
      const network = await MiniKit.commandsAsync.getNetwork();
      console.log("Current network:", network);
      
      if (network.chainId !== "0x2330" && network.chainId !== "9008") { // WorldChain mainnet chainId
        alert("Please switch to WorldChain mainnet");
        return;
      }

    try {
      setClaiming(true);
      
      // Get user's address
      console.log("Fetching user address...");
      const userAddress = await MiniKit.commandsAsync.getAddress();
      console.log("User address:", userAddress);
      
      // Prepare Permit2 data
      const permit2Data = {
        permitted: {
          token: "0xF10106a1C3dB402955e9E172E01685E2a19820e6", // Token address
          amount: "1000000000000000000" // Amount in wei (1 token)
        },
        spender: userAddress.toString(),
        nonce: "0", // You should get this from your backend
        deadline: (Math.floor(Date.now() / 1000) + 3600).toString() // 1 hour from now
      };

      // Prepare transaction with Permit2
      const transaction = [{
        to: "0xF10106a1C3dB402955e9E172E01685E2a19820e6",
        abi: DEUS_ABI,
        functionName: 'sendTokens',
        args: [userAddress.toString()],
        value: "0" // Optional: Add if you need to send value
      }];

      const sendTransactionInput = {
        transaction,
        permit2: [permit2Data]
      };

      console.log("Transaction payload:", sendTransactionInput);

      // Send transaction through MiniKit
      console.log("Sending transaction...");
      const result = await MiniKit.commandsAsync.sendTransaction(sendTransactionInput);
      console.log("Transaction result:", result);

      if (result?.finalPayload?.status === "success") {
        console.log("Transaction successful!");
        alert("Tokens claimed successfully!");
      } else {
        console.error("Transaction failed with result:", result);
        throw new Error(`Transaction failed: ${JSON.stringify(result?.finalPayload || {})}`);
      }
    } catch (error) {
      console.error("Detailed claim error:", {
        message: error.message,
        stack: error.stack,
        error
      });
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
