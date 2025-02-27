
"use client";
import { MiniKit } from "@worldcoin/minikit-js";
import { useState } from "react";
import { useSession } from "next-auth/react";

export const MessageOnChain = () => {
  const [message, setMessage] = useState("");
  const [signature, setSignature] = useState("");
  const { data: session } = useSession();

  const signAndWriteMessage = async () => {
    try {
      if (!message) {
        alert("Please enter a message");
        return;
      }
      
      if (!MiniKit.isInstalled()) {
        alert("Please install World App to send messages");
        return;
      }

      // First sign the message
      const signResult = await MiniKit.commandsAsync.signMessage({
        message
      });

      if (signResult?.finalPayload?.status !== "success") {
        alert("Failed to sign message");
        return;
      }

      setSignature(signResult.finalPayload.signature);

      // Then write both message and signature to chain
      const payload = {
        to: "0x0000000000000000000000000000000000000000",
        data: `0x${Buffer.from(JSON.stringify({
          message,
          signature: signResult.finalPayload.signature
        })).toString("hex")}`,
      };

      const result = await MiniKit.commandsAsync.sendTransaction(payload);
      if (result?.finalPayload?.status === "success") {
        alert("Signed message written on chain!");
        setMessage("");
        setSignature("");
      }
    } catch (error) {
      console.error("Error writing message:", error);
      alert("Failed to write message");
    }
  };

  if (!session) {
    return (
      <div className="text-center p-4">
        Please sign in to write messages on chain
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter your message"
        className="p-2 border rounded"
      />
      <button
        onClick={signAndWriteMessage}
        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
      >
        Sign & Write Message On Chain
      </button>
      {signature && (
        <div className="mt-2 text-sm text-gray-200 break-all">
          Signature: {signature}
        </div>
      )}
    </div>
  );
};
