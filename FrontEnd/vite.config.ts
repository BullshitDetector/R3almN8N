import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker'; // New: TS/ESLint checker

export default defineConfig({
  plugins: [
    react(),
    checker({
      typescript: true, // TS type-checking
      eslint: {
        lintCommand: 'eslint "./src/**/*.{ts,tsx}"', // Custom ESLint for src only
      },
      overlay: true, // Browser overlay for errors (dev only)
    }),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  base: process.env.VITE_APP_BASE_URL ? new URL('/', process.env.VITE_APP_BASE_URL).pathname : '/', // Handles /aiflow/ if needed
});