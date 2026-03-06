import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "m0x6a | CLI-inspired portfolio",
    template: "%s | m0x6a",
  },
  description:
    "Portfolio and Git-backed Markdown blog for Mattias Jonsson (m0x6a).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
