import React, { useState } from 'react';
import { intentions, commonIntentions } from './intentions';

interface IntentionButtonsProps {
  onSelect: (intention: string) => void;
  language: string;
}

export const IntentionButtons: React.FC<IntentionButtonsProps> = ({ onSelect, language }) => {
  const [selectedIntentions, setSelectedIntentions] = useState<string[]>([]);
  const [showPrayerFor, setShowPrayerFor] = useState(false);
  const [showCommonIntentions, setShowCommonIntentions] = useState(false);
  const currentIntentions = intentions[language as keyof typeof intentions] || intentions.en;
  const currentCommonIntentions = commonIntentions[language as keyof typeof commonIntentions] || commonIntentions.en;

  const handleSelect = (intention: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const newIntentions = selectedIntentions.includes(intention)
      ? selectedIntentions.filter(i => i !== intention)
      : [...selectedIntentions, intention];

    setSelectedIntentions(newIntentions);
    onSelect(intention);
    localStorage.setItem("selectedIntentions", JSON.stringify(newIntentions));
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-4 space-y-6">
      <div>
        <button 
          onClick={() => setShowPrayerFor(!showPrayerFor)} 
          className="text-base text-gray-700 mb-3 flex items-center gap-2"
        >
          {({
            en: "Prayer For",
            es: "Oración Para",
            tr: "Dua İçin",
            he: "תפילה עבור",
            pt: "Oração Para",
            hi: "प्रार्थना के लिए",
            ar: "الصلاة من أجل",
            fr: "Prière Pour",
            de: "Gebet Für",
            id: "Doa Untuk"
          })[language] || "Prayer For"}
          <svg 
            className={`w-4 h-4 transform transition-transform ${showPrayerFor ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div className={`grid grid-cols-3 sm:grid-cols-5 gap-2 transition-all duration-300 ${showPrayerFor ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          {currentIntentions.map((intention, index) => (
            <button
              key={index}
              onClick={(e) => handleSelect(intention, e)}
              className={`px-3 py-2 rounded-lg transition-colors text-sm text-white border
                ${selectedIntentions.includes(intention)
                  ? 'bg-purple-700/65 border-purple-700/50'
                  : 'bg-purple-500/35 border-purple-500/30 hover:bg-purple-500/50 hover:border-purple-500/50'
                }`}
            >
              {intention}
            </button>
          ))}
        </div>
      </div>

      <div>
        <button 
          onClick={() => setShowCommonIntentions(!showCommonIntentions)}
          className="text-base text-gray-700 mb-3 flex items-center gap-2"
        >
          {({
            en: "Common Prayer Intentions",
            es: "Intenciones Comunes de Oración",
            tr: "Yaygın Dua Niyetleri",
            he: "כוונות תפילה נפוצות",
            pt: "Intenções Comuns de Oração",
            hi: "सामान्य प्रार्थना इरादे",
            ar: "نوايا الصلاة الشائعة",
            fr: "Intentions de Prière Communes",
            de: "Häufige Gebetsanliegen",
            id: "Niat Doa Umum"
          })[language] || "Common Prayer Intentions"}
          <svg 
            className={`w-4 h-4 transform transition-transform ${showCommonIntentions ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div className={`grid grid-cols-3 sm:grid-cols-5 gap-2 transition-all duration-300 ${showCommonIntentions ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          {currentCommonIntentions.map((intention, index) => (
            <button
              key={index}
              onClick={(e) => handleSelect(intention, e)}
              className={`px-3 py-2 rounded-lg transition-colors text-sm text-white border
                ${selectedIntentions.includes(intention)
                  ? 'bg-purple-700/65 border-purple-700/50'
                  : 'bg-purple-500/35 border-purple-500/30 hover:bg-purple-500/50 hover:border-purple-500/50'
                }`}
            >
              {intention}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};