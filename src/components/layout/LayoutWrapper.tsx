// src/components/layout/LayoutWrapper.tsx
"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

// Routes that should NOT show Navbar and Footer (they have their own nav)
const HIDE_LAYOUT_ROUTES = ["/dashboard", "/admin"];

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Check if current route should hide layout
  const shouldHideLayout = HIDE_LAYOUT_ROUTES.some((route) =>
    pathname?.startsWith(route)
  );

  if (shouldHideLayout) {
    // Dashboard/Admin pages render without Navbar/Footer
    // Just return the children (main content)
    return <>{children}</>;
  }

  // Regular pages render with full layout
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}