module.exports = {
  apps: [
    {
      name: 'server',
      script: './server_build/server.ts',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
}
