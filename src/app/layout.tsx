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
          <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
            <SignedOut>
              <div className="flex min-h-screen flex-col items-center justify-center p-4">
                <div className="w-full max-w-md space-y-8 bg-white/80 dark:bg-gray-800/80 p-8 rounded-lg shadow-lg backdrop-blur-sm">
                  <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
                    Welcome to {siteConfig.name}
                  </h1>
                  <p className="text-center text-gray-600 dark:text-gray-300">
                    Please sign in to continue
                  </p>
                  <div className="flex justify-center">
                    <SignInButton />
                  </div>
                </div>
              </div>
            </SignedOut>
            <SignedIn>
              <div className="flex flex-col">
                <Header />
                <main className="flex-1 container mx-auto p-6">
                  <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg shadow-lg backdrop-blur-sm p-6">
                    {children}
                  </div>
                </main>
              </div>
            </SignedIn>
          </div>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
