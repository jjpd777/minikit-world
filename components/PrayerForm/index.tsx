"use client";
import { useState } from 'react';
import Image from 'next/image';

export const PrayerForm = ({ onPrayerGenerated }: { onPrayerGenerated: (prayer: string) => void }) => {
  const [language, setLanguage] = useState('en');
  const [intentions, setIntentions] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const languages = [
    { 
      code: 'en', 
      name: 'English', 
      flag: '/usa.svg',
      choices: ['Mother', 'Father', 'Brothers', 'Sisters', 'Health', 'Money', 'Love']
    },
    { 
      code: 'es', 
      name: 'Spanish', 
      flag: '/colombia.svg',
      choices: ['Madre', 'Padre', 'Hermanos', 'Hermanas', 'Salud', 'Dinero', 'Amor']
    },
    { 
      code: 'pt', 
      name: 'Portuguese', 
      flag: '/brazil.svg',
      choices: ['Mãe', 'Pai', 'Irmãos', 'Irmãs', 'Saúde', 'Dinheiro', 'Amor']
    },
    { 
      code: 'fr', 
      name: 'French', 
      flag: '/france.svg',
      choices: ['Mère', 'Père', 'Frères', 'Sœurs', 'Santé', 'Argent', 'Amour']
    },
    { 
      code: 'de', 
      name: 'German', 
      flag: '/deutschland.svg',
      choices: ['Mutter', 'Vater', 'Brüder', 'Schwestern', 'Gesundheit', 'Geld', 'Liebe']
    },
    { 
      code: 'he', 
      name: 'Hebrew', 
      flag: '/israel.svg',
      choices: ['אמא', 'אבא', 'אחים', 'אחיות', 'בריאות', 'כסף', 'אהבה']
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/generate-prayer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language,
          intentions,
        }),
      });

      const data = await response.json();
      onPrayerGenerated(data.prayer);
    } catch (error) {
      console.error('Error generating prayer:', error);
      alert('Failed to generate prayer. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-8">
      <div className="flex flex-col items-center gap-8 w-full">
        <div className="grid grid-cols-3 gap-2 w-full max-w-md">
          {languages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => setLanguage(lang.code)}
              className={`p-2 rounded-lg border ${
                language === lang.code
                  ? 'border-purple-500 bg-purple-500/20'
                  : 'border-gray-700 bg-gray-800'
              } flex flex-col items-center gap-2 hover:border-purple-500/50 transition-colors`}
            >
              <Image
                src={lang.flag}
                alt={lang.name}
                width={24}
                height={24}
                className="rounded-sm"
              />

            </button>
          ))}
        </div>
        <div className="w-full max-w-2xl">
          <div className="grid grid-cols-3 gap-6">

          {languages.find(lang => lang.code === language)?.choices.map((choice, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setIntentions(prev => prev ? `${prev}, ${choice}` : choice)}
              className="p-2 min-w-[90px] w-full rounded-lg border border-gray-700 bg-gray-800 text-white hover:border-purple-500/50 transition-colors text-sm"
            >
              {choice}
            </button>
          ))}
          </div>
        </div>
      </div>  

      <div className="flex flex-col gap-2 w-full max-w-2xl mx-auto">
        <label htmlFor="intentions" className="text-white">Prayer Intentions</label>
        <textarea
          id="intentions"
          value={intentions}
          onChange={(e) => setIntentions(e.target.value)}
          placeholder="Enter your prayer intentions..."
          className="p-2 rounded-lg bg-gray-800 text-white border border-gray-700 h-32"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-4 py-2 bg-purple-500/80 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
      >
        {isLoading ? 'Generating...' : 'Generate Prayer'}
      </button>
    </form>
  );
};