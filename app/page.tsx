import { SignIn } from "@/components/SignIn";
import { WalletAuth } from "@/components/WalletAuth";

export default function Home() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-8 bg-gradient-to-b from-blue-50 to-yellow-50">
      <div className="w-full max-w-md flex flex-col items-center">
        <SignIn />
      </div>
    </main>
  );
}
