
"use client";
import { useState, useRef } from 'react';

export const VoiceRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        
        // Convert to MP3 format for Firebase
        const timestamp = Date.now();
        const fileName = `0x7777-${timestamp}.mp3`;
        
        // Initialize Firebase (you'll need to add your config)
        import { initializeApp } from 'firebase/app';
        import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
        
        const firebaseConfig = {
          // Your Firebase config here
          storageBucket: 'bendiga-4d926.appspot.com'
        };
        
        const app = initializeApp(firebaseConfig);
        const storage = getStorage(app);
        
        // Create storage reference
        const storageRef = ref(storage, `worldApp/audioGen/${fileName}`);
        
        // Upload the blob
        try {
          await uploadBytes(storageRef, blob);
          const downloadUrl = await getDownloadURL(storageRef);
          console.log('File uploaded successfully:', downloadUrl);
          // You can store this URL in your state or send it to your backend
        } catch (error) {
          console.error('Error uploading file:', error);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Unable to access microphone");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      const url = URL.createObjectURL(file);
      setUploadedFile(url);
    } else {
      alert('Please upload an audio file');
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-4">
      <div className="flex gap-4">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`px-4 py-2 rounded ${
            isRecording 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-green-500 hover:bg-green-600'
          } text-white`}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
        
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileUpload}
          ref={fileInputRef}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white"
        >
          Upload Audio File
        </button>
      </div>
      
      {(audioUrl || uploadedFile) && (
        <>
          <audio controls src={audioUrl || uploadedFile} className="mt-4" />
          <a 
            href="/audio_sample.mp3" 
            download 
            className="px-4 py-2 mt-4 rounded bg-blue-500 hover:bg-blue-600 text-white"
          >
            Download Audio
          </a>
        </>
      )}
    </div>
  );
};
