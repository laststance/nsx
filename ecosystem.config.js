module.exports = {
  apps: [
    {
      script: './server_build/server.js',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
}
