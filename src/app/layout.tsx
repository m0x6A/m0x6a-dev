import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { VIEW_INIT_SCRIPT } from "@/lib/view-mode";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

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
    // suppressHydrationWarning: the init script may set data-view before React hydrates.
    <html lang="en" className={jetbrainsMono.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: VIEW_INIT_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
