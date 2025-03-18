import React from 'react';

interface IntentionButtonsProps {
  onSelect: (intention: string) => void;
  language: string;
}

const intentions = {
  en: ["Myself", "Mother", "Father", "Sister", "Brother", "Family", "Friend", "Partner", "Humanity", "The Poor", "The Suffering", "My Community"],
  he: ["עצמי", "אמא", "אבא", "אחות", "אח", "משפחה", "חבר", "שותף", "האנושות", "העניים", "הסובלים", "הקהילה שלי"],
  pt: ["Eu mesmo", "Mãe", "Pai", "Irmã", "Irmão", "Família", "Amigo", "Parceiro", "Humanidade", "Os Pobres", "Os Sofredores", "Minha Comunidade"],
  fr: ["Moi-même", "Mère", "Père", "Sœur", "Frère", "Famille", "Ami", "Partenaire", "Humanité", "Les Pauvres", "Les Souffrants", "Ma Communauté"],
  de: ["Ich selbst", "Mutter", "Vater", "Schwester", "Bruder", "Familie", "Freund", "Partner", "Menschheit", "Die Armen", "Die Leidenden", "Meine Gemeinschaft"],
  es: ["Yo mismo", "Madre", "Padre", "Hermana", "Hermano", "Familia", "Amigo", "Pareja", "Humanidad", "Los Pobres", "Los Sufrientes", "Mi Comunidad"],
  hi: ["स्वयं", "माता", "पिता", "बहन", "भाई", "परिवार", "मित्र", "साथी", "मानवता", "गरीब", "पीड़ित", "मेरा समुदाय"],
  ar: ["نفسي", "الأم", "الأب", "الأخت", "الأخ", "العائلة", "صديق", "شريك", "الإنسانية", "الفقراء", "المعاناة", "مجتمعي"],
  id: ["Diri", "Ibu", "Ayah", "Saudari", "Saudara", "Keluarga", "Teman", "Pasangan", "Kemanusiaan", "Orang Miskin", "Penderitaan", "Komunitas Saya"],
  tr: ["Kendim için", "Annem", "Babam", "Kardeşlerim", "Sağlık", "Zenginlik", "Huzur", "Şükür", "Rehberlik", "Güç", "Bilgelik", "Sevgi", "Affetme", "İnanç", "Umut", "Başarı"]
};

export const IntentionButtons: React.FC<IntentionButtonsProps> = ({ onSelect, language }) => {
  const currentIntentions = intentions[language as keyof typeof intentions] || intentions.en;
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

  const currentCommonIntentions = commonIntentions[language as keyof typeof commonIntentions] || commonIntentions.en;

  return (
    <div className="w-full max-w-2xl mx-auto mb-4 space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-black mb-3">Prayer For</h2>
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
          {currentCommonIntentions.map((intention, index) => (
            <button
              key={`common-${index}`}
              onClick={(e) => {
                e.preventDefault();
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
    </div>
  );
};