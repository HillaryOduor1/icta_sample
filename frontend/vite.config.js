import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import legacy from "@vitejs/plugin-legacy";

export default defineConfig({
  plugins: [
    react(),
    
    legacy({
      targets: [
        "> 0.25%",
        "not dead",
        "IE 11"
      ],
      additionalLegacyPolyfills: [
        "regenerator-runtime/runtime",
        "whatwg-fetch"
      ],
      renderLegacyChunks: true,
      modernPolyfills: true,
      polyfills: [
        "es.promise",
        "es.map",
        "es.set",
        "es.array.includes",
        "es.object.assign",
        "es.symbol"
      ]
    })
  ],
  build: {
    target: "es5",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom']
        }
      }
    }
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api/v1'),
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req) => {
            console.log('Proxying:', req.method, req.url, '→', proxyReq.path);
          });
        }
      }
    }
  }
});
