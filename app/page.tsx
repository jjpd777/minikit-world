import { SignIn } from "@/components/SignIn";
import { WalletAuth } from "@/components/WalletAuth";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="w-full max-w-md flex flex-col items-center">
        <SignIn />
        <a 
          href="/audio_sample.mp3" 
          download 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Download Audio Sample
        </a>
      </div>
    </main>
  );
}
