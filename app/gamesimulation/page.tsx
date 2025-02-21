
'use client';
import dynamic from 'next/dynamic';

const Scene = dynamic(() => import('@/components/ThreeScene'), { ssr: false });

export default function GameSimulation() {
  return (
    <div className="w-full h-screen">
      <Scene />
    </div>
  );
}
