import { defineConfig } from 'vite';

export default defineConfig({
  // Other Vite config options
  optimizeDeps: {
    include: ['three'],
  },
});