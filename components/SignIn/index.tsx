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
          <div className="flex justify-end w-full gap-4 mt-0">
            <WalletAuth />
            <button
              onClick={() => signOut()}
              className="px-4 py-2 bg-red-500/80 text-white rounded-xl hover:bg-red-600 transition-colors duration-200"
            >
              Sign out
            </button>
          </div>
        )}
        <div className="w-full p-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-purple-500/20 shadow-lg">
          <div className="flex flex-col items-center mb-8">
            <Image
              src="/bendiga_logo.png"
              alt="Bendiga Logo"
              width={150}
              height={150}
              priority
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
      <Image
        src="/bendiga_logo.png"
        alt="Bendiga Logo"
        width={300}
        height={300}
        priority
        className="mb-8"
      />
      <h1 className="text-3xl text-white text-center font-bold mb-8">
        Build a prayer habit with A.I.
      </h1>
      <button
        onClick={() => signIn("worldcoin")}
        className="px-8 py-4 bg-purple-400/80 text-white rounded-xl hover:bg-purple-500 transition-all duration-200 transform hover:scale-105 font-medium text-lg shadow-lg"
      >
        Sign in
      </button>
    </>
  );
};