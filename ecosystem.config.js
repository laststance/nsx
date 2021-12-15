module.exports = {
  apps: [
    {
      name: 'server',
      script: 'server_build/server/index.js',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
}
