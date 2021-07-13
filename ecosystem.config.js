module.exports = {
  apps: [
    {
      name: 'api',
      script: './server_build/server/api.js',
      env: {
        NODE_ENV: 'production',
      },
    },
    { name: 'static', script: './server_build/server/static.js' },
    { name: 'reverseProxy', script: './server_build/server/reverseProxy.js' },
  ],
}
