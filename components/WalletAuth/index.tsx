
"use client";
import { MiniKit } from "@worldcoin/minikit-js";
import { useState, useEffect } from "react";

export const WalletAuth = () => {
  const [walletAddress, setWalletAddress] = useState<string>("");

  useEffect(() => {
    const savedAddress = localStorage.getItem("walletAddress");
    if (savedAddress) {
      setWalletAddress(savedAddress);
    }
  }, []);

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
        localStorage.setItem("walletAddress", address);
        alert("Wallet authenticated successfully!");
      }
    } catch (error) {
      console.error("Wallet auth error:", error);
      alert("Failed to authenticate wallet");
    }
  };

  const handleDisconnect = () => {
    setWalletAddress("");
    localStorage.removeItem("walletAddress");
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 border rounded-lg bg-white shadow-sm">
      <h2 className="text-xl font-semibold">Wallet Authentication</h2>
      {!walletAddress ? (
        <button
          onClick={handleWalletAuth}
          className="px-6 py-3 rounded-lg font-medium bg-blue-500 hover:bg-blue-600 text-white"
        >
          Connect Wallet
        </button>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <div className="text-sm text-green-500">
            Connected: {walletAddress.substring(0, 6)}...{walletAddress.substring(38)}
          </div>
          <button
            onClick={handleDisconnect}
            className="px-6 py-2 rounded-lg font-medium bg-red-500 hover:bg-red-600 text-white"
          >
            Disconnect Wallet
          </button>
        </div>
      )}
    </div>
  );
};
