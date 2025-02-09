"use client";
import { MiniKit } from "@worldcoin/minikit-js";
import { useState } from "react";
import Image from "next/image";

// Create a global variable to track prayer signs
let globalPrayerSigns = 0;

export const WalletAuth = () => {
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [balance, setBalance] = useState(0.11);

  // Function to increment balance, exposed globally
  (window as any).incrementBalance = () => {
    globalPrayerSigns++;
    setBalance(0.11 + globalPrayerSigns * 0.11);
  };

  const handleWalletAuth = async () => {
    try {
      if (!MiniKit.isInstalled()) {
        alert("Please install World App to authenticate your wallet");
        return;
      }

      // Get nonce from our API
      const nonceRes = await fetch("/api/nonce");
      const { nonce } = await nonceRes.json();

      const result = await MiniKit.commandsAsync.walletAuth({
        nonce,
        statement: "Sign in with your wallet to Bendiga",
        expirationTime: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour from now
      });

      if (result?.finalPayload?.status === "success") {
        const address = result.finalPayload.address;
        setWalletAddress(address);
        alert("Wallet authenticated successfully!");
      }
    } catch (error) {
      console.error("Wallet auth error:", error);
      alert("Failed to authenticate wallet");
    }
  };

  const handleDisconnect = () => {
    setWalletAddress("");
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress);
      alert("Address copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy address:", err);
      alert("Failed to copy address");
    }
  };

  return (
    <div className="flex items-center gap-2 margin-bottom-20">
      {!walletAddress ? (
        <div className="flex items-center gap-2 px-4 py-2 text-lg rounded-lg font-medium bg-purple-300/80 text-white">
          <Image src="/world_c.png" alt="World Coin" width={30} height={30} />
          <span>0.00</span>
        </div>
      ) : (
        <div className="flex items-center gap-2 px-4 py-2 text-lg rounded-lg font-medium bg-purple-300/80 text-white">
          <Image src="/world_c.png" alt="World Coin" width={30} height={30} />
          <span>{balance.toFixed(2)} </span>
        </div>
      )}
    </div>
  );
};
