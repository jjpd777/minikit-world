import React from 'react';
import { intentions, commonIntentions } from './intentions';

interface IntentionButtonsProps {
  onSelect: (intention: string) => void;
  language: string;
}

export const IntentionButtons: React.FC<IntentionButtonsProps> = ({ onSelect, language }) => {
  const currentIntentions = intentions[language as keyof typeof intentions] || intentions.en;
  const currentCommonIntentions = commonIntentions[language as keyof typeof commonIntentions] || commonIntentions.en;

  return (
    <div className="w-full max-w-2xl mx-auto mb-4 space-y-6">
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
        {currentIntentions.map((intention, index) => (
          <button
            key={index}
            onClick={() => onSelect(intention)}
            className="px-3 py-2 rounded-lg transition-colors text-sm text-white border bg-purple-500/35 border-purple-500/30 hover:bg-purple-500/50 hover:border-purple-500/50"
          >
            {intention}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
        {currentCommonIntentions.map((intention, index) => (
          <button
            key={index}
            onClick={() => onSelect(intention)}
            className="px-3 py-2 rounded-lg transition-colors text-sm text-white border bg-purple-500/35 border-purple-500/30 hover:bg-purple-500/50 hover:border-purple-500/50"
          >
            {intention}
          </button>
        ))}
      </div>
    </div>
  );
};