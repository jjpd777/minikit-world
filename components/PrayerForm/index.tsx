"use client";
import { useState, useEffect } from "react";
import { trackEvent } from '@/lib/mixpanel';
import { IntentionButtons } from "./IntentionButtons";

export const PrayerForm = ({
  onPrayerGenerated,
}: {
  onPrayerGenerated: (prayer: string) => void;
}) => {
  const [language, setLanguage] = useState("en");
  const [religion, setReligion] = useState("christian");

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setLanguage(localStorage.getItem("lastLanguage") || "en");
      setReligion(localStorage.getItem("lastReligion") || "christian");
    }
  }, []);
  const [intentions, setIntentions] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [audioData, setAudioData] = useState<string | null>(null);

  const placeholderText = {
  en: "If desired enter any additional intentions or information for this prayer here . . .",
  es: "Si lo deseas, ingresa cualquier intención o información adicional para esta oración aquí . . .",
  tr: "İsterseniz, bu dua için ek niyetleri veya bilgileri buraya girin . . .",
  he: "אם תרצה, הזן כאן כל כוונה או מידע נוסף לתפילה זו . . .",
  pt: "Se desejar, insira quaisquer intenções ou informações adicionais para esta oração aqui . . .",
  hi: "यदि इच्छित हो, तो इस प्रार्थना के लिए कोई अतिरिक्त इरादे या जानकारी यहाँ दर्ज करें . . .",
  ar: "إذا رغبت، أدخل أي نوايا أو معلومات إضافية لهذه الصلاة هنا . . .",
  fr: "Si désiré, entrez toute intention ou information supplémentaire pour cette prière ici . . .",
  de: "Falls gewünscht, geben Sie hier zusätzliche Absichten oder Informationen für dieses Gebet ein . . .",
  id: "Jika diinginkan, masukkan niat atau informasi tambahan untuk doa ini di sini . . ."
};

const buttonText = {
    en: "Generate Prayer",
    he: "צור תפילה",
    pt: "Gerar Oração",
    fr: "Générer une Prière",
    de: "Gebet Generieren",
    es: "Generar Oración",
    hi: "प्रार्थना बनाएं",
    ar: "توليد الصلاة",
    id: "Buat Doa",
    tr: "Dua Oluştur"
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

  const religionNames = {
    en: {
      christian: "Christianity",
      orthodox: "Orthodox Christianity",
      jewish: "Judaism",
      islamic: "Islam",
      buddhist: "Buddhism",
      sikh: "Sikhism",
      atheist: "Atheism",
      hindu: "Hinduism"
    },
    es: {
      christian: "Cristianismo",
      orthodox: "Cristianismo Ortodoxo",
      jewish: "Judaísmo",
      islamic: "Islam",
      buddhist: "Budismo",
      sikh: "Sijismo",
      atheist: "Ateísmo",
      hindu: "Hinduismo"
    },
    tr: {
      christian: "Hristiyanlık",
      orthodox: "Ortodoks Hristiyanlık",
      jewish: "Musevilik",
      islamic: "İslam",
      buddhist: "Budizm",
      sikh: "Sihizm",
      atheist: "Ateizm",
      hindu: "Hinduizm"
    },
    he: {
      christian: "נצרות",
      orthodox: "נצרות אורתודוקסית",
      jewish: "יהדות",
      islamic: "איסלאם",
      buddhist: "בודהיזם",
      sikh: "סיקיזם",
      atheist: "אתאיזם",
      hindu: "הינדואיזם"
    },
    pt: {
      christian: "Cristianismo",
      orthodox: "Cristianismo Ortodoxo",
      jewish: "Judaísmo",
      islamic: "Islamismo",
      buddhist: "Budismo",
      sikh: "Sikhismo",
      atheist: "Ateísmo",
      hindu: "Hinduísmo"
    },
    hi: {
      christian: "ईसाई धर्म",
      orthodox: "रूढ़िवादी ईसाई धर्म",
      jewish: "यहूदी धर्म",
      islamic: "इस्लाम",
      buddhist: "बौद्ध धर्म",
      sikh: "सिख धर्म",
      atheist: "नास्तिकता",
      hindu: "हिंदू धर्म"
    },
    ar: {
      christian: "المسيحية",
      orthodox: "المسيحية الأرثوذكسية",
      jewish: "اليهودية",
      islamic: "الإسلام",
      buddhist: "البوذية",
      sikh: "السيخية",
      atheist: "الإلحاد",
      hindu: "الهندوسية"
    },
    fr: {
      christian: "Christianisme",
      orthodox: "Christianisme Orthodoxe",
      jewish: "Judaïsme",
      islamic: "Islam",
      buddhist: "Bouddhisme",
      sikh: "Sikhisme",
      atheist: "Athéisme",
      hindu: "Hindouisme"
    },
    de: {
      christian: "Christentum",
      orthodox: "Orthodoxes Christentum",
      jewish: "Judentum",
      islamic: "Islam",
      buddhist: "Buddhismus",
      sikh: "Sikhismus",
      atheist: "Atheismus",
      hindu: "Hinduismus"
    },
    id: {
      christian: "Kristen",
      orthodox: "Kristen Ortodoks",
      jewish: "Yahudi",
      islamic: "Islam",
      buddhist: "Buddha",
      sikh: "Sikh",
      atheist: "Ateis",
      hindu: "Hindu"
    }
  };

  const religions = [
    { code: "christian", icon: "✝️", name: religionNames[language as keyof typeof religionNames]?.christian || "Christianity" },
    { code: "orthodox", icon: "☦️", name: religionNames[language as keyof typeof religionNames]?.orthodox || "Orthodox Christianity" },
    { code: "jewish", icon: "✡️", name: religionNames[language as keyof typeof religionNames]?.jewish || "Judaism" },
    { code: "islamic", icon: "☪️", name: religionNames[language as keyof typeof religionNames]?.islamic || "Islam" },
    { code: "buddhist", icon: "☸️", name: religionNames[language as keyof typeof religionNames]?.buddhist || "Buddhism" },
    { code: "sikh", icon: "🪯", name: religionNames[language as keyof typeof religionNames]?.sikh || "Sikhism" },
    { code: "atheist", icon: "⚛️", name: religionNames[language as keyof typeof religionNames]?.atheist || "Atheism" },
    { code: "hindu", icon: "🕉️", name: religionNames[language as keyof typeof religionNames]?.hindu || "Hinduism" },
  ];

  const languages = [
    {
      code: "en",
      name: "English",
      flag: "🇺🇸",
      choices: ["Myself", "Mother", "Father", "Siblings", "Health", "Wealth"],
    },
    {
      code: "id",
      name: "Indonesian",
      flag: "🇮🇩",
      choices: ["Diri Sendiri", "Ibu", "Ayah", "Saudara", "Kesehatan", "Kekayaan"],
    },
    {
      code: "tr",
      name: "Türkçe",
      flag: "🇹🇷",
      choices: ["Kendim için", "Annem", "Babam", "Kardeşlerim", "Sağlık", "Zenginlik", "Huzur", "Şükür", "Rehberlik", "Güç", "Bilgelik", "Sevgi", "Affetme", "İnanç", "Umut", "Başarı"],
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
      flag: "🇲🇽",
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

  const handleGeneratePrayer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!language || !religion) {
      alert("Please select a language and religion");
      return;
    }

    const hasTextInput = intentions.trim().length > 0;
    if (!hasTextInput) {
      alert("Please enter prayer intentions");
      return;
    }

    setIsLoading(true);

    try {
      // First try to claim token
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
          // Continue with prayer generation even if token claim fails
        }
      }

    try {
      const startTime = Date.now();
      // Track prayer generation attempt
      trackEvent('Prayer Generation Started', {
        timestamp: new Date().toISOString(),
        language,
        religion,
        intentions_length: intentions.length,
        wallet_address: localStorage.getItem("walletAddress") || 'anonymous',
        user_agent: navigator.userAgent,
        platform: navigator.platform,
        screen_resolution: `${window.screen.width}x${window.screen.height}`
      });

      const response = await fetch("/api/generate-prayer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language,
          religion,
          intentions: finalIntentions,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate prayer');
      }

      // Track successful prayer generation with enhanced data
      trackEvent('Prayer Generation Completed', {
        timestamp: new Date().toISOString(),
        language,
        religion,
        intentions: intentions,
        response_status: response.status,
        success: response.ok,
        prayer_length: data.prayer?.length || 0,
        prayer_text: data.prayer,
        wallet_address: localStorage.getItem("walletAddress") || 'anonymous',
        generation_time_ms: Date.now() - startTime,
        user_agent: navigator.userAgent,
        platform: navigator.platform,
        screen_resolution: `${window.screen.width}x${window.screen.height}`
      });

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
  }

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
    <form onSubmit={handleGeneratePrayer} className="w-full max-w-md space-y-2.5">
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-2 justify-center items-center">
          <select
            value={language}
            onChange={handleLanguageChange}
            className="w-20 p-3 rounded-lg border border-blue-200 bg-blue-50 text-gray-700 hover:border-blue-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors text-lg"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag}
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
                  className="p-2 min-w-[90px] w-full rounded-lg border border-gray-700 bg-gray-800 text-white hover:border-purple-400/50 transition-colors text-sm"
                >
                  {choice}
                </button>
              ))}
          </div> */}
        </div>
      </div>

      <div className="flex flex-col gap-2 ml-[-80px] min-w-[330px]">
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
          placeholder={placeholderText[language as keyof typeof placeholderText] || "Enter your prayer intentions..."}
          className="p-2 rounded-lg bg-blue-50 text-gray-700 border border-blue-200 h-32 w-full text-sm resize-none hover:border-blue-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
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