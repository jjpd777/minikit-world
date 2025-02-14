"use client";
import { PrayerForm } from "@/components/PrayerForm";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function VerifiedPage() {

const generateSpeech = async (text: string, walletAddress: string) => {
  try {
    console.log("%c[generateSpeech] Starting request to backend API...", "color: purple");
    console.log("%c[generateSpeech] Request payload:", "color: blue", { text, walletAddress });

    const response = await fetch('/api/text-to-speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        walletAddress,
      }),
    });

    console.log("%c[generateSpeech] Response status:", "color: blue", response.status);
    console.log("%c[generateSpeech] Response headers:", "color: blue", Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      console.error("%c[generateSpeech] HTTP error!", "color: red", response.status);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("%c[generateSpeech] Response data:", "color: green", data);
    return data;
  } catch (error) {
    console.error("%c[generateSpeech] Error caught:", "color: red", error);
    console.error("%c[generateSpeech] Stack trace:", "color: red", error.stack);
    throw error;
  }
};


  const router = useRouter();
  const [prayer, setPrayer] = useState("");
  const [showPrayer, setShowPrayer] = useState(false);
  const [hasAudio, setHasAudio] = useState(false);
  const [bookmarkedPrayers, setBookmarkedPrayers] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("bookmarked_prayers");
    if (saved) {
      setBookmarkedPrayers(JSON.parse(saved));
    }
  }, []);

  const toggleBookmark = () => {
    const newBookmarks = bookmarkedPrayers.includes(prayer)
      ? bookmarkedPrayers.filter((p) => p !== prayer)
      : [...bookmarkedPrayers, prayer];

    setBookmarkedPrayers(newBookmarks);
    localStorage.setItem("bookmarked_prayers", JSON.stringify(newBookmarks));
  };

  useEffect(() => {
    const isVerified = localStorage.getItem("worldcoin_verified") === "true";
    if (!isVerified) {
      router.push("/");
    }
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center p-24">
      <div className="absolute top-4 left-4">
        <button
          onClick={() => router.push("/wallet")}
          className="p-2 rounded-full bg-purple-500/30 hover:bg-purple-500/50 transition-all"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </button>
      </div>
      {!showPrayer ? (
        <PrayerForm
          onPrayerGenerated={(newPrayer) => {
            setPrayer(newPrayer);
            setShowPrayer(true);
          }}
        />
      ) : (
        <div className="flex flex-col items-center gap-4 w-full max-w-[500px]">
          <div className="flex justify-center mb-4">
            <Image
              src="/bendiga_logo.png"
              alt="Bendiga Logo"
              width={150}
              height={150}
              priority
              className="animate-glow"
              style={{ marginBottom: "-22px" }}
            />
          </div>
          <div className="w-full min-w-[300px] max-h-[300px] overflow-y-auto p-4 rounded-lg bg-gray-800/50">
            <p className="text-white text-lg">{prayer}</p>
          </div>
          <div className="flex gap-4 flex-col w-full">
            {!hasAudio && (
              <div className="flex gap-2 w-full">
                <button
                  onClick={async () => {
                    try {
                      const button = document.getElementById("generateAudioBtn");
                      if (button) {
                        button.textContent = "Generating...";
                        button.disabled = true;
                      }

                    const response = await fetch("/api/generate-audio", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        text: prayer,
                      }),
                    });

                    if (!response.ok) {
                      const error = await response.json();
                      throw new Error(
                        error.error || "Failed to generate audio",
                      );
                    }

                    const audioBlob = await response.blob();
                    const audioUrl = URL.createObjectURL(audioBlob);
                    const audioPlayer = document.getElementById(
                      "elevenlabsAudio",
                    ) as HTMLAudioElement;
                    if (audioPlayer) {
                      audioPlayer.src = audioUrl;
                      audioPlayer.style.display = "block";
                      setHasAudio(true);
                    }
                  } catch (error) {
                    console.error("Error generating audio:", error);
                    alert("Failed to generate audio. Please try again.");
                  } finally {
                    const button = document.getElementById("generateAudioBtn");
                    if (button) {
                      button.textContent = "Prayer A.I.";
                      button.disabled = false;
                    }
                  }
                }}
                id="generateAudioBtn"
                className="w-full px-4 py-2 bg-white text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 transition-colors flex items-center justify-center gap-2"
              >
                ✨A.I. voice💫
                </button>
                <button
                  onClick={async () => {
                    try {
                      console.log("%c[GENAI] Starting request...", "color: purple; font-weight: bold");
                      console.log("%c[GENAI] Prayer content:", "color: blue", prayer);
                      console.log("%c[GENAI] Using wallet:", "color: blue", "0x7777");

                      console.log("%c[GENAI] Calling generateSpeech...", "color: purple");
                      const response = await generateSpeech(prayer, "0x7777");

                      if (response.url) {
                        console.log("%c[GENAI] Success! Audio URL:", "color: green; font-weight: bold", response.url);
                      
                      console.log("%c[GENAI] Fetching audio from URL...", "color: purple");
                      const audioResponse = await fetch(response.url);
                      console.log("%c[GENAI] Audio fetch response status:", "color: blue", audioResponse.status);
                      
                      if (!audioResponse.ok) {
                        throw new Error(`Failed to fetch audio: ${audioResponse.status}`);
                      }

                      const audioBlob = await audioResponse.blob();
                      console.log("%c[GENAI] Audio blob size:", "color: blue", `${audioBlob.size} bytes`);
                      console.log("%c[GENAI] Audio blob type:", "color: blue", audioBlob.type);

                      const audioUrl = URL.createObjectURL(audioBlob);
                      console.log("%c[GENAI] Created object URL:", "color: green", audioUrl);

                      const audioPlayer = document.getElementById("genaiAudio") as HTMLAudioElement;
                      if (audioPlayer) {
                        audioPlayer.src = audioUrl;
                        audioPlayer.style.display = "block";
                        
                        audioPlayer.onloadeddata = () => {
                          console.log("%c[GENAI] Audio loaded successfully!", "color: green; font-weight: bold");
                        };
                        
                        audioPlayer.onerror = (e) => {
                          console.error("%c[GENAI] Audio loading error:", "color: red", e);
                        };
                      }
                      } else if (response.error) {
                        console.error("%c[GENAI] Error detected!", "color: red; font-weight: bold");
                        console.error("%c[GENAI] Error message:", "color: red", response.error);
                        if (response.details) {
                          console.error("%c[GENAI] Error details:", "color: red", response.details);
                        }
                        console.error("%c[GENAI] Response type:", "color: blue", "ErrorResponse");
                        throw new Error(response.error);
                      } else {
                        console.error("%c[GENAI] Unknown response format:", "color: red", response);
                        throw new Error("Invalid response format");
                      }
                    } catch (error) {
                      console.error("%c[GENAI] Exception caught:", "color: red; font-weight: bold", error);
                      console.error("%c[GENAI] Stack trace:", "color: red", error.stack);
                      alert("Failed to generate speech. Check browser console for details.");
                    }
                  }}
                  className="w-full px-4 py-2 bg-white text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 transition-colors flex items-center justify-center gap-2"
                >
                  🎤 GENAI
                </button>
              </div>
            )}
            <audio
              id="elevenlabsAudio"
              controls
              className="w-full mt-2"
              style={{ display: "none" }}
            />
            <audio
              id="genaiAudio"
              controls
              className="w-full mt-2"
              style={{ display: "none" }}
            />
            <div className="flex gap-4">
              <button
                onClick={toggleBookmark}
                className="flex-1 px-4 py-2 bg-purple-500/80 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center justify-center gap-2"
              >
                {bookmarkedPrayers.includes(prayer) ? "★" : "☆"}
              </button>
              <button
                onClick={() => setShowPrayer(false)}
                className="flex-1 px-4 py-2 bg-purple-500/80 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 12c0 6-4.39 10-9.806 10C7.792 22 4.24 19.665 3 16" />
                  <path d="M2 12C2 6 6.39 2 11.806 2 16.209 2 19.76 4.335 21 8" />
                  <path d="M7 17l-4-1-1 4" />
                  <path d="M17 7l4 1 1-4" />
                </svg>
              </button>
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(prayer + " ---- visit worldcoin.org")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-white text-green-600 border-2 border-green-600 rounded-lg hover:bg-green-50 transition-colors text-center flex items-center justify-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                WhatsApp
              </a>
            </div>
          </div>
          {bookmarkedPrayers.length > 0 && (
            <div className="mt-8 w-full">
              <h3 className="text-white text-xl mb-4">Bookmarked Prayers</h3>
              <div className="space-y-4">
                {bookmarkedPrayers.map((p, i) => (
                  <div key={i} className="p-4 rounded-lg bg-gray-800/50">
                    <p className="text-white">{p}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}