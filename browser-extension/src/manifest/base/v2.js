const { name, short_name, description } = require('../app_info')
const permissions = require('../permissions')
const { version } = require('../version.json')

module.exports = {
  background: {
    scripts: ['background.js'],
  },
  browser_action: {
    default_popup: 'assets/html/popup.html',
    default_title: short_name,
  },
  content_scripts: [
    {
      // "css": ["myStyles.css"],
      js: ['content.js'],

      matches: ['<all_urls>'],
    },
  ],
  description,
  icons: {
    128: 'assets/images/logo.png',
  },
  manifest_version: 2,
  name,
  permissions: [...permissions, 'https://*/*'],
  short_name,
  version,
  web_accessible_resources: ['assets/**'],
  // ...(process.env.NODE_ENV === 'development' ? {
  //   content_security_policy: "script-src 'self' 'unsafe-eval'; font-src 'self' data: https://fonts.gstatic.com/s/dmsans; object-src 'self';"
  // } : {})
}
