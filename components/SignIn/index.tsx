"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { VoiceRecorder } from "../VoiceRecorder";

export const SignIn = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (session) {
    return (
      <div className="flex flex-col items-center gap-4 p-6 bg-gray-800 rounded-lg">
        <h2 className="text-xl font-bold">User Information</h2>
        <div className="space-y-2 text-center">
          <p>Name: {session.user?.name}</p>
          {session.user?.verificationLevel && (
            <p>Verification Level: {session.user.verificationLevel}</p>
          )}
          <p>ID: {session.user?.id}</p>
          <VoiceRecorder />
        </div>
        <button 
          onClick={() => signOut()}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn("worldcoin")}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Sign in with World ID
    </button>
  );
};