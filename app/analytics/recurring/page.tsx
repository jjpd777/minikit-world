
"use client";
import { useState, useEffect } from 'react';
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

interface DataType {
  topAddresses: Array<{
    address: string;
    count: number;
  }>;
  totalUniqueAddresses: number;
}

export default function RecurringAnalytics() {
  const [data, setData] = useState<DataType | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [events, setEvents] = useState<Array<{timestamp: string, religion: string, language: string}>>([]);

  useEffect(() => {
    fetch('/api/recurring')
      .then(res => res.json())
      .then(setData);
  }, []);

  useEffect(() => {
    if (selectedAddress) {
      fetch(`/api/recurring?address=${selectedAddress}`)
        .then(res => res.json())
        .then(data => setEvents(data.events || []));
    }
  }, [selectedAddress]);

  if (!data) return <div>Loading...</div>;

  const specialAddresses = [
    '0x782a4645cdc589683cbc1b1f25236151552f171e',
    '0x56b23f922f2967b465eb1502578efa7261522dd2'
  ];

  const chartData = {
    labels: data.topAddresses.map(item => {
      if (specialAddresses.includes(item.address.toLowerCase())) {
        return 'Juan Testing';
      }
      return item.address;
    }),
    datasets: [
      {
        label: 'Number of Prayers Generated',
        data: data.topAddresses.map(item => item.count),
        backgroundColor: data.topAddresses.map(item => 
          specialAddresses.includes(item.address.toLowerCase()) 
            ? 'rgba(59, 130, 246, 0.5)' // blue color
            : 'rgba(147, 51, 234, 0.5)'  // default purple
        ),
        borderColor: data.topAddresses.map(item =>
          specialAddresses.includes(item.address.toLowerCase())
            ? 'rgba(59, 130, 246, 1)' // blue border
            : 'rgba(147, 51, 234, 1)'  // default purple border
        ),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `Top 100 Users (Total Unique Users: ${data.totalUniqueAddresses})`,
        color: 'white',
      },
    },
    onClick: (event: any, elements: any) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const address = data.topAddresses[index].address;
        setSelectedAddress(address === selectedAddress ? null : address);
      }
    },
    scales: {
      y: {
        ticks: { color: 'white' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
      x: {
        ticks: { color: 'white', maxRotation: 90, minRotation: 90 },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
    },
  };

  return (
    <div className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-2xl font-bold mb-8 text-white">Recurring Users Analytics</h1>
      <div className="w-full max-w-7xl bg-gray-800/50 p-6 rounded-lg">
        <Bar data={chartData} options={options} />
        {selectedAddress && (
          <div className="mt-4 p-4 bg-gray-700/50 rounded-lg">
            <h3 className="text-white font-semibold mb-2">Prayer Timestamps for {selectedAddress}</h3>
            <div className="max-h-40 overflow-y-auto">
              {events.map((event, i) => (
                <div key={i} className="text-gray-300 text-sm py-1 flex gap-4">
                  <span>{new Date(event.timestamp).toLocaleString()}</span>
                  <span>{event.religion}</span>
                  <span>{event.language}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
