/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_API_ENDPOINT: string
  readonly VITE_ENABLE_SIGNUP: string
  readonly VITE_ENABLE_LOGIN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
declare type AnyFunction = (...args: any[]) => any
