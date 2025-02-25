'use client';
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface RecurringData {
  topAddresses: Array<{
    address: string;
    count: number;
  }>;
  totalUniqueAddresses: number;
}

export default function RecurringAnalytics() {
  const [data, setData] = useState<RecurringData | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [timestamps, setTimestamps] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/recurring')
      .then(res => res.json())
      .then(setData);
  }, []);

  useEffect(() => {
    if (selectedAddress) {
      fetch(`/api/recurring?address=${selectedAddress}`)
        .then(res => res.json())
        .then(data => setTimestamps(data.timestamps));
    }
  }, [selectedAddress]);

  if (!data) return <div>Loading...</div>;

  const chartData = {
    labels: data.topAddresses.map(item => item.address.slice(0, 8) + '...'),
    datasets: [
      {
        label: 'Prayer Count',
        data: data.topAddresses.map(item => item.count),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const options = {
    responsive: true,
    onClick: (event: any, elements: any) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const address = data.topAddresses[index].address;
        setSelectedAddress(address === selectedAddress ? null : address);
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-2xl font-bold mb-8 text-white">Recurring Users Analytics</h1>
      <div className="w-full max-w-7xl bg-gray-800/50 p-6 rounded-lg">
        <Bar data={chartData} options={options} />

        {selectedAddress && timestamps.length > 0 && (
          <div className="mt-4 p-4 bg-gray-700/50 rounded-lg">
            <h3 className="text-white font-semibold mb-2">Prayer Times for {selectedAddress}</h3>
            <div className="max-h-40 overflow-y-auto">
              {timestamps.map((timestamp, i) => (
                <div key={i} className="text-gray-300 text-sm py-1">
                  {new Date(timestamp).toLocaleString()}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}