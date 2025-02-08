import { SignIn } from "@/components/SignIn";
import { SignMessage } from "@/components/SignMessage";
import Image from "next/image";
import { useSession } from "next-auth/react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="w-full max-w-md flex flex-col items-center gap-8">
        <Image
          src="/bendiga_logo.png"
          alt="Bendiga Logo"
          width={500}
          height={500}
          priority
          className="mb-8"
        />
        <>Build a daily prayer habit</>
        <SignIn />
        <SignMessage />
      </div>
    </main>
  );
}
