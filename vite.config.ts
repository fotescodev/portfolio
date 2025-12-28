import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import yaml from '@rollup/plugin-yaml'
import { imagetools } from 'vite-imagetools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    yaml(),
    imagetools()
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
