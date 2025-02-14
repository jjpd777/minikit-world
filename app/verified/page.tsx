"use client";
import { PrayerForm } from "@/components/PrayerForm";
import { useState } from "react";
import Image from "next/image";

export default function VerifiedPage() {
  const [prayer, setPrayer] = useState("");
  const [showPrayer, setShowPrayer] = useState(false);

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
          <div className="flex gap-4 flex-col w-full">
            <button
              onClick={async () => {
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

                  const audioBlob = await response.blob();
                  const audioUrl = URL.createObjectURL(audioBlob);
                  const audioPlayer = document.getElementById(
                    "prayerAudio",
                  ) as HTMLAudioElement;
                  if (audioPlayer) {
                    audioPlayer.src = audioUrl;
                    audioPlayer.style.display = "block";
                  }
                } catch (error) {
                  console.error("Error generating audio:", error);
                  alert("Failed to generate audio. Please try again.");
                }
              }}
              className="w-full px-4 py-2 bg-white text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 transition-colors flex items-center justify-center gap-2"
            >
              Generate Audio
            </button>
            <audio
              id="prayerAudio"
              controls
              className="w-full mt-2"
              style={{ display: "none" }}
            />
            <button
              onClick={() => setShowPrayer(false)}
              className="w-full px-4 py-2 bg-purple-500/80 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              Generate New Prayer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}