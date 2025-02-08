
import { SignIn } from "@/components/SignIn";
import { SignMessage } from "@/components/SignMessage";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <SignIn />
      <SignMessage />
    </main>
  );
}
