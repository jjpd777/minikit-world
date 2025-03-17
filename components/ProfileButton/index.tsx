"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function ProfileButton() {
  const { data: session } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={() => router.push("/wallet")}
      className="fixed top-4 left-4 p-2 rounded-full bg-purple-500/30 hover:bg-purple-500/50 transition-all"
      aria-label="Profile"
    >
      {session?.user ? (
        <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
          {session.user.name?.charAt(0) || "U"}
        </div>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )}
    </button>
  );
}