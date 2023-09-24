module.exports = {
  apps: [
    {
      name: 'server',
      env: {
        NODE_ENV: 'production',
      },
      script: 'server_build/server/index.js',
    },
  ],
}
