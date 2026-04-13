// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

import { LayoutWrapper } from "@/components/layout/LayoutWrapper";
import InteractiveBackground from "@/components/InteractiveBackground";
import AuthProvider from "@/components/providers/AuthProvider";

import { cn } from "@/lib/utils";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const viewport: Viewport = {
  themeColor: "#0F4C5C",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: "Tefetro Studios | Buy Ready-Made House Plans Online",
    template: "%s | Tefetro Studios",
  },
  description:
    "Purchase complete architectural drawings instantly. Get BOQ cost estimates, interior design, and landscaping. Licensed Kenyan architects. NCA compliant plans. Founded by Noel Syambi and Nicholas Wafula Walwa.",
  keywords: [
    "architectural plans",
    "house plans Kenya",
    "construction services Africa",
    "building plans",
    "residential architecture",
    "BOQ Kenya",
    "Tefetro Studios",
    "Noel Syambi",
    "Nicholas Wafula Wamalwa",
    "buy house plans online",
    "affordable architectural designs",
    "architectural drawings",
    "Interior design Kenya",
    "landscaping design Kenya",
    "licensed architects Kenya",
    "NCA compliant plans",
    "ready-made house plans",
    "custom architectural plans",
    "architectural design services",
    "construction project management",
    "architectural consultation",
    "sustainable architecture Kenya",
    "modern house plans Kenya",
    "traditional house plans Kenya",
    "contemporary house plans Kenya",
    "affordable house plans Kenya",
    "premium architectural plans Kenya",
    "architectural plans for sale Kenya",
    "house plan packages Kenya",
    "architectural design packages Kenya",
    "architectural services Kenya",
    "construction plans",
  ],
  authors: [
    { name: "Noel Syambi", url: "https://tefetro.studio" },
    { name: "Nicholas Wafula Wamalwa" },
  ],
  creator: "Tefetro Studios",
  publisher: "Tefetro Limited",
  metadataBase: new URL("https://tefetro.studio"),
  alternates: { canonical: "/" },

  openGraph: {
    type: "website",
    locale: "en_KE",
    url: "https://tefetro.studio",
    siteName: "Tefetro Studios",
    title: "Tefetro Studios | Buy Ready-Made House Plans Online",
    description:
      "Purchase complete architectural drawings instantly. Licensed Kenyan architects. NCA compliant.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Tefetro Studios - Architectural Plans & Construction",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Tefetro Studios | Build Your Dream Home",
    description:
      "Purchase complete architectural drawings instantly. Licensed Kenyan architects.",
    images: ["/og-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

// 🔥 STRUCTURED DATA (UPDATED WITH CO-FOUNDER)
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Tefetro Studios",
  url: "https://tefetro.studio",
  logo: "https://tefetro.studio/logo.svg",

  sameAs: [
    "https://linkedin.com/company/tefetro-studios",
    "https://instagram.com/tefetrostudios",
  ],

  founder: [
    {
      "@type": "Person",
      name: "Noel Syambi",
    },
    {
      "@type": "Person",
      name: "Nicholas Wafula Wamalwa",
    },
  ],

  address: {
    "@type": "PostalAddress",
    addressCountry: "KE",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={montserrat.variable}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </head>

      <body
        className={cn(
          montserrat.className,
          "antialiased min-h-screen relative"
        )}
      >
        {/* 🔥 GLOBAL AUTH WRAPPER */}
        <AuthProvider>

          {/* Background */}
          <InteractiveBackground />

          {/* Accessibility */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-teal-500 focus:text-white focus:rounded-lg focus:font-semibold focus:shadow-lg"
          >
            Skip to main content
          </a>

          {/* 🔥 LAYOUT WRAPPER - Handles conditional Navbar/Footer */}
          <LayoutWrapper>
            {/* Main */}
            <main
              id="main-content"
              className="relative z-10 flex-1 flex flex-col"
              role="main"
            >
              <div className="content-layer flex-1 flex flex-col">
                {children}
              </div>
            </main>
          </LayoutWrapper>

        </AuthProvider>
      </body>
    </html>
  );
}