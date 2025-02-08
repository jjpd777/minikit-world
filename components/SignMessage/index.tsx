
"use client";
import { MiniKit } from "@worldcoin/minikit-js";
import { useState } from "react";
import { useSession } from "next-auth/react";

export const SignMessage = () => {
  const { data: session } = useSession();
  const [signature, setSignature] = useState("");

  if (!session) return null;

  const handleSignMessage = async () => {
    try {
      if (!MiniKit.isInstalled()) {
        alert("Please install World App to sign messages");
        return;
      }

      const message = "God Bless America";

      const result = await MiniKit.commandsAsync.signMessage({
        message
      });

      if (result?.finalPayload?.status === "success") {
        setSignature(result.finalPayload.signature);
        alert("Message signed successfully!");
      }
    } catch (error) {
      console.error("Signing failed:", error);
      alert("Failed to sign message");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <button
        onClick={handleSignMessage}
        className="px-6 py-3 bg-green-600/80 text-white rounded-xl hover:bg-green-700 transition-colors duration-200"
      >
        Sign Test Message
      </button>
      {signature && (
        <div className="mt-4 p-4 bg-gray-700/50 rounded-xl break-all w-full">
          <p className="text-sm font-mono text-gray-200">Signature: {signature}</p>
        </div>
      )}
    </div>
  );
};
