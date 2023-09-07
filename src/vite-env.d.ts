/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_DESCRIPTION: string
  readonly VITE_API_ENDPOINT: string
  readonly VITE_SENTRY_DNS: string
  readonly VITE_GA_MEASUREMENT_ID: string
  readonly VITE_GTAG: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
