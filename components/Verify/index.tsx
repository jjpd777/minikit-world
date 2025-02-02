
"use client";
import {
  MiniKit,
  VerificationLevel,
  ISuccessResult,
  MiniAppVerifyActionErrorPayload,
  IVerifyResponse,
} from "@worldcoin/minikit-js";
import { useCallback, useState } from "react";

export type VerifyCommandInput = {
  action: string;
  signal?: string;
  verification_level?: VerificationLevel;
};

const verifyPayload: VerifyCommandInput = {
  action: process.env.NEXT_PUBLIC_ACTION_NAME!,
  signal: "",
  verification_level: VerificationLevel.Orb,
};

export const VerifyBlock = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleVerify = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!MiniKit.isInstalled()) {
        setError("Please open this app in World App to verify");
        return;
      }

      console.log("Initiating verification with payload:", verifyPayload);
      const response = await MiniKit.commandsAsync.verify(verifyPayload);
      console.log("Verification response:", response);
      
      const { finalPayload } = response;

      if (finalPayload.status === "error") {
        console.error("Verification command error:", finalPayload);
        throw new Error(finalPayload.message || "Verification failed");
      }

      const verifyResponse = await fetch(`/api/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payload: finalPayload as ISuccessResult,
          action: verifyPayload.action,
          signal: verifyPayload.signal,
        }),
      });

      const verifyResponseJson = await verifyResponse.json();

      if (verifyResponseJson.status === 200) {
        setSuccess(true);
        console.log("Verification successful!", verifyResponseJson);
      } else {
        throw new Error(verifyResponseJson.message || "Verification failed");
      }
    } catch (err: any) {
      console.error("Verification error:", err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 p-4 border rounded-lg bg-white shadow-sm">
      <h2 className="text-xl font-semibold">World ID Verification</h2>
      
      <button
        className={`px-6 py-3 rounded-lg font-medium transition-colors ${
          isLoading
            ? "bg-gray-300 cursor-not-allowed"
            : success
            ? "bg-green-500 text-white"
            : "bg-blue-500 hover:bg-blue-600 text-white"
        }`}
        onClick={handleVerify}
        disabled={isLoading}
      >
        {isLoading ? "Verifying..." : success ? "Verified!" : "Verify with World ID"}
      </button>

      {error && (
        <div className="text-red-500 text-sm mt-2 text-center">
          {error}
        </div>
      )}

      {success && (
        <div className="text-green-500 text-sm mt-2 text-center">
          Verification successful!
        </div>
      )}
    </div>
  );
};
