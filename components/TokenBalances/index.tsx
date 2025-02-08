
"use client";
import { useEffect, useState } from 'react';
import { MiniKit } from "@worldcoin/minikit-js";
import { ethers } from 'ethers';

const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)"
];

export const TokenBalances = () => {
  const [balances, setBalances] = useState<{symbol: string, balance: string}[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        if (!MiniKit.isInstalled()) {
          setError("Please install World App");
          return;
        }

        const userAddress = await MiniKit.commandsAsync.getAddress();
        if (!userAddress) {
          setError("Could not get user address");
          return;
        }

        const provider = new ethers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/nqzJUCLA8RnIEKh2arVjp3BHtlO02v7G");
        
        // Get ETH balance
        const ethBalance = await provider.getBalance(userAddress);
        const balancesList = [{
          symbol: "ETH",
          balance: ethers.formatEther(ethBalance)
        }];

        // Get USDC balance on Sepolia
        const usdcContract = new ethers.Contract(
          "0x6f14C02Fc1F78322cFd7d707aB90f18baD3B54f5",
          ERC20_ABI,
          provider
        );
        
        const usdcBalance = await usdcContract.balanceOf(userAddress);
        const usdcDecimals = await usdcContract.decimals();
        
        balancesList.push({
          symbol: "USDC",
          balance: ethers.formatUnits(usdcBalance, usdcDecimals)
        });

        setBalances(balancesList);
        setError("");
      } catch (err) {
        setError("Error fetching balances: " + (err as Error).message);
        console.error("Balance fetch error:", err);
      }
    };

    fetchBalances();
  }, []);

  return (
    <div className="mt-4 p-4 bg-gray-800 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Your Token Balances</h2>
      {error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="space-y-2">
          {balances.map((token, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="font-medium">{token.symbol}:</span>
              <span>{Number(token.balance).toFixed(4)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
