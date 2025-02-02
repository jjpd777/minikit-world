
import { SignIn } from "@/components/SignIn";
import { MessageOnChain } from "@/components/MessageOnChain";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-4">
      <SignIn />
      <MessageOnChain />
    </main>
  );
}
