"use client";
import { MiniKit, VerificationLevel } from "@worldcoin/minikit-js";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export const SignIn = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const router = useRouter();

  return (
    <>
      <div className="relative">
        <Image
          src="/bendiga_logo.png"
          alt="Bendiga Logo"
          width={200}
          height={200}
          priority
          className="mb-8 animate-glow"
        />
        <div className="absolute inset-0 rounded-full animate-pulse bg-purple-500/20 filter blur-xl"></div>
      </div>

      <div className="flex flex-col gap-4">
        <button
          onClick={async () => {
            if (!MiniKit.isInstalled()) {
              alert("Please install World App");
              return;
            }
            setIsVerifying(true);
            try {
              const verifyPayload = {
                action: process.env.NEXT_PUBLIC_ACTION_NAME as string,
                signal: "user_verification",
                verification_level: VerificationLevel.Device
              };

              const { finalPayload } = await MiniKit.commandsAsync.verify(verifyPayload);

              if (finalPayload.status === "success") {
                const verifyResponse = await fetch("/api/verify", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    payload: finalPayload,
                    action: process.env.NEXT_PUBLIC_ACTION_NAME as string,
                    signal: "user_verification"
                  }),
                });

                if (!verifyResponse.ok) {
                  throw new Error("Verification request failed");
                }

                const data = await verifyResponse.json();

                if (data.verifyRes?.success) {
                  console.log("Verification succeeded!");
                  localStorage.setItem('worldcoin_verified', 'true');
                  router.push("/verified");
                } else {
                  throw new Error(data.verifyRes?.error || "Verification failed");
                }
              }
            } catch (error) {
              console.error("Verification failed:", error);
              alert(error.message || "Verification failed");
            } finally {
              setIsVerifying(false);
            }
          }}
          disabled={isVerifying}
          className="px-8 py-4 bg-purple-400/80 text-white rounded-xl hover:bg-purple-500 transition-all duration-200 transform hover:scale-105 font-medium text-lg shadow-lg flex items-center justify-center gap-2"
        >
          <Image src="/world_c.png" alt="World Coin" width={24} height={24} />
          {isVerifying ? "Verifying..." : "Verify with World ID"}
        </button>
      </div>

      {/* Display stored audio tracks with pagination */}
      <div className="mt-8">
        <h3 className="text-white text-lg mb-4">Your Saved Prayers</h3>
        {(() => {
          try {
            const [currentPage, setCurrentPage] = useState(1);
            const itemsPerPage = 3;
            const bookmarked = JSON.parse(localStorage.getItem('bookmarkedAudios') || '[]');
            const totalPages = Math.ceil(bookmarked.length / itemsPerPage);

            const currentItems = bookmarked.slice(
              (currentPage - 1) * itemsPerPage,
              currentPage * itemsPerPage
            );

            return bookmarked.length > 0 ? (
              <>
                <div className="space-y-4">
                  {currentItems.map((path: string, index: number) => (
                    <div key={index} className="bg-purple-500/20 p-4 rounded-lg">
                      <audio controls src={`/api/upload-audio?file=${encodeURIComponent(path)}`} className="w-full" />
                    </div>
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-4">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 bg-purple-500/50 rounded-lg disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <span className="text-white px-2">
                      {currentPage} / {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 bg-purple-500/50 rounded-lg disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p className="text-gray-400">No saved prayers yet</p>
            );
          } catch (error) {
            console.error('Error loading bookmarked audios:', error);
            return <p className="text-red-400">Error loading saved prayers</p>;
          }
        })()}
      </div>
    </>
  );
};