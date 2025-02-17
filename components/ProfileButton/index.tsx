
"use client";
import { useState } from 'react';
import { WalletAuth } from '../WalletAuth';
import Image from 'next/image';
import { MiniKit, tokenToDecimals, Tokens } from "@worldcoin/minikit-js";

export const ProfileButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 p-2 rounded-full bg-purple-500/30 hover:bg-purple-500/50 transition-all z-50"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-8 rounded-xl max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl text-white font-bold">Profile</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-800 rounded-full"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <WalletAuth />
            <div className="mt-4">
              <button
                onClick={async () => {
                  if (!MiniKit.isInstalled()) {
                    alert("Please install World App to send payments");
                    return;
                  }

                  try {
                    const initRes = await fetch('/api/initiate-payment', {
                      method: 'POST',
                    });
                    const { id } = await initRes.json();

                    const payload = {
                      reference: id,
                      to: "0xaBF8609C0678948b1FA06498cB4508a65bB1a0f2",
                      tokens: [{
                        symbol: Tokens.WLD,
                        token_amount: tokenToDecimals(0.1, Tokens.WLD).toString()
                      }],
                      description: "Payment via World ID"
                    };

                    const result = await MiniKit.commandsAsync.pay(payload);
                    
                    if (result?.finalPayload?.status === "success") {
                      const confirmRes = await fetch('/api/confirm-payment', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ payload: result.finalPayload }),
                      });
                      
                      const payment = await confirmRes.json();
                      if (payment.success) {
                        alert("Payment sent successfully!");
                      } else {
                        throw new Error("Payment confirmation failed");
                      }
                    }
                  } catch (error) {
                    console.error("Payment failed:", error);
                    alert("Payment failed: " + error.message);
                  }
                }}
                className="w-full px-4 py-2 mt-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Send 0.1 WLD
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
