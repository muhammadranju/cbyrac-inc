import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss(), react()],

  define: {
    "import.meta.env.TAILWIND_COLOR_FUNCTION": JSON.stringify("rgb"),
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          redux: ["react-redux", "@reduxjs/toolkit"],
          router: ["react-router-dom"],
        },
      },
    },
    chunkSizeWarningLimit: 1500, // optional
  },
});
