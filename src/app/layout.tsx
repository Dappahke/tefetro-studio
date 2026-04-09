// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
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
    default: "Tefetro Studios | Architectural Plans & Construction Services",
    template: "%s | Tefetro Studios",
  },
  description:
    "Tefetro Studios is Africa's leading PropTech platform for architectural drawings, construction services, and building solutions. Founded by Noel Syambi and Nicholas Wafula Walwa.",
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
  ],
  authors: [
    { name: "Noel Syambi", url: "https://tefetro.studio" },
    { name: "Nicholas Wafula Wamalwa" },
  ],
  creator: "Noel Syambi",
  publisher: "Tefetro Limited",
  metadataBase: new URL("https://tefetro.studio"),
  alternates: { canonical: "/" },

  openGraph: {
    type: "website",
    locale: "en_KE",
    url: "https://tefetro.studio",
    siteName: "Tefetro Studios",
    title: "Tefetro Studios | Build Your Dream Home",
    description:
      "Premium architectural plans and construction services in Kenya and across Africa.",
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
      "Premium architectural plans and construction services.",
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
};

// 🔥 STRUCTURED DATA (UPDATED WITH CO-FOUNDER)
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Tefetra Studios",
  url: "https://tefetra.studio",
  logo: "https://tefetra.studio/logo.svg",

  sameAs: [
    "https://linkedin.com/company/tefetra-studios",
    "https://instagram.com/tefetrastudios",
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

          {/* Navbar */}
          <Navbar />

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

          {/* Footer */}
          <Footer />

        </AuthProvider>
      </body>
    </html>
  );
}