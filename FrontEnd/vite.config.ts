import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker';

export default defineConfig({
  plugins: [
    react(),
    checker({
      typescript: true,
      eslint: {
        lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
      },
      overlay: true,
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
  base: process.env.VITE_APP_BASE_URL ? new URL('/', process.env.VITE_APP_BASE_URL).pathname : '/',
  build: {
    target: 'esnext', // Modern JS target (avoids strict mode reserved word quirks on exports/let)
  },
});