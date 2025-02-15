"use client";
import { MiniKit } from "@worldcoin/minikit-js";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";


export const SignIn = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioFiles, setAudioFiles] = useState<string[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedAudioFile, setSelectedAudioFile] = useState<string | null>(null);
  const filesPerPage = 10;
  const router = useRouter();

  const playAudioFile = async (filename: string) => {
    try {
      const response = await fetch(`/api/upload-audio?file=${encodeURIComponent(filename)}`, {
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

  const fetchAudioFiles = async () => {
    setIsFetching(true);
    try {
      const response = await fetch('/api/upload-audio?list=true', {
        method: 'GET'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch audio files');
      }

      const data = await response.json();
      setAudioFiles(data.files || []);
    } catch (error) {
      console.error('Error fetching audio files:', error);
      alert('Failed to fetch audio files');
    } finally {
      setIsFetching(false);
    }
  };

  const uploadAudioTest = async () => {
    if (!audioUrl) {
      alert('Please generate audio first');
      return;
    }

    setIsUploading(true);
    try {
      // Convert base64 to blob
      const response = await fetch(audioUrl);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append('file', blob, `${Date.now()}.mp3`);

      const uploadResponse = await fetch('/api/upload-test', {
        method: 'POST',
        body: formData
      });

      const data = await uploadResponse.json();

      if (!data.success) {
        throw new Error(data.error || 'Upload failed');
      }

      // Store the new path in localStorage
      const existingPaths = JSON.parse(localStorage.getItem('audioUrls') || '[]');
      const newPaths = [...existingPaths, data.gsPath];
      localStorage.setItem('audioUrls', JSON.stringify(newPaths));

      console.log('----------------------------------------');
      console.log('Firebase Storage gs:// path:');
      console.log(data.gsPath);
      console.log('----------------------------------------');

      alert(`Upload successful!\nStorage path: ${data.gsPath}`);
      return data.gsPath;
    } catch (error) {
      console.error('Upload failed:', error);
      alert(error.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <div className="relative">
        <Image
          src="/bendiga_logo.png"
          alt="Bendiga Logo"
          width={300}
          height={300}
          priority
          className="mb-8 animate-glow"
        />
        <div className="absolute inset-0 rounded-full animate-pulse bg-purple-500/20 filter blur-xl"></div>
      </div>
      <h1 className="text-2xl text-white text-center font-bold mb-8">
        Generate Daily Prayers
      </h1>
      <div className="flex flex-col gap-4">
        <button
          onClick={async () => {
            if (!MiniKit.isInstalled()) {
              alert("Please install World App");
              return;
            }
            setIsVerifying(true);
            try {
              const result = await MiniKit.commandsAsync.verify({
                action: process.env.NEXT_PUBLIC_ACTION_NAME as string,
                signal: "user_verification",
                verification_level: "device",
              });

              if (result?.finalPayload?.status === "success") {
                const verifyResponse = await fetch("/api/verify", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    payload: {
                      merkle_root: result.finalPayload.merkle_root,
                      nullifier_hash: result.finalPayload.nullifier_hash,
                      proof: result.finalPayload.proof,
                      verification_level: result.finalPayload.verification_level,
                      action: process.env.NEXT_PUBLIC_ACTION_NAME as string,
                      signal: "user_verification",
                    },
                    action: process.env.NEXT_PUBLIC_ACTION_NAME as string,
                    signal: "user_verification",
                  }),
                });

                if (!verifyResponse.ok) {
                  throw new Error("Verification request failed");
                }

                const data = await verifyResponse.json();
                if (data.verifyRes?.success) {
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
        <button
          onClick={uploadAudioTest}
          disabled={isUploading}
          className="mt-4 px-8 py-4 bg-blue-400/80 text-white rounded-xl hover:bg-blue-500 transition-all duration-200 transform hover:scale-105 font-medium text-lg shadow-lg flex items-center justify-center gap-2"
        >
          {isUploading ? "Uploading..." : "Test Upload"}
        </button>

        <button
          onClick={async () => {
            try {
              const response = await fetch("/api/generate-audio", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  text: "God Willing, we are poised to WIN",
                }),
              });

              const data = await response.json();
              if (!response.ok || !data.success) {
                throw new Error(data.error || "Failed to generate audio");
              }

              const audioUrl = `data:audio/mpeg;base64,${data.audio}`;
              setAudioUrl(audioUrl);
            } catch (error) {
              console.error("Error generating audio:", error);
              alert("Failed to generate audio");
            }
          }}
          className="mt-4 px-8 py-4 bg-green-400/80 text-white rounded-xl hover:bg-green-500 transition-all duration-200 transform hover:scale-105 font-medium text-lg shadow-lg flex items-center justify-center gap-2"
        >
          Test Audio Gen
        </button>

        <button
          onClick={fetchAudioFiles}
          disabled={isFetching}
          className="mt-4 px-8 py-4 bg-purple-400/80 text-white rounded-xl hover:bg-purple-500 transition-all duration-200 transform hover:scale-105 font-medium text-lg shadow-lg flex items-center justify-center gap-2"
        >
          {isFetching ? "Fetching..." : "Show Audio Files"}
        </button>

        {audioFiles.length > 0 && (
          <div className="mt-4 w-full">
            <h3 className="text-white mb-2">Stored Audio Files:</h3>
            <div className="max-h-80 overflow-y-auto bg-purple-900/20 p-4 rounded-lg">
              {audioFiles
                .slice(currentPage * filesPerPage, (currentPage + 1) * filesPerPage)
                .map((file, index) => (
                  <div 
                    key={index} 
                    onClick={() => playAudioFile(file)}
                    className="text-white text-sm mb-2 p-2 bg-purple-800/20 rounded cursor-pointer hover:bg-purple-700/20"
                  >
                    🎵 {file}
                  </div>
                ))}
            </div>
            {selectedAudioFile && (
              <audio 
                controls 
                src={selectedAudioFile}
                className="mt-4 w-full" 
                autoPlay
              />
            </div>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
                className="px-4 py-2 bg-purple-400/80 text-white rounded-lg disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-white">
                Page {currentPage + 1} of {Math.ceil(audioFiles.length / filesPerPage)}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(Math.ceil(audioFiles.length / filesPerPage) - 1, prev + 1))}
                disabled={currentPage >= Math.ceil(audioFiles.length / filesPerPage) - 1}
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
      </div>
    </>
  );
};