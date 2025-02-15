"use client";
import { PrayerForm } from "@/components/PrayerForm";
import { useState } from "react";
import Image from "next/image";

export default function VerifiedPage() {
  const [prayer, setPrayer] = useState("");
  const [showPrayer, setShowPrayer] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [hasGeneratedAudio, setHasGeneratedAudio] = useState(false);

  return (
    <div className="flex min-h-screen flex-col items-center p-24">
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
          <div className="space-y-4 w-full">
            <div className="flex gap-4 justify-between w-full">
              <button
                onClick={() => setShowPrayer(false)}
                className="flex-1 px-4 py-2 bg-purple-500/80 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center justify-center gap-2"
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
              <a
                href={`https://wa.me/?text=${encodeURIComponent(prayer)}`}
                target="_blank"
                rel="noopener noreferrer"
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
              <button
                onClick={async () => {
                  const audioPlayer = document.getElementById(
                    "prayerAudio",
                  ) as HTMLAudioElement;
                  if (audioPlayer) {
                    audioPlayer.style.display = "none";
                  }
                  setIsGeneratingAudio(true);
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

                    if (!response.ok) {
                      throw new Error("Failed to generate audio");
                    }

                    const data = await response.json();
                    if (!data.success) {
                      throw new Error("Failed to generate audio");
                    }
                    
                    console.log('Firebase Storage Path:', data.gsPath);
                    
                    const audioBlob = new Blob(
                      [Buffer.from(data.audio, 'base64')],
                      { type: 'audio/mpeg' }
                    );
                    const audioUrl = URL.createObjectURL(audioBlob);
                    const audioPlayer = document.getElementById(
                      "prayerAudio",
                    ) as HTMLAudioElement;
                    if (audioPlayer) {
                      audioPlayer.src = audioUrl;
                      audioPlayer.style.display = "block";
                      setHasGeneratedAudio(true);
                    }
                  } catch (error) {
                    console.error("Error generating audio:", error);
                    alert("Failed to generate audio. Please try again.");
                  } finally {
                    setIsGeneratingAudio(false);
                  }
                }}
                disabled={isGeneratingAudio || hasGeneratedAudio}
                className="flex-1 px-4 py-2 bg-white text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"
                    clipRule="evenodd"
                  />
                </svg>
                {isGeneratingAudio ? (
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  "✨"
                )}
              </button>
            </div>
            <audio
              id="prayerAudio"
              controls
              className="w-full"
              style={{ display: "none" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
