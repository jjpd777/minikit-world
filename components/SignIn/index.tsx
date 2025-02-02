
"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export const SignIn = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (session) {
    return (
      <div className="flex flex-col items-center gap-2">
        <div>Signed in as {session.user?.name}</div>
        <button 
          onClick={() => signOut()}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn("worldcoin")}
      className="px-4 py-2 bg-blue-500 text-white rounded"
    >
      Sign in with World ID
    </button>
  );
};
