// src/components/layout/LayoutWrapper.tsx
"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

// Routes that should NOT show navbar/footer
const HIDE_LAYOUT_ROUTES = ["/dashboard", "/admin"];

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Check if current path should hide layout (supports nested routes)
  const shouldHideLayout = HIDE_LAYOUT_ROUTES.some((route) => {
    if (!pathname) return false;
    return pathname === route || pathname.startsWith(`${route}/`);
  });

  // Hide layout for dashboard/admin routes
  if (shouldHideLayout) {
    return <>{children}</>;
  }

  // Show layout with navbar and footer for everything else
  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1} className="focus:outline-none">
        {children}
      </main>
      <Footer />
    </>
  );
}