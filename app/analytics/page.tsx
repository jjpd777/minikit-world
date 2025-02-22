
"use client";
import { useState, useEffect } from "react";

interface AnalyticsData {
  totalUniqueAddresses: number;
  addressCounts: { [key: string]: number };
}

const TABLES = [
  'prayer_events',
  'prayer_events_whatsapp',
  'prayer_events_voicegen',
  'gameplay_tracking'
];

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState(TABLES[0]);
  const [selectedReligion, setSelectedReligion] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/analytics?table=${selectedTable}&religion=${selectedReligion}`);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedTable, selectedReligion]);

  if (loading) return <div className="flex min-h-screen items-center justify-center">Loading...</div>;

  if (!data) return <div className="flex min-h-screen items-center justify-center">No data available</div>;

  return (
    <div className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-2xl font-bold mb-8">Analytics Dashboard</h1>
      
      <div className="w-full max-w-2xl space-y-8">
        <div className="flex justify-center gap-4">
          {TABLES.map((table) => (
            <button
              key={table}
              onClick={() => setSelectedTable(table)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedTable === table
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
              }`}
            >
              {table.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
        <div className="flex justify-center gap-4 mb-4">
          <button
            onClick={() => setSelectedReligion('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedReligion === 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setSelectedReligion('christian')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedReligion === 'christian'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
            }`}
          >
            Christian ✝️
          </button>
          <button
            onClick={() => setSelectedReligion('jewish')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedReligion === 'jewish'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
            }`}
          >
            Jewish ✡️
          </button>
          <button
            onClick={() => setSelectedReligion('islamic')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedReligion === 'islamic'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
            }`}
          >
            Islamic ☪️
          </button>
          <button
            onClick={() => setSelectedReligion('buddhist')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedReligion === 'buddhist'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
            }`}
          >
            Buddhist ☸️
          </button>
          <button
            onClick={() => setSelectedReligion('orthodox')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedReligion === 'orthodox'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
            }`}
          >
            Orthodox ☦️
          </button>
          <button
            onClick={() => setSelectedReligion('sikh')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedReligion === 'sikh'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
            }`}
          >
            Sikh 🪯
          </button>
          <button
            onClick={() => setSelectedReligion('atheist')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedReligion === 'atheist'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
            }`}
          >
            Atheist ⚛️
          </button>
          <button
            onClick={() => setSelectedReligion('hindu')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedReligion === 'hindu'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
            }`}
          >
            Hindu 🕉️
          </button>
        </div>
        <div className="bg-gray-800/50 p-6 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl mb-4">Total Unique Addresses</h2>
              <p className="text-4xl font-bold text-purple-500">{data.totalUniqueAddresses}</p>
            </div>
            <div>
              <h2 className="text-xl mb-4">Total Entries</h2>
              <p className="text-4xl font-bold text-purple-500">{data.totalEntries}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 p-6 rounded-lg text-white">
          <h2 className="text-xl mb-4">Address Activity</h2>
          <div className="space-y-4">
            {Object.entries(data.addressCounts)
              .sort(([,a], [,b]) => b - a)
              .map(([address, count]) => (
                <div key={address} className="flex justify-between items-center border-b border-gray-700 pb-2">
                  <span className="font-mono">{address}</span>
                  <span className="bg-purple-500/20 px-3 py-1 rounded-full">{count} prayers</span>
                </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
