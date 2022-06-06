const { name, short_name, description } = require('../app_info')
const permissions = require('../permissions')
const { version } = require('../version.json')

module.exports = {
  action: {
    default_icon: 'assets/images/logo.png',
    default_popup: 'assets/html/popup.html',
    default_title: name,
  },
  background: {
    service_worker: 'background.js',
  },
  content_scripts: [
    {
      // css: ["styles.css"],
      js: ['content.js'],

      matches: ['<all_urls>'],
    },
  ],
  description,
  host_permissions: ['<all_urls>'],
  icons: {
    128: 'assets/images/logo.png',
  },
  manifest_version: 3,
  name,
  permissions,
  short_name,
  version,
  web_accessible_resources: [
    {
      matches: ['<all_urls>'],
      resources: ['assets/**'],
    },
  ],
}
