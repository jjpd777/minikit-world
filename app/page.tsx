
import { SignIn } from "@/components/SignIn";
import { SignMessage } from "@/components/SignMessage";
import { WalletContext } from "@/components/WalletAuth";
import { useState } from "react";

export default function Home() {
  const [walletAddress, setWalletAddress] = useState("");
  
  return (
    <WalletContext.Provider value={{ walletAddress, setWalletAddress }}>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <SignIn />
        <SignMessage />
      </main>
    </WalletContext.Provider>
  );
}
