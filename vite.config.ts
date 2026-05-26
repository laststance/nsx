import path from 'node:path'

import { sentryVitePlugin } from '@sentry/vite-plugin'
import react from '@vitejs/plugin-react'
import { codeInspectorPlugin } from 'code-inspector-plugin'
import { defineConfig } from 'vite'
import type { PluginOption } from 'vite'
import EnvironmentPlugin from 'vite-plugin-environment'

/**
 * Checks whether CI has enough Sentry config to upload browser source maps.
 * @returns True when org, project, and auth token are all present.
 * @example hasSentrySourceMapConfig()
 */
const hasSentrySourceMapConfig = (): boolean => {
  return Boolean(
    process.env.SENTRY_AUTH_TOKEN &&
    process.env.SENTRY_ORG &&
    process.env.SENTRY_PROJECT,
  )
}

/**
 * Creates the Sentry Vite plugin only for configured release builds.
 * @returns Sentry plugin array for source map uploads, or undefined locally.
 * @example getSentrySourceMapPlugin()
 */
const getSentrySourceMapPlugin = (): PluginOption | undefined => {
  if (!hasSentrySourceMapConfig()) return undefined

  return sentryVitePlugin({
    authToken: process.env.SENTRY_AUTH_TOKEN,
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
    release: {
      name: process.env.SENTRY_RELEASE || process.env.GITHUB_SHA,
    },
    sourcemaps: {
      assets: './build/**',
    },
  })
}

/**
 * Removes optional plugins that are disabled by missing environment variables.
 * @param pluginOption - Optional Vite plugin entry.
 * @returns True when Vite should receive the plugin entry.
 * @example isEnabledPlugin(react())
 */
const isEnabledPlugin = (
  pluginOption: PluginOption | undefined,
): pluginOption is PluginOption => {
  return Boolean(pluginOption)
}

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
    EnvironmentPlugin({
      VITE_API_ENDPOINT: undefined,
      VITE_APP_DESCRIPTION: undefined,
      VITE_APP_TITLE: undefined,
      VITE_GA_MEASUREMENT_ID: null,
      VITE_SENTRY_DSN: null,
      VITE_SENTRY_DNS: null,
      VITE_SENTRY_RELEASE: null,
    }),
    getSentrySourceMapPlugin(),
  ].filter(isEnabledPlugin),
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
