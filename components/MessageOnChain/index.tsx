
"use client";
import { MiniKit } from "@worldcoin/minikit-js";
import { useState } from "react";

export const MessageOnChain = () => {
  const [message, setMessage] = useState("");

  const writeMessage = async () => {
    try {
      if (!message) return;
      
      const payload = {
        to: "0x0000000000000000000000000000000000000000", // Zero address for message only
        data: `0x${Buffer.from(message).toString("hex")}`, // Convert message to hex
      };

      if (MiniKit.isInstalled()) {
        const result = await MiniKit.commandsAsync.sendTransaction(payload);
        if (result?.finalPayload?.status === "success") {
          alert("Message written on chain!");
          setMessage("");
        }
      }
    } catch (error) {
      console.error("Error writing message:", error);
    }
  };

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
        onClick={writeMessage}
        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
      >
        Write Message On Chain
      </button>
    </div>
  );
};
