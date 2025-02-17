import { SignIn } from "@/components/SignIn";
import { WalletAuth } from "@/components/WalletAuth";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="w-full max-w-md flex flex-col items-center gap-8">
        <SignIn />
      </div>
    </main>
  );
}
