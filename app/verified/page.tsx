
"use client";
import { PrayerForm } from "@/components/PrayerForm";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function VerifiedPage() {
  const router = useRouter();

  useEffect(() => {
    const isVerified = localStorage.getItem('worldcoin_verified') === 'true';
    if (!isVerified) {
      router.push('/');
    }
  }, [router]);
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold text-white mb-8">Hello Verified User</h1>
      <PrayerForm />
    </div>
  );
}
