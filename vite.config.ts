import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import EnvironmentPlugin from 'vite-plugin-environment'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    EnvironmentPlugin([
      'VITE_API_ENDPOINT',
      'VITE_ENABLE_LOGIN',
      'VITE_ENABLE_SIGNUP',
    ]),
  ],
  build: {
    sourcemap: true,
    outDir: 'build',
  },
  server: {
    open: true,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
})
