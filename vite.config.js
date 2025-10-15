import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Add React 19 specific configuration
      jsxRuntime: 'automatic',
    }), 
    tailwindcss()
  ],
  define: {
    // Prevent global process issues
    global: 'globalThis',
  },
  optimizeDeps: {
    // Force pre-bundle problematic packages
    include: ['lottie-react', '@react-pdf/renderer']
  }
});
