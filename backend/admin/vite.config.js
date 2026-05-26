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

/*last stable
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  //base: '/admin/',   // 👈 Important: set base path for admin assets
  base: '/',   // 👈 Important: set base path for admin assets
  server: {
    port: 5005,
    proxy: {
      '/api': 'http://localhost:5000'   // dev proxy only
    }
  },
  build: {
    outDir: '../dist/admin',   // builds into backend/dist/admin
    emptyOutDir: true
  }
})*/


/*import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  //base: '/admin/',
  base: '/', // 🔥 IMPORTANT: change this
  server: {
  port: 5005,
  proxy: {
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true
    }
  }
},
  build: {
    outDir: '../dist/admin',
    emptyOutDir: true,
  }
})*/
