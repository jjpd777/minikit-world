"use client";
import { useState } from "react";
import { IntentionButtons } from "./IntentionButtons";

export const PrayerForm = ({
  onPrayerGenerated,
}: {
  onPrayerGenerated: (prayer: string) => void;
}) => {
  const [language, setLanguage] = useState(() => localStorage.getItem("lastLanguage") || "en");
  const [religion, setReligion] = useState(() => localStorage.getItem("lastReligion") || "christian");
  const [intentions, setIntentions] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [audioData, setAudioData] = useState<string | null>(null);

  const buttonText = {
    en: "Generate Prayer",
    he: "צור תפילה",
    pt: "Gerar Oração",
    fr: "Générer une Prière",
    de: "Gebet Generieren",
    es: "Generar Oración",
    hi: "प्रार्थना बनाएं",
    ar: "توليد الصلاة"
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    localStorage.setItem("lastLanguage", newLanguage);
  };

  const handleReligionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newReligion = e.target.value;
    setReligion(newReligion);
    localStorage.setItem("lastReligion", newReligion);
  };

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
      flag: "🇺🇸",
      choices: ["Myself", "Mother", "Father", "Siblings", "Health", "Wealth"],
    },
    {
      code: "he",
      name: "Hebrew",
      flag: "🇮🇱",
      choices: ["עצמי", "אמא", "אבא", "אחים ואחיות", "בריאות", "עושר"],
    },
    {
      code: "pt",
      name: "Portuguese",
      flag: "🇧🇷",
      choices: ["Eu mesmo", "Mãe", "Pai", "Irmãos", "Saúde", "Riqueza"],
    },
    {
      code: "fr",
      name: "French",
      flag: "🇫🇷",
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
      flag: "🇩🇪",
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
      flag: "🇨🇴",
      choices: ["Yo mismo", "Madre", "Padre", "Hermanos", "Salud", "Riqueza"],
    },
    {
      code: "hi",
      name: "Hindi",
      flag: "🇮🇳",
      choices: ["स्वयं", "माता", "पिता", "भाई-बहन", "स्वास्थ्य", "धन"],
    },
    {
      code: "ar",
      name: "Arabic",
      flag: "🇦🇪",
      choices: ["نفسي", "الأم", "الأب", "الإخوة", "الصحة", "الثروة"],
    },
  ];


  const RELIGION_TO_TOKEN = {
    "christian": "0x908BE4717360397348F35271b9461192B6c84522",
    "orthodox": "0xC1b3a96113aC409fe3a40126962c74aEBccDda62",
    "jewish": "0x848B9D2d07C601706ff86b7956579bDFB9Bc0635",
    "islamic": "0x723da9e13D5519a63a5cbC8342B4e4c3aE1eEb8A",
    "sikh": "0x840934539c988fA438f005a4B94234E50f5D6c4a",
    "hindu": "0x5b1b84197a2235C67c65E0Ec60f891A6975bcb95",
    "atheist": "0x2AC26A1380B3eBbe4149fbcAf61e88D0304688d7",
    "buddhist": "0xd01366ca8642a0396c4e909feb8c5E9Ec3A00F65"
  };

  const RELIGIOUS_TOKEN_ABI = [
    {
      inputs: [],
      name: "claimTokens",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!language || !religion) {
      alert("Please select a language and religion");
      return;
    }

    // Claim token for selected religion
    const tokenAddress = RELIGION_TO_TOKEN[religion as keyof typeof RELIGION_TO_TOKEN];
    if (tokenAddress) {
      try {
        const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
          transaction: [{
            address: tokenAddress,
            abi: RELIGIOUS_TOKEN_ABI,
            functionName: "claimTokens",
            args: []
          }]
        });

        if (finalPayload.status === "success") {
          console.log("Token claimed successfully for religion:", religion);
        }
      } catch (error) {
        console.error("Failed to claim token:", error);
      }
    }

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
      localStorage.setItem("lastIntentions", intentions);
      localStorage.setItem("lastReligion", religion);
      localStorage.setItem("lastLanguage", language);

      // Track prayer generation event after getting response
      const storedWalletAddress = localStorage.getItem("walletAddress") || "";
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
          voice_generation: false,
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

  const uploadAudio = async () => {
    if (!audioData) {
      alert("No audio data available to upload");
      return;
    }

    try {
      // Convert base64 to blob
      const base64Data = audioData.split(",")[1];
      const binaryString = atob(base64Data);
      const byteArray = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        byteArray[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([byteArray], { type: "audio/mpeg" });

      const timestamp = Math.floor(Date.now() / 1000);
      const fileName = `0x333${timestamp}.mp3`;

      const formData = new FormData();
      formData.append("file", blob, fileName);

      const uploadResponse = await fetch("/api/upload-test", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error("Upload failed:", errorText);
        throw new Error(`Upload failed: ${uploadResponse.status}`);
      }

      const data = await uploadResponse.json();
      console.log("Upload response:", data);

      if (data.success) {
        alert(`Upload successful!\nStorage path: ${data.gsPath}`);
      } else {
        throw new Error(data.error || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload audio");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-2 justify-center items-center">
          <select
            value={language}
            onChange={handleLanguageChange}
            className="w-20 p-3 rounded-lg border border-blue-200 bg-blue-50 text-gray-700 hover:border-blue-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors text-lg"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>

          <select
            value={religion}
            onChange={handleReligionChange}
            className="p-3 rounded-lg border border-blue-200 bg-blue-50 text-gray-700 hover:border-blue-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors text-lg"
          >
            {religions.map((rel) => (
              <option key={rel.code} value={rel.code}>
                {rel.icon} {rel.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-4 flex justify-center min-w-[300px] ml-[-90px] -mt-20">
          {/* <div className="grid grid-cols-3 gap-x-10 gap-y-4 px-4">
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
          </div> */}
        </div>
      </div>

      <div className="flex flex-col gap-2 ml-[-80px] min-w-[330px]">
        <label htmlFor="intentions" className="text-white">
          Prayer Intentions
        </label>
        <IntentionButtons
          onSelect={(intention) => {
            setIntentions((prev) => {
              const newValue = prev ? `${prev}, ${intention}` : intention;
              console.log('Setting intentions to:', newValue);
              return newValue;
            });
          }}
          language={language}
        />
        <textarea
          id="intentions"
          value={intentions}
          onChange={(e) => setIntentions(e.target.value)}
          placeholder="Enter your prayer intentions..."
          className="p-2 rounded-lg bg-blue-50 text-gray-700 border border-blue-200 h-32 w-full text-lg resize-none hover:border-blue-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading || !intentions.trim().length}
        className="w-full px-4 py-2 bg-purple-500/80 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
      >
        {isLoading ? "Generating..." : buttonText[language as keyof typeof buttonText]}
      </button>

      {audioData && (
        <button
          onClick={uploadAudio}
          className="w-full mt-4 px-4 py-2 bg-blue-500/80 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Upload Audio
        </button>
      )}
    </form>
  );
};