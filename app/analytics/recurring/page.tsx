
'use client';

import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

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
    timestamps: string[];
  }>;
  totalUniqueAddresses: number;
}

export default function RecurringAnalytics() {
  const [data, setData] = useState<RecurringData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/recurring');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching recurring data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  if (!data) return <div className="flex min-h-screen items-center justify-center">No data available</div>;

  const chartData = {
    labels: data.topAddresses.map(item => item.address.substring(0, 8) + '...'),
    datasets: [
      {
        label: 'Prayer Generations',
        data: data.topAddresses.map(item => item.count),
        backgroundColor: 'rgba(147, 51, 234, 0.5)',
        borderColor: 'rgb(147, 51, 234)',
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
        text: 'Top 100 Addresses by Prayer Generations',
        color: 'white',
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `Generations: ${context.parsed.y}`;
          },
          title: function(context: any) {
            const address = data.topAddresses[context[0].dataIndex].address;
            return `Address: ${address}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'white',
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'white',
        }
      }
    }
  };

  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);

  const options = {
    ...chartOptions,
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
        {selectedAddress && (
          <div className="mt-4 p-4 bg-gray-700/50 rounded-lg">
            <h3 className="text-white font-semibold mb-2">Prayer Timestamps for {selectedAddress}</h3>
            <div className="max-h-40 overflow-y-auto">
              {data.topAddresses.find(a => a.address === selectedAddress)?.timestamps.map((timestamp, i) => (
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
