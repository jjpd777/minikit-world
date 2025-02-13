
"use client";
import { useEffect, useRef } from "react";

export const AudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const playAudio = async () => {
      console.log("Attempting to play audio...");
      
      if (audioRef.current) {
        audioRef.current.volume = 0.3;
        console.log("Audio element exists, volume set to 0.3");
        
        try {
          const playPromise = audioRef.current.play();
          await playPromise;
          console.log("Audio playback started successfully");
        } catch (error) {
          console.error("Audio playback failed:", error);
          
          // Check if the audio file exists
          fetch('/music_files_soundtrack_02.mp3')
            .then(response => {
              if (!response.ok) {
                console.error("Audio file not found or inaccessible");
              }
            })
            .catch(err => console.error("Error checking audio file:", err));
        }
      } else {
        console.error("Audio element reference not found");
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
      onError={(e) => console.error("Audio element error:", e)}
    />
  );
};
