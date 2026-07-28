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
    icon: [{ url: "/futsal-buddy-logo.png", rel: "icon", type: "image/png" }],
    shortcut: "/futsal-buddy-logo.png",
    apple: "/futsal-buddy-logo.png",
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
      <head>
        <link rel="icon" href="/futsal-buddy-logo.png" type="image/png" />
        <link rel="shortcut icon" href="/futsal-buddy-logo.png" />
        <link rel="apple-touch-icon" href="/futsal-buddy-logo.png" />
      </head>
      <body className="min-h-screen bg-gray-50">{children}</body>
    </html>
  );
}
