
import { SignIn } from "@/components/SignIn";
import { WalletAuth } from "@/components/WalletAuth";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col p-8 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="flex justify-between items-center mb-8">
        <Image
          src="/bendiga_logo.png"
          alt="Bendiga Logo"
          width={150}
          height={150}
          priority
        />
        <WalletAuth />
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md">
          <SignIn />
        </div>
      </div>
    </main>
  );
}
