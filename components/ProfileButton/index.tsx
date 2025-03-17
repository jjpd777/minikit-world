
"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import { MiniKit } from "@worldcoin/minikit-js";

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

export const ProfileButton = () => {
  const { data: session } = useSession();
  const [isClaimingToken, setIsClaimingToken] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleClaimBlessd = async () => {
    if (!MiniKit.isInstalled()) {
      alert("Please install World App to claim tokens");
      return;
    }

    try {
      const network = await MiniKit.commandsAsync.getNetwork();
      if (network.chainId !== "0x2330" && network.chainId !== "9008") {
        alert("Please switch to WorldChain mainnet");
        return;
      }

      setIsClaimingToken(true);
      const userAddress = await MiniKit.commandsAsync.getAddress();
      const result = await MiniKit.commandsAsync.sendTransaction({
        transaction: [{
          address: "0xF10106a1C3dB402955e9E172E01685E2a19820e6",
          abi: DEUS_ABI,
          functionName: 'sendTokens',
          args: [userAddress.toString()]
        }]
      });

      if (result?.finalPayload?.status === "success") {
        alert("BLESSD tokens claimed successfully!");
      } else {
        throw new Error("Transaction failed");
      }
    } catch (error: any) {
      console.error("Error claiming tokens:", error);
      alert("Failed to claim tokens: " + error.message);
    } finally {
      setIsClaimingToken(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="px-4 py-2 bg-purple-500/80 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2"
      >
        <span>{session?.user?.name || "Sign In"}</span>
        <svg
          className={`w-4 h-4 transform transition-transform ${showDropdown ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-50">
          {session ? (
            <>
              <button
                onClick={handleClaimBlessd}
                disabled={isClaimingToken}
                className="w-full px-4 py-2 text-left text-purple-600 hover:bg-purple-50 transition-colors rounded-t-lg"
              >
                {isClaimingToken ? "Claiming..." : "Claim BLESSD"}
              </button>
              <button
                onClick={() => signOut()}
                className="w-full px-4 py-2 text-left text-purple-600 hover:bg-purple-50 transition-colors rounded-b-lg"
              >
                Sign Out
              </button>
            </>
          ) : (
            <button
              onClick={() => signIn()}
              className="w-full px-4 py-2 text-left text-purple-600 hover:bg-purple-50 transition-colors rounded-lg"
            >
              Sign In
            </button>
          )}
        </div>
      )}
    </div>
  );
};
