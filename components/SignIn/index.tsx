"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { MiniKit } from "@worldcoin/minikit-js";
import { WalletAuth } from "../WalletAuth";

const CONTRACT_ADDRESS = "0x0Cb1f74d3ee7f4C86c32E440603d88D251188FC1"; // Replace with your deployed contract address
const ALCHEMY_RPC =
  "https://eth-sepolia.g.alchemy.com/v2/nqzJUCLA8RnIEKh2arVjp3BHtlO02v7G"; // Replace with your Alchemy RPC URL

export const SignIn = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="text-white">Loading...</div>;
  }

  if (session) {
    const isOrbVerified = session.user?.verificationLevel === "orb";

    return (
      <div className="flex flex-col items-center gap-4 p-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-purple-500/20 shadow-lg">
        {isOrbVerified ? (
          <>
            <h1 className="text-3xl font-bold text-white text-center">
              WELCOME TO BENDIGA
            </h1>
            <WalletAuth />
          </>
        ) : (
          <h1 className="text-3xl font-bold text-red-500">
            Can't Claim tokens
          </h1>
        )}
        <button
          onClick={() => signOut()}
          className="px-6 py-3 bg-red-500/80 text-white rounded-xl hover:bg-red-600 transition-colors duration-200"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn("worldcoin")}
      className="px-8 py-4 bg-purple-400/80 text-white rounded-xl hover:bg-purple-500 transition-all duration-200 transform hover:scale-105 font-medium text-lg shadow-lg"
    >
      Sign in with World ID
    </button>
  );
};

const testNetwork = async () => {
  try {
    if (!MiniKit.isInstalled()) {
      console.log(
        "MiniKit not installed - checking direct network connection...",
      );
      const provider = new ethers.JsonRpcProvider("http://0.0.0.0:8545");

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
    } else {
      const response = await MiniKit.commandsAsync.getProvider();
      if (response?.provider) {
        console.log("Successfully connected via MiniKit");
        alert("Successfully connected to network via World App!");
      }
    }
  } catch (error) {
    console.error("Network test error:", error);
    const errorMessage =
      "Please make sure your Hardhat node is running and accessible. Error: " +
      error.message;
    console.error(errorMessage);
    alert(errorMessage);
  }
};

const sayHello = async () => {
  try {
    if (!MiniKit.isInstalled()) {
      alert("Please install World App to interact with the contract");
      return;
    }

    const iface = new ethers.Interface(HelloWorldABI.abi);
    const encodedData = iface.encodeFunctionData("sayHello", []);

    const payload = {
      to: CONTRACT_ADDRESS,
      data: encodedData,
      value: "0",  // No ETH being sent
      gasLimit: "100000"  // Explicit gas limit
    };

    const result = await MiniKit.commandsAsync.sendTransaction(payload);
    console.log("Transaction result:", result);

    if (result?.finalPayload?.status === "success") {
      console.log("Transaction success payload:", result.finalPayload);
      alert("Hello message sent successfully!");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Failed to say hello: " + error.message);
  }
};

const handleClaim = async () => {
  try {
    console.log("Starting claim process...");

    // Connect to the network
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      contractABI.abi,
      signer,
    );

    // Prepare claim parameters
    const userAddress = await signer.getAddress();
    const root = "0";
    const nullifierHash = "0";
    const proof = Array(8).fill("0");

    console.log("Claiming with address:", userAddress);

    // Send transaction
    const tx = await contract.claimReward(
      userAddress,
      root,
      nullifierHash,
      proof,
    );
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