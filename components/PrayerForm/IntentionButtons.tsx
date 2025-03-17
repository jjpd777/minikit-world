
import React from 'react';

interface IntentionButtonsProps {
  onSelect: (intention: string) => void;
}

const intentions = [
  "Myself", "Mother", "Father", "Sister", "Brother", 
  "Family", "Friend", "Partner", "Work", "Health",
  "Peace", "Gratitude", "Guidance", "Strength", "Wisdom"
];

export const IntentionButtons: React.FC<IntentionButtonsProps> = ({ onSelect }) => {
  return (
    <div className="w-full max-w-2xl mx-auto mb-4">
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
        {intentions.map((intention) => (
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
