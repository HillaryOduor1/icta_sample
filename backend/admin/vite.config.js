import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    port: 5005,
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // your backend runs on port 5000
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: '../dist/admin',
    emptyOutDir: true,
        rollupOptions: {
      output: {
        // Add timestamp to chunk names for cache busting
        chunkFileNames: `assets/[name]-[hash]-${Date.now()}.js`,
        entryFileNames: `assets/[name]-[hash]-${Date.now()}.js`,
      }
    }
  },
});
