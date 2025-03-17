
"use client";
import { IDKitWidget } from "@worldcoin/idkit";
import { useState } from "react";
import { useRouter } from "next/navigation";

export const VerifyBlock = () => {
  const [result, setResult] = useState<string>("");
  const router = useRouter();

  const handleVerify = async (proof: any) => {
    try {
      console.log("Starting verification with proof:", proof);

      const response = await fetch("/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          merkle_root: proof.merkle_root,
          nullifier_hash: proof.nullifier_hash,
          proof: proof.proof,
          verification_level: proof.verification_level,
          action: process.env.NEXT_PUBLIC_ACTION_NAME,
          signal: "user_verification"
        }),
      });

      const data = await response.json();
      console.log("Verification response:", data);

      if (data.verifyRes?.success) {
        setResult("Verification successful!");
        localStorage.setItem('worldcoin_verified', 'true');
        router.push("/verified");
      } else {
        setResult(
          `Verification failed: ${data.verifyRes?.error || "Unknown error"}`,
        );
      }
    } catch (error) {
      console.error("Verification error:", error);
      setResult(`Verification failed: ${error.message}`);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 border rounded-lg bg-blue-100/50 shadow-lg border-blue-200">
      <h2 className="text-xl font-semibold text-gray-700">World ID Verification</h2>

      <IDKitWidget
        app_id={process.env.NEXT_PUBLIC_APP_ID as `app_${string}`}
        action={process.env.NEXT_PUBLIC_ACTION_NAME as string}
        onSuccess={handleVerify}
        handleVerify={handleVerify}
        signal="user_verification"
      >
        {({ open }) => (
          <button
            onClick={open}
            className="px-6 py-3 rounded-lg font-medium bg-blue-500/80 hover:bg-blue-600 text-white transition-all duration-200 shadow-md"
          >
            Verify with World ID
          </button>
        )}
      </IDKitWidget>

      {result && (
        <div
          className={`text-sm mt-2 text-center ${
            result.includes("successful") ? "text-green-500" : "text-red-500"
          }`}
        >
          {result}
        </div>
      )}
    </div>
  );
};
