import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

// Import background services to auto-start them
import "@/lib/startup";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "KahveYolu - Mystical Coffee Readings",
  description: "Discover your destiny through the ancient art of coffee cup reading. Premium mystical experience for women seeking guidance.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  
  // Only wrap with ClerkProvider if we have a valid publishable key
  if (publishableKey && publishableKey !== 'pk_test_...') {
    return (
      <ClerkProvider publishableKey={publishableKey}>
        <html lang="en">
          <body
            className={`${inter.variable} ${cormorant.variable} antialiased`}
          >
            {children}
          </body>
        </html>
      </ClerkProvider>
    );
  }
  
  // Fallback for build time or missing keys
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${cormorant.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
