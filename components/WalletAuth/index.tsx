
"use client";
import { MiniKit } from "@worldcoin/minikit-js";
import { useState } from "react";

export const WalletAuth = () => {
  const [walletAddress, setWalletAddress] = useState<string>("");

  const handleWalletAuth = async () => {
    try {
      if (!MiniKit.isInstalled()) {
        alert("Please install World App to authenticate your wallet");
        return;
      }

      const result = await MiniKit.commandsAsync.walletAuth();
      
      if (result?.finalPayload?.status === "success") {
        setWalletAddress(result.finalPayload.address);
        alert("Wallet authenticated successfully!");
      }
    } catch (error) {
      console.error("Wallet auth error:", error);
      alert("Failed to authenticate wallet");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 border rounded-lg bg-white shadow-sm">
      <h2 className="text-xl font-semibold">Wallet Authentication</h2>
      <button
        onClick={handleWalletAuth}
        className="px-6 py-3 rounded-lg font-medium bg-blue-500 hover:bg-blue-600 text-white"
      >
        Connect Wallet
      </button>
      
      {walletAddress && (
        <div className="text-sm mt-2 text-center text-green-500">
          Connected: {walletAddress.substring(0, 6)}...{walletAddress.substring(38)}
        </div>
      )}
    </div>
  );
};
