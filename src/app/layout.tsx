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
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0F4C5C",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://tefetro.studio"),

  title: {
    default: "Tefetro Studio | Buy House Plans Online in Kenya",
    template: "%s | Tefetro Studio",
  },

  description:
    "Buy ready-made architectural house plans online in Kenya. Get BOQ estimates, interior design, landscaping, custom drawings and professional construction support from Tefetro Studio.",

  keywords: [
    "Tefetro Studio",
    "Tefetro Studios",
    "tefetro.studio",
    "house plans Kenya",
    "buy house plans online",
    "architectural drawings Kenya",
    "ready made house plans Kenya",
    "modern house plans Kenya",
    "BOQ Kenya",
    "interior design Kenya",
    "landscaping Kenya",
    "construction drawings Kenya",
    "architect Noel Syambi",
    "Nicholas Wafula Wamalwa",
    "NCA compliant plans",
    "custom house plans Kenya",
    "affordable house plans Kenya",
  ],

  applicationName: "Tefetro Studio",
  creator: "Tefetro Studio",
  publisher: "Tefetro Studio",
  category: "Architecture",

  alternates: {
    canonical: "https://tefetro.studio",
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  verification: {
    google: "PASTE_YOUR_GOOGLE_SEARCH_CONSOLE_CODE_HERE",
  },

  icons: {
    icon: [
      { url: "/favicon/favicon.ico" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/favicon/apple-touch-icon.png", sizes: "180x180" },
    ],
    shortcut: ["/favicon/favicon.ico"],
  },

  manifest: "/favicon/site.webmanifest",

  openGraph: {
    type: "website",
    url: "https://tefetro.studio",
    siteName: "Tefetro Studio",
    title: "Tefetro Studio | Buy House Plans Online in Kenya",
    description:
      "Ready-made architectural plans, BOQ estimates, interiors, landscaping and custom design services.",
    locale: "en_KE",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Tefetro Studio",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Tefetro Studio | House Plans Kenya",
    description:
      "Buy house plans online in Kenya. Architectural drawings, BOQ, interiors and custom design.",
    images: ["/og-image.png"],
  },

  authors: [
    { name: "Noel Syambi", url: "https://tefetro.studio" },
    { name: "Nicholas Wafula Wamalwa" },
  ],
};

// SEO Structured Data
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Tefetro Studio",
  alternateName: "Tefetro Studios",
  url: "https://tefetro.studio",
  logo: "https://tefetro.studio/favicon/android-chrome-512x512.png",

  founders: [
    { "@type": "Person", name: "Noel Syambi" },
    { "@type": "Person", name: "Nicholas Wafula Wamalwa" },
  ],

  sameAs: [
    "https://instagram.com/tefetrostudios",
    "https://linkedin.com/company/tefetro-studio",
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
    <html lang="en" className={montserrat.variable} suppressHydrationWarning>
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
        <AuthProvider>
          <InteractiveBackground />

          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-teal-500 focus:text-white focus:rounded-lg"
          >
            Skip to main content
          </a>

          <LayoutWrapper>
            <main
              id="main-content"
              role="main"
              className="relative z-10 flex-1 flex flex-col"
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