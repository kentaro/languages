import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeToggle from "@/components/ThemeToggle";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Languages - 効率的な言語学習プラットフォーム",
  description: "効率的に外国語を学ぶためのオンライン学習プラットフォーム。ドイツ語、スペイン語、英語など様々な言語の学習コースを提供しています。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur-sm border-b">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <Link
              href="/"
              className="text-xl font-bold"
            >
              Languages
            </Link>

            <div className="flex items-center gap-4">
              <Link href="/" className="hover:text-primary transition-colors">ホーム</Link>
              <Link href="/about" className="hover:text-primary transition-colors">サイトについて</Link>
              <ThemeToggle />
            </div>
          </div>
        </nav>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
