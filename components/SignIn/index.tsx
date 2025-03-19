"use client";
import { MiniKit, VerificationLevel } from "@worldcoin/minikit-js";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { WalletAuth } from "../WalletAuth";

// Assume this function exists for Mixpanel integration
const trackEvent = (eventName: string, properties: any) => {
  // Your Mixpanel tracking logic here
  console.log(`Mixpanel event triggered: ${eventName}`, properties);
};


export const SignIn = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [bookmarkedFiles, setBookmarkedFiles] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedAudioFile, setSelectedAudioFile] = useState<string | null>(
    null,
  );
  const [walletAddress, setWalletAddress] = useState<string>("");
  const filesPerPage = 5;
  const router = useRouter();

  useEffect(() => {
    const storedAddress = localStorage.getItem("walletAddress");
    if (storedAddress) {
      setWalletAddress(storedAddress);
    }
  }, []);

  useEffect(() => {
    const loadBookmarkedFiles = () => {
      const bookmarked = JSON.parse(
        localStorage.getItem("bookmarkedAudios") || "[]",
      );
      setBookmarkedFiles(bookmarked);
    };

    loadBookmarkedFiles();
    window.addEventListener("storage", loadBookmarkedFiles);
    return () => window.removeEventListener("storage", loadBookmarkedFiles);
  }, []);

  const handleAddressChange = (address: string) => {
    setWalletAddress(address);
    if (address) {
      localStorage.setItem("walletAddress", address);
    } else {
      localStorage.removeItem("walletAddress");
    }
  };

  const playAudioFile = async (file: string) => {
    try {
      setSelectedAudioFile(null);
      const response = await fetch(`/api/upload-audio?file=${file}`);
      if (!response.ok) throw new Error("Failed to fetch audio");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setSelectedAudioFile(url);

      // Track bookmark click in Mixpanel
      trackEvent("Revisit of Audio Bookmark", {
        timestamp: new Date().toISOString(),
        storage_path: file,
        wallet_address: localStorage.getItem("walletAddress") || "anonymous",
        user_agent: navigator.userAgent,
        platform: navigator.platform,
        screen_resolution: `${window.screen.width}x${window.screen.height}`
      });
    } catch (error) {
      console.error("Error playing audio:", error);
      alert("Failed to play audio");
    }
  };

  const [trackingComplete, setTrackingComplete] = useState(false);

  const handlePlayGame = async () => {
    const walletAddress = localStorage.getItem("walletAddress") || "";
    try {
      const response = await fetch("/api/track-gameplay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          walletAddress,
          timestamp: new Date().toISOString(),
          unix_timestamp: Date.now(),
        }),
      });

      if (response.ok) {
        setTrackingComplete(true);
      }
    } catch (error) {
      console.error("Failed to track game start:", error);
    }
  };

  const handleStartGame = () => {
    router.push("/gameplay");
  };

  const handleTestingTokens = () => {
    router.push("/testing-tokens");
  };

  const handleBypass = () => {
    router.push("/verified");
  };

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
        <div className="absolute inset-0 rounded-full animate-pulse bg-blue-500/20 filter blur-xl"></div>
      </div>

      <div className="relative w-full">
        <button 
          onClick={handleBypass}
          disabled
          className="absolute top-0 right-0 p-2 bg-black text-white rounded-full transition-colors opacity-0 cursor-not-allowed"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
      <div className="flex flex-col gap-4">
        {!walletAddress ? (
          <WalletAuth onAddressChange={handleAddressChange} />
        ) : (
          <>
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
                    verification_level: VerificationLevel.Device,
                  };

                  const { finalPayload } =
                    await MiniKit.commandsAsync.verify(verifyPayload);

                  if (finalPayload.status === "success") {
                    const verifyResponse = await fetch("/api/verify", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        payload: finalPayload,
                        action: process.env.NEXT_PUBLIC_ACTION_NAME as string,
                        signal: "user_verification",
                      }),
                    });

                    if (!verifyResponse.ok) {
                      throw new Error("Verification request failed");
                    }

                    const data = await verifyResponse.json();
                    console.log("Verification response data:", data);
                    console.log("verifyRes object:", data.verifyRes);
                    console.log("Success value:", data.verifyRes?.success);

                    if (data.verifyRes?.success) {
                      console.log("Verification succeeded!");
                      localStorage.setItem("worldcoin_verified", "true");
                      router.push("/verified");
                    } else {
                      console.log("Verification failed with data:", data);
                      throw new Error(
                        data.verifyRes?.error || "Verification failed",
                      );
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
              className="px-8 py-4 bg-purple-200 text-purple-900 border-2 border-purple-600 rounded-xl hover:bg-purple-300 transition-all duration-200 transform hover:scale-105 font-medium text-lg shadow-lg flex items-center justify-center gap-2"
            >
              <Image
                src="/world_c.png"
                alt="World Coin"
                width={24}
                height={24}
              />
              {isVerifying ? "Verifying..." : "Verify with World ID"}
            </button>

            {bookmarkedFiles.length > 0 && (
              <div className="w-full max-w-md">
                <div className="max-h-80 overflow-y-auto bg-purple-900/20 p-4 rounded-lg">
                  {[...bookmarkedFiles]
                    .reverse()
                    .slice(currentPage * filesPerPage, (currentPage + 1) * filesPerPage)
                    .map((file, index) => {
                      const globalIndex = bookmarkedFiles.length - (currentPage * filesPerPage + index);
                      return (
                        <div
                          key={index}
                          onClick={() => {
                            playAudioFile(file);
                            trackEvent("Revisit of Audio Bookmark", {
                              audioPath: file,
                              timestamp: new Date().toISOString(),
                              wallet_address: localStorage.getItem("walletAddress") || "anonymous"
                            });
                          }}
                          className="text-white text-sm mb-2 p-2 bg-purple-800/20 rounded cursor-pointer hover:bg-purple-700/20"
                        >
                          🎵 Prayer #{globalIndex}
                        </div>
                      );
                    })}
                </div>
                {selectedAudioFile && (
                  <audio
                    controls
                    src={selectedAudioFile}
                    className="mt-4 w-full"
                    autoPlay
                  />
                )}
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                    disabled={currentPage === 0}
                    className="px-4 py-2 bg-purple-400/80 text-white rounded-lg disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-white">
                    Page {currentPage + 1} of {Math.ceil(bookmarkedFiles.length / filesPerPage)}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(Math.ceil(bookmarkedFiles.length / filesPerPage) - 1, prev + 1))}
                    disabled={currentPage >= Math.ceil(bookmarkedFiles.length / filesPerPage) - 1}
                    className="px-4 py-2 bg-purple-400/80 text-white rounded-lg disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {audioUrl && (
              <audio controls src={audioUrl} className="mt-4 w-full" />
            )}
          </>
        )}
      </div>
    </>
  );
};