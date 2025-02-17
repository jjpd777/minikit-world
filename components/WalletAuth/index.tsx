
"use client";
import { MiniKit } from "@worldcoin/minikit-js";
import { useState } from "react";
import Image from "next/image";

export const WalletAuth = ({ onAddressChange }: { onAddressChange?: (address: string) => void }) => {
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [balance, setBalance] = useState(0.33);
  const [loading, setLoading] = useState(false);

  const handleWalletAuth = async () => {
    try {
      setLoading(true);
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
        if (onAddressChange) onAddressChange(address);
        alert("Wallet authenticated successfully!");
      }
    } catch (error) {
      console.error("Wallet auth error:", error);
      alert("Failed to authenticate wallet");
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    setWalletAddress("");
    if (onAddressChange) onAddressChange("");
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
    <div className="flex flex-col items-center gap-4">
      

      {!walletAddress ? (
        <button
          onClick={handleWalletAuth}
          disabled={loading}
          className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all disabled:opacity-50"
        >
          {loading ? "Connecting..." : "Connect Wallet"}
        </button>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <div className="px-4 py-2 bg-gray-800 rounded-lg text-white font-mono text-sm">
            {`${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`}
          </div>
          <div className="flex gap-2">
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 text-sm"
            >
              Copy Address
            </button>
            <button
              onClick={handleDisconnect}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
            >
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
