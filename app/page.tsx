
import { SignIn } from "@/components/SignIn";
import { VoiceRecorder } from "@/components/VoiceRecorder";
import { VerifyBlock } from "@/components/Verify";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <VoiceRecorder />
      <SignIn />
      <VerifyBlock />
    </main>
  );
}
