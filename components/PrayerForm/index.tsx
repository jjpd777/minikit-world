"use client";
import { useState } from "react";
import Image from "next/image";

export const PrayerForm = ({
  onPrayerGenerated,
}: {
  onPrayerGenerated: (prayer: string) => void;
}) => {
  const [language, setLanguage] = useState("en");
  const [religion, setReligion] = useState("christian");
  const [intentions, setIntentions] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const religions = [
    { code: "christian", icon: "✝️", name: "Christianity" },
    { code: "orthodox", icon: "☦️", name: "Orthodox Christianity" },
    { code: "jewish", icon: "✡️", name: "Judaism" },
    { code: "islamic", icon: "☪️", name: "Islam" },
    { code: "buddhist", icon: "☸️", name: "Buddhism" },
    { code: "sikh", icon: "🪯", name: "Sikhism" },
    { code: "atheist", icon: "⚛️", name: "Atheism" },
    { code: "hindu", icon: "🕉️", name: "Hinduism" },
  ];

  const languages = [
    {
      code: "en",
      name: "English",
      flag: "/usa.svg",
      choices: ["Myself", "Mother", "Father", "Siblings", "Health", "Wealth"],
    },
    {
      code: "he",
      name: "Hebrew",
      flag: "/israel.svg",
      choices: ["עצמי", "אמא", "אבא", "אחים ואחיות", "בריאות", "עושר"],
    },
    {
      code: "pt",
      name: "Portuguese",
      flag: "/brazil.svg",
      choices: ["Eu mesmo", "Mãe", "Pai", "Irmãos", "Saúde", "Riqueza"],
    },
    {
      code: "fr",
      name: "French",
      flag: "/france.svg",
      choices: [
        "Moi-même",
        "Mère",
        "Père",
        "Frères et Sœurs",
        "Santé",
        "Richesse",
      ],
    },
    {
      code: "de",
      name: "German",
      flag: "/deutschland.svg",
      choices: [
        "Ich selbst",
        "Mutter",
        "Vater",
        "Geschwister",
        "Gesundheit",
        "Reichtum",
      ],
    },
    {
      code: "es",
      name: "Spanish",
      flag: "/colombia.svg",
      choices: ["Yo mismo", "Madre", "Padre", "Hermanos", "Salud", "Riqueza"],
    },
    {
      code: "hi",
      name: "Hindi",
      flag: "/india.svg",
      choices: ["स्वयं", "माता", "पिता", "भाई-बहन", "स्वास्थ्य", "धन"],
    },
    {
      code: "ar",
      name: "Arabic",
      flag: "/arab.svg",
      choices: ["نفسي", "الأم", "الأب", "الإخوة", "الصحة", "الثروة"],
    },
  ];

  const [audioData, setAudioData] = useState<string | null>(null);

  const uploadAudio = async () => {
    if (!audioData) {
      alert('No audio data available to upload');
      return;
    }

    try {
      // Convert base64 to blob
      const base64Data = audioData.split(',')[1];
      const binaryString = atob(base64Data);
      const byteArray = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        byteArray[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([byteArray], { type: 'audio/mpeg' });
      
      const timestamp = Math.floor(Date.now() / 1000);
      const fileName = `0x333${timestamp}.mp3`;
      
      const formData = new FormData();
      formData.append('file', blob, fileName);

      const uploadResponse = await fetch('/api/upload-test', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error('Upload failed:', errorText);
        throw new Error(`Upload failed: ${uploadResponse.status}`);
      }

      const data = await uploadResponse.json();
      console.log('Upload response:', data);

      if (data.success) {
        alert(`Upload successful!\nStorage path: ${data.gsPath}`);
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload audio');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/generate-prayer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language,
          religion,
          intentions,
        }),
      });

      const data = await response.json();
      
      // Store values for WhatsApp tracking
      localStorage.setItem('lastIntentions', intentions);
      localStorage.setItem('lastReligion', religion);
      localStorage.setItem('lastLanguage', language);
      
      // Track prayer generation event after getting response
      const storedWalletAddress = localStorage.getItem('walletAddress') || '';
      await fetch("/api/track-prayer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          walletAddress: storedWalletAddress,
          input_text: intentions,
          religion,
          language,
          llm_response: data.prayer,
          voice_generation: false
        }),
      });

      onPrayerGenerated(data.prayer);

      // Store audio data
      if (data.audio) {
        const audioUrl = `data:audio/mpeg;base64,${data.audio}`;
        setAudioData(audioUrl);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to generate prayer or audio. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
      <div className="flex flex-col gap-2">
       
        {/* <div className="flex justify-center mb-4">
          <Image
            src="/bendiga_logo.png"
            alt="Bendiga Logo"
            width={150}
            height={150}
            priority
            className="animate-glow"
            style={{ marginTop:'-60px', marginBottom: "-22px" }}
          />
        </div> */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {religions.map((rel) => (
            <button
              key={rel.code}
              type="button"
              onClick={() => setReligion(rel.code)}
              className={`p-2 rounded-lg border text-2xl ${
                religion === rel.code
                  ? "border-purple-500 bg-purple-500/20"
                  : "border-transparent bg-transparent"
              } flex flex-col items-center gap-2 hover:border-purple-500/50 transition-colors`}
              title={rel.name}
            >
              {rel.icon}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => setLanguage(lang.code)}
              className={`p-2 rounded-lg border ${
                language === lang.code
                  ? "border-purple-500 bg-purple-500/20"
                  : "border-transparent bg-transparent"
              } flex flex-col items-center gap-2 hover:border-purple-500/50 transition-colors`}
            >
              <Image
                src={lang.flag}
                alt={lang.name}
                width={24}
                height={24}
                className="rounded-sm"
              />
            </button>
          ))}
        </div>
        <div className="mt-4 flex justify-center min-w-[300px] ml-[-90px]">
          <div className="grid grid-cols-3 gap-x-10 gap-y-4 px-4">
            {languages
              .find((lang) => lang.code === language)
              ?.choices.map((choice, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() =>
                    setIntentions((prev) =>
                      prev ? `${prev}, ${choice}` : choice,
                    )
                  }
                  className="p-2 min-w-[90px] w-full rounded-lg border border-gray-700 bg-gray-800 text-white hover:border-purple-500/50 transition-colors text-sm"
                >
                  {choice}
                </button>
              ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 ml-[-80px] min-w-[330px]">
        <label htmlFor="intentions" className="text-white">
          Prayer Intentions
        </label>
        <textarea
          id="intentions"
          value={intentions}
          onChange={(e) => setIntentions(e.target.value)}
          placeholder="Enter your prayer intentions..."
          className="p-2 rounded-lg bg-gray-800 text-white border border-gray-700 h-32"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading || !intentions.trim().length}
        className="w-full px-4 py-2 bg-purple-500/80 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
      >
        {isLoading ? "Generating..." : "Generate Prayer"}
      </button>

      {audioData && (
        <button
          onClick={uploadAudio}
          className="w-full mt-4 px-4 py-2 bg-blue-500/80 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Up
        </button>
      )}
    </form>
  );
};
