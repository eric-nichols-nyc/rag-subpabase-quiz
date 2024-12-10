import type { Metadata } from "next";
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import { Header } from "@/components/header"

import "./globals.css";
import { ClerkProvider, SignInButton, SignedOut, SignedIn } from "@clerk/nextjs";
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AI RAG Quiz Generator",
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
            <div className="flex min-h-screen flex-col items-center justify-center">
              <SignInButton />
            </div>
          </SignedOut>
          <SignedIn>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1 container mx-auto p-6">
                {children}
              </main>
            </div>
          </SignedIn>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
