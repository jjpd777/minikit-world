
interface Voice {
  voice_id: string;
  name: string;
  preview_url: string;
  labels: {
    language: string;
    [key: string]: string;
  };
}

const languageToVoiceId: { [key: string]: string } = {
  en: "21m00Tcm4TlvDq8ikWAM", // Rachel - English US
  es: "ErXwobaYiN019PkySvjV", // Antoni - Spanish MX
  fr: "jsCqWAovK2LkecY7zXl4", // French
  de: "MqJuR2kxlZsIMG14rL6H", // German
  pt: "l1zE9xgNpUTaQCZzpNJa", // Portuguese
  he: "XB0fDUnXU5powFXDhCwa", // Hebrew
};

export async function getVoiceForLanguage(language: string): Promise<string> {
  return languageToVoiceId[language] || languageToVoiceId.en; // fallback to English
}
