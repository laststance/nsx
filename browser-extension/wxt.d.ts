/// <reference types="wxt/client" />
/// <reference types="webextension-polyfill" />

declare global {
  // WXT framework global types
  const browser: typeof import('webextension-polyfill').browser

  // WXT entrypoint functions
  function defineBackground(main: () => void | Promise<void>): {
    main: () => void | Promise<void>
  }

  function defineContentScript(config: {
    matches: string[]
    main: () => void | Promise<void>
    runAt?: 'document_start' | 'document_end' | 'document_idle'
  }): any
}

export {}
