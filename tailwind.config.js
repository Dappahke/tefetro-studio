/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* =========================
           PRIMARY ACTION (CONTROLLED ORANGE)
        ========================= */
        tefetra: {
          DEFAULT: "#EF961C",
          50: "#FFFBF3",
          100: "#FEF3DD",
          200: "#FCE2B3",
          300: "#F9C87A",
          400: "#EF961C", // main CTA
          500: "#D88414",
          600: "#B56B10",
          700: "#8F520D",
        },

        /* =========================
           BRAND IDENTITY (DEEP TEAL)
        ========================= */
        deep: {
          DEFAULT: "#094453",
          50: "#F2F7F8",
          100: "#E6EFF1",
          200: "#C4DDE2",
          300: "#9FC7CE",
          400: "#6FA7B1",
          500: "#094453", // main identity
          600: "#073642",
          700: "#052A33",
        },

        /* =========================
           SAGE (SUBTLE SUPPORT)
        ========================= */
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

        /* =========================
           MIST (SOFT BACKGROUND ACCENT)
        ========================= */
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

        /* =========================
           CANVAS (PRIMARY BACKGROUND SYSTEM)
        ========================= */
        canvas: {
          DEFAULT: "#FCF8F2", // main background
          50: "#FFFDFA",
          100: "#FCF8F2",
          200: "#F5EFE6",
          300: "#EBE0D1",
          400: "#DECBB6",
        },

        /* =========================
           NEUTRALS (CRITICAL FOR PREMIUM FEEL)
        ========================= */
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

        /* =========================
           ALERT SYSTEM
        ========================= */
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
      },

      /* =========================
         SHADOW SYSTEM (SOFT, ARCHITECTURAL)
      ========================= */
      boxShadow: {
        soft: "0 4px 20px rgba(0,0,0,0.05)",
        medium: "0 8px 30px rgba(0,0,0,0.08)",
        glass: "0 4px 30px rgba(9, 68, 83, 0.08)",
        "glass-lg": "0 8px 40px rgba(9, 68, 83, 0.12)",
        accent: "0 10px 30px -10px rgba(239, 150, 28, 0.35)",
      },

      /* =========================
         BORDER RADIUS (SOFT UI)
      ========================= */
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
        "3xl": "24px",
      },
    },
  },
  plugins: [],
};