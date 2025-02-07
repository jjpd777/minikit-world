
"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { ethers } from "ethers";
import contractABI from '../../HumanityRewards.json';

const CONTRACT_ADDRESS = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512";

export const SignIn = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  const handleClaim = async () => {
    try {
      console.log("Starting claim process...");
      const provider = new ethers.JsonRpcProvider("https://50404519-a81e-4ec7-9a90-dd9de1996dbf-00-lz3lk7p42y35.riker.replit.dev/");
      const signer = await provider.getSigner();
      console.log("Got signer:", await signer.getAddress());

      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer);
      console.log("Contract instance created");

      // Example values - you'll need to get these from your World ID verification
      const signal = await signer.getAddress();
      const root = "0"; // Replace with actual root
      const nullifierHash = "0"; // Replace with actual nullifier hash
      const proof = Array(8).fill("0"); // Replace with actual proof

      console.log("Attempting to claim with params:", { signal, root, nullifierHash, proof });
      const tx = await contract.claimReward(signal, root, nullifierHash, proof);
      console.log("Transaction sent:", tx.hash);
      
      await tx.wait();
      console.log("Transaction confirmed!");
      alert("Tokens claimed successfully!");
    } catch (error) {
      console.error("Claim error:", error);
      alert("Failed to claim tokens: " + error.message);
    }
  };

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
