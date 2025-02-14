
"use client";
import { WalletAuth } from "@/components/WalletAuth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface BookmarkedPrayer {
  text: string;
  audioUrl?: string;
  timestamp: number;
}

export default function WalletPage() {
  const router = useRouter();
  const [bookmarkedPrayers, setBookmarkedPrayers] = useState<BookmarkedPrayer[]>([]);
  const [playingAudioId, setPlayingAudioId] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('bookmarked_prayers');
    if (saved) {
      setBookmarkedPrayers(JSON.parse(saved));
    }
  }, []);

  const playAudio = async (audioUrl: string, index: number) => {
    if (playingAudioId === index) {
      setPlayingAudioId(null);
      return;
    }
    
    try {
      const audio = new Audio(audioUrl);
      audio.onended = () => setPlayingAudioId(null);
      await audio.play();
      setPlayingAudioId(index);
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-gray-900 to-gray-800">
      <button 
        onClick={() => router.back()}
        className="absolute top-4 left-4 p-2 rounded-full bg-purple-500/30 hover:bg-purple-500/50 transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>
      <div className="w-full max-w-md flex flex-col items-center">
        <Image
          src="/bendiga_logo.png"
          alt="Bendiga Logo"
          width={150}
          height={150}
          priority
          className="mb-8 animate-glow"
        />
        <h1 className="text-2xl text-white text-center font-bold mb-8">
          Connect Your Wallet
        </h1>
        <WalletAuth />
        {bookmarkedPrayers.length > 0 && (
          <div className="mt-8 w-full">
            <h3 className="text-white text-xl mb-4">Your Bookmarked Prayers</h3>
            <div className="space-y-4">
              {bookmarkedPrayers.map((prayer, index) => (
                <div key={index} className="p-4 rounded-lg bg-gray-800/50">
                  <p className="text-white text-sm mb-2">{prayer.text}</p>
                  {prayer.audioUrl && (
                    <button
                      onClick={() => playAudio(prayer.audioUrl!, index)}
                      className="mt-2 px-3 py-1 bg-purple-500/30 hover:bg-purple-500/50 rounded-lg text-white text-sm flex items-center gap-2"
                    >
                      {playingAudioId === index ? '⏸️ Pause' : '▶️ Play'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
