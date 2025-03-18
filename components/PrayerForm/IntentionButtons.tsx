
import { useState } from 'react';

type IntentionButtonsProps = {
  onSelect: (intention: string) => void;
  language: string;
};

export const IntentionButtons = ({ onSelect, language }: IntentionButtonsProps) => {
  const [showPrayerFor, setShowPrayerFor] = useState(false);
  const [showIntentions, setShowIntentions] = useState(false);

  const intentions = {
    en: ["Family", "Love", "Health", "Work", "Peace"],
    he: ["משפחה", "אהבה", "בריאות", "עבודה", "שלום"],
    pt: ["Família", "Amor", "Saúde", "Trabalho", "Paz"],
    fr: ["Famille", "Amour", "Santé", "Travail", "Paix"],
    de: ["Familie", "Liebe", "Gesundheit", "Arbeit", "Frieden"],
    es: ["Familia", "Amor", "Salud", "Trabajo", "Paz"],
    hi: ["परिवार", "प्यार", "स्वास्थ्य", "काम", "शांति"],
    ar: ["العائلة", "الحب", "الصحة", "العمل", "السلام"],
    id: ["Keluarga", "Cinta", "Kesehatan", "Kerja", "Kedamaian"],
    tr: ["Aile", "Aşk", "Sağlık", "İş", "Barış"]
  };

  const commonIntentions = {
    en: ["Work", "Health", "Peace", "Gratitude", "Guidance", "Strength", "Wisdom", "Love", "Forgiveness", "Faith", "Hope", "Success"],
    he: ["עבודה", "בריאות", "שלום", "הכרת תודה", "הדרכה", "כוח", "חוכמה", "אהבה", "סליחה", "אמונה", "תקווה", "הצלחה"],
    pt: ["Trabalho", "Saúde", "Paz", "Gratidão", "Orientação", "Força", "Sabedoria", "Amor", "Perdão", "Fé", "Esperança", "Sucesso"],
    fr: ["Travail", "Santé", "Paix", "Gratitude", "Guidance", "Force", "Sagesse", "Amour", "Pardon", "Foi", "Espoir", "Succès"],
    de: ["Arbeit", "Gesundheit", "Frieden", "Dankbarkeit", "Führung", "Stärke", "Weisheit", "Liebe", "Vergebung", "Glaube", "Hoffnung", "Erfolg"],
    es: ["Trabajo", "Salud", "Paz", "Gratitud", "Guía", "Fuerza", "Sabiduría", "Amor", "Perdón", "Fe", "Esperanza", "Éxito"],
    hi: ["कार्य", "स्वास्थ्य", "शांति", "कृतज्ञता", "मार्गदर्शन", "शक्ति", "ज्ञान", "प्रेम", "क्षमा", "विश्वास", "आशा", "सफलता"],
    ar: ["عمل", "صحة", "سلام", "امتنان", "توجيه", "قوة", "حكمة", "حب", "مغفرة", "إيمان", "أمل", "نجاح"],
    id: ["Kerja", "Kesehatan", "Kedamaian", "Syukur", "Bimbingan", "Kekuatan", "Kebijaksanaan", "Cinta", "Pengampunan", "Iman", "Harapan", "Kesuksesan"],
    tr: ["İş", "Sağlık", "Huzur", "Şükür", "Rehberlik", "Güç", "Bilgelik", "Sevgi", "Affetme", "İnanç", "Umut", "Başarı"]
  };

  const currentIntentions = intentions[language as keyof typeof intentions] || intentions.en;
  const currentCommonIntentions = commonIntentions[language as keyof typeof commonIntentions] || commonIntentions.en;

  return (
    <div className="w-full max-w-2xl mx-auto mb-4 space-y-6">
      <div>
        <button
          onClick={() => setShowPrayerFor(!showPrayerFor)}
          className="w-full px-4 py-2 text-left bg-purple-500/20 hover:bg-purple-500/30 
                   rounded-lg transition-colors text-white border border-purple-500/30 
                   hover:border-purple-500/50 flex justify-between items-center"
        >
          <span className="text-xl font-semibold">Prayer For</span>
          <span className={`transform transition-transform ${showPrayerFor ? 'rotate-180' : ''}`}>▼</span>
        </button>
        {showPrayerFor && (
          <div className="mt-2 grid grid-cols-3 sm:grid-cols-5 gap-2">
            {currentIntentions.map((intention, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onSelect(intention);
                }}
                className="px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 
                         rounded-lg transition-colors text-sm text-white
                         border border-purple-500/30 hover:border-purple-500/50"
              >
                {intention}
              </button>
            ))}
          </div>
        )}
      </div>
      <div>
        <button
          onClick={() => setShowIntentions(!showIntentions)}
          className="w-full px-4 py-2 text-left bg-purple-500/20 hover:bg-purple-500/30 
                   rounded-lg transition-colors text-white border border-purple-500/30 
                   hover:border-purple-500/50 flex justify-between items-center"
        >
          <span className="text-xl font-semibold">Prayer Intentions</span>
          <span className={`transform transition-transform ${showIntentions ? 'rotate-180' : ''}`}>▼</span>
        </button>
        {showIntentions && (
          <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 gap-2">
            {currentCommonIntentions.map((intention, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onSelect(intention);
                }}
                className="px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 
                         rounded-lg transition-colors text-sm text-white
                         border border-purple-500/30 hover:border-purple-500/50"
              >
                {intention}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
