import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import EnvironmentPlugin from 'vite-plugin-environment'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    minify: 'terser',
    outDir: 'build',
    sourcemap: true,
  },
  plugins: [
    react(),
    EnvironmentPlugin([
      'VITE_APP_TITLE',
      'VITE_APP_DESCRIPTION',
      'VITE_API_ENDPOINT',
      'VITE_SENTRY_DNS',
      'VITE_GA_MEASUREMENT_ID',
    ]),
  ],
  publicDir: 'public',
  server: {
    host: true,
    port: 3000,
    proxy: {
      '/api': {
        changeOrigin: true,
        target: 'http://localhost:4000',
      },
    },
  },
})
