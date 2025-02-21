import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MiniKitProvider from "@/components/minikit-provider";
import NextAuthProvider from "@/components/next-auth-provider";
import { AudioPlayer } from "@/components/AudioPlayer";
import { ProfileButton } from '@/components/ProfileButton';
import { ErudaProvider } from "@/components/Eruda"; // Fix import path to match project structure

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
  return (
    <html lang="en">
      <body className={inter.className}>
        <ProfileButton />
        <NextAuthProvider>
          <MiniKitProvider>
            {children}
            <AudioPlayer />
          </MiniKitProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}