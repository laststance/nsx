import path from 'node:path'

import { inspectorServer } from '@react-dev-inspector/vite-plugin'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import EnvironmentPlugin from 'vite-plugin-environment'

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    exclude: [],
  },
  build: {
    minify: 'esbuild',
    outDir: 'build',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: [
            '@sentry/react',
            'react-hook-form',
            'react-helmet',
            'redux-persist',
            'react-markdown',
            'rehype-raw',
            'remark-breaks',
            'remark-gfm',
            'react-spinners',
          ], // put react and react-dom into a 'vendor' chunk
        },
      },
    },
    sourcemap: true,
  },
  plugins: [
    inspectorServer(),
    react({
      babel: {
        plugins: ['@react-dev-inspector/babel-plugin'],
      },
    }),
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
    port: 3010,
    proxy: {
      '/api': {
        changeOrigin: true,
        target: 'http://localhost:4000',
      },
    },
  },
  preview: {
    host: true,
    port: 3010,
    proxy: {
      '/api': {
        changeOrigin: true,
        target: 'http://localhost:4000',
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
})
