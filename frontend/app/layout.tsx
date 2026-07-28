import type { Metadata } from "next";
import { Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Futsal Buddy",
    template: "%s | Futsal Buddy",
  },
  description: "Collegiate futsal league management platform.",
  icons: {
    icon: "/futsal-buddy-logo.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#15803d",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">{children}</body>
    </html>
  );
}
