import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Instrument_Sans, Space_Mono } from "next/font/google";
import { MotionConfig } from "framer-motion";
import "./globals.css";

// Display — characterful, food-editorial. Used with restraint on headings.
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

// Body — clean workhorse, deliberately not Inter.
const body = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

// Mono — the "kitchen ticket / label" texture: timings, quantities, tags.
const mono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});

const SITE_URL = "https://chef-ai-puce-zeta.vercel.app";
const TITLE = "ChefAI — Cook what you already have";
const DESCRIPTION =
  "Snap a photo of your fridge and get a recipe from what's in it. Free on iOS and Android.";

// Deliberately no `manifest` or `appleWebApp`: this site is the marketing
// surface, not the product. Declaring either would make it installable again.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  // Shared links are now the main distribution channel, so previews matter.
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "ChefAI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#1E3A2F",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${display.variable} ${body.variable} ${mono.variable}`}>
        {/* App-wide: when the OS prefers reduced motion, Framer Motion drops
            transform/layout animation but keeps opacity — one place instead
            of a useReducedMotion() check duplicated in every component. */}
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </body>
    </html>
  );
}
