import type { Metadata } from "next";
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"

import "./globals.css";
import { ClerkProvider, SignInButton, SignedOut } from "@clerk/nextjs";
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AI Quiz Generator",
  description: "Generate quizzes based on your saved documents",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
      <body className={inter.className}>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          {children}
          <Toaster />

        </body>
      </html>
    </ClerkProvider>
  );
}
