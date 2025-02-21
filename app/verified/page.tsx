"use client";
import { PrayerForm } from "@/components/PrayerForm";
import { ClaimTokens } from "@/components/ClaimTokens";
import { useState } from "react";
import Image from "next/image";

export default function VerifiedPage() {
  const [prayer, setPrayer] = useState("");
  const [showPrayer, setShowPrayer] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [hasGeneratedAudio, setHasGeneratedAudio] = useState(false);
  const [audioData, setAudioData] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [storagePath, setStoragePath] = useState<string | null>(null);

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
          <div className="space-y-4 w-full ml-[-20px]">
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
              {storagePath && (
                <button
                  onClick={() => {
                    const bookmarked = JSON.parse(localStorage.getItem('bookmarkedAudios') || '[]');
                    if (!bookmarked.includes(storagePath)) {
                      const newBookmarked = [...bookmarked, storagePath];
                      localStorage.setItem('bookmarkedAudios', JSON.stringify(newBookmarked));
                      console.log('Audio bookmarked:', storagePath);
                      alert('Audio bookmarked successfully!');
                    } else {
                      alert('This audio is already bookmarked!');
                    }
                  }}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                  </svg>
                 
                </button>
              )}
              <a
                href={`https://wa.me/?text=${encodeURIComponent(prayer)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={async () => {
                  const storedWalletAddress = localStorage.getItem('walletAddress') || '';
                  await fetch("/api/track-prayer", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      walletAddress: storedWalletAddress,
                      unix_timestamp: Date.now(),
                      timestamp: new Date().toISOString(),
                      input_text: localStorage.getItem('lastIntentions') || '',
                      religion: localStorage.getItem('lastReligion') || '',
                      language: localStorage.getItem('lastLanguage') || '',
                      source: 'whatsapp',
                      llm_response: prayer,
                      voice_generation: hasGeneratedAudio
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
              {!audioUrl && <button
                onClick={async () => {
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

                    const data = await response.json();
                    if (!response.ok || !data.success) {
                      throw new Error(data.error || "Failed to generate audio");
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
                    
                    const audioBlob = new Blob([bytes], { type: 'audio/mpeg' });
                    const formData = new FormData();
                    formData.append('file', audioBlob, `prayer-${Date.now()}.mp3`);

                    const uploadResponse = await fetch('/api/upload-test', {
                      method: 'POST',
                      body: formData,
                    });

                    if (!uploadResponse.ok) {
                      throw new Error(`Upload failed: ${uploadResponse.status}`);
                    }

                    const uploadData = await uploadResponse.json();
                    if (uploadData.success) {
                      console.log('Audio uploaded successfully:', uploadData.gsPath);
                      setStoragePath(uploadData.gsPath);
                      setHasGeneratedAudio(true);
                      
                      // Track voice generation event
                      const storedWalletAddress = localStorage.getItem('walletAddress') || '';
                      await fetch("/api/track-prayer", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          walletAddress: storedWalletAddress,
                          input_text: localStorage.getItem('lastIntentions') || '',
                          religion: localStorage.getItem('lastReligion') || '',
                          language: localStorage.getItem('lastLanguage') || '',
                          llm_response: prayer,
                          voice_generation: true
                        }),
                      });
                    } else {
                      throw new Error(uploadData.error || 'Upload failed');
                    }
                  } catch (error) {
                    console.error("Error:", error);
                    alert("Failed to generate or upload audio. Please try again.");
                  } finally {
                    setIsGeneratingAudio(false);
                  }
                }}
                disabled={isGeneratingAudio || hasGeneratedAudio}
                className="flex-1 px-4 py-2 bg-white text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isGeneratingAudio ? "✨" : hasGeneratedAudio ? "" : "✨"}
              </button>}
            </div>
           
            {audioUrl && (
                <audio 
                  src={audioUrl}
                  controls 
                  autoPlay
                  className="mt-4 w-full" 
                />
              )}
                
          </div>
        </div>
      )}
    </div>
  );
}