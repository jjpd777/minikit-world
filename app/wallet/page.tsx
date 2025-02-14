
"use client";
import { WalletAuth } from "@/components/WalletAuth";
import Image from "next/image";

export default function WalletPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="w-full max-w-md flex flex-col items-center">
        <Image
          src="/bendiga_logo.png"
          alt="Bendiga Logo"
          width={150}
          height={150}
          priority
          className="mb-8 animate-glow"
        />
        <h1 className="text-2xl text-white text-center font-bold mb-8">
          Connect Your Wallet
        </h1>
        <WalletAuth />
      </div>
    </div>
  );
}
