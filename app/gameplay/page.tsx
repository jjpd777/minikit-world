import GameComponent from '@/components/GameComponent';

export default function GameplayPage() {
  const trackGameStart = () => {
    //Implementation for tracking game start would go here.  This is placeholder code.
    console.log("Game started!");
  };
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
      {/* <h1 className="text-2xl text-white mb-4">Infinite Runner</h1> */}
      <Link href="/verified" className="absolute top-4 left-4">
        <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
          Back
        </button>
      </Link>
      <button 
        onClick={trackGameStart}
        className="absolute top-4 right-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
      >
        Play Game
      </button>
      <GameComponent />
    </main>
  );
}