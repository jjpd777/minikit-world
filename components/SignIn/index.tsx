
"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { MiniKit } from "@worldcoin/minikit-js";
import contractABI from '../../HumanityRewards.json';

const CONTRACT_ADDRESS = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512";

export const SignIn = () => {
  const { data: session, status } = useSession();

  const handleClaim = async () => {
    try {
      console.log("Starting claim process...");
      if (!MiniKit.isInstalled()) {
        console.log("MiniKit not installed");
        alert("Please install World App to claim tokens");
        return;
      }

      const payload = {
        to: CONTRACT_ADDRESS,
        data: {
          method: "claimReward",
          args: [
            await MiniKit.getAddressAsync(), // signal (user's address)
            "0", // root
            "0", // nullifierHash
            Array(8).fill("0") // proof
          ],
          abi: contractABI.abi
        }
      };

      console.log("Sending transaction with payload:", payload);
      const result = await MiniKit.commandsAsync.sendTransaction(payload);
      
      if (result?.finalPayload?.status === "success") {
        console.log("Claim successful!");
        alert("Tokens claimed successfully!");
      }
    } catch (error) {
      console.error("Claim error:", error);
      alert("Failed to claim tokens: " + error.message);
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (session) {
    const isOrbVerified = session.user?.verificationLevel === "orb";

    return (
      <div className="flex flex-col items-center gap-4 p-6 bg-gray-800 rounded-lg">
        {isOrbVerified ? (
          <>
            <h1 className="text-3xl font-bold text-white">WELCOME TO BENDIGA</h1>
            <button 
              onClick={handleClaim}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Claim Tokens
            </button>
          </>
        ) : (
          <h1 className="text-3xl font-bold text-red-500">Can't Claim tokens</h1>
        )}
        <button 
          onClick={() => signOut()}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn("worldcoin")}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Sign in with World ID
    </button>
  );
};
