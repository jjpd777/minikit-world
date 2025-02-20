"use client";
import { MiniKit, VerificationLevel } from "@worldcoin/minikit-js";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { WalletAuth } from "@/components/WalletAuth";

export const SignIn = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    // Check for stored wallet address on component mount
    const storedAddress = localStorage.getItem('wallet_address');
    if (storedAddress) {
      setWalletAddress(storedAddress);
    }
  }, []);

  const handleWalletConnection = (address: string) => {
    localStorage.setItem('wallet_address', address);
    setWalletAddress(address);
  };

  if (!walletAddress) {
    return (
      <div className="flex flex-col items-center gap-4">
        <Image
          src="/bendiga_logo.png"
          alt="Bendiga Logo"
          width={200}
          height={200}
          priority
          className="mb-8 animate-glow"
        />
        <div className="relative">
          <div className="absolute inset-0 rounded-full animate-pulse bg-purple-500/20 filter blur-xl"></div>
        </div>
        <WalletAuth onAddressChange={handleWalletConnection} />
      </div>
    );
  }

  return (
    <>
      <div className="relative">
        <Image
          src="/bendiga_logo.png"
          alt="Bendiga Logo"
          width={200}
          height={200}
          priority
          className="mb-8 animate-glow"
        />
        <div className="absolute inset-0 rounded-full animate-pulse bg-purple-500/20 filter blur-xl"></div>
      </div>

      <div className="flex flex-col gap-4">
        <button
          onClick={async () => {
            if (!MiniKit.isInstalled()) {
              alert("Please install World App");
              return;
            }
            setIsVerifying(true);
            try {
              const verifyPayload = {
                action: process.env.NEXT_PUBLIC_ACTION_NAME as string,
                signal: "user_verification",
                verification_level: VerificationLevel.Device
              };

              const { finalPayload } = await MiniKit.commandsAsync.verify(verifyPayload);

              if (finalPayload.status === "success") {
                const verifyResponse = await fetch("/api/verify", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    payload: finalPayload,
                    action: process.env.NEXT_PUBLIC_ACTION_NAME as string,
                    signal: "user_verification"
                  }),
                });

                if (!verifyResponse.ok) {
                  throw new Error("Verification request failed");
                }

                const data = await verifyResponse.json();

                if (data.verifyRes?.success) {
                  console.log("Verification succeeded!");
                  localStorage.setItem('worldcoin_verified', 'true');
                  router.push("/verified");
                } else {
                  throw new Error(data.verifyRes?.error || "Verification failed");
                }
              }
            } catch (error) {
              console.error("Verification failed:", error);
              alert(error.message || "Verification failed");
            } finally {
              setIsVerifying(false);
            }
          }}
          disabled={isVerifying}
          className="px-8 py-4 bg-purple-400/80 text-white rounded-xl hover:bg-purple-500 transition-all duration-200 transform hover:scale-105 font-medium text-lg shadow-lg flex items-center justify-center gap-2"
        >
          <Image src="/world_c.png" alt="World Coin" width={24} height={24} />
          {isVerifying ? "Verifying..." : "Verify with World ID"}
        </button>
      </div>
    </>
  );
};