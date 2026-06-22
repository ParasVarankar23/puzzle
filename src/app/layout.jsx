import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Puzzle Game",
  description:
    "A modern sliding puzzle game built with Next.js and Tailwind CSS. Arrange the numbers in order and beat your best score!",
  keywords: [
    "Puzzle Game",
    "Sliding Puzzle",
    "Next.js",
    "React",
    "Tailwind CSS",
    "Game",
  ],
  authors: [
    {
      name: "Paras Varankar",
    },
  ],
  creator: "Paras Varankar",
  applicationName: "Puzzle Game",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen bg-gray-100 text-gray-900">
        {children}
      </body>
    </html>
  );
}