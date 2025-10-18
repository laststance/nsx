import { defineConfig } from 'wxt';

// https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  srcDir: 'src',
  outDir: '.output',
  
  manifest: {
    name: 'Reading List',
    description: 'ReadingList Browser Extension',
    permissions: ['activeTab', 'storage', 'tabs'],
    host_permissions: ['<all_urls>'],
    
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
});
