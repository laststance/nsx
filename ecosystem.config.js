module.exports = {
  apps: [
    {
      name: 'server',
      script: './server_build/server.js',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
}
