"use client";
import { useState, useEffect } from "react";
import { WalletAuth } from "../WalletAuth";
import Image from "next/image";
import { MiniKit } from "@worldcoin/minikit-js";
import { useWaitForTransactionReceipt } from '@worldcoin/minikit-react';
import { createPublicClient, http } from 'viem';

const client = createPublicClient({
  chain: {
    id: 9008,
    name: 'Worldchain',
    network: 'worldchain',
    nativeCurrency: { name: 'WLD', symbol: 'WLD', decimals: 18 },
    rpcUrls: {
      default: { http: ['https://worldchain-mainnet.g.alchemy.com/public'] }
    }
  },
  transport: http('https://worldchain-mainnet.g.alchemy.com/public')
});

export const ProfileButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('walletAddress') || "";
    }
    return "";
  });
  const [transactionId, setTransactionId] = useState<string>("");
  const [tokenBalance, setTokenBalance] = useState<string>("0");

  const fetchBalance = async () => {
    if (!walletAddress || !MiniKit.isInstalled()) return;
    try {
      const balance = await MiniKit.commandsAsync.getBalance({
        address: walletAddress,
        token: "0xF10106a1C3dB402955e9E172E01685E2a19820e6" // Your token contract address
      });
      setTokenBalance(balance.toString());
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  // Fetch balance when wallet is connected
  useEffect(() => {
    if (walletAddress) {
      fetchBalance();
    }
  }, [walletAddress]);

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    client,
    appConfig: {
      app_id: process.env.NEXT_PUBLIC_APP_ID || "",
    },
    transactionId,
  });

  return (
    <> {
      walletAddress ? <> <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 p-2 rounded-full bg-purple-500/30 hover:bg-purple-500/50 transition-all z-50"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-8 rounded-xl max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl text-white font-bold">Profile</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-800 rounded-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            {/* <WalletAuth onAddressChange={setWalletAddress} /> */}
            {walletAddress && (
              <div className="mt-2 text-sm text-gray-300">
                Token Balance: {tokenBalance}
              </div>
            )}
            <div className="mt-4 space-y-2">
              <button
                onClick={async () => {
                  if (!MiniKit.isInstalled()) {
                    alert("Please install World App to claim tokens");
                    return;
                  }
                  console.log("STARTING TO CLAIM TOKENS");

                  try {
                    const DEUS_ABI = [
                        {
                          inputs: [],
                          name: "claimTokens",
                          outputs: [],
                          stateMutability: "nonpayable",
                          type: "function",
                        },
                      ];

                    const { commandPayload, finalPayload } = await MiniKit.commandsAsync.sendTransaction({
                      transaction: [{
                        address: "0x0E384B20618D355552A005509eA2E814198CBBdE",
                          abi: DEUS_ABI,
                          functionName: "claimTokens",
                          args: [] // empty array since c
                      }]
                    });

                    console.log("Transaction payload:", commandPayload);
                    const result = { finalPayload };

                    if (finalPayload.status === "error") {
                      console.error("Error sending transaction", finalPayload);
                      throw new Error("Transaction failed");
                    } else {
                      setTransactionId(finalPayload.transaction_id);
                    }

                    if (finalPayload.status === "success") {
                      setTransactionId(finalPayload.transaction_id);
                    }
                  } catch (error) {
                    console.error("Payment failed:", error);
                    alert("Payment failed: " + error.message);
                  }
                }}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                {isConfirming ? "Confirming..." : isConfirmed ? "Tokens Claimed!" : "Claim Tokens"}
              </button>
              {transactionId && (
                <div className="mt-2 text-sm text-gray-300">
                  {isConfirming && "Waiting for confirmation..."}
                  {isConfirmed && "Transaction confirmed!"}
                </div>
              )}
            </div>
          </div>
        </div>
      )}</> : <><p></p></>
    }
      
    </>
  );
};
