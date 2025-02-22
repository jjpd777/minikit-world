
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/analytics?table=${selectedTable}`);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
        <div className="bg-gray-800/50 p-6 rounded-lg">
          <h2 className="text-xl mb-4">Total Unique Addresses</h2>
          <p className="text-4xl font-bold text-purple-500">{data.totalUniqueAddresses}</p>
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
