
"use client";
import { MiniKit } from "@worldcoin/minikit-js";
import { useState } from "react";

export const SignMessage = () => {
  const [signature, setSignature] = useState("");

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
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={handleSignMessage}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Sign Test Message
      </button>
      {signature && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg break-all">
          <p className="text-sm font-mono">Signature: {signature}</p>
        </div>
      )}
    </div>
  );
};
