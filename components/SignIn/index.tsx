"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { MiniKit } from "@worldcoin/minikit-js";
import { PrayerForm } from "../PrayerForm";
import Image from "next/image";
import { WalletAuth } from "../WalletAuth";

export const SignIn = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="text-white">Loading...</div>;
  }

  if (session) {
    const isOrbVerified = session.user?.verificationLevel === "orb";

    return (
      <div className="flex flex-col items-center gap-4">
        {isOrbVerified && (
          <div className="fixed top-0 left-0 right-0 flex justify-end gap-4 p-4 bg-gray-900/80 backdrop-blur-sm z-50">
            <WalletAuth />
            <button
              onClick={async () => {
                if (!MiniKit.isInstalled()) {
                  alert("Please install World App to make payments");
                  return;
                }
                try {
                  const initRes = await fetch("/api/initiate-payment", {
                    method: "POST",
                  });
                  const { id } = await initRes.json();

                  const result = await MiniKit.commandsAsync.pay({
                    reference: id,
                    to: "0xaBF8609C0678948b1FA06498cB4508a65bB1a0f2",
                    tokens: [
                      {
                        symbol: "WLD",
                        token_amount: "100000000000000000", // 0.1 WLD
                      },
                    ],
                    description: "Donation to Bendiga",
                  });

                  if (result?.finalPayload?.status === "success") {
                    alert("Thank you for your donation!");
                  }
                } catch (error) {
                  console.error("Payment failed:", error);
                  alert("Payment failed");
                }
              }}
              className="px-4 py-2 bg-purple-400/80 text-white rounded-xl hover:bg-purple-500 transition-colors duration-200 mr-2"
            >
              Donate
            </button>
            <button
              onClick={() => signOut()}
              className="px-4 py-2 bg-purple-600/80 text-white rounded-xl hover:bg-purple-700 transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        )}
        <div className="w-full p-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-purple-500/20 shadow-lg">
          <div className="flex flex-col items-center mb-8">
            <Image
              src="/bendiga_logo.png"
              alt="Bendiga Logo"
              width={450}
              height={450}
              priority
              style={{ marginTop: "-64px", marginBottom: "-44px" }}
            />
          </div>
          {isOrbVerified ? (
            <PrayerForm />
          ) : (
            <h1 className="text-3xl font-bold text-red-500">
              Can't Claim tokens
            </h1>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative">
        <Image
          src="/bendiga_logo.png"
          alt="Bendiga Logo"
          width={300}
          height={300}
          priority
          className="mb-8 animate-glow"
        />
        <div className="absolute inset-0 rounded-full animate-pulse bg-purple-500/20 filter blur-xl"></div>
      </div>
      <h1 className="text-3xl text-white text-center font-bold mb-8">
        Generate a Daily Prayer
      </h1>
      <div className="flex flex-col gap-4">
        <button
          onClick={() => signIn("worldcoin")}
          className="px-8 py-4 bg-purple-400/80 text-white rounded-xl hover:bg-purple-500 transition-all duration-200 transform hover:scale-105 font-medium text-lg shadow-lg flex items-center justify-center gap-2"
        >
          <Image src="/world_c.png" alt="World Coin" width={24} height={24} />
          Sign in with World ID
        </button>
        <button
          onClick={async () => {
            if (!MiniKit.isInstalled()) {
              alert("Please install World App");
              return;
            }
            try {
              const result = await MiniKit.commandsAsync.verify({
                action: process.env.NEXT_PUBLIC_ACTION_NAME as string,
                signal: "user_verification",
                verification_level: "device",
              });

              if (result?.finalPayload?.status === "success") {
                const verifyResponse = await fetch("/api/verify", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    payload: {
                      proof: result.finalPayload.proof,
                      merkle_root: result.finalPayload.merkle_root,
                      nullifier_hash: result.finalPayload.nullifier_hash,
                      verification_level:
                        result.finalPayload.verification_level,
                      version: result.finalPayload.version,
                    },
                    action: process.env.NEXT_PUBLIC_ACTION_NAME as string,
                    signal: "user_verification",
                  }),
                });

                if (!verifyResponse.ok) {
                  throw new Error("Verification request failed");
                }

                const data = await verifyResponse.json();
                if (data.verifyRes?.success) {
                  alert("Verification successful!");
                } else {
                  throw new Error(
                    data.verifyRes?.error || "Verification failed",
                  );
                }
              }
            } catch (error) {
              console.error("Verification failed:", error);
              alert(error.message || "Verification failed");
            }
          }}
          className="px-8 py-4 bg-green-400/80 text-white rounded-xl hover:bg-green-500 transition-all duration-200 transform hover:scale-105 font-medium text-lg shadow-lg flex items-center justify-center gap-2"
        >
          <Image src="/world_c.png" alt="World Coin" width={24} height={24} />
          Verify with World ID
        </button>
      </div>
    </>
  );
};
