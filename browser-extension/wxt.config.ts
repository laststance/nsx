import { defineConfig } from 'wxt'

// https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  srcDir: 'src',
  outDir: '.output',

  manifest: {
    name: 'Reading List',
    description: 'ReadingList Browser Extension',
    permissions: ['activeTab', 'storage', 'tabs'],
    // Scoped to the NSX API origins only (E15). The current tab's URL/title comes from the
    // `activeTab`/`tabs` permissions, so cross-origin access to arbitrary sites is not needed.
    host_permissions: ['http://localhost:4000/*', 'https://nsx.malloc.tokyo/*'],

    // Browser-specific manifest configuration
    action: {
      default_popup: 'popup.html',
      default_icon: {
        '16': 'images/logo.png',
        '48': 'images/logo.png',
        '128': 'images/logo.png',
      },
    },

    icons: {
      '16': 'images/logo.png',
      '48': 'images/logo.png',
      '128': 'images/logo.png',
    },
  },
})
