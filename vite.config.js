// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: true,
    open: true,
  },
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
        },
      },
    },
  },
});