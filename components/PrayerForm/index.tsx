
"use client";
import { useState } from 'react';

export const PrayerForm = ({ onPrayerGenerated }: { onPrayerGenerated: (prayer: string) => void }) => {
  const [language, setLanguage] = useState('en');
  const [intentions, setIntentions] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="language" className="text-white">Select Language</label>
        <select
          id="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="p-2 rounded-lg bg-gray-800 text-white border border-gray-700"
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="pt">Portuguese</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="he">Hebrew</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
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
