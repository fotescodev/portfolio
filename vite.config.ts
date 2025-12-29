import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import yaml from '@rollup/plugin-yaml'
import { imagetools } from 'vite-imagetools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    yaml(),
    imagetools(),
    // Serve static directories from public/ correctly in dev
    {
      name: 'static-directory-middleware',
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          // Redirect /cv-dashboard or /cv-dashboard/ to /cv-dashboard/index.html
          if (req.url === '/cv-dashboard' || req.url === '/cv-dashboard/') {
            req.url = '/cv-dashboard/index.html';
          }
          next();
        });
      }
    }
  ],
  base: '/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-markdown': ['react-markdown', 'react-syntax-highlighter', 'remark-gfm'],
          'vendor-motion': ['framer-motion'],
        }
      }
    }
  }
})
