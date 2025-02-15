"use client";
import { useState } from "react";
import Image from "next/image";

export const PrayerForm = ({
  onPrayerGenerated,
}: {
  onPrayerGenerated: (prayer: string) => void;
}) => {
  const [language, setLanguage] = useState("en");
  const [intentions, setIntentions] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const languages = [
    {
      code: "en",
      name: "English",
      flag: "/usa.svg",
      choices: ["Myself", "Mother", "Father", "Siblings", "Health", "Wealth"],
    },
    {
      code: "es",
      name: "Spanish",
      flag: "/colombia.svg",
      choices: ["Yo mismo", "Madre", "Padre", "Hermanos", "Salud", "Riqueza"],
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
      code: "he",
      name: "Hebrew",
      flag: "/israel.svg",
      choices: ["עצמי", "אמא", "אבא", "אחים ואחיות", "בריאות", "עושר"],
    },
  ];

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
          intentions,
        }),
      });

      const data = await response.json();
      
      // Generate audio from prayer
      const audioResponse = await fetch("/api/generate-audio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: data.prayer,
        }),
      });

      const audioData = await audioResponse.json();
      if (!audioResponse.ok || !audioData.success) {
        throw new Error(audioData.error || "Failed to generate audio");
      }

      // Convert base64 to blob and upload
      const audioUrl = `data:audio/mpeg;base64,${audioData.audio}`;
      const response = await fetch(audioUrl);
      const blob = await response.blob();
      
      const formData = new FormData();
      const timestamp = Date.now();
      formData.append('file', blob, `${timestamp}-0x9991.mp3`);
      
      const uploadResponse = await fetch('/api/upload-test', {
        method: 'POST',
        body: formData
      });

      const uploadData = await uploadResponse.json();
      if (!uploadData.success) {
        throw new Error(uploadData.error || 'Upload failed');
      }

      onPrayerGenerated(data.prayer);
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
        <div className="flex justify-center mb-4">
          <Image
            src="/bendiga_logo.png"
            alt="Bendiga Logo"
            width={150}
            height={150}
            priority
            className="animate-glow"
            style={{ marginTop:'-60px', marginBottom: "-22px" }}
          />
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
    </form>
  );
};
