
"use client";
import { MiniKit } from "@worldcoin/minikit-js";
import { useState } from "react";

const RELIGIOUS_TOKEN_ABI = [
  {
    inputs: [],
    name: "claimTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        name: "account",
        type: "address"
      }
    ],
    name: "balanceOf",
    outputs: [
      {
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
];

const TOKENS = [
  { address: "0x908BE4717360397348F35271b9461192B6c84522", name: "Christianity" },
  { address: "0xC1b3a96113aC409fe3a40126962c74aEBccDda62", name: "Orthodox" },
  { address: "0x848B9D2d07C601706ff86b7956579bDFB9Bc0635", name: "Judaism" },
  { address: "0x723da9e13D5519a63a5cbC8342B4e4c3aE1eEb8A", name: "Islam" },
  { address: "0x840934539c988fA438f005a4B94234E50f5D6c4a", name: "Sikhism" },
  { address: "0x5b1b84197a2235C67c65E0Ec60f891A6975bcb95", name: "Hinduism" },
  { address: "0x2AC26A1380B3eBbe4149fbcAf61e88D0304688d7", name: "Science" },
  { address: "0xd01366ca8642a0396c4e909feb8c5E9Ec3A00F65", name: "Buddhism" }
];

export default function TokenTesting() {
  const [claimingStatus, setClaimingStatus] = useState<{[key: string]: boolean}>({});
  const [balances, setBalances] = useState<{[key: string]: string}>({});

  const checkBalance = async (address: string) => {
    if (!MiniKit.isInstalled()) {
      alert("Please install World App");
      return;
    }

    try {
      const userAddress = await MiniKit.commandsAsync.getAddress();
      const result = await MiniKit.commandsAsync.readContract({
        address,
        abi: RELIGIOUS_TOKEN_ABI,
        functionName: 'balanceOf',
        args: [userAddress]
      });
      setBalances(prev => ({...prev, [address]: result.toString()}));
    } catch (error) {
      console.error("Error checking balance:", error);
    }
  };

  const claimTokens = async (address: string) => {
    if (!MiniKit.isInstalled()) {
      alert("Please install World App");
      return;
    }

    try {
      setClaimingStatus(prev => ({...prev, [address]: true}));
      
      const result = await MiniKit.commandsAsync.sendTransaction({
        transaction: [{
          address,
          abi: RELIGIOUS_TOKEN_ABI,
          functionName: 'claimTokens',
          args: []
        }]
      });

      if (result.finalPayload.status === "success") {
        await checkBalance(address);
        alert("Tokens claimed successfully!");
      }
    } catch (error) {
      console.error("Error claiming tokens:", error);
      alert("Failed to claim tokens: " + error.message);
    } finally {
      setClaimingStatus(prev => ({...prev, [address]: false}));
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Religious Token Claims</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {TOKENS.map((token) => (
          <div key={token.address} className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">{token.name}</h2>
            <p className="text-sm text-gray-400 break-all mb-2">{token.address}</p>
            <p className="mb-2">Balance: {balances[token.address] || '0'}</p>
            <div className="flex gap-2">
              <button
                onClick={() => checkBalance(token.address)}
                className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
              >
                Check Balance
              </button>
              <button
                onClick={() => claimTokens(token.address)}
                disabled={claimingStatus[token.address]}
                className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-700 disabled:opacity-50"
              >
                {claimingStatus[token.address] ? "Claiming..." : "Claim"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
