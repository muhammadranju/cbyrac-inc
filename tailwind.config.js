/** @type {import('tailwindcss').Config} */
const config = {
  theme: {
    extend: {
      colors: {
        gray50: "#f9fafb",
        gray100: "#f3f4f6",
        gray200: "#e5e7eb",
        gray300: "#d1d5db",
        gray400: "#9ca3af",
        gray500: "#6b7280",
        gray600: "#4b5563",
        gray700: "#374151",
        gray800: "#1f2937",
        gray900: "#111827",

        // Red
        red50: "#fef2f2",
        red100: "#fee2e2",
        red200: "#fecaca",
        red300: "#fca5a5",
        red400: "#f87171",
        red500: "#ef4444",
        red600: "#dc2626",
        red700: "#b91c1c",
        red800: "#991b1b",
        red900: "#7f1d1d",

        // Yellow
        yellow50: "#fffbeb",
        yellow100: "#fef3c7",
        yellow200: "#fde68a",
        yellow300: "#fcd34d",
        yellow400: "#fbbf24",
        yellow500: "#f59e0b",
        yellow600: "#d97706",
        yellow700: "#b45309",
        yellow800: "#92400e",
        yellow900: "#78350f",

        // Green
        green50: "#f0fdf4",
        green100: "#dcfce7",
        green200: "#bbf7d0",
        green300: "#86efac",
        green400: "#4ade80",
        green500: "#22c55e",
        green600: "#16a34a",
        green700: "#15803d",
        green800: "#166534",
        green900: "#14532d",

        // Blue
        blue50: "#eff6ff",
        blue100: "#dbeafe",
        blue200: "#bfdbfe",
        blue300: "#93c5fd",
        blue400: "#60a5fa",
        blue500: "#3b82f6",
        blue600: "#2563eb",
        blue700: "#1d4ed8",
        blue800: "#1e40af",
        blue900: "#1e3a8a",

        // Indigo
        indigo50: "#eef2ff",
        indigo100: "#e0e7ff",
        indigo200: "#c7d2fe",
        indigo300: "#a5b4fc",
        indigo400: "#818cf8",
        indigo500: "#6366f1",
        indigo600: "#4f46e5",
        indigo700: "#4338ca",
        indigo800: "#3730a3",
        indigo900: "#312e81",

        // Purple
        purple50: "#f5f3ff",
        purple100: "#ede9fe",
        purple200: "#ddd6fe",
        purple300: "#c4b5fd",
        purple400: "#a78bfa",
        purple500: "#8b5cf6",
        purple600: "#7c3aed",
        purple700: "#6d28d9",
        purple800: "#5b21b6",
        purple900: "#4c1d95",

        // Pink
        pink50: "#fdf2f8",
        pink100: "#fce7f3",
        pink200: "#fbcfe8",
        pink300: "#f9a8d4",
        pink400: "#f472b6",
        pink500: "#ec4899",
        pink600: "#db2777",
        pink700: "#be185d",
        pink800: "#9d174d",
        pink900: "#831843",
      },
    },
  },
  corePlugins: {},
  plugins: [],
  experimental: {
    optimizeUniversalDefaults: true,
  },
  future: {
    colorFormat: "hex",
    disableExperimentalColorSpaces: true,
  },
};

export default config;
