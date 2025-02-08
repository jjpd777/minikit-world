
"use client";
import { useEffect, useState } from 'react';
import { MiniKit } from "@worldcoin/minikit-js";
import { ethers } from 'ethers';

// Common ERC20 ABI for balanceOf
const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)"
];

interface TokenBalance {
  symbol: string;
  balance: string;
}

export const TokenBalances = () => {
  const [balances, setBalances] = useState<TokenBalance[]>([]);
  const [address, setAddress] = useState<string>("");

  // List of token addresses you want to check (on Sepolia testnet)
  const tokenAddresses = [
    "0x6f14C02Fc1F78322cFd7d707aB90f18baD3B54f5", // USDC
    "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9"  // DAI
  ];

  useEffect(() => {
    const fetchBalances = async () => {
      if (!MiniKit.isInstalled()) {
        alert("Please install World App to check balances");
        return;
      }

      try {
        const provider = await MiniKit.commandsAsync.getProvider();
        if (!provider) return;

        const userAddress = await MiniKit.commandsAsync.getAddress();
        setAddress(userAddress);

        const ethersProvider = new ethers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/nqzJUCLA8RnIEKh2arVjp3BHtlO02v7G");
        
        const newBalances: TokenBalance[] = [];

        // Get ETH balance
        const ethBalance = await ethersProvider.getBalance(userAddress);
        newBalances.push({
          symbol: "ETH",
          balance: ethers.formatEther(ethBalance)
        });

        // Get token balances
        for (const tokenAddress of tokenAddresses) {
          const contract = new ethers.Contract(tokenAddress, ERC20_ABI, ethersProvider);
          const balance = await contract.balanceOf(userAddress);
          const decimals = await contract.decimals();
          const symbol = await contract.symbol();
          
          newBalances.push({
            symbol,
            balance: ethers.formatUnits(balance, decimals)
          });
        }

        setBalances(newBalances);
      } catch (error) {
        console.error("Error fetching balances:", error);
      }
    };

    fetchBalances();
  }, []);

  if (!address) return null;

  return (
    <div className="mt-4 p-4 bg-gray-800 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Your Token Balances</h2>
      <div className="space-y-2">
        {balances.map((token, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="font-medium">{token.symbol}:</span>
            <span>{Number(token.balance).toFixed(4)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
