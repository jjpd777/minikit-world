"use client";
import { PrayerForm } from "@/components/PrayerForm";

import { trackEvent } from "@/lib/mixpanel";

import { ClaimTokens } from "@/components/ClaimTokens";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import ReactConfetti from "react-confetti";

// AWESOME PROGRESS

export default function VerifiedPage() {
  const [prayer, setPrayer] = useState("");
  const [showPrayer, setShowPrayer] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [hasGeneratedAudio, setHasGeneratedAudio] = useState(false);
  const [audioData, setAudioData] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [storagePath, setStoragePath] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const confettiRef = useRef<HTMLDivElement>(null);

  const handleBookmark = async () => {
    const bookmarked = JSON.parse(
      localStorage.getItem("bookmarkedAudios") || "[]",
    );
    if (!bookmarked.includes(storagePath)) {
      const newBookmarked = [...bookmarked, storagePath];
      localStorage.setItem("bookmarkedAudios", JSON.stringify(newBookmarked));

      // Track bookmark event in Mixpanel
      trackEvent('Prayer Bookmarked', {
        timestamp: new Date().toISOString(),
        wallet_address: localStorage.getItem("walletAddress") || 'anonymous',
        prayer_length: prayer.length,
        prayer_text: prayer,
        language: localStorage.getItem("lastLanguage") || "",
        religion: localStorage.getItem("lastReligion") || "",
        intentions: localStorage.getItem("lastIntentions") || "",
        has_audio: hasGeneratedAudio,
        storage_path: storagePath,
        user_agent: navigator.userAgent,
        platform: navigator.platform,
        screen_resolution: `${window.screen.width}x${window.screen.height}`
      });

      console.log("Audio bookmarked:", storagePath);
      alert("Audio bookmarked successfully!");
      setIsBookmarked(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 8000);
    } else {
      alert("This audio is already bookmarked!");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center p-4 sm:p-24 bg-gradient-to-b from-blue-50 to-yellow-50">
      {showConfetti && (
        <ReactConfetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
        />
      )}
      {!showPrayer ? (
        <PrayerForm
          onPrayerGenerated={(newPrayer) => {
            setPrayer(newPrayer);
            setShowPrayer(true);
          }}
        />
      ) : (
        <div className="flex flex-col items-center gap-4 w-full max-w-[1012px]"> {/* Increased width by 10% */}
          <div className="w-full min-w-[330px] h-[575px] overflow-y-auto p-8 rounded-xl bg-blue-100/50 shadow-lg border border-blue-200"> {/* Increased max-height by 15% */}
            {prayer ? (
              <p className="text-gray-700 text-lg leading-relaxed"> {/* Decreased font size by 15% */} {prayer}</p>
            ) : (
              <p className="text-red-600 text-xl text-center">Failed to generate prayer. Please try again.</p>
            )}
          </div>
          <div className="space-y-4 w-full ml-[-20px]">
            <div className="flex gap-4 justify-between w-full">
              <button
                onClick={() => setShowPrayer(false)}
                className="flex-1 px-4 py-2 bg-blue-500/80 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {storagePath && (
                <button
                  onClick={handleBookmark}
                  className={`w-full px-4 py-2 ${isBookmarked ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"} text-white rounded-lg transition-colors flex items-center justify-center gap-2`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                  </svg>
                </button>
              )}
              <a
                href={`https://wa.me/?text=${encodeURIComponent(prayer)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={async () => {
                  const storedWalletAddress =
                    localStorage.getItem("walletAddress") || "";

                  // Track WhatsApp share in Mixpanel with enhanced data
                  trackEvent('Share via WhatsApp', {
                    timestamp: new Date().toISOString(),
                    wallet_address: storedWalletAddress,
                    prayer_length: prayer.length,
                    prayer_text: prayer,
                    language: localStorage.getItem("lastLanguage") || "",
                    religion: localStorage.getItem("lastReligion") || "",
                    intentions: localStorage.getItem("lastIntentions") || "",
                    has_audio: hasGeneratedAudio,
                    user_agent: navigator.userAgent,
                    platform: navigator.platform,
                    screen_resolution: `${window.screen.width}x${window.screen.height}`
                  });

                  await fetch("/api/track-prayer", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      walletAddress: storedWalletAddress,
                      unix_timestamp: Date.now(),
                      timestamp: new Date().toISOString(),
                      input_text: localStorage.getItem("lastIntentions") || "",
                      religion: localStorage.getItem("lastReligion") || "",
                      language: localStorage.getItem("lastLanguage") || "",
                      source: "whatsapp",
                      llm_response: prayer,
                      voice_generation: hasGeneratedAudio,
                    }),
                  });
                }}
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
              {!audioUrl && (
                <button
                  onClick={async () => {
                    setIsGeneratingAudio(true);
                    const startTime = Date.now();

                    // Track audio generation start
                    trackEvent('Audio Prayer Generation Started', {
                      timestamp: new Date().toISOString(),
                      wallet_address: localStorage.getItem("walletAddress") || 'anonymous',
                      prayer_length: prayer.length,
                      prayer_text: prayer,
                      language: localStorage.getItem("lastLanguage") || "",
                      religion: localStorage.getItem("lastReligion") || "",
                      intentions: localStorage.getItem("lastIntentions") || "",
                      user_agent: navigator.userAgent,
                      platform: navigator.platform,
                      screen_resolution: `${window.screen.width}x${window.screen.height}`
                    });

                    try {
                      const response = await fetch("/api/generate-audio", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          text: prayer,
                        }),
                      });

                      const data = await response.json();
                      if (!response.ok || !data.success) {
                        throw new Error(
                          data.error || "Failed to generate audio",
                        );
                      }

                      const audioBase64 = data.audio;
                      setAudioData(audioBase64);
                      setAudioUrl(`data:audio/mpeg;base64,${audioBase64}`);

                      // Automatically upload the audio
                      const binaryStr = atob(audioBase64);
                      const bytes = new Uint8Array(binaryStr.length);
                      for (let i = 0; i < binaryStr.length; i++) {
                        bytes[i] = binaryStr.charCodeAt(i);
                      }

                      const audioBlob = new Blob([bytes], {
                        type: "audio/mpeg",
                      });
                      const formData = new FormData();
                      formData.append(
                        "file",
                        audioBlob,
                        `prayer-${Date.now()}.mp3`,
                      );

                      const uploadResponse = await fetch("/api/upload-test", {
                        method: "POST",
                        body: formData,
                      });

                      if (!uploadResponse.ok) {
                        throw new Error(
                          `Upload failed: ${uploadResponse.status}`,
                        );
                      }

                      const uploadData = await uploadResponse.json();
                      if (uploadData.success) {
                        console.log(
                          "Audio uploaded successfully:",
                          uploadData.gsPath,
                        );
                        setStoragePath(uploadData.gsPath);
                        setHasGeneratedAudio(true);

                        // Track successful audio generation
                        trackEvent('Audio Prayer Generation Completed', {
                          timestamp: new Date().toISOString(),
                          wallet_address: localStorage.getItem("walletAddress") || 'anonymous',
                          prayer_length: prayer.length,
                          prayer_text: prayer,
                          language: localStorage.getItem("lastLanguage") || "",
                          religion: localStorage.getItem("lastReligion") || "",
                          intentions: localStorage.getItem("lastIntentions") || "",
                          generation_time_ms: Date.now() - startTime,
                          storage_path: uploadData.gsPath,
                          user_agent: navigator.userAgent,
                          platform: navigator.platform,
                          screen_resolution: `${window.screen.width}x${window.screen.height}`
                        });

                        // Track voice generation event
                        const storedWalletAddress =
                          localStorage.getItem("walletAddress") || "";
                        await fetch("/api/track-prayer", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            walletAddress: storedWalletAddress,
                            input_text:
                              localStorage.getItem("lastIntentions") || "",
                            religion:
                              localStorage.getItem("lastReligion") || "",
                            language:
                              localStorage.getItem("lastLanguage") || "",
                            llm_response: prayer,
                            voice_generation: true,
                          }),
                        });
                      } else {
                        throw new Error(uploadData.error || "Upload failed");
                      }
                    } catch (error) {
                      console.error("Error:", error);
                      alert(
                        "Failed to generate or upload audio. Please try again.",
                      );
                    } finally {
                      setIsGeneratingAudio(false);
                    }
                  }}
                  disabled={isGeneratingAudio || hasGeneratedAudio}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white border border-purple-600 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isGeneratingAudio ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="animate-spin h-5 w-5 mr-2 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                  ) : hasGeneratedAudio ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4 4H9"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              )}
            </div>

            {audioUrl && (
              <audio src={audioUrl} controls autoPlay className="mt-4 w-full" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}