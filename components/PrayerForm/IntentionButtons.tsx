import React from 'react';

interface IntentionButtonsProps {
  onSelect: (intention: string) => void;
  language: string;
}

const intentions = {
  en: ["Myself", "Mother", "Father", "Sister", "Brother", "Family", "Friend", "Partner", "Work", "Health", "Peace", "Gratitude", "Guidance", "Strength", "Wisdom", "Love", "Forgiveness", "Faith", "Hope", "Success"],
  he: ["עצמי", "אמא", "אבא", "אחות", "אח", "משפחה", "חבר", "שותף", "עבודה", "בריאות", "שלום", "הכרת תודה", "הדרכה", "כוח", "חוכמה", "אהבה", "סליחה", "אמונה", "תקווה", "הצלחה"],
  pt: ["Eu mesmo", "Mãe", "Pai", "Irmã", "Irmão", "Família", "Amigo", "Parceiro", "Trabalho", "Saúde", "Paz", "Gratidão", "Orientação", "Força", "Sabedoria", "Amor", "Perdão", "Fé", "Esperança", "Sucesso"],
  fr: ["Moi-même", "Mère", "Père", "Sœur", "Frère", "Famille", "Ami", "Partenaire", "Travail", "Santé", "Paix", "Gratitude", "Guidance", "Force", "Sagesse", "Amour", "Pardon", "Foi", "Espoir", "Succès"],
  de: ["Ich selbst", "Mutter", "Vater", "Schwester", "Bruder", "Familie", "Freund", "Partner", "Arbeit", "Gesundheit", "Frieden", "Dankbarkeit", "Führung", "Stärke", "Weisheit", "Liebe", "Vergebung", "Glaube", "Hoffnung", "Erfolg"],
  es: ["Yo mismo", "Madre", "Padre", "Hermana", "Hermano", "Familia", "Amigo", "Pareja", "Trabajo", "Salud", "Paz", "Gratitud", "Guía", "Fuerza", "Sabiduría", "Amor", "Perdón", "Fe", "Esperanza", "Éxito"],
  hi: ["स्वयं", "माता", "पिता", "बहन", "भाई", "परिवार", "मित्र", "साथी", "कार्य", "स्वास्थ्य", "शांति", "कृतज्ञता", "मार्गदर्शन", "शक्ति", "ज्ञान", "प्रेम", "क्षमा", "विश्वास", "आशा", "सफलता"],
  ar: ["نفسي", "الأم", "الأب", "الأخت", "الأخ", "العائلة", "صديق", "شريك", "العمل", "الصحة", "السلام", "الامتنان", "التوجيه", "القوة", "الحكمة", "الحب", "المغفرة", "الإيمان", "الأمل", "النجاح"],
  id: ["Diri", "Ibu", "Ayah", "Saudari", "Saudara", "Keluarga", "Teman", "Pasangan", "Pekerjaan", "Kesehatan", "Kedamaian", "Syukur", "Bimbingan", "Kekuatan", "Kebijaksanaan", "Cinta", "Pengampunan", "Iman", "Harapan", "Kesuksesan"],
  tr: ["Kendim için", "Annem", "Babam", "Kardeşlerim", "Sağlık", "Zenginlik", "Huzur", "Şükür", "Rehberlik", "Güç", "Bilgelik", "Sevgi", "Affetme", "İnanç", "Umut", "Başarı"]
};

export const IntentionButtons: React.FC<IntentionButtonsProps> = ({ onSelect, language }) => {
  const currentIntentions = intentions[language as keyof typeof intentions] || intentions.en;
  const commonIntentions = ["Work", "Health", "Peace", "Gratitude", "Guidance", "Strength", "Wisdom", "Love", "Forgiveness", "Faith", "Hope", "Success"];

  return (
    <div className="w-full max-w-2xl mx-auto mb-4 space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-black mb-3">Prayer For?</h2>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {currentIntentions.map((intention, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Button clicked:', intention);
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
      </div>
      <div>
        <h2 className="text-xl font-semibold text-black mb-3">Prayer Intentions</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {commonIntentions.map((intention, index) => (
            <button
              key={`common-${index}`}
              onClick={(e) => {
                e.preventDefault();
                onSelect(intention);
              }}
              className="p-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:border-purple-500/50 hover:bg-purple-50 transition-colors text-sm"
            >
              {intention}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};