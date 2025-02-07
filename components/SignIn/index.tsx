
"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { MiniKit } from "@worldcoin/minikit-js";
import { ethers } from "ethers";
import contractABI from '../../HumanityRewards.json';

const CONTRACT_ADDRESS = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512";

export const SignIn = () => {
  const { data: session, status } = useSession();

  const testNetwork = async () => {
    try {
      console.log("Testing connection to Hardhat node...");
      const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
      
      // Simple connection test
      const blockNumber = await provider.getBlockNumber();
      console.log("Connected to network. Current block:", blockNumber);
      
      // Check contract existence
      const contractCode = await provider.getCode(CONTRACT_ADDRESS);
      console.log("Contract code length:", contractCode.length);
      
      if (contractCode === "0x") {
        console.log("No contract found at", CONTRACT_ADDRESS);
        alert("No contract found at the specified address");
      } else {
        console.log("Contract found at", CONTRACT_ADDRESS);
        alert("Successfully verified contract existence!");
      }
    } catch (error) {
      console.error("Network test error:", error);
      alert("Failed to connect to network: " + error.message);
    }
  };
        address: "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512"
      });
      
      console.log("Contract code:", contractCode);
      if (contractCode && contractCode !== "0x") {
        alert("Successfully found contract on network!");
      } else {
        alert("Contract not found at specified address");
      }
    } catch (error) {
      console.error("Network test error:", error);
      alert("Failed to connect to network: " + error.message);
    }
};

const handleClaim = async () => {
    try {
      console.log("Starting claim process...");
      
      // Connect to the network
      const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer);
      
      // Prepare claim parameters
      const userAddress = await signer.getAddress();
      const root = "0";
      const nullifierHash = "0";
      const proof = Array(8).fill("0");
      
      console.log("Claiming with address:", userAddress);
      
      // Send transaction
      const tx = await contract.claimReward(userAddress, root, nullifierHash, proof);
      console.log("Transaction sent:", tx.hash);
      
      // Wait for confirmation
      const receipt = await tx.wait();
      console.log("Transaction confirmed:", receipt);
      
      if (receipt.status === 1) {
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
              onClick={testNetwork}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mb-2"
            >
              Test Network
            </button>
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
