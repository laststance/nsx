module.exports = {
  apps: [
    {
      env: {
        NODE_ENV: 'production',
      },
      name: 'server',
      script: 'server_build/server/index.js',
    },
  ],
}
