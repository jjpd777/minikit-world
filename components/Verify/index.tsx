"use client";
import { IDKitWidget } from "@worldcoin/idkit";
import { useState } from "react";

export const VerifyBlock = () => {
  const [result, setResult] = useState<string>("");

  const handleVerify = async (proof: any) => {
    try {
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          proof,
          action: process.env.NEXT_PUBLIC_ACTION_NAME,
          signal: "",
        }),
      });

      const data = await response.json();
      setResult(data.success ? "Verification successful!" : "Verification failed");
    } catch (error) {
      console.error(error);
      setResult("Verification failed");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 border rounded-lg bg-white shadow-sm">
      <h2 className="text-xl font-semibold">World ID Verification</h2>

      <IDKitWidget
        app_id={process.env.NEXT_PUBLIC_APP_ID as `app_${string}`}
        action={process.env.NEXT_PUBLIC_ACTION_NAME as string}
        onSuccess={handleVerify}
        handleVerify={handleVerify}
        verification_level="orb"
      >
        {({ open }) => (
          <button
            onClick={open}
            className="px-6 py-3 rounded-lg font-medium bg-blue-500 hover:bg-blue-600 text-white"
          >
            Verify with World ID
          </button>
        )}
      </IDKitWidget>

      {result && (
        <div className={`text-sm mt-2 text-center ${
          result.includes("successful") ? "text-green-500" : "text-red-500"
        }`}>
          {result}
        </div>
      )}
    </div>
  );
};