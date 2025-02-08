
import { SignIn } from "@/components/SignIn";
import { WalletAuth } from "@/components/WalletAuth";
import Image from "next/image";

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="absolute top-4 right-4">
        <WalletAuth />
      </div>
      <div className="w-full max-w-md flex flex-col items-center gap-8">
        <Image
          src="/bendiga_logo.png"
          alt="Bendiga Logo"
          width={300}
          height={300}
          priority
          className="mb-4"
        />
        <SignIn />
      </div>
    </main>
  );
}
