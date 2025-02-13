
"use client";
import { useEffect, useRef } from "react";

export const AudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const playAudio = async () => {
      if (audioRef.current) {
        audioRef.current.volume = 0.3;
        try {
          await audioRef.current.play();
        } catch (error) {
          console.error("Audio playback failed:", error);
        }
      }
    };

    playAudio();
  }, []);

  return (
    <audio
      ref={audioRef}
      src="/music_files_soundtrack_02.mp3"
      loop
      preload="auto"
      style={{ display: "none" }}
    />
  );
};
