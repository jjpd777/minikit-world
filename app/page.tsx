
export default function Home() {
  return (
    <main className="min-h-screen flex flex-col p-8 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="absolute top-4 right-4">
        <WalletAuth />
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md flex flex-col items-center">
          <Image
            src="/bendiga_logo.png"
            alt="Bendiga Logo"
            width={300}
            height={300}
            priority
            className="mb-8"
          />
          <SignIn />
        </div>
      </div>
    </main>
  );
}
