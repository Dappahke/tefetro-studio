/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      /* =========================
         FONTS
      ========================= */
      fontFamily: {
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
        display: ["var(--font-manrope)", "system-ui", "sans-serif"],
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
      },

      /* =========================
         COLORS — Blueprint First
      ========================= */
      colors: {
        /* ─── Blueprint (Primary Anchor) ─── */
        blueprint: {
          50: "#eaf3fb",
          100: "#d4e7f7",
          200: "#a9cfef",
          300: "#7eb7e7",
          400: "#539fdf",
          500: "#1f4e79", // core blueprint
          600: "#1a4266",
          700: "#14354d",
          800: "#0f2839",
          900: "#091b26",
        },

        /* ─── Deep Teal (Structural) ─── */
        deep: {
          DEFAULT: "#094453",
          50: "#F2F7F8",
          100: "#E6EFF1",
          200: "#C4DDE2",
          300: "#9FC7CE",
          400: "#6FA7B1",
          500: "#094453",
          600: "#073642",
          700: "#052A33",
          800: "#042028",
          900: "#030f12",
        },

        /* ─── Sage (Subtle Support) ─── */
        sage: {
          DEFAULT: "#6FAA99",
          50: "#F6FAF8",
          100: "#EDF5F2",
          200: "#D8EAE3",
          300: "#BBD8CD",
          400: "#6FAA99",
          500: "#5A8F7F",
          600: "#477366",
          700: "#3A5D53",
        },

        /* ─── Mist (Soft Background Accent) ─── */
        mist: {
          DEFAULT: "#ACCEBA",
          50: "#FAFDFC",
          100: "#F2F8F5",
          200: "#E4F0EA",
          300: "#D2E6DC",
          400: "#ACCEBA",
          500: "#8BB89D",
          600: "#6A9A7D",
          700: "#547B64",
        },

        /* ─── Canvas (Background System) ─── */
        canvas: {
          DEFAULT: "#FCF8F2",
          50: "#fefdfb",
          100: "#FCF8F2",
          200: "#fbf5ed",
          300: "#f9f0e4",
          400: "#f5efe6",
          500: "#e8dfd1",
        },

        /* ─── Accent (Orange — Controlled, Rare) ─── */
        accent: {
          DEFAULT: "#f28c00",
          50: "#fff4e6",
          100: "#ffe9cc",
          200: "#FCE2B3",
          300: "#F9C87A",
          400: "#ff9933",
          500: "#f28c00", // main accent
          600: "#d97a00",
          700: "#B56B10",
        },

        /* ─── Neutrals ─── */
        neutral: {
          50: "#FFFFFF",
          100: "#F9F9F9",
          200: "#F1F1F1",
          300: "#E4E4E4",
          400: "#CFCFCF",
          500: "#9F9F9F",
          600: "#6F6F6F",
          700: "#3F3F3F",
          800: "#2A2A2A",
          900: "#1A1A1A",
        },

        /* ─── Alert ─── */
        alert: {
          DEFAULT: "#E53937",
          50: "#FEF2F2",
          100: "#FEE2E2",
          200: "#FECACA",
          300: "#FCA5A5",
          400: "#F87171",
          500: "#E53937",
          600: "#DC2626",
          700: "#B91C1C",
        },

        /* ─── Legacy mappings (for gradual migration) ─── */
        tefetro: {
          DEFAULT: "#EF961C",
          50: "#FFFBF3",
          100: "#FEF3DD",
          200: "#FCE2B3",
          300: "#F9C87A",
          400: "#EF961C",
          500: "#D88414",
          600: "#B56B10",
          700: "#8F520D",
        },
      },

      /* =========================
         SHADOW SYSTEM
      ========================= */
      boxShadow: {
        soft: "0 4px 20px rgba(0,0,0,0.05)",
        medium: "0 8px 30px rgba(0,0,0,0.08)",
        glass: "0 4px 30px rgba(9, 68, 83, 0.08)",
        "glass-lg": "0 8px 40px rgba(9, 68, 83, 0.12)",
        accent: "0 10px 30px -10px rgba(239, 150, 28, 0.35)",
        // Architectural shadows
        arch: "0 1px 3px rgba(9, 27, 38, 0.04), 0 8px 24px rgba(9, 27, 38, 0.03)",
        "arch-lg": "0 4px 6px rgba(9, 27, 38, 0.02), 0 16px 48px rgba(9, 27, 38, 0.06)",
        "arch-xl": "0 8px 16px rgba(9, 27, 38, 0.04), 0 32px 64px rgba(9, 27, 38, 0.08)",
      },

      /* =========================
         BORDER RADIUS
      ========================= */
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
        "3xl": "24px",
      },

      /* =========================
         TRANSITIONS
      ========================= */
      transitionDuration: {
        250: "250ms",
      },
      transitionTimingFunction: {
        arch: "cubic-bezier(0.4, 0, 0.2, 1)",
      },

      /* =========================
         TYPOGRAPHY SCALE
      ========================= */
      fontSize: {
        "display-xl": [
          "clamp(3rem, 6vw, 5rem)",
          { lineHeight: "1.05", letterSpacing: "-0.03em", fontWeight: "700" },
        ],
        display: [
          "clamp(2.5rem, 5vw, 4rem)",
          { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" },
        ],
        h1: [
          "clamp(2rem, 4vw, 3rem)",
          { lineHeight: "1.15", letterSpacing: "-0.02em", fontWeight: "600" },
        ],
        h2: [
          "clamp(1.5rem, 3vw, 2.25rem)",
          { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "600" },
        ],
        h3: [
          "clamp(1.25rem, 2vw, 1.75rem)",
          { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "600" },
        ],
        h4: [
          "1.125rem",
          { lineHeight: "1.4", letterSpacing: "-0.01em", fontWeight: "600" },
        ],
        "body-lg": [
          "1.125rem",
          { lineHeight: "1.7", letterSpacing: "-0.01em", fontWeight: "400" },
        ],
        body: [
          "1rem",
          { lineHeight: "1.6", letterSpacing: "-0.01em", fontWeight: "400" },
        ],
        "body-sm": [
          "0.875rem",
          { lineHeight: "1.5", letterSpacing: "0em", fontWeight: "400" },
        ],
        caption: [
          "0.75rem",
          { lineHeight: "1.4", letterSpacing: "0.02em", fontWeight: "500" },
        ],
      },
    },
  },
  plugins: [],
};