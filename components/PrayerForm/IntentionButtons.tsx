
import React from 'react';

interface IntentionButtonsProps {
  onSelect: (intention: string) => void;
  language: string;
}

const intentions = {
  en: ["Myself", "Mother", "Father", "Sister", "Brother", "Family", "Friend", "Partner", "Work", "Health", "Peace", "Gratitude", "Guidance", "Strength", "Wisdom"],
  he: ["עצמי", "אמא", "אבא", "אחות", "אח", "משפחה", "חבר", "שותף", "עבודה", "בריאות", "שלום", "הכרת תודה", "הדרכה", "כוח", "חוכמה"],
  pt: ["Eu mesmo", "Mãe", "Pai", "Irmã", "Irmão", "Família", "Amigo", "Parceiro", "Trabalho", "Saúde", "Paz", "Gratidão", "Orientação", "Força", "Sabedoria"],
  fr: ["Moi-même", "Mère", "Père", "Sœur", "Frère", "Famille", "Ami", "Partenaire", "Travail", "Santé", "Paix", "Gratitude", "Guidance", "Force", "Sagesse"],
  de: ["Ich selbst", "Mutter", "Vater", "Schwester", "Bruder", "Familie", "Freund", "Partner", "Arbeit", "Gesundheit", "Frieden", "Dankbarkeit", "Führung", "Stärke", "Weisheit"],
  es: ["Yo mismo", "Madre", "Padre", "Hermana", "Hermano", "Familia", "Amigo", "Pareja", "Trabajo", "Salud", "Paz", "Gratitud", "Guía", "Fuerza", "Sabiduría"],
  hi: ["स्वयं", "माता", "पिता", "बहन", "भाई", "परिवार", "मित्र", "साथी", "कार्य", "स्वास्थ्य", "शांति", "कृतज्ञता", "मार्गदर्शन", "शक्ति", "ज्ञान"],
  ar: ["نفسي", "الأم", "الأب", "الأخت", "الأخ", "العائلة", "صديق", "شريك", "العمل", "الصحة", "السلام", "الامتنان", "التوجيه", "القوة", "الحكمة"]
};

export const IntentionButtons: React.FC<IntentionButtonsProps> = ({ onSelect, language }) => {
  const currentIntentions = intentions[language as keyof typeof intentions] || intentions.en;
  
  return (
    <div className="w-full max-w-2xl mx-auto mb-4">
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
        {currentIntentions.map((intention) => (
          <button
            key={intention}
            onClick={() => onSelect(intention)}
            className="px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 
                     rounded-lg transition-colors text-sm text-white
                     border border-purple-500/30 hover:border-purple-500/50"
          >
            {intention}
          </button>
        ))}
      </div>
    </div>
  );
};
