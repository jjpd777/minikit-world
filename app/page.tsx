
import { SignIn } from "@/components/SignIn";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="w-full max-w-md flex flex-col items-center gap-8">
        <Image
          src="/bendiga_logo.png"
          alt="Bendiga Logo"
          width={300}
          height={300}
          priority
          className="mb-4"
        />
        <h1 className="text-2xl text-white text-center font-bold mb-8">
          Build a prayer habit with A.I.
        </h1>
        <SignIn />
      </div>
    </main>
  );
}
