
import React, { useState } from 'react';

interface IntentionButtonsProps {
  onSelect: (intention: string) => void;
  language: string;
}

const intentions = {
  en: ["Myself", "Mother", "Father", "Sister", "Brother", "Family", "Friend", "Partner", "Humanity", "Enemies", "Community"],
  he: ["עצמי", "אמא", "אבא", "אחות", "אח", "משפחה", "חבר", "שותף", "האנושות", "אויבים", "הקהילה"],
  pt: ["Eu mesmo", "Mãe", "Pai", "Irmã", "Irmão", "Família", "Amigo", "Parceiro", "Humanidade", "Inimigos", "Comunidade"],
  fr: ["Moi-même", "Mère", "Père", "Sœur", "Frère", "Famille", "Ami", "Partenaire", "Humanité", "Ennemis", "Communauté"],
  de: ["Ich selbst", "Mutter", "Vater", "Schwester", "Bruder", "Familie", "Freund", "Partner", "Menschheit", "Feinde", "Gemeinschaft"],
  es: ["Yo mismo", "Madre", "Padre", "Hermana", "Hermano", "Familia", "Amigo", "Pareja", "Humanidad", "Enemigos", "Comunidad"],
  hi: ["स्वयं", "माता", "पिता", "बहन", "भाई", "परिवार", "मित्र", "साथी", "मानवता", "दुश्मन", "समुदाय"],
  ar: ["نفسي", "الأم", "الأب", "الأخت", "الأخ", "العائلة", "صديق", "شريك", "الإنسانية", "الأعداء", "مجتمع"],
  id: ["Diri", "Ibu", "Ayah", "Saudari", "Saudara", "Keluarga", "Teman", "Pasangan", "Kemanusiaan", "Musuh", "Komunitas"],
  tr: ["Kendim için", "Annem", "Babam", "Kardeşlerim", "Sağlık", "Zenginlik", "Huzur", "Şükür", "Rehberlik", "Güç", "Bilgelik", "Sevgi"]
};

const commonIntentions = {
  en: ["Work", "Health", "Peace", "Gratitude", "Guidance", "Strength", "Wisdom", "Love", "Forgiveness", "Faith", "Hope", "Success"],
  he: ["עבודה", "בריאות", "שלום", "הכרת תודה", "הדרכה", "כוח", "חוכמה", "אהבה", "סליחה", "אמונה", "תקווה", "הצלחה"],
  pt: ["Trabalho", "Saúde", "Paz", "Gratidão", "Orientação", "Força", "Sabedoria", "Amor", "Perdão", "Fé", "Esperança", "Sucesso"],
  fr: ["Travail", "Santé", "Paix", "Gratitude", "Direction", "Force", "Sagesse", "Amour", "Pardon", "Foi", "Espoir", "Succès"],
  de: ["Arbeit", "Gesundheit", "Frieden", "Dankbarkeit", "Führung", "Stärke", "Weisheit", "Liebe", "Vergebung", "Glaube", "Hoffnung", "Erfolg"],
  es: ["Trabajo", "Salud", "Paz", "Gratitud", "Guía", "Fuerza", "Sabiduría", "Amor", "Perdón", "Fe", "Esperanza", "Éxito"],
  hi: ["काम", "स्वास्थ्य", "शांति", "कृतज्ञता", "मार्गदर्शन", "शक्ति", "ज्ञान", "प्रेम", "क्षमा", "विश्वास", "आशा", "सफलता"],
  ar: ["عمل", "صحة", "سلام", "امتنان", "توجيه", "قوة", "حكمة", "حب", "مغفرة", "إيمان", "أمل", "نجاح"],
  id: ["Kerja", "Kesehatan", "Kedamaian", "Syukur", "Bimbingan", "Kekuatan", "Kebijaksanaan", "Cinta", "Pengampunan", "Iman", "Harapan", "Kesuksesan"],
  tr: ["İş", "Sağlık", "Huzur", "Şükür", "Rehberlik", "Güç", "Bilgelik", "Sevgi", "Affetme", "İnanç", "Umut", "Başarı"]
};

export const IntentionButtons: React.FC<IntentionButtonsProps> = ({ onSelect, language }) => {
  const [isPrayerForOpen, setIsPrayerForOpen] = useState(false);
  const [isIntentionsOpen, setIsIntentionsOpen] = useState(false);

  const currentIntentions = intentions[language as keyof typeof intentions] || intentions.en;
  const currentCommonIntentions = commonIntentions[language as keyof typeof commonIntentions] || commonIntentions.en;

  return (
    <div className="w-full max-w-2xl mx-auto mb-4 space-y-6">
      <div>
        <button
          onClick={() => setIsPrayerForOpen(!isPrayerForOpen)}
          className="w-full text-left px-4 py-2 bg-purple-500/20 rounded-lg flex justify-between items-center"
        >
          <span className="text-xl font-semibold text-black">Prayer For</span>
          <span className="text-2xl">{isPrayerForOpen ? '▼' : '▶'}</span>
        </button>
        
        {isPrayerForOpen && (
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-2 p-2 bg-purple-500/10 rounded-lg">
            {currentIntentions.map((intention, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onSelect(intention);
                }}
                className="px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 
                         rounded-lg transition-colors text-sm text-black
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
          onClick={() => setIsIntentionsOpen(!isIntentionsOpen)}
          className="w-full text-left px-4 py-2 bg-purple-500/20 rounded-lg flex justify-between items-center"
        >
          <span className="text-xl font-semibold text-black">Prayer Intentions</span>
          <span className="text-2xl">{isIntentionsOpen ? '▼' : '▶'}</span>
        </button>
        
        {isIntentionsOpen && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-2 p-2 bg-purple-500/10 rounded-lg">
            {currentCommonIntentions.map((intention, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onSelect(intention);
                }}
                className="px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 
                         rounded-lg transition-colors text-sm text-black
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
