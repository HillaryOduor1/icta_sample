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
/*import { defineConfig } from "vite";
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
        "whatwg-fetch"           // adds fetch polyfill
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
        // "window.fetch" removed – not a core-js module
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
        rewrite: (path) => path.replace(/^\/api/, '/api/v1')
      }
    }
  }
});*/



/*
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import legacy from "@vitejs/plugin-legacy";

export default defineConfig({
  plugins: [
    react(),
    legacy({
      targets: [
        "defaults",
          "not IE 11",
          "> 0.5%",
          "last 2 versions",
          "Firefox ESR",
          "Chrome >= 49",
          "Safari >= 10",
          "Edge >= 15",
          "iOS >= 10",
          "Android >= 5",
      ],
      additionalLegacyPolyfills: ["regenerator-runtime/runtime"],
      renderLegacyChunks: true,
      modernPolyfills: true,
    })
  ],
  build: {
    target: "es2015",
    
    //rollupOptions: { external: [] },
  },
  server: {
      host: "0.0.0.0",
      port: 5173,
      strictPort: true,
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
        }
      }
      
    },
});*/

