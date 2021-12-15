import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,
  },
  server: {
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: false,
        rewrite: (path) => path,
      },
    },
  },
})
