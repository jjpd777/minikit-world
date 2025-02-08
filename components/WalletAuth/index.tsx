
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

      // Get nonce from our API
      const nonceRes = await fetch('/api/nonce');
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
        <button
          onClick={handleWalletAuth}
          className="px-4 py-2 text-sm rounded-lg font-medium bg-purple-500/80 hover:bg-purple-600 text-white transition-colors duration-200"
        >
          Connect Wallet
        </button>
      ) : (
        <div className="flex items-center gap-2">
          <button
            onClick={copyToClipboard}
            className="px-4 py-2 text-sm rounded-lg font-medium bg-green-500/80 hover:bg-green-600 text-white transition-colors duration-200"
          >
            Copy Address
          </button>
          <button
            onClick={handleDisconnect}
            className="px-3 py-1 text-sm rounded-lg font-medium bg-red-500/80 hover:bg-red-600 text-white transition-colors duration-200"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
};
