
"use client";
import { WalletAuth } from "@/components/WalletAuth";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function WalletPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-gray-900 to-gray-800">
      <button 
        onClick={() => router.back()}
        className="absolute top-4 left-4 p-2 rounded-full bg-purple-500/30 hover:bg-purple-500/50 transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>
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
