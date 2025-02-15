import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MiniKitProvider from "@/components/minikit-provider";
import dynamic from "next/dynamic";
import NextAuthProvider from "@/components/next-auth-provider";
import { AudioPlayer } from "@/components/AudioPlayer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bendiga App",
  description: "Generate daily prayers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const ErudaProvider = dynamic(
    () => import("../components/Eruda").then((c) => c.ErudaProvider),
    {
      ssr: false,
    },
  );
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthProvider>
          <MiniKitProvider>
            {children}
            <AudioPlayer />
          </MiniKitProvider>
          <ErudaProvider />
        </NextAuthProvider>
      </body>
    </html>
  );
}
