module.exports = {
  apps: [
    {
      script: './server_build/server/api.js',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
}
