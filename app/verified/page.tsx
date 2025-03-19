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
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'warning' | 'error' } | null>(null);


  const handleBookmark = async () => {
    const bookmarked = JSON.parse(
      localStorage.getItem("bookmarkedAudios") || "[]",
    );
    if (!bookmarked.includes(storagePath)) {
      const newBookmarked = [...bookmarked, storagePath];
      localStorage.setItem("bookmarkedAudios", JSON.stringify(newBookmarked));

      // Track bookmark event in Mixpanel
      trackEvent("Prayer Bookmarked", {
        timestamp: new Date().toISOString(),
        wallet_address: localStorage.getItem("walletAddress") || "anonymous",
        prayer_length: prayer.length,
        prayer_text: prayer,
        language: localStorage.getItem("lastLanguage") || "",
        religion: localStorage.getItem("lastReligion") || "",
        intentions: localStorage.getItem("lastIntentions") || "",
        has_audio: hasGeneratedAudio,
        storage_path: storagePath,
        user_agent: navigator.userAgent,
        platform: navigator.platform,
        screen_resolution: `${window.screen.width}x${window.screen.height}`,
      });

      console.log("Audio bookmarked:", storagePath);
      // alert("Audio bookmarked successfully!");
      setIsBookmarked(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 8000);
    } else {
      // alert("This audio is already bookmarked!");
    }
  };

  const checkAudioLimit = (force = false) => {
    if (force) return true;
    
    const generations = JSON.parse(localStorage.getItem('audioGenerations') || '[]');
    const last24Hours = Date.now() - 24 * 60 * 60 * 1000;
    const recentGenerations = generations.filter((timestamp: number) => timestamp > last24Hours);
    const hasReachedLimit = recentGenerations.length >= 3;
    
    if (hasReachedLimit) {
      trackEvent("Audio Generation Limit Reached", {
        timestamp: new Date().toISOString(),
        wallet_address: localStorage.getItem("walletAddress") || "anonymous",
        generations_count: recentGenerations.length,
        generations_timestamps: recentGenerations,
        user_agent: navigator.userAgent,
        platform: navigator.platform,
        screen_resolution: `${window.screen.width}x${window.screen.height}`
      });
    }
    
    return !hasReachedLimit;
  };

  const generateAudio = async (force = false) => {
    const voiceGens = JSON.parse(localStorage.getItem('voiceGenerations') || '[]');
    if (voiceGens.length === 0) {
      // First generation, store timestamp
      localStorage.setItem('voiceGenerations', JSON.stringify([Date.now()]));
    } else {
      const firstGenTime = voiceGens[0];
      const timeSinceFirst = Date.now() - firstGenTime;
      const hasExpired = timeSinceFirst > 24 * 60 * 60 * 1000;

      if (hasExpired) {
        // Reset if 24h passed since first generation
        localStorage.setItem('voiceGenerations', JSON.stringify([Date.now()]));
      } else if (voiceGens.length >= 5) {
        setNotification({ message: 'Limit reached for voice-gen', type: 'warning' });
        return;
      } else {
        // Add new timestamp
        voiceGens.push(Date.now());
        localStorage.setItem('voiceGenerations', JSON.stringify(voiceGens));
      }
    }
    setIsGeneratingAudio(true);
    const startTime = Date.now();

    // Track audio generation start
    trackEvent("Audio Prayer Generation Started", {
      timestamp: new Date().toISOString(),
      wallet_address:
        localStorage.getItem("walletAddress") || "anonymous",
      prayer_length: prayer.length,
      prayer_text: prayer,
      language: localStorage.getItem("lastLanguage") || "",
      religion: localStorage.getItem("lastReligion") || "",
      intentions: localStorage.getItem("lastIntentions") || "",
      user_agent: navigator.userAgent,
      platform: navigator.platform,
      screen_resolution: `${window.screen.width}x${window.screen.height}`,
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
        trackEvent("Audio Prayer Generation Completed", {
          timestamp: new Date().toISOString(),
          wallet_address:
            localStorage.getItem("walletAddress") ||
            "anonymous",
          prayer_length: prayer.length,
          prayer_text: prayer,
          language: localStorage.getItem("lastLanguage") || "",
          religion: localStorage.getItem("lastReligion") || "",
          intentions:
            localStorage.getItem("lastIntentions") || "",
          generation_time_ms: Date.now() - startTime,
          storage_path: uploadData.gsPath,
          user_agent: navigator.userAgent,
          platform: navigator.platform,
          screen_resolution: `${window.screen.width}x${window.screen.height}`,
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

        // Update audio generation count in local storage
        const generations = JSON.parse(localStorage.getItem('audioGenerations') || '[]');
        generations.push(Date.now());
        localStorage.setItem('audioGenerations', JSON.stringify(generations));

      } else {
        throw new Error(uploadData.error || "Upload failed");
      }
    } catch (error) {
      console.error("Error:", error);
      setNotification({ message: "Failed to generate or upload audio. Please try again.", type: 'error' });
    } finally {
      setIsGeneratingAudio(false);
    }
  };


  return (
    <div className="flex min-h-screen flex-col items-center p-24 bg-gradient-to-b from-blue-50 to-yellow-50">
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
        <div className="flex flex-col items-center gap-4 w-full max-w-[800px]">
          <div className="w-full min-w-[300px] h-[500px] overflow-y-auto p-8 rounded-xl bg-blue-100/50 shadow-lg border border-blue-200">
            {prayer ? (
              <p className="text-gray-700 text-xl leading-relaxed">{prayer}</p>
            ) : (
              <p className="text-red-600 text-xl text-center">
                Failed to generate prayer. Please try again.
              </p>
            )}
          </div>
          <div className="space-y-4 w-full ml-[-20px]">
            <div className="flex flex-col gap-2">
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
                      d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
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
                  href={`https://wa.me/?text=${encodeURIComponent(prayer + "\t bendiga.app")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={async () => {
                    const storedWalletAddress =
                      localStorage.getItem("walletAddress") || "";

                    // Track WhatsApp share in Mixpanel with enhanced data
                    trackEvent("Share via WhatsApp", {
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
                      screen_resolution: `${window.screen.width}x${window.screen.height}`,
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
                    onClick={generateAudio}
                    disabled={isGeneratingAudio || hasGeneratedAudio}
                    className="flex-1 px-4 py-2 bg-white text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-Li50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isGeneratingAudio ? "..." : hasGeneratedAudio ? "" : "gen✨"}
                  </button>
                )}
              </div>

              {notification && (
                <div className="relative">
                  <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                  />
                  {notification.type === 'warning' && (
                    <button
                      onClick={() => {
                        setNotification(null);
                        generateAudio(true);
                      }}
                      className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Force Generation
                    </button>
                  )}
                </div>
              )}

              {audioUrl && (
                <audio src={audioUrl} controls autoPlay className="mt-4 w-full" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Notification({ message, type, onClose }: { message: string; type: 'success' | 'warning' | 'error'; onClose: () => void }) {
  return (
    <div className={`border p-4 rounded-md shadow-md bg-white ${type === 'success' ? 'border-green-400 text-green-700' : type === 'warning' ? 'border-yellow-400 text-yellow-700' : 'border-red-400 text-red-700'}`}>
      <p>{message}</p>
      <button onClick={onClose} className="float-right text-gray-500">X</button>
    </div>
  );
}