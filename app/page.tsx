import { SignIn } from "@/components/SignIn";
import { VoiceRecorder } from "@/components/VoiceRecorder";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <VoiceRecorder />
      <SignIn />
    </main>
  );
}