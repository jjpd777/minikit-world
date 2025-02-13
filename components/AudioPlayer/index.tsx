
"use client";
import { useEffect, useRef, useState } from "react";

export const AudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = async () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        try {
          audioRef.current.volume = 0.3;
          await audioRef.current.play();
        } catch (error) {
          console.error("Audio playback failed:", error);
        }
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={togglePlay}
        className="bg-purple-500/80 text-white p-2 rounded-full hover:bg-purple-600 transition-colors"
      >
        {isPlaying ? "🔇" : "🔊 Play"}
      </button>
      <audio
        ref={audioRef}
        src="/music_files_soundtrack_02.mp3"
        loop
        preload="auto"
      />
    </div>
  );
};
