import React from 'react';

interface IntentionButtonsProps {
  onSelect: (intention: string) => void;
  language: string;
}

const sectionTitles = {
  en: { prayerFor: "Prayer For", prayerIntentions: "Prayer Intentions" },
  he: { prayerFor: "תפילה עבור", prayerIntentions: "כוונות תפילה" },
  pt: { prayerFor: "Oração Para", prayerIntentions: "Intenções de Oração" },
  fr: { prayerFor: "Prière Pour", prayerIntentions: "Intentions de Prière" },
  de: { prayerFor: "Gebet Für", prayerIntentions: "Gebetsanliegen" },
  es: { prayerFor: "Oración Por", prayerIntenciones: "Intenciones de Oración" },
  hi: { prayerFor: "प्रार्थना किसके लिए", prayerIntentions: "प्रार्थना का उद्देश्य" },
  ar: { prayerFor: "صلاة من أجل", prayerIntentions: "نوايا الصلاة" },
  id: { prayerFor: "Doa Untuk", prayerIntentions: "Niat Doa" },
  tr: { prayerFor: "Dua İçin", prayerIntentions: "Dua Niyetleri" },
  ms: { prayerFor: "Doa Untuk", prayerIntentions: "Niat Doa" },
  sw: { prayerFor: "Sala Kwa Ajili Ya", prayerIntentions: "Kusudi La Sala"}
};

const intentions: { [key: string]: string[] } = {
  en: ["Myself", "Mother", "Father", "Siblings", "Health", "Wealth"],
  he: ["עצמי", "אמא", "אבא", "אחים ואחיות", "בריאות", "עושר"],
  pt: ["Eu mesmo", "Mãe", "Pai", "Irmãos", "Saúde", "Riqueza"],
  fr: ["Moi-même", "Mère", "Père", "Frères et Sœurs", "Santé", "Richesse"],
  de: ["Ich selbst", "Mutter", "Vater", "Geschwister", "Gesundheit", "Reichtum"],
  es: ["Yo mismo", "Madre", "Padre", "Hermanos", "Salud", "Riqueza"],
  hi: ["स्वयं", "माता", "पिता", "भाई-बहन", "स्वास्थ्य", "धन"],
  ar: ["نفسي", "الأم", "الأب", "الإخوة", "الصحة", "الثروة"],
  id: ["Diri Sendiri", "Ibu", "Ayah", "Saudara", "Kesehatan", "Kekayaan"],
  tr: ["Kendim için", "Annem", "Babam", "Kardeşlerim", "Sağlık", "Zenginlik"],
  ms: ["Diri Sendiri", "Ibu", "Bapa", "Adik-beradik", "Kesihatan", "Kekayaan"],
  sw: ["Mimi", "Mama", "Baba", "Ndugu", "Afya", "Utajiri"]
};

const commonIntentions: { [key: string]: string[] } = {
  en: ["Work", "Health", "Peace", "Gratitude", "Guidance", "Strength", "Wisdom", "Love", "Forgiveness", "Faith", "Hope", "Success"],
  he: ["עבודה", "בריאות", "שלום", "הכרת תודה", "הדרכה", "כוח", "חכמה", "אהבה", "סליחה", "אמונה", "תקווה", "הצלחה"],
  pt: ["Trabalho", "Saúde", "Paz", "Gratidão", "Orientação", "Força", "Sabedoria", "Amor", "Perdão", "Fé", "Esperança", "Sucesso"],
  fr: ["Travail", "Santé", "Paix", "Gratitude", "Guidance", "Force", "Sagesse", "Amour", "Pardon", "Foi", "Espoir", "Succès"],
  de: ["Arbeit", "Gesundheit", "Frieden", "Dankbarkeit", "Führung", "Kraft", "Weisheit", "Liebe", "Vergebung", "Glaube", "Hoffnung", "Erfolg"],
  es: ["Trabajo", "Salud", "Paz", "Gratitud", "Guía", "Fuerza", "Sabiduría", "Amor", "Perdón", "Fe", "Esperanza", "Éxito"],
  ms: ["Kerja", "Kesihatan", "Keamanan", "Syukur", "Bimbingan", "Kekuatan", "Kebijaksanaan", "Kasih", "Kemaafan", "Iman", "Harapan", "Kejayaan"],
  hi: ["कार्य", "स्वास्थ्य", "शांति", "कृतज्ञता", "मार्गदर्शन", "शक्ति", "ज्ञान", "प्रेम", "क्षमा", "विश्वास", "आशा", "सफलता"],
  ar: ["عمل", "صحة", "سلام", "امتنان", "توجيه", "قوة", "حكمة", "حب", "مغفرة", "إيمان", "أمل", "نجاح"],
  id: ["Kerja", "Kesehatan", "Kedamaian", "Syukur", "Bimbingan", "Kekuatan", "Kebijaksanaan", "Cinta", "Pengampunan", "Iman", "Harapan", "Kesuksesan"],
  tr: ["İş", "Sağlık", "Huzur", "Şükür", "Rehberlik", "Güç", "Bilgelik", "Sevgi", "Affetme", "İnanç", "Umut", "Başarı"],
  sw: ["Kazi", "Afya", "Amani", "Shukrani", "Uongozi", "Nguvu", "Hekima", "Upendo", "Msamaha", "Imani", "Tumaini", "Mafanikio"]
};

export const IntentionButtons: React.FC<IntentionButtonsProps> = ({ onSelect, language }) => {
  const currentIntentions = intentions[language as keyof typeof intentions] || intentions.en;
  const currentCommonIntentions = commonIntentions[language as keyof typeof commonIntentions] || commonIntentions.en;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-2">
      <div>
        <h3 className="text-lg font-medium text-blue-400 mb-1">{sectionTitles[language as keyof typeof sectionTitles]?.prayerFor || "Prayer For"}</h3>
        <div className="grid grid-cols-6 gap-1">
          {currentIntentions.map((intention, index) => (
            <button
              title={intention}
              key={index}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onSelect(intention);
              }}
              className="px-2 py-1 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg transition-colors text-xs text-white border border-purple-500/30 hover:border-purple-500/50 overflow-hidden"
            >
              {intention.length > 8 ? intention.slice(0, 8) + '...' : intention}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-blue-400 mb-1">{sectionTitles[language as keyof typeof sectionTitles]?.prayerIntentions || "Prayer Intentions"}</h3>
        <div className="grid grid-cols-6 gap-1">
          {currentCommonIntentions.map((intention, index) => (
            <button
              key={`common-${index}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onSelect(intention);
              }}
              title={intention}
              className="px-2 py-1 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg transition-colors text-xs text-white border border-purple-500/30 hover:border-purple-500/50 overflow-hidden"
            >
              {intention.length > 8 ? intention.slice(0, 8) + '...' : intention}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};