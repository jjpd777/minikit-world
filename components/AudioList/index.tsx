
"use client";
import { useEffect, useState } from "react";

interface AudioFile {
  name: string;
  url: string;
}

export const AudioList = () => {
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAudioFiles = async () => {
      try {
        const response = await fetch('/api/list-audio');
        const data = await response.json();
        if (data.success) {
          setAudioFiles(data.files);
        }
      } catch (error) {
        console.error('Error fetching audio files:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAudioFiles();
  }, []);

  if (loading) {
    return <div className="mt-4 text-white">Loading audio files...</div>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl text-white mb-4">Stored Audio Files</h2>
      <div className="flex flex-col gap-4">
        {audioFiles.map((file) => (
          <div key={file.name} className="bg-gray-800 p-4 rounded-lg">
            <p className="text-white mb-2">{file.name}</p>
            <audio controls src={file.url} className="w-full" />
          </div>
        ))}
      </div>
    </div>
  );
};
