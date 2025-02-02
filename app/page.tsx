
import { SignIn } from "@/components/SignIn";
import { PayBlock } from "@/components/Pay";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-4">
      <SignIn />
      <PayBlock />
    </main>
  );
}
