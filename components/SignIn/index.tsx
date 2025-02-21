"use client";
import { MiniKit, VerificationLevel } from "@worldcoin/minikit-js";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { WalletAuth } from "../WalletAuth";

export const SignIn = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [bookmarkedFiles, setBookmarkedFiles] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedAudioFile, setSelectedAudioFile] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const filesPerPage = 5;
  const router = useRouter();

  useEffect(() => {
    const storedAddress = localStorage.getItem('walletAddress');
    if (storedAddress) {
      setWalletAddress(storedAddress);
    }
  }, []);

  useEffect(() => {
    const loadBookmarkedFiles = () => {
      const bookmarked = JSON.parse(localStorage.getItem('bookmarkedAudios') || '[]');
      setBookmarkedFiles(bookmarked);
    };

    loadBookmarkedFiles();
    window.addEventListener('storage', loadBookmarkedFiles);
    return () => window.removeEventListener('storage', loadBookmarkedFiles);
  }, []);

  const handleAddressChange = (address: string) => {
    setWalletAddress(address);
    if (address) {
      localStorage.setItem('walletAddress', address);
    } else {
      localStorage.removeItem('walletAddress');
    }
  };

  const playAudioFile = async (gsPath: string) => {
    try {
      const filePath = gsPath.replace(/^gs:\/\/[^/]+\//, '');
      const response = await fetch(`/api/upload-audio?file=${encodeURIComponent(filePath)}`, {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch audio file');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setSelectedAudioFile(url);
    } catch (error) {
      console.error('Error playing audio file:', error);
      alert('Failed to play audio file');
    }
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
        <div className="absolute inset-0 rounded-full animate-pulse bg-purple-500/20 filter blur-xl"></div>
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
                    console.log("Verification response data:", data);
                    console.log("verifyRes object:", data.verifyRes);
                    console.log("Success value:", data.verifyRes?.success);

                    if (data.verifyRes?.success) {
                      console.log("Verification succeeded!");
                      localStorage.setItem('worldcoin_verified', 'true');
                      router.push("/verified");
                    } else {
                      console.log("Verification failed with data:", data);
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

            {/* <button
              onClick={() => {
                localStorage.removeItem('walletAddress');
                setWalletAddress('');
                handleAddressChange(''); // Call to update the state consistently
              }}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm"
            >
              Clear Storage
            </button> */}

            {bookmarkedFiles.length > 0 && (
              <div className="mt-4 w-full">
                <div className="max-h-80 overflow-y-auto bg-purple-900/20 p-4 rounded-lg">
                  {[...bookmarkedFiles]
                    .reverse()
                    .slice(currentPage * filesPerPage, (currentPage + 1) * filesPerPage)
                    .map((file, index) => {
                      const globalIndex = bookmarkedFiles.length - (currentPage * filesPerPage + index);
                      return (
                        <div
                          key={index}
                          onClick={() => playAudioFile(file)}
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
              <audio
                controls
                src={audioUrl}
                className="mt-4 w-full"
              />
            )}
          </>
        )}
      </div>
    </>
  );
};