import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Futsal Buddy – Find Matches & Build Your Reputation",
  description:
    "Join the premier collegiate futsal network. Find competitive games, track your progress, and build your reputation on the pitch.",
  keywords: ["futsal", "collegiate sports", "futsal matches", "sports network"],
  openGraph: {
    title: "Futsal Buddy",
    description: "Master the Court. Own the Pitch.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
