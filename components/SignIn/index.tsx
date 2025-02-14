"use client";
import { MiniKit } from "@worldcoin/minikit-js";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

export const SignIn = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const uploadAudioTest = async () => {
    setIsUploading(true);
    try {
      console.log('Starting audio file fetch...');
      const response = await fetch('/audio_sample.mp3');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log('Audio file fetched successfully');
      
      const audioBlob = await response.blob();
      console.log('Audio blob created:', {
        size: audioBlob.size,
        type: audioBlob.type
      });
      
      console.log('Creating storage reference...');
      const storageRef = ref(storage, 'test/audio_sample.mp3');
      console.log('Storage reference created:', storageRef);
      
      console.log('Starting upload...');
      const uploadResult = await uploadBytes(storageRef, audioBlob);
      console.log('Upload completed:', uploadResult);
      
      console.log('Getting download URL...');
      const downloadURL = await getDownloadURL(storageRef);
      console.log('Download URL obtained:', downloadURL);
      
      alert('Audio uploaded successfully! Check console for URL');
    } catch (error) {
      console.error('Detailed error information:', {
        message: error.message,
        code: error.code,
        name: error.name,
        stack: error.stack
      });
      alert(`Failed to upload audio: ${error.message}`);
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
          {isUploading ? "Uploading..." : "Test Firebase Upload"}
        </button>
      </div>
    </>
  );
};