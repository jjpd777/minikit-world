
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
          proof,
          action: process.env.NEXT_PUBLIC_ACTION_NAME,
          signal: "user_verification",
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
    <div className="flex flex-col items-center gap-4 p-4 border rounded-lg bg-white/10 shadow-sm">
      <h2 className="text-xl font-semibold text-white">World ID Verification</h2>

      <IDKitWidget
        app_id={process.env.NEXT_PUBLIC_APP_ID as `app_${string}`}
        action={process.env.NEXT_PUBLIC_ACTION_NAME as string}
        onSuccess={handleVerify}
        handleVerify={handleVerify}
        verification_level="device"
        signal="user_verification"
      >
        {({ open }) => (
          <button
            onClick={open}
            className="px-6 py-3 rounded-lg font-medium bg-purple-500/80 hover:bg-purple-600 text-white transition-all duration-200"
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
