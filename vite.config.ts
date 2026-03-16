import path from 'node:path'

import react from '@vitejs/plugin-react'
import { codeInspectorPlugin } from 'code-inspector-plugin'
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
        manualChunks(id) {
          const vendorPackages = [
            '@sentry/react',
            'react-hook-form',
            'react-helmet',
            'redux-persist',
            'react-markdown',
            'rehype-raw',
            'remark-breaks',
            'remark-gfm',
            'react-spinners',
          ]
          if (
            vendorPackages.some((pkg) => id.includes(`node_modules/${pkg}`))
          ) {
            return 'vendor'
          }
        },
      },
    },
    sourcemap: true,
  },
  plugins: [
    codeInspectorPlugin({
      bundler: 'vite',
      hotKeys: ['altKey'], // Alt key only to trigger inspector
      showSwitch: false,
    }),
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
